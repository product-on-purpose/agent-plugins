# Review and next steps - the maintainer control panel

> The single guided view of what is awaiting your review and decision, in priority order, with what each needs from you and where it lives. If you read one file to know what to do next, read this one.

## Where things stand (in one paragraph)

The standards program is **fully planned, decided, spike-validated, and committed**. Seventeen decisions are locked (D1-D17), both load-bearing assumptions are spike-proven (the runner grades an arbitrary repo; the Codex paths are reconfirmed), and Phase 0 (the first execution) has a task-by-task plan plus a current-vs-new change manifest, both reviewed-ready. **Everything that could be done without touching another repo is done.** The program sits exactly at the planning/execution boundary; the next move crosses repos and needs your go.

## The one thing blocking progress

**Authorize execution.** Everything downstream is staged behind your "go" on the first cross-repo step (PR-A). Nothing else is waiting on anyone but you.

## What to review, in priority order

### Priority 1 - DECIDE: authorize the first execution step (this blocks everything)

1. **Read** the two Phase 0 docs - each opens with its own "How to review this document" section, so follow that:
   - [`plans/phase-0-change-manifest.md`](plans/phase-0-change-manifest.md) - current-state vs new-state for every change in every repo, with reasoning + Standard references. Review this FIRST ("is this the right set of changes?").
   - [`plans/phase-0-truth-and-relocation.md`](plans/phase-0-truth-and-relocation.md) - the task-by-task plan ("is it safe to execute?"). It carries the recommendations, the severity-tagged risks, and the confidence table.
2. **Confirm one ruling:** the version bump. It is defaulted to **structural / no bump** (keeps `0.13` free for the U13 burndown). Confirm, or override to a bump.
3. **Decide:** authorize **PR-A** - ship + tag the reusable `standards-gate.yml` in the org `.github` repo and run it once live. It is the lowest-risk, highest-leverage first step (net-new, touches no plugin, and closes the one thing not yet proven: the live GitHub Actions run).
4. **What it needs from you:** one "go" plus the version-ruling confirm. That is the whole gate.

### Priority 2 - READ for confidence (no decision; builds trust in the plan)

- [`OVERVIEW.md`](OVERVIEW.md) - the human narrative of the whole system and the reasoning behind every part. The best single read.
- [`03-decisions.md`](03-decisions.md) - the 17 locked decisions. Skim; the load-bearing ones are D2 (Hybrid rollout), D5 (dissolve `_agent-context`), D10 + D17 (cross-tool truth-in-targeting + deliver Codex), D14 (reusable-workflow consumption), D15 (full tiered enforcement).
- [`06-tier-requirements.md`](06-tier-requirements.md) - the Bronze/Silver/Gold bar, the 30-check spine, and where each repo stands today.
- [`01-current-state.md`](01-current-state.md) - the honest gaps, including the headline one (GP-15: enforcement is largely aspirational today - only one repo actually runs the full gate).

### Priority 3 - BACKLOG (no rush; documented, awaiting a slot you choose)

- The five deferred repo-health items, each with its reason, in [`../2026-06-20_repo-health-review.md`](../2026-06-20_repo-health-review.md): dissolve this repo's `_agent-context` (D5), surface `standard`/`tier` in the registry (Phase 2), re-pin automation, a pin-currency policy (GP-6), and the `_LOCAL` -> `_local` casing (D6).
- Roadmap phases 1-5 and the Codex delivery workstream, in [`02-roadmap.md`](02-roadmap.md) - all sequenced after Phase 0.

## Decisions: settled vs still needing you

**Settled (do not relitigate without cause):** the 17 decisions D1-D17 ([`03-decisions.md`](03-decisions.md)); the version ruling (no bump, defaulted); both confirming spikes (D14 runner, D17 Codex paths).

**Still needing you:**
1. **Authorize execution / PR-A** (Priority 1) - the live gate.
2. **Confirm the version ruling** (defaulted to no-bump).
3. **Later, in-phase:** the release executor choice (OQ-5, decided in Phase 5); the five backlog items, when you want them.

## The process - how this drives to done

1. Review the Priority 1 docs and **authorize PR-A**.
2. I ship + run PR-A live in the org `.github` repo; **you see one green Actions run** (this de-risks the whole relocation).
3. On green -> **PR-B** (the `agent-plugins` atomic LAND: relocate the Standard + runner) -> your review and merge.
4. -> **PR-C** (the `agent-skills-toolkit` RE-ADOPT: repoint CI, then delete the moved copies) -> your review and merge. Phase 0 done.
5. -> **Phase 1** (pm-skills `library.json` - the single highest-leverage conformance fix) -> **Phase 2** (the CI re-pin keystone) -> Phases 3-5, per [`02-roadmap.md`](02-roadmap.md).
6. Backlog and the Codex workstream slotted whenever you choose.

The discipline throughout: no clause lands without a named enforcing check, nothing lands from a non-conforming exemplar, and every cross-repo PR is one-per-repo with your sign-off before merge.

## Where everything lives (quick links)

| You want... | Read |
|---|---|
| What to do next (this) | `REVIEW-AND-NEXT-STEPS.md` |
| The why of the whole system | [`OVERVIEW.md`](OVERVIEW.md) |
| The package map | [`00-README.md`](00-README.md) |
| The 17 decisions | [`03-decisions.md`](03-decisions.md) |
| Any still-open question + its dossier | [`05-open-questions.md`](05-open-questions.md) |
| Phase 0 (plan + change manifest) | [`plans/`](plans/phase-0-truth-and-relocation.md) |
| The spike evidence | [`spikes/`](spikes/runner-consumption-spike.md) |
| Bronze/Silver/Gold + per-repo standing | [`06-tier-requirements.md`](06-tier-requirements.md) |
| Repo health + the deferred backlog | [`../2026-06-20_repo-health-review.md`](../2026-06-20_repo-health-review.md) |
