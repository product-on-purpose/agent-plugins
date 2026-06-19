# Current state: the grounding snapshot

This file is the honest description of where the Product on Purpose plugin family stands as the standards roadmap begins. It is description, not prescription: the recommendations live in [`02-roadmap.md`](02-roadmap.md), [`03-decisions.md`](03-decisions.md), and [`04-standards-definition.md`](04-standards-definition.md). Read this first to calibrate scope. The headline is that the family is roughly 70 percent built; the remaining work is to consolidate, complete, and harden what already exists, and nothing in the gap list is a fire.

## The framing: this is alignment work, not a rescue

The hard structural work is done. The family already has one versioned Standard with a portable conformance runner, a committed governance and amendment process, a thin listing contract bound to that Standard, a graduated site domain with all four repos on it, an orchestration model for cross-repo change, and a queued conformance audit with packets already written. What remains is formalization (turning proven practice into normative clauses), consolidation (collapsing four duplicated copies into shared machinery), and bringing two version-pin laggards fully into governance. The two genuine P0 holes are both localized to one repo (pm-skills) and both already scoped in a written convergence packet. The correct posture for the whole effort is steady completion, not triage.

## What already exists - build on it

Every row below is committed and working today. The roadmap extends these assets; it does not replace them.

| Asset | Where it lives | Maturity |
|---|---|---|
| The Advanced Skill Library Standard (header v0.12, amended 2026-06-13, RFC-2119 keyworded) | `agent-skills-toolkit/STANDARD.md` | Mature; normative; the single authoring law |
| Conformance runner (zero-dependency Node; 30-check spine = U1-U9 + U11-U13 + S1-S8 + G1-G10; tier model Universal/Bronze, Convergent/Silver, Advanced/Gold) | `agent-skills-toolkit/scripts/` (`check.mjs`, `checks/`, `lib/`) | Mature; self-hosting in askit CI |
| Governance + amendment lifecycle (EXPAND -> PROPOSE -> REVIEW -> LAND -> RE-ADOPT; allocation-at-land invariant; MADR trail) | `agent-plugins/standards/GOVERNANCE.md`, `standards/README.md` | Mature; committed |
| ADR 0001 (canonical-home decision: relocate the Standard into `standards/`) | `agent-plugins/standards/decisions/0001-standard-governance-and-home.md` | Decided; execution queued (Phase 0) |
| Listing contract clauses L1-L6 (thin; binds the Standard by version pin; tier >= Bronze) | `agent-plugins/CONTRIBUTING.md` | Mature; bound to the Standard 2026-06-10 |
| Astro-sites domain (Pattern S, the first graduated domain; site standard clauses 14.1-14.11) | `agent-plugins/standards/domains/astro-sites/` | Graduated; site standard still "proposed" pending §14 land |
| Orchestration model (drive from one control point, one PR per repo, dual-documented; FC-NNNN campaign records) | `agent-plugins/docs/internal/orchestration/` (README, guide, backlog, specs) | Modeled and documented; pilot FC-0001 not yet run |
| Convergence audits (one packet per marketplace member; audit-plan + output contract) | `agent-plugins/docs/internal/convergence/` | Audited; four packets written 2026-06-10 |
| Toolkit scaffolding suite (askit-init-plugin, askit-init-marketplace, askit-migrate, askit-build-agents-md, askit-release, askit-build-hook, askit-decision) | `agent-skills-toolkit/skills/` | Mature; ~24 skills shipped |
| Marketplace registry + CI gate (plugins pinned by sha; `metadata.version` 1.25.0; validate-registry workflow) | `agent-plugins/.claude-plugin/marketplace.json`, `scripts/validate-registry.mjs`, `.github/workflows/validate-registry.yml` | Working; shape-validation only (no re-pin check yet) |
| CHANGELOG + re-pin convention (Keep a Changelog 1.1.0 + SemVer; every re-pin bumps `metadata.version` and adds a CHANGELOG entry) | `agent-plugins/CHANGELOG.md`, CONTRIBUTING.md Section 7 | Mature; followed on every re-pin |

External references these assets invoke: the Standard's RFC-2119 usage per [RFC 8174 / BCP 14](https://www.rfc-editor.org/rfc/rfc8174); the registry conventions per the [Anthropic plugin / marketplace reference](https://code.claude.com/docs/en/plugins-reference); the CHANGELOG format per [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and [SemVer](https://semver.org); the skill floor per [agentskills.io](https://agentskills.io/specification.md); the decision records per [MADR 4.0](https://adr.github.io/madr/).

## The gaps, by severity

P0 = a live contract or Standard violation that blocks full-family conformance. P1 = drift or a missing enforcement mechanism that will compound if left. P2 = formalization debt with no current breakage.

| ID + handle | Severity | What is true today | Source |
|---|---|---|---|
| GP-1 (pm-skills no library.json) | P0 | pm-skills carries no root `library.json` tracked or on disk, so it is "loose components" under Standard Section 5 and cannot pin any Standard version; fails listing clause L3. | `convergence/pm-skills-conformance.md` §3.1 |
| GP-2 (pm-skills embedded marketplace) | P0 | pm-skills ships an embedded self-listing `.claude-plugin/marketplace.json` (the Section 12 anti-pattern), a deliberate back-compat retention since v2.21.0; fails listing clause L2. | `convergence/pm-skills-conformance.md` §3.1; CONTRIBUTING.md Section 8 |
| GP-3 (Standard relocation queued) | P1 | ADR 0001 (canonical home) is decided but unexecuted: the normative Standard still lives at `agent-skills-toolkit/STANDARD.md`, not at `agent-plugins/standards/STANDARD.md`, and the checks have not moved to `standards/checks/`. | ADR 0001; standards/README.md |
| GP-4 (stale version refs) | P1 | GOVERNANCE.md and ADR 0001 still cite Standard v0.8; the writing-style-library vs writing-style-catalog name drift persists. The single 0.12 truth is not yet swept through the governance docs. | STANDARD.md header (v0.12); GOVERNANCE.md |
| GP-5 (no re-pin conformance check) | P1 | validate-registry validates registry shape only; there is no CI check that a pinned-sha repo has a `library.json` with a `standard` pin and green CI at that sha. The L3/L4 binding is hand-policed via review and the re-pin checklist. | `scripts/validate-registry.mjs`; CONTRIBUTING.md Section 8 ratchet |
| GP-6 (version-pin lag) | P1 | Standard pins across consumers diverge: agent-skills-toolkit 0.12, writing-style-catalog 0.11, thinking-framework-skills 0.8, pm-skills NONE. tfs is three minors behind (graded 0 errors, 81 warns - all post-0.8 checks surfaced as warns per Standard 7.7). | `library.json` files; convergence packets |
| GP-7 (folder / casing / decision-home drift) | P1 | Decision-record homes differ: askit `docs/internal/decisions/` (correct); writing-style-catalog `docs/internal/adr/` (to rename); pm-skills `DECISIONS.md` ad-hoc log; thinking-framework-skills none. `_LOCAL` vs `_local` casing and `session-log` vs `session-logs` naming both drift across repos. | convergence packets; CONTRIBUTING.md L6 §6 |
| GP-8 (CLAUDE.md shim drift) | P1 | Only pm-skills and writing-style-catalog carry a root CLAUDE.md shim; thinking-framework-skills and agent-skills-toolkit lack it though both declare claude as a target. See the cross-tool table below. | repo file inventory |
| GP-9 (cross-tool claim-vs-reality gap) | P1 | agent-targets is not load-bearing: a plugin can declare a target it does not fully deliver (no native distribution + context shim verified per declared target). The "codex" claim across repos is portability (agentskills.io skills + AGENTS.md), not native marketplace distribution. | `library.json` agent-targets; STANDARD.md line 495 residual |
| GP-10 (no frontmatter schema) | P2 | There is no single frontmatter schema per artifact type (skill, ADR, doc, spec) validated in CI; key casing, scalar quoting, and array-vs-string typing are not centrally enforced beyond the agentskills.io caps. | STANDARD.md Section 5/8.4; no schema check |
| GP-11 (missing HISTORY.md check) | P2 | Per-component HISTORY.md is sparse (pm-skills: 1 of ~95; tfs: 0 repo-wide) and there is no enforcing check pending the maintainer amend-vs-conform decision. | convergence packets |
| GP-12 (no release-plans convention) | P2 | There is no `docs/internal/release-plans/plan_vX.Y.Z/` convention or donated go/no-go gate template; release planning is ad hoc per repo. | program-roadmap.md; no on-disk convention |
| GP-13 (four duplicated site guard copies) | P2 | All four repos each carry their own copy of the clause-14.11 link/route guards; there is no shared `astro-site.yml` workflow or extracted preset. The real drift risk is four copies, not the unlanded §14 paperwork. | program-roadmap.md "critical insight about §14" |
| GP-14 (§14 not normative) | P2 | The astro site standard (14.1-14.11) is proven against four conforming repos but still "proposed"; L5 is SHOULD until §14 lands and members re-adopt. | CONTRIBUTING.md L5 §6; SITE-STANDARD.md |
| GP-15 (enforcement is aspirational) | P1 | Cross-repo conformance enforcement is largely aspirational today. Only agent-skills-toolkit actually runs the full 30-check runner, and it runs it as self-validation (`node scripts/check.mjs` against its own tree). thinking-framework-skills ships a divergent/partial `scripts/check.mjs` (it has `scripts/lib/` but NO `scripts/checks/` dir, so it is not the canonical 30-check spine even though its CI checks out the toolkit at a pinned ref). pm-skills and writing-style-catalog run their own `validate-plugin` packaging/manifest workflows, NOT the shared conformance gate. There is no single shared CI that runs the canonical runner against every member, so "the family is gated" is a claim, not a fact. | the four repos' `.github/workflows/`; tfs has no `scripts/checks/`; [`drafts/runner-consumption.md`](drafts/runner-consumption.md) |

### Enforcement reality: the gate is mostly aspirational

One correction belongs up front so the rest of the snapshot is not read too optimistically. The family has a mature 30-check runner, but it is not yet a cross-repo enforcement mechanism. Verified against the four repos' `.github/workflows/` on the date of this snapshot: agent-skills-toolkit is the only member that runs the full runner, and it runs it as self-validation (`node scripts/check.mjs` over its own tree in `ci.yml`). thinking-framework-skills runs a `node scripts/check.mjs` step, but the tfs repo carries a divergent/partial copy - it has `scripts/check.mjs` and `scripts/lib/` but no `scripts/checks/` directory, so it is not the canonical 30-check spine. pm-skills and writing-style-catalog run their own `validate-plugin` (manifest/packaging) workflows, which are useful but are NOT the shared conformance gate. The net effect is that conformance is hand-policed by review and the re-pin checklist (see GP-5 (no re-pin conformance check) and GP-6 (version-pin lag)), and "the family is gated to the Standard" is today an aspiration rather than a CI fact.

The implication is that "stand up real cross-repo enforcement" is itself a P1 (tracked as GP-15 (enforcement is aspirational)), not a free side effect of the relocation. It is blocked on the upstream runner-consumption decision: whether members vendor the runner, consume it from a pinned toolkit checkout, or call a shared CI workflow. That decision is drafted in [`drafts/runner-consumption.md`](drafts/runner-consumption.md), and the shared-workflow shape it settles is what GP-15 then executes against.

## Cross-tool reality

The family declares Claude Code and Codex as first-class targets, but the on-disk context files do not yet match those declarations. This is the concrete state behind decision D10 (truth-in-targeting) and the GP-8 / GP-9 gaps above.

| Context file / surface | agent-skills-toolkit | writing-style-catalog | thinking-framework-skills | pm-skills | agent-plugins (registry repo) |
|---|---|---|---|---|---|
| Root `AGENTS.md` | Present | Present | Present | Present | n/a (not a plugin) |
| Root `CLAUDE.md` shim | MISSING | Present | MISSING | Present | n/a |
| `GEMINI.md` | None | None | None | None | None |
| `.agents/` (Codex on-disk dir) | None | None | None | None | None |
| Declares "codex" in agent-targets | Yes | (per its converging manifest) | Yes | (no manifest yet) | n/a |

Reading: AGENTS.md is universal (per [AGENTS.md](https://agents.md/)), so the portable cross-tool floor is met everywhere. The CLAUDE.md shim is present on only 2 of 4 plugins despite all four declaring claude. No repo carries a GEMINI.md (no repo declares gemini, which is correct - the shim follows the declaration). No repo has a `.agents/` Codex directory, so the "codex" target today means agentskills.io portability plus AGENTS.md, not native Codex marketplace distribution; the exact Codex on-disk paths still have version churn and must be reconfirmed against the [Codex plugins](https://developers.openai.com/codex/plugins) and [Codex skills](https://developers.openai.com/codex/skills) docs before any emitter is built.

## The concrete _agent-context split (the gitignore instance)

The `agent-plugins` repo's own `.gitignore` is the live instance of the split pattern that decision D5 (dissolve _agent-context) retires. The relevant lines:

```
# Agent working context: local scratch is ignored, but the session-log timeline is committed
_agent-context/*
!_agent-context/session-logs/
```

This ignores everything under `_agent-context/` except `session-logs/`, which is committed. The same split appears in the L6 scaffolding evidence: the convergence audits found members differ on whether `_agent-context/` is committed (pm-skills) or fully gitignored (thinking-framework-skills, agent-skills-toolkit), and on session-log naming (`session-log/` singular vs `session-logs/` plural). The `.gitignore` also ignores `_LOCAL/` (uppercase), which is the casing that decision D6 (casing) resolves to lowercase `_local/`. These two lines are the smallest concrete artifact of GP-7 (folder / casing / decision-home drift) and the directly observable target of D5 and D6.
