---
title: Conformance convergence packets
---

# Conformance convergence packets

> Per-repo execution packets for bringing a family plugin into conformance with the Standard, in the same self-contained format the Astro [`rollout/`](../../../standards/domains/astro-sites/rollout/README.md) packets use: current-state scorecard, the decisions a maintainer must make, a grounded implementation checklist, acceptance criteria, and a copy-paste kickoff prompt. These cover **governance conformance** (manifest, tier, naming) as distinct from the Astro site conformance the `rollout/` packets cover.

These are Level-0 (single-repo, focused) changes per the [orchestration decision rule](../orchestration/guide.md): each runs in its own repo, opens its own PR, and is not coupled to the others. The [program roadmap](../program-roadmap.md) sequences them.

The bar every packet scores against is the [listing contract](../../../CONTRIBUTING.md) (clauses L1-L6) plus the Standard at the repo's declared tier. The [audit plan](audit-plan.md) queues one packet per marketplace member and carries the parameterized audit kickoff prompt.

## Packets

| Packet | Repo | Goal | Status |
|---|---|---|---|
| [`writing-style-catalog-library-json.md`](writing-style-catalog-library-json.md) | writing-style-catalog | Add a canonical `library.json` and reach honest universal-tier conformance | **Executed 2026-06-10** - convergence PR open in its repo (PR #19, CI green), awaiting maintainer merge |
| [`agent-skills-toolkit-conformance.md`](agent-skills-toolkit-conformance.md) | agent-skills-toolkit | Audit against the listing contract | **Audited 2026-06-10** @ `1fd44b7` - L1-L6 PASS, P0: 0, P1: 2, P2: 2; 3 decisions queued |
| [`thinking-framework-skills-conformance.md`](thinking-framework-skills-conformance.md) | thinking-framework-skills | Audit against the listing contract | **Audited 2026-06-10** @ `d0b4a33` (= the pin) - L1-L6 PASS, P0: 0, P1: 1, P2: 3; 3 decisions queued |
| [`pm-skills-conformance.md`](pm-skills-conformance.md) | pm-skills | Audit against the listing contract; scope the deliberate convergence session | **Audited 2026-06-10** @ `ac0acfb` - P0: 2 (no `library.json`; embedded marketplace), P1: 5, P2: 5; 7 decisions queued; convergence is a deliberate in-repo session |

Cross-audit outcomes (2026-06-10): the audits' contract corrections are applied to [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) (L2 scoped to machine-readable association; L1 defers frontmatter law to the Standard; L4 covers all native manifests; L6 lineage refreshed with the real variance). One family-wide Standard finding surfaced in all three audits: per-component `HISTORY.md` is a Standard 7.3 MUST at Silver+ that the gate does not enforce - queued as a Standard amendment candidate (amend vs conform is a maintainer fork, see the agent-skills-toolkit packet D1).
