---
title: "B3 - Phase 1: close the pm-skills P0 conformance holes"
description: "Approval-gated Lane B package to give pm-skills a root library.json, generated-manifest tooling, and remove its embedded self-listing marketplace, closing the L2 and L3 listing-contract violations"
status: "draft"
last-updated: "2026-07-03"
---

# B3 - Phase 1: close the pm-skills P0 conformance holes

This is an approval-gated Lane B package. Per ruling R2 (cross-repo gate), anything touching a repo other than `agent-plugins` is staged with a recommendation and fires only on the maintainer's per-package go. This package touches `pm-skills` (a sibling repo) and therefore never merges autonomously. It operationalizes Phase 1 of the locked roadmap - see [Phase 1 in 02-roadmap.md](../../standards-plan-roadmap/02-roadmap.md) - without restating any decision rationale.

For where this sits in the whole program, see [03-execution-plan.md](../03-execution-plan.md) (two-lane model and sequencing) and the sibling Lane B packages, especially [B1 (PR-A: ship the org gate)](B1-pr-a-org-gate.md) and [B2 (PR-C: askit re-adopt)](B2-pr-c-askit-readopt.md).

## 1. Purpose

pm-skills is the only family member sitting below Bronze - it carries no root `library.json` and ships an embedded self-listing marketplace. Both are P0 holes flagged in the 2026-06-10 conformance snapshot and still open across three releases since (v2.28.0, v2.29.0, v2.29.1). This package gives pm-skills three things in one deliberate in-repo session:

1. A root `library.json` pinning the Standard (version `"0.12"`) with a declared tier - closes L3 (binds the Standard by version pin).
2. Repo-local generated-manifest tooling so pm-skills' roughly 85 (about 87 counting the two registered hooks) components (about 68 skills plus 6 subagents, 10 workflow commands, and the chain contract) are generated into the manifest, never hand-enumerated into drift.
3. Removal of the embedded self-listing `.claude-plugin/marketplace.json` (the Standard's Section 12 anti-pattern) - closes L2 (independently valid, one-way pointing, no embedded self-listing).

The listing-contract clauses this closes are L2 and L3 in [CONTRIBUTING.md](../../../../CONTRIBUTING.md) Section 8, both tracked "Advisory" against pm-skills since 2026-06-10. The convergence detail lives in the [pm-skills convergence packet](../../convergence/pm-skills-conformance.md); this package is the approval wrapper and the execution runbook, not a restatement of that packet.

Why this matters beyond pm-skills: Phase 2 (the CI re-pin keystone) cannot flip its check from advisory to blocking until every member carries a `library.json` with a `standard` pin. pm-skills is the last member that cannot satisfy that check, so closing these holes is the named precondition for the Phase 2 blocking flip.

## 2. Why in-repo, per D7 (no new init/listing skill)

D7 (no new init/listing skill) forbids `agent-plugins` from growing a scaffolding or init skill; scaffolding stays in the toolkit (`askit-init-plugin`, `askit-init-marketplace`, `askit-migrate`), and `agent-plugins` owns only the listing contract plus the CI gate. Phase 1 is deliberately a pm-skills-internal session, not a drive-by PR from `agent-plugins`. The generated-manifest tooling is repo-local to pm-skills for two concrete reasons: pm-skills operates at roughly 85 components and already runs a large proprietary validator suite, so the generator must fit that repo's own conventions rather than import a foreign toolchain. See D7 in [03-decisions.md](../../standards-plan-roadmap/03-decisions.md).

## 3. Dependencies and sequencing

- Depends on Phase 0 being landed - [B1 (PR-A: ship the org gate)](B1-pr-a-org-gate.md) green and the PR-B relocation merged, giving the Standard its final pinned home. pm-skills must pin the Standard at its singular relocated home and version, not a soon-to-move path. Verification of "passes Universal" runs the relocated runner, which Phase 0 stands up. [B2 (PR-C: askit re-adopt)](B2-pr-c-askit-readopt.md) is expected complete by this point but is NOT a hard predecessor - askit's re-adoption is unrelated to pm-skills' convergence.
- Unblocks Phase 2. Once pm-skills carries a valid `library.json` and is CI-green, the [Phase 2 re-pin check](../06-ci-plan.md) can flip to blocking with all four members green.

## 4. The tier declaration question (recommendation attached)

There is one genuine open decision, and it is a real conflict between the roadmap prose and the audited reality. The roadmap's Phase 1 exit gate names `convergent tier` (Silver), yet also says pm-skills need only "pass Universal at its pinned commit." Those two clauses are in tension: the tier ceiling mechanism (D12) means the gate fails on any error at or below the declared tier, so declaring `convergent` makes the gate check the full Silver spine. The tier audit in [06-tier-requirements.md](../../standards-plan-roadmap/06-tier-requirements.md) records pm-skills as still carrying live Silver blockers beyond the Bronze floor (S1 agent-targets, S2 prefix, S3/S8 components index and mirror, S4 chain-contract form needing conversion to the 3.6 may-invoke form). Declaring `convergent` while those remain unmet would land pm-skills CI red, not green.

| Option | What is declared in library.json | Consequence |
|---|---|---|
| A (recommended) | `tier: universal` (Bronze) now | Closes L2/L3, passes green immediately, unblocks the Phase 2 blocking flip. The convergent/Silver ascent (remediating S1-S8) becomes a scoped follow-on on pm-skills' own pull cadence per D2. |
| B | `tier: convergent` (Silver) now | Honors the roadmap's exit-gate wording, but requires remediating all Silver blockers in the same session - a materially larger scope that couples P0 hole-closure to full Silver convergence and risks a red gate mid-flight. |

**Recommendation: Option A.** Declare `tier: universal` to close the two P0 holes fast and unblock Phase 2, then pursue Silver as a tracked follow-on. This keeps Phase 1 small, green, and reversible, and it matches the exit gate's operative clause ("passes Universal at its pinned commit"). If the maintainer prefers Option B, the scope of this package must be widened to include the S1-S8 remediation and its verification. This choice is recorded in [08-decision-register.md](../08-decision-register.md) as [DR-10 (pm-skills tier)](../08-decision-register.md), an open decision awaiting the maintainer's ruling.

**Framing note - this is an exit-criteria amendment, not a refinement.** The locked roadmap's Phase 1 exit gate names `convergent tier`, so ruling universal-now is a formal amendment of that exit criterion, not merely an execution-time reading of it. If the maintainer rules Option A, two obligations follow: (1) write the ruling back into the planning package - an LA-2-style maintenance edit updating the Phase 1 exit wording in [../../standards-plan-roadmap/02-roadmap.md](../../standards-plan-roadmap/02-roadmap.md) to cite DR-10 (pm-skills tier) - so the roadmap and the executed reality agree; and (2) add a Silver burndown follow-on with a named owner (the pm-skills convergence packet) to [10-backlog.md](../10-backlog.md), so the tier ceiling (D12) cannot silently absorb the unresolved S1-S8 Silver work once check 8 goes blocking. The alternative (Option B) widens this package to clear the Silver blockers now and declare `convergent`, honoring the roadmap wording as written, at the cost of a materially larger scope that delays Phase 1 and the check-8 blocking flip.

## 5. Change manifest (pm-skills repo)

| Change | Path | Notes |
|---|---|---|
| ADD root `library.json` | `pm-skills/library.json` | `standard: "0.12"`, `tier` per Section 4, `version` matching the current pm-skills release line, a generated `components` index, and `agent-targets`. Authored source-of-truth per the Standard. |
| ADD generated-manifest tooling | `pm-skills/scripts/` (repo-local) | A generator that emits the `components` index (and regenerates `.claude-plugin/plugin.json`) from on-disk components, plus a `--check` drift mode for CI. Roughly 85 components enumerated by generation, never by hand. |
| REMOVE embedded self-listing | `pm-skills/.claude-plugin/marketplace.json` | Deletes the Section 12 anti-pattern. Association becomes one-way (marketplace points to plugin; plugin does not point back). Closes L2. |
| REGEN native manifest | `pm-skills/.claude-plugin/plugin.json` | Regenerated from `library.json` so version and component set agree everywhere. |
| RECORD decision | `pm-skills/docs/internal/decisions/` | A MADR ADR in pm-skills' own decision home for the marketplace removal and `library.json` adoption, replacing the deliberate back-compat retention scoped in the pm-skills convergence packet. Number allocated by pm-skills at land, not here. |

No Standard version is allocated by this package. pm-skills pins the existing relocated Standard 0.12; per R3 (version ruling), 0.13 stays reserved for the U13 skill-registration burndown. pm-skills' own plugin version is allocated by its release process, not by this package.

## 6. Generated-manifest tooling and the proprietary validator (coexistence, not replacement)

pm-skills already runs an extensive home-grown validator: `validation.yml` drives roughly 40 bash/pwsh script pairs on a Windows plus Ubuntu matrix (skill-manifest currency, AGENTS.md sync, family-contract checks, version consistency, sample coverage, trigger-fixture structure, reciprocal-boundary pointers). pm-skills does not currently check out or run the toolkit's `scripts/check.mjs`.

This package does not replace that apparatus. The new generated-manifest tooling coexists with it:

- The proprietary suite keeps running unchanged. It continues to be pm-skills' authoring-quality gate.
- The generator produces the `library.json` `components` index and regenerates the native manifest; its `--check` mode can be added as one more job in the existing `validation.yml` so a drifted manifest fails CI the same way the other 40 checks do.
- Universal (Bronze) conformance is verified by the relocated 30-check runner (the Bronze subset) stood up in Phase 0, run against pm-skills at its pinned commit. Whether pm-skills also wires the reusable caller (D14) into its own CI is a follow-on adoption step, not a hard requirement of the Phase 1 exit gate, which needs only that pm-skills passes Universal at the pinned commit.

The design intent is additive: pm-skills gains a manifest that satisfies the family Standard while retaining the deeper repo-specific validation it already trusts.

## 7. Steps

1. Confirm Phase 0 is landed (relocated Standard home live, reusable gate shipped). If not, hold.
2. Coordinate a merge window with the pm-skills release cadence (see Risks) so the convergence work does not race a release.
3. In a pm-skills feature branch: build the repo-local generator, author `library.json` (tier per the Section 4 ruling), regenerate `.claude-plugin/plugin.json`, delete the embedded `.claude-plugin/marketplace.json`, and record the MADR ADR.
4. Add the generator `--check` drift job to `validation.yml`.
5. Open the pm-skills PR. Run a Codex adversarial review and answer it.
6. Verify (Section 8). Merge on the maintainer's go and cut the pm-skills release per its own process.
7. Re-pin pm-skills in the `agent-plugins` registry (Section 8).

## 8. Verification

- The generator is deterministic: re-running it produces no diff, and `--check` passes.
- pm-skills carries a valid root `library.json` with `standard: "0.12"` and a declared `tier`; versions agree across `library.json`, `.claude-plugin/plugin.json`, and the release tag.
- No `.claude-plugin/marketplace.json` remains in pm-skills.
- pm-skills passes Universal (Bronze) at its pinned commit via the relocated runner - zero errors.
- pm-skills CI is green (the proprietary suite plus the new drift job).
- Registry re-pin follows the re-pin checklist in [CONTRIBUTING.md](../../../../CONTRIBUTING.md) Section 7: the pinned sha sits on the release tag with CI green, versions agree everywhere, both CHANGELOG files updated, `strict: true` preserved, registry `validate` green. The re-pin itself is a Lane A change in `agent-plugins` and follows the [07-release-plan.md](../07-release-plan.md) choreography; the pm-skills-side work is what this Lane B package gates.

## 9. Rollback

- Pre-merge: abandon the pm-skills branch. No family state changed.
- Post-merge, pre-re-pin: the registry still points at the prior pm-skills sha, so `agent-plugins` is unaffected; pm-skills can revert the convergence commit and cut a patch.
- Post-re-pin: revert the registry re-pin PR in `agent-plugins` to return the pin to the prior green sha, then address pm-skills separately. The re-pin is a small, single-file, easily reverted change by design.

## 10. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| pm-skills is the most active repo (roughly weekly releases) and has live concurrent agent activity - the convergence branch can race a release and go stale. | High | Coordinate an explicit merge window; rebase immediately before merge; prefer folding the convergence into the next release cut rather than an out-of-band tag. |
| Hand-drift between the roughly 85 components and the manifest. | Medium | The generator plus `--check` drift job makes hand-enumeration impossible to land silently. |
| Option B chosen without scope widening - declaring Silver while S1-S8 are unmet reds the gate. | Medium | Resolve Section 4 before build; if Option B, widen scope to include S1-S8 remediation and verification. |
| The new drift job conflicts with an existing proprietary check on the same manifest. | Low | Scope the drift job narrowly to the generated index; treat the proprietary suite as authoritative on everything it already owns. |

These roll up into [09-risk-register.md](../09-risk-register.md).

## 11. Recommendation

Approve this package with tier Option A (declare `tier: universal`, pursue Silver as a follow-on). Sequence it immediately after Phase 0 lands and before the Phase 2 blocking flip. Execute it as a deliberate in-repo pm-skills session, coordinated against the pm-skills release cadence, with a Codex adversarial review answered before merge. This closes the last two P0 listing-contract holes in the family and makes "the family is gated to the Standard" a CI fact rather than a claim for all four members.

## 12. Approval checklist (maintainer)

- [ ] Go / no-go on this package.
- [ ] Tier ruling: Option A (universal now) or Option B (convergent now, scope widened).
- [ ] Confirm Phase 0 is landed before this fires.
- [ ] Confirm the pm-skills merge window is coordinated against its release cadence.
- [ ] Confirm the registry re-pin (Lane A) follows the CONTRIBUTING.md re-pin checklist after the pm-skills release.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
| 2026-07-03 | verifier fixes applied (lead-ruled) |
| 2026-07-03 | adversarial-panel fixes applied (lead-ruled) |
| 2026-07-03 | Codex external-review fixes applied (lead-ruled) |
