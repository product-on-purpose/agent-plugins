# Changelog

All notable changes to the `product-on-purpose` marketplace **registry** are documented here. This tracks the registry's own version line (`metadata.version` in `.claude-plugin/marketplace.json`), which is independent of any listed plugin's version.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this registry adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Remaining before the registry is publicly live (the launch flip): remove the README Preview banner, enable branch protection requiring `validate-registry`, run a secret scan, and flip the repo public. After a successful public install check (pm-skills smoke S8), nothing else is pending. See the go-public checklist in `docs/internal/registry-maintenance.md`.

## [1.0.0] - 2026-05-26

First launch configuration of the marketplace, tied to the pm-skills v2.21.0 marketplace launch. Staged and validated while private; the configuration goes public at the launch flip.

### Added

- `scripts/validate-registry.mjs` - enforcing registry validator (JSON, schema, per-entry fields, source shape + pinned sha, sha-on-release-tag, no-placeholder, installability smoke), with transient/rate-limit retry handling.
- `.github/workflows/validate-registry.yml` - runs the validator on push/PR to `main` and on a weekly drift-check cron (catches a pinned tag being deleted/moved in a plugin repo between pushes).
- `docs/internal/registry-maintenance.md` - operations doc (add/bump a plugin, CI contract, go-public checklist, rollback).

### Changed

- Pinned the `pm-skills` entry to the v2.21.0 release tag (commit `1065c3e`), from the v2.17.0 preview pin; entry `version` 2.17.0 -> 2.21.0.
- Bumped registry `metadata.version` 0.1.0 -> 1.0.0.
- Switched the `pm-skills` source from `github` shorthand to an explicit https `url` source. The `github` shorthand made Claude Code clone over SSH (`git@github.com:`), which fails for any user without an authorized SSH key; the https `url` clones over HTTPS and works for everyone. The validator now accepts both `github` and `url` sources.

## [0.1.0] - 2026-05-21

Initial private preview registry.

### Added

- `.claude-plugin/marketplace.json` - thin registry listing `pm-skills` (pinned to the v2.17.0 commit), `metadata.version` 0.1.0.
- `README.md` (Preview banner, quick start, plugins table, migration-during-transition section), `CONTRIBUTING.md` (the listing contract), `LICENSE` (Apache-2.0).
