# Cross-Tool Targeting Rules (D10)

This draft owns the cross-tool / multi-target rule set behind decision D10 (cross-tool / truth-in-targeting): what it means to declare an agent target, the honest states a plugin may claim for OpenAI Codex CLI, the portable-skill floor plus quarantined-extensions discipline, and the adapter model for adding future tools. It is the companion to `drafts/agents-md-and-context.md`, which owns the `AGENTS.md` template and the on-disk context layout (root `AGENTS.md` + thin `CLAUDE.md` shim + `docs/internal/`). This doc does NOT restate that template; it states the RULES that govern which targets a plugin may declare and what it MUST emit and verify for each. The clauses here are staged for the Standard amendment in Phase 3 (scaffolding and dual-audience) and Phase 4 (consolidate CI and graduate domains), per `02-roadmap.md`.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, MAY are used as defined in BCP 14 / RFC 8174 (https://www.rfc-editor.org/rfc/rfc8174).

## 1. The truth-in-targeting rule (declare == emit == verify)

`agent-targets` in `library.json` is an array of `"claude"` and/or `"codex"`. Today it is descriptive metadata. D10 makes it load-bearing.

**Rule.** For every agent named in a plugin's `agent-targets`, the plugin MUST emit that agent's native distribution artifacts AND its context shim, and the conformance gate MUST verify both are present. A target a plugin cannot deliver MUST be dropped from `agent-targets`. No plugin MAY claim a target it does not ship.

This is a single chain with no slack: **declare == emit == verify**. The three are not allowed to disagree.

| If a plugin... | Then... |
| --- | --- |
| declares `"claude"` | it MUST emit the Claude Code distribution (`.claude-plugin/plugin.json` + native component layout) and a `CLAUDE.md` shim referencing `AGENTS.md`; the gate verifies both |
| declares `"codex"` | it MUST satisfy whichever Codex state it claims (Section 2); the gate verifies the artifacts for that state |
| ships a Claude distribution but lists only `["codex"]` | the gate flags the mismatch (emitted but not declared) |
| lists `["claude","codex"]` but ships no Codex artifacts | the gate flags the mismatch (declared but not emitted) and the plugin MUST drop `"codex"` |

The Standard already treats `AGENTS.md` count/cross-reference drift against the manifest as an `error` (STANDARD.md Section 3.10 and Section 10.3). Truth-in-targeting extends that same declared-vs-actual discipline from component counts to agent targets. Rollout cadence: land the check in **advisory (`warn`) mode** in Phase 2 (CI keystone), flip to **blocking (`error`)** in Phase 4, matching the burndown pattern the Standard used for `U13` (`skill-registration`) at v0.12.

Per D12 (exceptions), a deliberate divergence is expressed through the tier ceiling or a per-clause ADR plus a machine-readable suppression in the repo `docs/internal/decisions/`, never a silent omission. There is no honest way to "declare a target you do not deliver" except by dropping the claim.

## 2. The two honest Codex states

Codex is the case that makes truth-in-targeting matter, because "I support Codex" can mean two very different things. The family adopts exactly two named states. A plugin's `"codex"` claim MUST resolve to one of them, and the gate verifies the artifacts for whichever is claimed.

| State | What it claims | Artifacts the plugin MUST ship | Shipped today? |
| --- | --- | --- | --- |
| **codex-portable** | The plugin's skills run on Codex unchanged, and Codex reads the same `AGENTS.md`. Portability only, no native marketplace install. | agentskills.io-compliant skills (Universal tier, `SKILL.md`) + root `AGENTS.md`. Nothing Codex-specific to author. | **Yes.** True for any conformant plugin today, essentially free. |
| **codex-distributed** | The plugin is installable as a native Codex plugin from a Codex marketplace. | A native Codex plugin (`.codex-plugin/plugin.json`) whose bundled skills surface to Codex skill discovery, listed in a Codex marketplace (`.agents/plugins/marketplace.json`), installable via `codex plugin marketplace add` + `codex plugin add`. | **Not yet, but being built.** Per D17 the family delivers this (Section 3); the emitter and marketplace land in the Codex distribution workstream after the path-reconfirm spike. |

Why codex-portable is real and free today: STANDARD.md Section 3.1 records that Codex consumes agentskills.io-compatible skills from `.agents/skills/` in-repo and `$HOME/.agents/skills` globally, so the same `SKILL.md` runs on Claude Code and Codex unchanged; and Section 3.10 records that both agents read the root `AGENTS.md`. A plugin that ships conformant Universal skills and an `AGENTS.md` has already met codex-portable without authoring a single Codex-specific file.

## 3. Codex DELIVERY: the family ships codex-distributed (D17)

**The family WILL deliver codex-distributed.** Per D17 (Codex = deliver; supersedes D10 Codex-defer), a `"codex"` claim in `agent-targets` resolves to **codex-distributed** (native Codex plugin packaging plus a Codex marketplace install), not merely **codex-portable**. The truth-in-targeting PRINCIPLE of Section 1 is unchanged - declare == emit == verify still binds - but the target of a `"codex"` claim is now the native install, and the gate verifies the native artifacts.

> **Prior interim position, now superseded.** Earlier the family adopted Codex scope-to-truth: `"codex"` claimed only codex-portable (agentskills.io skills + `AGENTS.md`), and native packaging was deferred until a real Codex consumer existed. That interim scoping kept `agent-targets` honest under Section 1 without forcing an emitter before there was a consumer. D17 reverses the DEFER: the family now builds the emitter and the marketplace. The D10 truth-in-targeting principle that the interim position rested on carries forward intact; only the resolution of a `"codex"` claim changes (codex-portable, then codex-distributed).

What codex-distributed delivery includes:
- Native Codex plugin packaging: each plugin emits `.codex-plugin/plugin.json` (generated from `library.json`).
- A Codex marketplace manifest: the marketplace emits `.agents/plugins/marketplace.json` alongside the Claude `.claude-plugin/marketplace.json`.
- Bundled skills placed where Codex plugin discovery surfaces them, plus MCP.

What codex-distributed delivery deliberately still EXCLUDES (scope per D17):
- Plugin-shipped **Codex subagents are out of scope entirely**: STANDARD.md Section 3.3 records that, as of Codex CLI v0.135, `[agents.*]` lives in user/project `config.toml`, the Codex `plugin.json` has no `agents` field, and there is no plugin-to-config merge path. A distributed plugin therefore cannot ship Codex-ingested subagents; subagents distributed in a plugin target Claude only (`agent-targets: [claude]` at the component level per STANDARD.md Section 3.7).
- **Output styles and statusline are out of scope**: these are Claude-only and have no Codex distribution surface. Codex receives skills plus MCP only.

### Delivery plan: building codex-distributed

The move to codex-distributed is an additive, mechanical step, not a redesign of the skill corpus. It runs as a dedicated cross-cutting workstream (see `02-roadmap.md`, the Codex distribution workstream), sequenced AFTER the path-reconfirmation spike (Section 4) and parallelizable with Phase 4 (consolidate CI and graduate domains):

1. Emit the native Codex plugin manifest (`.codex-plugin/plugin.json`, generated from `library.json`) and place bundled skills where Codex plugin discovery surfaces them.
2. Emit the Codex marketplace manifest (`.agents/plugins/marketplace.json`) in agent-plugins.
3. Round-trip locally: `codex plugin marketplace add <name> <local-path|git-url>`, then enable the plugin via the Codex app/TUI (`/plugins`). Per the reconfirm spike there is no documented `codex plugin add` CLI verb (only the `codex plugin marketplace ...` subcommands); install is app-driven (STANDARD.md Section 12).
4. The `"codex"` claim now resolves to codex-distributed; the gate verifies the native artifacts (advisory-then-blocking rollout still applies, the reconfirm spike a prerequisite before the native verification flips on).

This is cheap because `askit-init-marketplace` already scaffolds the Codex marketplace format and `askit-init-plugin` scaffolds plugin internals (per D7, no new init/listing skill is needed in agent-plugins). The Standard's Codex emission contract is already fixed: skills, `config.toml [agents.*]` (user/project, not plugin), and a native `plugin.json` (STANDARD.md Appendix A, the RESOLVED 2026-05-27 spike against Codex CLI v0.133). The one remaining build-time residual is the on-disk path churn that the spike in Section 4 resolves before the emitter lands.

## 4. Codex path churn: MUST-reconfirm before any emitter

The exact on-disk layout a distributed Codex plugin uses to surface its bundled skills to discovery had version churn. It is now RECONFIRMED in [`../spikes/codex-paths-spike.md`](../spikes/codex-paths-spike.md): discovery is `.agents/skills/` (there is no `.codex/skills/` variant), the native manifest is `.codex-plugin/plugin.json`, and the marketplace is `.agents/plugins/marketplace.json`. The one delta is that plugin install is app/TUI-driven (no documented `codex plugin add` CLI verb), which affects only the local test harness, not any emitted file. The original reconfirm rule is kept below for the record.

**Rule.** Before any codex-distributed emitter is built, its target paths MUST be reconfirmed against current Codex docs. Specifically:
- skill discovery roots: `.agents/skills/` vs any `.codex/skills/` variant;
- the Codex marketplace manifest location (`.agents/plugins/marketplace.json`) and entry schema;
- how a loaded plugin's bundled skills surface to discovery, and subagent/MCP `config.toml` augmentation semantics when a plugin is loaded.

This matches the residual recorded at STANDARD.md line 495 ("the exact on-disk layout a *distributed Codex plugin* uses to surface its bundled skills to `.agents/skills` discovery should be verified against current Codex plugin-packaging docs when the emitter is built") and the related note at line 505. Under D17 the family delivers codex-distributed (Section 3), so this spike is now a PREREQUISITE of that delivery, not a deferred nicety: it runs first in the Codex distribution workstream and MUST resolve these paths before the emitter lands and before the gate's native verification flips on. codex-portable (Section 2) needs none of these paths, so nothing else is blocked while the spike runs. Confirm against the OpenAI Codex docs: plugins (https://developers.openai.com/codex/plugins) and skills (https://developers.openai.com/codex/skills), per the agentskills.io specification (https://agentskills.io/specification.md).

## 5. Naming hazard: OpenAI Codex CLI is NOT a "codex" Claude Code plugin

This is an easy and costly confusion, so state it plainly.

| Term | What it is | Role here |
| --- | --- | --- |
| **OpenAI Codex CLI (CX)** | OpenAI's agent CLI, a first-class distribution **target** of the Standard alongside Claude Code (STANDARD.md Section 0). | The `"codex"` in `agent-targets`. The thing Section 2-4 are about. |
| a `codex` Claude Code plugin | A consumer-side Claude Code plugin (in this family, the `codex:*` skills that drive a local Codex helper from inside Claude Code) | A **tool a user runs**, unrelated to distribution targets. NEVER what `agent-targets: ["codex"]` refers to. |

`agent-targets: ["codex"]` always means "this plugin's artifacts are consumable by OpenAI Codex CLI." It never refers to any Claude Code plugin that happens to be named `codex`. Do not conflate the distribution target with a consumer tool that shares the name.

## 6. The portable-skill floor and quarantined extensions

The mechanism that lets one skill body serve every target without forking is a layering rule, not a per-tool copy.

**Floor.** Every skill MUST sit on the agentskills.io portable floor: the required `name` (1-64 chars, lowercase `a-z`/`0-9`/`-`, equals the parent directory name) and `description` (1-1024 chars, what it does AND when to use it), per STANDARD.md Section 3.1 and the agentskills.io specification (https://agentskills.io/specification.md). A skill body MUST degrade gracefully: a tool that does not understand a higher-layer field ignores it and still runs the skill.

**Quarantine.** Claude-Code-only frontmatter (for example `allowed-tools`, `model`, `disable-model-invocation`, context-fork settings) MUST be confined to labeled, optional extension fields, never blended into the portable floor in a way that breaks another tool's parser. STANDARD.md Section 3.1 already lists `allowed-tools` as OPTIONAL/experimental; D11 (frontmatter) formalizes the wider quarantine: one frontmatter schema per artifact type, kebab-case keys, the agentskills.io caps as the floor, Claude-Code-only fields quarantined as labeled extensions and validated in CI.

**One body, never a fork.** A skill MUST NOT be forked into a per-tool copy. The single `SKILL.md` carries the portable floor plus any quarantined extensions; each target reads what it understands. This is what anchors the Universal tier (STANDARD.md Section 2.1 / Section 3.1): identical skill files run on Claude Code and Codex unchanged.

## 7. The adapter model: adding a future tool

Adding a new tool (Gemini, Cursor, or any future agent) is an **adapter operation**, not a redesign of the skill corpus. The cross-tool surface stays small because the skill body never changes per tool; only the wrapper artifacts do.

Steps to add tool `<T>`:

1. **Declare.** Add `<T>` to `agent-targets` for plugins that will ship it.
2. **Emit native distribution.** Generate `<T>`'s native plugin/manifest from the canonical `library.json` (the cross-agent source of truth, STANDARD.md Section 5).
3. **Emit the context shim.** Add `<T>`'s context file as a thin shim that references the single canonical `AGENTS.md`, never a divergent copy. Per D10, a declared target that reads its own context file gets a thin shim: `CLAUDE.md` for Claude Code; `GEMINI.md` only if `gemini` is a declared target. `AGENTS.md` (https://agents.md/) stays the single canonical cross-tool context source.
4. **Verify.** The gate checks declare == emit == verify for `<T>` exactly as for Claude and Codex (Section 1).

The portable skill floor (Section 6) means step 2 wraps existing skills rather than rewriting them, which is why the adapter model is cheap. There is no `GEMINI.md` in the family today and no tool beyond Claude and Codex is declared; adding one follows this path. (Note the reserved-name discipline from D5: `agents/` is the Claude Code subagent component folder, `.agents/` is reserved by Codex, and `AGENTS.md` is the orientation FILE; a new tool's shim MUST NOT collide with these.)

## 8. Standing drift to fix (carried from current state)

Truth-in-targeting also surfaces existing shim drift that Phase 3 (scaffolding and dual-audience) corrects.

| Plugin | `agent-targets` (current) | Context shim state | Action |
| --- | --- | --- | --- |
| agent-skills-toolkit | `["claude","codex"]` | root `AGENTS.md` present, **no `CLAUDE.md` shim** | add the thin `CLAUDE.md` shim |
| thinking-framework-skills | (confirm in repo) | root `AGENTS.md` present, **no `CLAUDE.md` shim** | add the thin `CLAUDE.md` shim |
| pm-skills | (none until library.json lands, Phase 1) | root `AGENTS.md` + `CLAUDE.md` present | conformant once `agent-targets` is declared |
| writing-style-catalog | (confirm in repo) | root `AGENTS.md` + `CLAUDE.md` present | conformant |

The `CLAUDE.md` shim is mechanical and judgment-free, so it ships as a PUSH campaign (one PR per repo, stop-and-flag) per D2 (rollout: Hybrid), coordinated through `drafts/orchestration-campaigns.md`. The agent-targets verification check itself is the CI keystone work in `drafts/ci-repin-check.md` and the clause text lands via `drafts/standard-amendments.md`.

## Cross-references

- `drafts/agents-md-and-context.md` - the `AGENTS.md` template and on-disk context layout (owns the template; this doc owns the rules).
- `drafts/frontmatter-schemas.md` - D11 frontmatter schemas, including the quarantined-extensions field definitions (Section 6).
- `drafts/standard-amendments.md` - the Standard clause text that makes `agent-targets` load-bearing.
- `drafts/ci-repin-check.md` - the CI gate that verifies declare == emit == verify.
- `drafts/orchestration-campaigns.md` - the one-PR-per-repo push that fixes the `CLAUDE.md` shim drift (Section 8).
- `03-decisions.md` - D10 (cross-tool / truth-in-targeting), D17 (Codex = deliver; supersedes D10 Codex-defer), D11 (frontmatter), D12 (exceptions), D5/D6 (layout and casing), D7 (no new init skill).
