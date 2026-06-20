# Repo health review - agent-plugins (2026-06-20)

A point-in-time review of this repository's own health, beyond the standards roadmap. It records what was executed in this pass (all scoped to `agent-plugins` only), a registry conformance snapshot for visibility, and the recommendations deliberately deferred with their reasons. Companion: the standards program lives in [`standards-plan-roadmap/`](standards-plan-roadmap/00-README.md).

## Scope

Only `agent-plugins` changes. Nothing here touches `agent-skills-toolkit`, the org `.github` repo, or the other plugins, and nothing modifies the Anthropic-schema'd `marketplace.json` or pre-empts a governance-lifecycle decision.

## Executed in this pass

1. **Dogfooded the cross-tool context convention (D5/D10).** Added a root [`AGENTS.md`](../../AGENTS.md) (canonical, tool-agnostic orientation) and a thin [`CLAUDE.md`](../../CLAUDE.md) shim that references it. The neutral repo that governs the family's dual-audience standard now models it: what this repo is, the commands, the guardrails (PR-protected `main`, the no-dash rule, the re-pin convention), and a map of where everything lives, with a pointer to `OVERVIEW.md` for the why. Additive only; this repo is not a plugin, so the conformance runner does not grade it.
2. **Branch hygiene.** Deleted stale branches left behind by squash-merged PRs (re-pin and docs branches). The live work is all in `main`; the deletions remove clutter only.

## Registry conformance snapshot

Registry `metadata.version` 1.27.0. The plugin `version` (advanced on each re-pin) is distinct from the Standard `pin` (each plugin's own `library.json` `standard`, adopted on its own cadence) - the gap between them is the version-pin lag (GP-6).

| Plugin | Plugin version | Standard pin | Tier | Listing notes |
|---|---|---|---|---|
| agent-skills-toolkit | 1.6.0 | **0.12** (current) | advanced (Gold) | the self-proving reference; owns the Standard until Phase 0 relocation |
| thinking-framework-skills | 0.11.0 | **0.8** (4 minors behind) | advanced (Gold) | GP-6 lag: actively re-pinned for plugin version, but the Standard pin has not advanced; 81 post-0.8 findings surface as warnings |
| writing-style-catalog | 0.2.0 | **0.11** | universal (Bronze) | one minor behind |
| pm-skills | 2.26.0 | **none** | n/a | **P0**: no `library.json`, so it cannot pin the Standard at all + ships an embedded self-listing marketplace (GP-1, GP-2; Phase 1) |

Reading: only `agent-skills-toolkit` is current; `pm-skills` is invisible to the governance system until it gains a `library.json`; `tfs` shows the unbounded-lag problem. This is the visibility the registry itself does not yet surface (see deferred item 2).

## Deferred (documented, with reasons)

These are real improvements, intentionally NOT done in this pass:

1. **Dissolve this repo's `_agent-context/` (D5).** `agent-plugins` still commits `_agent-context/session-logs/` (the split pattern D5 retires). NOT done unilaterally: it is a ratified-clause + push-campaign item (roadmap Phase 3), and moving committed session-log history into gitignored `_local/` removes provenance from git - a maintainer decision that should go through the governance lifecycle, not a drive-by edit. The new `AGENTS.md` documents this repo as a convergence target.
2. **Surface `standard` + `tier` in the registry itself.** `marketplace.json` shows `name`/`sha`/`version`/`strict` but not the Standard pin or tier, so a consumer cannot see conformance state at a glance. NOT done by editing `marketplace.json`: it carries the Anthropic `marketplace.schema.json`, and adding non-standard fields risks `claude plugin validate` and the loader. The canonical surfacing mechanism (extra fields vs a generated companion `INDEX`/badge) is a Phase 2 design decision. The snapshot above is the interim visibility surface.
3. **Re-pin automation.** The `CHANGELOG` is dominated by manual `chore(marketplace): re-pin ...` PRs. A scheduled or dispatch workflow that opens a re-pin PR when a plugin tags a release would cut recurring toil. NOT done: it is a feature needing design (it must read other repos' tags via the GitHub API and open PRs), so it belongs in a spec, not an unprompted build. Recommended as a backlog item.
4. **A pin-currency policy + drift surfacing (GP-6).** There is no bound on how far a plugin's Standard pin may lag (tfs is 4 minors behind). A SHOULD-level "re-pin within N minors," surfaced by the existing `validate-registry` workflow, would make lag visible and bounded. NOT done: a SHOULD clause is a Standard amendment (lifecycle), and the surfacing ties to deferred item 2. Recommended; ties to GP-6.
5. **Casing convergence `_LOCAL` -> `_local` (D6).** Both names resolve to one directory on a case-insensitive filesystem (the live D6 footgun). NOT done here: it is part of the mechanical push campaign (D2/D6), best applied fleet-wide, not in one repo ahead of the others.

## Confidence and notes

- The executed changes are **additive and low-risk** (two new root docs + branch deletions); they cannot break the registry or the gate.
- The snapshot is **accurate as of `metadata.version` 1.27.0**; it is a point-in-time read, not a living surface (a living surface is deferred item 2).
- The deferred items are deferred on principle, not omission: each either touches another repo, the schema'd registry, or a clause that must move through governance. They are captured here so they are not lost.
