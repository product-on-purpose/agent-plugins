---
date: 2026-06-17T20:44:00-07:00
repo: https://github.com/product-on-purpose/agent-plugins.git
branch: main
summary: "Brainstormed + locked 13 standards decisions; authored a roadmap + ready-to-land drafts package (plan-only)"
files-changed:
  - docs/internal/standards-plan-roadmap/00-README.md
  - docs/internal/standards-plan-roadmap/01-current-state.md
  - docs/internal/standards-plan-roadmap/02-roadmap.md
  - docs/internal/standards-plan-roadmap/03-decisions.md
  - docs/internal/standards-plan-roadmap/04-standards-definition.md
  - docs/internal/standards-plan-roadmap/drafts/standard-amendments.md
  - docs/internal/standards-plan-roadmap/drafts/contributing-edits.md
  - docs/internal/standards-plan-roadmap/drafts/ci-repin-check.md
  - docs/internal/standards-plan-roadmap/drafts/frontmatter-schemas.md
  - docs/internal/standards-plan-roadmap/drafts/agents-md-and-context.md
  - docs/internal/standards-plan-roadmap/drafts/release-subsystem.md
  - docs/internal/standards-plan-roadmap/drafts/cross-tool-targeting.md
  - docs/internal/standards-plan-roadmap/drafts/orchestration-campaigns.md
  - docs/internal/standards-plan-roadmap/drafts/runner-consumption.md
session-type: planning
model: claude opus 4.8
model-settings: "ultracode (xhigh + dynamic workflow orchestration), explanatory output style"
agent: claude-code
status: completed
decisions-count: 13
---

# Standards roadmap and 13-decision lock-in

## Summary

A planning and design session that converted a broad request ("best-in-class, best-practice standardization across all marketplace plugins, with human + agent docs and CI enforcement") into a concrete, locked plan. The key reframe: the product-on-purpose family is not greenfield; it already has a mature standards program (one normative Standard v0.12, a 30-check conformance runner, committed governance, a graduated astro-sites domain, a listing contract, orchestration + convergence docs), so the work is consolidate / complete / harden, not build. The session ran a clarifying-questions dialogue, locked 13 decisions (D1-D13), and produced a 14-file package (comprehensive roadmap + ready-to-land draft clause text) at `docs/internal/standards-plan-roadmap/` (moved there from gitignored `_LOCAL/`, so it is committed and durable). Execution and the per-plugin audit are deliberately deferred to separate later efforts (decision D1).

## Work Completed

- Ran a 6-way parallel exploration workflow (governance corpus, internal/orchestration/convergence docs, the `_LOCAL` master analysis, the normative `STANDARD.md` + its checks, on-disk structure of all 4 plugins, and external primary-standards research), synthesized into a grounding brief (current state + gaps + open decisions + external standards + roadmap seed).
- Conducted a clarifying dialogue and locked 13 decisions (see Decisions Made).
- Verified several load-bearing facts against source rather than memory: the tier model (Universal=Bronze / Convergent=Silver / Advanced=Gold), the 30-check spine (U1-U9, U11-U13, S1-S8, G1-G10; U10 no-dashes retired at v0.11 / ADR 0028; U13 added at v0.12), `library.json` shape including the `agent-targets` field, decision-record homes across repos, and cross-tool context-file reality.
- Verified the OpenAI Codex CLI plugin/marketplace/skills reality against live OpenAI docs (Codex genuinely has `codex plugin marketplace add`, agentskills.io-compatible skills, native `AGENTS.md`), and disambiguated it from the user's `codex` Claude Code plugin (a separate consumer tool).
- Authored the deliverable package via a 13-agent authoring workflow grounded in a shared locked-decision spine, then ran a consistency + dash + cross-reference review pass (returned `overallReady = true`).
- Applied the 3 cross-reference fixes the review flagged and confirmed the package is clean.
- Updated project memory (`family-standards-governance.md` + `MEMORY.md` index) with the v0.12 bump and the locked 13-decision set.

## Decisions Made

The 13 locked decisions (full ADR-ready records in `docs/internal/standards-plan-roadmap/03-decisions.md`):

- **D1 (deliverable: roadmap + ready-to-land drafts).** Significant. The effort produces a plan plus staged clause text in `docs/internal/standards-plan-roadmap/`; execution and the plugin audit are separate. Chosen over plan-only (too thin to act on later) and execute-now (the user wants decisions locked first).
- **D2 (rollout: Hybrid).** Architectural. PULL the Standard version pin (re-adoption involves judgment and the allocation-at-land invariant prevents parallel-session collisions); PUSH mechanical, judgment-free conventions (folder casing, shared CI, frontmatter keys, shim files) as orchestrated one-PR-per-repo campaigns with stop-and-flag. Pull-only leaves drift; push-heavy breaks allocation-at-land. The split mirrors the existing capability-vs-content line.
- **D3 (docs/internal kept).** Minor. No rename to `docs/_internal`; all four repos already use `docs/internal` and Pattern S already separates published (site/) from internal. This overrode the user's initial stated preference for `_internal` after I surfaced that renaming is pure fleet churn with no enforcement benefit.
- **D4 (decision homes).** Significant. Each repo records its own internal decisions as MADR 4.0 ADRs in `docs/internal/decisions/`; family-law ADRs live in `agent-plugins/standards/decisions/`; decisions never live in scratch. Triggered by the user's correct observation that a "decisions index" is distinct from MADR (an index is navigation; ADRs are the records) and that MADR belongs in `docs/internal/decisions/`. Convergence: wsc `adr/` -> `decisions/`, pm-skills `DECISIONS.md` -> ADRs + thin index.
- **D5 (dissolve _agent-context).** Architectural. Remove the `_agent-context/` directory concept entirely; session logs become gitignored `_local/session-logs/`; the committed agent-facing layer is root `AGENTS.md` + a thin `CLAUDE.md` shim + `docs/internal/`. Rationale: once decisions, plans, and orientation each have a home, nothing committed is left for `_agent-context/`; the name also collides with reserved namespaces (`agents/` = CC subagents, `.agents/` = Codex, `AGENTS.md` = the file). Principle: distill durable knowledge into its home, keep raw scratch ephemeral. Chosen over keep-committed and keep-gitignored. SUPERSEDES the earlier convention where this repo commits `_agent-context/session-logs/`.
- **D6 (casing).** Minor. `_local` lowercase everywhere (Windows is case-insensitive, so mixed `_LOCAL`/`_local` is a git case-collision footgun); `session-logs/` lowercase plural (resolves the SESSION-LOG / session-log / session-logs drift).
- **D7 (no new init/listing skill).** Significant. agent-plugins needs no scaffolding/init skill. Verification showed the toolkit already owns both halves: `askit-init-plugin` (internals) and `askit-init-marketplace` ("adding a plugin to a marketplace" + validate). agent-plugins owns only the contract (`CONTRIBUTING.md` L1-L6) and the CI gate. This corrected my earlier "add a thin listing skill" recommendation; the user's "I assume no" was right.
- **D8 (release subsystem, three layers).** Significant. PLAN = `docs/internal/release-plans/plan_vX.Y.Z/` with per-feature `spec.md` + `impl-plan.md` + a G0-G4-style checklist; EXECUTE = `askit-release` (exists) vs release-please (CI bot), decided in Phase 5; NOTES = curated Keep-a-Changelog + GitHub Release. Conventional Commits is the load-bearing prerequisite for any automation.
- **D9 (hooks).** Significant. Ratify the Claude Code hook exit-code contract (exit 0 stdout JSON; exit 2 stderr blocking), `${CLAUDE_PLUGIN_ROOT}` path references, `hookEventName` in JSON. Ship ONE canonical demonstrative hook: a commitlint `commit-msg` hook (a worked exemplar that also unblocks the release subsystem). The dash-ban stays a RECOMMENDED convention, NOT a mandated check, because v0.11 retired the U10 no-dashes check (re-mandating would contradict the Standard).
- **D10 (cross-tool / truth-in-targeting).** Architectural. `AGENTS.md` is the single canonical cross-tool context source with thin per-tool shims (never divergent copies); make `agent-targets` load-bearing (declare == emit == verify, else drop the target). Codex = SCOPE TO TRUTH: claim agentskills.io-skill + `AGENTS.md` portability (already true and free), defer native `.agents/plugins/` Codex packaging until a real Codex consumer exists. Chosen over deliver-now (speculative; no Codex consumers yet) and drop-codex (throws away free portability). Also fixes the `CLAUDE.md` shim drift on tfs + askit.
- **D11 (frontmatter).** Significant. One frontmatter schema per artifact type (skill / ADR / doc / spec): kebab-case keys, quoted version/date scalars, correct types, required keys CI-validated; agentskills.io caps (64-char name, 1024-char description) as the floor; Claude-Code-only fields quarantined as labeled extensions.
- **D12 (exceptions).** Significant. Tier ceiling is the primary mechanism; genuine per-clause exceptions MUST carry an ADR plus a machine-readable suppression the gate reads. No silent suppressions, so stop-and-flag fleet pushes never clobber deliberate exceptions and every exception stays auditable.
- **D13 (issues / effort / roadmap conventions).** Minor. Lowest urgency; codify after the structural P0/P1 work lands. Direction: MADR decisions + local-first markdown backlogs + the orchestration campaign-record (FC-NNNN ids).

Process decisions: selected brainstorming as the governing process skill; used parallel exploration + authoring workflows (ultracode) with a shared spine + adversarial read-back for consistency; chose to write the package into the existing `_LOCAL` (gitignored) per the user's requested location rather than the brainstorming default `docs/superpowers/specs/`.

## Files Changed

No files were committed (the session wrote to the working tree only). After the initial wrap, the package was moved out of gitignored `_LOCAL/` into the committed `docs/internal/standards-plan-roadmap/` (tracked location, untracked and ready to `git add`):

- **Created at `docs/internal/standards-plan-roadmap/` (14 files):** `00-README.md`, `01-current-state.md`, `02-roadmap.md`, `03-decisions.md`, `04-standards-definition.md`, and `drafts/{standard-amendments, contributing-edits, ci-repin-check, frontmatter-schemas, agents-md-and-context, release-subsystem, cross-tool-targeting, orchestration-campaigns, runner-consumption}.md`.
- **Updated (project memory, outside the repo):** `memory/family-standards-governance.md` (appended the v0.12 + locked-decision paragraph), `memory/MEMORY.md` (index line).
- **Harness artifacts:** two workflow scripts persisted under the session workflows dir (exploration + authoring); see Evidence Index.

## Verification

- [x] Package consistency review (workflow read-back of all 13 files): `overallReady = true`, 0 em/en dash violations, 0 placeholders/TODOs, 0 coverage gaps, all internal cross-references resolve. VERIFIED.
- [x] The 3 flagged cross-reference fixes applied (folder-layout clause Section 14 -> Section 10 in D4 + D5; "Section 0.11" -> "Standard v0.11" in standard-amendments.md). VERIFIED via successful edits.
- [x] Dash compliance. GUARANTEED by the repo PreToolUse hook (denies any Write containing U+2014/U+2013) and independently confirmed by the review agent.
- [x] Load-bearing facts grounded against source, not memory: Standard v0.12 header; 30-check spine; tier model; `agent-targets` field present in `library.json`; decision-record homes per repo; cross-tool context-file reality (AGENTS.md in all 4, CLAUDE.md in only 2). VERIFIED by authoring agents + my own reads.
- [x] OpenAI Codex CLI plugin/marketplace/skills reality. VERIFIED against live OpenAI docs (developers.openai.com/codex/plugins, /skills) via web search.
- [x] `_LOCAL/` (any casing) is gitignored on this Windows setup. VERIFIED via `git check-ignore`.
- [ ] NOT executed / explicitly assumed: the entire roadmap is plan-only. The Standard relocation (Phase 0), pm-skills `library.json` (Phase 1), the CI re-pin + truth-in-targeting check (Phase 2), the clause landings, and any Codex emitter are all UNBUILT. Provisional section/reqId numbers in the drafts (e.g. U14/U15, "Section 10") are placeholders, NOT reserved (allocation-at-land). Codex on-disk paths (`.agents/skills` vs `.codex/skills`, the marketplace manifest location) are flagged as MUST-reconfirm before any emitter.

## Outstanding Issues

- **Durability: resolved.** The package was moved out of gitignored `_LOCAL/` into the committed `docs/internal/standards-plan-roadmap/`, so it survives a clean checkout (untracked, ready to `git add`). Reconcile with the existing `docs/internal/program-roadmap.md` (02-roadmap.md is its detailed successor).
- **Phase 0 gating sub-decision (runner-consumption).** Once the runner relocates to `standards/checks/`, the four repos need a way to run it. Today only agent-skills-toolkit runs the full 30-check runner (self-validation); thinking-framework-skills ships a divergent/partial `check.mjs` (no `checks/` dir); pm-skills and writing-style-catalog run their own `validate-plugin` workflows, not the shared gate - so cross-repo enforcement is largely aspirational. The consumption model (recommended: a reusable GitHub Actions workflow) MUST be decided as part of Phase 0. See `docs/internal/standards-plan-roadmap/drafts/runner-consumption.md`.
- **Staleness risk.** The package's current-state facts are a 2026-06-17 snapshot. Pins and in-flight PRs may move (notably the writing-style-catalog `library.json` convergence PR #19 was open as of the audit). Re-verify before landing.
- **D5 irony.** This session log was written into `_agent-context/session-logs/` (the current committed convention). When D5 executes, migrate logs to `_local/session-logs/` and drop the `.gitignore` exception.
- **No surrounding-doc updates warranted.** Nothing user-facing changed and nothing is release-worthy, so README/CHANGELOG were not touched.

## What's Next

1. **User reviews the package** (read order: `00-README.md` -> `01-current-state.md` -> `02-roadmap.md` -> `03-decisions.md` -> `04-standards-definition.md` -> `drafts/`), flags any change; revise + re-run the consistency check if needed.
2. **Execute Phase 0 (truth and relocation)** when approved: move `STANDARD.md` + the 30 checks from `agent-skills-toolkit/` into `agent-plugins/standards/` (preserving GATE_PATH + folder-readme conventions), and sweep stale `0.8` refs (GOVERNANCE.md Section 4, ADR 0001) to a single `0.12` truth. Build an implementation plan (writing-plans skill) and/or run it through the GOVERNANCE land process.
3. **Phase 1:** in-repo pm-skills session - generated-manifest tooling, add `library.json` (pin 0.12), remove the embedded self-listing marketplace.
4. **Phase 2:** build the marketplace re-pin + truth-in-targeting CI check into `validate-registry` (advisory, then blocking once all four pass).
5. **Decide package durability** (commit it somewhere, or accept that it graduates piecemeal into `standards/`).

## Continuation Prompt

```
Resume the product-on-purpose standards standardization effort in the agent-plugins repo
(E:/Projects/product-on-purpose/agent-plugins, branch main).

CONTEXT (what happened last session):
A planning session locked 13 decisions and produced a roadmap + ready-to-land drafts
package at docs/internal/standards-plan-roadmap/ (committed, 14 files). This is
PLAN + lock-in only; execution and the per-plugin audit are deliberately separate efforts.
The family is NOT greenfield: it already has one normative Standard (agent-skills-toolkit/
STANDARD.md v0.12, a 30-check runner, tiers Universal=Bronze/Convergent=Silver/Advanced=Gold),
committed governance at agent-plugins/standards/ (GOVERNANCE.md amendment lifecycle + ADR
0001 canonical-home), a thin listing contract (CONTRIBUTING.md L1-L6), a graduated astro-sites
domain, and orchestration + convergence docs under docs/internal/. The job is consolidate /
complete / harden, not build.

START HERE: read docs/internal/standards-plan-roadmap/00-README.md (the package map), then
03-decisions.md (the 13 locked decisions D1-D13, authoritative) and 02-roadmap.md (the 6
phases). The drafts/ folder holds land-ready clause text.

THE 13 LOCKED DECISIONS (do not relitigate without cause):
D1 deliverable = roadmap + drafts (plan only). D2 rollout = Hybrid (PULL the Standard version
pin per-repo; PUSH mechanical conventions one-PR-per-repo + stop-and-flag). D3 keep docs/internal
(no _internal rename). D4 each repo's ADRs in docs/internal/decisions/ as MADR 4.0, family-law
ADRs in standards/decisions/. D5 DISSOLVE _agent-context entirely (session logs -> gitignored
_local/session-logs/; committed agent layer = root AGENTS.md + thin CLAUDE.md shim + docs/internal/).
D6 casing = _local lowercase, session-logs/ lowercase plural. D7 NO new init/listing skill
(toolkit owns askit-init-plugin + askit-init-marketplace; agent-plugins owns CONTRIBUTING.md
L1-L6 + the CI gate). D8 release subsystem 3 layers (PLAN release-plans/plan_vX.Y.Z/, EXECUTE
askit-release vs release-please decided Phase 5, NOTES curated CHANGELOG; Conventional Commits
prerequisite). D9 ratify hook exit-code contract + ship one commitlint commit-msg hook (dash-ban
stays RECOMMENDED, not a check). D10 cross-tool truth-in-targeting (agent-targets load-bearing:
declare == emit == verify) + Codex = SCOPE-TO-TRUTH (claim agentskills.io + AGENTS.md portability,
defer native .agents/plugins packaging until a real Codex consumer exists; fix CLAUDE.md shim
drift on tfs + askit). D11 one frontmatter schema per artifact type, CI-validated. D12 exceptions
= tier ceiling + ADR-backed machine-readable suppression (no silent suppressions). D13 issues/
effort/roadmap conventions deferred.

THE 6 PHASES: 0 truth+relocation (move STANDARD.md + 30 checks into standards/, sweep stale 0.8
refs to 0.12) -> 1 pm-skills library.json + drop embedded marketplace -> 2 CI re-pin + truth-in-
targeting check in validate-registry -> 3 scaffolding + dual-audience clauses (folder layout,
AGENTS.md/shim contract, frontmatter, release-plans; push mechanical parts) -> 4 consolidate CI
(shared astro-site.yml) + land Section 14 -> 5 process + hooks.

IMMEDIATE NEXT ACTION (pick one, ask the user if unsure):
(a) If the user has review feedback on the package, apply it and re-run the consistency check.
(b) Otherwise the natural first execution step is Phase 0 (truth and relocation): produce a
    detailed implementation plan (writing-plans skill) to move agent-skills-toolkit/STANDARD.md
    -> agent-plugins/standards/STANDARD.md and the checks -> standards/checks/, preserving the
    GATE_PATH and folder-readme conventions, then sweep stale 0.8 version refs (GOVERNANCE.md
    Section 4 and ADR 0001) to 0.12. Run it through the GOVERNANCE land process (one PR: text +
    version handling + one ADR). GATING SUB-DECISION for Phase 0: how the four repos run the
    relocated runner (today only agent-skills-toolkit runs the full runner; tfs ships a divergent
    partial; pm-skills + wsc run their own validate-plugin, so cross-repo enforcement is currently
    aspirational). Decide the consumption model (recommended: a reusable GitHub Actions workflow in
    product-on-purpose/.github that checks out standards/ at a pinned ref) as part of Phase 0 - see
    docs/internal/standards-plan-roadmap/drafts/runner-consumption.md.

GUARDRAILS: never use em-dashes or en-dashes (a repo PreToolUse hook blocks them; use " - ").
Reference IDs always carry a human-readable handle. agent-plugins main is PR-protected
(branch -> PR -> squash-merge, CI validate gates). Provisional section/reqId numbers in the
drafts are NOT reserved (allocation-at-land). Re-verify current-state facts (version pins,
open PRs) before landing - the package is a 2026-06-17 snapshot. The package is gitignored,
so decide whether to persist it durably.
```

## Evidence Index

- **Transcript:** this Claude Code session (project `E--Projects-product-on-purpose-agent-plugins`, session `441dd6df-97ab-4cb9-8a07-20d969d23935`).
- **Exploration workflow (run wf_a0b4f7be-dd8):** 6 parallel readers + synthesis; output at `tasks/wtn8d0etl.output`; script under `workflows/scripts/standards-landscape-map-*.js`.
- **Authoring workflow (run wf_a2c010c4-bc1):** 13 authoring agents + 1 consistency reviewer; output at `tasks/wiqqkn73o.output` (review: overallReady true, 0 dashes, 3 cross-ref fixes); script under `workflows/scripts/standards-roadmap-package-*.js`.
- **Source files read for grounding:** `agent-skills-toolkit/STANDARD.md` (v0.12), its `scripts/` checks + `library.json`; `agent-plugins/standards/{GOVERNANCE.md, README.md, decisions/0001}`, `CONTRIBUTING.md`, `docs/internal/{program-roadmap.md, orchestration/, convergence/}`, `.gitignore`, `.claude-plugin/marketplace.json`; the four plugins' on-disk structure.
- **External standards verified:** OpenAI Codex plugins/skills (developers.openai.com/codex/plugins, /skills); agentskills.io; Anthropic plugin + hooks references; RFC 8174; MADR 4.0; SemVer; Keep a Changelog; Conventional Commits; AGENTS.md; YAML 1.2.2.
- **Deliverable:** `docs/internal/standards-plan-roadmap/` (14 files, committed).
