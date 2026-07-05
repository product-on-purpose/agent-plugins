---
title: "Executive summary - standards program execution"
description: "What the execution package delivers, what your go authorizes, what waits for your per-package approval, and the risk picture"
status: "awaiting-go"
last-updated: "2026-07-03"
---

# Executive summary - standards program execution

> One page for the maintainer. Everything here is expanded in the package documents; start at [`00-README.md`](00-README.md) for the map.

## Where the program stands

The standards program (17 locked decisions, six phases, in [`../standards-plan-roadmap/`](../standards-plan-roadmap/00-README.md)) has been fully planned since 2026-06-20 and frozen at the authorization gate since. A full multi-agent audit on 2026-07-03 ([`01-audit-2026-07-03.md`](01-audit-2026-07-03.md)) confirmed the design is sound and roughly 70 percent of the groundwork is built, but found real stall decay: stale literals in the Phase 0 plan, draft text that would ship wrong law if pasted as-is (a phase misplacement, a missing D16 (HISTORY.md amend + grandfather) amendment, a superseded pre-D17 Codex clause), contradictory version claims across committed docs, and a governance serialization mechanism that branch protection does not actually enforce.

This package turns the frozen plan into an executable program under seven rulings you made in-session (R1-R7, recorded in [`08-decision-register.md`](08-decision-register.md)). The controlling split: **Lane A** (writes only inside `agent-plugins`) runs autonomously after one "go"; **Lane B** (anything cross-repo) is staged as seven approval packages, B1-B7, each firing only on your per-package go.

## What your "go" authorizes (Lane A, this repo only)

In order, per [`04-lane-a-plan.md`](04-lane-a-plan.md), every PR gated by the validate check plus a Codex adversarial review before merge:

1. **Land this package** (PR from `feat/execution-package`, already committed).
2. **Truth sweep** - fix the stale askit pin in the tier table, refresh the CONTRIBUTING.md conformance snapshot, mark `program-roadmap.md` superseded, update AGENTS.md and the control panel.
3. **Draft-drift repair** - the six grep-verified fixes so the staged drafts stop carrying wrong law.
4. **Phase 2 CI keystone, advisory** - check 8 (re-pin conformance) and check 9 (truth-in-targeting) built into `validate-registry.mjs` with CI-gated tests; blocking flips stay gated on the family passing.
5. **Build and open PR-B** (relocate `STANDARD.md` + the 30-check runner into `standards/`), merge **held** until B1 (the org gate) runs green per R7 (PR-B staging).
6. **Flip branch protection `strict:true`** on this repo per R6, with the honest caveat below.

## What waits for you (Lane B, one go each)

| Package | What it is | My recommendation |
|---|---|---|
| [B1 (org gate)](05-lane-b/B1-pr-a-org-gate.md) | Ship + tag `standards-gate.yml` in `product-on-purpose/.github`; throwaway-caller live test against the PR-B branch head | **Approve first.** Net-new, touches no plugin, closes the only unproven assumption |
| [B2 (askit re-adopt)](05-lane-b/B2-pr-c-askit-readopt.md) | Repoint askit CI to the gate; delete moved copies last | Approve after B1 + PR-B are green |
| [B3 (pm-skills Phase 1)](05-lane-b/B3-phase-1-pm-skills.md) | `library.json`, generated manifest (~85 components), drop embedded marketplace | Approve after Phase 0; rule DR-10 (pm-skills tier) with it - universal-now recommended, framed per the Codex review as a formal exit-criteria amendment with roadmap write-back plus a Silver-burndown commitment (BL-28) |
| [B4 (FC-0001 + Phase 3)](05-lane-b/B4-fc-0001-and-phase-3.md) | Casing pilot campaign, then the scaffolding amendment + campaigns | Pilot first; Stage 2 gated on its retrospective |
| [B5 (Phase 4)](05-lane-b/B5-phase-4-ci-and-section-14.md) | Shared astro CI, preset, land Section 14 (astro site standard) | The highest-leverage LAND; after B3/B4 |
| [B6 (Phase 5)](05-lane-b/B6-phase-5-process-hooks.md) | Release executor (OQ-5), commitlint hook, exceptions, conventions | Last by design |
| [B7 (Codex workstream)](05-lane-b/B7-codex-workstream.md) | Native Codex packaging, skills + MCP only | Parallel with Phase 4; pilot-then-fan-out |

**One manual action only you can do:** the gh token lacks the `workflow` OAuth scope, so no workflow file can be pushed anywhere until you run `gh auth refresh -h github.com -s workflow` (one time). This is now a hard precondition in B1 and risk RK-12 (workflow OAuth-scope gap).

## How it was built and checked

Fable (this session) did all top-level planning, briefs, rulings, and merges; **Opus 4.8** subagents authored the judgment-heavy documents and ran the adversarial passes; **Sonnet 5** subagents did the mechanical fan-out - 35+ subagent runs, ~4.8M subagent tokens. Quality trail: 9-agent audit -> 17-author workflow -> two Opus verification passes (18 findings, all lead-ruled and applied) -> deterministic mechanical sweep (writing rules, links, frontmatter) -> internal 3-skeptic adversarial panel (5 findings: 2 HIGH, all dispositioned) -> external Codex adversarial review (verdict needs-attention; 3 HIGH findings - the B5/B7 Codex-targeting dependency hole, B5's gitignored `_LOCAL` dependency, and the pm-skills tier-vs-roadmap contradiction - all accepted and fixed, ledgered as BL-29). The per-PR Codex gate stays in force for every post-go merge.

## The honest risk picture

Top of [`09-risk-register.md`](09-risk-register.md): (1) **stall decay** - the longer the freeze, the more the plans drift from live repos (this package is itself the mitigation, with living-doc updates at every landing); (2) **the live-Actions wiring has never run** - B1's throwaway test exists precisely to close it before anything depends on it; (3) **admin-merge residual** - autonomous Lane A merges use `gh pr merge --squash --admin`, which bypasses required checks including the new `strict:true`; serialization therefore rests on documented orchestrator discipline (one protected-branch PR in flight; numbers re-verified against `origin/main` pre-merge). We say this plainly rather than claiming branch protection does more than it does.

## Success, measured

From [`02-prd.md`](02-prd.md): one normative Standard served from `agent-plugins`; all four members able to pin >= 0.12 via `library.json`; check 8 blocking and green 4/4; truth-in-targeting blocking; Section 14 normative with a shared astro workflow; the release subsystem operational; Codex artifacts round-trip tested; zero silent suppressions; the campaign mechanism exercised.

## Your move

Reply **"go"** to authorize Lane A. B1's approval can come with it or later; each Lane B package states exactly what your go authorizes and how it rolls back.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
