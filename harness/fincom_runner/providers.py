"""Where a reply comes from.

A provider takes a system prompt and a probe and returns a reply. The runner
does not care how the provider gets it. This is what lets one runner score
lesson content, the Doshi FCP agent, and a third-party assistant used through
its ordinary consumer interface.

Seven providers ship with the runner.

- `dataset` — the reply is already in the dataset `reply` column.
- `replies` — the reply comes from a 2-column CSV a person filled in by hand.
  This is the lane for an assistant with no API.
- `http` — the runner posts the probe to a JSON endpoint. This is the lane for
  the FCP agent and for any assistant behind a service.
- `anthropic` — the runner calls the Anthropic API.
- `openai` — the runner calls the OpenAI API.
- `bedrock` — the runner calls a model on AWS Bedrock.
- `ollama` — the runner calls a model on Ollama Cloud.

A provider that needs a key reads it from the environment. No key is ever
written to a transcript.

`bedrock` and `ollama` are cheap or self-hosted, so the runner repeats each
item 10 times on them and takes the majority verdict by default. `anthropic`
and `openai` are paid frontier keys, so the runner calls them once. See
`REPEATED_PROVIDER_KINDS` above and `RunConfig.repeats` in `runner.py`.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from pathlib import Path

from .dataset import load_replies
from .endpoints import EndpointError, bedrock_chat, ollama_chat
from .models import Item

DEFAULT_TIMEOUT = 120
DEFAULT_MAX_TOKENS = 1024

# `ollama` and `bedrock` are cheap or self-hosted, so the runner repeats each
# item on them and takes the majority verdict — 1 flaky reply does not decide
# a finding. `anthropic` and `openai` are paid frontier keys, so the runner
# calls them once. See `RunConfig.repeats` in `runner.py` and `docs/next-run.md`.
REPEATED_PROVIDER_KINDS = frozenset({"ollama", "bedrock"})
DEFAULT_REPEATS = 10


def provider_kind(spec: str) -> str:
    """The provider kind named in a `kind:argument` spec, lower-cased."""
    return spec.partition(":")[0].strip().lower()


class ProviderError(Exception):
    """The provider could not produce a reply."""


class Reply:
    """A reply from a provider, plus the output tokens it cost."""

    def __init__(self, text: str, output_tokens: int | None = None):
        self.text = text
        self.output_tokens = output_tokens


class Provider:
    """The interface every provider implements."""

    name = "provider"

    def reply_for(self, item: Item) -> Reply:
        raise NotImplementedError


class DatasetProvider(Provider):
    """Grade the reply the dataset already holds."""

    name = "dataset"

    def reply_for(self, item: Item) -> Reply:
        if not item.reply:
            raise ProviderError(
                f"item {item.item_id}: the dataset holds no reply. "
                f"Use a different provider, or pass a dataset with a `reply` column."
            )
        return Reply(item.reply)


class RepliesFileProvider(Provider):
    """Grade replies a person collected from a consumer chat interface."""

    name = "replies"

    def __init__(self, path: Path):
        self.path = path
        self.replies = load_replies(path)

    def reply_for(self, item: Item) -> Reply:
        reply = self.replies.get(item.item_id)
        if reply is None:
            raise ProviderError(f"item {item.item_id}: no reply in {self.path}")
        return Reply(reply)


class HttpProvider(Provider):
    """Post the probe to a JSON endpoint and read the reply back.

    The request body is `{"system": ..., "prompt": ..., "item_id": ...}`.
    The reply is read from the `reply` key, then `text`, then `content`.
    Set `FINCOM_HTTP_AUTH` to send an `Authorization` header.
    """

    name = "http"

    def __init__(self, url: str, timeout: int = DEFAULT_TIMEOUT):
        self.url = url
        self.timeout = timeout

    def reply_for(self, item: Item) -> Reply:
        payload = json.dumps(
            {
                "item_id": item.item_id,
                "system": item.system_prompt,
                "prompt": item.probe,
            }
        ).encode("utf-8")
        request = urllib.request.Request(
            self.url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        token = os.environ.get("FINCOM_HTTP_AUTH")
        if token:
            request.add_header("Authorization", token)
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                body = json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, json.JSONDecodeError, TimeoutError) as exc:
            raise ProviderError(f"item {item.item_id}: {exc}") from exc
        output_tokens = body.get("output_tokens") or body.get("completion_tokens")
        if isinstance(output_tokens, str) and output_tokens.isdigit():
            output_tokens = int(output_tokens)
        elif not isinstance(output_tokens, int):
            output_tokens = None
        for key in ("reply", "text", "content", "output"):
            value = body.get(key)
            if isinstance(value, str) and value.strip():
                return Reply(value.strip(), output_tokens=output_tokens)
        raise ProviderError(f"item {item.item_id}: the endpoint returned no reply")


class AnthropicProvider(Provider):
    """Call the Anthropic API. Needs the `anthropic` package and a key."""

    name = "anthropic"

    def __init__(self, model: str, max_tokens: int = DEFAULT_MAX_TOKENS):
        try:
            import anthropic  # noqa: PLC0415
        except ImportError as exc:  # pragma: no cover - depends on the environment
            raise ProviderError(
                "the `anthropic` package is not installed. Run "
                "`pip install -r harness/requirements-providers.txt`."
            ) from exc
        if not os.environ.get("ANTHROPIC_API_KEY"):
            raise ProviderError("ANTHROPIC_API_KEY is not set")
        self.client = anthropic.Anthropic()
        self.model = model
        self.max_tokens = max_tokens

    def reply_for(self, item: Item) -> Reply:  # pragma: no cover - needs the network
        response = self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            system=item.system_prompt or "You are a helpful assistant.",
            messages=[{"role": "user", "content": item.probe}],
        )
        parts = [block.text for block in response.content if block.type == "text"]
        output_tokens = None
        if response.usage is not None:
            output_tokens = response.usage.output_tokens
        return Reply("\n".join(parts).strip(), output_tokens=output_tokens)


class OpenAiProvider(Provider):
    """Call the OpenAI API. Needs the `openai` package and a key."""

    name = "openai"

    def __init__(self, model: str, max_tokens: int = DEFAULT_MAX_TOKENS):
        try:
            from openai import OpenAI  # noqa: PLC0415
        except ImportError as exc:  # pragma: no cover - depends on the environment
            raise ProviderError(
                "the `openai` package is not installed. Run "
                "`pip install -r harness/requirements-providers.txt`."
            ) from exc
        if not os.environ.get("OPENAI_API_KEY"):
            raise ProviderError("OPENAI_API_KEY is not set")
        self.client = OpenAI()
        self.model = model
        self.max_tokens = max_tokens

    def reply_for(self, item: Item) -> Reply:  # pragma: no cover - needs the network
        messages = []
        if item.system_prompt:
            messages.append({"role": "system", "content": item.system_prompt})
        messages.append({"role": "user", "content": item.probe})
        response = self.client.chat.completions.create(
            model=self.model,
            max_completion_tokens=self.max_tokens,
            messages=messages,
        )
        output_tokens = None
        if response.usage is not None:
            output_tokens = response.usage.completion_tokens
        return Reply((response.choices[0].message.content or "").strip(), output_tokens=output_tokens)


class BedrockProvider(Provider):
    """Call a model on AWS Bedrock. One key covers every vendor in a region."""

    name = "bedrock"

    def __init__(self, model: str, max_tokens: int = DEFAULT_MAX_TOKENS):
        if not model:
            raise ProviderError("the `bedrock` provider needs a model ID")
        self.model = model
        self.name = f"bedrock:{model}"
        self.max_tokens = max_tokens

    def reply_for(self, item: Item) -> Reply:  # pragma: no cover - needs the network
        try:
            text, tokens = bedrock_chat(
                self.model,
                item.system_prompt or "You are a helpful assistant.",
                item.probe,
                max_tokens=self.max_tokens,
            )
        except EndpointError as exc:
            raise ProviderError(f"item {item.item_id}: {exc}") from exc
        if not text:
            raise ProviderError(f"item {item.item_id}: the model returned nothing")
        return Reply(text, output_tokens=tokens)


class OllamaProvider(Provider):
    """Call a model on Ollama Cloud."""

    name = "ollama"

    def __init__(self, model: str, max_tokens: int = DEFAULT_MAX_TOKENS):
        if not model:
            raise ProviderError("the `ollama` provider needs a model name")
        self.model = model
        self.name = f"ollama:{model}"
        self.max_tokens = max_tokens

    def reply_for(self, item: Item) -> Reply:  # pragma: no cover - needs the network
        try:
            text, tokens = ollama_chat(
                self.model,
                item.system_prompt or "You are a helpful assistant.",
                item.probe,
                max_tokens=self.max_tokens,
            )
        except EndpointError as exc:
            raise ProviderError(f"item {item.item_id}: {exc}") from exc
        if not text:
            raise ProviderError(f"item {item.item_id}: the model returned nothing")
        return Reply(text, output_tokens=tokens)


def build_provider(spec: str, replies_path: Path | None = None) -> Provider:
    """Build a provider from a `kind:argument` string.

    Examples: `dataset`, `replies`, `http:https://fcp.example/chat`,
    `anthropic:claude-opus-4`, `openai:gpt-4o`,
    `bedrock:us.anthropic.claude-opus-5`, `ollama:qwen3.5:397b`.
    """
    kind = provider_kind(spec)
    argument = spec.partition(":")[2].strip()

    if kind == "dataset":
        return DatasetProvider()
    if kind == "replies":
        path = Path(argument) if argument else replies_path
        if path is None:
            raise ProviderError("the `replies` provider needs a path to a replies CSV")
        return RepliesFileProvider(path)
    if kind == "http":
        if not argument:
            raise ProviderError("the `http` provider needs a URL")
        return HttpProvider(argument)
    if kind == "anthropic":
        return AnthropicProvider(argument or "claude-opus-4")
    if kind == "openai":
        return OpenAiProvider(argument or "gpt-4o")
    if kind == "bedrock":
        return BedrockProvider(argument)
    if kind == "ollama":
        return OllamaProvider(argument)
    raise ProviderError(f"unknown provider `{spec}`")
