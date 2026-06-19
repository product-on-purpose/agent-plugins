# 04 - The standards definition (readable form)

> The intended rule-set, in readable pre-clause form, so a human can review the whole thing in one place before any of it becomes ratified clause text. This file says WHAT the Standard and the listing contract WILL require after the roadmap lands; it summarizes and cross-references rather than restating exact clause wording. The land-ready clause text lives in the `drafts/` files referenced throughout. Authoring law is the [Advanced Skill Library Standard](https://github.com/product-on-purpose/agent-skills-toolkit/blob/main/STANDARD.md) (header version 0.12, amended 2026-06-13); the listing contract is [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) (clauses L1-L6). Both use RFC 2119 keywords as defined in [BCP 14 / RFC 8174](https://www.rfc-editor.org/rfc/rfc8174).

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are used as defined in RFC 2119 / BCP 14.

## How to read this file

Each section below is one topic of the intended rule-set, mapped to the locked decision (D-number) that fixed it and the roadmap phase (see [`02-roadmap.md`](02-roadmap.md)) that lands it. Where a section needs field-level schema or exact clause wording, it points to a `drafts/` file. Nothing here is normative on its own: it is the readable spec that the draft clauses implement.

| Topic | Decision | Lands in | Clause draft |
|---|---|---|---|
| Canonical folder layout | D5 (dissolve _agent-context), D6 (casing) | Phase 3 (scaffolding and dual-audience) | [`drafts/standard-amendments.md`](drafts/standard-amendments.md) |
| Three decision homes | D4 (decision homes) | Phase 3 | [`drafts/standard-amendments.md`](drafts/standard-amendments.md) |
| AGENTS.md + thin shim contract | D5, D10 (truth-in-targeting) | Phase 3 | [`drafts/agents-md-and-context.md`](drafts/agents-md-and-context.md) |
| Frontmatter per artifact type | D11 (frontmatter) | Phase 3 | [`drafts/frontmatter-schemas.md`](drafts/frontmatter-schemas.md) |
| Release-plans convention | D8 (release subsystem) | Phase 3 (PLAN) / Phase 5 (EXECUTE) | [`drafts/release-subsystem.md`](drafts/release-subsystem.md) |
| Exceptions rule | D12 (exceptions) | Phase 5 (process and hooks) | [`drafts/standard-amendments.md`](drafts/standard-amendments.md) |
| Hooks contract | D9 (hooks) | Phase 5 | [`drafts/standard-amendments.md`](drafts/standard-amendments.md) |
| Cross-tool / truth-in-targeting | D10 | Phase 2 (advisory) / Phase 4 (blocking) | [`drafts/cross-tool-targeting.md`](drafts/cross-tool-targeting.md) |

A clause is ratified only with a named enforcing check OR an explicit aspirational label, and only from a conforming exemplar; the Standard version, ADR number, and section number are allocated at LAND on the protected branch ([`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 6).

---

## A. The canonical repository folder layout

This is the single intended on-disk shape every family plugin converges to. It tightens the existing Standard Section 10.1 layout with three locked decisions: D5 (dissolve _agent-context) removes the `_agent-context/` concept entirely, D6 (casing) fixes lowercase `_local/` and lowercase plural `session-logs/`, and D4 (decision homes) fixes the per-repo decision home at `docs/internal/decisions/`. Components are present per the plugin's declared tier (Standard Section 2); a Bronze plugin ships only the Universal pieces.

```
<plugin>/                            repository root
  AGENTS.md                          cross-tool context + navigation entrypoint   [agent, canonical]
  CLAUDE.md                          thin shim: one pointer to AGENTS.md           [agent, Claude Code]
  library.json                       canonical cross-agent manifest (authored SoT) [agent]
  .claude-plugin/
    plugin.json                      Claude native manifest (generated from library.json) [agent]
  .codex-plugin/                     Codex native manifest, ONLY if codex is a delivered target (see G below)
    plugin.json
  .mcp.json                          portable MCP server definitions, when the plugin ships MCP  [agent]
  README.md                          human overview / pitch                        [human]
  CHANGELOG.md                       full release history (Keep a Changelog)        [both]
  INDEX.md                           human map of components (generated)            [human]
  skills/<skill>/                    per-skill layout (Standard Section 10.2)
  agents/                            Claude Code SUBAGENT components only           [agent]
  commands/                          slash commands                                 [agent]
  hooks/                             event hooks (hooks.json + scripts)             [agent]
  _workflows/                        multi-skill workflow chains
  templates/                         scaffolding templates (SKILL.md, ADR, eval-set)
  docs/
    internal/                        committed maintainer governance               [maintainer]
      decisions/                     this repo's own ADRs (MADR 4.0, NNNN-)         [maintainer]
      release-plans/                 plan_vX.Y.Z/ per-release plan folders (D8 PLAN) [maintainer]
      specs/                         feature specs                                  [maintainer]
      rfcs/                          cross-cutting proposals                        [maintainer]
      backlog/                       new + enhancement backlogs (local-first)       [maintainer]
    {tutorials,how-to,reference,explanation}/   Diataxis public docs               [human]
  scripts/ (or tools/)               CI-agnostic validators / generators
  .github/workflows/                 CI that only shells out to scripts/
  _local/                            gitignored ephemeral scratch                   [both]
    session-logs/                    wrap-session output, gitignored                [both]
```

### Load-bearing rules of the layout

- **No `_agent-context/` directory, anywhere (D5).** The committed agent-facing layer is exactly `AGENTS.md` + the thin `CLAUDE.md` shim + `docs/internal/`. Raw scratch (session logs, drafts) is ephemeral under `_local/`. The principle: distill durable knowledge into its home (decisions, plans, specs); keep raw scratch gitignored. This retires the current split pattern where `_agent-context/*` is gitignored EXCEPT `_agent-context/session-logs/`, which is committed.
- **No `AGENTS/` folder (D5).** `AGENTS.md` is the orientation FILE at the root, not a directory. The name `agents/` (lowercase) is reserved exclusively for Claude Code subagent components and MUST NOT hold session logs or agent knowledge. The name `.agents/` is reserved by Codex and is not created speculatively (see G below).
- **Lowercase `_local/`, lowercase plural `session-logs/` (D6).** Windows is case-insensitive, so a mixed `_LOCAL/` and `_local/` is a git case-collision footgun; one lowercase spelling is the truth. `session-logs/` (plural) resolves the prior `SESSION-LOG` / `session-log` / `session-logs` drift.
- **`docs/internal/` is kept, not renamed to `docs/_internal` (D3).** All four repos already use `docs/internal/` consistently, and Pattern S (the astro-sites domain at [`standards/domains/astro-sites/`](../../../standards/domains/astro-sites/README.md)) already separates published site content (under `site/src/content/docs/`) from repo-root `docs/`, which is governance-only and never built. Renaming would be pure fleet churn.
- **`docs/internal/release-plans/` and `docs/internal/specs/` are new home folders** added to the Standard's Section 10.1 layout (the current layout names `decisions/`, `rfcs/`, `backlog/` but not these). `release-plans/` carries the D8 PLAN layer (Section E below); `specs/` carries feature specs.

The mechanical parts of converging to this layout (the casing rename, the `adr/` to `decisions/` rename, adding the `CLAUDE.md` shim) are PUSHED one-PR-per-repo per D2 (Hybrid rollout); the Standard version pin itself is PULLED on each plugin's own cadence ([`drafts/orchestration-campaigns.md`](drafts/orchestration-campaigns.md)).

---

## B. The three decision homes (D4)

"Standard" and "decision" each mean several things in this family; each kind has exactly one home. This mirrors [`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 2 and adds the per-repo convergence direction.

| Kind of decision | Question it answers | Home | Format |
|---|---|---|---|
| Standard family-law decisions | How does the Standard itself change, and why? | `agent-plugins/standards/decisions/` | MADR 4.0 ADRs (`NNNN-`) |
| Plugin-specific decisions | Why did THIS plugin choose X internally? | each plugin's `docs/internal/decisions/` | MADR 4.0 ADRs (`NNNN-`) |
| Listing-contract decisions | What makes a repo listable in the marketplace? | `agent-plugins/CONTRIBUTING.md` (the contract) + `standards/decisions/` (the decisions behind it) | thin clauses + ADRs |

Rules:

- Each repo records its own internal decisions as [MADR 4.0](https://adr.github.io/madr/) ADRs in `docs/internal/decisions/`: `NNNN-` numbering, status frontmatter, immutable once accepted.
- Decisions NEVER live in scratch (`_local/`). A decision that matters enough to record is durable and committed; promotion flows scratch -> accepted decision -> committed ADR.
- The Standard's own family-law ADRs live separately in `agent-plugins/standards/decisions/` (correct and distinct from any plugin's ADRs); [ADR 0001 (standard governance and canonical home)](../../../standards/decisions/0001-standard-governance-and-home.md) is the first of that trail.

Convergence the roadmap drives (current on-disk state to target):

| Repo | Current decision home | Target |
|---|---|---|
| agent-skills-toolkit | `docs/internal/decisions/` | already correct, no change |
| writing-style-catalog | `docs/internal/adr/` | rename `adr/` -> `decisions/` |
| pm-skills | `DECISIONS.md` ad-hoc log | convert to proper ADRs + a thin generated index |
| thinking-framework-skills | none yet | create `docs/internal/decisions/` on first ADR |

---

## C. The AGENTS.md + thin shim contract (D5, D10)

There is one canonical cross-tool context source per repo: **`AGENTS.md` at the repository root** ([agents.md](https://agents.md/), already supported natively by both Claude Code and Codex). Every other tool that reads its own context file gets a THIN shim that points at `AGENTS.md`, never a divergent copy.

### What root AGENTS.md MUST contain

Per Standard Section 3.10 (AGENTS.md is Universal-tier, REQUIRED at the repository root at every tier), AGENTS.md is the first thing an agent reads, and it is the agent-facing counterpart to the human `INDEX.md`. It MUST carry:

- project conventions (the house rules an agent must follow);
- build / test / lint commands;
- review expectations;
- a pointer into the plugin's components (the navigation map);
- resolvable internal links; its component and count references MUST stay in sync with `library.json` and the on-disk components (drift is an `error`, Standard Section 10.3).

### The thin-shim rule

- Claude Code reads `CLAUDE.md`. Every repo with `claude` as a delivered target ships a `CLAUDE.md` that is a THIN shim: a single pointer to `AGENTS.md`, never a second divergent copy of the conventions.
- `GEMINI.md` is created only if `gemini` becomes a declared, delivered target. No repo declares Gemini today, so no repo carries a `GEMINI.md`.
- A drift to fix in Phase 3: `thinking-framework-skills` and `agent-skills-toolkit` currently LACK the `CLAUDE.md` shim (only `pm-skills` and `writing-style-catalog` have one). All four root `AGENTS.md` already exist.

The deeper rule binding shims to declared targets is truth-in-targeting (Section G below): a repo MUST NOT carry a context shim for a tool it does not actually deliver to, and MUST carry one for every tool it does. Full clause text and the per-target shim table are in [`drafts/agents-md-and-context.md`](drafts/agents-md-and-context.md).

---

## D. Frontmatter, per artifact type (D11)

One frontmatter schema per artifact type, validated in CI. This file gives the overview; the field-level schema for every artifact type is in [`drafts/frontmatter-schemas.md`](drafts/frontmatter-schemas.md).

Universal rules across all artifact types:

- **Keys are kebab-case.**
- **Version-like and date-like scalars are always quoted** (e.g. `"0.12"`, `"2026-06-13"`) to avoid [YAML 1.2.2](https://yaml.org/spec/1.2.2/) float and date coercion.
- **Types are correct:** a `keywords` (or `tags`) array is a YAML array, never a comma-joined string.
- **Required keys are validated in CI;** a missing required key is a check failure at the artifact's tier.
- **The agentskills.io caps are the floor** for skills ([agentskills.io specification](https://agentskills.io/specification.md)): the `name` regex and 64-char cap, and the 1024-char `description` cap. These are the existing Standard Section 3.1 rules.
- **Claude-Code-only fields are quarantined as labeled extensions** (per D10), not mixed into the portable floor: `allowed-tools`, `model`, `disable-model-invocation`, context-fork settings, and similar live in a labeled extension area so one skill body degrades gracefully across tools rather than forking per tool.

Artifact types with their own schema: skill (`SKILL.md`), ADR (`docs/internal/decisions/NNNN-*.md`), published doc (`docs/**` per the Standard Section 8.4 taxonomy: `title`, `description` with no colon-space, `audience`, `level`, optional `tags` / `doc-role`), and spec (`docs/internal/specs/`). Non-skill components (command, subagent, hook, workflow) follow the Standard Section 3.8 frontmatter contract.

---

## E. The release-plans convention (D8 PLAN layer)

The release subsystem has three layers (D8): PLAN, EXECUTE, NOTES. This section defines only the PLAN layer (a folder convention that lands in Phase 3); EXECUTE and NOTES are summarized in [`drafts/release-subsystem.md`](drafts/release-subsystem.md) and ratified in Phase 5.

PLAN layer:

- Per-release planning lives under `docs/internal/release-plans/plan_vX.Y.Z/` (one folder per planned release, named for its target SemVer version per [semver.org](https://semver.org)).
- Inside each `plan_vX.Y.Z/` there is one subfolder per feature, each holding `spec.md` (the contract) plus `impl-plan.md` (the execution steps).
- Each release plan carries a go / no-go checklist template, donated from the `pm-release-conductor` G0-G4 gate model, so a release decision is a recorded, repeatable gate rather than an ad-hoc call.

The source of truth for what shipped is a curated `CHANGELOG.md` ([Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)); the GitHub Release body is derived from it (NOTES layer). [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) is the load-bearing prerequisite for any release automation, which is why the commitlint commit-msg hook (D9) does double duty as the unblock for the EXECUTE layer.

---

## F. The exceptions rule (D12)

Conformance is graded against a repo's declared tier, and the tier ceiling is the PRIMARY exception mechanism.

- **Tier ceiling first.** A repo declares its target tier in `library.json` (`tier`: `universal` / `convergent` / `advanced`). Errors for clauses ABOVE that declared tier do not fail the repo's build; a repo simply does not assert clauses above its tier. This is the everyday way a plugin avoids a requirement it has not chosen to meet (Standard Section 2).
- **Genuine per-clause exceptions are explicit and auditable.** A real exception to a clause AT or below the repo's tier MUST carry both: an ADR in the repo's own `docs/internal/decisions/` recording the decision and its rationale, AND a machine-readable suppression the gate reads. There are NO silent suppressions.
- **Why both halves.** The ADR makes the exception auditable by a human; the machine-readable suppression makes stop-and-flag fleet pushes (D2) stop instead of clobbering a deliberate exception. This dovetails with the Standard's pinned-version grading and the consumer-side suppression baseline already described in Standard Section 7.7 (a published verdict clamps an attempt to dodge an objective or vendor-cited finding to at least a `warn`).

This rule is ratified in Phase 5 with a named enforcing check (the gate reads and honors the suppression file).

---

## G. The hooks contract (D9)

Overview here; the exit-code contract clause and the canonical exemplar hook are detailed in [`drafts/standard-amendments.md`](drafts/standard-amendments.md), grounded in the live [Claude Code hooks reference](https://code.claude.com/docs/en/hooks).

- **Ratify the Claude Code hook exit-code contract:** exit 0 with stdout JSON for structured output; exit 2 with stderr fed back as a blocking message. A blocking hook MUST emit an actionable message (already Standard Section 3.5 / Section 9).
- **Reference plugin paths only via `CLAUDE_PLUGIN_ROOT`** (the dollar-brace `${CLAUDE_PLUGIN_ROOT}` form), never hard-coded absolute paths.
- **Include `hookEventName`** in any structured JSON output.
- **Ship ONE canonical demonstrative hook:** a commitlint commit-msg hook. It does double duty: a worked hook exemplar AND the enforcement of Conventional Commits that unblocks the release subsystem (Section E).
- **The dash-ban is a RECOMMENDED family convention, NOT a mandated CHECK.** Standard v0.11 retired the `no-dashes` check (`U10`, ADR 0028) because house style is not a portability requirement; re-mandating it would contradict the Standard. A plugin MAY enforce it for itself with an opt-in `PreToolUse` hook (the toolkit already ships one).

Adding a new tool's hooks is an adapter operation, consistent with truth-in-targeting (next section).

---

## H. Cross-tool / truth-in-targeting, and Codex scope-to-truth (D10)

Overview here; the full truth-in-targeting clause, the per-target delivery matrix, and the Codex scope rule are in [`drafts/cross-tool-targeting.md`](drafts/cross-tool-targeting.md).

### Truth-in-targeting

`agent-targets` in `library.json` becomes load-bearing. A plugin MUST emit, and the gate MUST verify, the native distribution plus the context shim for EVERY declared target. If a target is not actually delivered, that target MUST be dropped from `agent-targets`. No claiming a target you do not deliver.

- One canonical context source (`AGENTS.md`); each declared target that reads its own file gets a thin shim (Section C).
- Skills sit on the [agentskills.io](https://agentskills.io/specification.md) portable floor; Claude-Code-only frontmatter is quarantined as labeled extensions (Section D) so one skill body degrades gracefully across tools. Never fork the skill per tool.
- Adding a tool is an adapter operation: declare it in `agent-targets`, emit its manifest, add its shim, and the gate verifies the trio.

This lands advisory in Phase 2 (CI keystone) and flips to blocking in Phase 4 (consolidate CI and graduate domains).

### Codex scope-to-truth

`"codex"` in `agent-targets` claims PORTABILITY, not native marketplace distribution:

- What `codex` legitimately claims today: agentskills.io-compatible skills plus root `AGENTS.md`. Both are already true and essentially free, because [Codex](https://developers.openai.com/codex/skills) reads agentskills.io skills and AGENTS.md natively.
- What it does NOT claim yet: native [Codex marketplace](https://developers.openai.com/codex/plugins) packaging (`.agents/plugins/` and `.codex-plugin/plugin.json` distribution). Defer building the native Codex emitter until a real Codex consumer exists.
- The upgrade path is trivial: `askit-init-marketplace` already scaffolds the Codex format, so promoting `codex` from portable to native is an adapter addition, not a rewrite.
- Build-time confirm before any Codex emitter ships: the exact on-disk Codex paths (`.agents/skills` vs `.codex/skills`; the precise marketplace manifest location) have version churn and MUST be reconfirmed against current Codex docs (this matches the residual at Standard Section 12 / Appendix A).

### The embedded-marketplace truth (Standard Section 12)

A plugin MUST NOT embed a marketplace that lists itself (the named anti-pattern). The marketplace is a separate concern; association points one way, marketplace to plugin, declared only in `agent-plugins/.claude-plugin/marketplace.json`. This is why `pm-skills` shipping an embedded self-listing `.claude-plugin/marketplace.json` is one of the two P0 conformance holes closed in Phase 1 (close P0 holes).

---

## What this file deliberately does NOT contain

- **Field-level schemas.** See [`drafts/frontmatter-schemas.md`](drafts/frontmatter-schemas.md).
- **Exact clause wording and section targets.** See [`drafts/standard-amendments.md`](drafts/standard-amendments.md) and [`drafts/contributing-edits.md`](drafts/contributing-edits.md).
- **The CI re-pin check spec.** See [`drafts/ci-repin-check.md`](drafts/ci-repin-check.md).
- **The orchestration campaigns** that push the mechanical conventions. See [`drafts/orchestration-campaigns.md`](drafts/orchestration-campaigns.md).
- **The phase sequencing and exit criteria.** See [`02-roadmap.md`](02-roadmap.md). The full decision rationale per D-number is in [`03-decisions.md`](03-decisions.md).
