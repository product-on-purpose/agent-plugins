# Phase 0 (Truth and Relocation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relocate the Advanced Skill Library Standard (`STANDARD.md` v0.12) and its 30-check conformance runner out of the `agent-skills-toolkit` plugin into the neutral `agent-plugins/standards/` home, wire the D14 reusable-GitHub-Actions-workflow consumption so every repo runs the one canonical gate, and sweep stale version and name references - all without the gate ever going dark.

**Architecture:** Three repos, three pull requests, serialized to avoid a dark window.
1. **PR-A** (`product-on-purpose/.github`): author and tag the reusable `standards-gate.yml` workflow. Net-new, nothing depends on it yet.
2. **PR-B** (`agent-plugins`, the atomic GOVERNANCE LAND on the protected branch): COPY `STANDARD.md` + the runner into `standards/`, add one ADR, create the Standard's `CHANGELOG.md` + `RELEASE-NOTES.md`, drop the README "not here yet" caveats, sweep stale `0.8` refs and the `writing-style-library` name drift.
3. **PR-C** (`agent-skills-toolkit`, the RE-ADOPT, separate cadence): repoint askit's CI, release, and local-dev entry to the relocated runner, verify green, THEN delete askit's now-duplicate copies.

The runner is location-portable: it grades whatever root is passed as its first argument (proven by the D14 spike - it graded `thinking-framework-skills` against that repo's own `0.8` pin, exit 0). So it relocates cleanly. askit stays G2-compliant because **G2 requires running the validators, not owning them** (`STANDARD.md` Section 4.1 allows scripts "runnable locally, in any CI, or invoked by a skill"; Section 4.4 forbids logic in CI YAML), and `self-hosting.mjs` already matches an npm `check` script, so keeping a `check` npm script preserves the Gold grade with zero regex edits.

**Tech Stack:** Node 22.12 (zero-dependency runner), GitHub Actions (`workflow_call` reusable workflows), git across three local repos, the family GOVERNANCE amendment lifecycle (EXPAND, PROPOSE, REVIEW, LAND, RE-ADOPT).

---

## DECISION REQUIRED before PR-B merges (maintainer ruling)

**Does a pure relocation that changes zero normative clauses bump the Standard version (`0.12 -> 0.13`)?**

- GOVERNANCE Section 5's LAND template hard-wires a version bump + one ADR into every protected-branch PR (the template reading).
- But this move changes zero clause text, and `0.13` is already semantically reserved for the `U13` (skill-registration) warn-to-error burndown declared in the v0.12 header.

**Recommended default (used by this plan): structural ADR-only, NO version bump.** The ADR and `CHANGELOG.md` entry record "structural relocation, no normative change." If the maintainer rules for the LAND-template invariant instead, bump `0.12 -> 0.13` marked structural-only and ADD the `library.json` re-pin to Task C-2. Either way, per the allocation-at-LAND rule (Section 6), allocate the actual ADR number and any version number against the protected head AT MERGE - never pre-bake `0.13` or `ADR 0002` into the working branch.

---

## How to review this plan

This is the **execution** plan ("is it safe and correct to run?"). Its companion, [`phase-0-change-manifest.md`](phase-0-change-manifest.md), answers "is this the right set of changes?" - review the manifest first, then this.

Read in this order and check the gates:

1. **The version ruling** (DECISION REQUIRED, above) - confirm structural / no bump, or rule for a bump. This is settled as no-bump unless you say otherwise.
2. **The no-dark-window invariant** (its own section below) - confirm the ordering: COPY the runner into agent-plugins, repoint askit and verify green, DELETE askit's copy LAST. If you trust-check only one thing, check this - it is what keeps askit's gate from going dark.
3. **The verify step inside each task** - every relocation task ends with a "run X, expect Y" gate before any irreversible step (B-1 Step 4-5 prove the relocated runner's tests + foreign-root grading are green before anything depends on it; C-1 Step 3 proves askit is green on the relocated runner BEFORE its copy is deleted). Confirm these gates actually prove safety before the step they guard.
4. **The three sign-off points** (see Recommendations): the version ruling, the npm-`check` resolution mechanism (Task C-1 Step 2), and whether to run all three PRs or PR-A first.
5. **The Risks section** (bottom) - confirm each mitigation is sufficient.

You do NOT need to read the exact git/grep commands line-by-line; they are mechanical and the verify gates catch errors.

## Recommendations

| # | Recommendation | Why |
|---|---|---|
| R1 | **Version: structural, no bump.** | Zero clause changes; `0.13` is reserved for the U13 burndown. |
| R2 | **Execute strictly PR-A -> PR-B -> PR-C; delete askit's copy LAST.** | The only ordering that guarantees no dark window. |
| R3 | **Start with PR-A** (ship + tag the reusable workflow), and run it once against a throwaway caller before PR-B/PR-C. | Closes the spike's one open gap (a live GitHub Actions run) cheaply, before the relocation touches askit. |
| R4 | **npm-`check` resolution: a pinned `agent-plugins` checkout at a gitignored `.standards-runner/`**, over an npx-from-git wrapper. | Deterministic, offline-capable, and the same path CI uses; easiest to reason about. Confirm green in Task C-1 Step 3. |
| R5 | **Keep the residual askit-isms (FIXED_ROOTS, `askit-build-docs` strings, the gen-index doc-link skeleton) as a fast-follow; do NOT block Phase 0.** | Output-only / `isDir`-guarded; not a correctness break. |

## Confidence

**Overall: high confidence the approach is correct and safe.** The residual uncertainty is concentrated in mechanical details that the verify gates will catch, not in the design. The one thing I would NOT claim high confidence on without a live run is the end-to-end GitHub Actions behavior of the reusable workflow (R3 closes it).

| Aspect | Confidence | Basis |
|---|---|---|
| Runner relocates + grades from the new home | **High** | The D14 spike ran it against a foreign root (exit 0, honoring that repo's pin); Task B-1 re-verifies before anything depends on it. |
| askit keeps Gold (G2) after the move | **High** | Grounded in the actual G2 / Section 4.1 / 4.4 wording (RUN not OWN) + `self-hosting.mjs` matching `npm run check`. |
| No dark window | **High** | Copy-first / delete-last is mechanically guaranteed; askit keeps a working copy until its caller is green. |
| Sweep sites (0.8 refs, name drift) | **High** | Grep-confirmed with exact file:line references. |
| npm-`check` resolution mechanism | **Medium** | Two viable options; not yet tested in askit's exact setup - Task C-1 Step 3 gates on green before proceeding. |
| Test relocation (68 import sites) | **Medium** | Mechanical but fiddly; Task B-1 Step 4 gates on `node --test` green. |
| Changelog-history migration | **Medium** | A judgment call on what is "the Standard's" history vs askit's; reversible, low blast radius. |
| Live GitHub Actions run of the reusable workflow | **Medium (needs one live run)** | Proven at the `node check.mjs` layer; the Actions wiring (sparse second checkout, caller context) needs one real run - R3 closes this. |

---

## Repos and paths (constants used throughout)

- `AP` = `E:/Projects/product-on-purpose/agent-plugins` (the destination + the LAND repo; main is PR-protected: branch, PR, squash-merge, `validate` CI gates).
- `ASKIT` = `E:/Projects/product-on-purpose/agent-skills-toolkit` (the source; the RE-ADOPT repo).
- `ORG` = `E:/Projects/product-on-purpose/.github` (the org repo for the reusable workflow; confirmed local, origin `product-on-purpose/.github`, no `.github/workflows/` dir yet).

## File structure (what is created, moved, and changed)

**Created:**
- `ORG/.github/workflows/standards-gate.yml` - the reusable conformance gate (the doubled `.github/.github/` is correct: repo name, then workflows dir).
- `AP/standards/STANDARD.md` - the relocated Standard text.
- `AP/standards/checks/` - the relocated runner (entry + check modules + lib + generators + tier-report + the runner's own tests).
- `AP/standards/CHANGELOG.md` and `AP/standards/RELEASE-NOTES.md` - the Standard's release history home (absent today; `standards/README.md` lines 15-23 say they "arrive with the text").
- `AP/standards/decisions/NNNN-relocate-standard-and-runner.md` - one ADR (next free number in the `standards/decisions/` trail, taken at LAND).

**Moved (COPY into AP in PR-B; DELETE from ASKIT in PR-C - this two-step across repos is what avoids the dark window):**
- `ASKIT/STANDARD.md` -> `AP/standards/STANDARD.md`.
- `ASKIT/scripts/{check.mjs, tier-report.mjs, lib/, checks/, generators/}` -> `AP/standards/checks/` as ONE unit (sibling relative imports: `./lib/...`, `./tier-report.mjs`, `./checks/...` require they move together).
- The runner's own test files (the ~63 files under `ASKIT/tests/` that import `scripts/`) -> alongside the relocated runner, so `node --test` stays green where the runner now lives.
- The Standard's release history out of `ASKIT/CHANGELOG.md` + `ASKIT/RELEASE-NOTES.md` -> the new `AP/standards/CHANGELOG.md` + `RELEASE-NOTES.md`, so askit becomes purely the reference implementation.

**Changed in place:**
- `AP/standards/README.md` lines 15-23 - drop the three "not here yet" caveats; fix See-also links to the new local paths.
- `AP/standards/GOVERNANCE.md` - sweep `0.8` -> `0.12` (lines 4, 41, 52, 54, 95-96) and `writing-style-library` -> `writing-style-catalog` (line 137).
- `AP/standards/decisions/0001-standard-governance-and-home.md:42` - `0.8` -> `0.12`, `writing-style-library` -> `writing-style-catalog`.
- Package + audit docs carrying the name drift (see Task B-5).
- `ASKIT/.github/workflows/ci.yml`, `ASKIT/.github/workflows/release.yml`, `ASKIT/package.json` - repoint the gate to the relocated runner (Task C-1).

**Assess, do not assume (during Task B-1):** `ASKIT/scripts/evaluate.mjs` and `ASKIT/scripts/README.md` - move them IF they share `scripts/lib/` sibling imports (then they are part of the canonical runner); otherwise they are askit-specific and stay. The unregistered `scripts/checks/agentskills.mjs` (in the folder but not in `lib/registry.mjs`, only a unit test) - decide keep-as-dead or drop.

## The no-dark-window invariant (read before executing)

askit's conformance gate MUST stay green at every step. The order that guarantees this:
1. PR-A lands first (net-new, nothing references it).
2. PR-B COPIES the runner into `agent-plugins` (askit still has its own working copy - nothing deleted).
3. PR-C repoints askit to the relocated runner and verifies green BEFORE deleting askit's local copy.
4. The deletion is the LAST step, only after askit is green on the relocated runner.

Never delete askit's `STANDARD.md`/`scripts/` until its caller is green. This is the single most important sequencing rule in this plan.

---

## PR-A: the reusable workflow (repo `ORG`)

### Task A-1: Author and tag the reusable `standards-gate.yml`

**Files:**
- Create: `ORG/.github/workflows/standards-gate.yml`

- [ ] **Step 1: Create the reusable workflow file (verbatim from the D14 spike)**

Create `ORG/.github/workflows/standards-gate.yml`:

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
      - name: Check out caller repo
        uses: actions/checkout@v4

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

      - name: Run conformance gate
        run: node .standards-runner/standards/checks/check.mjs .
```

- [ ] **Step 2: Validate the YAML parses**

Run: `cd "$ORG" && python -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]; print('yaml ok')"`
Expected: `yaml ok`

- [ ] **Step 3: Commit, push, and tag the workflow**

```bash
cd "$ORG"
git checkout -b feat/standards-gate-workflow
git add .github/workflows/standards-gate.yml
git commit -m "feat: add reusable standards-gate conformance workflow (D14)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push -u origin feat/standards-gate-workflow
```

Then open + merge the PR (this repo's protection rules apply), and tag the merged commit:

```bash
git checkout main && git pull
git tag v1.0.0 && git push origin v1.0.0
```

Expected: tag `v1.0.0` exists on the merged commit so callers can pin `@v1.0.0`. (Note: the workflow cannot RUN green until PR-B relocates the runner; that is expected. This task only ships and tags it.)

---

## PR-B: the atomic LAND (repo `AP`, protected branch)

> All of PR-B is ONE pull request per GOVERNANCE Section 5 (text + checks + one ADR + changelog + version-sweep in a single protected-branch PR). Do the work as frequent commits on one branch, then open one PR.

### Task B-1: Relocate the runner unit into `standards/checks/` (with its tests)

**Files:**
- Create: `AP/standards/checks/` (from `ASKIT/scripts/`)

- [ ] **Step 1: Create the branch and copy the runner unit**

```bash
cd "$AP"
git checkout main && git pull
git checkout -b standards/phase-0-relocation
mkdir -p standards/checks
cp -r "$ASKIT/scripts/check.mjs" "$ASKIT/scripts/tier-report.mjs" "$ASKIT/scripts/lib" "$ASKIT/scripts/checks" "$ASKIT/scripts/generators" standards/checks/
```

- [ ] **Step 2: Assess and copy the ambiguous siblings**

Run: `cd "$ASKIT/scripts" && grep -lE "from \"\\./lib/|from \"\\./tier-report" evaluate.mjs README.md 2>/dev/null; echo "---"; node -e "import('file://'+process.cwd().replace(/\\\\/g,'/')+'/evaluate.mjs').then(()=>console.log('imports-ok')).catch(e=>console.log('imports-from-lib'))"`
If `evaluate.mjs` imports from `./lib/`, copy it too: `cp "$ASKIT/scripts/evaluate.mjs" "$AP/standards/checks/"`. Otherwise leave it in askit (askit-specific eval entry). Record the decision in the commit message.

- [ ] **Step 3: Copy the runner's own tests next to the runner**

```bash
cd "$ASKIT"
# Identify the runner's tests (those importing scripts/), copy them under standards/checks/tests/
mkdir -p "$AP/standards/checks/tests"
grep -rl -E "scripts/(check\.mjs|lib|checks|tier-report)" tests/ | while read f; do
  mkdir -p "$AP/standards/checks/tests/$(dirname "${f#tests/}")"
  cp "$f" "$AP/standards/checks/tests/${f#tests/}"
done
```

Then in the copied tests, repoint imports from `../scripts/` / `../../scripts/` to the co-located runner paths (`../check.mjs`, `../lib/...`, `../checks/...`). Do this with a scoped sed over `standards/checks/tests/` only.

- [ ] **Step 4: Verify the relocated runner's tests pass in place**

Run: `cd "$AP/standards/checks" && node --test tests/ 2>&1 | tail -15`
Expected: the test summary shows `pass` for all and `fail 0`. If imports are wrong, fix the repointing and re-run. Do not proceed until green.

- [ ] **Step 5: Verify the relocated runner grades a foreign root green (the spike behavior, now from the new home)**

Run: `cd "$AP" && node standards/checks/check.mjs "$ASKIT" 2>&1 | tail -4`
Expected: `Tier: Advanced (no blockers detected)` and `0 error(s), 0 warning(s).`, exit 0 - the relocated runner grades askit clean exactly as the in-place runner did.

- [ ] **Step 6: Commit the runner relocation**

```bash
cd "$AP"
git add standards/checks
git commit -m "feat(standards): relocate the conformance runner into standards/checks (D14, ADR 0001)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task B-2: Relocate `STANDARD.md` and create the Standard's changelog home

**Files:**
- Create: `AP/standards/STANDARD.md`, `AP/standards/CHANGELOG.md`, `AP/standards/RELEASE-NOTES.md`

- [ ] **Step 1: Copy the Standard text**

Run: `cp "$ASKIT/STANDARD.md" "$AP/standards/STANDARD.md"`

- [ ] **Step 2: Confirm the version header reads 0.12 and no inline example pre-bakes a number**

Run: `cd "$AP" && grep -nE "Standard version|version.*0\.1[0-9]" standards/STANDARD.md | head`
Expected: the header shows `0.12`. Leave it (per the version-bump ruling default: no bump). Do NOT edit the version here.

- [ ] **Step 3: Create the Standard's CHANGELOG and RELEASE-NOTES, migrating the history out of askit**

Create `AP/standards/CHANGELOG.md` in Keep a Changelog 1.1.0 format. Copy the Standard-version history (the `0.x` entries) from `ASKIT/CHANGELOG.md` into it, and add a top entry for the relocation:

```markdown
# Standard changelog

All notable changes to the Advanced Skill Library Standard. Format: Keep a Changelog 1.1.0; the Standard versions follow its own header (currently 0.12).

## [Unreleased]
### Changed
- Structural relocation: STANDARD.md and the conformance runner moved from agent-skills-toolkit into agent-plugins/standards/ (ADR for this move; no normative clause change).

<!-- migrate the prior 0.x Standard entries from agent-skills-toolkit/CHANGELOG.md below -->
```

Create `AP/standards/RELEASE-NOTES.md` similarly (curated, user-facing), migrating the Standard's release notes.

- [ ] **Step 4: Commit the text relocation**

```bash
cd "$AP"
git add standards/STANDARD.md standards/CHANGELOG.md standards/RELEASE-NOTES.md
git commit -m "feat(standards): relocate STANDARD.md + create the Standard changelog home

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task B-3: Drop the README "not here yet" caveats

**Files:**
- Modify: `AP/standards/README.md` (lines 15-23)

- [ ] **Step 1: Read the current caveats**

Run: `cd "$AP" && sed -n '13,25p' standards/README.md`

- [ ] **Step 2: Replace the "Not here yet" section**

Edit `standards/README.md`: remove the "Not here yet (sequenced relocation)" section that says `STANDARD.md`, the checks, and the changelog live elsewhere. Replace it with a short statement that they now live here: `standards/STANDARD.md`, `standards/checks/`, `standards/CHANGELOG.md`, `standards/RELEASE-NOTES.md`. Update any See-also links that pointed at `../../agent-skills-toolkit/STANDARD.md` to the local `STANDARD.md`.

- [ ] **Step 3: Verify no stale "not here yet" / cross-repo Standard link remains**

Run: `cd "$AP" && grep -niE "not here yet|agent-skills-toolkit/STANDARD\.md" standards/README.md || echo "clean"`
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
cd "$AP" && git add standards/README.md && git commit -m "docs(standards): README now reflects the relocated home

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task B-4: Add the relocation ADR

**Files:**
- Create: `AP/standards/decisions/NNNN-relocate-standard-and-runner.md` (NNNN = next free in the `standards/decisions/` trail, taken at LAND - currently `0002`; do NOT pre-bake if another ADR may land first)

- [ ] **Step 1: Determine the next free ADR number against the protected head**

Run: `cd "$AP" && git fetch origin main && ls standards/decisions/ | grep -E "^[0-9]{4}-" | sort | tail -1`
Use the next integer after the highest existing (the `standards/decisions/` trail, NOT askit's `0020-0035` range).

- [ ] **Step 2: Write the ADR (MADR 4.0)**

Create the ADR with: Status accepted; Context (ADR 0001 decided the home, this executes it; the runner is location-portable per the D14 spike); Decision (relocate STANDARD.md + the runner into `standards/`; structural, no normative change; no version bump per the maintainer ruling default; askit becomes a reusable-workflow caller keeping an npm `check` script so G2 stays green); Consequences (askit RE-ADOPT in a follow PR repoints CI + deletes its copies; the Standard's changelog home is now `standards/`); the four MADR sections. Cite ADR 0001 and the D14 spike.

- [ ] **Step 3: Commit**

```bash
cd "$AP" && git add standards/decisions/ && git commit -m "docs(standards): ADR for the Standard + runner relocation

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task B-5: Sweep stale `0.8` refs and the name drift

**Files:**
- Modify: `AP/standards/GOVERNANCE.md`, `AP/standards/decisions/0001-standard-governance-and-home.md`, and the package/audit docs carrying the name drift

- [ ] **Step 1: Sweep `0.8` -> `0.12` in GOVERNANCE**

Edit `standards/GOVERNANCE.md` at lines 4, 41, 52, 54, 95-96: change the illustrative `0.8` "current version" mentions to `0.12`. (These are the Section 4 "single source of truth" sweep obligations.)

- [ ] **Step 2: Converge `writing-style-library` -> `writing-style-catalog`**

`writing-style-catalog` is canonical (it is the `marketplace.json` entry name). Fix:
- `standards/GOVERNANCE.md:137`
- `standards/decisions/0001-standard-governance-and-home.md:42` (also fix its `0.8` -> `0.12` there)
- `docs/internal/standards-plan-roadmap/01-current-state.md:38` (the GP-4 row can now note the sweep is done)
- `docs/internal/standards-plan-roadmap/02-roadmap.md` Phase 0 key-moves (note the sweep done)
- `docs/internal/audits/2026-06-02_astro-implementation.md` and `standards/domains/astro-sites/rollout/writing-style-catalog.md` + the `2026-06-02` review-findings docs - any hardcoded `/writing-style-library` base literal.

- [ ] **Step 3: Verify zero stale refs remain**

Run: `cd "$AP" && grep -rniE "writing-style-library|today.{0,3}0\.8|current version.{0,5}0\.8" standards/ docs/internal/standards-plan-roadmap/ | grep -v "0001-standard" | head` (expect no live "current version 0.8" or `writing-style-library` outside historical-quote context)
Expected: no live stale refs (historical mentions inside an explicit "(renamed from ...)" note are fine).

- [ ] **Step 4: Commit**

```bash
cd "$AP" && git add -A standards docs && git commit -m "docs(standards): sweep stale 0.8 refs + converge writing-style-catalog name

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task B-6: Open the atomic LAND PR and verify CI green

- [ ] **Step 1: Run the relocated gate against the LAND repo itself as a final local check**

Run: `cd "$AP" && node standards/checks/check.mjs "$ASKIT" 2>&1 | tail -3 && echo "exit:$?"`
Expected: askit grades green (`0 error(s)`), exit 0 - proves the relocated runner works from its new home.

- [ ] **Step 2: Push and open the PR**

```bash
cd "$AP"
git push -u origin standards/phase-0-relocation
gh pr create --base main --head standards/phase-0-relocation \
  --title "standards: relocate STANDARD.md + runner into standards/ (Phase 0)" \
  --body "Atomic GOVERNANCE LAND for Phase 0 (truth and relocation). Relocates STANDARD.md and the 30-check runner into standards/, adds the relocation ADR + the Standard changelog home, drops the README caveats, and sweeps stale 0.8/name refs. Structural move, no normative clause change. askit RE-ADOPT (repoint CI + delete its copies) follows as a separate PR.

ADR number and any version bump are taken at LAND against head per GOVERNANCE Section 6.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

- [ ] **Step 3: Wait for CI, confirm the maintainer version-bump ruling, then merge**

Run: `cd "$AP" && gh pr checks <PR#> --watch --interval 15`
Expected: `validate` passes. Confirm the version-bump ruling (default: no bump). Then `gh pr merge <PR#> --squash --delete-branch`, `git checkout main && git pull`.

---

## PR-C: the askit RE-ADOPT (repo `ASKIT`)

> Separate PR, askit's own cadence. Repoint FIRST, delete LAST.

### Task C-1: Repoint askit CI, release, and local-dev to the relocated runner

**Files:**
- Modify: `ASKIT/.github/workflows/ci.yml`, `ASKIT/.github/workflows/release.yml`, `ASKIT/package.json`

- [ ] **Step 1: Branch and add the thin caller to ci.yml**

```bash
cd "$ASKIT" && git checkout main && git pull && git checkout -b chore/re-adopt-relocated-runner
```

Replace askit's conformance-gate step in `.github/workflows/ci.yml` with a call to the reusable workflow (askit's `library.json` standard pin determines `standards-ref` - use the agent-plugins ref/tag whose `standards/` matches askit's pin):

```yaml
  conformance:
    uses: product-on-purpose/.github/.github/workflows/standards-gate.yml@v1.0.0
    with:
      standards-ref: <agent-plugins ref matching askit's library.json standard pin>
```

Repoint the `release.yml` gate step the same way (it is a hard release gate).

- [ ] **Step 2: Keep an npm `check` script resolving to the relocated runner (preserves G2)**

In `ASKIT/package.json`, point the `check` script (and `tier-report`/`evaluate` if present) at the relocated runner so `npm run check` reproduces CI locally and `self-hosting.mjs`'s npm-script branch keeps G2 green. Choose one resolution mechanism and document it in the ADR/PR: a pinned `agent-plugins` checkout under `.standards-runner/`, or a small `npx`-from-checkout wrapper. Example:

```json
{
  "scripts": {
    "check": "node ./.standards-runner/standards/checks/check.mjs ."
  }
}
```

- [ ] **Step 3: Verify askit's gate is GREEN on the relocated runner BEFORE deleting anything**

Run: `cd "$ASKIT" && npm run check 2>&1 | tail -4`
Expected: `Tier: Advanced (no blockers detected)`, `0 error(s)`, exit 0. This is the gate that must stay green; do not proceed to Task C-2 until it does.

- [ ] **Step 4: Commit the repoint (no deletions yet)**

```bash
cd "$ASKIT" && git add .github/workflows package.json && git commit -m "chore: re-adopt the relocated standards runner (repoint CI + npm check)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task C-2: Delete askit's now-duplicate copies and finish RE-ADOPT

**Files:**
- Delete: `ASKIT/STANDARD.md`, `ASKIT/scripts/{check.mjs,tier-report.mjs,lib,checks,generators}` and the moved tests

- [ ] **Step 1: Delete the moved files (ONLY after Task C-1 Step 3 was green)**

```bash
cd "$ASKIT"
git rm STANDARD.md
git rm -r scripts/check.mjs scripts/tier-report.mjs scripts/lib scripts/checks scripts/generators
# git rm the moved test files identified in Task B-1 Step 3
```

- [ ] **Step 2: Re-sync folder-README inventories (G8) for folders whose children changed**

For any folder whose immediate children changed by the deletion (e.g. `scripts/` if it had a folder-README inventory), update its `README.md` inventory so G8 set-equality holds. Migrate the Standard's history out of `ASKIT/CHANGELOG.md`/`RELEASE-NOTES.md` (now in `standards/`).

- [ ] **Step 3: If the maintainer ruled for a version bump, re-pin `library.json`**

Only if the version was bumped in PR-B: set `ASKIT/library.json` `"standard"` to the new version. (Default ruling = no bump = skip this step.)

- [ ] **Step 4: Verify the gate still passes after deletion**

Run: `cd "$ASKIT" && npm run check 2>&1 | tail -4`
Expected: green, exit 0 - askit now runs purely the relocated runner with no local copy.

- [ ] **Step 5: Commit, push, open the RE-ADOPT PR**

```bash
cd "$ASKIT"
git commit -m "chore: remove relocated Standard + runner copies (RE-ADOPT complete)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push -u origin chore/re-adopt-relocated-runner
gh pr create --base main --title "chore: re-adopt the relocated standards runner" --body "askit RE-ADOPT for Phase 0: repoint CI/release/local-dev to the relocated runner in agent-plugins/standards/, then remove askit's now-duplicate STANDARD.md + scripts. G2 stays green via the npm check script. Follows the agent-plugins LAND PR.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

Then watch CI, merge squash, delete branch.

---

## Final verification (the no-dark-window invariant, end to end)

- [ ] **V-1:** `ORG` workflow tagged and reachable: `git -C "$ORG" tag | grep v1.0.0`.
- [ ] **V-2:** The relocated runner grades askit green from a foreign checkout: `node "$AP/standards/checks/check.mjs" "$ASKIT"` -> `0 error(s)`, exit 0.
- [ ] **V-3:** askit local `npm run check` green: resolves to the relocated runner, exit 0.
- [ ] **V-4:** askit CI caller green at the pinned `standards-ref` (observe one real Actions run - this also closes the D14 live-run gap from the spike Section 6).
- [ ] **V-5:** askit still passes G2 self-hosting (the gate's own report shows Advanced, no blockers).
- [ ] **V-6:** `node --test` green on the relocated runner tree under `standards/checks/tests/`.
- [ ] **V-7:** No stale refs: `grep -rniE "writing-style-library|current version.{0,5}0\.8" "$AP/standards"` returns nothing live.
- [ ] **V-8:** The gate never went red across the sequence (confirm by the PR check history on all three repos).

## Risks and mitigations (carried from the grounding)

Severity is the impact IF the mitigation were skipped; every risk below has a mitigation that reduces it to low residual.

- **[HIGH] Half-moved dark window** - if askit's copies are deleted before the relocated runner + askit caller are green, askit's gate goes dark. *Mitigation:* delete askit's copies LAST (Task C-2), only after its caller is green (Task C-1 Step 3). This is the single most important sequencing rule in the plan.
- **[MEDIUM] G2 regression** - if the npm `check` script is dropped or repointed to a path the GATE_PATH regex no longer matches, `self-hosting.mjs` fails askit's own Gold grade. *Mitigation:* keep an npm script named `check` (or `test`) resolving to the relocated runner; do not touch the regex in Phase 0; Task C-1 Step 3 verifies green.
- **[RESOLVED] Version-bump ambiguity** - decided: structural ADR-only, NO bump (header stays 0.12). Re-pin step in Task C-2 is a no-op. (If the maintainer later overrides, bump 0.12 -> 0.13 marked structural-only and re-enable the C-2 re-pin.)
- **[MEDIUM] Test coupling** - 68 files import `scripts/`; moving the runner without moving/repointing the tests fails `node --test`. *Mitigation:* move the runner's tests with the runner as the FIRST code step (Task B-1 Step 3-4) and keep `node --test` green throughout.
- **[LOW] Allocation-at-LAND collisions** - pre-baking `ADR 0002` or a version in the draft branch breaks under branch protection if another PR lands first. *Mitigation:* take the ADR number (and any version) against the protected head at merge; never pre-bake (GOVERNANCE Section 6).
- **[LOW-MEDIUM] Org-repo tag drift** - callers pin `@v1.0.0`; a moved or deleted tag silently breaks every caller's gate. *Mitigation:* tag `v1.0.0` immutably and document the pin-bump cadence; the validate-registry cron can later surface drift.
- **[LOW] Residual askit-isms in the relocated runner** (FIXED_ROOTS naming askit dirs, `askit-build-docs` strings, the `gen-index.mjs` doc-link skeleton) - not a hard break (`isDir`-guarded, output-only); leaves the runner subtly askit-flavored. *Mitigation:* note as a fast-follow parametrization; do NOT block Phase 0.

## What Phase 0 does NOT include (deferred)

- The marketplace re-pin + truth-in-targeting CI check (Phase 2).
- Thin callers in pm-skills / thinking-framework-skills / writing-style-catalog (the tiered ramp, D15) - Phase 0 wires only askit's caller; the others adopt on their own cadence.
- `pm-skills` / `writing-style-catalog` gaining a `library.json` (Phase 1).
- Parametrizing the relocated runner's residual askit-isms (fast-follow).
