# Astro site conformance: per-repo execution packets

One self-contained packet per family repo. Each packet is the "how" for one repo: its current pass/fail against the site standard, the exact corrections to reach full compliance, an implementation checklist the executing agent updates, and a copy-paste **kickoff prompt** to start the work. The "what" (the contract) is [`../SITE-STANDARD.md`](../SITE-STANDARD.md); the evidence is [`../../../../docs/internal/audits/2026-06-02_astro-implementation.md`](../../../../docs/internal/audits/2026-06-02_astro-implementation.md).

| Packet | Repo | Distance | Headline work |
|---|---|---|---|
| [`pm-skills.md`](pm-skills.md) | pm-skills | reference, closest | P1 base de-dup; P2 robots.txt, accent, version pin |
| [`thinking-framework-skills.md`](thinking-framework-skills.md) | thinking-framework-skills | close | P1 delete 7 sidecars; P2 node-pin + editLink; 14.11 deferred to Phase 1.3 pilot |
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

## Rollout learnings (folded into the standard)

All four sessions landed (pm-skills #160, thinking-framework-skills #30, agent-skills-toolkit #83, writing-style-catalog #11+#12). Three produced adversarial review-findings docs, which drove a second wave of standard refinements (`SITE-STANDARD.md` section 1, items 6-10):

| Findings doc | Key learnings folded in |
|---|---|
| [`...agent-skills-toolkit_review-findings.md`](2026-06-02_astro-standard_agent-skills-toolkit_review-findings.md) | Favicon is a 404 not "minor" (14.9 MUST); donor guard skipped bare-relative hrefs; CI build-outcome gate; `node-version-file` resolves from repo root |
| [`...pm-skills_review-findings.md`](2026-06-02_astro-standard_pm-skills_review-findings.md) | Base single-source needs sanctioned exceptions (test pin + robots.txt) (14.7); version pin is a lockfile property not a caret range (14.8); CLI entry `argv[1]` null-check |
| [`...writing-style-catalog_review-findings.md`](2026-06-02_astro-standard_writing-style-catalog_review-findings.md) | Don't call a value "stale" without checking the repo's ADRs (the title was deliberate, ADR 0014); landing 14.11 exposes pre-existing link debt; guard the deploy build not only the PR; dash check must scan `.py` |

The cross-cutting reversal: **implement 14.11 locally now (the sanctioned bridge), do not defer to the unbuilt shared infra.** Three of four repos did, and the guards caught real shipped breakage. thinking-framework-skills deferred and now has an open follow-up (its packet).
