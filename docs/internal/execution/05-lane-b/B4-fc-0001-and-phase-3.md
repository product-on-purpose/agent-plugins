---
title: "B4 - FC-0001 orchestration pilot and Phase 3 scaffolding amendment plus campaigns"
description: Approval package for the FC-0001 casing pilot and the Phase 3 coordinated Standard amendment plus fleet campaigns C2 through C5
status: draft
last-updated: "2026-07-03"
audience: engineer
level: advanced
---

# B4 - FC-0001 orchestration pilot and Phase 3 (scaffolding and dual-audience)

This is a Lane B (cross-repo, approval-gated) package. Per ruling R2 (cross-repo gate), nothing here fires without the maintainer's per-package go: this document is a recommendation with change manifests, not an authorization. It operationalizes, and never restates, the locked planning package at [standards-plan-roadmap](../../standards-plan-roadmap/00-README.md) and the fleet [orchestration guide](../../orchestration/guide.md) plus the [orchestration-capability spec](../../orchestration/specs/orchestration-capability.md). The campaign detail it points at lives in the [orchestration-campaigns draft](../../standards-plan-roadmap/drafts/orchestration-campaigns.md); this file carries only the manifest, verification, rollback, and approval surface.

It sits inside the two-lane model in [03-execution-plan.md](../03-execution-plan.md), draws its risks into [09-risk-register.md](../09-risk-register.md), and its rulings into [08-decision-register.md](../08-decision-register.md). It has two stages joined by one hard gate.

- Stage 1 - FC-0001 (casing pilot): the first real exercise of the fleet-campaign machinery, run as one low-risk campaign.
- Stage 2 - Phase 3 (scaffolding and dual-audience): the one coordinated Standard amendment, then the remaining fleet campaigns C2 through C5.
- The gate: Stage 2 does not open until the FC-0001 retrospective passes.

## 1. Why this package exists

The [program-docs audit](../../orchestration/README.md) found two facts that make an approval package necessary rather than a straight execution plan.

1. The fleet-campaign mechanism has never been exercised. `docs/internal/orchestration/campaigns/` does not exist on disk; the dual-documentation contract (central `spec.md` plus `record.md`, joined to each repo's local CHANGELOG and PR by a stable `FC-NNNN` id) has never run once end to end. Phases 0 and 3 both fan out cross-repo work on top of a capability that is validated by design only.
2. The pilot candidate drifted across three documents without reconciliation: `orchestration/backlog.md` E1.3 (favicon or CI dash-check), `orchestration-capability.md` P2 (same pair), and `program-roadmap.md` (which calls both stale and proposes a CI action-version pin instead). The newer [orchestration-campaigns draft](../../standards-plan-roadmap/drafts/orchestration-campaigns.md) supersedes all three with campaigns C1 through C5. This package ends the drift by naming one pilot and recording the choice.

## 2. Stage 1 - FC-0001, the first fleet campaign pilot

### 2.1 Pilot selection and recommendation

Recommendation (firm): run campaign C1 (the D6 (casing) `_LOCAL` -> `_local` rename) as FC-0001. The `FC-0001` id is allocated at campaign open per the id scheme in the [orchestration-capability spec](../../orchestration/specs/orchestration-capability.md) Section 8; naming it here is the proposal, not a reservation.

Why C1 (casing) is the right first exercise:

- Mechanical and judgment-free. It is Class `uniform-mechanical`; the difference between repos is data in a parameter table, not re-interpretation.
- Reversible. No repo currently tracks files under `_LOCAL/`, so the change is a `.gitignore`-literal edit in four of five repos with no history moved and no `git mv` triggered. A revert is a one-line restore.
- Every repo needs it. The `_LOCAL`/`_local` git case-collision footgun exists fleet-wide; agent-skills-toolkit already carries a gitignore comment documenting the trap.
- It exercises the full machinery: one PR per repo (`chore/fc-0001`), the central `FC-0001/spec.md` plus `record.md`, four local CHANGELOG entries referencing the id, and the pilot-then-fan-out discipline (prove the pilot repo green, fold surprises into the spec, fan out).
- It is independent of Phase 0. The casing hygiene does not touch `STANDARD.md`, the runner, or the org gate ([B1 (ship the org gate)](B1-pr-a-org-gate.md)), so the machinery gets proven early without waiting on the relocation.

The three drifted candidates are declined and the reason recorded: the dash-check is stale (v0.11 retired the no-dashes check, so a fleet dash-check would contradict the Standard), favicon adoption is cosmetic on an off-brand placeholder, and the CI action-version pin is a heavier first blast radius than a pilot warrants. C1 is the lowest-risk item on the C1 through C5 slate that still exercises every part of the contract.

### 2.2 Change manifest (campaign level)

Central artifacts to be created at campaign open (Lane B write, authorized only by this package): `docs/internal/orchestration/campaigns/FC-0001/spec.md` and `record.md`, authored in the capability-spec template. Per-repo edits, condensed from the C1 table in the campaigns draft (read that draft for the full mechanics and the two-step `git mv` note):

| Repo | Edit | Notes |
|---|---|---|
| thinking-framework-skills | none - already `_local/` | PILOT; proves the no-op baseline first |
| pm-skills | `.gitignore` `_LOCAL/` -> `_local/` | gitignore-only; nothing tracked under it |
| agent-skills-toolkit | drop the dual `_LOCAL/` line and its two comment lines; keep `_local/` | gitignore-only |
| writing-style-catalog | `.gitignore` `_LOCAL/` -> `_local/`; edit `scripts/check-no-dashes.mjs` `SKIP_PREFIX` and `scripts/README.md` | the one non-mechanical repo - a stop-and-flag seam |
| agent-plugins | `.gitignore` `_LOCAL/` -> `_local/` | control-repo hygiene; low risk; may run in Lane A instead if the maintainer prefers (open item in Section 6) |

Local artifact per repo: a `chore/fc-0001` branch, a CHANGELOG entry referencing FC-0001, and a PR that is opened but not merged.

### 2.3 Dual-documentation contract

The central `record.md` tracks repo -> branch -> PR -> CI -> state and any flag or deviation. Each repo's own CHANGELOG and PR reference `FC-0001` and record only what is local. Neither side copies the other; the id is the join. This pilot's real job is to demonstrate that contract works before Phase 0 and Phase 3 depend on it.

### 2.4 Verification (per repo)

- `grep -rn '_LOCAL' .gitignore scripts .github site/scripts` returns only `_local`, nothing else.
- The repo's existing CI (`validate` or `ci`) is green on the PR.
- writing-style-catalog only: the `validate` job is still green after the `check-no-dashes.mjs` `SKIP_PREFIX` edit, proving the dash-check still skips scratch.
- The `FC-0001/record.md` status table is filled with a PR link and CI state for every repo, or an explicit FLAGGED row with a reason (no silent skips).

### 2.5 Rollback

Because nothing tracked moves, rollback is trivial: revert the per-repo PR (a one-line `.gitignore` restore, plus the script and README restore in writing-style-catalog). No git history is lost. The `FC-0001/record.md` marks any rolled-back repo with the reason, keeping the central record honest.

### 2.6 Stop-and-flag seams (must hand back, not guess)

- writing-style-catalog is not a pure gitignore edit: the `SKIP_PREFIX` and `scripts/README.md` literals must land in the same PR or the dash-check can go red. Confirm green before continuing.
- writing-style-catalog has shown live concurrent agent activity in audit; open the branch and PR, do not merge, and reconcile with any in-flight work.
- Any repo where a `_LOCAL` literal is found in tooling (`scripts/`, `.github/`, `site/scripts/`), or where on-disk `_LOCAL/` content is not gitignored, is a flag, not a blind rename.

## 3. The retrospective gate (Stage 1 to Stage 2)

Stage 2 MUST NOT open until an FC-0001 retrospective confirms the capability is proven, matching the capability spec's definition of done:

- One central `spec.md` plus `record.md` exist and are complete.
- Four local PRs each reference `FC-0001`; all merged green or explicitly flagged with a reason.
- The dual-documentation link (id on both sides, no duplication) is demonstrated.
- Any surprise met during the fan-out is folded back into the campaign format before the larger campaigns inherit it.

If the retrospective surfaces friction in the Level-2 fan-out, the fix lands in the orchestration spec first; the C2 through C5 campaigns do not proceed on an unproven mechanism. This gate is the whole reason to run C1 as a pilot rather than folding it silently into the Phase 3 slate.

## 4. Stage 2 - Phase 3 (scaffolding and dual-audience)

Stage 2 has one coordinated Standard amendment landing through GOVERNANCE in agent-plugins, then the remaining fleet campaigns. It is a separate maintainer go, requested only after the Stage 1 retrospective passes.

### 4.1 The one coordinated Standard amendment

One amendment, landed as a single coordinated edit (text plus a version bump plus one ADR), covering the Phase 3 decisions per the authoritative roadmap and decision record:

- D5 (dissolve `_agent-context`) and D6 (casing): the canonical plugin-repo and marketplace folder layout. Clause text staged in [standard-amendments.md](../../standards-plan-roadmap/drafts/standard-amendments.md) group A; templates and the `.gitignore` diff in [agents-md-and-context.md](../../standards-plan-roadmap/drafts/agents-md-and-context.md).
- D10 (cross-tool targeting): AGENTS.md as the single canonical source plus the thin per-tool shim contract (never a divergent copy).
- D11 (frontmatter schema): one schema per artifact type (skill, ADR, doc, spec), with the three new checks. Schema reference in [frontmatter-schemas.md](../../standards-plan-roadmap/drafts/frontmatter-schemas.md).
- D8 (release subsystem), PLAN layer only: the `release-plans/plan_vX.Y.Z/` convention. Per the authoritative sources this PLAN clause lands in Phase 3; only the EXECUTE and NOTES decision is Phase 5. See the drift note in Section 5.

Allocation-at-land holds: the Standard MINOR version, the ADR number, and the new section and reqId numbers are assigned when the amendment lands through governance, never here. This bump is distinct from the reserved 0.13 (U13 skill-registration burndown) held by ruling R3; the Phase 3 minor is a later, separately-allocated number.

Hard dependency: the amendment edits `STANDARD.md`, which today lives at `agent-skills-toolkit`, not in agent-plugins. It cannot land until Phase 0 relocation has moved the Standard and runner into `agent-plugins/standards/`. Stage 2 is therefore gated behind Phase 0 (the relocation, [B1 (ship the org gate)](B1-pr-a-org-gate.md) and its PR-B (atomic agent-plugins LAND), staged per ruling R7).

### 4.2 Sequencing (the conforming-exemplar order)

Per the sequencing invariant (no clause is ratified from a non-conforming exemplar), the mechanical file pushes that make the fleet conform run ahead of the clause that mandates them, then the repo adopts the clause on its own cadence by re-pinning the Standard version (PULL, never pushed). Concretely:

1. C1 (casing) is already complete as FC-0001, so the fleet is casing-conforming before the folder-layout clause ratifies.
2. C2 (decision-home convergence), C3 (CLAUDE.md shim), and C4 (`_agent-context` dissolution) push their files, making the fleet conform to the decision-home, shim, and context-layer conventions.
3. The coordinated amendment (Section 4.1) ratifies from the now-conforming fleet.
4. C5 (frontmatter keys) fans out last; it MUST NOT open until D11 has landed as a Standard clause with a named enforcing check.

This is the source draft's ordering. It refines the shorthand "amendment then C1 through C5": C1 runs first as the pilot, C2 through C4 push ahead of the clause, and only C5 is strictly post-amendment. The reconciliation is flagged for the lead in Section 6.

### 4.3 Campaign change manifests (C2 through C5)

Condensed from the campaigns draft; read it for per-repo parameter tables, `git mv` mechanics, and full stop-and-flag rules. Each campaign is one PR per repo (`chore/fc-NNNN`, id allocated at open), each green on its own CI, with the central `campaigns/FC-NNNN/` record and local CHANGELOG join.

| Campaign | Uniform change | Non-mechanical seam |
|---|---|---|
| C2 (decision homes) | Converge decision homes to `docs/internal/decisions/` MADR 4.0; writing-style-catalog `adr/` -> `decisions/` two-step rename (pilot) | pm-skills converts one `DECISIONS.md` log into per-decision MADR files - a deliberate in-repo session, not a blind fan-out; coupled with C4 |
| C3 (CLAUDE.md shim) | Add the thin AGENTS.md-referencing shim to the two repos missing it (thinking-framework-skills, agent-skills-toolkit) | Copy the shim shape, not content; confirm the repo declares `claude` in `agent-targets` first |
| C4 (`_agent-context` dissolution) | Drop every `_agent-context/` gitignore rule; relocate durable content; agent-plugins `git rm --cached` its committed session-logs into `_local/session-logs/` | pm-skills CI scripts hardcode `_agent-context` paths and must be rewritten in the same PR; run its C2 and C4 in one session |
| C5 (frontmatter keys) | Normalize frontmatter to the ratified D11 schema fleet-wide (agent-skills-toolkit pilot, owns the runner) | GATED on D11 landing; a comma-string to array `keywords` change is a type change - confirm downstream consumers before flipping |

### 4.4 Verification (Stage 2)

- The amendment landed through GOVERNANCE with its version, ADR, and section numbers allocated at land, and CI validates frontmatter per artifact type (the three new checks live under the warn-then-error burndown).
- Each campaign's per-repo acceptance check (from its brief) is green; casing, `adr/` -> `decisions/`, missing shims, and `_agent-context` dissolution are pushed fleet-wide.
- Version pins stay PULL: no campaign pushed a `standard`-field bump; each repo re-adopts on its own cadence.

### 4.5 Rollback (Stage 2)

- The amendment is a governed Standard change: rollback is a follow-up governed amendment (immutable ADR plus a superseding record), not a force-revert.
- Campaign PRs are individually revertible per repo before merge.
- The least reversible step is the pm-skills log-to-ADR conversion in C2 and C4 (real authoring, not a rename). It runs as a deliberate in-repo session with its own review, precisely so it is never fanned out blind and never needs a bulk revert.

## 5. Risks

Drawn into [09-risk-register.md](../09-risk-register.md); summarized here for the approval decision.

1. Unexercised mechanism. The campaign machinery has never run. Mitigation: FC-0001 is the proof, pilot-repo-first, retrospective-gated before any larger fan-out.
2. writing-style-catalog coupling and concurrency. The `check-no-dashes.mjs` `SKIP_PREFIX` edit plus live concurrent agent activity can collide. Mitigation: stop-and-flag, open PR but do not merge, confirm green.
3. Phase 0 dependency. The Stage 2 amendment cannot land until relocation moves `STANDARD.md` into agent-plugins. Mitigation: hold Stage 2 behind Phase 0 and PR-B (staged per ruling R7).
4. Allocation-at-land collision. The coordinated amendment allocates a version, an ADR, and section numbers at land; under `strict:false` two concurrent changes could collide. Mitigation: hold the amendment until the Lane A `strict:true` flip (ruling R6) is live.
5. Draft drift to resolve before paste. The D8 PLAN-layer phase (Phase 3, not Phase 5), the missing D16 (HISTORY.md) amendment text, and the pre-D17 Codex definition in the listing-contract edit must be fixed before the clause text is pasted. Tracked in [08-decision-register.md](../08-decision-register.md); not restated here.
6. The C2 and C4 pm-skills conversion is the one non-mechanical seam in the whole slate. Mitigation: deliberate coupled session, stop-and-hand-back if the claude and codex decision copies conflict.
7. C5 opens before D11 lands. Mitigation: the hard gate in Section 4.2.

## 6. Recommendation

- Approve FC-0001 as campaign C1 (casing), pilot repo thinking-framework-skills, then fan out to the other four. This ends the three-document pilot drift and proves the dual-documentation contract on the lowest-risk change that still exercises all of it.
- Treat Stage 1 as its own per-package go (ruling R2). Authorize creating `docs/internal/orchestration/campaigns/FC-0001/` when the campaign opens.
- Hold Stage 2 behind four conditions, all required: the FC-0001 retrospective passes; Phase 0 relocation is complete; the draft-drift resolution (risk 5) is done; and the `strict:true` flip (ruling R6) is live so allocation-at-land is mechanically serialized.
- Request Stage 2 as a separate per-package go after the retrospective, not bundled with this approval.

Open items for the lead:

- Whether the agent-plugins casing slice runs inside FC-0001 (uniformity) or as a Lane A change (ruling R1). Recommendation: keep it in the campaign for a uniform record, but it is low-risk either way.
- The sequencing reconciliation in Section 4.2: this package follows the source draft's conforming-exemplar order (C2 through C4 ahead of the clause, C5 after), which refines the "amendment then C1 through C5" shorthand. Confirm this reading.

## 7. Approval checklist

- [ ] Approve FC-0001 pilot = campaign C1 (casing); id allocated at campaign open.
- [ ] Confirm pilot repo (thinking-framework-skills) and the fan-out order.
- [ ] Decide whether the agent-plugins casing slice runs in FC-0001 or Lane A.
- [ ] Authorize creating `docs/internal/orchestration/campaigns/FC-0001/` (spec.md plus record.md).
- [ ] (after retrospective) Approve the Stage 2 go as a separate package decision.
- [ ] Confirm Phase 0 relocation is complete before the coordinated amendment lands.
- [ ] Confirm the draft-drift resolution (risk 5) is done before any clause text is pasted.
- [ ] Confirm the `strict:true` flip (ruling R6) is live before the amendment allocates numbers.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
