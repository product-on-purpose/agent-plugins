# Standards Plan and Roadmap - Package Map

This package is the comprehensive roadmap PLUS staged, ready-to-land draft text for converging the product-on-purpose plugin family on one normative authoring law. It is a committed, tracked planning record under `docs/internal/standards-plan-roadmap/`. It is the planning and lock-in artifact for D1 (deliverable: roadmap + ready-to-land drafts): it records 17 locked decisions, sequences them into six phases, and stages the actual clause text to be landed. It is NOT execution and NOT the per-plugin audit - those are separate later efforts. Being committed does not make it authoritative: nothing here is the source of truth, and clauses become normative only when they LAND through the GOVERNANCE.md amendment lifecycle (EXPAND -> PROPOSE -> REVIEW -> LAND -> RE-ADOPT).

## Files in this package

Suggested reading order is top to bottom: orient, ground yourself in current state, see the plan, then read the decisions and drafts on demand.

| Order | File | What it covers |
|---|---|---|
| 1 | `00-README.md` | This file. Package entry point, file map, one-line decision and phase summaries, how to use the package. |
| 2 | `01-current-state.md` | The family as it actually is today: the four plugins, version pins, the two P0 holes, drift inventory, on-disk decision homes and context files. |
| 3 | `02-roadmap.md` | The six phases in full, with exits, sequencing invariants, and the decision-to-phase mapping. |
| 4 | `03-decisions.md` | The 17 locked decisions (D1-D17) with full rationale and consequences. The authoritative source for decision intent. |
| 5 | `04-standards-definition.md` | What the normative Standard is and how it relates to the listing contract, governance, and per-plugin decisions. |
| 6 | `drafts/standard-amendments.md` | Staged RFC-2119 clause text proposed for `standards/STANDARD.md` (folder layout, context contract, frontmatter, targeting). |
| 7 | `drafts/contributing-edits.md` | Staged edits to the listing contract `CONTRIBUTING.md` (L1-L6) for the re-pin and targeting clauses. |
| 8 | `drafts/ci-repin-check.md` | Spec for the marketplace re-pin conformance check added to `validate-registry`. |
| 9 | `drafts/frontmatter-schemas.md` | One frontmatter schema per artifact type (skill, ADR, doc, spec), per D11 (frontmatter). |
| 10 | `drafts/agents-md-and-context.md` | The AGENTS.md + thin CLAUDE.md shim contract and the `_local/` layout, per D5 (dissolve _agent-context) and D10 (cross-tool). |
| 11 | `drafts/release-subsystem.md` | The three-layer release subsystem (PLAN / EXECUTE / NOTES), per D8 (release subsystem). |
| 12 | `drafts/cross-tool-targeting.md` | Truth-in-targeting: making `agent-targets` load-bearing, per D10 (cross-tool / truth-in-targeting). |
| 13 | `drafts/orchestration-campaigns.md` | One-PR-per-repo fleet campaign mechanics for the mechanical pushes, per D2 (rollout: Hybrid). |
| 14 | `drafts/runner-consumption.md` | How the four repos run the relocated conformance runner (the Phase 0 consumption sub-decision). |
| 15 | `06-tier-requirements.md` | Complete Bronze/Silver/Gold tier requirements, the 30-check spine, and current per-repo standing. |
| 16 | `OVERVIEW.md` | Human-consumption narrative: what the standards are and the reasoning behind every part. Start here for the why. |
| 17 | `spikes/runner-consumption-spike.md` | Spike (D14): the gate grades an arbitrary checkout (confirmed) + ready-to-use reusable-workflow and caller YAML. |
| 18 | `spikes/codex-paths-spike.md` | Spike (D17): reconfirmed Codex on-disk paths and schemas, with the install-verb caveat. |

## The 17 decisions (one line each)

Full rationale is in `03-decisions.md`; reference decisions by ID plus handle.

| ID | Handle | One-line summary |
|---|---|---|
| D1 | deliverable: roadmap + ready-to-land drafts | This package is roadmap plus staged draft text in `docs/internal/standards-plan-roadmap/`; planning and lock-in only. |
| D2 | rollout: Hybrid | PULL the law (each plugin re-adopts the version pin on its own cadence); PUSH mechanical conventions as orchestrated one-PR-per-repo campaigns. |
| D3 | docs/internal kept | No rename to `docs/_internal`; all four repos use `docs/internal` and Pattern S already separates published from internal. |
| D4 | decision homes | Each repo records its own ADRs as MADR 4.0 in `docs/internal/decisions/`; family-law ADRs live in `agent-plugins/standards/decisions/`. |
| D5 | dissolve _agent-context | Remove `_agent-context/` entirely; session logs become gitignored `_local/session-logs/`; committed agent layer is AGENTS.md + thin CLAUDE.md shim + `docs/internal/`. |
| D6 | casing | `_local` lowercase everywhere; `session-logs/` lowercase plural; resolves Windows case-collision and naming drift. |
| D7 | no new init/listing skill | The toolkit already owns scaffolding; agent-plugins owns only the contract (CONTRIBUTING.md L1-L6) and the CI gate. |
| D8 | release subsystem | Three layers: PLAN (`release-plans/plan_vX.Y.Z/`), EXECUTE (askit-release or release-please, decide in Phase 5), NOTES (curated CHANGELOG). |
| D9 | hooks | Ratify the Claude Code hook exit-code contract and `CLAUDE_PLUGIN_ROOT` usage; ship one canonical commitlint commit-msg hook; dash-ban stays RECOMMENDED, not a check. |
| D10 | cross-tool / truth-in-targeting | AGENTS.md is the single canonical source; every declared `agent-targets` entry MUST ship its native distribution + thin shim or be dropped; codex claims portability, not native packaging yet. |
| D11 | frontmatter | One schema per artifact type: kebab-case keys, quoted version/date scalars, correct types, required keys CI-validated; agentskills.io caps are the floor. |
| D12 | exceptions | Tier ceiling is the primary mechanism; genuine per-clause exceptions MUST carry an ADR plus a machine-readable suppression the gate reads; no silent suppressions. |
| D13 | issues / effort / roadmap conventions | Lowest urgency; codify after P0/P1 lands. Direction: MADR decisions + local-first markdown backlogs + campaign-record FC-NNNN ids. |
| D14 | runner-consumption = reusable workflow | Resolves OQ-2: the relocated runner is consumed via a reusable GitHub Actions workflow in `product-on-purpose/.github`; each repo carries a thin pinned caller, the Standard version is a workflow input, npm package is the named fallback. |
| D15 | enforcement = full, tiered ramp | Resolves OQ-1: target full CI-enforced conformance across all four repos, delivered as a tiered warn-first ramp (Bronze floor blocks first, then Silver, then Gold; each new check warns one minor then errors per Standard 7.7). |
| D16 | HISTORY.md = amend + grandfather | Resolves OQ-4: keep 7.3 a Silver+ MUST, add the enforcing check shipping warn-then-error, require HISTORY.md only on new or changed components going forward (grandfather existing, no mass backfill). |
| D17 | Codex = deliver | Resolves OQ-6, supersedes D10 defer: deliver codex-distributed (native plugin packaging + Codex marketplace) for skills + MCP only; a path-reconfirmation spike runs first, then a dedicated workstream parallel to Phase 4. |

## The six phases (one line each)

Full detail is in `02-roadmap.md`; reference phases by number plus handle.

| Phase | Handle | One-line summary |
|---|---|---|
| 0 | truth and relocation | Execute ADR 0001 (move STANDARD.md and checks into `standards/`), sweep stale 0.8 and name-drift refs to one 0.12 truth, gate green. Unblocks everything. |
| 1 | close P0 holes | In-repo pm-skills session: generated-manifest tooling, add `library.json` (pin 0.12, declare tier), remove the embedded self-listing marketplace. |
| 2 | CI keystone | Build the marketplace re-pin check into `validate-registry` (advisory then blocking); surface standard + tier; land truth-in-targeting advisory. |
| 3 | scaffolding and dual-audience | One coordinated amendment plus CONTRIBUTING.md promotion: folder layout, AGENTS.md + shim contract, frontmatter schemas, release-plans convention; push mechanical parts per D2. |
| 4 | consolidate CI and graduate domains | Stand up shared `astro-site.yml`, extract the shared preset, land Section 14 (astro site standard), add enforcing checks, flip truth-in-targeting to blocking. |
| 5 | process and hooks | Graduate the release subsystem (incl. Conventional Commits + commitlint hook), the hooks clause (D9), the exception rule (D12), and the issue/effort conventions (D13). |

## How to use this package

- **The path to done.** [`05-open-questions.md`](05-open-questions.md) is the live decision register: every outstanding question, where it lives, the recommendation, what closes it, and what it gates, plus the ordered next actions. Start there to see what is still open and to instruct the plan forward.
- **The tier spine and per-repo standing.** [`06-tier-requirements.md`](06-tier-requirements.md) carries the complete Bronze/Silver/Gold tier requirements, the 30-check spine, and the current per-repo standing. Read it to see what each tier demands and where each of the four repos stands against the checks today.
- **Where it lives.** This package is a committed, tracked planning and lock-in record under `docs/internal/standards-plan-roadmap/`. It is a durable planning artifact, not the source of truth: decisions become normative only when they LAND through the GOVERNANCE.md lifecycle, and the staged drafts here carry no allocated numbers until then.
- **Reconciliation with the older roadmap.** An earlier roadmap exists one level up at [`../program-roadmap.md`](../program-roadmap.md) (both files sit under `docs/internal/`). This package's [`02-roadmap.md`](02-roadmap.md) is its detailed successor. The two SHOULD be reconciled: `program-roadmap.md` should either point here or be folded into this package. Do not treat both as live in parallel; this is the active plan.
- **How decisions graduate.** A decision here is a proposal until it lands. Family-law decisions graduate into `agent-plugins/standards/decisions/` as MADR ADRs; each plugin's own internal decisions graduate into that plugin's `docs/internal/decisions/`. The path follows the GOVERNANCE.md lifecycle: EXPAND (draft in `_LOCAL/`) -> PROPOSE (land-ready draft or RFC) -> REVIEW (collision and exemplar check) -> LAND (one PR: text + version bump + one ADR) -> RE-ADOPT (plugins bump their `standard` pin).
- **How drafts land.** The `drafts/` files are staged clause text and specs. They become authoritative only when landed through that lifecycle, at which point the Standard version, ADR number, and section number are allocated - the allocation-at-land invariant. Never reserve those numbers in a draft.
- **Sequencing discipline.** No clause is ratified without a named enforcing check or an explicit aspirational label, and no clause is ratified from a non-conforming exemplar. Read `02-roadmap.md` before acting on any draft so you land in phase order.
