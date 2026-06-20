# Spike: Codex on-disk paths reconfirm (D17 build-time residual)

This spike resolves the build-time path residual that gates the codex-distributed emitter under D17 (Codex = deliver; supersedes D10 Codex-defer). It reconfirms, against the CURRENT OpenAI Codex docs (June 2026), the on-disk paths and manifest schemas a distributed Codex plugin uses, so the emitter target list can be fixed before any generator is built. It is the prerequisite named in `../drafts/cross-tool-targeting.md` Section 4 (Codex path churn: MUST-reconfirm before any emitter) and the dossier for OQ-6 (Codex on-disk paths reconfirm) in `../05-open-questions.md`.

## 1. Objective

Answer the three open path questions from `../drafts/cross-tool-targeting.md` Section 4 with citations, and decide whether the D17 emitter can proceed:

1. Skill discovery roots: `.agents/skills/` (in-repo + global) vs any `.codex/skills/` variant; plugin-bundled skill vs loose skill.
2. The Codex marketplace manifest: exact path and entry schema; the install/marketplace commands.
3. The native plugin manifest a distributed Codex plugin ships, its required fields, how a loaded plugin surfaces its bundled skills to discovery, and MCP handling.
4. Confirm the carve-outs: subagents via config (user/project, not plugin-shipped), no output-styles.

## 2. Confirmed current paths and schemas

All rows verified June 2026 against the cited current Codex docs. The exact Codex CLI version tag could not be corroborated from the [changelog](https://developers.openai.com/codex/changelog); the path and schema facts below are confirmed against the live docs regardless.

| Item | Confirmed current value | Source |
| --- | --- | --- |
| Skill discovery root (in-repo) | `.agents/skills/` - scanned from CWD upward to repo root (`$CWD/.agents/skills`, parent dirs, `$REPO_ROOT/.agents/skills`) | https://developers.openai.com/codex/skills |
| Skill discovery root (user/global) | `$HOME/.agents/skills` | https://developers.openai.com/codex/skills |
| Skill discovery root (admin/system) | `/etc/codex/skills` + built-in skills bundled with Codex | https://developers.openai.com/codex/skills |
| `.codex/skills/` variant | NOT a skills discovery root. `.codex/` holds config and agents (see subagents row); skills discovery is `.agents/skills`, never `.codex/skills` | https://developers.openai.com/codex/skills |
| `SKILL.md` required frontmatter | `name` + `description` (UI/policy extras go in `agents/openai.yaml`) | https://developers.openai.com/codex/skills |
| Loose skill vs plugin-bundled skill | Loose skills live directly in a `.agents/skills` folder (local authoring, repo-scoped). To distribute beyond one repo, bundle two or more skills, or ship a skill with an app/MCP, you package them as a plugin (the installable distribution unit) | https://developers.openai.com/codex/skills |
| Native plugin manifest path | `.codex-plugin/plugin.json` (the only required file for a plugin) | https://developers.openai.com/codex/plugins/build |
| Plugin manifest required fields | `name` (kebab-case), `version` (semver), `description` | https://developers.openai.com/codex/plugins/build |
| Plugin manifest component pointers | `skills` (path to skills dir, e.g. `"./skills/"`), `mcpServers` (path to `.mcp.json`), `apps` (path to `.app.json`), `hooks` (path to hooks file); plus optional `author`, `homepage`, `repository`, `license`, `keywords`, `interface` | https://developers.openai.com/codex/plugins/build |
| How bundled skills surface | Components surface through the manifest pointer fields; bundled skills appear as `@skill-name` in the composer when the plugin is enabled | https://developers.openai.com/codex/plugins/build , https://developers.openai.com/codex/plugins |
| MCP handling in a plugin | `.mcp.json` referenced by the `mcpServers` manifest field; contains a server map (or wrapped `mcp_servers` object). May require extra setup/auth before use | https://developers.openai.com/codex/plugins/build , https://developers.openai.com/codex/plugins |
| Marketplace manifest path | `$REPO_ROOT/.agents/plugins/marketplace.json` (repo-scoped) or `~/.agents/plugins/marketplace.json` (per-user) | https://developers.openai.com/codex/plugins/build |
| Marketplace root schema | `{ name, interface:{displayName}, plugins:[...] }` | https://developers.openai.com/codex/plugins/build |
| Marketplace plugin-entry schema | `name`, `source` (`{source, path}` local; `url`/`git-subdir` remote), `policy` (`{installation, authentication}`), `category`; paths relative to marketplace root, `./`-prefixed | https://developers.openai.com/codex/plugins/build |
| Add-marketplace command | `codex plugin marketplace add owner/repo` (also `--ref <branch\|tag>`, `--sparse PATH` / `--local <path>`); plus `marketplace list \| upgrade \| remove` | https://developers.openai.com/codex/plugins/build |
| Install-a-plugin command | NOT confirmed as a CLI `codex plugin add <plugin>@<marketplace>` in current docs. Installation is via the Codex app / TUI (`/plugins`, Space to enable/disable). See caveat in Section 4 | https://developers.openai.com/codex/plugins/build |
| Subagents / custom agents | Standalone TOML under `~/.codex/agents/` (personal) or `.codex/agents/` (project); `[agents]` in `config.toml` for global settings only (`max_threads`, `max_depth`). NO `agents` field in the plugin manifest; plugins do NOT ship subagents | https://developers.openai.com/codex/subagents |
| Output styles | No output-style feature in Codex (Claude-only). Codex receives skills + MCP only | STANDARD.md L494; not contradicted by any current Codex doc |

## 3. What changed vs the assumptions in the drafts and the Standard

The path/manifest substrate is CONFIRMED unchanged from the assumptions in `../drafts/cross-tool-targeting.md` and STANDARD.md L505. Two deltas are worth recording, one material (install command) and one a refinement (subagent location).

1. **Install command (MATERIAL DELTA).** STANDARD.md L505 and `../drafts/cross-tool-targeting.md` Section 2/3 assume a CLI round-trip `codex plugin marketplace add <name> <path>` then `codex plugin add <plugin>@<marketplace>`. The `marketplace add` half is CONFIRMED current. The `codex plugin add <plugin>@<marketplace>` half is NOT confirmed in the current docs: the build doc presents plugin installation as happening through the Codex app / TUI (`/plugins` to browse and toggle, Space to enable/disable an installed plugin), not a documented CLI `codex plugin add`. The `codex plugin` umbrella and `codex plugin marketplace ...` subcommands exist; a per-plugin CLI install verb is not documented. This does NOT change any emitted on-disk artifact (the marketplace manifest is the same file regardless of how install is triggered); it changes only the local round-trip VERIFICATION step the emitter workstream uses. See Section 4.

2. **Subagent definition location (REFINEMENT, carve-out intact).** STANDARD.md L494/L505 describe subagents as `config.toml [agents.*]` + per-role `agents/*.toml`. Current docs are more specific: custom agents are standalone TOML files under `~/.codex/agents/` (personal) or `.codex/agents/` (project), and `[agents]` in `config.toml` now holds GLOBAL settings only (`max_threads`, `max_depth`), not the per-agent definitions. The carve-out that matters for D17 is unchanged and reconfirmed: there is no `agents` field in `.codex-plugin/plugin.json` and no documented plugin-to-subagent path, so a distributed plugin still cannot ship Codex subagents. This matches `../drafts/cross-tool-targeting.md` Section 3 and STANDARD.md Section 3.3. (Note a Codex issue, since closed, that even project `.codex/config.toml` agent roles did not reach `spawn_agent`: https://github.com/openai/codex/issues/14579 - further evidence that subagents are user/project config territory, well outside a plugin's reach.)

3. **Skill discovery (NO CHANGE, explicitly reconfirmed).** `.agents/skills` (CWD-upward + repo root), `$HOME/.agents/skills`, `/etc/codex/skills`, built-ins. There is no `.codex/skills/` discovery root. This directly answers the `../drafts/cross-tool-targeting.md` Section 4 question (`.agents/skills/` vs any `.codex/skills/` variant): it is `.agents/skills/`, full stop.

## 4. Concrete emitter target list this unblocks

With the paths confirmed, the D17 codex-distributed emitter (the Codex distribution workstream in `../../standards-plan-roadmap/02-roadmap.md`, parallel to Phase 4) has a fixed target list:

Per-plugin emission (generated from canonical `library.json`):
- `.codex-plugin/plugin.json` - required `name`, `version`, `description`; component pointers `skills: "./skills/"`, and `mcpServers: "./.mcp.json"` when the plugin ships MCP. Optional `interface`/metadata mapped from `library.json`.
- Bundled skills under the plugin's `skills/<skill-name>/SKILL.md` (the dir the manifest `skills` pointer names). Same portable `SKILL.md` body as the Universal-tier source - no fork (`../drafts/cross-tool-targeting.md` Section 6).
- `.mcp.json` at the plugin root when MCP is shipped (referenced by `mcpServers`).
- NO `agents` field, NO subagent files, NO output-style artifacts (carve-outs, Section 2).

Marketplace emission (in agent-plugins, alongside the Claude `.claude-plugin/marketplace.json`):
- `.agents/plugins/marketplace.json` - root `{ name, interface:{displayName}, plugins:[...] }`; one entry per distributed plugin with `name`, `source:{source, path}` (`./`-prefixed, relative to marketplace root), `policy:{installation, authentication}`, `category`.

Gate verification (the declare == emit == verify chain, `../drafts/cross-tool-targeting.md` Section 1, advisory-then-blocking per D15/D17): for any plugin claiming codex-distributed, assert the `.codex-plugin/plugin.json` exists with required fields, the `skills` pointer resolves to real `SKILL.md` files, and the plugin has a matching `.agents/plugins/marketplace.json` entry.

## 5. Residual uncertainty (verify at build, not blocking)

1. **Plugin install verb for the local round-trip.** The emitter does not write anything install-command-specific, so the on-disk targets in Section 4 are unaffected. But the workstream's local round-trip verification step (`../drafts/cross-tool-targeting.md` Section 3, step 3; STANDARD.md L505 "round-trip locally testable") currently assumes `codex plugin add <plugin>@<marketplace>`. Re-verify the exact install verb against `codex plugin --help` on the pinned Codex CLI version at build time; if there is no CLI install verb, the round-trip check uses the TUI `/plugins` enable flow (or whatever `codex plugin ...` subcommand v0.135+ exposes) instead. This is a test-harness detail, not an emitted artifact.
2. **`interface` field completeness.** The plugin manifest `interface` object (displayName, category, capabilities, icons, etc.) is optional and rich; confirm which fields are required vs cosmetic for a non-app (skills+MCP) plugin at build, so the emitter does not over- or under-populate it.
3. **MCP `.mcp.json` exact shape.** Docs note either a direct server map or a wrapped `mcp_servers` object; pin the exact accepted shape against the then-current docs when MCP-bearing plugins are first emitted.

None of these block fixing the emitter's primary target paths (Section 4); all are confirm-at-build refinements on optional or test-only surfaces.

## 6. Verdict

**CONFIRMED-WITH-CAVEATS - the D17 emitter can proceed.** Every on-disk path and manifest schema the emitter must WRITE is confirmed against current Codex docs and unchanged from the drafts' assumptions: skills at `.agents/skills/` (+ `$HOME/.agents/skills`, no `.codex/skills/` variant), native manifest at `.codex-plugin/plugin.json` with `name`/`version`/`description` + `skills`/`mcpServers` pointers, marketplace at `.agents/plugins/marketplace.json` with the `{name, source, policy, category}` entry schema, and the subagents/output-styles carve-outs intact (no `agents` field in the plugin manifest; subagents are user/project config under `~/.codex/agents/` or `.codex/agents/`). The single caveat is the plugin INSTALL verb used only for the local round-trip VERIFICATION: the `codex plugin marketplace add` half is confirmed, but the assumed `codex plugin add <plugin>@<marketplace>` install verb is not present in current docs (install is app/TUI-driven via `/plugins`). That affects the workstream's test harness, not any emitted file, and must be re-verified against `codex plugin --help` on the pinned CLI version at build time. The emitter target list in Section 4 is stable; OQ-6 (Codex on-disk paths reconfirm) can be folded back to its source doc as confirmed, with the install-verb caveat carried into the Codex distribution workstream.

## Cross-references

- `../drafts/cross-tool-targeting.md` - D10/D17 cross-tool rules; Section 3 (codex-distributed delivery), Section 4 (the MUST-reconfirm rule this spike discharges).
- `../05-open-questions.md` - OQ-6 (Codex on-disk paths reconfirm) dossier; this spike is its named prerequisite.
- `agent-skills-toolkit/STANDARD.md` - L494/L495/L505 (the recorded Codex residual and the v0.133 spike this reconfirms against v0.135).

## Sources

- https://developers.openai.com/codex/plugins
- https://developers.openai.com/codex/plugins/build
- https://developers.openai.com/codex/skills
- https://developers.openai.com/codex/subagents
- https://developers.openai.com/codex/changelog
- https://github.com/openai/codex/issues/14579
