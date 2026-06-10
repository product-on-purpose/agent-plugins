---
title: Family conformance audit - plan and queue
---

# Family conformance audit - plan and queue

> Score every marketplace member against the [listing contract](../../../CONTRIBUTING.md) (clauses L1-L6) and the Standard at its declared (or intended) tier, producing one convergence packet per repo in this directory. Written 2026-06-10. The bar now exists; each audit is a gap measurement against it, not a search for a bar. This implements step 1 of the contract's enforcement ratchet (CONTRIBUTING.md Section 8) and feeds the [program roadmap](../program-roadmap.md)'s "NOW" items (the laggard manifests).

## The bar each audit scores against

| Layer | Source |
|---|---|
| Listing contract L1-L6 | [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) |
| Authoring law at the declared tier | `agent-skills-toolkit/STANDARD.md` at the version the repo pins (or the version it would pin: currently 0.11) |
| Site standard (L5) | [`standards/domains/astro-sites/SITE-STANDARD.md`](../../../standards/domains/astro-sites/SITE-STANDARD.md) |

Discipline carried from [`GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 7: clauses are ratified from evidence, so audit findings flow back as contract corrections **before** any clause hardens into automated enforcement.

## Output contract (what every audit produces)

One packet per repo in this directory, in the proven format of [`writing-style-catalog-library-json.md`](writing-style-catalog-library-json.md):

1. **Current-state scorecard** against L1-L6 plus the declared-tier requirements - file-grounded, pinned to a named commit.
2. **Gaps**, tiered: **P0** (listing blockers: would fail L1-L4 for a new listing), **P1** (contract MUSTs currently advisory), **P2** (SHOULDs: L5/L6 and polish).
3. **Maintainer decisions** - genuine forks only, with a recommendation each.
4. **Implementation checklist + acceptance criteria** for the convergence session.
5. **Kickoff prompt** making the convergence independently dispatchable.

Plus two side effects: update this repo's [`README.md`](README.md) packet table row, and flag any clause the audit proved wrong or unworkable as a proposed CONTRIBUTING.md correction.

**Scaffolding evidence (E2 input).** Every audit also records the repo's actual layout against the intended L6 convention: where committed agent context lives, what is gitignored, any `agents/` namespace use, and session-log location/naming. The folder-structure epic (E2) ratifies clauses only from this evidence. Known lineage to verify against (maintainer-provided, 2026-06-10): `agents/` originally held session logs and agent knowledge; it collided with the plugin-subagent namespace; `_agent-context/` was created to relieve it, with session logs under it, and `_local/` / `_LOCAL/` is fully gitignored scratch.

## The queue

Audits are independent and MAY run in parallel (separate repos, separate packets); convergence PRs land per-repo (Level-0 per the [orchestration decision rule](../orchestration/guide.md)). The order below is the recommended sequence if run serially, cheapest-confidence first.

| # | Repo | Packet | Why this position | Known going in |
|---|---|---|---|---|
| 1 | writing-style-catalog | [exists - execute it](writing-style-catalog-library-json.md) | Smallest member; the packet is already written; gives a laggard its manifest | No `library.json`; skill name/dir mismatch; no component version; embedded self-listing marketplace (its D4) |
| 2 | agent-skills-toolkit | to be produced | The Gold self-proving reference; fastest expected pass; doubles as validation of the contract clauses themselves against the best repo | Hosts STANDARD.md transitionally (not a violation: ADR 0001's sequenced relocation); verify L4 tag/version agreement and L2 |
| 3 | thinking-framework-skills | to be produced | Fresh v0.6.0; has `library.json` and a 5-layer self-hosted gate; mostly an L4/L3-currency check | Verify `standard` pin currency, tag/version agreement, changelog discipline |
| 4 | pm-skills | to be produced | Heaviest and last; the roadmap warns this is a deliberate in-repo session, not a drive-by | No `library.json` (~90 components to enumerate); **live L2 violation** (embedded self-listing marketplace); hand-authored native manifests (Standard says generated); legacy `agents/` scaffolding |

## Kickoff prompts

### 1. writing-style-catalog (convergence - the audit is done)

Use the kickoff prompt inside the packet itself: [`writing-style-catalog-library-json.md`](writing-style-catalog-library-json.md), Section 1.

### 2-4. Audit prompt (parameterized; fill REPO and the per-repo notes from the queue table)

```
You are AUDITING the <REPO> repository against the Product on Purpose listing contract.
This is an audit session: you produce a convergence packet; you change NOTHING in <REPO>.

Working directories needed: E:\Projects\product-on-purpose\<REPO> (the subject) and
E:\Projects\product-on-purpose\agent-plugins (where the packet is written).

Read first, in order:
1. The bar: agent-plugins/CONTRIBUTING.md (clauses L1-L6 + Section 8 enforcement state).
2. agent-skills-toolkit/STANDARD.md at the version <REPO> pins in library.json (no pin ->
   audit against the current version and record the absence as a P0 L3 gap).
3. The site standard (L5): agent-plugins/standards/domains/astro-sites/SITE-STANDARD.md.
4. The plan + output contract: agent-plugins/docs/internal/convergence/audit-plan.md.
5. The packet format exemplar: agent-plugins/docs/internal/convergence/writing-style-catalog-library-json.md.

Then audit <REPO> at its current main HEAD (record the commit):
- Score every contract clause L1-L6 with file-grounded evidence (paths, frontmatter,
  manifests, CI workflows, tags). Run the toolkit gate read-only where applicable
  (outward grading via --profile if the repo does not self-host the checks).
- Verify L4 against the marketplace: the pinned sha in agent-plugins
  .claude-plugin/marketplace.json sits on a release tag and versions agree end to end.
- Record the L6 scaffolding evidence (agent-context home, gitignore coverage, agents/
  usage, session-log location) without judging it - E2 collects, it does not yet enforce.
- STOP-AND-FLAG rule: before judging any named or identity value (titles, slugs, display
  names), check the repo's own ADRs - deliberate decisions are not drift.

Produce ONE file: agent-plugins/docs/internal/convergence/<REPO>-conformance.md in the
exemplar's format (scorecard, P0/P1/P2 gaps, maintainer decisions with recommendations,
checklist, acceptance criteria, kickoff prompt for the convergence session). Update the
packet table row in convergence/README.md. If a contract clause proved ambiguous or wrong
during the audit, add a "Contract corrections" note at the end of the packet.

House rules: no em-dashes or en-dashes anywhere (use " - " or restructure). Do not modify
<REPO>. Do not merge anything without maintainer confirmation.
```

## After the audits (the ratchet, restated)

1. **Converge** per-repo from the packets' checklists (own repo, own PR each).
2. **Amend** CONTRIBUTING.md with the audits' contract corrections.
3. **Enforce**: land the automated re-pin check (pinned sha's repo has `library.json` with a `standard` pin; CI green at that sha) advisory first, blocking once all four members pass.
4. Then the already-roadmapped items proceed on their own track: land Section 14, build the shared CI workflow, extract the preset, run the fleet pilot (see the [program roadmap](../program-roadmap.md)).
