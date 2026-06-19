# Open questions and the path to done

The single decision register for the standards effort. Every unresolved question, where it lives in the package, the recommendation, what closes it, and what it gates. The definitions are spread across [`03-decisions.md`](03-decisions.md), [`04-standards-definition.md`](04-standards-definition.md), and the `drafts/`; this file is the one place to see what is still open and to drive the plan to done.

## How to instruct against this file

- To resolve a question, answer it by id: "OQ-1: yes, full enforcement" or "OQ-4: conform, backfill HISTORY.md".
- On an answer, the resolution is folded into its source doc (and, if it is a real decision, recorded in [`03-decisions.md`](03-decisions.md) or graduated to a family-law ADR in [`../../../standards/decisions/`](../../../standards/decisions/) per the [`GOVERNANCE.md`](../../../standards/GOVERNANCE.md) lifecycle), and this register is updated.
- Nothing here is "done" until it lands through the amendment lifecycle (EXPAND -> PROPOSE -> REVIEW -> LAND -> RE-ADOPT). This register tracks intent; the LAND PRs make it law.

## A. Need your decision now (these set the plan's scope and shape)

| id | Question | Where it lives | Recommendation | What closes it | Gates |
|---|---|---|---|---|---|
| OQ-1 | Enforcement appetite: do you want full CI-enforced conformance across all four repos, or `agent-skills-toolkit` as the reference with loose convergence for the rest? | [`01-current-state.md`](01-current-state.md) GP-15 (the aspirational-enforcement reality); raised in the session log | Confirm full enforcement (the original ask implies it). If the answer is "askit is the reference, others converge loosely," Phases 2, 4, and 5 shrink substantially. | Your call | Scope of Phases 2 (CI keystone), 4, 5; whether GP-15 is in scope at all |
| OQ-3 | Phase 0 shape: pull the runner-consumption decision INTO Phase 0 (atomic relocation), or SPLIT Phase 0 (move text now, wire consumption with the Phase 4 shared workflow)? | [`02-roadmap.md`](02-roadmap.md) Phase 0 sequencing note; [`drafts/runner-consumption.md`](drafts/runner-consumption.md) Section 4 | Pull consumption into Phase 0, so the relocation is never half-done and askit's own gate keeps working throughout. | Your nod | Phase 0 definition of done |
| OQ-4 | HISTORY.md amend-vs-conform: the per-component HISTORY.md is a Standard 7.3 MUST at Silver+ that the gate does not enforce and most components lack. Amend the Standard (relax to warn-then-error) or conform (backfill)? | [`01-current-state.md`](01-current-state.md) GP-11 | Amend to surface (warn) then error a minor later, per the Standard 7.7 warn-then-error pattern, rather than a mechanical mass backfill. | Your decision | Phase 4 missing-checks |

## B. Need a decision plus a spike to confirm

| id | Question | Where it lives | Recommendation | What closes it | Gates |
|---|---|---|---|---|---|
| OQ-2 | Runner-consumption: once the 30-check runner relocates to `standards/checks/`, how do the four repos run it (npm package, git submodule, reusable GitHub Actions workflow, or vendored-and-synced)? | [`drafts/runner-consumption.md`](drafts/runner-consumption.md) | A reusable GitHub Actions workflow in `product-on-purpose/.github` that checks out `standards/` at a pinned ref and runs the gate against the caller; npm package is the named runner-up. | Your ratification as a family-law ADR (a D14-class decision beside ADR 0001) PLUS a one-afternoon spike confirming the GitHub Actions two-checkout mechanics. | Phase 0 completion; the GP-15 enforcement work; the Phase 2 re-pin check's meaning |

## C. Deferred by design (decided in-phase, not now)

| id | Question | Where it lives | Recommendation | When it closes |
|---|---|---|---|---|
| OQ-5 | Release executor: `askit-release` (agent-driven, exists) or release-please (CI bot)? | [`03-decisions.md`](03-decisions.md) D8; [`drafts/release-subsystem.md`](drafts/release-subsystem.md) | release-please for the leaf plugin repos; reposition `askit-release` as the prepare-plan-and-verify-gates step; keep the marketplace re-pin bespoke. | Phase 5, once Conventional Commits is enforced and the PLAN layer is in use |
| OQ-6 | Codex on-disk paths: `.agents/skills` vs `.codex/skills`, and the marketplace manifest location, have version churn. | [`drafts/cross-tool-targeting.md`](drafts/cross-tool-targeting.md) Section 4; [`04-standards-definition.md`](04-standards-definition.md) | Defer (no Codex consumer today, per D10 scope-to-truth). Reconfirm against current Codex docs only if and when a native Codex emitter is built. | Only when codex-distributed packaging is actually built |
| OQ-8 | Hook exit-code contract: confirm the live Claude Code hooks contract before the D9 clause lands. | [`03-decisions.md`](03-decisions.md) D9; [`drafts/standard-amendments.md`](drafts/standard-amendments.md) | Re-read the Claude Code hooks reference at LAND time; ship the commitlint commit-msg hook as the canonical example. | Phase 5, at the LAND of the hooks clause |

## D. Housekeeping

| id | Question | Where it lives | Recommendation | When it closes |
|---|---|---|---|---|
| OQ-7 | Roadmap reconciliation: the older [`../program-roadmap.md`](../program-roadmap.md) and this package's [`02-roadmap.md`](02-roadmap.md) overlap. | [`00-README.md`](00-README.md) reconciliation note | Make `program-roadmap.md` a thin pointer to this package, or fold its three-pillar framing in. | A small edit, any time before merge or in Phase 0 |

## The path to done

Terminal state: every question above resolved; the six phases executed; every clause LANDED through the [`GOVERNANCE.md`](../../../standards/GOVERNANCE.md) lifecycle (each its own PR carrying text plus a version bump plus one ADR); all four repos pinning the relocated Standard and running the shared gate green. At that point this package is fully mined and can be archived.

Ordered next actions:

1. **Answer OQ-1** (enforcement appetite). It sets the scope of everything downstream; answer it before the rest.
2. **Answer OQ-3 and OQ-4** (Phase 0 shape, HISTORY.md). These shape Phase 0 and Phase 4.
3. **Merge PR #36** to lock the plan as a committed record.
4. **Spike OQ-2** (runner-consumption): the one-afternoon GitHub Actions proof. This is the single highest-confidence-raising action.
5. **Execute Phase 0** (truth and relocation): produce the implementation plan (writing-plans), then LAND via the GOVERNANCE process.
6. **Phases 1 to 5** in order, each consuming the relevant `drafts/` text and resolving its in-phase questions (OQ-5, OQ-8) as it reaches them.

## Already decided (not open, for reference)

The thirteen locked decisions D1-D13 are in [`03-decisions.md`](03-decisions.md). Notably settled, do not relitigate without cause: Hybrid rollout (D2), keep `docs/internal` (D3), MADR 4.0 decision homes (D4), dissolve `_agent-context` (D5), `_local` lowercase casing (D6), no new init/listing skill (D7), and Codex = scope-to-truth (D10).
