# AGENTS.md - agent-plugins

Orientation for any agent (Claude Code, Codex, or other) working in this repository. This is the canonical, tool-agnostic context file; `CLAUDE.md` is a thin shim that points here.

## What this repo is

`agent-plugins` is the **Product on Purpose marketplace registry** and the **neutral home of the family's standards governance**. It is deliberately NOT a plugin (it has no `library.json`): it hosts the marketplace catalog, the listing contract, the Standard's governance, and the cross-repo orchestration and convergence program. It is the one repo in the family that can neutrally own the law the member plugins must obey.

The four member plugins it lists live in their own repos: `pm-skills`, `thinking-framework-skills`, `writing-style-catalog`, `agent-skills-toolkit`.

## Commands

- **Validate the registry:** `node scripts/validate-registry.mjs` (CI runs it via `.github/workflows/validate-registry.yml`; set `GITHUB_TOKEN` to raise the API rate limit). This checks each marketplace entry resolves, versions agree, and the metadata version is consistent.
- The family **conformance runner** (the 30-check gate that grades plugins) currently lives in `agent-skills-toolkit/scripts/`; it relocates into `standards/checks/` in Phase 0 of the standards roadmap (see below). It does not grade this repo (this repo is not a plugin).

## Guardrails

- **`main` is PR-protected:** branch, open a PR, squash-merge; the `validate` check gates every merge. Never push to `main` directly.
- **Family writing rule:** never use em-dashes (U+2014) or en-dashes (U+2013); use `" - "` (space hyphen space) or restructure. This is enforced by a hook and applies to every file.
- **Reference IDs carry a human-readable handle** on first use (for example "D5 (dissolve _agent-context)", not bare "D5").
- **Re-pinning a plugin** (advancing its `sha`/`version` in the registry) follows the re-pin convention in [`CONTRIBUTING.md`](CONTRIBUTING.md) Section 5 (L4) and "The re-pin checklist": bump `metadata.version`, add a `CHANGELOG.md` entry, keep versions consistent. Do not hand-edit a `sha` without the checklist.
- **Listing contract:** what makes a repo listable is [`CONTRIBUTING.md`](CONTRIBUTING.md) clauses L1-L6 (binds the Standard by version pin, never restates it).

## Where things live

| Path | What |
|---|---|
| `.claude-plugin/marketplace.json` | the registry: the four plugins pinned by `sha` + `version` |
| `CONTRIBUTING.md` | the listing contract (L1-L6) + the re-pin checklist |
| `standards/` | the Standard's governance: `GOVERNANCE.md` (amendment lifecycle), `decisions/` (family-law ADRs, starting at 0001), `domains/astro-sites/` (the first graduated domain). The Standard text + checks relocate here in Phase 0. |
| `docs/internal/` | program docs: `program-roadmap.md`, `registry-maintenance.md`, `orchestration/`, `convergence/`, `audits/`, and `standards-plan-roadmap/` (the standards roadmap package) |
| `docs/internal/standards-plan-roadmap/` | the standards program: `OVERVIEW.md` (read this for the WHY), `02-roadmap.md` (the 6 phases), `03-decisions.md` (the 17 locked decisions), `06-tier-requirements.md` (Bronze/Silver/Gold), `plans/` (Phase 0 plan + change manifest), `spikes/`, `drafts/` |
| `scripts/validate-registry.mjs` | the registry validator |
| `_local/` | gitignored scratch (per decision D6; note the on-disk dir is currently `_LOCAL` pending the D6 casing convergence - `_LOCAL` and `_local` collide on a case-insensitive filesystem, which is why D6 standardizes on lowercase) |

## Start here for the why

For the full reasoning behind the standards system - decouple-and-pin, the tiers, governance, cross-tool targeting, and the 17 decisions - read [`docs/internal/standards-plan-roadmap/OVERVIEW.md`](docs/internal/standards-plan-roadmap/OVERVIEW.md).

## Conventions in flux (this repo is a convergence target)

The family is converging on a shared scaffolding standard (decisions D5/D6 in the roadmap package). For this repo that means: the casing settles to lowercase `_local/`, and the `_agent-context/` directory is slated for dissolution (session logs move to gitignored `_local/session-logs/`). These land through the governance lifecycle, not unilaterally; until then `_agent-context/session-logs/` remains the committed convention here. See the standards-plan-roadmap package for the decisions.
