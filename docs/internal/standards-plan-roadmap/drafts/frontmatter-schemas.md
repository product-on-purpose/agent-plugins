# Frontmatter Schemas (one per artifact type)

Draft text for decision D11 (frontmatter: one schema per artifact type). This file defines exactly one frontmatter schema for each of the four artifact types the family authors - skill (`SKILL.md`), ADR (MADR 4.0), published doc page, and spec - and states for each its required keys, optional keys, value types, constraints, the CI check that validates it (error vs warn), and a copy-pasteable example. It is staged for the Phase 3 (scaffolding and dual-audience) Standard amendment + CONTRIBUTING.md promotion; it is planning text, not yet normative. The companion draft for the actual Standard clause language lives in `standard-amendments.md`; the listing-contract touchpoints live in `contributing-edits.md`.

## Universal constraints (apply to every schema below)

These hold for all four artifact types unless a schema overrides them. They are the D11 invariants.

| Rule | Statement | Rationale |
|---|---|---|
| Kebab-case keys | Every frontmatter key MUST be kebab-case (`a-z0-9` and `-`), e.g. `doc-role`, `decision-makers`, `agent-targets`. | One key style across artifacts; matches the Standard's component `metadata` keys (STANDARD.md sec 3.7) and the docs taxonomy (sec 8.4). |
| Version-like scalars quoted | Any version-like value (`version`, `standard`, `remove-in`) MUST be a quoted string, e.g. `version: "1.2.0"`, not `version: 1.2.0`. | Unquoted `1.2.0` is fine but `1.0` and `1.10` coerce to YAML floats and lose the trailing zero. Quoting is the deterministic safe form per YAML 1.2.2 https://yaml.org/spec/1.2.2/ . |
| Date-like scalars quoted | Any date value (`date`, `updated`) MUST be a quoted `YYYY-MM-DD` string, e.g. `date: "2026-06-17"`. | An unquoted `2026-06-17` is parsed as a YAML timestamp, not a string, which breaks string comparison in the gate. Quoting forces a string. |
| Arrays are arrays | Any multi-value key (`tags`, `agent-targets`, `decision-makers`, `consulted`, `informed`, `args`, `steps`) MUST be a YAML sequence (`[a, b]` or block list), never a comma-joined string. | The Standard's existing `docs-frontmatter` check (G7) already rejects a non-array `tags`; D11 generalizes that rule. |
| Required keys present | Each schema names its required keys; a missing required key is an `error` (see per-schema CI rows). | Required-key validation in CI is the load-bearing half of D11. |
| Enums are closed | Enum-valued keys (`audience`, `level`, `status`, `tier`, `type`) MUST hold one of the listed values exactly (lowercase). | Closed enums let the gate validate by set membership, model-free. |

The agentskills.io specification https://agentskills.io/specification.md is the FLOOR for the skill schema (name regex, 64-char name cap, 1024-char description cap). The family schemas extend it but MUST NOT relax it. RFC 2119 keywords are used per BCP 14 / RFC 8174 https://www.rfc-editor.org/rfc/rfc8174 .

---

## 1. Skill schema (`SKILL.md`)

The skill schema is the agentskills.io frontmatter (the portable floor, confirmed against https://agentskills.io/specification.md ) plus this Standard's conventional `metadata` keys (STANDARD.md sec 3.7). Skills are the only artifact type whose floor is owned by an external spec; everything below the floor line is a family convention layered on top.

### Floor (agentskills.io, MUST)

| Key | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | REQUIRED | 1-64 chars; lowercase `a-z` / `0-9` / `-`; no leading, trailing, or consecutive hyphen; MUST equal the parent directory name. Regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`. |
| `description` | string | REQUIRED | 1-1024 chars; non-empty; MUST state what the skill does AND when to use it, with trigger keywords (sec 8.1 discoverability bar). |
| `license` | string | OPTIONAL | License name or reference to a bundled license file. |
| `compatibility` | string | OPTIONAL | 1-500 chars; environment / product requirements; used for tier declaration. |
| `metadata` | map (string keys) | OPTIONAL | Arbitrary string-keyed map; the family's conventional keys live here (below). |
| `allowed-tools` | string | OPTIONAL, QUARANTINED | Space-separated pre-approved tools. Experimental in agentskills.io; treated by this Standard as a Claude-Code-only labeled extension (see Quarantine note). |

### Family conventions (inside `metadata`, per STANDARD.md sec 3.7)

`version` is REQUIRED on every component at every tier (sec 3.7 / 7.3). The rest are RECOMMENDED for governance. All keys are kebab-case; `version` is quoted; `updated` is a quoted date; `agent-targets` is an array.

| `metadata` key | Type | Required | Constraints |
|---|---|---|---|
| `version` | string (semver) | REQUIRED | Quoted. When a `HISTORY.md` is present, MUST equal its latest entry (sec 3.7 / 7.3; enforced by `version-match`). |
| `updated` | string (date) | RECOMMENDED | Quoted `YYYY-MM-DD`. |
| `tier` | enum | RECOMMENDED | One of `universal`, `convergent`, `advanced`. |
| `audience` | enum | RECOMMENDED | One of `beginner`, `intermediate`, `advanced`. |
| `category` | string | RECOMMENDED | Free-form taxonomy label. |
| `agent-targets` | array | RECOMMENDED | Subset of `["claude", "codex"]`. Load-bearing under D10 (truth-in-targeting): a declared target MUST ship its native distribution + context shim or be dropped. |
| `status` | enum | RECOMMENDED | One of `active`, `deprecated`, `experimental`. |
| `deprecated-by` | string | conditional | REQUIRED when `status: deprecated`; names the replacement component. |
| `remove-in` | string (version) | conditional | Quoted; target plugin version for removal when deprecated. |

### Quarantine (Claude-Code-only fields, per D10 / D11)

Fields that are NOT on the agentskills.io floor and are read only by Claude Code are quarantined as labeled extensions so one skill body degrades gracefully across tools (never fork the skill per tool). They are permitted but flagged as non-portable; a `codex`-targeted skill MUST NOT depend on them for correctness:

`allowed-tools`, `model`, `disable-model-invocation`, and any future Claude-Code-only frontmatter (context-fork directives, etc.). These are quarantined, not banned: a Claude-only skill MAY use them; the gate records them as Claude-scoped so a Codex consumer is not surprised.

### CI validation

| Check | reqId | Severity | What it validates |
|---|---|---|---|
| `frontmatter-valid` | U3 | `error` | `name` is a string and (when it equals its directory) matches the regex and 64-char cap; `description` is a string within 1-1024 chars. Confirmed live in `scripts/checks/frontmatter-valid.mjs`. |
| `name-matches-dir` | U4 | `error` | `name` equals the parent directory name. |
| `description-score` | (sec 8.1) | `warn` | Heuristic 0-1 discoverability score; emits `warn` below 0.7, never `error`. |
| `version-match` | (sec 3.7 / 7.3) | `error` | `metadata.version` agrees with `HISTORY.md` when both present. |
| frontmatter-schema (NEW, Phase 3) | proposed `U` check | `warn` then `error` | The D11 addition: validates the `metadata` key TYPES (quoted version/date scalars, `agent-targets` is an array, enum membership for `tier` / `audience` / `status`) and the quarantine labeling. Ships `warn` for one Standard MINOR per the sec 7.7 burndown, then `error`. |

### Example

```yaml
---
name: jp-spec
description: Create a feature specification document optimized for agent execution. Use after a strategy brief, when committing requirements, or when the user says "create spec" or "spec for feature X". Produces a spec.md with frontmatter, acceptance criteria, and source citations.
license: MIT
compatibility: Designed for Claude Code and Codex CLI
metadata:
  version: "1.4.0"
  updated: "2026-06-17"
  tier: convergent
  audience: intermediate
  category: planning
  agent-targets: [claude, codex]
  status: active
# Quarantined (Claude-Code-only) example, used only by a claude-targeted skill:
# allowed-tools: Bash(git:*) Read
---
```

---

## 2. ADR schema (MADR 4.0)

ADRs follow MADR 4.0 https://adr.github.io/madr/ , confirmed against the live template. Per D4 (decision homes) every repo records its own ADRs in `docs/internal/decisions/` with `NNNN-` numbering, status frontmatter, immutable once accepted; the family-law ADRs live in `agent-plugins/standards/decisions/`. The frontmatter keys below are exactly the MADR optional metadata block, with the family overlay that they are quoted/typed per the universal constraints and that `status` and `date` are REQUIRED (MADR makes the whole block optional; the family tightens to require these two so the decision record is auditable).

| Key | Type | Required | Constraints |
|---|---|---|---|
| `status` | enum | REQUIRED (family) | MADR set: `proposed`, `rejected`, `accepted`, `deprecated`, or `superseded by NNNN-...`. Lowercase keyword; the superseded form names the superseding ADR. |
| `date` | string (date) | REQUIRED (family) | Quoted `YYYY-MM-DD`; the date the decision was last updated. |
| `decision-makers` | array | OPTIONAL | List of involved parties. |
| `consulted` | array | OPTIONAL | Subject-matter experts with two-way communication. |
| `informed` | array | OPTIONAL | Stakeholders kept up to date one-way. |

Body sections (markdown, not frontmatter) follow the MADR template: Title; Context and Problem Statement; Decision Drivers (optional); Considered Options; Decision Outcome (with optional Consequences and Confirmation); Pros and Cons of the Options (optional); More Information (optional). The Standard adds one family body rule used by the `docs-presence` check (G10): each ADR under `docs/internal/decisions/NNNN-*.md` carries a `## TL;DR` (STANDARD.md sec 2.6 G10 / 10.4).

Note on the numbering identifier: the `NNNN-` sequence number lives in the FILENAME (e.g. `0035-skill-registration.md`), not in a frontmatter key, matching the on-disk convention in `agent-skills-toolkit/docs/internal/decisions/` and `agent-plugins/standards/decisions/`. Do not invent an `id:` key.

### CI validation

| Check | Severity | What it validates |
|---|---|---|
| `docs-presence` (G10) | `error` (Gold, conditional on a docs tree) | Each `docs/internal/decisions/NNNN-*.md` carries a `## TL;DR`. Confirmed in the Gold check set (STANDARD.md sec 2.6). |
| adr-frontmatter (NEW, Phase 3) | `warn` then `error` | The D11 addition: validates `status` and `date` are present, `status` is a MADR keyword, `date` is a quoted `YYYY-MM-DD` string, and `decision-makers` / `consulted` / `informed` (when present) are arrays. Ships `warn` for one Standard MINOR per sec 7.7, then `error`. Decisions in scratch are out of scope (D4: decisions NEVER live in scratch). |

Note: `docs-frontmatter` (G7) does NOT apply to ADRs, because it excludes the entire `docs/internal/` tree (confirmed in `scripts/checks/docs-frontmatter.mjs`, which skips `docs/internal/`). ADR frontmatter is therefore validated by the new adr-frontmatter check, not by G7.

### Example

```yaml
---
status: accepted
date: "2026-06-13"
decision-makers: [maintainers]
consulted: [codex-review]
informed: [contributors]
---

# 0035. Skill registration is a Universal-tier requirement

## TL;DR
A plugin whose manifest enumerates skills MUST register every skill it ships, and every registered skill MUST exist on disk.

## Context and Problem Statement
...
```

---

## 3. Doc-page schema (published `docs/**`)

This is the existing Standard taxonomy from STANDARD.md sec 8.4, already enforced by the live `docs-frontmatter` check (G7). It applies to every published page under `docs/**` EXCEPT `docs/internal/` (which is committed maintainer governance, never published, and out of scope - confirmed in `scripts/checks/docs-frontmatter.mjs`). D11 does not change this schema; it is restated here so the package carries all four schemas in one place.

| Key | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | REQUIRED | Non-empty. |
| `description` | string | REQUIRED | Non-empty; follows the sec 8.1 shape; MUST NOT contain a colon-space (`": "`). Restructure with a comma or a space-hyphen-space. |
| `audience` | enum | REQUIRED | One of `non-engineer`, `engineer`, `both`. (Note: this enum differs from the skill `audience` enum, which is `beginner` / `intermediate` / `advanced` - they are deliberately different vocabularies for different artifacts.) |
| `level` | enum | REQUIRED | One of `beginner`, `intermediate`, `advanced`. |
| `tags` | array of strings | OPTIONAL | When present, MUST be an array of strings (the gate rejects a comma-string). |
| `doc-role` | string | OPTIONAL | Path-independent structural marker, e.g. `architecture-overview` / `architecture-detailed`. Used by `docs-presence` (G10) to verify the overview page links the detailed page. |

The colon-space ban on `description` exists because the documentation site (Pattern S astro sites) parses these into its own frontmatter and a colon-space corrupts the generated page metadata.

### CI validation

| Check | reqId | Severity | What it validates |
|---|---|---|---|
| `docs-frontmatter` | G7 | `error` (Gold, conditional on a published `docs/` tree) | `title` and `description` non-empty strings; `description` has no colon-space; `audience` and `level` in their enums; `tags` (if present) an array of strings. Confirmed live in `scripts/checks/docs-frontmatter.mjs`. A plugin with no `docs/` tree passes vacuously. |
| `docs-presence` | G10 | `error` (Gold, conditional) | Diataxis quadrants non-empty; `doc-role: architecture-overview` page resolvably links the `architecture-detailed` page. |

### Example

```yaml
---
title: Adopting the Standard in an existing repo
description: How to run askit-migrate to bring an existing plugin to Bronze, when to use it, and what it changes
audience: engineer
level: intermediate
tags: [migration, adoption, bronze]
doc-role: architecture-overview
---
```

---

## 4. Spec schema (`spec.md`)

Specs are a family artifact (the `jp-spec` output and the D8 release-plan feature specs at `docs/internal/release-plans/plan_vX.Y.Z/<feature>/spec.md`). Specs live UNDER `docs/internal/`, so they are out of scope for `docs-frontmatter` (G7); D11 defines their own schema and a new check. The schema is deliberately small and agent-execution-oriented: enough for traceability and a machine-updatable status block, no more.

| Key | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | REQUIRED | Non-empty; the feature name. |
| `description` | string | REQUIRED | Non-empty; what the feature is and the outcome it delivers; no colon-space (same rule as doc pages, for tooling consistency). |
| `status` | enum | REQUIRED | One of `draft`, `approved`, `in-progress`, `done`, `superseded`. |
| `version` | string (semver) | OPTIONAL | Quoted; the spec revision. |
| `updated` | string (date) | OPTIONAL | Quoted `YYYY-MM-DD`. |
| `effort` | string | OPTIONAL | Handle of the related effort or campaign (e.g. an `FC-NNNN` orchestration campaign id per D13). |
| `plan` | string | OPTIONAL | Repo-relative path to the related impl-plan (`impl-plan.md`) so spec and plan cross-link (D8 PLAN layer). |
| `agent-targets` | array | OPTIONAL | Subset of `["claude", "codex"]` when the feature is target-specific. |

Body convention (markdown, not frontmatter, matching `jp-spec`): an agent-updated Task Summary block near the top, then Acceptance Criteria with source citations, then links to the related effort and plan. The frontmatter is the contract surface; the Task Summary is the agent's working state.

### CI validation

| Check | Severity | What it validates |
|---|---|---|
| spec-frontmatter (NEW, Phase 3) | `warn` then `error` | The D11 addition: `title`, `description`, `status` present; `status` in its enum; `description` has no colon-space; `version` / `updated` quoted scalars when present; `agent-targets` an array when present; `plan` (if present) resolves to a file on disk. Scoped to `docs/internal/release-plans/**/spec.md` and any path a repo declares as a spec home. Ships `warn` for one Standard MINOR per sec 7.7, then `error`. |

### Example

```yaml
---
title: Marketplace re-pin conformance check
description: validate-registry verifies each pinned-sha repo carries a library.json with a standard pin and CI green
status: approved
version: "0.2.0"
updated: "2026-06-17"
effort: FC-0007
plan: ./impl-plan.md
agent-targets: [claude]
---
```

---

## Summary: schema-to-check map

| Artifact | Schema source | Required keys | Validating check(s) | New in Phase 3? |
|---|---|---|---|---|
| Skill (`SKILL.md`) | agentskills.io floor + STANDARD.md sec 3.1 / 3.7 | `name`, `description`, `metadata.version` | `frontmatter-valid` (U3, error), `name-matches-dir` (U4, error), `description-score` (warn), `version-match` (error); + frontmatter-schema (new, warn->error) | metadata-type validation is new |
| ADR (MADR 4.0) | MADR 4.0 + D4 overlay | `status`, `date` | `docs-presence` (G10, `## TL;DR`); + adr-frontmatter (new, warn->error) | adr-frontmatter is new |
| Doc page (`docs/**`) | STANDARD.md sec 8.4 | `title`, `description`, `audience`, `level` | `docs-frontmatter` (G7, error), `docs-presence` (G10) | no (already enforced) |
| Spec (`spec.md`) | D8 / D11 family convention | `title`, `description`, `status` | spec-frontmatter (new, warn->error) | spec-frontmatter is new |

Sequencing note: per the roadmap invariant, none of the three new checks (frontmatter-schema, adr-frontmatter, spec-frontmatter) is ratified without a named enforcing check, and each ships under the sec 7.7 burndown (one MINOR as `warn`, then `error`) so a downstream plugin gets a one-version migration window. They land in Phase 3 (scaffolding and dual-audience) alongside the CONTRIBUTING.md promotion and the canonical folder layout from D5 / D6.

## Open flags for reviewers

- The skill `audience` enum (`beginner` / `intermediate` / `advanced`, from STANDARD.md sec 3.7) and the doc-page `audience` enum (`non-engineer` / `engineer` / `both`, from sec 8.4) are intentionally DIFFERENT vocabularies. Confirm Phase 3 does not try to unify them; they answer different questions (skill reader skill level vs doc reader role).
- The spec `status` enum here (`draft` / `approved` / `in-progress` / `done` / `superseded`) is proposed, not yet in any source file; reconcile with the actual `jp-spec` Task Summary states before ratifying.
- The three new checks need `since` values assigned at LAND on the protected branch per the allocation-at-land invariant; do not pre-allocate reqIds in the draft.
- `standard-amendments.md` must carry the matching normative clause text for the three new checks; this file is the schema reference, not the clause.
