# Release Subsystem (D8)

This draft specifies the family release subsystem decided in D8 (release subsystem, three layers). It covers three layers explicitly - PLAN (how a release is prepared), EXECUTE (how a release is cut), and NOTES (how the human-facing record is curated) - plus the load-bearing prerequisite chain that ties a Conventional Commit type to a SemVer bump to a Keep a Changelog category. This is staged draft text per D1 (deliverable: roadmap + ready-to-land drafts); the clauses graduate in Phase 5 (process and hooks). Companion drafts: `drafts/standard-amendments.md` (the normative clause text), `drafts/orchestration-campaigns.md` (the one-PR-per-repo push of the commitlint hook), `drafts/ci-repin-check.md` (the marketplace re-pin gate this subsystem feeds).

## Scope and the two release lines

The family runs two distinct release lines. Keep them separate; they bump on different cadences and use different machinery.

| Line | Artifact | Version source | Cadence | This draft |
|---|---|---|---|---|
| Plugin release | one of the four leaf plugin repos (agent-skills-toolkit, writing-style-catalog, thinking-framework-skills, pm-skills) | `library.json` `version` (the single plugin version, Standard Section 7.4) | per-plugin, owner-driven | the PLAN + EXECUTE + NOTES layers below |
| Marketplace re-pin | the agent-plugins registry | `.claude-plugin/marketplace.json` `metadata.version` | follows a plugin tag, bespoke | stays under `validate-registry`; see `drafts/ci-repin-check.md` |

The marketplace re-pin is deliberately NOT folded into the generic plugin release machinery. It pins plugins by sha (current `metadata.version` is 1.25.0) and follows the re-pin convention already recorded in `CHANGELOG.md`. D8 keeps it bespoke under `scripts/validate-registry.mjs`; the release subsystem here governs the leaf plugins that the registry then pins.

## Layer 1 - PLAN

### Directory structure

A release is planned in-repo under `docs/internal/release-plans/` (D3 keeps `docs/internal`; never under `_local/`, which is gitignored scratch per D5 / D6). One folder per release, named `plan_vX.Y.Z`, with one subfolder per feature shipping in that release.

```
docs/internal/release-plans/
  plan_v1.1.0/
    README.md                         release overview + feature index
    go-no-go.md                       the go/no-go checklist (template below)
    P3-readme-mermaid/
      spec.md                         what the feature is (the contract)
      impl-plan.md                    how it gets built (the steps)
    P4-folder-readme/
      spec.md
      impl-plan.md
    ...
```

This matches current practice: agent-skills-toolkit already carries `docs/internal/release-plans/plan_v1.1.0/` with per-feature subfolders. The convention to ratify is the pairing - every feature subfolder holds a `spec.md` (the contract) and an `impl-plan.md` (the execution), echoing the spec-then-plan discipline in the `jp-spec` / `jp-execution-plan` split. `spec.md` and `impl-plan.md` SHOULD use the frontmatter schemas defined in `drafts/frontmatter-schemas.md` (D11) so CI can validate them.

The plugin master plan for a release lives at `docs/internal/release-plans/plan_vX.Y.Z/README.md` (or a `plan_vX.Y.Z.md` master file, as pm-skills' release conductor expects at `docs/internal/release-plans/v{target}/plan_v{target}.md`). The exact master-file name is normalized when the clause lands in Phase 3 (scaffolding and dual-audience); both observed forms are recorded here so the amendment text in `drafts/standard-amendments.md` picks one.

### Go/no-go checklist template

D8 donates the gate model from pm-skills' `pm-release-conductor`, whose canonical runbook lives at `pm-skills/site/src/content/docs/contributing/release-runbook.md`. That agent runs six explicit gates (the description says "6 explicit gates"); reuse them as a portable, agent-agnostic `go-no-go.md` template. Each gate pauses for confirmation and MUST NOT advance past a failure.

| Gate | Name | What it verifies | Blocking rule |
|---|---|---|---|
| G0 | Pre-tag readiness | conformance runner green (`node scripts/check.mjs` at the repo's declared tier), aggregate counters re-derived, dash sweep, cross-cutting audit | a P0 audit finding pauses the gate |
| G1 | Adversarial review status | maintainer attests an adversarial/peer review is complete | maintainer attestation required |
| G2 | Version bump + CHANGELOG prep | edits `library.json` version (Section 7.4 max-component-bump rule), promotes `[Unreleased]` in `CHANGELOG.md`, curates `RELEASE-NOTES.md`, updates README status/badges, sets plan status | a refused CHANGELOG draft pauses the gate |
| G2.5 | Commit + re-verify | commits the G2 edits, re-runs G0 against the new HEAD, pushes for CI, captures the exact sha | tags ONLY the G2.5-captured sha (the load-bearing anti-broken-tag invariant) |
| G3 | Tag + push | annotated tag on the G2.5 sha, push to origin | tags no other sha |
| G4 | Post-tag hygiene | plugin install path works (P0), marketplace registration (P1), docs/site rebuild (P1), GitHub Release body reminder (P2), next-cycle stub (P2) | a P0 (broken install path) blocks the "release complete" declaration |

Adaptation notes for the family template:
- Drop pm-skills-specific chain mechanics (the `pm-skill-auditor` / `pm-changelog-curator` Agent-tool chains). The portable gate is the checklist; the agent that walks it is repo-local.
- G2's version-bump step MUST apply the Standard Section 7.4 rule: one plugin version = the max component bump since the last release (MAJOR beats MINOR beats PATCH), a MUST so tooling can compute and verify it.
- G4's "marketplace registration" maps in this family to the separate agent-plugins re-pin line, not an inline step. After a leaf plugin tags, the registry re-pin is its own bespoke `validate-registry` flow (`drafts/ci-repin-check.md`).
- The "no bypass" discipline (no `--skip-gates`) and the "P0 blocks completion" discipline carry over verbatim; they are what make the gate trustworthy.

## Layer 2 - EXECUTE

Two candidate executors, with a Phase 5 decision.

### Comparison

| Dimension | askit-release (agent-driven, exists) | release-please (CI bot) |
|---|---|---|
| Form | a Standard-conformant skill in agent-skills-toolkit (`skills/askit-release/`, metadata version 0.1.0) | a GitHub Action / app that watches the default branch |
| Trigger | explicit human/agent invocation when cutting a release | automatic on every push of Conventional Commits to the default branch |
| Version computation | computes the plugin version by the Section 7.4 max-component-bump rule from component HISTORY; writes `library.json` and syncs `package.json` (U9) | derives the SemVer bump from Conventional Commit types since the last tag |
| Changelog | `changelog` mode promotes `[Unreleased]` to a dated section (Keep a Changelog) | maintains a release PR whose body is the generated changelog |
| Release notes | `notes` mode curates a distinct `RELEASE-NOTES.md` (Standard 10.6 / Gold G5) | not first-class; release notes derive from the changelog |
| Readiness gate | `gate` mode runs the release-readiness checks (ADR 0022): U9 version consistency, dated CHANGELOG section, RELEASE-NOTES present, README current, generated surfaces drift-free, conformance gate green, Codex round-trip recorded | none; readiness is whatever CI enforces independently |
| Tagging | does not tag/push by itself today; prepares and verifies | merging the release PR creates the tag and GitHub Release |
| Prerequisite | reads component HISTORY; does not require Conventional Commits | hard-requires Conventional Commits on the default branch |
| Human in the loop | yes, by design (judgment at each mode) | the release PR is the review surface; merge is the gate |

### Decision criteria for Phase 5

Choose per repo against these criteria, recorded as a MADR 4.0 ADR (https://adr.github.io/madr/) in each repo's `docs/internal/decisions/` (D4):
1. Is the default-branch commit history clean Conventional Commits today? release-please needs this; askit-release does not. The commitlint hook (below) is the gate that makes it true.
2. How much release judgment does the repo need? A leaf plugin with mechanical releases tolerates automation; a repo with curated, narrative releases wants the agent's `notes` mode.
3. Does the repo need the Section 7.4 component-rollup computation that release-please does not natively do?
4. CI surface: release-please adds an external Action dependency; askit-release keeps the toolchain in-repo and portable.

### Recommendation

- Adopt release-please as the EXECUTE engine for the leaf plugin repos. Once Conventional Commits is enforced, the bot derives the bump, maintains the changelog, and creates the tag and GitHub Release deterministically, removing per-release human toil. Confirm the current release-please config surface against its docs before wiring it (Context7 or the release-please repo).
- Reposition askit-release as prepare-plan-and-verify-gates, not tag-and-push. Its `version` (Section 7.4 rollup), `changelog`, `notes`, and `gate` modes become the G2 and G0/G2.5 readiness machinery feeding the go/no-go checklist; the actual tag is created by release-please on PR merge. This resolves the overlap (two things tagging) and plays each tool to its strength: askit-release knows the Standard, release-please knows the git/CI plumbing.
- Keep the agent-plugins marketplace re-pin bespoke under `validate-registry`. It is a registry-version line, not a plugin release; it pins by sha and has its own changelog convention. Do not route it through release-please.

The decision is not ratified until Phase 5 and is recorded by an ADR per repo (D4); until then this recommendation is the default direction, not a mandate.

## Layer 3 - NOTES

- `CHANGELOG.md` is the curated source of truth. Format: Keep a Changelog 1.1.0 (https://keepachangelog.com/en/1.1.0/), SemVer (https://semver.org/spec/v2.0.0.html). The Standard already mandates the two artifacts are distinct: `CHANGELOG.md` is the full technical history, `RELEASE-NOTES.md` is curated user-facing highlights, and they MUST NOT be conflated (Standard Section 10.6; Gold check G5 is the release-notes presence check).
- The GitHub Release body is DERIVED from the changelog, never hand-maintained as a separate truth. Under release-please the release PR body is the generated changelog; under askit-release the maintainer copies the dated `[X.Y.Z]` section. Either way the changelog entry is authored first and the Release body follows it.
- `[Unreleased]` accrues entries during the cycle and is promoted to a dated `[X.Y.Z]` section at release (askit-release `changelog` mode; release-please's PR). This matches the agent-plugins `CHANGELOG.md`, which already declares Keep a Changelog 1.1.0 + SemVer and carries a live `[Unreleased]` section.

## Prerequisite - Conventional Commits and the commitlint hook

Conventional Commits (https://www.conventionalcommits.org/en/v1.0.0/) is the LOAD-BEARING prerequisite for any release automation. release-please cannot derive a bump without it, and a hand-authored changelog is less reliable without a typed commit history to mine.

Enforcement is the one canonical demonstrative hook from D9 (hooks): a commitlint `commit-msg` hook. It does double duty - a worked hook exemplar AND the mechanism that unblocks this subsystem by guaranteeing typed commits. The hook follows the ratified Claude Code hook contract (D9): exit 0 with stdout JSON on pass, exit 2 with stderr fed back as the blocking message, plugin paths referenced only via `${CLAUDE_PLUGIN_ROOT}`, `hookEventName` present in structured output. Confirm the live contract against the Claude Code hooks reference (https://code.claude.com/docs/en/hooks) before shipping. The commitlint hook is pushed one-PR-per-repo as a mechanical convention (D2 PUSH; see `drafts/orchestration-campaigns.md`). The dash-ban remains a RECOMMENDED family convention, NOT a mandated check (Standard v0.11 retired the no-dashes check; re-mandating it would contradict the Standard).

### The prerequisite chain

Conventional Commit type -> SemVer bump -> Keep a Changelog category:

| Conventional Commit type | SemVer bump (plugin) | Keep a Changelog category |
|---|---|---|
| `fix:` | PATCH | Fixed |
| `feat:` | MINOR | Added |
| `feat:` that changes existing behavior | MINOR | Changed |
| `deprecate` (a `feat`/`chore` marking deprecation) | MINOR | Deprecated |
| removal of a deprecated surface | MAJOR | Removed |
| any commit with `!` or a `BREAKING CHANGE:` footer | MAJOR | Changed / Removed |
| `docs:`, `chore:`, `test:`, `refactor:`, `style:`, `ci:` | none (no release on their own) | omitted, or Changed if user-visible |
| `perf:` | PATCH (MINOR if user-visible improvement) | Changed |
| a security fix | PATCH or higher | Security |

This chain composes with the Standard Section 7.4 component-rollup rule: a component's own MAJOR/MINOR/PATCH bump (any component MAJOR forces a plugin MAJOR) and the commit-derived bump MUST agree; the plugin version is the max of the component bumps since the last release.

### What counts as a breaking plugin change (-> MAJOR)

A change is breaking - forcing a plugin MAJOR and a `BREAKING CHANGE:` footer - when it breaks an installed consumer's expectations:

- A component is removed or renamed (a skill, subagent, command, or hook that no longer exists at its prior name). Disappearing from disk is a broken chain contract.
- An invocation name changes (a slash-command name, a skill `name`, a subagent `@`-mention handle, or an MCP tool name a consumer scripts against).
- A chain contract breaks (a subagent or skill that previously chained to a now-removed or renamed target - an orphan or phantom in Standard terms).
- Raised permissions (a hook or component now requests broader `allowed-tools`, new write scopes, or a higher trust surface than the prior version granted).
- A required frontmatter or manifest field changes meaning or type in a way that breaks downstream tooling (per the D11 schemas).

Non-breaking by contrast: adding a new component (MINOR / Added), fixing behavior without changing an interface (PATCH / Fixed), or documentation-only changes (no release).

## Ratification path (Phase 5)

Per the sequencing invariants, every clause below lands with a named enforcing check OR an explicit aspirational label; nothing ratifies from a non-conforming exemplar; the Standard version, ADR number, and section number are allocated only at LAND on the protected branch.

| Element | Layer | Phase 5 status target | Enforcement |
|---|---|---|---|
| `plan_vX.Y.Z/` structure + per-feature `spec.md`/`impl-plan.md` | PLAN | normative folder convention | frontmatter validation (D11) + presence check |
| go/no-go gate template (G0-G4) | PLAN | RECOMMENDED template, donated from pm-skills | aspirational label (no machine check on the checklist itself) |
| release-please vs askit-release split | EXECUTE | decided per repo via ADR (D4) | the repo's release CI is the check |
| `CHANGELOG.md` curated, GitHub Release derived | NOTES | normative (already partly in Standard 10.6) | G5 release-notes presence check; CHANGELOG-section check in askit-release `gate` mode |
| Conventional Commits enforced | prerequisite | normative for repos adopting automation | commitlint `commit-msg` hook (D9) |
| breaking-change definition | prerequisite | normative | component-removal / chain-contract checks already in the conformance runner |

## Cross-references

- D8 (release subsystem, three layers): this draft is its full text.
- D9 (hooks): the commitlint `commit-msg` hook and the exit-code contract; full hook spec in `drafts/standard-amendments.md`.
- D4 (decision homes): per-repo EXECUTE choice recorded as a MADR 4.0 ADR in `docs/internal/decisions/`.
- D11 (frontmatter): `spec.md` / `impl-plan.md` schemas in `drafts/frontmatter-schemas.md`.
- D2 (rollout: Hybrid): the commitlint hook ships as a PUSH campaign; see `drafts/orchestration-campaigns.md`.
- `drafts/ci-repin-check.md`: the bespoke marketplace re-pin gate this subsystem feeds.
- External: SemVer https://semver.org/spec/v2.0.0.html ; Keep a Changelog https://keepachangelog.com/en/1.1.0/ ; Conventional Commits https://www.conventionalcommits.org/en/v1.0.0/ ; MADR 4.0 https://adr.github.io/madr/ ; Claude Code hooks https://code.claude.com/docs/en/hooks .
