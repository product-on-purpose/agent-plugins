# Draft: AGENTS.md and the dual-audience development context

This draft supplies the ready-to-use templates and on-disk layout for the development-time agent context across the family, executing decision D5 (dissolve _agent-context). It gives one root `AGENTS.md` template, one thin `CLAUDE.md` shim template, the canonical folder tree, the exact `agent-plugins` `.gitignore` edit, and the rule that no `_agent-context/` or `AGENTS/` folder exists. It is staged draft text for the roadmap package; it lands through Phase 3 (scaffolding and dual-audience) per the orchestration model. Cross-references: `04-standards-definition.md` (the law that mandates the surface), `drafts/cross-tool-targeting.md` (D10 truth-in-targeting and the shim-per-target rule), `drafts/frontmatter-schemas.md` (the doc/ADR frontmatter these files reference), and `drafts/orchestration-campaigns.md` (the one-PR-per-repo push that applies the casing rename and shim adds).

---

## 1. What this surface is, and why it is one file plus a shim

The development-time agent context is the orientation an agent reads when it opens a repo to work ON it. The family standardizes on exactly one canonical source for that context and one cheap reference per declared tool:

| Layer | File | Role | Audience |
|---|---|---|---|
| Canonical | `AGENTS.md` (repo root) | The single source of dev-time orientation. First thing any agent reads. | All tools (the agents.md ecosystem: Claude Code, Codex, and others) |
| Shim | `CLAUDE.md` (repo root) | Thin pointer to `AGENTS.md`. No divergent content. | Claude Code only |
| Shim | `GEMINI.md` (repo root) | Thin pointer to `AGENTS.md`. Present ONLY if `gemini` is a declared target. | Gemini only |
| Durable knowledge | `docs/internal/{decisions,release-plans,specs,rfcs,backlog}/` | Where distilled, committed maintainer knowledge lives. | Maintainers and agents |
| Ephemeral scratch | `_local/` (gitignored), incl. `_local/session-logs/` | Raw working notes. Never published, never load-bearing. | Both, throwaway |

`AGENTS.md` is the open, cross-tool convention (https://agents.md/) and is mandated at the repository root at every tier by the Standard, Section 3.10 (AGENTS.md), with internal links that MUST resolve and component references that MUST stay in sync with the manifest. `CLAUDE.md` is a Claude-Code-specific sibling that, per D10 (truth-in-targeting), MUST reference `AGENTS.md` rather than duplicate it: a divergent copy is the drift this package exists to kill. See the Anthropic plugin reference for how Claude Code discovers project memory (https://code.claude.com/docs/en/plugins-reference).

The toolkit already automates this surface: `askit-build-agents-md` authors and syncs `AGENTS.md` (and a `CLAUDE.md` sibling) and keeps the component section rendered from the manifest so it cannot drift. The templates below are the human-readable contract that skill emits against; hand-authoring is the fallback, not the norm.

---

## 2. Dev-time audience vs consumer-time audience (do not confuse them)

There are two distinct audiences and they ship through different channels. Conflating them is the most common mistake this section prevents.

| | Dev-time context | Consumer-time context |
|---|---|---|
| Who reads it | An agent working ON this repo (maintainer's machine, CI) | An agent USING an installed plugin (end-user's machine) |
| Surface | `AGENTS.md` + `CLAUDE.md` shim at the repo root | Skills, commands, subagents shipped in the plugin |
| Loaded how | Read as project context when the repo is the working directory | Invoked through the agent's skill/command system at the consumer's request |
| Key fact | A repo-root `CLAUDE.md` orients the maintainer's agent | A plugin-bundled `CLAUDE.md` is NOT auto-loaded as context by an installer's Claude Code session |

Concretely: do NOT try to ship development guidance to consumers by bundling a `CLAUDE.md` inside the plugin payload. It will not be loaded as context at consumer time. Consumer-facing behavior MUST ship as skills (the agentskills.io portable floor, https://agentskills.io/specification.md) and the other plugin components. The root `AGENTS.md` and `CLAUDE.md` are a development-time concern for people and agents building the repo, not a delivery mechanism to installers.

---

## 3. Root AGENTS.md template

Drop-in template for a family plugin repo. Replace the bracketed placeholders. Keep it TIGHT: verbose, generated-looking context files measurably reduce agent task success and raise cost, so brevity is a feature. Prefer positive guidance over long prohibition lists; the few guardrails below are the ones that genuinely change agent behavior.

```markdown
# AGENTS.md

[ONE paragraph: what this repo is. e.g. "pm-skills is a Claude Code plugin
(a skill library per the Advanced Skill Library Standard) that packages
product-management skills. It is the unit of release; it carries one version."]

## Current state - read before assuming capabilities
Confirm what exists on disk before acting. The component list below is rendered
from library.json by a generator; if it looks stale, re-run the sync rather than
hand-editing it.

## Build, test, run the gate
- Install: `npm ci`
- Run the conformance gate: `node scripts/check.mjs .`   # MUST pass before any PR
- (or, if vendored) `node <GATE_PATH>/check.mjs .`
- Test: `[project test command]`
- Lint: `[project lint command]`

## Guardrails
- The gate MUST pass. A red gate blocks the PR; do not merge around it.
- Do NOT hand-edit generated manifests or generated sections. Regenerate them:
  `library.json` is the authored source of truth; `manifest.generated.json`,
  `.claude-plugin/plugin.json`, and the AGENTS.md component section are GENERATED.
- House style: no em-dashes (U+2014) or en-dashes (U+2013) in any output. Use
  " - " or restructure. This is a family convention, not a gate check (the
  Standard retired the no-dashes check at v0.11); a repo MAY enforce it with an
  opt-in PreToolUse hook.
- Decisions are durable: record them as MADR ADRs in docs/internal/decisions/,
  never in scratch.

## Where things live
- `docs/internal/decisions/`   ADRs (MADR 4.0), immutable once accepted
- `docs/internal/release-plans/`  per-release plan_vX.Y.Z/ folders
- `docs/internal/specs/`        feature specs
- `docs/internal/rfcs/`         cross-cutting proposals
- `docs/internal/backlog/`      local-first backlogs
- `docs/{tutorials,how-to,reference,explanation}/`  published human docs (Diataxis)
- `_local/`                     gitignored scratch; `_local/session-logs/` for raw logs
- `library.json`               manifest source of truth (pins the Standard version + tier)
- `STANDARD.md`                the Standard version this repo targets
- `skills/ agents/ commands/ hooks/`  components per declared tier

## Components
<!-- BEGIN generated component list - do not hand-edit; run the sync generator -->
[generated from library.json]
<!-- END generated component list -->
```

Notes on the template:
- The gate command form (`node scripts/check.mjs .` vs a vendored `GATE_PATH`) depends on whether the repo co-locates the runner or vendors it. The marketplace repo `agent-plugins` is NOT a plugin and runs its own `validate-registry` gate instead (see Section 5 and `drafts/ci-repin-check.md`).
- The "Components" block is the generator-owned region. `askit-build-agents-md` renders it from `library.json`; the Standard makes drift between this section and the manifest an `error` (Section 10.3, dual representation).
- The map deliberately lists `docs/internal/` (kept, per D3 - docs/internal kept) and lowercase `_local/` (per D6 - casing: _local lowercase everywhere).

---

## 4. Thin CLAUDE.md shim template

The shim is intentionally tiny. Its only job is to send Claude Code to the canonical file. It MUST NOT carry guidance that contradicts or duplicates `AGENTS.md`.

```markdown
# CLAUDE.md

This repo's agent context lives in [AGENTS.md](AGENTS.md). Read it first.

CLAUDE.md is a thin Claude-Code-specific shim; it deliberately holds no content
of its own. All conventions, build/test/gate commands, guardrails, and the map
of where things live are in AGENTS.md, the single cross-tool source of truth.

Any Claude-Code-only guidance (if ever needed) goes BELOW this line and is
labeled as a Claude-Code extension, never a divergent copy of AGENTS.md.
```

Per D10 (truth-in-targeting), a declared target that reads its own file gets a shim like this and only this. `agent-targets` is load-bearing: a plugin MUST emit the native distribution and context shim for every declared target, and the gate MUST verify it; if a target's shim is not shipped, the target MUST be dropped from `agent-targets`. Two repos currently lack this shim and the Phase 3 push fixes them: thinking-framework-skills and agent-skills-toolkit (the CLAUDE.md shim drift called out in D10). `GEMINI.md` follows the identical pattern but ships ONLY if `gemini` is a declared target; no repo declares it today, so no repo carries a `GEMINI.md`.

---

## 5. Canonical folder tree

The plugin-repo tree (skills/agents/commands present per declared tier; matches Standard Section 10.1 with the D5/D6 casing and the dissolved `_agent-context/`):

```
<plugin>/
  AGENTS.md                      canonical dev-time agent context        [agent]
  CLAUDE.md                      thin shim -> AGENTS.md (Claude Code)    [agent]
  library.json                   manifest SoT (pins Standard + tier)     [agent]
  .claude-plugin/plugin.json     Claude manifest (generated)             [agent]
  manifest.generated.json        structured component index (CI-built)   [agent]
  INDEX.md  README.md  CHANGELOG.md                                       [human/both]
  STANDARD.md                    Standard version targeted
  skills/<skill>/                per-skill layout (Standard 10.2)
  agents/ commands/ hooks/       components per tier
  docs/
    internal/                    committed maintainer governance         [maintainer]
      decisions/                 ADRs (MADR 4.0)
      release-plans/             plan_vX.Y.Z/ (D8 PLAN layer)
      specs/                     feature specs
      rfcs/                      cross-cutting proposals
      backlog/                   local-first backlogs
    {tutorials,how-to,reference,explanation}/   Diataxis public docs     [human]
  scripts/                       CI-agnostic validators/generators
  .github/workflows/ci.yml       invokes scripts only
  _local/                        gitignored scratch                      [both]
    session-logs/                gitignored raw session logs
```

The marketplace repo `agent-plugins` is NOT a plugin and does not carry `library.json`, `skills/`, or `STANDARD.md` at its root (the Standard lives at `standards/STANDARD.md` after Phase 0 - truth and relocation). Its tree is:

```
agent-plugins/
  AGENTS.md                      canonical dev-time agent context
  CLAUDE.md                      thin shim -> AGENTS.md
  CONTRIBUTING.md                the listing contract (L1-L6)
  .claude-plugin/marketplace.json   the registry (plugins pinned by sha)
  standards/                     family law: STANDARD.md, checks/, GOVERNANCE.md, decisions/
  scripts/validate-registry.mjs  the registry gate (+ the re-pin check)
  docs/internal/{decisions,orchestration,convergence,...}   governance docs
  _local/                        gitignored scratch
    session-logs/                gitignored raw session logs
```

---

## 6. No _agent-context/ and no AGENTS/ folder (reserved namespaces)

D5 (dissolve _agent-context) removes the `_agent-context/` directory concept entirely. Neither a `_agent-context/` directory nor an `AGENTS/` directory exists anywhere in the family. The names are constrained by reserved namespaces, and collapsing them prevents real, recurring confusion:

| Name | Status | What it actually is |
|---|---|---|
| `AGENTS.md` | The orientation FILE | The single cross-tool dev-time context source (https://agents.md/) |
| `agents/` | Reserved | Claude Code SUBAGENT components live here (Standard 10.1) |
| `.agents/` | Reserved by Codex | Codex's on-disk skill/plugin namespace (do not co-opt; paths reconfirmed before any emitter is built) |
| `AGENTS/` | Does NOT exist | Would collide on case-insensitive filesystems with `agents/`; banned |
| `_agent-context/` | Dissolved (D5) | Retired; its contents move to their durable or ephemeral homes |

Where the old `_agent-context/` contents go, by the distill-or-discard principle (D5): distill durable knowledge into its home (decisions -> `docs/internal/decisions/`; plans -> `docs/internal/release-plans/`; specs -> `docs/internal/specs/`), and keep raw scratch ephemeral (`_local/session-logs/`, gitignored). Nothing of value is lost; what was committed scratch either graduates to a durable doc or becomes ignored throwaway. The committed agent-facing layer is exactly: root `AGENTS.md` + thin `CLAUDE.md` shim + `docs/internal/`.

Casing is locked by D6 (casing): `_local` is lowercase everywhere (Windows is case-insensitive, so a mixed `_LOCAL`/`_local` is a git case-collision footgun) and `session-logs/` is lowercase plural (resolving the SESSION-LOG / session-log / session-logs drift).

---

## 7. The exact agent-plugins .gitignore edit

The current `agent-plugins/.gitignore` ignores `_LOCAL/` (uppercase), and uses the split pattern that ignores `_agent-context/*` while committing `_agent-context/session-logs/`. D5 retires that split and D6 fixes the casing. The edit:

Current (relevant lines):
```gitignore
# Local-only notes and scratch (never published, even if repo goes public)
_LOCAL/
...
# Agent working context: local scratch is ignored, but the session-log timeline is committed
_agent-context/*
!_agent-context/session-logs/
```

Target:
```gitignore
# Local-only notes and scratch (never published, even if repo goes public)
_local/
```

Specifically:
1. Remove both `_agent-context/*` and the `!_agent-context/session-logs/` negation, and the comment above them. No `_agent-context/` survives.
2. Replace `_LOCAL/` with `_local/` (D6 casing). Session logs are now `_local/session-logs/` and are ignored along with the rest of `_local/`; they are no longer committed.
3. Leave the other entries (`_output-jp-library/`, `.memsearch/`, `.claude/`, OS cruft) unchanged.

Note the case-only rename `_LOCAL/` -> `_local/` is a git rename that needs care on case-insensitive filesystems; perform it as an explicit `git mv` (or stage the removal and re-add) so git records the rename rather than treating it as a no-op. This file edit is part of the Phase 3 mechanical push and rides the one-PR-per-repo campaign in `drafts/orchestration-campaigns.md`; the analogous casing rename applies in each plugin repo too.

---

## 8. Land checklist for this surface

- [ ] Every family repo has a root `AGENTS.md` matching the Section 3 template (tight, generator-rendered component block, the four guardrails).
- [ ] Every repo declaring `claude` in `agent-targets` has a `CLAUDE.md` shim matching Section 4 (fixes the thinking-framework-skills and agent-skills-toolkit drift).
- [ ] No repo contains `_agent-context/` or `AGENTS/`.
- [ ] `_local/` is lowercase and gitignored in every repo; `session-logs/` lives under it and is ignored.
- [ ] `agent-plugins/.gitignore` matches the Section 7 target.
- [ ] No plugin tries to ship dev-time context to consumers via a bundled `CLAUDE.md` (Section 2).
- [ ] The AGENTS.md / `agent-targets` shim contract is verified by the gate (advisory in Phase 2, blocking when D10 flips to blocking in Phase 4).
```
