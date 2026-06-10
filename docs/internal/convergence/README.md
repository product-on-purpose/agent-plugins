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
| [`writing-style-catalog-library-json.md`](writing-style-catalog-library-json.md) | writing-style-catalog | Add a canonical `library.json` and reach honest universal-tier conformance | Ready to execute |
| `agent-skills-toolkit-conformance.md` | agent-skills-toolkit | Audit against the listing contract; expected fastest pass (validates the contract itself) | Queued ([audit plan](audit-plan.md) #2) |
| `thinking-framework-skills-conformance.md` | thinking-framework-skills | Audit against the listing contract; L3 pin currency + L4 release hygiene | Queued ([audit plan](audit-plan.md) #3) |
| `pm-skills-conformance.md` | pm-skills | Audit against the listing contract; manifest enumeration + embedded-marketplace removal path | Queued ([audit plan](audit-plan.md) #4, deliberate in-repo session) |
