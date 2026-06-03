# Fleet orchestration

> How the Product on Purpose family makes consistent changes across its plugin repos from one neutral control point (this repo, `agent-plugins`), and the consistency standards those changes carry. This directory is the **operating model and program backlog** for fleet work; it complements [`standards/`](../../standards/) (the plugin-facing law) and [`docs/internal/audits/`](../audits/) (point-in-time conformance evidence).
>
> Status: DRAFT (2026-06-02). Seeded from the Astro site rollout, which proved the model end to end (one standard authored here, four repos converged, learnings folded back). These docs generalize that experience into a repeatable capability.

## What this is

The family is four independently-released plugin repos (`pm-skills`, `thinking-framework-skills`, `agent-skills-toolkit`, `writing-style-catalog`) plus this neutral marketplace/standards repo. Many changes we want are **uniform**: the same edit, the same intent, applied to all four for consistency (a CI step, a folder convention, a favicon, a formatting rule). Running those four times in four separate sessions is repetitive and lets the four interpretations drift. **Fleet orchestration** is the discipline of authoring and driving such changes from one place while still landing one independent PR per repo.

## Reading order

1. [`guide.md`](guide.md) - the concepts: the levels of orchestration, the decision rule for when to use it, how it works concretely in Claude Code, and the **dual-documentation model** (where docs live: per-repo/PR vs here). Start here to learn the model.
2. [`backlog.md`](backlog.md) - the prioritized program: the orchestration capability plus the four consistency initiatives (folder structure, CI, page formatting, processes), each with status and a link to its spec.
3. [`specs/`](specs/) - the specs and phased implementation plans:
   - [`orchestration-capability.md`](specs/orchestration-capability.md) - the mechanism itself (the fleet-change spec format, the orchestrator pattern, pilot-then-fan-out).
   - [`consistency-folder-structure.md`](specs/consistency-folder-structure.md)
   - [`consistency-ci.md`](specs/consistency-ci.md)
   - [`consistency-page-formatting.md`](specs/consistency-page-formatting.md)
   - [`consistency-processes.md`](specs/consistency-processes.md)

## Two distinct things (do not conflate)

| Thing | What it is | Home | Becomes law? |
|---|---|---|---|
| **Orchestration capability** | The *mechanism* for driving a change across repos from one place | `docs/internal/orchestration/` (here) | No - internal operating process |
| **Consistency standards** | The *content* the mechanism carries (folder layout, CI shape, formatting, process) | Drafted here, **graduate** to [`standards/domains/`](../../standards/) once proven | Yes - via the [GOVERNANCE](../../standards/GOVERNANCE.md) amendment process |

This mirrors the Astro path: the site standard was drafted, proven on one repo, rolled to the rest, then promoted to `standards/domains/astro-sites/`. The consistency initiatives below follow the same arc - they start as specs here and graduate into the Standard as they prove out.

## Relationship to the Standard

`STANDARD.md` already names some of this (Section 10.1 repository layout, Section 4 CI expectations, Section 10.3 dual representation). The orchestration program is the *operational layer* that brings the four live repos into line with those clauses and keeps them there - and surfaces where the clauses themselves need sharpening (exactly as the Astro rollout did).
