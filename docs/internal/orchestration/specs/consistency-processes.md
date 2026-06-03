# Spec: consistent processes

> Shared release, review, decision-record, and documentation processes across the family, so the *way* work happens is as consistent as the artifacts it produces. Status: DRAFT / PROPOSED (2026-06-02). Backlog epic E5.

## 1. Goal

The same operating rituals in every repo: how a release ships, how a change is reviewed, where decisions are recorded, and how documentation is split (the dual-doc model). Some of this is already strong in one repo (pm-skills) and should become the family reference; some is drift to converge.

## 2. The processes to standardize

### 2a. Release

- **Reference**: the pm-skills `pm-release-conductor` (six gates G0-G4 with confirmation pauses) + `pm-skill-auditor` + `pm-changelog-curator`.
- **Target**: a shared release runbook (gates, the SHA-capture discipline, CHANGELOG-vs-RELEASE-NOTES split per `STANDARD.md` 10.6), adopted per repo at its own cadence. Release is judgment-heavy and version-specific, so this is codify-and-adopt, not blind fan-out.

### 2b. Review

- **Reference**: the adversarial multi-agent review the Astro rollout used (N reviewers per dimension, each finding handed to an independent refuter before action), plus `crit` and the cross-LLM `jp-ai-review` flow.
- **Target**: a named review standard - when to run adversarial review (major features, conformance work, pre-merge of broad prose), the refute-before-action discipline, and the diverse-lens (not N-identical) shape. The rollout's review-findings docs are the worked examples.

### 2c. Decision records (ADRs) and backlog

- **Reference**: MADR ADRs in `docs/internal/decisions/`, immutable once accepted (`STANDARD.md` 10.4); `docs/internal/backlog/`.
- **Drift**: writing-style-catalog uses `docs/internal/adr/`; numbering gaps exist. (Tracked also under E2 folder structure.)
- **Target**: one decision home + format fleet-wide; the allocation-at-land discipline (numbers taken on the protected branch) from GOVERNANCE applied to plugin ADRs too.

### 2d. Rollout packets and fleet campaigns

- **Reference**: the Astro per-repo packets (Level-1 specs) + the fleet-change campaign format (Level-2).
- **Target**: these become the standard way a cross-repo change is specced and tracked (the [orchestration capability](orchestration-capability.md)).

### 2e. Dual documentation (the convention)

- The [guide](../guide.md) Section 6 model becomes a process clause: every cross-repo change has a **campaign id**; intent lives once centrally; each repo's CHANGELOG/ADR references the id and records only local application; neither side copies the other. This is the decouple-and-pin discipline applied to *documentation*.

## 3. Plan

1. **E5.1** Codify the shared release runbook (graduate the pm-skills model into a `standards/` process doc); adopt per repo.
2. **E5.2** Codify the review standard (the adversarial + cross-LLM model); name when it is required by tier.
3. **E5.3** Converge ADR home/format (mechanical fleet change for the location; per-repo for content) and apply allocation-at-land.
4. **E5.4** Adopt the dual-documentation convention as a process clause and use it in every campaign from here on.

## 4. Acceptance

- A committed shared release runbook + review standard, referenced (not copied) by each repo.
- One ADR home/format fleet-wide; the dual-doc convention in use on the first real campaign.

## 5. Dual documentation

Central: this spec + the runbook/review/ADR clauses + each campaign record. Local: each repo's release notes, ADRs, and CHANGELOG, referencing the central clauses and campaign ids by version/id. Process law defined once; repos pin it.

## 6. Open questions

- How much of the pm-skills release machinery (sub-agents, skills) is portable to repos without those components vs reference-only?
- Tier-gating: which processes are MUST at which conformance tier (review coverage already scales by tier in `STANDARD.md` 8.3).
- ADR migration order for `adr/` -> `decisions/` (shared with E2).
