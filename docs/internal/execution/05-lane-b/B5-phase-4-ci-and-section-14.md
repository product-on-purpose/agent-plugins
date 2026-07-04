---
title: "B5 - Phase 4 approval package (consolidate CI, graduate Section 14)"
description: "Staged, approval-gated Lane B package to stand up the shared astro-site workflow, extract the docs preset, land Section 14 normative, and add the missing enforcing checks"
status: "draft"
last-updated: "2026-07-03"
tags: [lane-b, phase-4, astro, section-14, ci, approval-package]
---

# B5 - Phase 4 (consolidate CI, graduate Section 14)

> Approval-gated cross-repo package. It stands up one shared `astro-site.yml` reusable workflow to replace four duplicated clause-14.11 guard copies, extracts the `@product-on-purpose/astro-docs-preset` package, lands Section 14 (the astro site standard) as normative through governance, and adds the D16 (HISTORY.md forward-only presence) check and the frontmatter-tier check while flipping truth-in-targeting (check 9) from advisory to blocking. This document OPERATIONALIZES Program Phase 4 in the locked plan; it invents no decisions and allocates no scarce numbers. See [Program Phase 4](../../standards-plan-roadmap/02-roadmap.md) for the authority and rationale; this package does not restate it.

## Lane and gating (R1, R2)

Per R2 (cross-repo gate), B5 is a STAGED recommendation. It touches `product-on-purpose/.github`, a new `astro-docs-preset` repo, all four leaf plugins, and `agent-plugins`, so nothing in it fires without the maintainer's per-package go, even after the overall Lane A "go." Per R1 (Lane A is agent-plugins-only), none of B5 is autonomous. It is the LAST program package to run: every sub-stream depends on earlier landings (see Preconditions).

## Phase-numbering note (read before the tables)

Two independent phase schemes collide here and MUST be kept apart:

- **Program Phase 4** - the standards-plan-roadmap phase this package serves (CI consolidation + Section 14 + missing checks).
- **astro-sites ROADMAP Phase 1 / Phase 2 / Phase 3** - the astro domain's own sequence at [`standards/domains/astro-sites/ROADMAP.md`](../../../../standards/domains/astro-sites/ROADMAP.md): Phase 1 (shared CI workflow + validators), Phase 2 (extract the preset), Phase 3 (land Section 14). Its Phase 0 (close per-repo P1s) is already DONE for all four sites.

Program Phase 4 = astro ROADMAP Phases 1 + 2 + 3, plus the two new spine checks and the truth-in-targeting flip. Below, "astro Phase 1/2/3" always means the domain ROADMAP, never the program.

## Purpose

Section 14 landing normative is the "highest-leverage gap" flagged in the 2026-06-02 session log and repeated in every continuation prompt since. It is still open: the clauses live only in [`standards/domains/astro-sites/SITE-STANDARD.md`](../../../../standards/domains/astro-sites/SITE-STANDARD.md), not in normative `STANDARD.md`. But the sequencing invariant (no clause from a non-conforming exemplar, no clause without a named check) forbids landing Section 14 from four drifting local copies. So the leverage is unlocked in one ordered move: consolidate the four guard copies into one shared enforcement, PROVE convergence, THEN formalize the clause. B5 does exactly that and closes the two remaining spine gaps (HISTORY.md, frontmatter-tier) that Program Phase 4 owns.

## Absorb the unrun plan; do not re-derive it

A ready-to-execute, task-level plan for astro Phase 1 already exists, unrun, at `_LOCAL/planning/2026-06-03_astro-shared-infra-phase1-and-campaign_from-pm-skills-session.md` (gitignored, local-only). It carries the repo-boundary map, the 1.1-1.4 task decomposition, the carry-forward gotchas, and a campaign-record skeleton. B5 ADOPTS that task structure rather than re-deriving it; the executor reads that artifact plus the authoritative design in [`ci-standard.md`](../../../../standards/domains/astro-sites/ci-standard.md) (Section 2 = the complete workflow YAML, Section 4 = the four validators + hardening, Section 6 = rollout) and [`shared-preset-spec.md`](../../../../standards/domains/astro-sites/shared-preset-spec.md). The design is copy-ready; the value-add is the preset/validator extraction and the governance landing, not new authoring.

## Preconditions (what must land before B5 starts)

B5 is downstream of the whole program. It MUST NOT begin until all of the following are true:

1. **[B1 (PR-A, ship the org gate)](B1-pr-a-org-gate.md) has merged green.** It establishes write access and the proven reusable-workflow pattern in `product-on-purpose/.github`; `astro-site.yml` is the SECOND reusable workflow in that same repo and reuses that pattern.
2. **Program Phase 0 (truth and relocation) has landed** so `standards/checks/` exists to receive the two new checks and `validate-registry.mjs` reads a single relocated Standard home.
3. **[Program Phase 1 (pm-skills library.json)](B3-phase-1-pm-skills.md) has landed** so pm-skills carries a `standard` pin. writing-style-catalog already carries a `library.json` (standard 0.11, tier universal), so what is actually pending on its side is the pull-based re-adoption - bumping its `standard` pin to surface Section 14 conformance per D2 (Hybrid rollout), tracked out of program. Neither is required for the clause to become normative (re-adoption is pull-based per D2, rollout Hybrid), but a repo surfaces a site-conformance signal in the registry only after it re-pins.
4. **Program Phase 3 (frontmatter schema, D11 one schema per artifact type) has landed.** The frontmatter-tier check cannot validate tier agreement until the D11 schema exists. This is the hard cross-phase dependency for the new-check half of B5.

The astro-site prerequisites are already met: all four sites are Pattern S on `main`, and the base single-source extraction (the one piece of genuinely new work) shipped as pm-skills PR #160, so astro Phase 1 seeds from an already-parameterized donor.

## Work breakdown (three sub-streams)

### S1 - Shared workflow + preset (astro ROADMAP Phase 1, then Phase 2)

- **S1.1** Create `product-on-purpose/.github` `.github/workflows/astro-site.yml` (`workflow_call`), copy-ready from `ci-standard.md` Section 2; tag `@v1` (moving major tag, callers pin `@v1`, `@<sha>` holds a repo back).
- **S1.2** Create `astro-docs-preset` (new repo, plain ESM, no build step). For Phase 1 only `./ci/ci-checks.mjs` + the four validators need to be real. Seed validators from the FIXED agent-skills-toolkit versions (rollout-hardened), take `remark-resolve-links` from pm-skills, reference pm-skills `site-base.mjs` for base parameterization. Fold in the hardening list (bare-relative resolution, both quote styles, defensive decode, empty-dist hard-fail, argv null-check). Self-test fixture + wrong-base-fails test.
- **S1.3** Pilot the caller on thinking-framework-skills (cleanest, gains the four guards it deferred). Run non-required for >=3 PRs + 1 main deploy, confirm parity, then make it required and retire the old workflow.
- **S1.4** Fan out: agent-skills-toolkit, then writing-style-catalog (proves `.md` vs `.mdx` remark passthrough), then pm-skills LAST (highest blast radius; keep its dual-OS matrix as a separate job). Each adoption is one thin caller PR.
- **S1.5** (astro Phase 2) Extract the shared preset factory (`defineDocsConfig`, `docsSchemaShared`, accent, `editLinkFor`), tag `v0.1.0`, distribute by git-tag dependency; migrate sites tfs -> askit -> wsl -> pm-skills. Record the registry-promotion trigger.

### S2 - Land Section 14 normative (astro ROADMAP Phase 3)

One atomic amendment on the protected branch per the LAND invariant: the Section 14 clause text (14.1-14.11 graduated as formalization), ONE version bump, ONE family-law ADR, and the CHANGELOG / RELEASE-NOTES entries. Numbers (version, ADR number, and whether the section keeps 14 or takes next-free) are allocated AT LAND, never here. Enforcement already runs in all four repos via S1, so this is formalization, not new law.

### S3 - The two new spine checks + the truth-in-targeting flip

- **S3.1** Add the D16 (HISTORY.md forward-only presence) check to `standards/checks/`: required only on NEW or CHANGED components, existing unchanged components grandfathered, NO mass backfill. Ships warn-then-error per Standard Section 7.7.
- **S3.2** Add the frontmatter-tier check to `standards/checks/`: validates a component's declared frontmatter `tier` agrees with the tier its plugin actually satisfies. Ships warn-then-error. Depends on Program Phase 3's D11 schema.
- **S3.3** Flip truth-in-targeting (check 9, D10) in `scripts/validate-registry.mjs` from advisory (landed in Program Phase 2) to blocking, once every declared `agent-targets` entry provably ships its native distribution plus context shim.

## Change manifest per repo

| Repo | Change | Tag / version | Gate note |
|---|---|---|---|
| `product-on-purpose/.github` | Add `.github/workflows/astro-site.yml` (`workflow_call`) | tag `@v1` | Second reusable workflow beside PR-A's `standards-gate.yml`; org-profile `profile/README.md` untouched |
| `astro-docs-preset` (NEW) | `ci-checks.mjs` + four validators (Phase 1); config factory + schema + accent (Phase 2) | tag `v0.1.0` | Distributed by git-tag dependency; peerDeps pin the Astro/Starlight/mermaid matrix |
| thinking-framework-skills | Adopt caller; PILOT; gains the four link/route guards | untagged site maintenance | Non-required for >=3 PRs + 1 deploy, then required, old workflow retired |
| agent-skills-toolkit | Adopt caller; `node-version` drift normalized | untagged | Keep `scripts/check.mjs` conformance gate as a SEPARATE job |
| writing-style-catalog | Adopt caller | untagged | Proves the `.md` vs `.mdx` remark passthrough; bumps its `standard` pin to re-adopt Section 14 (already carries a `library.json`) |
| pm-skills | Adopt caller LAST | untagged | Keep dual-OS shell-validator matrix as a separate job; only after its tree is free |
| agent-plugins | Land Section 14 (S2); add history-presence + frontmatter-tier checks; flip check 9 to blocking | one version bump + one ADR (allocated at LAND) | Depends on Phase 0 (checks home) + Phase 3 (frontmatter schema) |

Any repo excluded from a fan-out step is recorded in the campaign record with a reason (no silent skips). The shared-workflow rollout is a fleet campaign in its own right (its `FC-NNNN` id is allocated at campaign open). FC-0001 (first fleet campaign) is the casing pilot ruled in [B4 (FC-0001 and Phase 3)](B4-fc-0001-and-phase-3.md); this rollout takes the next free `FC-NNNN`, not FC-0001.

## Sequencing (why this exact order)

The order is forced by the two sequencing invariants, not by preference:

1. S1 first (shared workflow proves the four repos converge on ONE enforcement), because **Section 14 MUST NOT be ratified from four drifting exemplars** (invariant 2). Landing the clause before consolidation would bake a contradiction into the Standard.
2. S3.1 and S3.2 build the enforcing checks BEFORE S2 graduates any clause that relies on them, because **no clause lands without a named enforcing check** (invariant 1). The frontmatter-tier check in particular cannot exist until Program Phase 3's D11 schema exists.
3. S2 (formalization) lands only after S1 is green on all four and S3 checks are live. S3.3 (the blocking flip) comes at the tail because you flip an advisory check to blocking only after it has run quietly and every target is honest.
4. Within S1, pilot-then-fan-out with no flag day: each repo keeps its old workflow until the shared one is green on >=3 PRs and one main deploy.

## Verification

- **Shared workflow parity:** each site is green on the shared `astro-site.yml` for at least 3 PRs and 1 main deploy before its old workflow is retired; the base single-source guard, no-committed-output guard, and the four build-aware validators all run against `dist` on every PR.
- **Convergence proven:** all four sites run the identical build-aware link/route guards from one source; the cross-family link/route blind spot (the one finding with live shipped harm) is closed.
- **Section 14 landed:** the amendment is one atomic PR (text + one version bump + one ADR + changelog); the runner grades a reference site green against the normative clause; no source cites the old split home.
- **New checks ramp per Standard 7.7 (warn one minor, then error):** history-presence and frontmatter-tier each ship `warn` for at least one Standard minor, giving every repo a burndown window, then flip to `error`. This mirrors the D15 tiered warn-first ramp and the U13 precedent at v0.12. The truth-in-targeting flip (S3.3) is the error tail of the ramp begun advisory in Program Phase 2.
- **HISTORY.md check is diff-aware:** it fires only on new-or-changed components and grandfathers unchanged ones (a no-backfill assertion, verified by running it against a clean tree and confirming zero errors on untouched components).
- **Registry site-conformance signal:** once the leaf repos re-adopt (pull-based), `validate-registry.mjs` surfaces each plugin's `standard` and a site-conformance signal, so the registry reflects Section 14 adoption rather than an out-of-band audit.

## Definition of done (Program Phase 4 exit gate)

B5 is complete when the [Program Phase 4](../../standards-plan-roadmap/02-roadmap.md) exit gate is met on disk, operationalized as:

1. One shared `astro-site.yml` serves all four sites; the four duplicated clause-14.11 guard copies are deleted; the preset is extracted and tagged.
2. Section 14 is normative in `STANDARD.md` (one atomic amendment landed) and the runner grades a reference site green against it.
3. The history-presence and frontmatter-tier checks are live in `standards/checks/`, each past its `warn` minor and flipped to `error`.
4. Truth-in-targeting (check 9) is blocking with every declared target honest.
5. The shared-workflow rollout is recorded as a dual-documented fleet campaign (central `spec.md` + `record.md` under `docs/internal/orchestration/campaigns/<FC-NNNN>/`; each repo's own CHANGELOG references the same id).

## Dual-documentation and governance guardrails

The S1 fan-out is a PUSH campaign per D2 (rollout Hybrid): identical-intent, judgment-free workflow adoption, orchestrated one-PR-per-repo with the mandatory stop-and-flag rule (any intentional per-repo deviation gets a repo ADR plus a campaign-record note, never a silent skip). The Section 14 re-adoption is PULL: each plugin bumps its `standard` pin on its own cadence, never force-synchronized. The S2 amendment relies on the serialized-amendment discipline; note that the branch-protection `strict:true` flip landed in Lane A (R6) is what makes that serialization mechanical, so S2 MUST NOT land before that flip is in force on the amending repo.

## Rollback

- **Shared workflow:** callers pin `@v1` (or `@<sha>`); a bad workflow revision is rolled back by moving the `v1` tag or pinning a repo to the last-good `@<sha>`. Because each repo keeps its old workflow until the shared one is proven, a failed pilot reverts by deleting the new caller with zero blast radius.
- **Preset:** git-tag dependency means a repo rolls back by pinning the previous preset tag; the workflow and preset version independently.
- **New checks:** while a check is in its `warn` window it cannot red-build anyone, so backing it out is a code revert with no burndown debt. If a check misbehaves after flipping to `error`, it drops back to `warn` (a one-line severity change), not a full removal.
- **Section 14:** as an atomic amendment it reverts as one PR; because enforcement predates the clause, reverting the clause text does not disable any guard already running in the repos.

## Risks

1. **Reusable-workflow two-checkout wiring has never run end-to-end.** `product-on-purpose/.github` exists but has no `workflows/` directory; the caller/callee env-propagation and single-job dist-sharing gotchas are documented but unproven. Mitigation: B1 (PR-A) exercises the same pattern first; pilot on tfs as a non-required check before anything becomes required.
2. **`.md` vs `.mdx` remark divergence (writing-style-catalog).** A workflow injecting only into `markdown.remarkPlugins` covers `.md` but not `.mdx`; wsl's mdx+gfm pipeline needs the transform inside `@astrojs/mdx` too. Mitigation: wsl is the explicit proving repo for this in S1.4.
3. **Base single-source is delicate.** A wrong base passes the rendered-link check while the live site 404s. Mitigation: it landed with a test in the donor (pm-skills #160) before parameterization; the wrong-base-fails test rides in the preset fixture.
4. **Cross-phase dependency on Program Phase 3.** The frontmatter-tier check is blocked until D11 lands. If Phase 3 slips, S3.2 waits; S1, S2, S3.1, and S3.3 can still proceed, so B5 is partially decomposable.
5. **Over-centralization.** Folding a repo's bespoke matrix (pm-skills dual-OS validators, askit `check.mjs`) into the shared workflow would couple unrelated gates. Mitigation: the preset owns invariants, the workflow owns the build/deploy contract, neither owns the generator; bespoke jobs stay local.
6. **Landing from a regressed exemplar.** If any site regresses after S1 but before S2, the clause it backs must be fixed before that clause lands. Mitigation: S2 is gated on all four green, checked at land time.

## Recommendation

Approve B5 to run as the final program package, AFTER B1 and Program Phases 0, 1, and 3 have landed green. Sequence it strictly S1 -> S3.1/S3.2 -> S2 -> S3.3, pilot-then-fan-out with no flag day. Treat the shared-workflow rollout as a full fleet campaign (allocate its next-free `FC-NNNN` at open - FC-0001 is B4's casing pilot - and dual-document per the orchestration model). Hold the Section 14 landing (S2) until convergence is demonstrably green on all four sites; hold each `error` flip until its `warn` minor has elapsed. Because it carries the highest-leverage gap (Section 14) behind the strictest sequencing discipline, B5 rewards patience over speed.

## Approval checklist

- [ ] Confirm B5 runs only after B1 and Program Phases 0 / 1 / 3 are green (Preconditions 1-4).
- [ ] Approve creating the new `astro-docs-preset` repo and the second reusable workflow in `product-on-purpose/.github`.
- [ ] Confirm the pilot-then-fan-out order (tfs -> askit -> wsl -> pm-skills) and the no-flag-day discipline.
- [ ] Confirm the warn-one-minor-then-error ramp (Standard 7.7) for history-presence and frontmatter-tier before either flips to `error`.
- [ ] Confirm Section 14 lands as one atomic amendment with numbers allocated at LAND (version, ADR, section).
- [ ] Confirm the truth-in-targeting flip (check 9) waits until every declared target is honest.
- [ ] Confirm the shared-workflow campaign takes the next free `FC-NNNN` at open; FC-0001 (first fleet campaign) is the casing pilot owned by [B4 (FC-0001 and Phase 3)](B4-fc-0001-and-phase-3.md), not this rollout.

## See also

- [03-execution-plan.md](../03-execution-plan.md) - the two-lane model and gates.
- [06-ci-plan.md](../06-ci-plan.md) - CI evolution across the program.
- [09-risk-register.md](../09-risk-register.md) - the ranked program risks.
- [B7 (Codex workstream)](B7-codex-workstream.md) - parallelizable with this package per the roadmap.
- [Program Phase 4](../../standards-plan-roadmap/02-roadmap.md) and [astro-sites ROADMAP](../../../../standards/domains/astro-sites/ROADMAP.md) - the authorities this package operationalizes.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
| 2026-07-03 | verifier fixes applied (lead-ruled) |
