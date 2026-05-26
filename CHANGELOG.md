# Changelog

All notable changes to the `product-on-purpose` marketplace **registry** are documented here. This tracks the registry's own version line (`metadata.version` in `.claude-plugin/marketplace.json`), which is independent of any listed plugin's version.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this registry adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Pending the public launch (`metadata.version` 1.0.0), tied to the pm-skills v2.21.0 marketplace launch:

### Added

- `scripts/validate-registry.mjs` - enforcing registry validator (JSON, schema, per-entry fields, source shape + pinned sha, sha-on-release-tag, no-placeholder, installability smoke), with transient/rate-limit retry handling.
- `.github/workflows/validate-registry.yml` - runs the validator on push/PR to `main`.
- `docs/internal/registry-maintenance.md` - operations doc (add/bump a plugin, CI contract, go-public checklist, rollback).

### Pending at launch (1.0.0)

- Pin the `pm-skills` entry to the v2.21.0 release tag (from the v2.17.0 preview pin) and bump `metadata.version` to 1.0.0.
- Remove the README Preview banner; enable branch protection requiring `validate-registry`; flip the repo public.

## [0.1.0] - 2026-05-21

Initial private preview registry.

### Added

- `.claude-plugin/marketplace.json` - thin registry listing `pm-skills` (pinned to the v2.17.0 commit), `metadata.version` 0.1.0.
- `README.md` (Preview banner, quick start, plugins table, migration-during-transition section), `CONTRIBUTING.md` (the listing contract), `LICENSE` (Apache-2.0).
