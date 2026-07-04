---
title: "Program risk register"
description: Ranked risks across the standards program, each with evidence, likelihood, impact, mitigation, owner, and reopen trigger
status: "draft"
last-updated: "2026-07-03"
---

# Program risk register

This register operationalizes the locked planning package at [docs/internal/standards-plan-roadmap/](../standards-plan-roadmap/00-README.md). It does not restate decision rationale or clause text, and it allocates no new version, ADR, or section numbers (the allocation-at-land invariant lives in `standards/GOVERNANCE.md` Section 6). Risks are drawn from the lead audit synthesis and the family-repos and phase0-plans sub-audits, cross-checked where possible against live repo state. The durable home for the underlying evidence is [01-audit-2026-07-03.md](01-audit-2026-07-03.md); this register tracks the risks and their status, not the audit narrative.

Scope split per the maintainer's rulings from the 2026-07-03 session: R1 (scope: the full program is planned, this session executes only Lane A, the in-repo work) and R2 (cross-repo gate: anything touching another repo is a staged, approval-gated Lane B package). Risks below apply across both lanes. Lane A ([04-lane-a-plan.md](04-lane-a-plan.md)) can act on a risk once the maintainer's overall go is given; Lane B ([05-lane-b/](05-lane-b/)) requires a per-package go per R2 regardless of what this register recommends.

## How to read this register

- **Likelihood / Impact**: qualitative High, Medium, or Low, assessed as of 2026-07-03. Re-assess when the trigger fires, not on a fixed schedule.
- **Owner**: who acts when the trigger fires. Orchestrator means the agentic executor (Fable) acting under [11-agent-operations.md](11-agent-operations.md); Maintainer means a human decision or go is required; CI means the mechanism enforces itself once configured.
- **Ranking**: by combined likelihood and impact, most severe first, not by order of discovery in the source audits.
- **Reopen trigger**: the observable condition that means a risk needs a fresh look, not a status field that changes over time. This register does not track live status per risk; it is a durable reference, updated when a trigger actually fires.

## Summary

| ID | Risk | Likelihood | Impact | Owner |
|---|---|---|---|---|
| RK-1 | Stall decay: plans drift while frozen at the maintainer gate | High | High | Maintainer, Orchestrator |
| RK-2 | Draft-drift shipping wrong law into a landed amendment | High | High | Orchestrator, Maintainer |
| RK-3 | GOVERNANCE serialization gap (`strict:false`, `enforce_admins:false`) | Medium | High | CI, Maintainer |
| RK-4 | Never-run live-Actions two-checkout wiring (Phase 0) | Medium | High | CI, Orchestrator |
| RK-5 | Orchestration mechanism unproven before FC-0001 | High | Medium-High | Maintainer, Orchestrator |
| RK-6 | Autonomous-merge risk in Lane A | Low-Medium | Medium-High | Orchestrator, CI |
| RK-7 | writing-style-catalog drift and an undocumented shipped skill | High | Medium-High | Maintainer, Orchestrator |
| RK-8 | pm-skills release-race against its two P0 conformance holes | High | Medium | Maintainer, Orchestrator |
| RK-9 | thinking-framework-skills' Gold claim unverified at a stale ref | High | Medium | Maintainer, CI |
| RK-10 | Allocation-at-land collisions on ADR/version/section numbers | Low | Medium | CI, Orchestrator |
| RK-11 | Hook-denial retry loop for agents writing docs | Medium-High | Low | Orchestrator |

## Risk detail

### RK-1: Stall decay (plans drift while frozen)

Execution has sat at the maintainer authorization gate on PR-A (ship the org gate: the reusable `standards-gate.yml` workflow) since 2026-06-20. Every phase 0 through 5 is sequenced behind it, and the four family repos keep shipping and drifting during the freeze, so the frozen audit's pins, versions, and drift inventory decay daily even though no plan text is itself wrong.

- **Evidence**: 01-audit-2026-07-03.md; `REVIEW-AND-NEXT-STEPS.md`, unchanged since 2026-06-20.
- **Mitigation**: R1 (scope: Lane A executes now) converts the stall into bounded, immediately actionable in-repo work per [03-execution-plan.md](03-execution-plan.md); every Lane A step re-verifies live state rather than trusting the frozen snapshot. Lane B packages stay staged until their own per-package go per R2, so the freeze cannot silently extend past a bounded review window.
- **Reopen trigger**: any Lane A step finds a live fact (a pin, a line number, a file count) that contradicts the audit snapshot; or a Lane B package sits ungated past its own review horizon.

### RK-2: Draft-drift shipping wrong law

The staged clause drafts carry internal drift that would land incorrect normative text if pasted as-is: the D8 (release subsystem) PLAN-layer sits in Phase 5 per `release-subsystem.md` (which contradicts itself internally) but in Phase 3 per both authoritative sources; `standard-amendments.md` is missing the D16 (HISTORY.md policy) amendment text entirely; `contributing-edits.md` L7 still encodes the pre-D17 "codex = portability, not native packaging" definition that D17 (Codex = deliver) supersedes.

- **Evidence**: 01-audit-2026-07-03.md; `standards-plan-roadmap/drafts/release-subsystem.md`, `standard-amendments.md`, `contributing-edits.md`.
- **Mitigation**: a resolution pass over draft drift is a named prerequisite before any draft becomes a landed amendment: see LA-3 (draft-drift resolution pass) in [04-lane-a-plan.md](04-lane-a-plan.md), scoped to the Phase 3 amendment work Lane A owns. Residuals a resolution pass must specifically re-check: the D8 phase-placement conflict, the missing D16 clause text, and the stale pre-D17 Codex clause at `contributing-edits.md` L7.
- **Reopen trigger**: any Phase 3 amendment PR cites a `drafts/` file without first reconciling it against `02-roadmap.md` and `03-decisions.md`.

### RK-3: GOVERNANCE serialization gap

`GOVERNANCE.md` Section 6 claims branch protection's up-to-date-before-merge requirement mechanically enforces serialization of protected-branch amendments, but live protection was `strict:false`, so two concurrent amendments could collide on the next allocated version, ADR, or section number with no forced rebase. `enforce_admins:false` compounds it: the solo maintainer can bypass every gate, including this one.

- **Evidence**: 01-audit-2026-07-03.md; live branch protection settings on `agent-plugins` `main`.
- **Mitigation**: R6 (branch protection: flip `strict:true` on `agent-plugins` `main`) makes serialization mechanical going forward; `enforce_admins` stays `false` per R6 and is carried here as a documented residual risk rather than silently accepted. Numbers are always re-fetched against the protected head at merge time, never pre-baked.
- **Reopen trigger**: a protected-branch PR merges while another is mid-flight and both allocate a number; or the maintainer bypasses protection as an admin during a live amendment.

### RK-4: Never-run live-Actions two-checkout wiring

Phase 0's reusable-workflow design (PR-A ships `standards-gate.yml` in `product-on-purpose/.github`; PR-C's caller in `agent-skills-toolkit` sparse-checks out `agent-plugins/standards/checks/` to run it) has been validated only at the `node check.mjs` script layer via the D14 spike, never as a live GitHub Actions run end to end.

- **Evidence**: phase0-plans.md section 4, the confidence table (the one Medium item in an otherwise High-confidence plan); Recommendation R3 in the Phase 0 plan (a throwaway-caller test, named but not yet an executable task).
- **Mitigation**: run the Phase 0 plan's own Recommendation R3, a throwaway-caller live-Actions test, as an explicit task before wiring the real askit caller, closing the one gap the D14 spike left open. Task C-1 Step 3 gates all deletion on a real green run, so any failure surfaces loudly rather than silently. Staged as [05-lane-b/B1-pr-a-org-gate.md](05-lane-b/B1-pr-a-org-gate.md) and [05-lane-b/B2-pr-c-askit-readopt.md](05-lane-b/B2-pr-c-askit-readopt.md), both cross-repo and Lane B under R2.
- **Reopen trigger**: the throwaway-caller test fails, or Task C-1's real run on askit fails after PR-B has already merged.

### RK-5: Orchestration mechanism unproven before FC-0001

The dual-documentation, one-PR-per-repo fleet-campaign mechanism that Phase 3's push campaigns (C1-C5) and every Lane B package ultimately lean on has never been exercised. `docs/internal/orchestration/campaigns/` does not exist on disk, and FC-0001 (the first named fleet-orchestration pilot) was never run; the pilot candidate itself has drifted across three documents without reconciliation.

- **Evidence**: 01-audit-2026-07-03.md section 4 (unfinished threads); the fleet-orchestration-program memory note.
- **Mitigation**: require FC-0001 to run once, end to end, as a proof of concept before any larger campaign fans out; tracked as its own package at [05-lane-b/B4-fc-0001-and-phase-3.md](05-lane-b/B4-fc-0001-and-phase-3.md) so no other package assumes the mechanism validated-by-design. Does not block Lane A, which is single-repo and does not use the fleet mechanism.
- **Reopen trigger**: any Phase 3 campaign or Lane B package is proposed for execution before FC-0001 has run once end to end.

### RK-6: Autonomous-merge risk in Lane A

R5 (Lane A merges) authorizes the orchestrator to merge Lane A PRs autonomously, without a human approving each one, once the maintainer's overall go is given. Removing a human from the per-PR merge decision creates exposure to a defective merge landing on protected `main` unattended.

- **Evidence**: maintainer ruling R5 (2026-07-03 session); [03-execution-plan.md](03-execution-plan.md) gate sequencing.
- **Mitigation**: two independent gates precede every autonomous merge under R5: the `validate` CI check must be green, and a Codex adversarial review must run and be answered. Squash-merge keeps every Lane A change revertable in one commit if a defect surfaces post-merge; the allocation-at-land re-fetch (RK-3) still applies per PR. Contract detail lives in [11-agent-operations.md](11-agent-operations.md).
- **Reopen trigger**: a Codex review flags an unresolved finding and the merge proceeds anyway; or the `validate` gate is green but a post-merge defect surfaces, calling the gate's coverage into question.

### RK-7: writing-style-catalog drift and an undocumented shipped skill

The largest pin-to-working-tree drift of the four repos: the marketplace pin is `0.5.2` (sha `ce0aefe`) while the working tree is 12+ commits and a full minor ahead at `0.6.0`, unreleased. That gap includes a built, merged, `library.json`-registered skill (`entry-recommender`) with no `[0.6.0]` CHANGELOG entry and no session-log coverage across 21 commits and 3 releases. The repo also has live concurrent agent activity: a commit landed on `main` mid-audit.

- **Evidence**: family-repos.md section 3; 01-audit-2026-07-03.md section 3 risk 5.
- **Mitigation**: treat writing-style-catalog as a live-write hazard: re-verify current HEAD and CHANGELOG state at the moment of any touch rather than trusting this audit's snapshot. The `entry-recommender` go/no-go and CHANGELOG backfill are per-repo product decisions tracked in [10-backlog.md](10-backlog.md) as BL-16 (out-of-program register), not a Lane A action.
- **Reopen trigger**: another commit lands on writing-style-catalog `main` between this register's authoring and any subsequent package executing against it.

### RK-8: pm-skills release-race

The most active family repo (v2.27.0 to v2.29.1 in about five weeks) carries two persistent P0 conformance holes: no `library.json` anywhere (cannot pin any Standard, fails L3) and a retained embedded self-listing `marketplace.json` (fails L2). Both were flagged 2026-06-10 and have survived three releases untouched, because pm-skills runs a fully proprietary ~40-script validator that never invokes the toolkit's `check.mjs`.

- **Evidence**: family-repos.md section 1; 01-audit-2026-07-03.md section 3 risk 3.
- **Mitigation**: Phase 1 is a deliberate in-repo session (D7: no new scaffolding skill) because pm-skills' proprietary tooling and ~95-component count need repo-local work, not a mechanical push; sequencing it promptly after Phase 0 limits the window of further un-pinned releases. Staged as [05-lane-b/B3-phase-1-pm-skills.md](05-lane-b/B3-phase-1-pm-skills.md), cross-repo and Lane B under R2, out of this session's Lane A scope.
- **Reopen trigger**: pm-skills ships a release that adds new components without the manifest tooling in place, widening the component gap Phase 1 must close.

### RK-9: thinking-framework-skills' Gold claim unverified at a stale ref

`library.json` declares `standard: 0.8` and the repo self-describes as advanced (Gold) tier, but its conformance gate pins `agent-skills-toolkit` at ref `2f480d1` (2026-06-01), 67 commits stale against the toolkit's current HEAD (v1.6.0, Standard 0.12). The gate verifying the Gold claim predates roughly half the Gold check suite and all of U13 (skill registration).

- **Evidence**: family-repos.md section 2; 01-audit-2026-07-03.md section 3 risk 4.
- **Mitigation**: the re-pin ruling, thinking-framework-skills' own D2-pull cadence decision tracked in [08-decision-register.md](08-decision-register.md), needs to move the pinned ref forward to current toolkit HEAD and re-run the gate to confirm or correct the Gold claim; pull-based per D2 (Hybrid rollout), not a Lane A push.
- **Reopen trigger**: thinking-framework-skills ships another release still pinned at or near `2f480d1`, or an external party relies on the Gold claim before the gate refreshes.

### RK-10: Allocation-at-land collisions

GOVERNANCE.md requires ADR numbers, version bumps, and section numbers to be fetched against the protected `main` head at merge time and never pre-baked in a draft branch. Phase 0's own plan flags this live: the ADR number "currently 0002" must be re-verified at execution time, not assumed, and the same discipline recurs across every phase that lands a Standard amendment.

- **Evidence**: phase0-plans.md section 3, risk table row "Allocation-at-LAND collisions"; 01-audit-2026-07-03.md section 5.
- **Mitigation**: `strict:true` (R6, the same branch-protection flip as RK-3) forces a rebase before merge, so a stale allocation fails loudly at merge time instead of landing silently; every PR re-fetches its number against `origin/main` immediately before opening.
- **Reopen trigger**: two protected-branch PRs are open concurrently and both touch `standards/decisions/` or a version field.

### RK-11: Hook-denial retry loop for agents writing docs

Every Write or Edit in this environment is checked by a PreToolUse hook that denies any content containing an em-dash (U+2014) or en-dash (U+2013), enforced deterministically, not just by instruction. Program documents are long, LLM-authored, and produced by multiple orchestrated agents across Lane A and staged Lane B packages; any agent can reflexively emit a dash and hit repeated denials before producing a clean write, inflating turns and cost across a documentation-heavy phase.

- **Evidence**: this program's own writing-style rule (`~/.claude/CLAUDE.md`, enforced by `~/.claude/hooks/no-em-dashes.py`).
- **Mitigation**: every authoring agent restructures with a comma, colon, or sentence break, or uses " - " (space hyphen space), and treats the rule as retroactive on any file it touches; the hook is the enforcement backstop regardless of whether instructions are followed. Documented in [11-agent-operations.md](11-agent-operations.md).
- **Reopen trigger**: an agent hits three or more consecutive denials on the same file, indicating the constraint needs a prompt-level fix rather than a per-turn retry.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | Created. |
| 2026-07-03 | verifier fixes applied (lead-ruled) |
