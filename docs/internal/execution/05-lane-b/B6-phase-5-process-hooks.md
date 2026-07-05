---
title: "B6 - Phase 5 (process and hooks) approval package"
description: "Staged, approval-gated cross-repo package that graduates the release EXECUTE layer, the hooks contract, the exceptions rule, and the issue/effort conventions"
status: draft
last-updated: "2026-07-03"
---

# B6 - Phase 5 (process and hooks)

This is a Lane B (cross-repo) approval package. Per maintainer ruling R2 (cross-repo gate), nothing here fires without the maintainer's per-package go, and this document is a recommendation, not an authorization. It operationalizes Phase 5 (process and hooks) of the locked planning package; it invents no decisions and restates no rationale. Sources of record: [02-roadmap.md](../../standards-plan-roadmap/02-roadmap.md) Phase 5, the decision entries [D8 (release subsystem)](../../standards-plan-roadmap/03-decisions.md), [D9 (hooks)](../../standards-plan-roadmap/03-decisions.md), [D12 (exceptions)](../../standards-plan-roadmap/03-decisions.md), [D13 (issue/effort/roadmap conventions)](../../standards-plan-roadmap/03-decisions.md), and the [release-subsystem.md](../../standards-plan-roadmap/drafts/release-subsystem.md) draft. Program context: [03-execution-plan.md](../03-execution-plan.md), release choreography in [07-release-plan.md](../07-release-plan.md).

## Purpose

Phase 5 graduates the last, process-layer decisions once the structural work has settled. This package covers five workstreams:

1. Rule OQ-5 (release executor) - release-please vs `askit-release` per leaf repo, each recorded as a MADR ADR per [D4 (decision homes)](../../standards-plan-roadmap/03-decisions.md). A recommendation per repo is below.
2. Make Conventional Commits load-bearing and ship the one canonical commitlint `commit-msg` hook, per [D9 (hooks)](../../standards-plan-roadmap/03-decisions.md). This hook is the enforcer that unblocks any release automation.
3. Ratify the hook exit-code contract, re-confirmed against the live Claude Code hooks reference at land per OQ-8 (hook contract re-confirm).
4. Land [D12 (exceptions)](../../standards-plan-roadmap/03-decisions.md): ADR plus machine-readable suppression, no silent suppressions, gate honors recorded suppressions.
5. Carry [D13 (issue/effort/roadmap conventions)](../../standards-plan-roadmap/03-decisions.md) as direction only. It is the lowest-urgency decision and MUST be codified against settled practice, likely as an explicit aspirational label, not a hard clause this cycle.

## Phase-drift correction (carry into every plan)

The [release-subsystem.md](../../standards-plan-roadmap/drafts/release-subsystem.md) draft frames its whole content, including the PLAN layer, as landing in Phase 5. That is wrong and must not be inherited. The decision of record ([D8 (release subsystem)](../../standards-plan-roadmap/03-decisions.md) graduates-to line, and 02-roadmap Phase 3) splits the layers: the PLAN-layer `release-plans/plan_vX.Y.Z/` convention lands in Phase 3 (scaffolding and dual-audience); ONLY the EXECUTE and NOTES decision belongs to Phase 5. This package therefore does not touch the PLAN-layer folder convention - it assumes Phase 3 already landed it - and scopes itself to EXECUTE, NOTES, hooks, exceptions, and conventions.

## Dependencies and sequencing

- Sequenced LAST among the Lane B packages. Opens only after [B5 (Phase 4 CI and Section 14)](B5-phase-4-ci-and-section-14.md) has landed.
- Requires [B1 (PR-A org gate)](B1-pr-a-org-gate.md) green: the new checks (hook-shape, suppression-integrity) live in `standards/checks/` and reach the four repos through the D14 reusable workflow that PR-A ships.
- Requires the Phase 0 relocation (PR-B) complete: the hooks and exceptions clauses land in the relocated `agent-plugins/standards/STANDARD.md`, which has no home until relocation finishes.
- Requires Phase 3 landed: the PLAN layer must be in use before an EXECUTE engine is chosen against it.
- Per maintainer ruling R3 (version ruling), Phase 5 clauses land at a Standard MINOR allocated only at land; 0.13 stays reserved for the U13 (skill-registration) warn-to-error burndown, so these clauses take a later minor. No version, ADR, or section number is allocated in this document.

## OQ-5 (release executor) - recommendation per repo

All four picks share one gating precondition: release-please cannot derive a bump without a clean Conventional Commits history, and the commitlint hook only makes commits typed going forward. So no repo wires release-please until the hook has enforced Conventional Commits for at least one MINOR (the Section 7.7 burndown window). Each pick is ruled by the maintainer and recorded as a MADR ADR in that repo's `docs/internal/decisions/` at Phase 5; the table is the recommended default direction, grounded in the committed [audit record](../01-audit-2026-07-03.md) (per-repo release-character findings), not a mandate.

| Repo | Release character (audited) | Recommended EXECUTE | Why |
|---|---|---|---|
| writing-style-catalog | Lightest (3 skills, universal); current `[0.6.0]`-missing-changelog drift | release-please for tag + changelog; `askit-release` gate for readiness | Mechanical bumps tolerate automation, and the bot's forced changelog discipline directly fixes the observed changelog drift |
| thinking-framework-skills | 63 generated skills, Gold-at-pin, rides `[Unreleased]` | release-please for tag + changelog; `askit-release` gate | Generated manifests and a mechanical cadence suit the bot once its stale 0.8 pin and Conventional Commits are cleared |
| pm-skills | ~68-95 components, elaborate `pm-release-conductor` G0-G4, curated narrative releases | `askit-release`-style prepare + gate primary; release-please deferred (its own issue #136 spike) | Heavy per-release judgment and Section 7.4 rollup across many components; least to gain from full automation |
| agent-skills-toolkit | Gold, home of `askit-release`, curated per-feature release packets, Codex round-trip | `askit-release` prepare + notes + gate primary; release-please for deterministic tag only | It authors the release agent and runs the most curated releases; keep the agent authoring, let the bot do git plumbing |

Family-level split (from the draft, unchanged): reposition `askit-release` as prepare-plan-and-verify rather than tag-and-push, so exactly one tool tags per repo; keep the agent-plugins marketplace re-pin bespoke under `validate-registry` and never route it through release-please.

## Change manifests

**agent-plugins (Standard home, post-Phase-0):**
- Land the hooks authoring and exit-code contract clause (D9), with a named hook-shape enforcing check (uses `${CLAUDE_PLUGIN_ROOT}`, emits `hookEventName`), warn-first per Section 7.7.
- Land the exceptions clause (D12) plus a suppression-integrity check: the gate reads a machine-readable suppression and honors it, and flags any suppression with no matching accepted ADR.
- Record D13 as a family-law ADR in `standards/decisions/` carrying the intended direction, marked aspirational (no hard check this cycle).
- Each clause LANDs atomically on the protected branch (one version bump plus one ADR per landing), numbers allocated at land.

**agent-skills-toolkit:**
- Own and ship the one canonical commitlint `commit-msg` hook exemplar.
- Reposition the `askit-release` skill to prepare/verify/notes modes; its `gate` mode feeds the G0/G2.5 readiness checks, the tag is created by the chosen tagger.
- Add the per-repo release-executor ADR (D4).

**each leaf repo (all four):**
- Add the commitlint `commit-msg` hook via a D2 (Hybrid rollout) PUSH campaign, one PR per repo, stop-and-flag (see [orchestration campaigns](../../standards-plan-roadmap/drafts/orchestration-campaigns.md)).
- Add the release-executor ADR (D4) selecting exactly one tagger; wire release-please config or the repositioned `askit-release` accordingly.
- Record any genuine below-ceiling exception as an ADR plus a machine-readable suppression entry (D12); no silent suppressions.

## NOTES layer and the commit-to-release chain

- CHANGELOG.md stays the curated source of truth (Keep a Changelog 1.1.0 plus SemVer); the GitHub Release body is DERIVED from the dated changelog section, never hand-maintained as a separate truth. RELEASE-NOTES.md (Gold check G5) stays distinct from CHANGELOG.md and is not conflated with it.
- The commitlint hook protects the load-bearing chain the release automation reads: Conventional Commit type maps to a SemVer bump maps to a Keep a Changelog category (`fix:` to PATCH/Fixed, `feat:` to MINOR/Added, a `!` or `BREAKING CHANGE:` footer to MAJOR). The full mapping table lives in [release-subsystem.md](../../standards-plan-roadmap/drafts/release-subsystem.md); do not restate it in the clause, reference it.
- This chain composes with the Standard Section 7.4 component-rollup rule: the commit-derived bump and the max-component-bump rollup MUST agree, and any component MAJOR (component removed or renamed, invocation-name change, broken chain contract, raised permissions, or a breaking frontmatter/manifest change) forces a plugin MAJOR.

### What lands, and how each element is enforced

| Element | Layer | Enforcement at land |
|---|---|---|
| commitlint `commit-msg` hook (D9) | prerequisite | hook-shape check, warn-first per Section 7.7 |
| exceptions rule (D12) | governance | suppression-integrity check, warn-first |
| release executor per repo (OQ-5) | EXECUTE | the repo's release CI is the check; recorded by ADR (D4) |
| CHANGELOG curated / Release derived | NOTES | G5 release-notes presence plus changelog-section check |
| issue/effort/roadmap conventions (D13) | conventions | explicit aspirational label, no hard check this cycle |

## Verification

- Commitlint hook: an invalid commit message is blocked (exit 2, stderr fed back); a valid Conventional Commit passes (exit 0, stdout JSON including `hookEventName`). Confirm against the live hooks reference at land (OQ-8), never against the draft alone.
- release-please (where adopted): a dry run opens a release PR with the bump correctly derived from Conventional Commit types, the changelog generated, and the tag created only on PR merge. Confirm the current release-please config surface against its own docs before wiring.
- Repositioned `askit-release`: `gate` mode green (ADR 0022 readiness checks), the plugin version equals the Section 7.4 max-component-bump rollup, exactly one tool tags.
- Exceptions: the gate honors a recorded suppression and a suppression without a matching accepted ADR is flagged; verify no code path allows a silent suppression.
- Every landed clause carries a named enforcing check OR an explicit aspirational label, and each new check ships warn for at least one MINOR before flipping to error.

## Rollback

- Standard clauses (hooks, exceptions): revert the LAND PR. Because each new check is warn-first, no repo red-builds during the warn window, so the blast radius of a revert is low.
- Commitlint hook: the PUSH campaign is one PR per repo, so revert per repo; removing the `commit-msg` hook restores the prior commit flow. The D12 suppression interlock guarantees the PUSH did not clobber a deliberate exception.
- Release executor: the per-repo choice is a MADR ADR, reversible by superseding (never editing) it; revert the release-please workflow and `askit-release` remains the standing fallback engine because it already exists in the toolkit. The marketplace re-pin line is bespoke and untouched, so a release-executor rollback cannot affect the registry.

## Risks

1. Conventional Commits are not clean today in any of the four repos, so release-please adoption is strictly gated on the hook enforcing typed commits forward for a full burndown MINOR. Adopting the bot early would derive wrong bumps. Mitigation: land the hook first, hold release-please until the window closes.
2. Double-tagging if a repo half-adopts (both `askit-release` and release-please tag). Mitigation: the per-repo ADR must name exactly one tagger.
3. release-please adds an external Action dependency (CI surface and supply chain). Mitigation: pin the Action by SHA/tag and keep the marketplace re-pin bespoke.
4. Home dependency: the hooks and exceptions clauses have no home until the Phase 0 relocation (PR-B) completes. Mitigation: B6 is gated on Phase 0 and Phase 3 landed.
5. OQ-8 drift: the live Claude Code hooks contract may have moved since D9 was written; landing a stale exit-code clause is a real hazard. Mitigation: re-read the live hooks reference immediately before land and reconcile drift into the clause.
6. D13 premature codification would ratify a convention from an unsettled exemplar. Mitigation: keep D13 direction-only (aspirational) this cycle.
7. writing-style-catalog already carries changelog drift (no `[0.6.0]` entry); wiring the bot onto an out-of-sync changelog could produce a wrong first automated entry. Mitigation: reconcile the changelog as a G-gate before wiring.
8. `enforce_admins:false` residual (maintainer ruling R6) means a solo maintainer can bypass the suppression-integrity gate. Documented residual; see [09-risk-register.md](../09-risk-register.md).

## Recommendation

Land in this order: the D9 hooks clause plus the commitlint hook PUSH campaign first (it unblocks all release automation), then the D12 exceptions clause, then carry D13 as direction-only. Adopt release-please for the two most mechanical repos (writing-style-catalog, thinking-framework-skills) only after the hook has enforced Conventional Commits for one MINOR; keep `askit-release` primary for the two most curated repos (agent-skills-toolkit, pm-skills). Re-confirm the hook contract against the live docs at land (OQ-8). Sequence B6 last, after [B5](B5-phase-4-ci-and-section-14.md).

## Approval checklist

- [ ] Maintainer go on B6 as a whole (R2).
- [ ] Confirm Phase 3 (PLAN layer) and Phase 4 landed, and PR-A (org gate) green, before B6 opens.
- [ ] Rule OQ-5 per repo: accept or amend the recommendation table; each pick becomes a MADR ADR (D4).
- [ ] Confirm the canonical commitlint hook home (agent-skills-toolkit) and approve the D2 PUSH plan.
- [ ] Approve the Conventional Commits warn-to-enforce window length before any release-please wiring.
- [ ] OQ-8: re-read the live Claude Code hooks reference at land and reconcile any drift into the clause.
- [ ] Confirm D13 stays direction-only (aspirational) this cycle.
- [ ] Accept documented residuals (enforce_admins:false; Conventional-Commits-history-clean gating; external Action dependency).
- [ ] Confirm all Standard version, ADR, and section numbers are allocated only at land, not in this package.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
