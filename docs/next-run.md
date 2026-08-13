# Next run

Same order as the methodology page's "queued next" list, most impactful first.

1. Label more rows, especially more pass rows, then have a second person label them so
   inter-labeller agreement can be reported.
2. Repeat the run so gaps carry an error bar.
3. Run the same weights across several hosts and publish the spread.
4. Add the frontier closed models once an account with entitlement is available.
5. Tighten judge selection with a stricter meta-evaluation.
6. Cover internal, non-consumer-facing roles — not scoped yet.

## Items 2 and 3, in detail: why one run today

Today we run each model once per inference host (Bedrock, Ollama Cloud). Repeat runs of frontier
models are cost-prohibitive at retail inference prices — running the same weights through the same
probes several times over, for every frontier model on the table, is not a bill this project can
carry on its own.

Once we get inference credits for frontier models — either direct frontier-model credits, or
Bedrock access to frontier models — we plan to run repeated trials per model per host. That buys
two things the methodology page's "one run, no variance" and "adjacent rows are not meaningfully
ordered" caveats already flag as missing: an error bar per row, and a measured spread instead of an
assumed one for the same weights served through different hosts. Mistral Large 3 675B is the
concrete case: the same weights scored 5.8 points apart on Bedrock versus Ollama Cloud. Repeated
trials would show whether that 5.8-point gap is host variance, run-to-run noise, or both.

## Item 4: frontier closed models

Not a technical blocker — an account-entitlement one. The two hosts used for this run had no
entitlement to the newest proprietary systems, so the table is open-weight-heavy today. That is a
fact about the account, not a finding about open weights.

## Items 1 and 5

Covered directly on the methodology page; nothing to add here beyond what "queued next" already
says.

## Item 6: internal, non-consumer-facing roles

Every probe today is written as a member-facing chat reply. A separate question: how well does this
same rulebook transfer to an assistant or agent used *inside* an institution — a compliance officer
reviewing marketing copy, for example, rather than a member asking a chat assistant a question. This
might use Claude for internal work rather than a consumer-facing chat model, but the right shape
depends on which internal tasks get scoped first. Not designed yet — a placeholder for a real
scoping conversation, not a commitment to a specific approach.
