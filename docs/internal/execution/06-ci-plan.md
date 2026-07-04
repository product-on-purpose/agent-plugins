---
title: CI Plan
description: How CI evolves across the standards program, from the current validate-registry gate to tiered enforcement, a shared standards-gate workflow, and consolidated Astro CI
status: draft
last-updated: "2026-07-03"
audience: engineer
level: advanced
tags: [ci, execution, standards, validate-registry, standards-gate, branch-protection]
doc-role: ci-plan
---

# CI Plan

The continuous-integration plan for the whole standards program. It operationalizes the locked roadmap in [`../standards-plan-roadmap/`](../standards-plan-roadmap/00-README.md) - it invents no checks, allocates no version or check numbers, and restates no decision rationale. Where a decision or clause is load-bearing here, this doc links to it. The two-lane execution model (autonomous in-repo Lane A vs approval-gated cross-repo Lane B) is defined in [`03-execution-plan.md`](03-execution-plan.md); the CI work is split between them accordingly.

Scope reminder (maintainer rulings R1 (in-repo only this session) and R2 (cross-repo is approval-gated)): only the `agent-plugins` CI changes execute autonomously in Lane A. Every CI change touching another repo - the `product-on-purpose/.github` org gate, the four members' callers, the Astro consolidation - is a staged Lane B package that fires only on the maintainer's per-package go.

Related plans: the check-8/9 spec this doc schedules is [`../standards-plan-roadmap/drafts/ci-repin-check.md`](../standards-plan-roadmap/drafts/ci-repin-check.md); the Astro CI design is [`../../../standards/domains/astro-sites/ci-standard.md`](../../../standards/domains/astro-sites/ci-standard.md); branch-protection and gate risks are ranked in [`09-risk-register.md`](09-risk-register.md); the maintainer choices this plan surfaces live in [`08-decision-register.md`](08-decision-register.md).

## 1. Current state - what each repo's CI actually enforces today

Verified against live workflows and `gh api`. The recurring theme: the "family Standard" is not uniformly enforced, and two members' tier claims are not backed by what their CI runs.

| Repo | Gate workflow(s) | What it actually enforces today | Runs the toolkit `check.mjs`? | Claim vs reality |
|---|---|---|---|---|
| `agent-plugins` (registry) | `validate-registry.yml` -> `validate-registry.mjs` checks 1-7 | JSON validity, schema shape, per-entry fields, `source` + 40-hex `sha`, sha-on-a-release-tag (live API), no-placeholder / `strict:true`, installability smoke (live API). Runs on push (path-filtered), every PR, weekly Monday drift cron, dispatch. | n/a (registry, not a plugin) | The re-pin *convention* (CONTRIBUTING.md L3/L4) is enforced by no code - maintainer review only. |
| `agent-skills-toolkit` | `ci.yml` -> `npm test` then `node scripts/check.mjs .` (true self-hosting); second job builds the Astro site + 14.11 guards | The full 30-check spine against itself; `tier-report` = advanced with empty burndown | Yes - it *is* the source | Claim matches: self-proving Gold at Standard 0.12. |
| `thinking-framework-skills` | `ci.yml` "Conformance gate" checks out the toolkit at pinned ref `2f480d1` and runs `check.mjs`; `deploy-pages.yml` | The toolkit's checks - but at a 2026-06-01 ref, roughly 67 commits stale | Yes, but at a stale pin | Declares `standard: 0.8` / advanced (Gold); the pinned gate predates roughly half the Gold suite and all of U13, so the Gold claim is unverified against the live Standard. |
| `writing-style-catalog` | `validate.yml` -> `python tools/validate.py` + `check-no-dashes.mjs`; `validate-plugin.yml` | Home-grown taxonomy/frontmatter/dash/manifest checks only | No | Declares `standard: 0.11` / universal in `library.json` but never runs the toolkit checker; the tier claim is self-graded. |
| `pm-skills` | `validation.yml` (~40-script Windows+Ubuntu matrix), `validate-plugin.yml`, plus 6 more | An entirely proprietary conformance apparatus | No | No `library.json`, no `standard`/`tier` field at all - cannot pin the Standard (fails CONTRIBUTING.md L3) and retains an embedded self-listing marketplace (fails L2). |

Live branch protection on `agent-plugins` `main`: required check `validate`, `strict: false`, one review, `enforce_admins: false`. The `strict: false` setting breaks the up-to-date-before-merge serialization that [`../../../standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 6 claims as mechanical (see Section 5).

**Two unverified-claim remediations** (both approval-gated Lane B per R2, both recorded in [`08-decision-register.md`](08-decision-register.md)):

- `thinking-framework-skills` runs the toolkit gate at stale ref `2f480d1`. Re-pinning that checkout to a current Standard ref, and burning down the resulting warns off `standard: 0.8`, is its own D2-pull decision - recommended here, gated on the maintainer. Adopting the shared `standards-gate.yml` (Section 4) makes the pin currency a caller input rather than a hardcoded sha, which is the durable fix.
- `writing-style-catalog` declares a tier it never verifies. Adopting the shared gate is what substantiates its `standard: 0.11` / universal claim in CI; until then the claim is self-graded.

## 2. Target CI state at each phase exit

Phases are cumulative: each row is the CI reality once that phase's package has landed, on top of every earlier phase. The Package column names the plan that owns the change and therefore which lane and gate it runs through. The only wholly-Lane-A rows are the `validate-registry` work and the `strict: true` flip; everything else is approval-gated.

| Phase exit | New/changed CI reality | Package |
|---|---|---|
| Phase 0 (Lane A + B1 + B2) | `standards-gate.yml` shipped and tagged in `product-on-purpose/.github`; `check.mjs` + the 30-check spine relocated to `agent-plugins/standards/checks/`; askit re-adopts the reusable gate (its duplicate copies deleted last); `validate-registry` carries checks 8/9 advisory; `agent-plugins` `main` flips `strict: true`. | [`B1 (ship the org gate)`](05-lane-b/B1-pr-a-org-gate.md), [`B2 (askit re-adopt)`](05-lane-b/B2-pr-c-askit-readopt.md), [`04-lane-a-plan.md`](04-lane-a-plan.md) |
| Phase 1 (B3) | `pm-skills` carries a root `library.json` pinning Standard 0.12 at its tier, embedded marketplace removed, passes Universal at its pinned commit - so all four members can pin. | [`B3 (pm-skills convergence)`](05-lane-b/B3-phase-1-pm-skills.md) |
| Phase 2 (CI keystone) | `validate-registry` check 8 (re-pin conformance) flips to blocking; check 9 (truth-in-targeting) runs advisory; `standard` + `tier` surfaced in registry output + JSON artifact. | Lane A [`LA-4`](04-lane-a-plan.md) advisory land; blocking flip gated on B3 |
| Phase 3 (B4) | Three new frontmatter checks (`frontmatter-schema`, `adr-frontmatter`, `spec-frontmatter`) land warn-then-error via the shared gate; casing/shim campaigns pushed fleet-wide. | [`B4 (FC-0001 + Phase 3)`](05-lane-b/B4-fc-0001-and-phase-3.md) |
| Phase 4 (B5) | One shared `astro-site.yml` replaces four duplicated site workflows; `astro-docs-preset` extracted; HISTORY.md-presence + frontmatter-tier checks live; check 9 flips to blocking; Section 14 lands normative. | [`B5 (Phase 4 CI + Section 14)`](05-lane-b/B5-phase-4-ci-and-section-14.md) |
| Phase 5 (B6) | `commit-msg` commitlint hook enforced; release subsystem operational. | [`B6 (Phase 5 process + hooks)`](05-lane-b/B6-phase-5-process-hooks.md) |

## 3. The validate-registry evolution (checks 8 and 9)

The registry validator gains two checks per the implementation-ready spec in [`../standards-plan-roadmap/drafts/ci-repin-check.md`](../standards-plan-roadmap/drafts/ci-repin-check.md). This is the one CI keystone that is fully in-repo, so it executes in Lane A (task [`LA-4`](04-lane-a-plan.md)); only the blocking flips are evidence-gated on other work.

- **Check 8 (re-pin conformance)** - at each pinned `repo@sha`, assert a root `library.json` with a `standard` pin and a valid `tier`, and assert the repo's own CI was green at that sha (combined status + check-runs). Enforces CONTRIBUTING.md L3/L4.
- **Check 9 (truth-in-targeting)** - at each pinned commit, assert every declared `agent-targets` entry actually ships its native distribution plus context shim, per [`D10 (cross-tool / truth-in-targeting)`](../standards-plan-roadmap/03-decisions.md). A `"codex"` claim resolves to codex-distributed artifacts per [`D17 (Codex: deliver; supersedes D10 Codex-defer)`](../standards-plan-roadmap/03-decisions.md).

Rollout (mirrors the existing `REGISTRY_CHECK7=advisory` precedent - a per-check env toggle that demotes fail to warn):

| Stage | Check 8 | Check 9 | Trigger |
|---|---|---|---|
| Lane A land (`LA-4`) | advisory (`REGISTRY_CHECK8=advisory`) | advisory (hard-coded) | in-repo, autonomous |
| Check 8 blocking flip | blocking (delete the env var) | still advisory | gated on [`B3 (pm-skills library.json)`](05-lane-b/B3-phase-1-pm-skills.md) landing **plus** an advisory run showing all four members green |
| Check 9 blocking flip | blocking | blocking (Phase 4) | [`B5 (Phase 4 CI + Section 14)`](05-lane-b/B5-phase-4-ci-and-section-14.md) |

Two invariants carried from the spec:

- Check 8 must not flip to blocking while any member would fail. As of today `pm-skills` has no `library.json`, so blocking check 8 would fail it immediately - the advisory toggle is precisely what lets the check land in Lane A before pm-skills converges in Phase 1. The flip PR must cite the green advisory run (evidence-then-law).
- The codex-distributed native leg of check 9 is gated by a separate `REGISTRY_CODEX_NATIVE` toggle that stays off until the Codex path-reconfirm spike and the per-plugin emitters land in [`B7 (Codex workstream)`](05-lane-b/B7-codex-workstream.md). Until then check 9 verifies the portability floor for `"codex"` as an interim signal. The native flip and the advisory-to-blocking flip are orthogonal.

Both checks read only the pinned `repo@sha` via the GitHub API and raw content, never `HEAD`, so the gate stays authoritative over exactly what users install. Non-github hosts and repos with no CI status warn-and-skip (absence is not a red signal), reusing the existing check-5/7 skip pattern. The weekly Monday drift cron re-runs the whole validator, so a Standard pin or a member's CI status that goes red between pushes - a deleted required workflow, a moved tag - surfaces on the next scheduled run rather than silently invalidating the pin.

Alongside the checks, `LA-4` surfaces `standard` + `tier` per entry in the human validator log and, behind `REGISTRY_SUMMARY_JSON`, a machine-readable artifact - without duplicating anything into `marketplace.json` (the conformance facts stay in each plugin's `library.json`).

## 4. The shared gate: standards-gate.yml and thin pinned callers

Per [`D14 (runner-consumption: reusable workflow)`](../standards-plan-roadmap/03-decisions.md), member repos consume the relocated runner through one reusable `workflow_call` workflow, never a vendored copy (the four-drifting-copies anti-pattern). The mechanism is proven locally in `spikes/runner-consumption-spike.md` (the runner grades any checked-out root by that root's own `library.json` pin); what remains is live-Actions wiring, the relocation, and the org-repo push - "sequencing, not unknowns."

- **`standards-gate.yml`** (in `product-on-purpose/.github/.github/workflows/`) - `workflow_call` interface, two checkouts: the caller repo, then a sparse cone-mode checkout of `agent-plugins` `standards/` at a pinned `standards-ref` input into `.standards-runner/`, then `node .standards-runner/standards/checks/check.mjs .`. Shipped and tagged by [`B1 (ship the org gate)`](05-lane-b/B1-pr-a-org-gate.md).
- **Thin caller** - each member keeps a small `ci.yml` that does nothing but `uses: product-on-purpose/.github/.github/workflows/standards-gate.yml@v1.0.0` with its own `standards-ref`. The member owns its triggers; the gate owns the contract.
- **Tag discipline** - callers pin an immutable release tag (`@v1.0.0`); a moving major tag (`@v1`) lets a fix reach every caller by moving the tag, with `@<sha>` available to hold any one repo back. Same discipline the Astro workflow uses.
- **Node pin** - the gate pins Node 22.12 for the runner checkout; the Astro consolidation (Section 6) pins Node from each site's root `.nvmrc`. The two are independent (skill conformance vs site build) and stay separate jobs.

**Prerequisite - the org repo exists; wire the workflow into it.** Both the standards gate (`standards-gate.yml`) and the Astro consolidation (`astro-site.yml`) assume a `product-on-purpose/.github` org-level repo to host the reusable workflows. This repo was confirmed live on 2026-07-03: it is public, its default branch is `main`, and it is empty of workflows (no `.github/workflows/` tree yet). B1's first task is therefore to create `.github/workflows/standards-gate.yml` in it, not to confirm the repo exists. This is tracked in [`09-risk-register.md`](09-risk-register.md).

**Reusable-workflow gotchas to carry into implementation** (both gates, from the spikes and the Astro CI design):

- A caller's workflow-level `env` does **not** propagate into a `workflow_call` callee. Pass values as typed inputs or set them at step level, never as a caller-scoped `env` the callee reads.
- Artifacts are not auto-shared across jobs. Keep build + validators in one job so `dist` (Astro) or the checked-out `.standards-runner/` stays on the runner; do not split and shuttle.
- `GITHUB_TOKEN` permissions only downgrade down the `workflow_call` chain. Declare the permissions a deploy or API-reading job needs at the caller, least-privilege.
- `setup-node`'s `node-version-file` resolves from `GITHUB_WORKSPACE`, not the job working-directory, so one repo-root `.nvmrc` feeds every job.

**Live-Actions validation events** (the two-checkout wiring has never run end to end, so it is validated before anything depends on it):

1. **B1 throwaway-caller test** - after `standards-gate.yml` is tagged, a disposable caller exercises the two-checkout wiring on real GitHub Actions and is then deleted. This is the R3 throwaway-caller test recorded in the decision register. A fully green *conformance* run additionally depends on the PR-B relocation (R7) having made `standards/checks/check.mjs` real; until PR-B merges, the throwaway caller validates the wiring against the relocation branch head.
2. **B2 askit caller** - askit re-adopts the reusable gate as its real CI and must be observed green before its now-duplicate in-repo runner copies are deleted (the gate-never-red invariant, Section 8).

## 5. Branch-protection plan

`agent-plugins` `main` is the one place a branch-protection change executes autonomously, because it is in-repo and load-bearing for governance serialization.

- **Lane A, per R6** - flip `required_status_checks.strict: true` on `agent-plugins` `main`. This restores the up-to-date-before-merge serialization that GOVERNANCE.md Section 6 depends on to stop two concurrent Standard amendments from colliding on the next version/ADR/section number. `enforce_admins` stays `false` and is recorded as a **documented residual risk** in [`09-risk-register.md`](09-risk-register.md) (solo maintainer can still bypass gates; flipping it is a maintainer call, not this session's).
- **Other four repos (approval-gated, R2)** - recommendations to standardize required-status-checks (the shared gate as a required check once B2/B5 land it) and to reconcile `enforce_admins` are recorded in [`08-decision-register.md`](08-decision-register.md), but no member-repo protection setting changes without the maintainer's per-repo go.

## 6. Astro CI consolidation and preset extraction (B5)

Phase 4 replaces four duplicated Astro site workflows with one reusable `astro-site.yml` in `product-on-purpose/.github`, driven by the design in [`../../../standards/domains/astro-sites/ci-standard.md`](../../../standards/domains/astro-sites/ci-standard.md). Its primary payload is not "add PR builds" (3 of 4 sites already have them) but carrying the four build-aware clause-14.11 link/route validators to the three siblings that lack them, and ending the `node-version` mechanism drift.

- **Shared workflow** - one `workflow_call` job (checkout, pin Node from `.nvmrc`, `npm ci`, portable guard suite, generator + `astro build`, the build-aware validators against `dist`), with an event-gated deploy tail so a green PR predicts a green deploy.
- **Preset extraction** - `scripts/ci-checks.mjs` and the four validators (`check-rendered-links`, `check-route-parity`, `verify-edit-links`, `remark-resolve-links`) move into `@product-on-purpose/astro-docs-preset`, seeded from the hardened donor versions (start from the fixed toolkit copies, not the raw donor).
- **No flag day** - pilot on `thinking-framework-skills`, then `agent-skills-toolkit`, then `writing-style-catalog` (proves the `.md` vs `.mdx` remark passthrough), then `pm-skills` last (highest blast radius, donates the validators). Each repo keeps its old workflow until the shared one is green on at least 3 PRs and one main deploy, then deletes the old file and marks the shared build job required. Repo-specific jobs (pm-skills' dual-OS matrix, askit's `check.mjs` conformance gate) stay separate. This lands with Section 14 becoming normative.

## 7. The warn-one-minor-then-error tiered ramp

Every new enforcing check ships under the Standard Section 7.7 burndown - `warn` for at least one Standard MINOR, then `error` - so a downstream plugin always gets a one-version migration window. Per [`D15 (enforcement: full, tiered ramp)`](../standards-plan-roadmap/03-decisions.md), the fleet converges tier by tier across Phases 2/4/5: the **Bronze** (Universal) floor blocks first, then **Silver** (Convergent), then **Gold** (Advanced). A repo can carve out a single below-ceiling clause via the D12 exceptions mechanism without dropping its whole tier.

Checks riding this ramp:

| Check | Lands | Ramp |
|---|---|---|
| Re-pin conformance (check 8) | Phase 2 | advisory -> blocking once all four members carry a clean `library.json` + green CI |
| Truth-in-targeting (check 9) | Phase 2 advisory | -> blocking in Phase 4 |
| `frontmatter-schema`, `adr-frontmatter`, `spec-frontmatter` | Phase 3 (B4) | warn one minor -> error |
| HISTORY.md-presence ([`D16`](../standards-plan-roadmap/03-decisions.md)) | Phase 4 (B5) | warn one minor -> error, scoped to new/changed components only (diff-aware, no backfill campaign) |
| `frontmatter-tier` | Phase 4 (B5) | warn one minor -> error |

Check and `since` numbers are allocated only at LAND on the protected branch (the allocation-at-land invariant); this plan schedules them, it does not number them.

## 8. CI failure playbook

**Who gets flagged.** The validator already separates transient from hard failures via `labelErr` - a `403 remaining=0` or `5xx` from the GitHub API reads as "re-run", a real defect reads as "fix the registry". Transient failures never fail the registry (they retry through `fetchRetry`). On Lane A, a hard CI failure surfaces to the orchestrator (Fable) per R5, which does not merge a Lane A PR until the validate gate is green **and** a Codex adversarial review has been run and answered.

**Gate-never-red choreography.** Three rules keep `main` continuously green through every migration:

1. Every new check lands advisory first; it only demotes-to-warn on the repos that have not yet converged.
2. A flip-to-blocking PR must cite a green advisory run showing every current member passing - evidence before law (GOVERNANCE.md Section 7 / CONTRIBUTING.md Section 8 ratchet).
3. Never delete a repo's in-repo runner copy until its shared-gate caller is observed green on real Actions (the load-bearing Phase 0 invariant: askit keeps its copy until [`B2`](05-lane-b/B2-pr-c-askit-readopt.md)'s caller is green).

**Merge authority differs by lane.** A Lane A CI change (the `validate-registry` checks, the `strict: true` flip) merges autonomously once its gate is green and a Codex adversarial review is answered (R5). A Lane B CI change (the org gate, any member caller, the Astro consolidation, any member-repo protection setting) merges only on the maintainer's per-package go (R2) - a green gate is necessary but not sufficient. The playbook rules above apply in both lanes; only the merge trigger changes.

**Rollback discipline.** A blocking flip is reversible by restoring one env var (`REGISTRY_CHECK8=advisory`, or re-adding `REGISTRY_CHECK9`), not by ripping out the check - the check keeps running advisory while the failing member is fixed. An Astro consolidation regression rolls back by re-pointing the caller from `@v1` to the last-good `@<sha>` while the shared workflow is repaired. A member that must ship below its tier ceiling on a single clause uses the D12 exception rather than dropping tier or disabling the gate. No rollback path re-opens the gate to red: a broken check demotes to advisory, it does not get deleted mid-migration.

## Through-line

CI evolves from one registry validator plus four divergent member gates into a single shared `standards-gate.yml` that every member consumes at its own pinned Standard ref, with the registry validator (checks 8/9) confirming from the outside that each pinned commit was green and truthful. Every step lands advisory, flips to blocking only against a green all-four run, and is reversible by an env-var restore - so `main` is never intentionally red, and the only autonomous surface is `agent-plugins` itself.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | Created. |
| 2026-07-03 | verifier fixes applied (lead-ruled) |
