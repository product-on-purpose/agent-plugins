---
title: "Execution package - package map"
description: "Entry point and file map for the standards program execution package, the operational companion to standards-plan-roadmap"
status: "draft"
last-updated: "2026-07-03"
---

# Execution package - Package Map

This package is the **execution product** for the standards program: the operational companion to the locked planning package at [`../standards-plan-roadmap/`](../standards-plan-roadmap/00-README.md). That package is the law and the plan (17 locked decisions, six phases, staged drafts); this package is how the program actually gets delivered - the requirements, the two-lane execution model, the per-package approval gates, the CI and release choreography, and the registers that stay live throughout execution.

It was created 2026-07-03 from a full multi-agent audit of the repo, the family, and the session history (committed here as [`01-audit-2026-07-03.md`](01-audit-2026-07-03.md)), under seven maintainer rulings R1-R7 recorded in [`08-decision-register.md`](08-decision-register.md).

**This package operationalizes; it never duplicates.** Decision rationale lives in [`../standards-plan-roadmap/03-decisions.md`](../standards-plan-roadmap/03-decisions.md); clause text lives in the drafts; nothing here allocates a version, ADR, or section number (the allocation-at-land invariant).

## The two lanes in one paragraph

Everything in the program splits by a mechanical property: does the change write inside `agent-plugins`, or anywhere else? **Lane A** (writes only in this repo) executes autonomously after the maintainer's go: each PR runs the validate gate plus a Codex adversarial review, then squash-merges (R5 (Lane A autonomous merges)). **Lane B** (anything cross-repo, including the org `.github` repo) is staged as seven ready-to-fire approval packages, B1-B7; nothing in Lane B executes without a per-package maintainer go (R2 (cross-repo gate)).

## Files in this package

Suggested reading order for the maintainer: this file, then `EXEC-SUMMARY.md`, then `08-decision-register.md`, then the Lane B package you are asked to approve next.

| Order | File | What it covers |
|---|---|---|
| 1 | `00-README.md` | This file. Package map and how to use the package. |
| 2 | [`EXEC-SUMMARY.md`](EXEC-SUMMARY.md) | The executive summary: what will happen on "go", what waits for you, the risk picture. |
| 3 | [`01-audit-2026-07-03.md`](01-audit-2026-07-03.md) | The committed audit record: verified state, execution inventory, ranked risks, unfinished threads. |
| 4 | [`02-prd.md`](02-prd.md) | Product requirements: outcomes, success metrics, phase requirements, scope rulings, constraints. |
| 5 | [`03-execution-plan.md`](03-execution-plan.md) | The two-lane model, the sequencing DAG, the gates, the living-docs protocol, stop-and-flag rules. |
| 6 | [`04-lane-a-plan.md`](04-lane-a-plan.md) | The executable Lane A implementation plan: tasks LA-1 through LA-8 with verification and rollback. |
| 7 | [`05-lane-b/`](05-lane-b/B1-pr-a-org-gate.md) | The seven approval packages: B1 (PR-A org gate), B2 (PR-C askit re-adopt), B3 (Phase 1 pm-skills), B4 (FC-0001 pilot and Phase 3), B5 (Phase 4 CI and Section 14), B6 (Phase 5 process and hooks), B7 (Codex workstream). |
| 8 | [`06-ci-plan.md`](06-ci-plan.md) | CI evolution: what each repo's CI enforces now, per phase exit, check rollout, branch protection. |
| 9 | [`07-release-plan.md`](07-release-plan.md) | The version surfaces and per-landing release choreography (D8 (release subsystem) PLAN layer). |
| 10 | [`08-decision-register.md`](08-decision-register.md) | Maintainer decisions: R1-R7 ruled 2026-07-03, plus the open DR items with recommendations. |
| 11 | [`09-risk-register.md`](09-risk-register.md) | Ranked risks RK-1 onward with mitigations, owners, and reopen triggers. |
| 12 | [`10-backlog.md`](10-backlog.md) | In-program backlog, out-of-program per-repo items, and the Codex-review findings ledger. |
| 13 | [`11-agent-operations.md`](11-agent-operations.md) | The agentic execution contract: roles (Fable lead, Opus, Sonnet, Codex CLI), kickoff prompts, disciplines. |

## How to use this package

- **You are the gate.** Lane A runs on one overall go; every Lane B package carries its own approval checklist stating exactly what your go authorizes. Read [`08-decision-register.md`](08-decision-register.md) for what is ruled and what still needs you.
- **Agents start at** [`11-agent-operations.md`](11-agent-operations.md), then the plan that names their task ([`04-lane-a-plan.md`](04-lane-a-plan.md) or a `05-lane-b/` package).
- **These are living documents.** Statuses, registers, and change logs update at every landing per the protocol in [`03-execution-plan.md`](03-execution-plan.md). The `standards-plan-roadmap` package stays frozen as the planning record; this package is where execution state lives.
- **Writing rules bind every file**: no em-dashes or en-dashes anywhere, and reference IDs carry a human-readable handle on first use.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
