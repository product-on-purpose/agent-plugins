---
date: 2026-06-02T22:00:00-07:00
repo: product-on-purpose/agent-plugins
branch: main
summary: "Audited + promoted the Astro site standard, drove the 4-repo conformance rollout, folded learnings back, and authored the fleet-orchestration program"
files-changed:
  - docs/internal/audits/2026-06-02_astro-implementation.md
  - standards/domains/astro-sites/SITE-STANDARD.md
  - standards/domains/astro-sites/ci-standard.md
  - standards/domains/astro-sites/shared-preset-spec.md
  - standards/domains/astro-sites/ROADMAP.md
  - standards/domains/astro-sites/README.md
  - standards/domains/astro-sites/assets/favicon.png
  - standards/domains/astro-sites/rollout/{README,pm-skills,thinking-framework-skills,agent-skills-toolkit,writing-style-catalog}.md
  - standards/{GOVERNANCE,README}.md
  - standards/decisions/{0001-standard-governance-and-home,README}.md
  - docs/internal/orchestration/{README,guide,backlog}.md
  - docs/internal/orchestration/specs/{orchestration-capability,consistency-folder-structure,consistency-ci,consistency-page-formatting,consistency-processes}.md
session-type: docs
model: claude opus 4.8
model-settings: "ultracode (xhigh + dynamic workflow orchestration), explanatory output style"
agent: claude-code
status: completed
decisions-count: 22
adrs-created: []
tags: [astro, starlight, standards, governance, conformance-audit, multi-agent-workflow, fleet-orchestration, dual-documentation, section-14]
transcript-path: see Claude Code session transcript for this project (session 03144388-cc7c-4b10-8d14-6df335486ee1)
---

# Session: Astro site standard - audit, promotion, 4-repo rollout, learnings fold-back, and the fleet-orchestration program

## Summary

Started by auditing the four family plugin sites against the proposed Astro documentation-site standard (clauses 14.1-14.11), then promoted the standard from gitignored `_LOCAL/astro/` drafts into a tracked `standards/domains/astro-sites/` domain with per-repo execution packets. The maintainer ran the four per-repo conformance sessions (in their own repos) using those packets; their adversarial-review findings were fed back here and folded into the standard, including two genuine corrections to clauses I had written (favicon is a MUST, not "minor"; implement 14.11 locally now rather than defer). Closed by generalizing the rollout experience into a committed fleet-orchestration program (`docs/internal/orchestration/`) covering how to drive consistent cross-repo changes from this neutral repo, the dual-documentation model, and the four consistency initiatives. Six PRs merged to `main`; repo left clean; memory updated.

## Work Completed

- **Multi-agent conformance audit** (8 agents: 4 deep auditors + 4 adversarial verifiers, via the Workflow tool) of all four sites against clauses 14.1-14.11 + CI + preset readiness. Adversarial pass produced two material corrections (agent-skills-toolkit's catalog IS drift-guarded via `tests/unit/catalog-coverage.test.mjs`; writing-style-catalog was audited mid-merge on an unmerged branch). Committed as `docs/internal/audits/2026-06-02_astro-implementation.md`.
- **Promoted + refined the Astro site standard** into the tracked `standards/domains/astro-sites/` bundle: `SITE-STANDARD.md` (reference architecture + clauses 14.1-14.11 + decisions A-1..A-6), `ci-standard.md`, `shared-preset-spec.md`, `ROADMAP.md`, `README.md`, and four per-repo execution packets under `rollout/` (each: pass/fail scorecard + corrections + agent-updatable checklist + copy-paste kickoff prompt). Wired into `standards/README.md` + `GOVERNANCE.md`. (PR #3)
- **Corrected wsl status** after the maintainer flagged it: PR #11 had shipped writing-style-catalog's Pattern S migration to `main`, so the family is 4/4 Pattern S on `main` and A-6 (migrate) is executed. Rewrote the wsl packet and audit accordingly. (PR #4)
- **Refined tfs 14.11 framing** (PR #5) and **added the generated-page Edit-link rule** to the standard (source-or-`false`, never an auto-derived gitignored path) after the tfs session surfaced it (PR #6).
- **Folded the 2026-06-02 rollout learnings into the standard** (PR #7) from the three adversarial review-findings docs the maintainer committed, plus the family placeholder **favicon** (`assets/favicon.png`, a `#5C7CFA` compass the maintainer provided).
- **Authored the fleet-orchestration program** (`docs/internal/orchestration/`): a learning guide (levels, decision rule, mechanics, the dual-documentation model), a program backlog, and specs/plans for the orchestration capability plus the four consistency domains (folder structure, CI, page formatting, processes). (PR #10)
- **Repo hygiene:** swept the superseded `_LOCAL/astro/` drafts (keeping two evidence docs); annotated the `_LOCAL/` findings doc inline; pruned two stale branches (`list-writing-style-catalog` local; `stage/thinking-framework-skills-listing` local + remote, superseded by tfs being live-listed at v0.2.1).
- **Memory:** rewrote the stale `family-standards-governance` memory to current reality and added a `fleet-orchestration-program` memory (both indexed in `MEMORY.md`).

## Decisions Made

1. **Promote the Astro standard to `standards/domains/astro-sites/`** (a new tracked domain), not into `STANDARD.md` directly. Rationale: the maintainer asked for promotion to a tracked location in agent-plugins; the normative §14 landing into `STANDARD.md` is a separate serialized amendment. Architectural.
2. **Run the audit as an 8-agent workflow with adversarial verification**, not a single read. It caught the catalog-coverage refutation and the wsl branch-vs-main trap. Significant.
3. **Add clause 14.11 (link/route integrity)** as a new named guardrail (the four build-aware validators), promoted from the pm-skills implementation. Architectural.
4. **Favicon is a MUST, not "minor" (14.9 correction).** Starlight emits `<link rel="icon">` on every page, so a missing favicon is a 404 on every page, unlike `og:image` (no emitted reference). This reversed my earlier "favicon optional/skip" stance. Significant correction.
5. **Implement 14.11 locally now, do not defer to the unbuilt shared workflow (reversal of my own advice).** Three of four repos implemented locally and caught real shipped breakage; the shared infra is unbuilt and 14.11 is a MUST. Architectural reversal.
6. **Do not assert a value is "stale" without reading the repo's ADRs.** The wsl Starlight title was deliberately retained per its ADR 0014; my packet's "fix the stale title" item was wrong and was withdrawn. Process discipline now in the standard.
7. **A-2 Option A:** ship the reusable CI workflow + validators first, consume the preset as a git-tag dependency, defer the registry publish behind a written trigger; factory name `defineDocsConfig`. Significant.
8. **Generated-page `editUrl` must be source-or-`false`**, never an auto-derived gitignored path (the tfs 404 finding); grounded in the pm-skills + wsl proven patterns. Significant.
9. **14.7 base-literal exceptions sanctioned** (a test value-pin + the untemplatable robots.txt sitemap URL); **14.8 pin = lockfile, not caret range.** Wording refinements from the reviews.
10. **Favicon placeholder = the 512x512 compass** (best fidelity master; SVG re-master is a follow-up). Minor.
11. **Sweep the superseded `_LOCAL/astro/` drafts, keep the two evidence docs** (the audit cites them). Minor.
12. **Fleet-orchestration model: orchestrate from one control point, land one PR per repo**; dual documentation (central intent + local application joined by a campaign id). Architectural (operating model).
13. **tfs 14.11 deferral was the conservative call and is now reversed**; tfs has an open follow-up to add the two local bridge guards (a ready prompt was provided). Significant.
14. **Prune both stray branches** after confirming neither holds unshipped unique work (list-... was a stale main-ancestor label; stage/... was superseded by tfs's live v0.2.1 listing). Minor.
15. **Saved the session log to `_agent-context/session-logs/`** to match the family convention (vs the skill's `AGENTS/session-log/` default). Minor.

(Plus ~7 lower-significance decisions: per-repo packet structure, the per-repo kickoff-prompt tuning, the tfs follow-up prompt bundling the editUrl fix, the ci-standard `node-version-file` simplification, the dash-check scan set including `.py`, the build-outcome CI gate, and the README/GOVERNANCE rewiring.)

## Files Changed

All merged to `main` via six squash PRs; working tree is clean (changes are in history, not pending).

- **Audit:** `docs/internal/audits/2026-06-02_astro-implementation.md` (#3, corrected in #4, #6, #7).
- **Astro standard domain:** `standards/domains/astro-sites/` - `SITE-STANDARD.md`, `ci-standard.md`, `shared-preset-spec.md`, `ROADMAP.md`, `README.md`, `assets/favicon.png`, and `rollout/{README,pm-skills,thinking-framework-skills,agent-skills-toolkit,writing-style-catalog}.md` (#3, #4, #5, #6, #7).
- **Governance home:** `standards/{README,GOVERNANCE}.md`, `standards/decisions/{0001-...,README}.md` (#3, rewired in #4).
- **Orchestration program:** `docs/internal/orchestration/{README,guide,backlog}.md` + `specs/{orchestration-capability,consistency-folder-structure,consistency-ci,consistency-page-formatting,consistency-processes}.md` (#10).
- **Gitignored (not committed):** inline annotations on `_LOCAL/astro/findings-suggestions/2026-06-02_pm-skills-session_after-astro.md`; deletion of five superseded `_LOCAL/astro/` drafts + the `rollout/` subdir.
- **Outside the repo:** `~/.claude/.../memory/{family-standards-governance,fleet-orchestration-program,MEMORY.md}` updated.

## Verification

- [x] Audit claims adversarially re-verified by a second agent per repo (8-agent workflow); two corrections carried in.
- [x] Independent ground-truth checks by hand: branch state per repo (`git rev-parse`), tracked build output (`git ls-files`), accent/mermaid/deploy-action versions, favicon presence, `editUrl` handling across the three Node generators.
- [x] Every PR (#3-#7, #10) merged only after the `validate` CI check passed (15-21s each); confirmed via `gh pr checks`.
- [x] Dash-clean sweep (`grep -P '\x{2014}|\x{2013}'`) on every authored doc before each commit; all clean.
- [x] Relative-link spot-checks on the new doc trees.
- [x] Branch cleanup verified: remote has only `main`; local has only `main`; tree clean; `main` synced at `88caea1`.
- [x] Memory rewrite verified against current repo reality (Standard v0.9, promoted domain, swept drafts).
- [ ] NOT verified by me: the four per-repo conformance implementations themselves (the maintainer ran those sessions in the plugin repos; I consumed their committed review-findings docs, did not re-run their builds).
- [ ] NOT done: landing §14 into `STANDARD.md`; building the reusable workflow/preset; the tfs 14.11 follow-up; any consistency epic.

## Outstanding Issues

- **§14 not landed.** The clauses are land-ready in `SITE-STANDARD.md` but still need the serialized amendment into `agent-skills-toolkit/STANDARD.md` (one PR: text + version bump + one ADR), per `standards/GOVERNANCE.md`.
- **tfs 14.11 follow-up open.** thinking-framework-skills deferred the link/route guards; a ready-to-run kickoff prompt was provided this session (not yet executed). It likely has undetected pre-existing broken links (its siblings did).
- **pm-skills + writing-style-catalog lack a `library.json`**, so they cannot pin the Standard / re-adopt §14 yet.
- **Shared infra unbuilt:** `product-on-purpose/.github` reusable workflow and the `@product-on-purpose/astro-docs-preset` are specced, not built (Astro ROADMAP Phases 1-2).
- **Favicon is a placeholder PNG** (compass); an SVG re-master is the follow-up.
- **Consistency epics E2-E5** (folder structure, CI, page formatting, processes) are specced, not started.

## What's Next

1. Land `STANDARD.md` Section 14 via the serialized amendment (highest-leverage: makes the standard normative and re-adoptable).
2. Run the tfs 14.11 follow-up (the prompt is ready) so all four repos have the link/route guards.
3. Astro ROADMAP Phase 1: stand up `product-on-purpose/.github` with the reusable `astro-site.yml@v1`, seeded from the FIXED agent-skills-toolkit guard versions; then Phase 2 (extract the preset).
4. Run the first fleet-orchestration pilot (FC-0001: favicon adoption or the CI dash-check) to validate the orchestration capability + the dual-doc model.
5. Add `library.json` to pm-skills and writing-style-catalog so they can pin the Standard.

## Continuation Prompt

```
You are resuming work on the product-on-purpose family in the agent-plugins repo
(E:\Projects\product-on-purpose\agent-plugins, branch main, clean). Context: the Astro
documentation-site standard was audited, promoted to standards/domains/astro-sites/, rolled
out to all four plugin repos (now 4/4 Pattern S on main), and its rollout learnings folded
back; a fleet-orchestration program was authored at docs/internal/orchestration/. Read first:
- standards/domains/astro-sites/README.md + SITE-STANDARD.md (clauses 14.1-14.11, decisions)
- standards/domains/astro-sites/ROADMAP.md (Phases 1-3)
- standards/GOVERNANCE.md (the serialized amendment process)
- docs/internal/orchestration/guide.md + backlog.md (the operating model + program)
- docs/internal/audits/2026-06-02_astro-implementation.md (the conformance evidence)

Pick ONE of these next actions (most leverage first):
1. LAND Section 14: draft the serialized amendment that copies the SITE-STANDARD.md clauses
   14.1-14.11 into agent-skills-toolkit/STANDARD.md as a new Section 14, bump the Standard
   version once, add one ADR, update CHANGELOG/RELEASE-NOTES. One PR on the protected branch.
   The clauses are already land-ready; this is a copy-and-renumber per GOVERNANCE.md Section 5.
2. tfs 14.11 follow-up: open a session in E:\Projects\product-on-purpose\thinking-framework-skills
   and run the kickoff prompt in standards/domains/astro-sites/rollout/thinking-framework-skills.md
   (the status banner) - add the two local bridge guards (rendered-link + route-parity) from the
   FIXED agent-skills-toolkit/site/scripts/ versions, plus the generated-page editUrl fix.
3. FC-0001 orchestration pilot: author a fleet-change spec (per
   docs/internal/orchestration/specs/orchestration-capability.md) for the favicon adoption or the
   CI dash-check, allocate a campaign record, and run the Level-2 fan-out (one sub-agent per repo,
   one PR each, pilot one repo first). This validates the orchestration capability + dual-doc model.

House rules: no em-dashes or en-dashes anywhere (use " - " or restructure); branch -> PR ->
squash-merge (the validate check gates; main is PR-protected); do not push/merge without the
maintainer's confirmation. The four plugin repos are separate working dirs under
E:\Projects\product-on-purpose\; do not couple them - one PR per repo.
```

## Evidence Index

- Audit workflow: 8-agent run (4 audit + 4 verify), output at the session's workflow task `wllzcdg2b` / run `wf_dc91b175-36e`.
- PRs merged this session (all squash, `validate` green): #3 (`026f29d`, standards domain + governance + audit), #4 (`8987547`, wsl correction), #5 (`e565f62`, tfs 14.11 defer), #6 (`ee73c73`, generated-page editUrl rule), #7 (`6075352`, rollout learnings + favicon), #10 (`e0a2746`, orchestration program).
- Maintainer's parallel work on main this session: #8 (`e598898`, list wsl), #9 (`0002d0c`, list askit v1.0.0), #11 (`88caea1`, re-pin tfs v0.2.1); review-findings doc commits `42ba9e6`/`708d864`/`b7f621e`.
- Per-repo conformance sessions (run by the maintainer, consumed here): pm-skills #160, thinking-framework-skills #30, agent-skills-toolkit #83 (ADR 0026), writing-style-catalog #11+#12.
- Review-findings docs: `standards/domains/astro-sites/rollout/2026-06-02_astro-standard_{agent-skills-toolkit,pm-skills,writing-style-catalog}_review-findings.md`.
- `main` HEAD at wrap: `88caea1`. Branches pruned: `list-writing-style-catalog` (local), `stage/thinking-framework-skills-listing` (local + remote).
- Memory: `~/.claude/.../memory/family-standards-governance.md` (rewritten), `fleet-orchestration-program.md` (new), `MEMORY.md` (index).

## Verification Detail

| Check | Method | Result | Notes |
|-------|--------|--------|-------|
| Conformance audit | 8-agent workflow + adversarial verify | 2 corrections carried | catalog-coverage refuted; wsl audited mid-merge |
| wsl `main` state | `git fetch` + `git show main:...` | Pattern S confirmed (PR #11) | corrected the audit + packet |
| No committed build output (4 repos) | `git ls-files` per repo | clean all four | 14.5 satisfied |
| editUrl handling | grep generators (pm/wsl/tfs) | pm=source-or-false, wsl=false, tfs=none | drove the 14.x editUrl rule |
| Per-PR CI | `gh pr checks --watch` | `validate` pass (15-21s) each | merged only on green |
| No em/en dashes | `grep -P` per commit | clean | family rule + hook |
| Branch cleanup | `git ls-remote` + `git branch` | remote+local = only `main` | both stray branches shown superseded first |
| Memory accuracy | re-read vs repo | updated to v0.9 / promoted / swept | stale 06-01 snapshot replaced |
```
