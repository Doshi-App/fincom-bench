/**
 * Turns a raw model/judge id (e.g. "us.anthropic.claude-sonnet-4-6",
 * "moonshotai.kimi-k2.5", "qwen3.5:397b") into 3 separate, readable parts:
 * the maker (who built the model), the model's own clean name, and the
 * inference host (who actually served it for this run — AWS Bedrock,
 * Ollama Cloud, or the maker's own API).
 *
 * `MODEL_TABLE` is a hand-curated, exact-match table for every id this
 * benchmark has actually produced — the ids carry too many one-off
 * irregularities (baked-in dates, AWS revision suffixes, ollama tags,
 * region prefixes) for a generic parser to get consistently right.
 * `fallbackDisplay` is the safety net for any id that lands here without an
 * entry: it still renders something reasonable, just less neatly.
 */

export type ModelDisplay = { maker: string; name: string; host: string };

const HOST_LABELS: Record<string, string> = {
  anthropic: "Direct API",
  openai: "Direct API",
  bedrock: "AWS Bedrock",
  ollama: "Ollama Cloud",
  "bedrock+ollama": "AWS Bedrock + Ollama Cloud",
};

function hostLabel(host?: string): string {
  if (!host) return "";
  return HOST_LABELS[host] ?? host.replace(/\b\w/g, (c) => c.toUpperCase());
}

const MAKER_BY_PREFIX: Record<string, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  amazon: "Amazon",
  meta: "Meta",
  google: "Google",
  mistral: "Mistral",
  minimax: "MiniMax",
  moonshotai: "Moonshot AI",
  moonshot: "Moonshot AI",
  qwen: "Qwen",
  nvidia: "Nvidia",
  zai: "Zhipu AI",
  deepseek: "DeepSeek",
};

const KEYWORD_MAKERS: [RegExp, string][] = [
  [/^claude/, "Anthropic"],
  [/^gpt/, "OpenAI"],
  [/^glm/, "Zhipu AI"],
  [/^kimi/, "Moonshot AI"],
  [/^minimax/, "MiniMax"],
  [/^(mistral|magistral|devstral|ministral)/, "Mistral"],
  [/^deepseek/, "DeepSeek"],
  [/^gemma/, "Google"],
  [/^nemotron/, "Nvidia"],
  [/^qwen/, "Qwen"],
];

const MODEL_TABLE: Record<string, { maker: string; name: string }> = {
  "claude-fable-5": { maker: "Anthropic", name: "Claude Fable 5" },
  "claude-opus-5": { maker: "Anthropic", name: "Claude Opus 5" },
  "claude-sonnet-5": { maker: "Anthropic", name: "Claude Sonnet 5" },
  "deepseek-v4-flash:0731": { maker: "DeepSeek", name: "DeepSeek V4 Flash (0731)" },
  "deepseek-v4-flash:preview": { maker: "DeepSeek", name: "DeepSeek V4 Flash (Preview)" },
  "deepseek-v4-pro": { maker: "DeepSeek", name: "DeepSeek V4 Pro" },
  "deepseek.v3.2": { maker: "DeepSeek", name: "DeepSeek V3.2" },
  "gemma4:31b": { maker: "Google", name: "Gemma 4 31B" },
  "glm-5.1": { maker: "Zhipu AI", name: "GLM 5.1" },
  "glm-5.2": { maker: "Zhipu AI", name: "GLM 5.2" },
  "google.gemma-3-12b-it": { maker: "Google", name: "Gemma 3 12B IT" },
  "google.gemma-3-27b-it": { maker: "Google", name: "Gemma 3 27B IT" },
  "gpt-5.4": { maker: "OpenAI", name: "GPT-5.4" },
  "gpt-5.4-mini": { maker: "OpenAI", name: "GPT-5.4 Mini" },
  "gpt-5.4-nano": { maker: "OpenAI", name: "GPT-5.4 Nano" },
  "gpt-oss-120b": { maker: "OpenAI", name: "GPT-OSS 120B" },
  "gpt-oss-20b": { maker: "OpenAI", name: "GPT-OSS 20B" },
  "openai.gpt-oss-120b-1:0": { maker: "OpenAI", name: "GPT-OSS 120B" },
  "kimi-k2.6": { maker: "Moonshot AI", name: "Kimi K2.6" },
  "kimi-k2.7-code": { maker: "Moonshot AI", name: "Kimi K2.7 Code" },
  "minimax-m2.7": { maker: "MiniMax", name: "M2.7" },
  "minimax-m3": { maker: "MiniMax", name: "M3" },
  "minimax.minimax-m2.1": { maker: "MiniMax", name: "M2.1" },
  "minimax.minimax-m2.5": { maker: "MiniMax", name: "M2.5" },
  "mistral-large-3-675b-instruct": { maker: "Mistral", name: "Large 3 675B Instruct" },
  "mistral.mistral-large-3-675b-instruct": { maker: "Mistral", name: "Large 3 675B Instruct" },
  "mistral.devstral-2-123b": { maker: "Mistral", name: "Devstral 2 123B" },
  "mistral.magistral-small-2509": { maker: "Mistral", name: "Magistral Small 2509" },
  "mistral.ministral-3-14b-instruct": { maker: "Mistral", name: "Ministral 3 14B Instruct" },
  "moonshot.kimi-k2-thinking": { maker: "Moonshot AI", name: "Kimi K2 Thinking" },
  "moonshotai.kimi-k2.5": { maker: "Moonshot AI", name: "Kimi K2.5" },
  "nemotron-3-nano:30b": { maker: "Nvidia", name: "Nemotron 3 Nano 30B" },
  "nemotron-3-super": { maker: "Nvidia", name: "Nemotron 3 Super" },
  "nemotron-3-ultra": { maker: "Nvidia", name: "Nemotron 3 Ultra" },
  "nvidia.nemotron-nano-12b-v2": { maker: "Nvidia", name: "Nemotron Nano 12B V2" },
  "nvidia.nemotron-super-3-120b": { maker: "Nvidia", name: "Nemotron Super 3 120B" },
  "openai.gpt-oss-safeguard-120b": { maker: "OpenAI", name: "GPT-OSS Safeguard 120B" },
  "qwen.qwen3-235b-a22b-2507-v1:0@us-west-2": { maker: "Qwen", name: "Qwen3 235B A22B (2507)" },
  "qwen.qwen3-32b-v1:0": { maker: "Qwen", name: "Qwen3 32B" },
  "qwen.qwen3-coder-480b-a35b-v1:0@us-west-2": { maker: "Qwen", name: "Qwen3 Coder 480B A35B" },
  "qwen.qwen3-next-80b-a3b": { maker: "Qwen", name: "Qwen3 Next 80B A3B" },
  "qwen3.5:397b": { maker: "Qwen", name: "Qwen3.5 397B" },
  "us.amazon.nova-lite-v1:0": { maker: "Amazon", name: "Nova Lite V1" },
  "us.amazon.nova-pro-v1:0": { maker: "Amazon", name: "Nova Pro V1" },
  "us.anthropic.claude-haiku-4-5-20251001-v1:0": { maker: "Anthropic", name: "Claude Haiku 4.5" },
  "us.anthropic.claude-opus-4-5-20251101-v1:0": { maker: "Anthropic", name: "Claude Opus 4.5" },
  "us.anthropic.claude-sonnet-4-5-20250929-v1:0": { maker: "Anthropic", name: "Claude Sonnet 4.5" },
  "us.anthropic.claude-sonnet-4-6": { maker: "Anthropic", name: "Claude Sonnet 4.6" },
  "us.deepseek.r1-v1:0": { maker: "DeepSeek", name: "R1" },
  "us.meta.llama3-1-70b-instruct-v1:0": { maker: "Meta", name: "Llama 3.1 70B Instruct" },
  "us.meta.llama3-3-70b-instruct-v1:0": { maker: "Meta", name: "Llama 3.3 70B Instruct" },
  "us.meta.llama4-maverick-17b-instruct-v1:0": { maker: "Meta", name: "Llama 4 Maverick 17B Instruct" },
  "us.meta.llama4-scout-17b-instruct-v1:0": { maker: "Meta", name: "Llama 4 Scout 17B Instruct" },
  "zai.glm-4.7": { maker: "Zhipu AI", name: "GLM 4.7" },
  "zai.glm-4.7-flash": { maker: "Zhipu AI", name: "GLM 4.7 Flash" },
  "zai.glm-5": { maker: "Zhipu AI", name: "GLM 5" },
};

function titleCaseToken(tok: string): string {
  if (/^\d+(\.\d+)?[a-z]?$/i.test(tok)) return tok.toUpperCase();
  if (/^[a-z]+[\d.]/i.test(tok)) return tok.toUpperCase();
  if (tok.toLowerCase() === "it") return "IT";
  return tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase();
}

function fallbackDisplay(id: string, provider?: string): ModelDisplay {
  let rest = id.replace(/^[a-z]{2}\./, "");
  let maker: string | undefined;
  const dot = rest.indexOf(".");
  if (dot > -1) {
    const candidate = rest.slice(0, dot).toLowerCase();
    if (MAKER_BY_PREFIX[candidate]) {
      maker = MAKER_BY_PREFIX[candidate];
      rest = rest.slice(dot + 1);
    }
  }
  if (!maker) {
    const found = KEYWORD_MAKERS.find(([re]) => re.test(rest.toLowerCase()));
    if (found) maker = found[1];
  }
  if (!maker && provider && (provider === "anthropic" || provider === "openai")) {
    maker = provider.charAt(0).toUpperCase() + provider.slice(1);
  }
  const tokens = rest
    .replace(/@[a-z0-9-]+$/i, "")
    .split(/[-:]/)
    .filter((t) => t && t !== "0");
  const name = tokens.map(titleCaseToken).join(" ");
  return { maker: maker ?? "Unknown", name: name || rest, host: hostLabel(provider) };
}

/** `provider` is the inference host this run actually used (bedrock, ollama, openai, anthropic). */
export function describeModel(model: string, provider?: string): ModelDisplay {
  const known = MODEL_TABLE[model];
  if (known) return { ...known, host: hostLabel(provider) };
  return fallbackDisplay(model, provider);
}

const KNOWN_HOSTS = new Set(["bedrock", "ollama", "openai", "anthropic", "baseline"]);

/**
 * Same lookup, for a raw id that may carry its own "host:" prefix instead
 * of a separate provider field — the shape judges (leaderboard.csv) and
 * transcript assistants (submissions/*) come in, e.g.
 * "bedrock:mistral.mistral-large-3-675b-instruct".
 */
export function describeWithHostPrefix(raw: string): ModelDisplay {
  const m = /^([a-z+]+):(.+)$/.exec(raw);
  if (m && KNOWN_HOSTS.has(m[1])) return describeModel(m[2], m[1]);
  return describeModel(raw);
}

/**
 * A small original monogram badge per maker — not a copy of any real
 * company's logo, just a flat-color circle + initials so a reader can spot
 * "same maker" at a glance in a long list. Files live in `public/models/`.
 */
const MAKER_ICON: Record<string, string> = {
  Anthropic: "/models/anthropic.svg",
  OpenAI: "/models/openai.svg",
  Amazon: "/models/amazon.svg",
  Meta: "/models/meta.svg",
  Google: "/models/google.svg",
  Mistral: "/models/mistral.svg",
  MiniMax: "/models/minimax.svg",
  "Moonshot AI": "/models/moonshot.svg",
  Qwen: "/models/qwen.svg",
  Nvidia: "/models/nvidia.svg",
  "Zhipu AI": "/models/zhipu.svg",
  DeepSeek: "/models/deepseek.svg",
};

export function iconForMaker(maker: string): string {
  return MAKER_ICON[maker] ?? "/models/generic.svg";
}
