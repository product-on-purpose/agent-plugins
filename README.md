# Product on Purpose

Thematic AI agent skill and tool collections for product work. One marketplace, multiple independent plugins. Install only the collections you want.

> `pm-skills` also remains available through its existing self-hosted install path during the transition; existing installs are unaffected. See [Migration during transition](#migration-during-transition).

## Quick start

```bash
# 1. Add the marketplace once (by repo path)
/plugin marketplace add product-on-purpose/agent-plugins

# 2. Install the plugins you want (each is independent)
/plugin install pm-skills@product-on-purpose

# 3. Update a plugin later
/plugin update pm-skills
```

You **add** the marketplace by its repo path (`product-on-purpose/agent-plugins`) and **install** plugins by the marketplace identity (`@product-on-purpose`). Those differ by design: the path is the address, the identity is the brand.

## Plugins

| Plugin | What it is | Repo | Status |
|---|---|---|---|
| `pm-skills` | Product management skills, sub-agents, and sprint tools across the full product lifecycle | `product-on-purpose/pm-skills` | listed |
| `thinking-framework-skills` | Canonical thinking and reasoning frameworks (SCQA, MECE, Pyramid Principle, First Principles, OODA) | `product-on-purpose/thinking-framework-skills` | listed |
| `writing-style-catalog` | Composable writing instructions on four orthogonal axes (Voice, Tone, Style, Format) with a compose-instruction skill | `product-on-purpose/writing-style-catalog` | listed |

Each plugin lives in its **own repo** with its own version, changelog, and release cadence. This repo holds only the registry (`.claude-plugin/marketplace.json`); it contains no plugin code.

## How listing works

The registry points outward at each plugin repo through a `source` entry. The plugin repos do not point back; each only needs a valid `.claude-plugin/plugin.json`. Pointing is one-way: marketplace to plugin.

Production entries pin a `sha` so the marketplace controls exactly which commit of each plugin users receive (a plugin repo cannot then ship to your users by force-pushing `main`). Bumping a plugin means updating its `sha` and `version` in this one file.

## Adding a plugin

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the contract a repo must satisfy to be listed.

## Migration during transition

`pm-skills` has historically installed from its own self-hosted marketplace. That path keeps working; this marketplace is an additional, brand-level home for it. Existing installs are not affected and do not migrate automatically (Claude Code keys an install to the marketplace it came from). To switch, add this marketplace and reinstall `pm-skills@product-on-purpose`.

## License

This repository is Apache-2.0 (see [`LICENSE`](LICENSE)). Each listed plugin carries its own license in its own repo.
