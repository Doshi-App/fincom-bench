"""Where a reply comes from.

A provider takes a system prompt and a probe and returns a reply. The runner
does not care how the provider gets it. This is what lets one runner score
lesson content, the Doshi FCP agent, and a third-party assistant used through
its ordinary consumer interface.

Five providers ship with the runner.

- `dataset` — the reply is already in the dataset `reply` column.
- `replies` — the reply comes from a 2-column CSV a person filled in by hand.
  This is the lane for an assistant with no API.
- `http` — the runner posts the probe to a JSON endpoint. This is the lane for
  the FCP agent and for any assistant behind a service.
- `anthropic` — the runner calls the Anthropic API.
- `openai` — the runner calls the OpenAI API.

A provider that needs a key reads it from the environment. No key is ever
written to a transcript.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from pathlib import Path

from .dataset import load_replies
from .models import Item

DEFAULT_TIMEOUT = 120
DEFAULT_MAX_TOKENS = 1024


class ProviderError(Exception):
    """The provider could not produce a reply."""


class Provider:
    """The interface every provider implements."""

    name = "provider"

    def reply_for(self, item: Item) -> str:
        raise NotImplementedError


class DatasetProvider(Provider):
    """Grade the reply the dataset already holds."""

    name = "dataset"

    def reply_for(self, item: Item) -> str:
        if not item.reply:
            raise ProviderError(
                f"item {item.item_id}: the dataset holds no reply. "
                f"Use a different provider, or pass a dataset with a `reply` column."
            )
        return item.reply


class RepliesFileProvider(Provider):
    """Grade replies a person collected from a consumer chat interface."""

    name = "replies"

    def __init__(self, path: Path):
        self.path = path
        self.replies = load_replies(path)

    def reply_for(self, item: Item) -> str:
        reply = self.replies.get(item.item_id)
        if reply is None:
            raise ProviderError(f"item {item.item_id}: no reply in {self.path}")
        return reply


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

    def reply_for(self, item: Item) -> str:
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
        for key in ("reply", "text", "content", "output"):
            value = body.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
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

    def reply_for(self, item: Item) -> str:  # pragma: no cover - needs the network
        response = self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            system=item.system_prompt or "You are a helpful assistant.",
            messages=[{"role": "user", "content": item.probe}],
        )
        parts = [block.text for block in response.content if block.type == "text"]
        return "\n".join(parts).strip()


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

    def reply_for(self, item: Item) -> str:  # pragma: no cover - needs the network
        messages = []
        if item.system_prompt:
            messages.append({"role": "system", "content": item.system_prompt})
        messages.append({"role": "user", "content": item.probe})
        response = self.client.chat.completions.create(
            model=self.model,
            max_tokens=self.max_tokens,
            messages=messages,
        )
        return (response.choices[0].message.content or "").strip()


def build_provider(spec: str, replies_path: Path | None = None) -> Provider:
    """Build a provider from a `kind:argument` string.

    Examples: `dataset`, `replies`, `http:https://fcp.example/chat`,
    `anthropic:claude-opus-4`, `openai:gpt-4o`.
    """
    kind, _, argument = spec.partition(":")
    kind = kind.strip().lower()
    argument = argument.strip()

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
    raise ProviderError(f"unknown provider `{spec}`")
