# agent-plugins

> **Placeholder. Under construction, not yet ready for use.**

This repository will host the **`product-on-purpose`** plugin marketplace for Claude Code: the registry (`.claude-plugin/marketplace.json`) that lists Product on Purpose plugins.

## What this is

A thin marketplace repo. It holds the **registry only**, no plugin code. Each plugin (for example `pm-skills`) lives in its own repo and is listed here through a `source` entry. Pointing is one-way: the marketplace points at plugin repos; the plugin repos do not point back.

## Planned install flow (once published)

```bash
# Add the marketplace once (by repo path)
/plugin marketplace add product-on-purpose/agent-plugins

# Install plugins by marketplace identity (each is independent)
/plugin install pm-skills@product-on-purpose
```

You add the marketplace by its **repo path** (`product-on-purpose/agent-plugins`) and install plugins by the marketplace **identity** (`@product-on-purpose`). Those differ by design: the path is the address, the identity is the brand.

## License

Each listed plugin carries its own license (see the plugin's repo).
