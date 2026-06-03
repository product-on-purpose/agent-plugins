# Spec: consistent CI

> One CI shape across the family: the reusable `workflow_call` (proven in the Astro `ci-standard`) for the site, a shared portable conformance-gate invocation for the plugin, and standardized action pins. Status: DRAFT / PROPOSED (2026-06-02). Backlog epic E3. Overlaps the Astro ROADMAP Phase 1.

## 1. Goal

A contributor sees the same CI contract in every repo: one reusable site workflow invoked by a thin caller, the portable conformance gate run the same way, and one pinned action-version set. CI stays the place that *shells out* to portable scripts (per `STANDARD.md` 4.x), never the place correctness lives.

## 2. Current drift

- **Per-repo workflows** with different names and shapes: `validation.yml` (pm-skills, 312-line dual-OS matrix), `ci.yml` (askit, tfs), `validate.yml` (wsl), plus `deploy-pages.yml` / `build-site.yml`.
- **Action-version + node mechanism drift** (partly fixed during the Astro rollout): some jobs hardcoded `node-version`, some on stale `checkout`/`setup-node` majors. The fixes were applied per-repo; the *mechanism* (`node-version-file: .nvmrc`, `@v5`) is now consistent but not enforced centrally.
- **No shared workflow exists yet**: `product-on-purpose/.github` has no `workflows/`; the reusable `astro-site.yml` is specced but unbuilt.
- **The four build-aware link/route guards** live in three repos as local ports (post-rollout) and need consolidation into one shared validator (the drift the Astro ROADMAP Phase 1 addresses).

## 3. Target

Two layers, both shared:

1. **Site CI** - the reusable `astro-site.yml` `workflow_call` in `product-on-purpose/.github`, invoked by a ~20-line caller per repo. Single build job, event-gated tail (PR builds + guards, push deploys). Full design: [`standards/domains/astro-sites/ci-standard.md`](../../../standards/domains/astro-sites/ci-standard.md).
2. **Plugin conformance gate** - each repo runs the portable `check.mjs` / `ci-checks.mjs` (the toolkit's zero-dependency spine); CI only invokes it. Kept separate from the site workflow (a repo without a site still runs its gate; a site workflow does not carry plugin conformance).

Plus: one pinned action-version set and the `node-version-file` mechanism, enforced by a node-pin guard in the shared suite.

## 3a. Note on the two not being one workflow

The pm-skills 312-line shell-validator matrix and the toolkit's conformance gate are **repo-specific** and must not be folded into the shared site workflow (it would bloat the workflow or drop coverage). The shared workflow covers the *site*; a separate repo job covers *plugin conformance*. Both run side by side.

## 4. Plan

1. **E3.1** Stand up `product-on-purpose/.github` with `astro-site.yml@v1` (Astro ROADMAP Phase 1.1), seeded from the fixed guard versions (rollout-hardened).
2. **E3.2** Define the shared conformance-gate invocation (portable script entrypoint each repo calls).
3. **E3.3** Orchestrate adoption of the reusable workflow (fleet change; pilot tfs, then the rest), running old + new in parallel until the new is green on >=3 PRs + 1 deploy.
4. **E3.4** Re-pin actions / node mechanism fleet-wide as a uniform fleet change (the textbook Level-2 case).

## 5. Acceptance

- `product-on-purpose/.github` hosts the reusable workflow at a moving `@v1` tag.
- Each site repo has a thin caller; the four build-aware guards run from one shared, hardened source.
- One pinned action set; `node-version-file` everywhere; a node-pin guard enforces it.
- Each repo's plugin conformance gate runs unchanged alongside.

## 6. Dual documentation

Central: this spec + the `ci-standard.md` design + the campaign record. Local: each repo's caller workflow + a CHANGELOG entry referencing the campaign id. The CI contract is defined once (the reusable workflow); callers reference it by `@v1`, exactly as decouple-and-pin prescribes.

## 7. Open questions

- Caller pinning: `@v1` moving tag (auto-pick patches) vs `@<sha>` (hold back). Recommendation: `@v1`, with `@<sha>` available per repo.
- Whether the plugin conformance gate also becomes a reusable workflow, or stays a per-repo `ci.yml` calling the portable script. Recommendation: portable script + thin per-repo job; revisit if the jobs converge.
