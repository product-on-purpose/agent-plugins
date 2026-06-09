# Changelog

All notable changes to the `product-on-purpose` marketplace **registry** are documented here. This tracks the registry's own version line (`metadata.version` in `.claude-plugin/marketplace.json`), which is independent of any listed plugin's version.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this registry adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.11.0] - 2026-06-09

Re-pinned `thinking-framework-skills` to its `v0.4.0` release (the Framework Library platform).

### Changed

- Re-pinned `thinking-framework-skills` to its `v0.4.0` release tag (commit `0ffda49`), from `v0.3.0` (`f70d7b7`); entry `version` 0.3.0 -> 0.4.0. v0.4.0 ships the Framework Library platform: the registry as a single source of truth with strong CI, the `think-research-framework` engine, the `think-top3` / `think-random-frameworks` applicators, the published Framework Library, a `/tools/` section for the meta-skills, the calibrated advisor gate, and a registry-era documentation refresh. Registry `metadata.version` 1.10.0 -> 1.11.0.

## [1.10.0] - 2026-06-06

Re-pinned `agent-skills-toolkit` to its `v1.3.0` release (the gate-evolution release).

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.3.0` release tag (commit `d8279c2`), from `v1.2.0` (`c1ecd26`); entry `version` 1.2.0 -> 1.3.0. v1.3.0 makes the deterministic gate standard-version-aware (ADR 0027) and configurable (per-rule severity, named profiles, a suppressions baseline, per-check provenance, and a published-verdict trust clamp); no new spine check, so the spine stays 29 and the Standard stays 0.11. Registry `metadata.version` 1.9.0 -> 1.10.0.

## [1.9.0] - 2026-06-06

Re-pinned `pm-skills` to its `v2.25.1` maintenance release.

### Changed

- Re-pinned `pm-skills` to its `v2.25.1` release tag (commit `2b5044a`), from `v2.25.0`; entry `version` 2.25.0 -> 2.25.1. Registry `metadata.version` 1.8.0 -> 1.9.0.

## [1.8.0] - 2026-06-06

Re-pinned `agent-skills-toolkit` to its `v1.2.0` release.

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.2.0` release tag (commit `c1ecd26`), from `v1.1.0`; entry `version` 1.1.0 -> 1.2.0. Registry `metadata.version` 1.7.0 -> 1.8.0. v1.2.0 retires the `U10` (no-dashes) check from the Standard spine (Standard v0.11, 29-check spine).

## [1.7.0] - 2026-06-03

Re-pinned `agent-skills-toolkit` to its second Gold release (`v1.1.0`).

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.1.0` release tag (commit `f3250c0`), from `v1.0.0`; entry `version` 1.0.0 -> 1.1.0. Registry `metadata.version` 1.6.0 -> 1.7.0.

## [1.6.0] - 2026-06-03

> Backfilled (the bump shipped in #13 without a CHANGELOG entry).

### Changed

- Re-pinned `pm-skills` to its `v2.25.0` release tag (commit `23e65da`), from 2.24.0; entry `version` 2.24.0 -> 2.25.0. Registry `metadata.version` 1.5.0 -> 1.6.0.

## [1.5.0] - 2026-06-03

> Backfilled (the bump shipped in #11 without a CHANGELOG entry).

### Changed

- Re-pinned `thinking-framework-skills` to its `v0.2.1` release tag (commit `056dbc8`), from 0.2.0; entry `version` 0.2.0 -> 0.2.1. Registry `metadata.version` 1.4.0 -> 1.5.0.

## [1.4.0] - 2026-06-02

Added `agent-skills-toolkit` at its first Gold release (`v1.0.0`).

### Added

- `agent-skills-toolkit` listed, pinned to its `v1.0.0` release tag (commit `f5291c0`), https `url` source, `version` 1.0.0, `strict: true`. Registry `metadata.version` 1.3.0 -> 1.4.0.

### Changed

- `CONTRIBUTING.md` section 5 example now uses the https `url` source form (the `github` shorthand resolves to an install-breaking SSH clone for users without an authorized key), matching `registry-maintenance.md` and the live entries.

## [1.3.0] - 2026-06-02

Added `writing-style-catalog`.

### Added

- `writing-style-catalog` listed, pinned to its `v0.2.0` release tag (commit `3685d65`), https `url` source, `strict: true`. Registry `metadata.version` 1.2.0 -> 1.3.0.

## [1.2.0] - 2026-06-01

> Backfilled (this bump shipped without a CHANGELOG entry at the time).

### Changed

- Re-pinned `thinking-framework-skills` to the `v0.2.0` tag (commit `2b8731e`), from 0.1.0; entry `version` 0.1.0 -> 0.2.0. Registry `metadata.version` 1.1.0 -> 1.2.0.

## [1.1.0] - 2026-06-01

> Backfilled.

### Added

- `thinking-framework-skills` listed (pinned to the `v0.1.0` commit `df7f90e`), https `url` source, `strict: true`. Registry `metadata.version` 1.0.3 -> 1.1.0.

## [1.0.3] - 2026-06-01

> Backfilled.

### Changed

- Re-pinned `pm-skills` to `v2.24.0` (commit `d3f1549`), from v2.23.0. Registry `metadata.version` 1.0.2 -> 1.0.3.

## [1.0.2] - 2026-05-31

> Backfilled.

### Changed

- Re-pinned `pm-skills` to `v2.23.0` (commit `b54cef0`), from v2.22.0. Registry `metadata.version` 1.0.1 -> 1.0.2.

## [1.0.1] - 2026-05-30

> Backfilled.

### Changed

- Re-pinned `pm-skills` to `v2.22.0` (commit `be1e400`), from v2.21.0. Registry `metadata.version` 1.0.0 -> 1.0.1.

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
