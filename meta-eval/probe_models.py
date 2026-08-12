"""Ask every candidate model one tiny question and keep the ones that answer.

A model that is listed is not always a model that is reachable: some need an
inference profile, some are not enabled in the account, some are embedding or
vision models that cannot hold a chat. Finding that out here costs one short
call each, instead of failing in the middle of a 20-model run.

Writes results/roster.json — the list the run stages read.
"""

from __future__ import annotations

import json
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "harness"))

from fincom_runner.endpoints import EndpointError, bedrock_chat, ollama_chat  # noqa: E402

PROBE = "Reply with exactly one word: ready"

BEDROCK = [
    # Anthropic
    "us.anthropic.claude-opus-5", "us.anthropic.claude-sonnet-5",
    "us.anthropic.claude-fable-5", "us.anthropic.claude-opus-4-8",
    "us.anthropic.claude-opus-4-7", "us.anthropic.claude-sonnet-4-6",
    "us.anthropic.claude-opus-4-5-20251101-v1:0",
    "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "us.anthropic.claude-haiku-4-5-20251001-v1:0",
    "us.anthropic.claude-3-haiku-20240307-v1:0",
    # Meta
    "us.meta.llama4-maverick-17b-instruct-v1:0",
    "us.meta.llama4-scout-17b-instruct-v1:0",
    "us.meta.llama3-3-70b-instruct-v1:0",
    "us.meta.llama3-1-70b-instruct-v1:0",
    # DeepSeek / Qwen / Moonshot / Z.ai / MiniMax
    "deepseek.v3.2", "us.deepseek.r1-v1:0",
    "qwen.qwen3-235b-a22b-2507-v1:0@us-west-2",
    "qwen.qwen3-coder-480b-a35b-v1:0@us-west-2",
    "qwen.qwen3-next-80b-a3b", "qwen.qwen3-32b-v1:0",
    "moonshotai.kimi-k2.5", "moonshot.kimi-k2-thinking",
    "zai.glm-5", "zai.glm-4.7", "zai.glm-4.7-flash",
    "minimax.minimax-m2.5", "minimax.minimax-m2.1",
    # Mistral
    "mistral.mistral-large-3-675b-instruct", "mistral.devstral-2-123b",
    "mistral.ministral-3-14b-instruct", "mistral.magistral-small-2509",
    # OpenAI open weights
    "openai.gpt-oss-120b-1:0", "openai.gpt-oss-20b-1:0",
    "openai.gpt-oss-safeguard-120b",
    # Amazon / NVIDIA / Google / Cohere / AI21 / Writer
    "us.amazon.nova-premier-v1:0", "us.amazon.nova-pro-v1:0",
    "us.amazon.nova-lite-v1:0",
    "nvidia.nemotron-super-3-120b", "nvidia.nemotron-nano-12b-v2",
    "google.gemma-3-27b-it", "google.gemma-3-12b-it",
    "cohere.command-r-plus-v1:0", "ai21.jamba-1-5-large-v1:0",
    "us.writer.palmyra-x5-v1:0",
]

OLLAMA = [
    "nemotron-3-ultra", "deepseek-v4-pro", "qwen3.5:397b", "glm-5.2",
    "nemotron-3-super", "gpt-oss:120b", "minimax-m2.7",
]


def probe(entry: tuple[str, str]) -> dict:
    kind, model = entry
    call = bedrock_chat if kind == "bedrock" else ollama_chat
    try:
        text, _ = call(model, "", PROBE, max_tokens=256, temperature=0.0)
    except EndpointError as exc:
        return {"kind": kind, "model": model, "ok": False, "error": str(exc)[:180]}
    except Exception as exc:  # noqa: BLE001 - a probe must never crash the sweep
        return {"kind": kind, "model": model, "ok": False,
                "error": f"{type(exc).__name__}: {exc}"[:180]}
    ok = bool(text.strip())
    return {"kind": kind, "model": model, "ok": ok,
            "sample": text.strip()[:60],
            "error": "" if ok else "empty reply"}


def main() -> int:
    entries = [("bedrock", m) for m in BEDROCK] + [("ollama", m) for m in OLLAMA]
    print(f"Probing {len(entries)} models...", flush=True)
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(probe, entries))

    live = [r for r in results if r["ok"]]
    dead = [r for r in results if not r["ok"]]

    out = Path("results/roster.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(results, indent=2), encoding="utf-8")

    print(f"\nreachable: {len(live)} / {len(entries)}")
    for r in live:
        print(f"  ok    {r['kind']}:{r['model']}")
    print(f"\nunreachable: {len(dead)}")
    for r in dead:
        print(f"  FAIL  {r['kind']}:{r['model']} -> {r['error'][:110]}")
    print(f"\nWrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
