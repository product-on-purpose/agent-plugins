---
title: "Decision Register"
description: "Maintainer decisions for the standards program: rulings made 2026-07-03 and open items awaiting confirmation, with recommendations"
status: "draft"
last-updated: "2026-07-03"
---

# 08. Decision Register

This register operationalizes the maintainer-decision items surfaced in the lead audit ([01-audit-2026-07-03.md](01-audit-2026-07-03.md), synthesis section 6) plus the rulings the maintainer gave in this 2026-07-03 session. It invents no new decisions and allocates no version, ADR, or section numbers; every RULED row quotes a constraint already fixed this session, and every OPEN row is a recommendation, not a decision.

Part 1 lists what is settled. Part 2 lists what is not, with an id (`DR-1` onward, plus `LA-7`), a recommendation and reasoning, what the item gates, which package resolves it, and urgency.

## Part 1: Ruled (2026-07-03, this session)

| ID | Handle | Status | What it settles | Applied in |
|---|---|---|---|---|
| R1 | scope | RULED | The full program is planned, but this session executes writes only inside agent-plugins (Lane A). | [03-execution-plan.md](03-execution-plan.md) (two-lane model), [04-lane-a-plan.md](04-lane-a-plan.md) |
| R2 | cross-repo gate | RULED | Anything touching another repo (including `product-on-purpose/.github`) is a staged, approval-gated Lane B package with a recommendation; nothing fires without the maintainer's per-package go. | [03-execution-plan.md](03-execution-plan.md) (gating logic), all of [05-lane-b/](05-lane-b/) |
| R3 | version ruling | RULED | Phase 0 is structural, ADR-only; no Standard version bump. 0.13 stays reserved for the U13 (skill-registration) burndown. Settles synthesis item 2 (Phase 0 version-bump ruling): RULED, no bump. | [04-lane-a-plan.md](04-lane-a-plan.md) (PR-B task), [07-release-plan.md](07-release-plan.md) |
| R4 | suite home | RULED | This execution suite lives at `docs/internal/execution/` in jp-library document formats; it is the current, canonical planning surface for the program. | This package (00-README.md and every file here) |
| R5 | Lane A merges | RULED | After the maintainer's overall "go," Lane A PRs are merged autonomously by the orchestrator (Fable) once the validate gate is green and a Codex adversarial review has run and been answered. | [04-lane-a-plan.md](04-lane-a-plan.md) (merge criteria), [11-agent-operations.md](11-agent-operations.md), [06-ci-plan.md](06-ci-plan.md) |
| R6 | branch protection | RULED | Lane A flips `required-status-checks` `strict:true` on agent-plugins `main`. `enforce_admins` stays `false`, recorded as a documented residual risk rather than fixed. | [04-lane-a-plan.md](04-lane-a-plan.md) (a Lane A task), [09-risk-register.md](09-risk-register.md) |
| R7 | PR-B staging | RULED | The PR-B relocation branch is fully built and its PR opened during Lane A, but its merge is held until PR-A (ship the org gate) is approved and runs green. | [04-lane-a-plan.md](04-lane-a-plan.md) (build-and-open task), [B1](05-lane-b/B1-pr-a-org-gate.md) (merge-gate condition) |
| - | authorize execution | PARTIALLY RULED | Synthesis item 1 (authorize execution). The mechanism is fixed (R1 scope, R2 cross-repo gate, R5 Lane A merges): Lane A proceeds once the maintainer gives an overall "go"; Lane B packages stay gated per-package regardless of that go. The go event itself has not yet been given. | [03-execution-plan.md](03-execution-plan.md) (authorization gate), [04-lane-a-plan.md](04-lane-a-plan.md) (kickoff condition) |
| - | program-roadmap reconciliation | RULED via R4 | Synthesis item 6 / OQ-7 (program-roadmap reconciliation). R4 (suite home) resolves OQ-7's fold-in-vs-point-at choice: absorb `program-roadmap.md`'s unique sites/orchestration outcome framing into [02-prd.md](02-prd.md), then add a one-line supersede banner atop `program-roadmap.md` pointing here. Not a deletion. | [02-prd.md](02-prd.md) (absorption), `docs/internal/program-roadmap.md` (banner, a Lane A edit) |

R1-R7 are maintainer rulings from this operational session, not new entries in the standards-plan-roadmap package's locked D1-D17 decision set ([03-decisions.md](../standards-plan-roadmap/03-decisions.md)). They carry no D-number and do not reopen or amend any D-numbered decision.

## Part 2: Open (recommendation given, confirmation needed)

Urgency: High = blocks the next actionable Phase 0 step; Medium = blocks a later phase or a fleet-wide campaign, not Phase 0; Low = no gate anywhere in this program.

| ID | Question | Recommendation | Decides in | Urgency |
|---|---|---|---|---|
| DR-1 | npm-`check` resolution mechanism for askit's re-adoption | Pinned `.standards-runner/` checkout | [B2](05-lane-b/B2-pr-c-askit-readopt.md) | High |
| DR-2 | Run all three Phase 0 PRs together, or PR-A first with a throwaway caller? | PR-A first, throwaway caller | [B1](05-lane-b/B1-pr-a-org-gate.md) | High |
| DR-3 | Extend agent-plugins' new strict:true posture (R6, branch protection) to the other four repos? | Yes, per repo | [B4](05-lane-b/B4-fc-0001-and-phase-3.md) | Medium |
| DR-4 | Rule "writing-style-catalog" as the one true name? | Yes, explicit ADR | Lane A ([04-lane-a-plan.md](04-lane-a-plan.md)), follow-on ADR after Phase 0 lands | Low |
| DR-5 | OQ-5 (release executor): release-please vs askit-release, per repo | Proceed with the hybrid direction already set; do not re-open | [B6](05-lane-b/B6-phase-5-process-hooks.md) | Medium |
| DR-6 | HISTORY.md per-repo disposition consistency | Converge on "surface first"; treat pm-skills' backfill as a bonus, not a requirement | [B5](05-lane-b/B5-phase-4-ci-and-section-14.md), confirmed in [B6](05-lane-b/B6-phase-5-process-hooks.md) | Medium |
| DR-7 | thinking-framework-skills re-pin cadence | Leave to tfs's own pace | Owner: tfs (out of program critical path) | Low |
| DR-8 | `decisions/0001:14`'s `v0.8` mention: sweep or preserve? | Preserve as historical | Lane A ([04-lane-a-plan.md](04-lane-a-plan.md), PR-B sweep exclusion) | Low |
| DR-9 | Per-repo product decisions (pm-skills #136/#148, writing-style-catalog `entry-recommender`, `pm-skills-mcp` scoping) | Route to backlog, out of program | [10-backlog.md](10-backlog.md) | Low |
| DR-10 | pm-skills tier: does the new `library.json` declare `universal` now (Silver/convergent as a follow-on), or `convergent` immediately? | Universal now (Option A in [B3 (Phase 1 pm-skills)](05-lane-b/B3-phase-1-pm-skills.md)) | B3 approval | High |
| LA-7 | This repo's `_agent-context` dissolution: now or with Phase 3 campaigns? | Defer to campaigns | [04-lane-a-plan.md](04-lane-a-plan.md) now (scheduling); [B4](05-lane-b/B4-fc-0001-and-phase-3.md) for the campaign | Medium |

### DR-1: npm-`check` resolution mechanism
Askit's re-adoption CI step must resolve the relocated standards checker: a pinned `agent-plugins` checkout under gitignored `.standards-runner/`, or an npx-from-git wrapper. Recommend the pinned checkout, matching the Phase 0 plan's own existing recommendation: it gives a reproducible, SHA-pinned dependency consistent with the family's re-pin conformance model, while npx-from-git resolves a moving ref at CI time, the exact drift failure mode the Phase 2 re-pin check exists to catch. The wiring is untested in askit's real setup (Medium confidence per the audit), so B2 (PR-C askit readopt) should verify it live before any deletion. Gates Task C-1 Step 2 and the "no deletion before green" invariant.

### DR-2: PR-A-first-with-throwaway-caller
The reusable-workflow two-checkout wiring has never executed end-to-end. Recommend validating it with a disposable caller before repointing askit's real CI: this isolates a wiring bug against a scratch workflow rather than against the repo the family's conformance gate depends on, for the cost of one short-lived branch. Gates whether B2 starts from a validated or an unverified reusable workflow.

### DR-3: other repos' branch protection
R6 (branch protection) fixes agent-plugins only. GOVERNANCE.md's allocation-at-land serialization is only as strong as its weakest repo, so a family member without `strict:true` can still land a colliding version or ADR number without a forced rebase. Recommend extending the same posture per repo as an admin-settings change, not a Standard clause, since it needs no amendment or check, only a maintainer action per repo. Gates whether the serialization guarantee closes fleet-wide or only for agent-plugins.

### DR-4: canonical writing-style-catalog name
Every live source (the registry, the repo's own name, its CHANGELOG) already agrees on "catalog"; "library" survives only in stale governance-doc citations (GP-4, stale version refs) and one drift-prone draft. Recommend a short explicit ADR recording the ruling, riding in after Phase 0's relocation ADR lands rather than folded into it, since it is a separate question. Not blocking: the mechanical sweep fixes the citations regardless of whether the ADR exists.

### DR-5: OQ-5 (release executor)
OQ-5 (release executor) is direction-set, not fully closed: the per-repo EXECUTE-layer choice is deliberately deferred to Phase 5 so it lands alongside the release-subsystem clause (D8, release subsystem, three layers) rather than ahead of it. Recommend proceeding on that existing sequencing; nothing in this audit changes it. Gates Phase 5's per-repo release-subsystem ADRs.

### DR-6: HISTORY.md per-repo disposition consistency
Three 2026-06-10 audits chose differently: askit and tfs surfaced gaps first, pm-skills backfilled immediately. D16 (HISTORY.md: amend and grandfather) already rules the mechanism, warn-then-error; only the rollout posture varies. Recommend converging on "surface first" as the family default and treating pm-skills' backfill as a repo-level bonus rather than requiring the others to match it, since forcing early backfill would front-load work Phase 4/5 does not require. Gates whether the rollout reads as one policy or three once the checks go live.

### DR-7: thinking-framework-skills re-pin cadence
tfs's own re-pin timing is a per-repo pull decision under D2 (rollout: Hybrid). Recommend leaving it to tfs's pace rather than imposing a program deadline. Its Gold claim being unverified against current Standard 0.12 (GP-6, version-pin lag) is a conformance-honesty issue for tfs's own CHANGELOG, not something any Phase 0-5 gate in this program requires resolved. Gates nothing in this program; gates only tfs's own Gold-tier credibility.

### DR-8: `decisions/0001:14` `v0.8` mention
Every other `0.8` citation the Phase 0 sweep targets is a stale current-state claim; this one sits inside an already-Accepted ADR describing what was true when the decision was made. Recommend preserving it as a point-in-time historical record rather than sweeping it to 0.12, since MADR records are immutable once accepted and rewriting it would falsify the history it exists to preserve. The sweep's own verify-grep would not catch either choice, so this needs an explicit exclusion, not a mechanical default.

### DR-9: per-repo product decisions
pm-skills #136 (release-please spike) and #148 (`awesome-codex-plugins` listing), writing-style-catalog's `entry-recommender` go/no-go, and the open `pm-skills-mcp` scoping question are product questions internal to each repo, with no dependency on the Standard, CI, or governance mechanics this program changes. Recommend cataloging them in [10-backlog.md](10-backlog.md) under an out-of-program section rather than deciding them here, so the backlog stays complete without letting product questions block governance execution.

### DR-10: pm-skills tier (universal-now vs convergent-now)
The live tier audit ([06-tier-requirements.md](../standards-plan-roadmap/06-tier-requirements.md)) shows pm-skills still carries real Silver blockers beyond the Bronze floor: S1 (agent-targets), S2 (prefix), S3/S8 (components index and mirror), and the S4 chain-contract form (needing conversion to the 3.6 may-invoke form). Declaring `convergent` (Silver) immediately would check the full Silver spine under the tier ceiling mechanism (D12) and would red the gate mid-flight, since those blockers are unresolved. Recommend Option A (see [B3 (Phase 1 pm-skills)](05-lane-b/B3-phase-1-pm-skills.md) Section 4): declare `tier: universal` (Bronze) now, closing the L2/L3 P0 holes and passing green immediately, with the Silver ascent pursued as a scoped follow-on on pm-skills' own D2-pull cadence. This refines the roadmap's Phase 1 exit-gate wording (which names "convergent tier") rather than contradicting it: the exit gate's operative clause is "passes Universal at its pinned commit," and Option A honors that clause literally while deferring the tier label. Gates B3's own approval checklist item ("Tier ruling: Option A or Option B") before the package can fire.

### LA-7: `_agent-context` dissolution timing
D5 (dissolve `_agent-context`) is already one of the five Phase 3 mechanical push campaigns (C1-C5) planned fleet-wide, one PR per repo. Recommend deferring agent-plugins' own dissolution to that campaign rather than doing it early: a standalone cleanup now fixes this repo while the other three still hold the pattern, recreating the per-repo drift the campaign model exists to prevent in one coordinated pass. The three session logs currently inside this repo's own `_agent-context` need a landing place before deletion, which the Phase 3 campaign plan should specify once, not twice. Gates whether Lane A schedules a one-off cleanup now or waits for campaign C4.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | Created: Part 1 rulings (R1-R7, synthesis items 1-2, and OQ-7) and Part 2 open items (DR-1 through DR-9, LA-7) drafted from [01-audit-2026-07-03.md](01-audit-2026-07-03.md) synthesis section 6 and the maintainer's in-session rulings. |
| 2026-07-03 | verifier fixes applied (lead-ruled) |
