---
title: "Standards Program Delivery - Product Requirements"
description: "Outcomes, success metrics, and phase-mapped requirements for delivering the governed, CI-enforced, converged Product on Purpose plugin family"
status: draft
last-updated: "2026-07-03"
doc-type: prd
---

# PRD: Standards Program Delivery

This is the product requirements document for delivering the Product on Purpose standards program. It operationalizes the locked planning package at [../standards-plan-roadmap/00-README.md](../standards-plan-roadmap/00-README.md); it restates no decision rationale and invents no decisions. It absorbs the outcome framing of the older [../program-roadmap.md](../program-roadmap.md) (which the standards package dropped) and records the ruling that reconciles the two. The how-to-execute lives in [03-execution-plan.md](03-execution-plan.md) and the lane plans; this document defines **what** the program delivers and **how we know it is done**.

## Task Summary

> Agent-updated status block. Keep at the top; other agents update it as phases land.

- **Status:** draft (planning; nothing landed through GOVERNANCE.md)
- **Product:** a governed, CI-enforced, converged four-member plugin family served from one normative Standard
- **Requirements:** 10 (R-CTX + 6 phase requirements + R-CX Codex + 2 cross-cutting)
- **Success metrics:** 8 measurable (see Outcomes)
- **Open questions:** 3 (OQ-5 release executor, thinking-framework-skills re-pin cadence, enforce_admins residual)
- **Last updated:** 2026-07-03

## Purpose

The family is four sibling plugins (`agent-skills-toolkit`, `pm-skills`, `thinking-framework-skills`, `writing-style-catalog`) listed in one marketplace (`agent-plugins`). Left alone, "four plugins become four dialects" [S3]. The product is the fix: one normative Standard served from the neutral `agent-plugins` repo, four members pinned and passing, a machine-enforced listing contract, working release and orchestration subsystems, and native Codex distribution. The controlling design idea is decouple-and-pin (one normative copy of the law; everyone else references it by a pinned identifier) [S3].

## Context and problem

The system is roughly 70 percent built; this is alignment work, not a rescue [S3]. The hard pieces exist - a versioned Standard (v0.12, 30-check spine), a governance lifecycle, a thin listing contract, a graduated site domain, an orchestration model, four written convergence packets. What remains is formalization, consolidation of duplicated machinery, and bringing the two version-pin laggards into governance [S3][S4].

Two problems make this urgent, not optional:

1. **The stall-decay finding.** Execution has been frozen at a single maintainer authorization gate for roughly two weeks; the one named next action (ship the reusable gate) has been unauthorized since 2026-06-20, and every downstream phase is sequenced behind it. During the freeze the four repos kept shipping and drifting further from the pins and versions the frozen plan assumes. The dominant liability is stall, not design debt [S6].
2. **Enforcement is aspirational today.** Only `agent-skills-toolkit` runs the full runner, and only as self-validation; "the family is gated to the Standard" is a claim, not a CI fact [S3]. Two genuine P0 holes persist in `pm-skills` across three releases (no `library.json`, retained embedded self-listing marketplace) [S4][S6].

## Users and actors

- **The maintainer** (solo). Owns every governance LAND and every cross-repo go. Needs the program to move without a second reviewer while keeping allocation-at-land collision-safety intact. All Lane B fires are gated on this actor per R2 (cross-repo gate).
- **Agents operating the repos** (this execution program's autonomous lane, fleet campaign sub-agents, per-repo convergence sessions). Need explicit "done" definitions, a stop-and-flag contract, and no silent skips; the agent contract lives in [11-agent-operations.md](11-agent-operations.md).
- **Plugin consumers** (Claude Code and Codex CLI users installing from the marketplace). Need honest tier declarations, a listing they can trust, and native artifacts that install on their tool. Truth-in-targeting (D10) and Codex distribution (D17) serve this actor.

## Outcomes and success metrics

The program is done when all three pillars from [S5] plus Codex reach their end state. Each outcome carries a measurable metric; the phase that delivers it references its exit gate in [S1] rather than restating it.

| Outcome (pillar) | Measurable success metric | Delivered by |
|---|---|---|
| **Governance** - one Standard, one home, pinned by all | All four members carry a root `library.json` and are able to pin Standard `>= 0.12`; actual re-pins by thinking-framework-skills and writing-style-catalog follow D2 (Hybrid rollout) PULL cadence, tracked as DR-7 (tfs re-pin cadence) in [08-decision-register.md](08-decision-register.md) and BL-18 (thinking-framework-skills pin burndown) in [10-backlog.md](10-backlog.md) | P1 exit [S1], P0 relocation |
| **Governance** - listing conformance is CI fact, not review | Re-pin conformance check (check 8) is blocking and green 4/4; CONTRIBUTING.md L3 (pin-the-Standard clause) machine-enforced | P2 exit [S1] |
| **Cross-tool** - declared targets are delivered targets | Truth-in-targeting (check 9, D10) is blocking; no plugin declares an `agent-targets` entry it does not emit + shim | P4 exit [S1] |
| **Governance** - exceptions are auditable | Zero silent suppressions; every below-ceiling exception carries an ADR plus a machine-readable suppression the gate honors (D12) | P5 exit [S1] |
| **Sites** - the site standard is law | Section 14 is normative (a MUST), ratified only after the shared workflow proves convergence | P4 exit [S1] |
| **Sites** - one workflow, not four copies | One shared astro CI workflow serves all four sites with the preset extracted | P4 exit [S1] |
| **Orchestration** - cross-repo change is proven | The FC campaign mechanism is exercised at least once (FC-0001) before the larger Phase 3 campaigns fan out | P3 / FC-0001 [S6] |
| **Codex** - native distribution round-trips | Codex artifacts (`.codex-plugin/plugin.json` per plugin, `.agents/plugins/marketplace.json`) emit and pass a round-trip test (`codex plugin marketplace add` then `codex plugin add`) | Codex workstream (D17) [S1] |

## Scope

**In scope:** the full six-phase program plus the Codex workstream, delivered under a two-lane execution model.

- **R1 (in-repo scope):** the full program is planned, but THIS execution session performs writes only inside `agent-plugins` (Lane A). Lane A mechanics are in [04-lane-a-plan.md](04-lane-a-plan.md).
- **R2 (cross-repo gate):** anything touching another repo - including `product-on-purpose/.github` and any family member - is a staged, approval-gated Lane B package carrying a recommendation. Nothing fires without the maintainer's per-package go. The packages are [B1 (PR-A org gate)](05-lane-b/B1-pr-a-org-gate.md), [B2 (PR-C askit re-adopt)](05-lane-b/B2-pr-c-askit-readopt.md), [B3 (Phase 1 pm-skills)](05-lane-b/B3-phase-1-pm-skills.md), [B4 (FC-0001 and Phase 3)](05-lane-b/B4-fc-0001-and-phase-3.md), [B5 (Phase 4 CI and Section 14)](05-lane-b/B5-phase-4-ci-and-section-14.md), [B6 (Phase 5 process hooks)](05-lane-b/B6-phase-5-process-hooks.md), and [B7 (Codex workstream)](05-lane-b/B7-codex-workstream.md).

## Non-goals (out of scope)

These are real, tracked, and deliberately not in the program's critical path. They route to [10-backlog.md](10-backlog.md) as per-repo product decisions, each the owning repo's own call:

- **pm-skills #136** (release-please spike) - low priority, per-repo EXECUTE-engine exploration [S6].
- **pm-skills #148** (`awesome-codex-plugins` listing) - gated on a third-party scanner dependency [S6].
- **writing-style-catalog `entry-recommender` go/no-go** - a manual `draft` -> `committed` frontmatter flip on a shipped-but-undocumented skill [S6].
- **`pm-skills-mcp` scoping** - open since the 2026-05-20 session log, no program dependency [S6].

The Standard version is never bumped by this program to force adoption; per D2 (Hybrid rollout) the pin is always PULL [S2]. Phase 0 is structural: no Standard version bump (R3 (version ruling); 0.13 stays reserved for the U13 skill-registration burndown).

## Requirements

Each requirement names its exit by reference to [S1]; the acceptance criterion adds the program-level measurable, it does not re-derive the roadmap.

**R-CTX (absorb the outcome framing).** The PRD carries the three-pillar outcome model (governance, sites, orchestration) that the standards package dropped, plus Codex as a fourth outcome area.
- **AC-CTX-1:** the Outcomes table maps every pillar in [S5] to a measurable metric and a delivering phase. [S5]
- **AC-CTX-2:** the reconciliation ruling (below) is recorded and `program-roadmap.md` is marked superseded by Lane A with a pointer here. [S6][S7]

**R-P0 (truth and relocation).** The Standard and its 30-check runner live under `standards/`, internally consistent, gate green.
- **AC-P0-1:** the Phase 0 exit gate in [S1] (Phase 0 - Truth and relocation) is met at a real GitHub Actions run; the runner grades `agent-skills-toolkit` green from the relocated path. [S1][S6]
- **AC-P0-2:** no source cites Standard `0.8` or the wrong repo name; the `writing-style-library` / `writing-style-catalog` name drift resolves to one canonical name recorded on land. [S6]

**R-P1 (close the pm-skills P0 holes).** `pm-skills` can pin the Standard and passes Universal.
- **AC-P1-1:** the Phase 1 exit gate in [S1] is met; `pm-skills` carries a root `library.json` (Standard `0.12`; tier per the open DR-10 (pm-skills tier) ruling in [08-decision-register.md](08-decision-register.md), recommended universal-now), ships no embedded marketplace, passes Universal at its pinned commit. This refines the roadmap's convergent-tier exit-gate wording rather than contradicting it. [S1][S4]
- **AC-P1-2:** all four members can now pin the Standard `>= 0.12` (the governance success metric). [S6]

**R-P2 (CI keystone).** Listing conformance is CI-enforced.
- **AC-P2-1:** the Phase 2 exit gate in [S1] is met; check 8 (re-pin conformance) is blocking with 4/4 green and check 9 (truth-in-targeting) runs advisory. [S1]
- **AC-P2-2:** the registry surfaces `standard` and `tier` per plugin; CONTRIBUTING.md L3 (pin-the-Standard clause) is machine-enforced, not review-only. [S4][S6]

**R-P3 (scaffolding and dual-audience).** One coordinated Standard amendment plus mechanical fleet pushes.
- **AC-P3-1:** the Phase 3 exit gate in [S1] is met; CI validates one frontmatter schema per artifact type [S8-schema], and the casing rename, `adr/` -> `decisions/`, and missing CLAUDE.md shims are pushed one-PR-per-repo. [S1][S8-schema]
- **AC-P3-2:** the D8 (release subsystem) PLAN layer lands in Phase 3, not Phase 5 (the corrected draft-drift placement). [S1][S6]

**R-P4 (consolidate CI, graduate Section 14).** One shared workflow; Section 14 normative.
- **AC-P4-1:** the Phase 4 exit gate in [S1] is met; one shared astro CI workflow replaces the four duplicated guard copies with the preset extracted, and Section 14 is normative. [S1]
- **AC-P4-2:** the HISTORY.md-presence check (D16, warn-then-error, new/changed components only) and the frontmatter-tier check are live; truth-in-targeting flips to blocking. [S1][S2]

**R-P5 (process and hooks).** Release subsystem, hooks contract, exceptions, conventions.
- **AC-P5-1:** the Phase 5 exit gate in [S1] is met; the release subsystem is operational with Conventional Commits enforced by the commitlint hook, and the executor is chosen per repo (OQ-5). [S1][S7]
- **AC-P5-2:** the exception rule is live with zero silent suppressions (ADR plus honored machine-readable suppression per D12). [S1][S2]

**R-CX (Codex distribution).** Native codex packaging, emitted and gate-verified.
- **AC-CX-1:** each plugin emits `.codex-plugin/plugin.json` and `agent-plugins` emits `.agents/plugins/marketplace.json` with the confirmed schema `{name, source, policy, category}`; a round-trip test passes. Scope is skills + MCP only. [S1][S2]

**R-GOV (governance enforcement).** The serialization GOVERNANCE.md depends on is mechanical, not aspirational.
- **AC-GOV-1:** branch protection on `agent-plugins` `main` flips `strict:true` (required-status-checks up-to-date) so allocation-at-land is enforced; `enforce_admins` stays `false` and is recorded as a documented residual risk (R6). [S6][S8]

**R-DRIFT (family drift monitoring).** The deferred drift items become tracked deliverables.
- **AC-DRIFT-1:** a pin-currency policy, re-pin automation spec, and the registry `standard`/`tier` surfacing are each tracked in [10-backlog.md](10-backlog.md) with a recommended owner and a one-line acceptance criterion, not an open deferral. [S6]

## Constraints

- **The 17 locked decisions (D1-D17) are binding law** as recorded in [S2]; this PRD consumes them and adds none. Load-bearing handles used above: D2 (Hybrid rollout, pin is PULL), D5 (dissolve `_agent-context`), D8 (release subsystem), D10 (truth-in-targeting), D12 (exceptions, no silent suppressions), D14 (runner-consumption = reusable workflow), D15 (tiered warn-first enforcement), D16 (HISTORY.md amend-and-grandfather), D17 (Codex deliver).
- **The GOVERNANCE.md lifecycle** (EXPAND -> PROPOSE -> REVIEW -> LAND -> RE-ADOPT) governs every Standard change; no clause lands outside it [S8].
- **Allocation-at-land invariant:** the Standard version, ADR number, and section number are allocated only at LAND on the protected branch, never reserved in a draft [S8]. This PRD allocates no numbers.
- **The family writing rule:** no em-dashes or en-dashes anywhere; use " - " or restructure. Applies to every artifact this program produces.
- **Sequencing invariants** [S1]: no clause is ratified from a non-conforming exemplar; no clause is ratified without a named enforcing check or an explicit aspirational label.

## The program-roadmap.md reconciliation ruling

OQ-7 (two live roadmaps) is resolved here. [../program-roadmap.md](../program-roadmap.md) and the standards-plan-roadmap package have run live in parallel, mutually addressable and neither marked superseded, disagreeing on Standard version, registry snapshots, and orchestration epics [S6][S7]. **Ruling:** this PRD absorbs `program-roadmap.md`'s unique outcome framing (governance / sites / orchestration mapped to outcomes) into the Outcomes section, so nothing is lost; and Lane A marks `program-roadmap.md` superseded with a pointer to this PRD. It becomes historical context, not a live plan.

## Sources and evidence

| id | Source | Credibility |
|---|---|---|
| S1 | [../standards-plan-roadmap/02-roadmap.md](../standards-plan-roadmap/02-roadmap.md) - six phases, per-phase exit gates | A (committed plan) |
| S2 | [../standards-plan-roadmap/03-decisions.md](../standards-plan-roadmap/03-decisions.md) - the 17 locked decisions | A |
| S3 | [../standards-plan-roadmap/OVERVIEW.md](../standards-plan-roadmap/OVERVIEW.md) - system narrative, decouple-and-pin | A |
| S4 | [../standards-plan-roadmap/06-tier-requirements.md](../standards-plan-roadmap/06-tier-requirements.md) - tier spine, per-repo standing | B (askit pin prose stale; see Open questions) |
| S5 | [../program-roadmap.md](../program-roadmap.md) - three-pillar outcome framing | B (superseded; framing absorbed) |
| S6 | [01-audit-2026-07-03.md](01-audit-2026-07-03.md) - committed audit record (stall-decay, current state) | A |
| S7 | [../standards-plan-roadmap/05-open-questions.md](../standards-plan-roadmap/05-open-questions.md) - OQ-5, OQ-7 | A |
| S8 | [../../../standards/GOVERNANCE.md](../../../standards/GOVERNANCE.md) - amendment lifecycle, allocation-at-land | A |
| S8-schema | [../standards-plan-roadmap/drafts/frontmatter-schemas.md](../standards-plan-roadmap/drafts/frontmatter-schemas.md) - D11 one-schema-per-artifact-type | B (staged draft) |

## Open questions

- **OQ-5 (release executor):** release-please vs repositioned `askit-release`, recorded per leaf repo as a MADR ADR at Phase 5 [S7]. Recommendation and register entry live in [08-decision-register.md](08-decision-register.md).
- **thinking-framework-skills re-pin cadence:** whether and when to burn down the ~81 warns and move off Standard 0.8 - the repo's own D2-pull decision [S6].
- **`enforce_admins` residual:** left `false` per R6; a solo maintainer can bypass gates. Tracked as a documented residual in [09-risk-register.md](09-risk-register.md), not closed here.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
| 2026-07-03 | verifier fixes applied (lead-ruled) |
