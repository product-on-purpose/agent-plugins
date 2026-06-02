# Documentation sites (Astro) - standards domain

The family standard for Product on Purpose documentation sites: Astro + Starlight, Pattern S, the build-aware link/route guards, the shared preset, and the CI that holds it together. This is the first **promoted, tracked** standards domain - lifted from the gitignored working drafts in `_LOCAL/astro/` into the standards home so it is a citable artifact, not a note that can rot.

> **Status: PROPOSED for `STANDARD.md` Section 14, not yet landed.** This domain is authoritative as the family's proposed site standard and the reference for in-flight convergence work. The normative clauses still LAND into the one `STANDARD.md` (currently `agent-skills-toolkit/STANDARD.md`) via the serialized amendment process in [`../../GOVERNANCE.md`](../../GOVERNANCE.md); until then a plugin's conformance is pinned to the `STANDARD.md` version in its `library.json`, which does not yet contain Section 14. See [`ROADMAP.md`](ROADMAP.md) Phase 3.

## Contents

| File | What it is | Maps to |
|---|---|---|
| [`SITE-STANDARD.md`](SITE-STANDARD.md) | The normative spec: reference architecture, clauses 14.1-14.11 (RFC-2119), decisions A-1 to A-6. | the contract |
| [`ci-standard.md`](ci-standard.md) | The reusable `workflow_call` CI, the required guard suite, and the four build-aware validators. | the guardrails |
| [`shared-preset-spec.md`](shared-preset-spec.md) | The `@product-on-purpose/astro-docs-preset` package spec (decision A-2). | the shared library |
| [`ROADMAP.md`](ROADMAP.md) | The sequenced plan: close the P1s, build the infra, add features, land Section 14. | the execution |
| [`rollout/`](rollout/README.md) | Per-repo execution packets: pass/fail scorecard, corrections, an agent-updatable checklist, and a copy-paste kickoff prompt for each of the four repos. | the dispatch |

The evidence this domain rests on is the committed audit: [`../../../docs/internal/audits/2026-06-02_astro-implementation.md`](../../../docs/internal/audits/2026-06-02_astro-implementation.md). The original gitignored working drafts (and the inline-annotated findings doc) remain in [`../../../_LOCAL/astro/`](../../../_LOCAL/astro/) as provenance.

## Conformance snapshot (2026-06-02)

Status against the shipped branch (`main` for three repos; writing-style-catalog shown `main -> branch`).

| Repo | Pattern S | Generator | Drift guard | Deploy + PR build | Link/route guards | Sidecars | Net |
|---|---|---|---|---|---|---|---|
| **pm-skills** | yes | Node | gitignored-rebuilt | v5/v5, PR build | all four (donor) | none | reference; 1 P1 (base de-dup) |
| **thinking-framework-skills** | yes | Node | gitignored + `--check` | v5/v5, PR build | none | **7 (P1)** | close; delete sidecars |
| **agent-skills-toolkit** | yes | hand + coverage test | catalog coverage test | v5/v5, PR build | none | none | close; modernize deploy majors |
| **writing-style-catalog** | no -> yes | Python -> Node | taxonomy guard + gitignored | no PR build -> v5/v5 | none | none | one merge away |

Two facts that changed since the 2026-06-01 drafts: **both former High-severity drift findings are closed** (tfs `--check` wired; askit catalog guarded by `tests/unit/catalog-coverage.test.mjs`), and **the live frontier is shared infrastructure** - the four link/route validators live only in pm-skills, so three siblings can ship broken links undetected. That is [`ROADMAP.md`](ROADMAP.md) Phase 1.

## How to use this domain

- **Refining the standard:** edit `SITE-STANDARD.md` here (the tracked draft), then LAND into `STANDARD.md` Section 14 per `GOVERNANCE.md` when ready. Numbers (version, ADR, section) are allocated at LAND time on the protected branch, never reserved here.
- **Executing convergence in a repo:** read `SITE-STANDARD.md` (the contract) + `ROADMAP.md` (the order), prime the repo's `astro.config.mjs` / `content.config.ts` / generator / workflows, then make changes as normal PRs in that repo. Do not edit other repos from one session.
- **Building the shared infra:** `ci-standard.md` and `shared-preset-spec.md` are the build specs for the reusable workflow and the preset package.
