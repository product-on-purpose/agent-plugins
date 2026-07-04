---
title: "B1 - PR-A approval package - ship the org gate"
description: "Approval package for PR-A, the net-new reusable standards-gate.yml workflow in product-on-purpose/.github, covering change manifest, the throwaway-caller live-Actions test, rollback, and the maintainer authorization checklist"
status: draft
last-updated: "2026-07-03"
---

# B1 - PR-A (ship the org gate)

Lane B, package 1 of 7. This is an approval-gated cross-repo package. Per maintainer ruling R2 (cross-repo gate) nothing here fires without the maintainer's explicit per-package go; this document is the recommendation and the exact plan the go authorizes. It operationalizes the locked planning package (see [runner-consumption spike](../../standards-plan-roadmap/spikes/runner-consumption-spike.md) and [D14 in 03-decisions.md](../../standards-plan-roadmap/03-decisions.md)); it does not restate their rationale.

## TL;DR

PR-A (ship the org gate) creates one net-new file, the reusable `standards-gate.yml` workflow, in `product-on-purpose/.github`, then tags the merged commit `v1.0.0` so callers can pin it. It touches no plugin and no `agent-plugins` code. Its one job beyond shipping is to close the single unproven assumption in Phase 0 (truth and relocation): the live GitHub Actions two-checkout mechanics have never run end to end (R3's throwaway-caller test, recommended but never executed, the ONE medium-confidence item). Rollback is deleting a tag and a file; nothing pins it yet. Recommendation: strongly recommend the go.

## Purpose

Implement D14 (runner consumption = reusable workflow): the relocated conformance runner MUST be consumed via a reusable GitHub Actions workflow that lives in `product-on-purpose/.github`, checks out `standards/` at a pinned ref, and grades the calling repo. PR-A ships and tags that workflow. It is deliberately the first Phase 0 landing because it is net-new and reversible, and because it is the only place the family can run the live-Actions validation the spike could not perform locally. See [D14 (runner consumption)](../../standards-plan-roadmap/03-decisions.md) and the [runner-consumption draft](../../standards-plan-roadmap/drafts/runner-consumption.md) for the full decision and option analysis.

## Preconditions (verified live 2026-07-03)

| Precondition | Required state | Verified state (2026-07-03) |
|---|---|---|
| Workflow OAuth scope (hard blocker) | The authoring identity's `gh` token MUST hold the `workflow` scope; verify with `gh auth status` | **NOT satisfied** (verified live 2026-07-03; current token scopes are `gist`, `read:org`, `repo` - no `workflow`). Remediation: `gh auth refresh -h github.com -s workflow` (one-time maintainer action), or route workflow-file writes through an identity that already has Actions/workflows write access. |
| Org repo exists | `product-on-purpose/.github` present | Present (`gh repo view`) |
| Default branch | `main` | `main` |
| Visibility | public (so callers can `uses:` it) | `PUBLIC` |
| Not empty | has at least a base commit to branch from | `isEmpty: false` |
| No prior workflow | no `.github/workflows/` yet, so the file is net-new | `.github/workflows` returns HTTP 404 |

Two preconditions are NOT satisfied yet. The workflow-scope row above is a hard blocker: GitHub refuses any push that creates or updates a file under `.github/workflows/` without the `workflow` OAuth scope, which gates this package's core action (creating `standards-gate.yml`), the throwaway-caller test workflow, and every later workflow-file write across the program - it MUST be remediated before step 2 below. The second, `agent-plugins/standards/checks/check.mjs` does not exist on `agent-plugins` `main` (the relocation is PR-B, atomic agent-plugins LAND), is intentionally deferred - it is the coupling described under the live-Actions test below and does not block shipping or tagging the workflow, only the green live run.

## Change manifest

Exactly two changes, both inside `product-on-purpose/.github`:

| # | Change | Path | Kind |
|---|---|---|---|
| C1 | Create the reusable conformance workflow | `.github/workflows/standards-gate.yml` | net-new file |
| C2 | Tag the merged commit so callers can pin it | git tag `v1.0.0` on the C1 merge commit | net-new tag |

The `standards-gate.yml` body is the copy-ready artifact from the spike (Section 5.1), reproduced here verbatim so this package is self-contained:

```yaml
# product-on-purpose/.github/.github/workflows/standards-gate.yml
# Reusable conformance gate. A plugin's CI calls this; it obtains the one canonical
# runner from agent-plugins/standards/ at a pinned ref and grades the CALLING repo.
name: standards-gate

on:
  workflow_call:
    inputs:
      standards-ref:
        description: >-
          The agent-plugins ref (tag or sha) to check out for the canonical runner.
          MUST match the calling repo's library.json "standard" pin policy.
        required: true
        type: string

jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      # 1) Check out the CALLER's repo into the workspace root. A reusable workflow
      #    runs in the caller's context but does NOT auto-place any code on the runner,
      #    so this checkout is explicit.
      - name: Check out caller repo
        uses: actions/checkout@v4

      # 2) Second checkout: obtain the one canonical runner from agent-plugins at a
      #    pinned ref, sparse to standards/ only, into a subdirectory so it does not
      #    collide with the caller's tree.
      - name: Check out canonical standards runner
        uses: actions/checkout@v4
        with:
          repository: product-on-purpose/agent-plugins
          ref: ${{ inputs.standards-ref }}
          path: .standards-runner
          sparse-checkout: |
            standards/
          sparse-checkout-cone-mode: true

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '22.12'

      # 3) Run the relocated runner against the CALLER's workspace root ('.').
      #    The first non-flag arg is the graded root (check.mjs parseArgs); '.' is
      #    the caller's checkout from step 1.
      - name: Run conformance gate
        run: node .standards-runner/standards/checks/check.mjs .
```

The thin caller shape each real plugin will carry later (not created by PR-A, shown for context and reused by the throwaway test below) is the spike Section 5.2 artifact, pinning `@v1.0.0`.

## Versioning

Tag the merged C1 commit `v1.0.0`. Callers pin the workflow by that tag (`uses: product-on-purpose/.github/.github/workflows/standards-gate.yml@v1.0.0`), which is the decouple-and-pin discipline D14 requires (never `@main`). `v1.0.0` is the workflow's own release tag, not a Standard version, ADR number, or section number, so it does not touch the allocation-at-land invariant. Treat `v1.0.0` as immutable once pushed: re-pointing or deleting it after any real caller exists would silently break that caller's gate (see risk R-A2). No real caller pins it until PR-C (askit RE-ADOPT), which is held behind this package.

## The throwaway-caller live-Actions test

This is the R3-recommended validation that has never run, and the reason PR-A is worth landing on its own. The spike proved the runner grades an arbitrary root locally (captured output, exit 0), but it explicitly did not run the GitHub Actions two-checkout wiring end to end. That is the one medium-confidence item in the Phase 0 plan. PR-A closes it.

Test shape: stand up a scratch caller (a temporary branch or a throwaway repo, torn down after) whose checked-out tree is a snapshot of `agent-skills-toolkit`'s current `main` (a tree that already grades Advanced), carrying a thin `ci.yml` that does `uses: ...standards-gate.yml@v1.0.0`. Trigger it; expect the gate step to print `Tier: Advanced (no blockers detected)` and `0 error(s)`, and the run to conclude `success`.

Sequencing note (a real coupling, flagged rather than hidden): the shipped `standards-gate.yml` sources the runner from `agent-plugins/standards/checks/check.mjs`, which does NOT exist on `agent-plugins` `main` until PR-B merges. So the throwaway caller's `standards-ref` input CANNOT be `agent-plugins` `main` during Lane A. It MUST point at a ref where the relocated runner already exists, which during Lane A is the PR-B relocation branch head (built and PR-opened during Lane A per ruling R7, merge held). The caller side (askit's current tree, the graded root) is independent of PR-B; only the runner-source side depends on it. Practically: to run the live test, the PR-B branch must exist first (it does, per R7), and the test passes its head sha as `standards-ref`. This makes the live-Actions validation the one place PR-A's proof depends on PR-B's branch, and it is why this package recommends building the PR-B branch before running the test, not after.

## Step-by-step execution (with verification at each step)

1. **Re-verify preconditions.** `gh repo view product-on-purpose/.github --json defaultBranchRef,visibility,isEmpty` and `gh api repos/product-on-purpose/.github/contents/.github/workflows`. Verify: default `main`, `PUBLIC`, and the contents call still 404s (no workflow yet). Stop and re-plan if a workflows dir has appeared. Also run `gh auth status` and confirm `workflow` is among the token scopes before proceeding to step 2's push; if it is absent, run `gh auth refresh -h github.com -s workflow` first (see the workflow-scope precondition above).
2. **Branch and add the file.** Create `chore/standards-gate-workflow` off `main`; add `.github/workflows/standards-gate.yml` with the C1 body above. Verify: the YAML parses (`python -c "import yaml,sys; yaml.safe_load(open('.github/workflows/standards-gate.yml')); print('yaml ok')"` prints `yaml ok`), and, if available, `actionlint` reports no error.
3. **Open and merge PR-A.** `gh pr create` against `main`; confirm the `.github` repo's own branch protection is satisfiable (see risk R-A3) and merge. Verify: the PR is merged and the file is present on `main` (`gh api repos/product-on-purpose/.github/contents/.github/workflows/standards-gate.yml` returns 200).
4. **Tag `v1.0.0`.** Tag the merge commit and push the tag. Verify: `gh api repos/product-on-purpose/.github/git/refs/tags/v1.0.0` resolves to the merge commit sha.
5. **Run the throwaway-caller live-Actions test.** Stand up the scratch caller (askit's current tree + thin `ci.yml@v1.0.0`, `standards-ref` = PR-B branch head sha). Trigger it. Verify: `gh run view <id>` shows conclusion `success`, and the gate step log shows `Tier: Advanced (no blockers detected)` with `0 error(s)`. A red or errored run HALTS the sequence and is reported to the maintainer with the run log; no auto-remediation.
6. **Record and tear down.** Record the run URL and result in [09-risk-register.md](../09-risk-register.md) (closing the live-Actions unknown) and delete the scratch caller. Verify: the scratch caller no longer triggers runs; `v1.0.0` and the workflow file remain.

## Rollback

Blast radius is zero until a real caller pins `v1.0.0`, and none does during PR-A (the throwaway caller is torn down in step 6, and PR-C is held). Rollback is two reversible actions:

1. Delete the tag: `gh api -X DELETE repos/product-on-purpose/.github/git/refs/tags/v1.0.0`.
2. Remove the workflow file via a revert PR (or `delete_file`) on `.github` `main`.

Nothing else references either. There is no data migration, no plugin change, and no `agent-plugins` change to unwind.

## Risks

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| R-A1 (runner-path coupling) | The shipped workflow references `standards/checks/check.mjs`, absent on `agent-plugins` `main` until PR-B; a naive live test with `standards-ref: main` fails to find the runner. | Medium | Pass the PR-B branch head sha as `standards-ref` for the live test (per the sequencing note); do not expect `agent-plugins` `main` to satisfy the runner source until PR-B merges. |
| R-A2 (org-repo tag drift) | Callers pin `@v1.0.0`; a moved or deleted tag silently breaks every caller's gate. | Low-Medium | Treat `v1.0.0` as immutable; document the pin-bump cadence; no real caller pins it until PR-C, held behind this package. Carried forward from the Phase 0 plan's org-repo tag-drift risk. |
| R-A3 (.github merge path) | The `.github` repo's own branch protection or required reviews may block or delay the PR-A merge. | Low | Confirm `.github` protection before opening PR-A; `enforce_admins` on the org repo is out of scope for ruling R6, which governs `agent-plugins` only. |
| R-A4 (live-Actions mechanics) | The two-checkout, sparse-cone, caller-context wiring has never run; a latent Actions-specific defect could surface only at runtime. | Medium (the item this package exists to retire) | The throwaway-caller test IS the mitigation; PR-B merge and PR-C are held until the live run is green. |
| R-A5 (runner environment) | `sparse-checkout-cone-mode` or Node `22.12` unavailable on `ubuntu-latest`. | Low | Standard `actions/checkout@v4` and `actions/setup-node@v4` behavior; the live test surfaces any gap before anything depends on it. |
| R-A6 (workflow OAuth scope) | The authoring identity's live `gh` token holds `gist`, `read:org`, `repo` but not `workflow`; GitHub refuses any push that creates or updates a file under `.github/workflows/`, blocking C1, the throwaway-caller test workflow, and every later workflow-file write in the program. | High (until remediated) | Verify `gh auth status` shows `workflow` before step 2's push (see the precondition table above); remediate with `gh auth refresh -h github.com -s workflow` (one-time maintainer action), or route workflow-file writes through an identity that already has Actions/workflows write access. |

## Recommendation

Strongly recommend the go. PR-A is the lowest-risk, highest-leverage first move in the whole program: it is a single net-new file in an org repo that currently has no workflows, it touches no plugin and no `agent-plugins` code, its rollback is deleting a tag and a file, and it is the only vehicle for closing the one unproven assumption (the live GitHub Actions run) that every downstream Phase 0 landing inherits. Shipping it first lets the family observe the two-checkout gate green in anger before PR-B relocates the runner or PR-C rewires askit, exactly the "PR-A first, throwaway caller, then proceed" option the maintainer named as an open Phase 0 question.

## Approval checklist (what the maintainer's go authorizes)

Checking "go" on this package authorizes, and only authorizes, the following:

- [ ] Create and merge the net-new `.github/workflows/standards-gate.yml` (C1) in `product-on-purpose/.github`. No existing workflow is touched (there are none).
- [ ] Tag the merged commit `v1.0.0` and push the tag (C2).
- [ ] Stand up a temporary throwaway caller and run the live-Actions test once, then tear it down.
- [ ] Record the live-run result and, if green, mark the live-Actions unknown closed in the risk register.

It does NOT authorize, and each remains separately gated:

- No change to any plugin repo (`agent-skills-toolkit`, `pm-skills`, `thinking-framework-skills`, `writing-style-catalog`).
- No change to `agent-plugins` `main` (PR-B relocation is a separate Lane B package, [B-context in 04-lane-a-plan.md](../04-lane-a-plan.md); its branch is built and PR-opened per R7 but merge is held).
- No merge of PR-B (atomic agent-plugins LAND) or PR-C (askit RE-ADOPT, [B2](B2-pr-c-askit-readopt.md)).
- No flip of any pin in a real plugin's `ci.yml`; `@v1.0.0` is pinned by no real caller until PR-C is separately approved and green.

A red live-Actions test halts the sequence and is reported; it does not trigger any remediation without a further maintainer instruction.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | Created. Preconditions re-verified live against `product-on-purpose/.github`. |
| 2026-07-03 | adversarial-panel fixes applied (lead-ruled) |
