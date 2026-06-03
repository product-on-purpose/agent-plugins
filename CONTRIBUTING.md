# Contributing a plugin to Product on Purpose

The contract a repo must satisfy to be listed as a plugin in the `product-on-purpose` marketplace. Build to this and your repo is listable with a one-line registry entry.

## 1. A valid plugin at the repo root (required)

- `.claude-plugin/plugin.json` exists at the repo root.
- Required fields: `name` (kebab-case, unique within the marketplace), `version` (SemVer), `description`, `license`.
- Recommended fields: `homepage`, `repository`, `author`, `keywords`.
- Skill frontmatter follows the [agentskills.io spec](https://agentskills.io/specification): top level keeps `name` / `description` / `license`; proprietary fields nest under `metadata:`.

## 2. The plugin is independently valid (the one-way rule)

- The plugin installs and runs standalone.
- The plugin repo does **not** reference the marketplace. Association is declared only here, in this repo's `marketplace.json`. Pointing is one-way: marketplace to plugin.

## 3. Component palette (what a plugin may contain)

A plugin can ship any subset of these. It does not have to ship all of them.

| Directory / file | Component |
|---|---|
| `skills/` | agent skills (`SKILL.md` + references) |
| `commands/` | slash commands |
| `agents/` | sub-agents (native registration) |
| `hooks/` | event hooks (`hooks.json` + scripts) |
| `.mcp.json` or `mcpServers` config | bundled MCP server(s) |
| `_workflows/` | multi-skill workflow chains |

## 4. Versioning and release

- Per-plugin SemVer in `plugin.json`. Each plugin versions on its own cadence.
- Tag releases in the plugin repo (for example `v3.0.0`).
- Maintain a `CHANGELOG.md` in the plugin repo.

## 5. How to get listed

Add one entry to `.claude-plugin/marketplace.json` in this repo, in the `plugins` array:

```jsonc
{
  "name": "<plugin-name>",
  "source": { "source": "url", "url": "https://github.com/product-on-purpose/<repo>.git", "sha": "<released-commit>" },
  "description": "...",
  "version": "<matches the plugin's released version>",
  "strict": true
}
```

- `source` forms: `url` (full `.git` URL, any host - the standard for github-hosted plugins here), `github` (`repo` shorthand), `git-subdir` (a subdirectory of another repo), or a relative path string (only if the plugin lives inside this repo). Prefer the https `url` form: a `github` shorthand resolves to an SSH clone, which breaks installs for any user without an authorized SSH key (see `docs/internal/registry-maintenance.md`).
- **Pin `sha`** to a released commit. This is what makes the marketplace authoritative over what users receive.
- Set `strict: true` once the plugin passes strict validation.

## 6. Naming conventions

- Plugin `name` should match the repo name where practical (`pm-skills`, `thinking-framework-skills`).
- kebab-case, descriptive, unique within the marketplace.
- MCP servers: bundle into the owning plugin, or list as their own plugin. It is a choice, not a requirement.

## 7. Validate before listing

- `plugin.json` parses and all required fields are present.
- The plugin installs cleanly on a fresh Claude Code.
- For a pinned source, the `sha` exists and sits on a released tag.
