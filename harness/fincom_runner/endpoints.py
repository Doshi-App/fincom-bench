"""Raw HTTP calls to two model hosts, with no SDK.

`providers.py` needs these to get a reply; `judge.py` needs them to mark one.
Both live here so the request shape is written once.

Neither host needs a package: both are one POST with a bearer token. That keeps
the clone-and-run story in `harness/README.md` intact — the runner still has no
required dependency.

- **Bedrock** speaks the Converse API. One key covers every model in a region,
  so a run can move across vendors without a second credential.
- **Ollama Cloud** speaks its own `/api/chat`.

A key is read from the environment at call time and never written to a
transcript.
"""

from __future__ import annotations

import json
import os
import random
import time
import urllib.error
import urllib.request

BEDROCK_KEY = "BEDROCK_API_KEY"
OLLAMA_KEY = "OLLAMA_API_KEY"
DEFAULT_REGION = "us-east-1"
OLLAMA_URL = "https://ollama.com/api/chat"

# A fan-out across 20 models throttles. Retry the codes that clear on their own.
RETRYABLE = (408, 429, 500, 502, 503, 504)


class EndpointError(RuntimeError):
    """A call that failed after its retry budget was spent."""


def _post(url: str, payload: dict, headers: dict, timeout: int) -> dict:
    request = urllib.request.Request(
        url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST"
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def _with_retries(call, attempts: int = 5, base: float = 2.0) -> dict:
    """Back off on throttling. Fail fast on anything a retry cannot fix."""
    last = ""
    for attempt in range(attempts):
        try:
            return call()
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", "replace")[:300]
            last = f"HTTP {exc.code}: {detail}"
            if exc.code not in RETRYABLE and "hrottl" not in detail:
                raise EndpointError(last) from None
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last = f"{type(exc).__name__}: {exc}"
        if attempt < attempts - 1:
            time.sleep(base * (2**attempt) + random.uniform(0, 1.5))
    raise EndpointError(last or "the call failed for an unknown reason")


def _require(name: str) -> str:
    key = os.environ.get(name)
    if not key:
        raise EndpointError(f"{name} is not set")
    return key


def bedrock_chat(
    model: str,
    system: str,
    user: str,
    max_tokens: int = 1024,
    temperature: float = 0.0,
    region: str = "",
    timeout: int = 180,
) -> tuple[str, int | None]:
    """One Converse call. Returns the text and the output token count.

    A model ID may carry its region as `model@region`, because a few models are
    hosted in one region only.
    """
    key = _require(BEDROCK_KEY)
    if "@" in model:
        model, _, suffix = model.partition("@")
        region = region or suffix
    region = region or DEFAULT_REGION
    payload: dict = {
        "messages": [{"role": "user", "content": [{"text": user}]}],
        "inferenceConfig": {"maxTokens": max_tokens, "temperature": temperature},
    }
    if system:
        payload["system"] = [{"text": system}]
    body = _with_retries(
        lambda: _post(
            f"https://bedrock-runtime.{region}.amazonaws.com/model/{model}/converse",
            payload,
            {"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            timeout,
        )
    )
    blocks = body.get("output", {}).get("message", {}).get("content", []) or []
    # A reasoning model puts its thinking in a separate block. Take the text.
    text = "".join(block.get("text", "") for block in blocks if "text" in block)
    tokens = (body.get("usage") or {}).get("outputTokens")
    return text.strip(), tokens


def ollama_chat(
    model: str,
    system: str,
    user: str,
    max_tokens: int = 1024,
    temperature: float = 0.0,
    timeout: int = 300,
) -> tuple[str, int | None]:
    """One Ollama Cloud call. Returns the text and the output token count."""
    key = _require(OLLAMA_KEY)
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": user})
    body = _with_retries(
        lambda: _post(
            OLLAMA_URL,
            {
                "model": model,
                "messages": messages,
                "stream": False,
                "options": {"num_predict": max_tokens, "temperature": temperature},
            },
            {"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            timeout,
        )
    )
    message = body.get("message") or {}
    text = (message.get("content") or "").strip()
    if not text:
        # A thinking model can spend the whole budget before the answer.
        text = (message.get("thinking") or "").strip()
    return text, body.get("eval_count")
