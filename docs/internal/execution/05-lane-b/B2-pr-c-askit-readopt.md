---
title: "PR-C (askit re-adopt) approval package"
description: "Lane B package to repoint agent-skills-toolkit CI onto the relocated conformance runner, then delete its moved copies last"
status: draft
last-updated: "2026-07-03"
---

# B2 - PR-C (askit re-adopt): approval package

> **Lane B, approval-gated.** Per maintainer ruling R2 (cross-repo gate), PR-C (askit re-adopt) touches a second repository (`agent-skills-toolkit`) and therefore fires only on the maintainer's explicit per-package go. This document is authored and staged; it is NOT executed in this session (R1 scopes this session to Lane A, in-repo writes only). It operationalizes the planning package - it does not restate its decisions. The upstream truth lives in the locked plan: [phase-0-truth-and-relocation.md](../../standards-plan-roadmap/plans/phase-0-truth-and-relocation.md) Tasks C-1 and C-2, and the consumption ruling in [runner-consumption.md](../../standards-plan-roadmap/drafts/runner-consumption.md) (the D14 reusable-workflow decision).

## 1. Purpose

PR-C (askit re-adopt) completes Phase 0 by making `agent-skills-toolkit` a consumer of the one canonical conformance runner instead of its owner. It does two things in a strict order:

1. **Repoint first.** Point askit's CI and release gates at the reusable `standards-gate.yml` workflow (shipped by PR-A, the org gate) which consumes the runner relocated into `agent-plugins/standards/checks/` (by PR-B, the Lane A LAND), and point askit's local-dev `npm run check` at the same relocated runner. Prove both paths green.
2. **Delete last.** Only after the caller is green on the relocated runner, remove askit's now-duplicate `STANDARD.md` and `scripts/` copies.

The load-bearing invariant, carried verbatim from the plan: **never delete askit's copy until its caller is green.** askit keeps a working local copy through the entire repoint stage; nothing is removed until two independent green proofs exist. This is what keeps askit's conformance gate from ever going dark across the move.

askit keeps its Gold grade because G2 (self-hosting) requires *running* the validators, not *owning* them (STANDARD.md sec 4.1 / 4.4, cited in the plan). Keeping an npm script literally named `check` that resolves to the relocated runner preserves the G2 signal with zero regex edits.

## 2. Preconditions (hard gates before PR-C opens)

PR-C cannot start until all of these hold. They are upstream deliverables owned by other packages; PR-C only consumes them.

- **PR-A (org gate) merged, tagged, and live-run green.** [B1-pr-a-org-gate.md](B1-pr-a-org-gate.md) must have landed `standards-gate.yml` in `product-on-purpose/.github`, tagged it immutably (`v1.0.0`), and proven it with a real GitHub Actions run against a caller. That live run is the program's single unproven wiring (the audit's one Medium-confidence item, recorded in [01-audit-2026-07-03.md](../01-audit-2026-07-03.md)); B1 owns closing it before PR-C wires askit for real.
- **PR-B (Lane A relocation) merged.** [04-lane-a-plan.md](../04-lane-a-plan.md) must have landed the runner into `agent-plugins/standards/checks/` and `STANDARD.md` (header stays 0.12 per R3) on agent-plugins `main`, at a known, immutable SHA or tag. Until PR-B merges, `standards-gate.yml`'s checkout of `standards/checks/` resolves to nothing.
- **The interlock is resolved upstream.** The canonical Phase 0 ordering that breaks the apparent PR-A/PR-B circularity - prove PR-A against the PR-B branch head, merge PR-B (R7), then wire askit - is owned by the [Phase 0 interlock note in 03-execution-plan.md](../03-execution-plan.md). PR-C's own precondition reduces to: **B1 (PR-A) green and PR-B merged** before PR-C opens.

## 3. The npm-check resolution question (decided)

**Question:** once the runner lives in `agent-plugins/standards/checks/`, how does askit's local `npm run check` (and the G2 self-hosting probe) obtain and run it? Two candidates: a pinned `agent-plugins` checkout at a gitignored `.standards-runner/`, or an `npx`-from-git wrapper.

**Recommendation (firm): the pinned, gitignored `.standards-runner/` checkout.** This matches the plan's R4 and is the right call because:

- **It mirrors CI exactly.** The reusable workflow does a sparse checkout of `standards/` at a pinned ref and runs `node .standards-runner/standards/checks/check.mjs .`. Using the same path locally preserves the Standard's "local == CI" property (the whole point of a portable runner).
- **It is deterministic and offline-capable.** Once checked out at a pinned SHA, every local run grades against exactly the runner version CI used. `npx`-from-git resolves a moving ref over the network on every run and can silently pull a different runner than CI graded against - reintroducing the local/CI drift the relocation exists to kill.
- **It is the easiest to reason about.** One documented `git` command pins the exact runner matching askit's `library.json` standard pin.

Two implementation obligations that make this safe, both verified in the steps below:

- **Gitignore `.standards-runner/`.** askit must NOT commit the checkout, or it re-vendors the runner (the four-copies anti-pattern returns).
- **Bootstrap it.** A small `standards:sync` npm script (or a documented one-liner) provisions/updates `.standards-runner/` at the pinned ref so a fresh clone's `npm run check` is self-provisioning rather than failing on a missing path.

The npm `check` script becomes `node ./.standards-runner/standards/checks/check.mjs .`. Note the two consumption paths stay distinct: **CI/release** run through the reusable workflow (its checkout, pinned via `standards-ref`); the **npm `check` script** serves local dev plus the G2 self-hosting probe. Both target the same relocated runner at a matching pin.

## 4. Change manifest (per file in askit)

**Modified (repoint stage, no deletions):**

| File | Current state | Change |
|---|---|---|
| `.github/workflows/ci.yml` | inline `node scripts/check.mjs` conformance step (live at `ci.yml:39`) | replace with a `uses:` call to `product-on-purpose/.github/.github/workflows/standards-gate.yml@v1.0.0`, passing `standards-ref` = the PR-B merge SHA/tag (Standard 0.12). Keep the separate `npm test` job in place. |
| `.github/workflows/release.yml` | inline `node scripts/check.mjs` release gate (live at `release.yml:39`) | repoint the same way; it is a hard release gate. |
| `package.json` | `"check": "node scripts/check.mjs"` (live at `package.json:10`) | repoint `check` (and `tier-report` / `evaluate` if present) to `node ./.standards-runner/standards/checks/check.mjs .`; add a `standards:sync` bootstrap script. |
| `.gitignore` | no runner-checkout entry | add `.standards-runner/`. |
| `CHANGELOG.md`, `RELEASE-NOTES.md` | carry the Standard's version history | migrate the Standard-version history out (it now lives in `agent-plugins/standards/`, created by PR-B); askit becomes purely the reference implementation. |
| `scripts/README.md` and any folder-README inventory | list the runner files | re-sync the G8 folder-README inventory for any folder whose immediate children change on deletion. |

**Deleted (delete-last stage, only after the caller is green):**

- `STANDARD.md`
- `scripts/check.mjs`, `scripts/tier-report.mjs`, `scripts/lib/`, `scripts/checks/`, `scripts/generators/`
- the moved runner tests under `tests/` (the import-of-`scripts/` set identified in PR-B Task B-1 Step 3)

**Deletion-manifest invariant:** the set PR-C deletes MUST equal the set PR-B relocated - no more, no less. `agentskills.mjs` lives at `scripts/checks/agentskills.mjs`, inside the `checks/` unit PR-B relocates wholesale, so it moves or drops with the runner per PR-B's keep-vs-drop decision - it is NOT an askit-retained script. The genuinely retained scripts (`evaluate.mjs`, `scripts/README.md`) and their disposition were decided by PR-B's "assess, do not assume" probe (Task B-1 Step 2); PR-C mirrors that decision. Anything askit *keeps* that imported the moved `scripts/lib/` (e.g. `evaluate.mjs`) must have been moved or repointed by PR-B, or it breaks on deletion (see Risk 3 in sec 7).

## 5. Sequenced steps with per-step verification

Mirrors plan Tasks C-1 and C-2. Branch: `chore/re-adopt-relocated-runner` off askit `main`.

**Stage 1 - repoint (NO deletions):**

- **S1. Branch.** `git checkout main && git pull && git checkout -b chore/re-adopt-relocated-runner`.
- **S2. Repoint CI + release.** Edit `ci.yml` and `release.yml` conformance steps to the reusable-workflow call at `standards-ref` = PR-B merge SHA/tag. *Verify:* YAML parses (actionlint or a `yaml.safe_load` pass).
- **S3. Repoint local-dev + gitignore.** Add the `standards:sync` bootstrap, repoint the `check` script, add `.standards-runner/` to `.gitignore`. *Verify:* after `npm run standards:sync`, `.standards-runner/standards/checks/check.mjs` exists and `git status` shows `.standards-runner/` ignored (not staged).
- **S4. GATE - local green before any deletion.** `npm run check` -> `Tier: Advanced (no blockers detected)`, `0 error(s)`, exit 0. Also `node --test` to confirm askit's *retained* tests and genuinely retained scripts (e.g. `evaluate.mjs`) still resolve. Do not proceed while red.
- **S5. GATE - CI green (the live-Actions proof).** Push the branch, open PR-C (repoint-only, no deletions). Observe one real Actions run of the reusable-workflow caller green at the pinned `standards-ref`. This is also final-verification V-4. Do NOT merge and do NOT delete yet.

**Stage 2 - delete last (only after S4 and S5 are both green):**

- **S6. Delete the moved copies.** `git rm STANDARD.md` and the runner unit + moved tests. *Verify:* the removed set equals PR-B's relocation manifest exactly.
- **S7. Re-sync + migrate history.** Update any G8 folder-README inventory whose children changed; finish migrating the Standard's history out of askit's `CHANGELOG.md` / `RELEASE-NOTES.md`.
- **S8. GATE - green after deletion.** `npm run check` still green, `node --test` green (askit's genuinely retained scripts such as `evaluate.mjs` still resolve now that the `scripts/checks/` unit - including `agentskills.mjs` - has moved or dropped with the runner), exit 0 - askit now runs purely the relocated runner with no local copy.
- **S9. Version re-pin (no-op).** Per R3 (no bump), askit's `library.json` standard pin stays 0.12; this step is a no-op. Re-enable it only if the maintainer overrode PR-B to bump 0.12 -> 0.13.
- **S10. Land.** Commit the deletion, push; confirm the reusable-workflow CI is still green post-deletion; squash-merge, delete branch.

## 6. The "gate never goes red" choreography

- **One invariant, every commit:** askit's conformance gate is green at every commit on the branch and at merge. The order guarantees it: repoint and prove green (Stage 1) strictly before delete (Stage 2).
- **Two independent green proofs before the first deletion:** local `npm run check` (S4) and a real CI reusable-workflow run (S5). askit retains its own working runner copy through all of Stage 1, so if either proof is red, nothing has been lost.
- **The deletion commit lands green too:** S8 re-verifies immediately after `git rm`, so even the delete step is a green commit; Stage 2 never squash-merges on a red gate.

## 7. Rollback at each stage

- **Stage 1 (repoint) is fully reversible with zero data loss.** askit still holds its own `scripts/` and `STANDARD.md`, so if the reusable workflow or `npm run check` fails, revert the `ci.yml` / `release.yml` / `package.json` / `.gitignore` edits (or just close the branch); askit is back to true self-hosting. No dark window ever opened because nothing was deleted.
- **Between stages:** if S5 CI is red, STOP. Do not enter Stage 2. `main` is untouched (PR unmerged); fix or abandon the branch.
- **Stage 2 (delete) rollback:** if S8 is red, `git revert` the deletion commit (the copies are still in branch history) to restore askit's local runner - a revert, not a re-copy. If a latent failure surfaces after Stage 2 merged, revert the merge commit on askit `main`; askit returns to a green dual state (local copy + reusable-workflow caller) while the cause is diagnosed.
- **Upstream ref rollback dependency:** because PR-C pins `standards-ref` to a specific agent-plugins SHA/tag and pins the org workflow at `@v1.0.0`, a revert or force-move of either ref breaks askit's gate. Mitigation: pin both to immutable SHAs or immutable tags, never a branch (this ties to the tag-immutability risk owned by [B1-pr-a-org-gate.md](B1-pr-a-org-gate.md)).

## 8. Risks

Severity is the impact if the mitigation were skipped; each reduces to low residual. Full program risks live in [09-risk-register.md](../09-risk-register.md); this section is the PR-C-local view.

1. **[HIGH] Half-moved dark window** - deleting askit's copy before its caller is green. *Mitigation:* Stage 2 is gated on S4 + S5 double-green; this is the plan's single most important sequencing rule.
2. **[MEDIUM] G2 regression** - if the npm `check` script is dropped or repointed to a path the GATE_PATH regex no longer matches, `self-hosting.mjs` fails askit's own Gold grade. *Mitigation:* keep a script literally named `check` resolving to the relocated runner; do not touch the regex in Phase 0; S4 verifies.
3. **[MEDIUM] Retained-script breakage** - a genuinely askit-retained script (e.g. `evaluate.mjs` importing `scripts/lib/`, or a `scripts/README.md` inventory) breaks after the moved `scripts/lib/` is deleted. (`agentskills.mjs` is not in scope here: it sits inside the relocated `scripts/checks/` unit and moves or drops with the runner, so it is never an askit-retained import.) *Mitigation:* the deletion set equals PR-B's relocation manifest exactly; `node --test` + `npm run check` at S8 surface a broken retained import loudly, not silently.
4. **[MEDIUM] standards-ref mismatch** - if `standards-ref` does not resolve to an agent-plugins ref carrying Standard 0.12, askit grades against the wrong runner or fails checkout. *Mitigation:* set `standards-ref` = the PR-B merge SHA/tag (0.12), immutable; the S5 live run confirms it.
5. **[LOW-MEDIUM] Ref/tag drift** - a moved `v1.0.0` (org workflow) or a moved PR-B ref silently breaks askit's gate. *Mitigation:* pin both to immutable SHAs/tags; document the pin-bump cadence (shared with B1).
6. **[LOW] `.standards-runner/` re-vendored** - if the checkout is committed, askit re-vendors the runner (the four-copies anti-pattern returns). *Mitigation:* `.gitignore` entry added at S3; S3 verifies it is ignored.
7. **[LOW] Local bootstrap friction** - a fresh clone's `npm run check` fails until `.standards-runner/` is provisioned. *Mitigation:* the `standards:sync` bootstrap plus a recorded "local == CI" one-liner in the scripts README.
8. **[LOW] Residual askit-isms in the relocated runner** (FIXED_ROOTS naming askit dirs, `askit-build-docs` strings) - output-only, `isDir`-guarded; not a PR-C break. *Mitigation:* fast-follow parametrization; do NOT block Phase 0.

## 9. Recommendation

Proceed with PR-C as a single askit PR executed in two verified stages (repoint, then delete-last) once its preconditions hold. Adopt the gitignored `.standards-runner/` checkout for local/G2 resolution (not `npx`-from-git). Set `standards-ref` to the immutable PR-B merge SHA/tag matching askit's 0.12 pin. Take no `library.json` re-pin (R3, no bump). Hold PR-C's merge until its own reusable-workflow CI is observed green - which doubles as the program's live-Actions validation and closes the audit's one open wiring gap. As a Lane B package (R2), PR-C fires only on the maintainer's explicit per-package go.

## 10. Approval checklist (maintainer sign-off before PR-C fires)

- [ ] PR-A (org gate) merged, `v1.0.0` tagged immutable, and a live Actions run of `standards-gate.yml` observed green ([B1-pr-a-org-gate.md](B1-pr-a-org-gate.md)).
- [ ] PR-B (Lane A relocation) merged to agent-plugins `main`; `standards/checks/` and `STANDARD.md` 0.12 exist at a known immutable SHA/tag ([04-lane-a-plan.md](../04-lane-a-plan.md)).
- [ ] `standards-ref` value chosen = the PR-B merge SHA/tag carrying Standard 0.12, immutable.
- [ ] npm-check resolution confirmed: gitignored `.standards-runner/` checkout (recommended), or an explicit maintainer override to `npx`-from-git.
- [ ] Version ruling confirmed: no bump (R3); the `library.json` re-pin (S9) is a no-op.
- [ ] Deletion manifest confirmed to equal PR-B's relocation manifest exactly, including PR-B's `evaluate.mjs` disposition and its keep-vs-drop of `scripts/checks/agentskills.mjs` (which relocates or drops with the runner, not an askit-retained script).
- [ ] Maintainer's per-package go for PR-C (R2), and confirmation that PR-C merges only after its own reusable-workflow CI is green.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
| 2026-07-03 | verifier fixes applied (lead-ruled) |
