---
title: "Release Plan - Version and Release Choreography"
description: "Program-level version surfaces, choreography, gates, and rollback across Lane A and the Lane B packages"
status: "draft"
last-updated: "2026-07-03"
---

# Release Plan: Version and Release Choreography

This is the release plan for the standards program locked at [`docs/internal/standards-plan-roadmap/`](../standards-plan-roadmap/00-README.md). It does not restate any decision rationale or clause text from that package; it only tracks what versions, changelogs, and re-pins move as each piece of the program lands. See [03-execution-plan.md](03-execution-plan.md) for the two-lane model and sequencing, [08-decision-register.md](08-decision-register.md) for decision status, and [09-risk-register.md](09-risk-register.md) for ranked risk.

## 1. Why this is a choreography doc, not a version-scoped plan

The jp-release-plan skill (`jp-library` v1.5.0) governs one `plan_vX.Y.Z/` folder that aggregates specs and implementation plans for a single release, gated by hygiene checks before a tag. This program has no single version to aggregate under: four version surfaces (Section 2) move on different cadences, across one Lane A and seven Lane B packages, each staged behind its own maintainer go. This document adapts three of that skill's disciplines to program scale instead of one folder:

- **Aggregate, don't author.** This plan records what moves and when; it does not decide what lands. Clause text lives in the drafts; the version and ADR numbers live in the LAND step.
- **Gate before the event, not after.** Section 4 states what must be green before each version-moving event, mirroring the skill's PASS/FAIL hygiene gates.
- **Refuse to invent.** Per the operationalizing constraint on this whole suite, this document allocates no Standard version, ADR number, or section number. Those are taken only at LAND, on the protected branch, per the allocation invariant in [GOVERNANCE.md](../../../standards/GOVERNANCE.md) Section 6. Where a number is not yet known, this plan says so rather than guessing.

## 2. The four version surfaces

| Surface | Home | Current state | Who moves it | Cadence |
|---|---|---|---|---|
| Registry `metadata.version` | [`.claude-plugin/marketplace.json`](../../../.claude-plugin/marketplace.json) | `1.34.0` | Maintainer review on every re-pin PR | Bumps on every registry-data change, per the re-pin checklist ([CONTRIBUTING.md](../../../CONTRIBUTING.md) Section 7) |
| Standard version | `agent-skills-toolkit/STANDARD.md` today; `agent-plugins/standards/STANDARD.md` after PR-B (Phase 0 relocation LAND) | `0.12` | [GOVERNANCE.md](../../../standards/GOVERNANCE.md) Section 5 LAND: one PR, text plus one version bump plus one ADR | Stays `0.12` through Phase 0 (R3, version ruling); `0.13` stays reserved for the U13 (skill-registration) warn-to-error burndown; each of Phase 3, Phase 4, Phase 5, and the Codex workstream bumps the minor once more, exact number allocated at LAND |
| `standards/CHANGELOG.md` + `standards/RELEASE-NOTES.md` | `agent-plugins/standards/` | Does not exist yet | Born in PR-B (Phase 0 relocation LAND) | One curated entry per Standard LAND, separate from the registry CHANGELOG and from any plugin's own CHANGELOG |
| Per-plugin version | Each plugin's own `library.json` / `plugin.json` / `CHANGELOG.md` | pm-skills `2.29.1`, thinking-framework-skills `0.13.0`, writing-style-catalog `0.5.2` pinned (working tree `0.6.0`), agent-skills-toolkit `1.6.0` | Each plugin's own maintainer or session | PULL-based re-adoption per D2 (Hybrid rollout): never forced by a fleet-wide bump |

Three CHANGELOG surfaces coexist and are never merged: the agent-plugins root `CHANGELOG.md` (registry and marketplace narrative), `standards/CHANGELOG.md` (Standard-law narrative, born in PR-B), and each plugin's own `CHANGELOG.md` (that plugin's release narrative). A re-pin PR touches the first and the third; a Standard LAND touches the second.

### A fifth, thinner surface: the reusable workflow's own tag

D14 (runner-consumption, reusable workflow) decouples the CI harness version from the Standard version on purpose, so a harness fix never forces a Standard bump. That harness carries its own version surface, distinct from all four above:

| Surface | Home | Current state | Cadence |
|---|---|---|---|
| `standards-gate.yml` tag | `product-on-purpose/.github` | Does not exist yet; created and tagged `v1.0.0` in B1 (PR-A, ship the org gate) | Re-tagged when the harness itself changes; each plugin caller re-pins its `uses: ...@<tag-or-sha>` line on its own PUSH-lane cadence (D2), never `@main` |

The same pattern repeats for the shared `astro-site.yml` workflow born in B5 (Phase 4, CI consolidation plus Section 14): a second, independently-tagged surface, not a Standard-version or plugin-version event.

## 3. Choreography table

One row per Lane A action and per Lane B package (per [03-execution-plan.md](03-execution-plan.md)'s two-lane model). "Version surfaces moved" states only what this document can confirm from the locked package; it never pre-allocates a number.

| Event | Repo(s) | Version surfaces moved | CHANGELOG and re-pin notes |
|---|---|---|---|
| PR-B (Phase 0 relocation LAND) - Lane A | agent-plugins | Standard stays `0.12` (R3, no bump); no plugin version changes | `standards/CHANGELOG.md` and `standards/RELEASE-NOTES.md` born, first entry records "structural relocation, no normative change"; one ADR added, number allocated at LAND (never pre-baked). No re-pin: no plugin's marketplace pin changes. |
| Phase 2 CI keystone, advisory landing - Lane A | agent-plugins | No Standard or plugin version change | Root `CHANGELOG.md` `[Unreleased]` entry (mechanism-only change, no registry data change, so no `metadata.version` bump, matching the existing pattern for governance-only entries). No re-pin triggered; the check runs advisory against existing pins. |
| Branch-protection flip, `strict:true` (R6) - Lane A | agent-plugins (settings, not a code PR) | No version surface moves | Root `CHANGELOG.md` `[Unreleased]` entry records the flip; `enforce_admins` stays `false`, logged as a documented residual risk (see [09-risk-register.md](09-risk-register.md)). |
| Phase 2 blocking flip (follow-on, gated on B3) - Lane A | agent-plugins | No Standard version change | Root `CHANGELOG.md` entry records advisory-to-blocking. No new re-pin; it confirms the four members' existing pins already satisfy the check. |
| B1 (PR-A, ship the org gate) | product-on-purpose/.github | No Standard, plugin, or registry version change; the reusable workflow itself is tagged `v1.0.0`, its own decouple-and-pin surface per D14 (runner-consumption) | That repo's own record of the tag; this package's audit sources do not confirm a `CHANGELOG.md` convention there (flagged in Open Questions). No re-pin. PR-B's merge (Lane A) is held until B1 is approved and green (R7). |
| B2 (PR-C, askit re-adopt) | agent-skills-toolkit | Standard pin unchanged at `0.12` (structural, R3); askit's own plugin version bumps on its own release cadence | askit's `CHANGELOG.md` gets the RE-ADOPT entry; agent-plugins root `CHANGELOG.md` gets the matching re-pin entry. Full re-pin checklist applies; registry `metadata.version` bumps by one. |
| B3 (Phase 1, pm-skills convergence) | pm-skills | pm-skills gets its first `library.json`, pinning Standard `0.12` at a tier per the open DR-10 (pm-skills tier) ruling in [08-decision-register.md](08-decision-register.md) (recommended universal-now, not a flat convergent assertion); pm-skills' own plugin version bumps on its own cadence | pm-skills' own `CHANGELOG.md` entry; agent-plugins root `CHANGELOG.md` re-pin entry. Full checklist applies; registry `metadata.version` bumps; this is the event that unblocks the Phase 2 blocking flip above. |
| B4 (FC-0001 pilot plus Phase 3 scaffolding amendment) | agent-plugins (LAND) plus all four (PUSH campaigns) | Standard bumps one minor (D5, D6, D10, D11, D8 PLAN-layer amendment; number allocated at LAND); each pushed repo's own plugin version bumps on merge of its push PR | `standards/CHANGELOG.md` gets the amendment entry plus one ADR; each repo's own `CHANGELOG.md` gets its push-campaign entry; agent-plugins root `CHANGELOG.md` gets re-pin entries as each repo lands. Standard-pin re-adoption stays PULL-based (D2) even though the mechanical push is fleet-wide. |
| B5 (Phase 4, CI consolidation plus Section 14) | product-on-purpose/.github, all four, agent-plugins | Standard bumps one minor (Section 14 graduation plus new checks; number allocated at LAND); each repo's plugin version bumps adopting the shared `astro-site.yml` | `standards/CHANGELOG.md` (Section 14 plus ADR); each repo's own `CHANGELOG.md` (workflow consolidation); agent-plugins root `CHANGELOG.md` (re-pins). Truth-in-targeting (D10) also flips advisory to blocking here. |
| B6 (Phase 5, process and hooks) | agent-plugins plus per-repo ADRs | Standard bumps one minor (D9 hooks clause, D12 exceptions, D13 conventions if ratified; number allocated at LAND) | `standards/CHANGELOG.md` gets the amendment; per-repo ADRs record any D12 exceptions. OQ-5 (release executor) is decided here as a family-law ADR, not a version bump itself; see Section 5. No re-pin forced directly; the commitlint `commit-msg` hook becomes the load-bearing prerequisite for whichever EXECUTE mechanism OQ-5 picks. |
| B7 (Codex distribution workstream) | all four plus agent-plugins | No Standard version bump in B7 (Codex workstream); the D17 (deliver Codex) clause and its enforcement land via the Phase 3/4 amendments ([B4](05-lane-b/B4-fc-0001-and-phase-3.md) / [B5](05-lane-b/B5-phase-4-ci-and-section-14.md)), not here. B7 emits native artifacts only: each plugin's own version bumps when it ships its `.codex-plugin/plugin.json` emitter | Each plugin's own `CHANGELOG.md` (emitter added); agent-plugins root `CHANGELOG.md` bumps `metadata.version` here, because the new `.agents/plugins/marketplace.json` is new registry data, unlike the mechanism-only Phase 2 landing. The tested Codex CLI version is recorded at round-trip test time as a STANDARD Appendix A version note, not a `standards/CHANGELOG.md` entry or a new ADR (B7 itself allocates neither). Full re-pin checklist per repo as each ships. |

## 4. Release gates

Each gate below must PASS before its version-moving event fires, mirroring the jp-release-plan hygiene-gate pattern (PASS/FAIL, no silent skip).

**(a) Lane A merge gate (R5).** For every Lane A PR: the `validate` check is green, and a Codex adversarial review has been run and answered. Autonomous merge does not fire without both.

**(b) PR-B merge gate.** `node --test` green on the relocated tree; the relocated runner grades askit (a foreign root) green; `validate` CI green on the PR itself; AND, per R7 (PR-B staging), B1 (PR-A, ship the org gate) is approved and green. PR-B cannot merge on gate (a) alone.

**(c) Branch-protection precondition (R6).** `strict:true` is flipped before Lane A relies on gate (a)'s autonomous-merge authorization, so up-to-date-before-merge is mechanically true for the very merges R5 authorizes. This closes the GOVERNANCE.md Section 6 gap the audit flagged (branch protection was `strict:false`). `enforce_admins` stays `false`: a documented residual risk, not a gap this gate closes.

**(d) Phase 2 blocking-flip gate.** All four members show a `library.json` with a `standard` pin and green CI at that pin before the re-pin check flips from advisory to blocking. Depends on B3 (Phase 1, pm-skills convergence).

**(e) Any Standard-version LAND gate** (B4, B5, B6, B7). The GOVERNANCE.md Section 5 LAND invariant: one PR, atomically, text plus exactly one version bump plus one ADR plus the matching CHANGELOG entry. Plus the sequencing invariants from [02-roadmap.md](../standards-plan-roadmap/02-roadmap.md): no clause ratified without a named enforcing check or an explicit aspirational label; no clause ratified from a non-conforming exemplar. ADR and version numbers are pulled fresh against the protected-branch head at merge time, never pre-baked.

**(f) Any re-pin gate.** The CONTRIBUTING.md Section 7 checklist in full: pinned `sha` sits on a release tag and CI at that sha is green; versions agree everywhere (registry entry, release tag, `library.json`, `plugin.json`); the plugin's own `CHANGELOG.md` has the entry; registry `metadata.version` bumped and this repo's `CHANGELOG.md` updated; `strict: true` preserved and `validate` green.

**(g) Any Lane B package gate (R2).** The maintainer's per-package go precedes gates (b) through (f) for that package. Nothing cross-repo fires on a recommendation alone.

### How these gates relate to jp-release-plan's hygiene gates

jp-release-plan's `--gate` walks five hygiene checks over one release folder. This program has no single folder to walk, but the same intent maps across, one program-scale analog per skill gate:

| jp-release-plan gate | Program-scale analog |
|---|---|
| (a) spec status frozen (not `draft`) at tag time | The version-bump ruling (R3) is confirmed before a LAND merges, not left open |
| (b) every effort has a coupled plan | Every Lane B package has its own package document (B1 through B7) before R2's per-package go is given |
| (c) implementation-plan AC coverage complete | No clause is ratified without a named enforcing check (sequencing invariant), the program's own coverage bar |
| (d) every phase Done | The GOVERNANCE.md Section 5 LAND invariant: one PR, atomically, or the LAND has not happened |
| (e) no spec edited after its plan (staleness) | ADR and version numbers are pulled fresh at merge time, never pre-baked, so nothing can go stale between drafting and LAND |

## 5. The D8 three-layer frame, applied to the program

D8 (release subsystem, three layers) defines PLAN, EXECUTE, and NOTES. This document is the program's PLAN-layer application, written now at `docs/internal/execution/` using jp-library document formats per R4 (suite home); it does not preempt Phase 3's own landing of the D8 PLAN-layer Standard clause (the `docs/internal/release-plans/plan_vX.Y.Z/` convention), which governs future per-feature releases once it lands.

**EXECUTE is not decided here.** OQ-5 (release executor: `release-please` versus `askit-release`) is decided in B6 (Phase 5, process and hooks); this document only records that the decision, once made, becomes a family-law ADR and that the commitlint `commit-msg` hook (D9) is its load-bearing prerequisite (Section 3, B6 row).

**NOTES discipline applies to all three CHANGELOG surfaces from Section 2.** Every entry is curated by hand, following the existing re-pin-entry pattern already proven in the agent-plugins root `CHANGELOG.md`; none of the three surfaces is ever auto-dumped from a commit log.

## 6. Rollback and re-pin-revert procedure

- **Re-pin revert.** If a newly re-pinned sha turns out broken, or the weekly drift-check cron catches a moved or deleted tag, revert by re-pinning to the last-known-good sha through a new re-pin PR, following the full checklist again, with `metadata.version` bumped forward again. Re-pins are append-only; never edit a merged registry entry in place.
- **Standard version rollback.** A bad amendment is corrected by a new amendment PR carrying a superseding ADR (`status: superseded by NNNN-...`), never by rewriting or un-bumping the landed version. Version numbers, once landed, are never reused.
- **Branch-protection flip rollback.** If `strict:true` (R6) causes unexpected friction, the maintainer may revert to `strict:false` through the same settings mechanism used to flip it on. Document the revert as a `CHANGELOG.md` entry, same as the flip itself, and log it in [09-risk-register.md](09-risk-register.md).
- **PR-B revert.** PR-B (Phase 0 relocation LAND) is one atomic PR by design (GOVERNANCE.md Section 5) precisely so it reverts as one unit if post-merge verification surfaces a break. Because askit's own copies are not deleted until B2 (PR-C, askit re-adopt) verifies green, a PR-B revert leaves askit's in-repo gate fully intact throughout: the no-dark-window invariant doubles as the rollback safety net.
- **Lane B package non-fire.** Per R2 (cross-repo gate), a package that has not received its per-package go simply does not fire; there is nothing to roll back. For a Lane B package already merged into its own repo, that repo's own revert or hotfix convention applies; this agent-plugins-scoped plan tracks only the resulting re-pin (see Re-pin revert, above).

## 7. Keeping this plan current

This is a living document (status starts `draft`). Section 3 (the choreography table) is the part expected to change as sibling documents land: once [04-lane-a-plan.md](04-lane-a-plan.md) and each `05-lane-b/B*.md` package document exist, refresh the corresponding row from what that document actually specifies, the way jp-release-plan's `--update` regenerates its aggregation table from disk rather than by hand. Sections 1, 2, 4, 5, and 6 (the surfaces, the gates, the D8 frame, and the rollback procedure) are authored analysis; leave them untouched unless the two-lane model itself changes in [03-execution-plan.md](03-execution-plan.md). Bump `last-updated` and add a Change log row on every substantive edit.

## Open questions for the lead

- Whether the Phase 2 CI keystone's advisory landing and its later blocking flip belong entirely inside Lane A, or need their own cross-reference row in [04-lane-a-plan.md](04-lane-a-plan.md); this plan assumed Lane A per R1 (scope) since both actions write only to agent-plugins.
- No source in this session's audit set confirms whether `product-on-purpose/.github` (B1) keeps its own `CHANGELOG.md`; the B1 row above states this as unconfirmed rather than assuming a convention.
- Whether B4's push-campaign re-pins (one per repo, as each push PR merges) should be broken into their own choreography rows once [05-lane-b/B4-fc-0001-and-phase-3.md](05-lane-b/B4-fc-0001-and-phase-3.md) is written, since a single fleet-wide row may understate four independent re-pin events.
- PR-B's `standards/CHANGELOG.md` is born with a first entry but no Standard-version bump (R3, no bump), and no source in this session's audit set specifies how a Keep a Changelog file records an entry with no version header; recommend an `[Unreleased]`-style heading for that first entry until the Phase 3 LAND supplies the first real version heading.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
| 2026-07-03 | verifier fixes applied (lead-ruled) |
