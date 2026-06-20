---
date: 2026-06-20T01:06:00-07:00
repo: https://github.com/product-on-purpose/agent-plugins.git
branch: main
summary: "Standards program: locked 17 decisions, validated 2 spikes, wrote Phase 0 plan + repo-health pass; at execution boundary"
files-changed:
  - docs/internal/standards-plan-roadmap/ (the standards package: 00-06 + OVERVIEW + drafts/9 + spikes/2 + plans/2 + REVIEW-AND-NEXT-STEPS)
  - AGENTS.md
  - CLAUDE.md
  - docs/internal/2026-06-20_repo-health-review.md
  - _agent-context/session-logs/2026-06-20_01-06_claude_standards-roadmap-phase0-plan-repo-health.md
session-type: planning
model: claude opus 4.8
model-settings: "ultracode (xhigh + dynamic workflow orchestration), explanatory output style"
agent: claude-code
status: completed
decisions-count: 17
---

# Standards roadmap, Phase 0 plan, and repo-health pass

## Summary

A long, multi-phase session that took the family standardization effort from a broad request to a fully planned, decided, spike-validated, and committed program sitting at the planning/execution boundary. The key reframe early on: the family is not greenfield - it already has one normative Standard (v0.12), a 30-check runner, committed governance, and a graduated domain - so the work is consolidate / complete / harden. Across the session: brainstormed and locked 17 decisions (D1-D17), built a committed roadmap + ready-to-land drafts package, resolved every open question into a full decision dossier, ran two confirming spikes (runner-consumption and Codex paths), authored a human-consumption OVERVIEW, wrote the Phase 0 implementation plan + a current-vs-new change manifest with review guidance and a confidence table, did a repo-health pass (the repo now has its own AGENTS.md, a documented backlog, and a clean branch tree), and finished with a maintainer control panel (REVIEW-AND-NEXT-STEPS.md). Nothing has been executed against other repos; Phase 0 is staged and waiting on the maintainer's go.

## Work Completed

- **Grounding + decisions:** mapped the existing standards corpus (parallel workflow), then locked decisions D1-D17 through a clarifying dialogue (rollout, folder layout, decision homes, dissolve `_agent-context`, casing, no init skill, release subsystem, hooks, cross-tool/Codex, frontmatter, exceptions, enforcement appetite, runner-consumption, HISTORY.md, Codex deliver).
- **The package** (`docs/internal/standards-plan-roadmap/`, committed via PR #36 and grown since): `00-README`, `01-current-state` (gaps GP-1..GP-15), `02-roadmap` (6 phases), `03-decisions` (D1-D17), `04-standards-definition`, `06-tier-requirements`, `OVERVIEW.md` (human narrative), `05-open-questions` (full decision dossier), `drafts/` (9 land-ready specs), `spikes/` (2), `plans/` (2), `REVIEW-AND-NEXT-STEPS.md`.
- **Two spikes (validated):** runner-consumption CONFIRMED (ran the gate against an external repo; it grades an arbitrary root honoring that repo's pin) + ready-to-use reusable-workflow + caller YAML; Codex paths reconfirmed against current OpenAI docs (`.agents/skills`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`; one caveat: install is app/TUI-driven, no `codex plugin add` CLI verb).
- **Phase 0 plan** (`plans/phase-0-truth-and-relocation.md`) + **change manifest** (`plans/phase-0-change-manifest.md`): the task-by-task relocation across 3 PRs (org `.github` reusable workflow -> agent-plugins LAND -> askit RE-ADOPT, ordered no-dark-window), plus current-vs-new state per repo with Standard references, a "How to review" section in each, consolidated recommendations, severity-tagged risks, and a confidence table.
- **Repo-health pass** (PR #41): added the repo's own root `AGENTS.md` + thin `CLAUDE.md` (dogfoods D5/D10), a documented `docs/internal/2026-06-20_repo-health-review.md` (registry conformance snapshot + 5 deferred backlog items with reasons), and cleaned 5 stale merged branches (repo now `main`-only).
- **This wrap:** `REVIEW-AND-NEXT-STEPS.md` (the maintainer control panel) + this deep session log.

## Decisions Made

The 17 locked decisions live in full in `docs/internal/standards-plan-roadmap/03-decisions.md`. Headlines: **D2** Hybrid rollout (pull the law, push mechanics); **D5** dissolve `_agent-context` (session logs to gitignored `_local/`); **D10 + D17** cross-tool truth-in-targeting + DELIVER Codex (codex-distributed; D17 supersedes the earlier defer); **D14** runner-consumption = a reusable GitHub Actions workflow (central logic, thin pinned callers); **D15** full CI-enforced conformance via a tiered warn-first ramp; **D16** HISTORY.md amend (warn-then-error) + grandfather. Plus two execution rulings this session: the Phase 0 version bump is **structural / no bump** (keeps `0.13` free for the U13 burndown), and both confirming spikes resolved (D14 runner mechanics, D17 Codex paths).

## Files Changed

All committed via PRs #36 (package), #39 (Phase 0 plan), #40 (review guidance), #41 (repo health), plus this wrap. No tracked files are dirty (working tree clean on `main`). The standards package is 21 markdown files; the repo gained root `AGENTS.md` + `CLAUDE.md` and `docs/internal/2026-06-20_repo-health-review.md`. Memory (`family-standards-governance.md`, outside the repo) was updated throughout.

## Verification

- [x] Package consistency: 21 files, 75 relative links resolve, 0 em/en dashes (scripted check). VERIFIED.
- [x] Runner-consumption spike: ran `node agent-skills-toolkit/scripts/check.mjs <tfs-root>` -> graded tfs against its own 0.8 pin (exit 0, downgrade annotations); control on askit -> 0/0. VERIFIED by real captured output.
- [x] Codex paths: reconfirmed against live OpenAI Codex docs with citations. VERIFIED (one documented caveat on the install verb).
- [x] Phase 0 governance + facts grounded against source (the runner internals, askit CI sites `ci.yml:39`/`release.yml:39`/`package.json:10`, the G2/Section 4.1/4.4 wording, ADR 0001, the sweep file:line sites). VERIFIED by a parallel grounding workflow.
- [x] CI: PRs #36/#39/#40/#41 each passed the `validate` check before squash-merge. VERIFIED.
- [ ] NOT executed / assumed: the entire Phase 0 relocation is staged, not run. The reusable workflow's end-to-end GitHub Actions behavior is proven only at the `node check.mjs` layer (one live run still needed - PR-A closes it). The Codex install verb and the askit `evaluate.mjs`/`agentskills.mjs` fate are flagged assess-at-execution items.

## Outstanding Issues

- **Execution is gated on the maintainer.** Everything downstream waits on the "go" for PR-A. This is the only real blocker.
- **The one unproven thing:** the reusable workflow's live Actions run (mitigated by starting with PR-A).
- **Five deferred repo-health items** (documented with reasons in `docs/internal/2026-06-20_repo-health-review.md`): dissolve this repo's `_agent-context` (D5), surface `standard`/`tier` in the registry (Phase 2), re-pin automation, a pin-currency policy (GP-6), and the `_LOCAL` -> `_local` casing (D6).
- **The GP-6 lag** surfaced this session: tfs is at plugin v0.11.0 but still pins Standard 0.8.
- **D5 note:** this very session log sits in `_agent-context/session-logs/` (the current committed convention); D5 will move logs to gitignored `_local/` once it lands through governance.

## What's Next

The authoritative, prioritized guide is `docs/internal/standards-plan-roadmap/REVIEW-AND-NEXT-STEPS.md` (the control panel). In short:

1. **Maintainer reviews** the Phase 0 plan + change manifest (each has a "How to review" section) and **authorizes PR-A** (+ confirms the no-bump ruling).
2. **PR-A:** ship + tag the reusable `standards-gate.yml` in `product-on-purpose/.github`, run it once live (closes the one unproven thing).
3. On green -> **PR-B** (agent-plugins LAND: relocate Standard + runner) -> **PR-C** (askit RE-ADOPT: repoint then delete). Phase 0 done.
4. -> **Phase 1** (pm-skills `library.json`, the highest-leverage conformance fix) -> **Phase 2** (CI re-pin keystone) -> Phases 3-5.
5. Backlog + Codex workstream slotted as chosen.

## Continuation Prompt

```
Resume the product-on-purpose standards program in agent-plugins
(E:/Projects/product-on-purpose/agent-plugins, branch main, PR-protected).

START HERE (in order):
1. AGENTS.md (repo orientation - this repo is the marketplace registry + the
   neutral standards-governance home; not a plugin).
2. docs/internal/standards-plan-roadmap/REVIEW-AND-NEXT-STEPS.md (the maintainer
   control panel: what is awaiting review/decision, in priority order, + the process).
3. docs/internal/standards-plan-roadmap/OVERVIEW.md (the why of the whole system).

STATE: the standards program is fully planned, decided (17 decisions D1-D17 in
03-decisions.md - do NOT relitigate without cause), spike-validated, and committed.
It sits at the planning/execution boundary. Everything doable WITHOUT touching another
repo is done. The next move crosses repos and is GATED ON THE MAINTAINER'S GO.

THE NEXT ACTION (when the maintainer authorizes): execute Phase 0 per
docs/internal/standards-plan-roadmap/plans/phase-0-truth-and-relocation.md, starting
with PR-A (ship + tag the reusable standards-gate.yml in product-on-purpose/.github -
local at E:/Projects/product-on-purpose/.github - and run it once live). The plan is
3 PRs ordered to keep askit's gate green with no dark window: PR-A (.github workflow) ->
PR-B (agent-plugins atomic LAND: relocate STANDARD.md + the runner into standards/) ->
PR-C (agent-skills-toolkit RE-ADOPT: repoint CI + npm check, THEN delete the copies LAST).
The change manifest (plans/phase-0-change-manifest.md) has current-vs-new state per repo.

LOCKED RULINGS: version bump = structural, NO bump (header stays 0.12; 0.13 reserved for
the U13 burndown). askit keeps Gold via an npm `check` script (G2 = RUN not OWN). Both
confirming spikes are done (runner grades a foreign root; Codex paths reconfirmed -
.agents/skills, .codex-plugin/plugin.json, .agents/plugins/marketplace.json; install is
app/TUI-driven, no `codex plugin add` CLI verb).

GUARDRAILS: never use em/en dashes (a hook blocks them; use " - "). Reference IDs carry
a handle on first use. main is PR-protected (branch -> PR -> squash-merge, `validate`
gates). Allocate ADR numbers/versions at LAND against head, never pre-baked. Verify CI
green before merging each PR. Do NOT execute cross-repo work without the maintainer's go.

DEFERRED BACKLOG (documented in docs/internal/2026-06-20_repo-health-review.md, awaiting
a slot): dissolve this repo's _agent-context (D5); surface standard/tier in the registry
(Phase 2); re-pin automation; a pin-currency policy (GP-6); _LOCAL->_local casing (D6).
```

## Evidence Index

- **Transcript:** this Claude Code session (project `E--Projects-product-on-purpose-agent-plugins`, session `441dd6df-97ab-4cb9-8a07-20d969d23935`).
- **Workflows run this session:** landscape map, package authoring + review, open-questions dossier, lock-decisions + tier doc, spikes + overview, Phase 0 grounding (run IDs in the transcript's workflows dir; outputs under `tasks/`).
- **PRs merged:** #36 (package), #39 (Phase 0 plan), #40 (review guidance), #41 (repo health) - all `validate`-green, squash-merged.
- **Spike evidence:** `docs/internal/standards-plan-roadmap/spikes/{runner-consumption,codex-paths}-spike.md`.
- **The control panel:** `docs/internal/standards-plan-roadmap/REVIEW-AND-NEXT-STEPS.md`.
- **Prior session log:** `_agent-context/session-logs/2026-06-17_20-44_claude_standards-roadmap-and-decisions-lockin.md`.
