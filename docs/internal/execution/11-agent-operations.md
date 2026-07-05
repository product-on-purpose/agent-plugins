---
title: "Agent Operations - the agentic execution contract"
description: "How agents run this program - the Fable/Opus/Sonnet/Codex orchestration architecture, model-selection rationale, kickoff-prompt shape, execution disciplines, living-docs protocol, the Codex adversarial-review protocol, and the human-vs-agent documentation map"
status: draft
last-updated: "2026-07-03"
---

# 11 - Agent Operations (the agentic execution contract)

This is the operating contract for the agents that run the standards program. It operationalizes the locked planning package at [../standards-plan-roadmap/00-README.md](../standards-plan-roadmap/00-README.md) and the fleet operating model at [../orchestration/guide.md](../orchestration/guide.md); it restates no decision rationale and invents no decisions. It exists to close the explicit done-definitions gap the audit named: the disciplines below - kickoff-prompt shape, stop-and-flag, no-silent-skips, verification-before-completion, the dual-documentation contract - are carried into every plan in this suite rather than re-derived per task ([01-audit-2026-07-03.md](01-audit-2026-07-03.md), gaps section). Every other execution doc ([04-lane-a-plan.md](04-lane-a-plan.md), [05-lane-b/B1-pr-a-org-gate.md](05-lane-b/B1-pr-a-org-gate.md) and its siblings) assumes this contract.

## Task Summary

> Agent-updated status block. Keep at the top; other agents update it as the program runs.

- **Status:** draft (planning; nothing executed yet)
- **Roles defined:** 4 (Fable lead, Opus subagents, Sonnet subagents, Codex CLI reviewer)
- **Codex review gates:** 3 classes (before every Lane A merge, before every LAND, at each phase boundary)
- **Disciplines carried from the roadmap:** 5 (dual documentation, no-silent-skips, stop-and-flag, verification-before-completion, gate-never-red)
- **Last updated:** 2026-07-03

## 1. Orchestration architecture (who does what)

Four distinct actors run the program, at three altitudes plus one external reviewer. The rule is altitude discipline: work is done by the cheapest actor whose capability fully covers it, and each actor's output is verified by a higher altitude before it is trusted.

| Actor | What it is | Does | Never does |
|---|---|---|---|
| **Fable (the lead orchestrator session)** | The single control session, running this model | Highest-level planning, writing subagent briefs, verifying returned work, final editing, and all merges | Mechanical fan-out it can delegate; any Lane B cross-repo fire without a maintainer go (R2 (cross-repo gate)) |
| **Opus subagents** | Dispatched deep-reasoning sessions | Complex authoring, adversarial verification of other agents' work, and synthesis across documents | Merge; approve their own output as done |
| **Sonnet subagents** | Dispatched mechanical sessions | Fan-out where the brief fully determines the output: sweeps, per-file edits, fixes, read-only audits | Judgment calls; resolve a conflict the brief did not anticipate (they stop-and-flag instead) |
| **Codex CLI (the external adversarial reviewer)** | OpenAI Codex CLI, invoked via the `codex` Claude Code plugin - NOT a Claude model | Adversarial review at defined gates (section 6) | Author or merge; its findings are advisory input, triaged by Fable |

Disambiguation, load-bearing because the name collides: "Codex" in this contract always means the OpenAI Codex CLI run through the `codex` Claude Code plugin as an independent second opinion. It is distinct from the D17 (Codex distribution) workstream, which is about emitting native `.codex-plugin` artifacts for the Codex *tool* ([05-lane-b/B7-codex-workstream.md](05-lane-b/B7-codex-workstream.md)). The reviewer is a process actor; the distribution work is a deliverable. They share a word and nothing else.

The verification chain runs upward: a Sonnet fan-out's output is checked against its brief before it is trusted (by an Opus verifier for anything load-bearing, else by Fable); an Opus authoring or synthesis pass is verified by Fable; and the whole PR is put in front of Codex before it merges (section 6). No actor is the sole judge of its own output. The read-only Astro audit is the proven shape - four audit agents plus four independent verifiers, each trying to disprove the other's load-bearing claims ([01-audit-2026-07-03.md](01-audit-2026-07-03.md)).

Fable is the only actor that merges. Under R5 (Lane A autonomous merges), after the maintainer's overall go, Fable merges a Lane A PR autonomously once the `validate` gate is green and a Codex adversarial review has been run and answered, via `gh pr merge --squash --admin` under the maintainer's admin identity (an admin override of the 1-approving-review rule, viable because `enforce_admins` is `false`). Under R2 (cross-repo gate), no Lane B package fires without the maintainer's per-package go, so no subagent and not Fable itself lands a cross-repo change on its own initiative.

## 2. Model-selection rationale (cost matched to judgment)

The altitude split is a cost-effectiveness rule, not a status hierarchy. Pick the lowest-cost actor whose capability covers the task:

- **Sonnet where the brief fully determines the output.** A casing rename, a frontmatter-key sweep, a stale-reference grep-and-replace, a read-only conformance audit against a fixed rubric - the answer is mechanical once the brief names the parameters. Sonnet does these at a fraction of the cost, and the brief's explicitness (section 3) is what makes the delegation safe.
- **Opus where judgment or cross-document reasoning is needed.** Authoring a plan that must reconcile the roadmap against live repo state, an adversarial verification pass that tries to disprove a load-bearing claim, or a synthesis that folds many inputs into one coherent view - these need reasoning the brief cannot pre-bake. Opus carries the judgment; the brief carries the constraints.
- **Fable only at the top.** Planning the shape of the work, writing the briefs, verifying returns, and merging are the irreducible lead-session functions. Fable does not spend its context on fan-out it can delegate; delegation is what keeps the lead's context clear for verification and sequencing.

The heuristic in one line: if a competent contractor could execute it from the written brief with no further questions, it is Sonnet-shaped; if it needs a decision the brief cannot make, it is Opus-shaped; if it decides what the briefs are, it is Fable.

## 3. The kickoff-prompt shape (the portable contract for a subagent)

Every subagent is dispatched with a self-contained brief in this fixed shape, so the agent needs nothing but the prompt to execute and return. This preserves the "independently dispatchable" packet format the orchestration program already proved ([../orchestration/guide.md](../orchestration/guide.md), section 6; the convergence packets). A brief that omits any of these is under-specified and must not be dispatched:

1. **Context pointer.** Exactly what to read first, in order, with absolute paths. Not "read the roadmap" but the specific files and sections. The agent reads these before acting.
2. **Exact file scope.** The precise path(s) the agent may write, and the boundary it must not cross (for Lane A, writes stay inside `agent-plugins`; for a fleet campaign sub-agent, writes stay inside its one assigned repo).
3. **Hard rules, inline.** The no-dash rule (never U+2014 or U+2013; use " - " or restructure), the ID-handle rule (every reference ID carries a human-readable handle on first use), the allocation-at-land invariant (never reserve a version, ADR, or section number in a draft), and the operationalize-not-restate rule (link the locked package; do not re-argue it).
4. **Verification expectation.** What the agent must run and observe before claiming done - the concrete command and the expected output (evidence before assertion; section 4). A brief that says "make it pass" without naming the check is defective.
5. **Return contract.** What the agent returns to Fable: a compact summary, the paths it wrote, any stop-and-flag, and any open question. For a sub-agent that opens a PR, the PR link and CI state. Never the full document body back into the lead's context.

The stop-and-flag clause is part of every judgment-bearing brief: if local state conflicts with the brief's assumption, the agent pauses and reports rather than applying a wrong assumption. This is the rule that caught the deliberately-retained ADR 0014 title in the Astro rollout ([../orchestration/guide.md](../orchestration/guide.md), section 4); it is mandatory, not optional politeness.

The shape as a skeleton (Fable fills the brackets per dispatch):

```
ROLE: You are a [Sonnet mechanical / Opus authoring] subagent for the standards program.
READ FIRST (in order): [absolute path #1], [absolute path #2, section N].
SCOPE: You may write ONLY [exact path(s)]. Do not touch anything outside [repo/dir].
HARD RULES: no U+2014/U+2013 (use " - " or restructure); every reference ID carries a
  human-readable handle on first use; never reserve a version/ADR/section number in a draft;
  operationalize the locked package, never restate its rationale.
STOP-AND-FLAG: if [named assumption] conflicts with the repo's own ADR/CHANGELOG, pause and
  report; do not apply.
VERIFY BEFORE DONE: run [exact command]; expect [exact output]. Quote it in your return.
RETURN: a compact summary (max N lines), the paths you wrote, any flag, any open question
  [+ PR link and CI state if you opened a PR]. Do not return the document body.
```

This skeleton is why a Sonnet dispatch is safe for mechanical work: the brackets, once filled, remove every decision from the agent, and the STOP-AND-FLAG line is the escape hatch for the one case the brief did not foresee.

## 4. Execution disciplines carried from the roadmap

These five disciplines come from the orchestration guide and the repo-health review; they are binding on every agent in this program, in every lane.

- **Dual documentation, joined by a stable id.** Intent lives once, centrally (the campaign spec + record under `docs/internal/orchestration/campaigns/<id>/`); each repo's own CHANGELOG/ADR records only local application and references the same `FC-NNNN` id. Neither side copies the other's reasoning. This prevents duplication drift, orphan local changes, and central-only diffs a repo's contributors cannot explain ([../orchestration/guide.md](../orchestration/guide.md), section 6).
- **No silent skips.** Any repo, file, or check excluded from a change is recorded with a reason in the campaign record or the plan's change log. A deferral is a documented decision, never an unremarked omission (the discipline visible throughout [../orchestration/guide.md](../orchestration/guide.md) and the repo-health deferred list).
- **Stop-and-flag on judgment changes.** An agent that would assert a value is "stale" or "wrong" first cross-checks that repo's own ADRs and CHANGELOG; if they conflict, it stops and reports. Orchestration amplifies both good changes and bad assumptions, so the safety valve is non-negotiable.
- **Verification before completion (evidence before claims).** No agent claims work is done, fixed, or passing without running the verification and observing the output. The brief names the command; the return quotes the evidence. "Should pass" is not "passes."
- **Gate never goes red.** The sequence is ordered so a required check is never left failing between steps. The load-bearing Phase 0 instance: never delete `agent-skills-toolkit`'s runner copy until its caller is green ([../standards-plan-roadmap/02-roadmap.md](../standards-plan-roadmap/02-roadmap.md)). Every plan sequences to keep the gate green throughout, not just at the end.

Two structural invariants sit alongside these and bind the same way: the PULL-vs-PUSH split (a Standard-version pin is always PULL, re-adopted per repo on its own cadence per D2 (Hybrid rollout); only judgment-free conventions are PUSH-orchestrated as fleet campaigns), and the ratification rule (no clause is ratified from a non-conforming exemplar, and none without a named enforcing check or an explicit aspirational label).

## 5. The living-docs update protocol

Every document in this suite is a living document: status starts `draft`, each carries a change log seeded 2026-07-03, and each is updated as the program runs rather than frozen at authoring. Who updates what, and when:

| Document | Updates when | Written / updated by |
|---|---|---|
| Per-plan Task Summary blocks ([02-prd.md](02-prd.md), this file, the lane plans) | A phase or package changes state | The agent executing that phase, verified by Fable |
| [09-risk-register.md](09-risk-register.md) | A risk is retired, realized, or newly surfaced (e.g. PR-A closing the live-Actions unknown) | The executing agent records; Fable confirms |
| [10-backlog.md](10-backlog.md) | A Codex finding is backlogged, or an item is opened/closed | Fable (section 6 triage) |
| [08-decision-register.md](08-decision-register.md) | A maintainer decision is ruled or a recommendation changes | Fable; the maintainer owns the ruling itself |
| Change log (every doc, bottom) | Any substantive edit to that doc | Whoever makes the edit, one row per change |

The rule of thumb: the agent that does the work updates the status surfaces of the doc it touched, and Fable is the integration point that keeps the control-panel view ([00-README.md](00-README.md), [EXEC-SUMMARY.md](EXEC-SUMMARY.md)) consistent with the per-plan detail. No agent silently advances a status without a change-log row and the evidence behind it.

## 6. The Codex adversarial-review protocol

Codex (the external reviewer of section 1) is run at three gate classes, and its findings are triaged deterministically so a review never silently stalls or silently overrides the plan.

**When it runs:**

- **Before every Lane A merge.** Per R5 (Lane A autonomous merges), Fable does not merge a Lane A PR until a Codex adversarial review has been run and every finding answered.
- **Before every LAND.** Any change entering the GOVERNANCE.md lifecycle (a Standard amendment, a new ADR) gets a Codex pass before it lands on the protected branch, so a wrong clause is caught before it becomes law.
- **At each phase boundary.** Crossing from one roadmap phase to the next triggers a review of the phase's cumulative result, before the next phase's briefs are cut.

**What Codex is given.** The review input is the change itself (the diff or the PR), the plan it is meant to satisfy (the relevant lane or Lane B package), and the invariants it must not violate (the disciplines of section 4 and the locked decisions it operationalizes). Codex is asked to disprove, not to praise: to find the wrong clause, the missed edge, the silent skip, the claim without evidence. Its value is that it does not share Fable's assumptions.

**How findings are triaged.** Every finding gets exactly one disposition, recorded, before the gate it guards is allowed to pass:

| Disposition | When | Where recorded |
|---|---|---|
| **Fix** | The finding is correct and in scope | Applied in the same PR; the fix references the finding |
| **Rebut with reasoning** | The finding is wrong or out of scope | A written rebuttal in the PR thread; the reasoning stands as the record |
| **Backlog** | The finding is valid but deliberately deferred | [10-backlog.md](10-backlog.md) section 3 (Codex findings), with a reason - a backlog is a documented decision, not a silent skip |

"Answered" means every finding has one of these three dispositions on the record. A finding is never left unaddressed; "no comment" is not a disposition. The two homes for the record are [10-backlog.md](10-backlog.md) section 3 (for deferred findings, the durable cross-review ledger) and the PR thread (for fixes and rebuttals tied to the specific change). This keeps Codex an adversarial input that strengthens the work without letting it either block silently or be ignored silently.

## 7. The human-vs-agent documentation map

The suite is written for two audiences with different jobs. Reading the wrong set wastes the maintainer's attention or leaves an agent under-briefed.

**What the maintainer reads (the control surfaces):**

- **[00-README.md](00-README.md) - the control panel.** The package map and current state; the single place to see where the program stands and what needs a decision.
- **[EXEC-SUMMARY.md](EXEC-SUMMARY.md)** - the one-screen synthesis for a status check without opening the plans.
- **[08-decision-register.md](08-decision-register.md)** - the decisions only the maintainer can make, each with a recommendation; this is the maintainer's action queue.
- **The Lane B approval packages ([05-lane-b/B1-pr-a-org-gate.md](05-lane-b/B1-pr-a-org-gate.md) through B7)** - read one at a time, when its per-package go is being requested (R2 (cross-repo gate)). Each is self-contained: manifest, verification, rollback, recommendation, and an approval checklist stating exactly what the go authorizes.

**What agents read (the execution briefs):**

- **This file (11)** - the operating contract every agent loads first.
- **[04-lane-a-plan.md](04-lane-a-plan.md)** - the autonomous in-repo lane's implementation plan.
- **[05-lane-b/B1-pr-a-org-gate.md](05-lane-b/B1-pr-a-org-gate.md) and siblings** - each package doubles as the exact execution plan the maintainer's go authorizes; the executing agent runs it step by step.
- **[03-execution-plan.md](03-execution-plan.md), [06-ci-plan.md](06-ci-plan.md), the release plan** - the sequencing and machinery an agent consults for how a phase fits the whole.

The maintainer *can* read any execution brief, and an agent *does* read the human surfaces for context; the map is about default attention, not access. The through-line: the maintainer reads to decide and to approve; the agent reads to execute and to verify. This file is the seam between them - it is how an agent knows what "done" means without asking, and how the maintainer knows the agents share one contract.

## Change log

| Date | Change |
|---|---|
| 2026-07-03 | created |
| 2026-07-03 | adversarial-panel fixes applied (lead-ruled) |
