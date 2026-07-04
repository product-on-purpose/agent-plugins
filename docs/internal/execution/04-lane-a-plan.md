---
title: Lane A implementation plan
description: The executable in-repo plan for everything the orchestrator runs autonomously inside agent-plugins after the maintainer go
status: draft
last-updated: "2026-07-03"
audience: engineer
level: advanced
---

# Implementation Plan: Lane A (autonomous in-repo execution)

Lane A is the slice of the standards execution program that lives entirely inside `agent-plugins` and can run autonomously after the maintainer's overall "go" (ruling R5 (Lane A merges autonomously)). It touches no other repo. Everything that reaches into a sibling repo or `product-on-purpose/.github` is Lane B, a staged, approval-gated package with its own recommendation, per ruling R2 (cross-repo gate); Lane B lives under [05-lane-b/](05-lane-b/) and is sequenced by [03-execution-plan.md](03-execution-plan.md).

This plan OPERATIONALIZES the locked planning package at [../standards-plan-roadmap/](../standards-plan-roadmap/). It invents no decisions and allocates no version, ADR, or section numbers - those are taken only at LAND per the allocation-at-land invariant ([../../../standards/GOVERNANCE.md](../../../standards/GOVERNANCE.md) Section 6). Where a task needs decision intent, it links D-numbers to [../standards-plan-roadmap/03-decisions.md](../standards-plan-roadmap/03-decisions.md); it does not restate rationale.

Acceptance criteria live in [02-prd.md](02-prd.md); this plan implements the Lane A slice of them. Risks are ranked in [09-risk-register.md](09-risk-register.md); maintainer decisions (ruled and open) are in [08-decision-register.md](08-decision-register.md); the agentic contract every executor follows is [11-agent-operations.md](11-agent-operations.md).

## Task Summary

Agent-updated working state. Eight ordered tasks, LA-1 (land the package) through LA-8 (program bookkeeping), grouped into four PRs plus one config action. Fill the Status column as tasks complete; do not mark a task Done until its Verification block passes with evidence.

- **What is done:** nothing executed yet - this plan is `status: draft`, awaiting the maintainer go.
- **What is next:** LA-1 (land this execution package) once the go lands.
- **Blockers:** the maintainer go (R5). LA-5's merge is additionally blocked by B1 (PR-A, ship the org gate) per R7 (PR-B staging).

## Completion Status

| Task | Goal | PR | Owner | Status |
|---|---|---|---|---|
| LA-1 | Land this execution package | PR-A1 (execution-package) | Fable | Not started |
| LA-2 | Truth sweep of stale in-repo docs | PR-A2 (truth-and-draft-repair) | Sonnet subagent | Not started |
| LA-3 | Draft-drift repair inside `drafts/` + the Phase 0 plan | PR-A2 (truth-and-draft-repair) | Opus subagent | Not started |
| LA-4 | Phase 2 keystone, advisory: check 8 + check 9 + tests | PR-A3 (registry-keystone-advisory) | Opus subagent | Not started |
| LA-5 | Build + open the PR-B relocation PR (merge HELD per R7) | PR-A4 (phase-0-relocation) | Opus subagent | Not started |
| LA-6 | Flip branch protection `strict:true` on `main` | Config action (not a PR) | Fable | Not started |
| LA-7 | Dissolve `_agent-context/`, rename `_LOCAL` -> `_local` (CONDITIONAL, recommend defer) | Deferred / decision item | Opus subagent | Not started |
| LA-8 | Program bookkeeping: backlog + registers current | Rides PR-A1 / trailing commits | Fable | Ongoing |

## The per-PR protocol (R5)

Every Lane A PR follows the same gate, and no step is skipped:

1. **Branch** off current `main` (rebase to current head; after LA-6 flips `strict:true`, up-to-date-before-merge is mechanically enforced).
2. **Open the PR** with a body that states the D-numbers it operationalizes and the Verification evidence it will produce.
3. **Validate green** - the `validate` required check must pass (or, for a docs-only PR, pass vacuously; the workflow is path-filtered).
4. **Codex adversarial review** - dispatch the diff to the Codex reviewer, read the findings, and answer every one (fix, or record why not) before merge. Findings that survive as follow-ups seed [10-backlog.md](10-backlog.md) (LA-8).
5. **Squash-merge** autonomously (Fable) once 3 and 4 are green, then `git checkout main && git pull`.

LA-6 (branch protection) is not a PR - it is a `gh api` config action, still gated behind the maintainer go, with its own verify-back and rollback below.

## Sequencing

Recommended order once the go lands:

1. **LA-1** first - land the suite so every later PR can reference it on `main`.
2. **LA-6** next - flip `strict:true` so LA-2 through LA-5 merge under real serialization (this is the setting GOVERNANCE.md Section 6 already assumes; see [09-risk-register.md](09-risk-register.md) and OQ (branch protection) in [08-decision-register.md](08-decision-register.md)).
3. **LA-2 + LA-3** as PR-A2 - LA-3's repair of [../standards-plan-roadmap/drafts/ci-repin-check.md](../standards-plan-roadmap/drafts/ci-repin-check.md) MUST merge before LA-4 implements from it (the syntax defect in that draft is fixed here).
4. **LA-4** as PR-A3 - implements check 8 + check 9 from the repaired draft.
5. **LA-5** as PR-A4 - built and opened during Lane A, merge HELD per R7 until B1 (PR-A, ship the org gate) is approved and runs green.
6. **LA-8** runs continuously; **LA-7** stays deferred unless the maintainer rules otherwise.

---

## LA-1: Land this execution package

**Goal:** Get the full execution suite (this file and its siblings) onto `main` so it is the active, referenceable execution record. Operationalizes ruling R4 (suite home) - the suite lives at `docs/internal/execution/` in jp-library document formats. Addresses the PRD Lane A "package is the source of execution truth" acceptance.

**Executor tier:** Fable (the suite is authored; landing is an orchestrator action).

**PR:** PR-A1 on the current branch `feat/execution-package`.

**Steps:**
1. Confirm the branch is `feat/execution-package` and the suite is complete: `00-README.md`, `01-audit-2026-07-03.md`, `02-prd.md`, `03-execution-plan.md`, `04-lane-a-plan.md`, `05-lane-b/B1..B7`, `06-ci-plan.md` through `11-agent-operations.md`, and `EXEC-SUMMARY.md`.
2. Verify every internal cross-link resolves (no dangling relative paths).
3. Open the PR against `main`; run the per-PR protocol (validate, Codex review, squash-merge).

**Verification (real commands, from repo root `E:/Projects/product-on-purpose/agent-plugins`):**
- Suite present: `ls docs/internal/execution/ && ls docs/internal/execution/05-lane-b/`
- No dangling links: `node -e "const fs=require('fs');const p='docs/internal/execution';for(const f of require('child_process').execSync('git ls-files '+p).toString().trim().split(/\r?\n/)){for(const m of fs.readFileSync(f,'utf8').matchAll(/\]\(([^)]+\.md)[^)]*\)/g)){const t=m[1];if(t.startsWith('http'))continue;const r=require('path').resolve(require('path').dirname(f),t);if(!fs.existsSync(r))console.log(f,'->',t)}}console.log('link check done')"`
- Validate green: `gh pr checks <PR#> --watch --interval 15` shows `validate` pass.

**Rollback:** Do not merge (close the PR). Nothing on `main` changes until squash-merge. If merged and regretted, revert the squash commit: `git revert <sha> && git push`.

---

## LA-2: Truth sweep of stale in-repo docs

**Goal:** Bring this repo's own committed docs back to current truth so no reader is misled while execution runs. Operationalizes OQ-7 (two live roadmaps) for `program-roadmap.md` and the general truth-in-docs hygiene the audit ([01-audit-2026-07-03.md](01-audit-2026-07-03.md)) flagged. Addresses the PRD "no stale live doc contradicts the pins" acceptance.

**Executor tier:** Sonnet subagent (mechanical find/replace, each fix behind a live verify grep). Opus spot-reviews the superseded-banner wording and the CONTRIBUTING snapshot rewrite.

**PR:** PR-A2 (shared with LA-3).

**Steps (each a surgical fix, verified by a live grep - do not trust line numbers blind):**

1. **`docs/internal/standards-plan-roadmap/06-tier-requirements.md` - askit pin `0.11` -> `0.12`.**
   - Current-wrong: the tier table row (live at line 221) reads `| agent-skills-toolkit | advanced | 0.11 | ...`; there is exactly ONE askit pin cell to fix (line 221), and line 140's "retired at Standard v0.11" is a historical mention that MUST be preserved.
   - New-right: the askit *pin* cell reads `0.12` (verified live truth - `agent-skills-toolkit/library.json` pins `"0.12"`, and this file's own header line 5 already says v0.12).
   - Do NOT touch historical mentions: line 140's "`U10` no-dashes retired at Standard v0.11" is a correct point-in-time record and stays.
   - Verify (scoped pair, so the historical mention on line 140 is not caught by the pin check): (a) `grep -nE "^\| agent-skills-toolkit .*\| 0\.11 " docs/internal/standards-plan-roadmap/06-tier-requirements.md` returns nothing (the pin cell is fixed), and (b) `grep -n "retired at Standard v0.11" docs/internal/standards-plan-roadmap/06-tier-requirements.md` still returns line 140 (the preservation guard).

2. **`CONTRIBUTING.md` Section 8 - refresh the stale conformance snapshot (writing-style-catalog rows).**
   - Current-wrong: Section 8 (dated "as of 2026-06-10, post-audit") says writing-style-catalog's `library.json` "is in its open convergence PR (its repo PR #19) and clears on merge" (L3 row) and its embedded marketplace "is deleted in its open convergence PR" (L2 row). The registry now pins writing-style-catalog at `0.5.2`, several re-pins past that snapshot.
   - New-right: re-verify writing-style-catalog's actual `library.json` and marketplace state at its pinned sha FIRST (do not assume PR #19 merged - that is family-repo truth, confirmed by check 8's own method), then rewrite the two rows to the confirmed state and update the snapshot date to `2026-07-03`.
   - Verify: `grep -nE "PR #19|open convergence PR" CONTRIBUTING.md` returns nothing referencing writing-style-catalog; the new snapshot date is present.

3. **`docs/internal/program-roadmap.md` - mark superseded with a banner (OQ-7).**
   - Current-wrong: line 17 states "the Standard is at v0.11 (29-check spine)" and treats "Land Section 14" as NOW priority; both contradict the v0.12 / 30-check reality and this newer package.
   - New-right: add a top-of-file banner: this roadmap is SUPERSEDED for the standards program by [02-prd.md](02-prd.md) and the execution suite at `docs/internal/execution/`; its unique sites/orchestration content remains until folded per OQ-7 (recorded in [08-decision-register.md](08-decision-register.md)). Do not rewrite the body line-by-line - the banner is the fix; folding is a separate maintainer decision.
   - Verify: `grep -niE "superseded|docs/internal/execution" docs/internal/program-roadmap.md | head` shows the banner at the top.

4. **`AGENTS.md` "Where things live" table - add the execution suite.**
   - Current-wrong: the table (heading at line 24) lists `standards-plan-roadmap/` (line 32) but not the new execution suite.
   - New-right: add a row `| docs/internal/execution/ | the execution suite (PRD, plans, CI/release plans, registers) - the active execution record for the standards program |`.
   - Verify: `grep -n "docs/internal/execution/" AGENTS.md` returns the new row.

5. **`docs/internal/standards-plan-roadmap/REVIEW-AND-NEXT-STEPS.md` - repoint to this package.**
   - Current-wrong: it still reads "Everything that could be done without touching another repo is done... Authorize execution" - frozen since 2026-06-20.
   - New-right: a short note that execution is now underway and tracked in `docs/internal/execution/`; point at [00-README.md](00-README.md) and [03-execution-plan.md](03-execution-plan.md). Keep the historical control-panel text below the note (it is a record).
   - Verify: `grep -niE "docs/internal/execution|now underway|active execution record" docs/internal/standards-plan-roadmap/REVIEW-AND-NEXT-STEPS.md` shows the pointer.

**Verification (whole task):** `git diff --stat` shows only the five files above; each per-fix grep passes; `validate` CI is green (docs-only, path-filtered - expect a vacuous pass).

**Rollback:** All five are isolated doc edits. `git checkout -- <file>` per file before commit, or `git revert <sha>` after merge. No code or config touched.

---

## LA-3: Draft-drift repair inside `drafts/` and the Phase 0 plan

**Goal:** Fix the staged clause drafts and the Phase 0 plan so they carry correct law and correct citations before any of them are lifted into specs or executed. These are staged text (planning-only per D1), not landed law, so they are editable in Lane A. Operationalizes the audit's "resolution pass over draft drift" gap. Addresses the PRD "no draft ships wrong law" acceptance. Each fix is its own sub-item, verified by a live grep. The synthesis's D10 (cross-tool / truth-in-targeting) clause-landing-vs-enforcement conflation item needs no draft edit: it is handled structurally by the suite - the clause lands in Phase 3 via B4 (FC-0001 and Phase 3), while enforcement is advisory in LA-4 (Phase 2 keystone) and blocking in B5 (Phase 4); verify-only sub-item 3g below confirms the drafts make no conflicting claim.

**Executor tier:** Opus subagent (D16 authoring and the D8 phase realignment need judgment; the mechanical sub-fixes - U14/U15 swap, the JS syntax fix, the phase-0 literal corrections - may be delegated to a Sonnet subagent).

**PR:** PR-A2 (shared with LA-2). This PR MUST merge before LA-4.

**Sub-item 3a - D8 (release subsystem) PLAN layer: Phase 5 -> Phase 3.**
- Files: `docs/internal/standards-plan-roadmap/drafts/release-subsystem.md` and `docs/internal/standards-plan-roadmap/drafts/standard-amendments.md` (Amendment F.1).
- Current-wrong: `release-subsystem.md`'s opening line and its "Ratification path (Phase 5)" table put the whole subsystem, PLAN layer included, in Phase 5; it even self-contradicts (Layer 1 says the master-file-name normalizes "in Phase 3"). `standard-amendments.md` F.1's row says "Phase 5".
- New-right: PLAN-layer convention (the `plan_vX.Y.Z/` folder + gate template) lands in **Phase 3**; only the EXECUTE/NOTES decision (release-please vs askit-release) stays **Phase 5**. This is the decision of record - authoritative sources [../standards-plan-roadmap/02-roadmap.md](../standards-plan-roadmap/02-roadmap.md) Phase 3 ("D8 release subsystem, the PLAN layer only") and [../standards-plan-roadmap/03-decisions.md](../standards-plan-roadmap/03-decisions.md) D8 Graduates-to both say so.
- Verify (the corrected F.1 table row, checked directly rather than by a PLAN-near-Phase-3 proximity pattern that the corrected row cannot satisfy): `grep -nE "F\.1 - release-plans layout.*Phase 3" docs/internal/standards-plan-roadmap/drafts/standard-amendments.md` returns the corrected F.1 row, and `grep -nE "F\.1 - release-plans layout.*Phase 5" docs/internal/standards-plan-roadmap/drafts/standard-amendments.md` returns nothing (Phase 5 no longer appears in that same row); `grep -niE "Ratification path \(Phase 5\)" docs/internal/standards-plan-roadmap/drafts/release-subsystem.md` returns nothing (the heading now splits PLAN=Phase 3 / EXECUTE-NOTES=Phase 5).

**Sub-item 3b - author the MISSING D16 (HISTORY.md amend + grandfather) amendment text.**
- File: `docs/internal/standards-plan-roadmap/drafts/standard-amendments.md`.
- Current-wrong: [../standards-plan-roadmap/03-decisions.md](../standards-plan-roadmap/03-decisions.md) D16 says its Standard clause is "Detailed in `drafts/standard-amendments.md`," but that file contains no HISTORY.md / Section 7.3 amendment and even omits D16 from its own covered-decisions list.
- New-right: add a new amendment block (the next informal letter, G) carrying the D16 clause text - amend the existing Section 7.3 HISTORY.md rule so a HISTORY.md presence check applies to NEW or CHANGED components only and existing components are grandfathered; name the enforcing check (`history-presence`, warn-then-error under the Section 7.7 burndown); leave its reqId and `since` as allocation-at-land placeholders (do NOT assign a number). Add D16 to the file's covered-decisions header list.
- Verify: `grep -niE "7\.3|HISTORY\.md|history-presence|grandfather" docs/internal/standards-plan-roadmap/drafts/standard-amendments.md | head` shows the new block; `grep -nE "reqId:\s*\"[US][0-9]" docs/internal/standards-plan-roadmap/drafts/standard-amendments.md` does NOT match the new block (no pre-allocated number).

**Sub-item 3c - rewrite the pre-D17 codex clause in `contributing-edits.md` L7 (E-D).**
- File: `docs/internal/standards-plan-roadmap/drafts/contributing-edits.md`.
- Current-wrong: the L7 (E-D) clause body defines a `"codex"` target as "portability via agentskills.io skills plus AGENTS.md, not native Codex marketplace packaging until a real consumer exists" - the superseded pre-D17 position.
- New-right: the D17 (deliver Codex) definition - `agent-targets: ["codex"]` resolves to codex-distributed (native install: `.codex-plugin/plugin.json` plus a resolvable Codex marketplace entry), not merely codex-portable. Match the language in [../standards-plan-roadmap/drafts/cross-tool-targeting.md](../standards-plan-roadmap/drafts/cross-tool-targeting.md), which already carries the D17 text.
- Verify: `grep -ni "not native Codex marketplace packaging" docs/internal/standards-plan-roadmap/drafts/contributing-edits.md` returns nothing; `grep -ni "codex-distributed" docs/internal/standards-plan-roadmap/drafts/contributing-edits.md` returns the updated clause.

**Sub-item 3d - fix the JavaScript syntax error in `ci-repin-check.md` Section 3.4.**
- File: `docs/internal/standards-plan-roadmap/drafts/ci-repin-check.md`.
- Current-wrong: two template literals have unescaped nested backticks, e.g. ``emit8(`${id} library.json `standard` must pin ...`)`` and the equivalent `tier` line - a JS syntax error, not pasteable pseudocode.
- New-right: replace the inner backticks around `standard` and `tier` with double quotes inside the template string, e.g. ``emit8(`${id} library.json "standard" must pin a Standard version (got ${JSON.stringify(lib.standard)})`)``.
- Verify: `grep -nE "library\.json \x60standard\x60|library\.json \x60tier\x60" docs/internal/standards-plan-roadmap/drafts/ci-repin-check.md` returns nothing (no backtick-wrapped `standard`/`tier` inside a template literal remain).

**Sub-item 3e - replace pre-allocated U14/U15 literals with allocation-at-land placeholders.**
- File: `docs/internal/standards-plan-roadmap/drafts/standard-amendments.md`.
- Current-wrong: Amendment A assigns `reqId: "U14"` and Amendment B.1 assigns `reqId: "U15"`, violating the file's own no-pre-allocation preamble.
- New-right: both read a provisional placeholder consistent with the file's stated convention, e.g. `reqId: "<allocated-at-land>"` (matching how D.1/E.1/F.1 already leave theirs unnumbered).
- Verify: `grep -nE "reqId:\s*\"U1[45]\"" docs/internal/standards-plan-roadmap/drafts/standard-amendments.md` returns nothing.

**Sub-item 3f - correct the Phase 0 plan's stale literals.**
- File: `docs/internal/standards-plan-roadmap/plans/phase-0-truth-and-relocation.md`.
- 3f-i (GOVERNANCE.md line citations for the 0.8 sweep): Task B-5 Step 1 cites `standards/GOVERNANCE.md` lines "4, 41, 52, 54, 95-96," but live `0.8` sits only at lines 52, 54, 95 (lines 4/41/96 do not contain "0.8"). New-right: replace the hardcoded line list with the live-grep-derived set and an instruction to re-derive at execution time (`grep -n "0\.8" standards/GOVERNANCE.md`). EXCLUDE line 95 from the sweep: it is the illustrative version-bump example (the generic "0.8 -> 0.9" illustration) and must NOT be swept to 0.12 (that would produce a nonsensical "0.12 -> 0.9"); preserve it as an illustration, the same preserved-as-record treatment 3f-ii gives decisions/0001 line 14. So of the live hits, only lines 52 and 54 are sweep targets. Verify: `grep -n "0\.8" standards/GOVERNANCE.md` shows the actual lines; the plan no longer hardcodes 4/41/96; line 95's "0.8 -> 0.9" illustration is preserved.
- 3f-ii (decisions/0001 line-14-vs-42 citation): Task B-5 Step 2 cites `0001:42` as carrying a `0.8`, but line 42 has only the `writing-style-library` name drift; the file's `v0.8` is at line 14, inside the ADR Context section (a point-in-time historical record). New-right: correct the citation (name drift at 42; `v0.8` at 14) and mark line 14 as a historical record to FLAG, not silently sweep (this connects to LA-5 and the decision item in [08-decision-register.md](08-decision-register.md)). Verify: `grep -n "0\.8" standards/decisions/0001-standard-governance-and-home.md` shows line 14; `grep -n "writing-style-library" standards/decisions/0001-standard-governance-and-home.md` shows line 42.
- 3f-iii (self-contradictory test count): the plan / change-manifest states "~63 total; 68 import" - more importers than total files, self-contradictory. New-right: replace with a live-derived instruction (count `.mjs` under `agent-skills-toolkit/tests/` and filter fixture false-positives at execution time; do not hardcode a count). Verify: the plan text no longer asserts a fixed contradictory pair; the live count command is documented inline.

**Sub-item 3g (verify-only) - confirm the D10 drafts do not conflate enforcement with clause-landing.**
- Files: `docs/internal/standards-plan-roadmap/drafts/cross-tool-targeting.md` and `docs/internal/standards-plan-roadmap/drafts/contributing-edits.md`.
- No edit required: the phase separation is structural (per the Goal, the D10 clause lands in Phase 3 via B4 (FC-0001 and Phase 3), while enforcement is advisory in LA-4 and blocking in B5 (Phase 4)). This sub-item only confirms neither draft claims D10 enforcement lands in the same phase as the clause.
- Verify: `grep -niE "enforc.{0,40}phase 3|phase 3.{0,40}enforc" docs/internal/standards-plan-roadmap/drafts/cross-tool-targeting.md docs/internal/standards-plan-roadmap/drafts/contributing-edits.md` returns nothing (no draft ties D10 enforcement to Phase 3, the clause-landing phase).

**Verification (whole task):** `git diff --stat` shows only the four draft files plus the Phase 0 plan; every sub-item grep passes; `validate` CI green (docs-only).

**Rollback:** Per-file `git checkout --` before commit, or `git revert <sha>` after merge. These are planning drafts; reverting restores the prior staged text with zero runtime impact.

---

## LA-4: Phase 2 keystone (advisory) - check 8 + check 9 with tests

**Goal:** Add the marketplace re-pin conformance check (check 8) and the truth-in-targeting check (check 9, advisory) to `scripts/validate-registry.mjs`, and surface `standard` + `tier` in the validator output, per the LA-3-repaired [../standards-plan-roadmap/drafts/ci-repin-check.md](../standards-plan-roadmap/drafts/ci-repin-check.md). Advisory only in Lane A - the blocking flip is gated on B3 (Phase 1 pm-skills) landing and is specified in [06-ci-plan.md](06-ci-plan.md), not here. Operationalizes D10 (truth-in-targeting) advisory side and CONTRIBUTING.md L3/L4. Addresses the PRD "listing conformance is machine-surfaced" acceptance.

**Executor tier:** Opus subagent (new validator logic, helpers, and tests; judgment on the advisory wiring and the pm-skills-missing-`library.json` edge case).

**PR:** PR-A3. Depends on PR-A2 (the ci-repin-check.md syntax fix must be merged first).

**Steps:**
1. Read `scripts/validate-registry.mjs` and `.github/workflows/validate-registry.yml` in full (ground truth; checks 1-7 exist today).
2. Add helpers next to `fetchPluginJson`: `fetchLibraryJson(repo, sha)`, `ciGreenAtSha(repo, sha)`, `pathsPresent(repo, sha, paths)`, `hasSkillTree(repo, sha)`, per ci-repin-check.md Section 3.5 / 4.5. Cache the recursive git tree per `repo@sha` so checks 8 and 9 share one `gh()` call.
3. Insert check 8 after check 7 in the per-entry loop, guarded by the existing `if (!repo) { warn(...); continue; }` non-github skip: assert `library.json` present + parses, `standard` pins a version, `tier` is one of `universal|convergent|advanced`, `library.json` version agrees with the registry entry version, and CI is green at the pinned sha. Use an `emit8` that respects `REGISTRY_CHECK8=advisory`.
4. Insert check 9 after check 8: hard-advisory in Phase 2 (`advisory9 = true`); for each declared `agent-targets` entry assert the target-to-evidence table (claude -> `.claude-plugin/plugin.json` + `AGENTS.md` + `CLAUDE.md` shim; codex -> portability floor as the interim signal, with the codex-distributed native branch gated behind `REGISTRY_CODEX_NATIVE`, which stays off in Lane A). A Universal plugin with no `agent-targets` passes with no assertions.
5. Add the module-level `summary` accumulator and, after the loop, print the Section 6.1 human-readable `standard`/`tier`/`ci` table; when `REGISTRY_SUMMARY_JSON=<path>` is set, write the Section 6.2 JSON artifact. Call `report()` unchanged. Update the file header check-inventory comment to list 8 and 9.
6. Edit `.github/workflows/validate-registry.yml`: add `REGISTRY_CHECK8: advisory` and `REGISTRY_SUMMARY_JSON: registry-conformance.json` to the validate step `env:`, and an `actions/upload-artifact@v4` step for the JSON. Also add a test-run step (`node --test scripts/`) to the workflow so the `validate` required check actually gates the tests - today the workflow runs only `node scripts/validate-registry.mjs`, so local-only tests could break silently.
7. Add tests in `scripts/validate-registry.test.mjs`, run via `node --test scripts/`: unit-test the four helpers (mock `gh`/`fetchRetry`), and integration-test that a missing `library.json`, a missing `standard`/`tier`, a version disagreement, and a red CI each `warn` (not `fail`) while advisory. Include the pm-skills case (no `library.json`) proving check 8 warns rather than fails while advisory.

**Verification (real commands):**
- Runner still parses and runs: `node scripts/validate-registry.mjs 2>&1 | tail -20` prints the `=== registry conformance summary ===` block with a per-plugin `standard=.. tier=.. ci=..` line and exits 0 (all new findings are advisory).
- Advisory proven: with `pm-skills` carrying no `library.json`, the run reports a check-8 WARNING for it and still exits 0. Confirm: `node scripts/validate-registry.mjs; echo "exit:$?"` shows `exit:0`.
- Tests green: `node --test scripts/` passes with `fail 0` (and the `validate` workflow now runs this same command, so the required check gates it).
- JSON artifact: `REGISTRY_SUMMARY_JSON=/tmp/reg.json node scripts/validate-registry.mjs && node -e "JSON.parse(require('fs').readFileSync('/tmp/reg.json'))" && echo json-ok`.
- Workflow parses: `python -c "import yaml;yaml.safe_load(open('.github/workflows/validate-registry.yml'));print('yaml ok')"`.

**Rollback:** The change is additive and advisory - it cannot fail a merge. If a helper misbehaves, `git revert <sha>` restores checks 1-7 exactly; the env toggles (`REGISTRY_CHECK8`, `REGISTRY_SUMMARY_JSON`) are removed with the same revert. No pin data is ever mutated (the checks read-only).

---

## LA-5: Build and open the PR-B relocation PR (merge HELD)

**Goal:** Fully build the agent-plugins half of Phase 0 - the atomic GOVERNANCE LAND (PR-B) - on a branch, and open its PR, but HOLD the merge per R7 (PR-B staging) until B1 (PR-A, ship the org gate) is approved and runs green. This is the in-repo COPY side only; askit's deletion (PR-C) is cross-repo Lane B ([B2 (PR-C askit re-adopt)](05-lane-b/B2-pr-c-askit-readopt.md)), so no dark window is created inside Lane A. Executes the deferred half of ADR 0001 (standard governance and home) per [../standards-plan-roadmap/plans/phase-0-truth-and-relocation.md](../standards-plan-roadmap/plans/phase-0-truth-and-relocation.md) Tasks B-1 through B-6. Addresses the PRD "the Standard has a real home in agent-plugins" acceptance.

**Executor tier:** Opus subagent (judgment seams: which ambiguous siblings move, the changelog-history migration, ADR authoring; per the Phase 0 plan's confidence table these are Medium-confidence mechanical-but-fiddly items with real verify gates).

**PR:** PR-A4 on branch `standards/phase-0-relocation`. Opened during Lane A; merge HELD per R7.

**Steps (from the Phase 0 plan, COPY side only):**
1. Branch `standards/phase-0-relocation` off current `main`.
2. Copy the runner unit into `standards/checks/`: `check.mjs`, `tier-report.mjs`, `lib/`, `checks/`, `generators/` from `agent-skills-toolkit/scripts/` (read-only source). Assess `evaluate.mjs`/`scripts/README.md` via the sibling-import probe (move only if they import `./lib/`); record the decision in the commit.
3. Copy the runner's own tests into `standards/checks/tests/` and repoint their imports to the co-located paths. Derive the test file list with a LIVE grep and filter non-`.mjs` fixtures - do NOT trust the "~63 total; 68 import" literal (corrected in LA-3 sub-item 3f-iii).
4. Copy `STANDARD.md` verbatim into `standards/STANDARD.md`; the header stays `0.12` per R3 (no-bump) - do not edit the version.
5. Create `standards/CHANGELOG.md` and `standards/RELEASE-NOTES.md`, migrating the Standard-version history out of askit and adding an "Unreleased" relocation entry.
6. Drop the `standards/README.md` "not here yet" caveats and repoint See-also links to the local copy.
7. Add the relocation ADR at `standards/decisions/NNNN-relocate-standard-and-runner.md` - NNNN is the next free number taken against the protected head AT LAND (do not pre-bake).
8. Sweep stale `0.8` refs and the `writing-style-library` name drift with LIVE greps (not the stale line literals - use the LA-3-corrected citations). Sweep only live "current version 0.8" / name-drift hits; PRESERVE `standards/decisions/0001-...md` line 14's `v0.8` as a historical record, AND PRESERVE `standards/GOVERNANCE.md` line 95's illustrative "0.8 -> 0.9" version-bump example (do not sweep it to 0.12; that would produce a nonsensical "0.12 -> 0.9") - both are records/illustrations, not live pins. If the sweep set is re-derived by live grep, this guard mirrors the 3f-i exclusion (flag both to the maintainer per the decision item in [08-decision-register.md](08-decision-register.md); do not silently sweep them).
9. Run the relocated gate locally against askit to prove it grades green from the new home; open the PR; then HOLD - do not merge until B1 (PR-A) is approved and green.

**Verification (real commands):**
- Relocated tests green in place: `cd standards/checks && node --test tests/ 2>&1 | tail -15` shows `fail 0`.
- Relocated runner grades a foreign root green: `node standards/checks/check.mjs ../agent-skills-toolkit 2>&1 | tail -4` shows `Tier: Advanced (no blockers detected)`, `0 error(s), 0 warning(s)`, exit 0.
- Header untouched: `grep -nE "Standard version" standards/STANDARD.md` shows `0.12`.
- README clean: `grep -niE "not here yet|agent-skills-toolkit/STANDARD\.md" standards/README.md || echo clean` prints `clean`.
- Sweep clean but history preserved: `grep -rniE "writing-style-library|current version.{0,5}0\.8" standards/ | grep -v "0001-standard"` returns nothing live; `grep -n "0\.8" standards/decisions/0001-standard-governance-and-home.md` still shows line 14.
- PR open, not merged: `gh pr view <PR#> --json state,mergeStateStatus` shows `OPEN` and the PR body states the R7 hold.

**Rollback:** The branch is not merged during Lane A, so `main` is unaffected by construction. To abandon: `gh pr close <PR#> && git branch -D standards/phase-0-relocation`. If merged later (after PR-A green) and regretted, `git revert` the squash commit; because this is COPY-only, askit still holds its working copies (no dark window), so a revert is safe.

---

## LA-6: Flip branch protection `strict:true` on `main`

**Goal:** Make the up-to-date-before-merge serialization that GOVERNANCE.md Section 6 already assumes mechanically real, per R6 (branch protection). `enforce_admins` STAYS false and is recorded as a documented residual risk in [09-risk-register.md](09-risk-register.md). Addresses the PRD "governance serialization is enforced, not just documented" acceptance.

**Executor tier:** Fable (a `gh api` config action, not a PR).

**Steps:**
1. Read current protection back first (baseline for rollback): `gh api repos/product-on-purpose/agent-plugins/branches/main/protection > /tmp/protection-before.json`.
2. Flip `strict:true` while preserving the existing required context `["validate"]`: `gh api -X PATCH repos/product-on-purpose/agent-plugins/branches/main/protection/required_status_checks -f strict=true -f 'contexts[]=validate'`.
3. Leave `enforce_admins` at its current `false` (do not touch); record the residual risk.

**Verification (real commands):**
- Read protection back: `gh api repos/product-on-purpose/agent-plugins/branches/main/protection/required_status_checks --jq '.strict, .contexts'` returns `true` and `["validate"]`.
- Admins untouched: `gh api repos/product-on-purpose/agent-plugins/branches/main/protection/enforce_admins --jq '.enabled'` returns `false`.

**Rollback:** `gh api -X PATCH repos/product-on-purpose/agent-plugins/branches/main/protection/required_status_checks -f strict=false -f 'contexts[]=validate'` restores `strict:false`; or restore the full baseline from `/tmp/protection-before.json`.

**Note on ordering:** flipping this after LA-1 lands means LA-2 through LA-5 merge under real serialization (each PR must be current before merge). That is the intended effect; it adds a rebase step per PR, which the orchestrator handles.

---

## LA-7: Dissolve `_agent-context/`, rename `_LOCAL` -> `_local` (CONDITIONAL - recommend defer)

**Goal:** Apply D5 (dissolve `_agent-context`) and D6 (casing) to THIS repo only - move the three committed session logs to gitignored `_local/session-logs/`, rename `_LOCAL` -> `_local`, and fix `.gitignore` so the exclusion holds on case-sensitive runners. Addresses the deferred repo-health items the audit lists.

**Status: CONDITIONAL. Recommendation: DEFER to the Phase 3 fleet campaigns (C1 casing, C4 `_agent-context` dissolution) so this repo converges in lockstep with the family rather than one-off.** Doing it here in Lane A would make agent-plugins the sole early mover and split the campaign's dual-documentation record. This is a decision item for the maintainer, recorded in [08-decision-register.md](08-decision-register.md); default is defer (no execution in Lane A).

**Executor tier:** Opus subagent (only if the maintainer rules to execute now; the `check-context-currency` home question is a judgment seam per the C4 campaign brief).

**PR (only if executed):** its own branch, e.g. `chore/dissolve-agent-context`; otherwise no PR.

**Steps (only if the maintainer rules to execute in Lane A):**
1. `git mv _agent-context/session-logs/*.md _local/session-logs/` (creating `_local/`), rename `_LOCAL` -> `_local` for the remaining scratch, then `git rm -r _agent-context`.
2. Update `.gitignore`: remove the `_agent-context/*` + `!_agent-context/session-logs/` carve-out; ensure a case-correct `_local/` ignore that holds on Linux CI.
3. Sweep hardcoded `_LOCAL/` path text in `AGENTS.md`, `standards/README.md`, `GOVERNANCE.md`, and `CONTRIBUTING.md` Section 6.

**Verification (real commands):**
- `test ! -d _agent-context && echo dissolved`.
- `git check-ignore _local/session-logs/x.md && echo ignored` (the new home is gitignored).
- `grep -rn "_LOCAL/" AGENTS.md standards/ CONTRIBUTING.md | grep -v "renamed from" || echo clean`.

**Rollback:** `git revert <sha>` restores `_agent-context/` and the `.gitignore` carve-out. Because the session logs are historical records, verify they are preserved (moved, not deleted) before merge.

---

## LA-8: Program bookkeeping - backlog and registers current

**Goal:** Keep the execution suite a living, accurate record throughout Lane A: seed [10-backlog.md](10-backlog.md) from Codex review findings that survive as follow-ups, and keep [00-README.md](00-README.md), [08-decision-register.md](08-decision-register.md), and [09-risk-register.md](09-risk-register.md) current as tasks land. Operationalizes the living-docs protocol in [11-agent-operations.md](11-agent-operations.md).

**Executor tier:** Fable (orchestrator bookkeeping as PRs merge).

**Steps:**
1. After each PR's Codex review, append surviving follow-up findings to 10-backlog.md with the source PR and a one-line handle.
2. On each task Done, update this file's Completion Status row and 00-README's status line.
3. When a decision item is raised (e.g. LA-5's line-14 historical-record flag, LA-7's defer-vs-execute, the `enforce_admins` residual), record it in 08-decision-register.md as ruled or open-with-recommendation.

**Verification:** `grep -c "^|" docs/internal/execution/10-backlog.md` grows as findings land; the Completion Status table has no `Not started` rows once Lane A is complete; every open decision item appears in 08-decision-register.md.

**Rollback:** Doc-only; `git revert` any bookkeeping commit. Bookkeeping never gates a merge.

---

## Lane A done checklist

Lane A is complete when all of the following hold:

- [ ] LA-1: the execution suite is on `main`; all internal cross-links resolve.
- [ ] LA-2: no live in-repo doc contradicts the pins - `06-tier-requirements.md` askit pin reads `0.12`, `CONTRIBUTING.md` Section 8 reflects current writing-style-catalog truth, `program-roadmap.md` carries the superseded banner, `AGENTS.md` lists the execution suite, `REVIEW-AND-NEXT-STEPS.md` points here.
- [ ] LA-3: all six draft-drift sub-items fixed and grep-verified (D8 PLAN=Phase 3, D16 text present, L7 codex = D17, JS syntax valid, no U14/U15 literals, Phase 0 plan literals corrected).
- [ ] LA-4: check 8 + check 9 land advisory in `validate-registry.mjs` with tests green; the registry summary prints `standard`/`tier`/`ci`; the run exits 0 with pm-skills missing its `library.json`.
- [ ] LA-5: the PR-B relocation PR is open on `standards/phase-0-relocation`, all its verify gates green, merge HELD pending B1 (PR-A).
- [ ] LA-6: `strict:true` on `main` confirmed by reading protection back; `enforce_admins:false` recorded as residual risk.
- [ ] LA-7: deferred (default) or executed-and-verified if the maintainer ruled to execute in Lane A.
- [ ] LA-8: 10-backlog.md seeded from Codex findings; registers and 00-README current.
- [ ] Every merged Lane A PR passed validate + a Codex adversarial review that was answered (R5).

## Estimated PR map

| PR / action | Branch | Tasks | Owner | Gate | Merge |
|---|---|---|---|---|---|
| PR-A1 | `feat/execution-package` | LA-1 (+ LA-8 rides here) | Fable | validate + Codex | autonomous |
| Config action | (none) | LA-6 | Fable | read-back verify | after LA-1 |
| PR-A2 | `docs/truth-and-draft-repair` | LA-2 + LA-3 | Sonnet + Opus subagents | validate + Codex | autonomous; before PR-A3 |
| PR-A3 | `feat/registry-keystone-advisory` | LA-4 | Opus subagent | validate (including node --test) + Codex review | autonomous; after PR-A2 |
| PR-A4 | `standards/phase-0-relocation` | LA-5 | Opus subagent | validate + relocation gates + Codex | HELD per R7 until B1 (PR-A) green |
| (conditional) | `chore/dissolve-agent-context` | LA-7 | Opus subagent | validate + Codex | only if maintainer rules to execute now |

Four PRs plus one config action, with LA-7 deferred and LA-8 riding as continuous bookkeeping. Lane A opens with LA-1, flips serialization with LA-6, does its doc-truth and draft-repair work in PR-A2, lands the advisory CI keystone in PR-A3, and stages PR-A4 for the Lane B handoff (B1 (PR-A) then unblocks its merge; [B2 (PR-C askit re-adopt)](05-lane-b/B2-pr-c-askit-readopt.md) completes the relocation cross-repo).

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
| 2026-07-03 | verifier fixes applied (lead-ruled) |
