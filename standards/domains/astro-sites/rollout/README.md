# Astro site conformance: per-repo execution packets

One self-contained packet per family repo. Each packet is the "how" for one repo: its current pass/fail against the site standard, the exact corrections to reach full compliance, an implementation checklist the executing agent updates, and a copy-paste **kickoff prompt** to start the work. The "what" (the contract) is [`../SITE-STANDARD.md`](../SITE-STANDARD.md); the evidence is [`../../../../docs/internal/audits/2026-06-02_astro-implementation.md`](../../../../docs/internal/audits/2026-06-02_astro-implementation.md).

| Packet | Repo | Distance | Headline work |
|---|---|---|---|
| [`pm-skills.md`](pm-skills.md) | pm-skills | reference, closest | P1 base de-dup; P2 robots.txt, accent, version pin |
| [`thinking-framework-skills.md`](thinking-framework-skills.md) | thinking-framework-skills | close | P1 delete 7 sidecars; add link/route guards |
| [`agent-skills-toolkit.md`](agent-skills-toolkit.md) | agent-skills-toolkit | close | P2 modernize deploy majors + node pin; brand mermaid |
| [`writing-style-catalog.md`](writing-style-catalog.md) | writing-style-catalog | close (Pattern S shipped, PR #11) | P2 mermaid branding, title, CI dash check; + 14.11 guards |

## How to run one

1. Open a Claude Code session in the **target repo's** working directory (for example `E:\Projects\product-on-purpose\pm-skills`).
2. Give the session read access to this standard. Either add `E:\Projects\product-on-purpose\agent-plugins` as an additional working directory, or copy the repo's packet into the repo first.
3. Point the session at the packet and run its **Kickoff prompt** (the first section of each packet). Saying "go" against the packet is enough; the prompt is self-contained.

The agent then creates `docs/internal/release-plans/astro-starlight-conformance/` in that repo (a `spec.md` + a `release-plan.md`), executes the corrections, and ticks off the implementation checklist as it goes. Each packet tells the agent to make changes as normal PRs in that repo and not to merge without your confirmation.

## Suggested order

The family is already 4/4 Pattern S on `main` (writing-style-catalog shipped via PR #11), so order is by ease, not by unblocking:

1. **thinking-framework-skills** and **agent-skills-toolkit** first (small, mechanical: a sidecar delete, a deploy-major bump, mermaid branding).
2. **writing-style-catalog** next (P2 polish: mermaid branding, the stale Starlight title, a CI dash check).
3. **pm-skills** last among the per-repo fixes (it donates the shared validators; do its base de-dup before the shared CI workflow is built).

The shared infrastructure (reusable CI workflow + preset + spreading the four validators) is sequenced separately in [`../ROADMAP.md`](../ROADMAP.md), Phases 1-2, and is not part of these per-repo packets except where a packet notes a repo will gain the validators from the shared workflow.

## A note on "implement astro starlight"

All four repos already run Astro Starlight and are Pattern S on `main` (writing-style-catalog shipped via PR #11). So each packet's real job is **conformance**, not greenfield install: close the gaps to the standard and lock them in. Each kickoff prompt is worded to match that repo's actual starting point.
