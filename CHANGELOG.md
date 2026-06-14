# Changelog

All notable changes to the `product-on-purpose` marketplace **registry** are documented here. This tracks the registry's own version line (`metadata.version` in `.claude-plugin/marketplace.json`), which is independent of any listed plugin's version.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this registry adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Upgraded `CONTRIBUTING.md` into the Standard-bound thin listing contract (clauses L1-L6, the re-pin checklist, and the enforcement ratchet), per `standards/GOVERNANCE.md` Section 2. Committed the program roadmap and convergence packet docs (written 2026-06-07) and queued the family conformance audit (`docs/internal/convergence/audit-plan.md`: one packet per member, writing-style-catalog first). Registry data unchanged.
- Ran the family conformance audits (2026-06-10): packets added for `agent-skills-toolkit` (audited @ `1fd44b7`, L1-L6 PASS, P0: 0), `thinking-framework-skills` (audited @ `d0b4a33`, L1-L6 PASS, P0: 0), and `pm-skills` (audited @ `ac0acfb`, P0: 2 - no `library.json`, embedded marketplace). Executed the `writing-style-catalog` convergence packet (its repo PR #19, open: `library.json` at tier universal / standard 0.11, skill slug canonicalized, embedded marketplace removed). Applied the audits' contract corrections to `CONTRIBUTING.md`: L2 scoped to machine-readable marketplace association (install docs are expected, not violations), L1 defers frontmatter law to the pinned Standard, L4 version agreement covers every emitted native manifest, L6 lineage note refreshed with the observed cross-member variance. Registry data unchanged.

## [1.24.0] - 2026-06-14

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.6.0` release tag (commit `c2bcbe2`), from `v1.5.2` (`7b1ba92`); entry `version` 1.5.2 -> 1.6.0. Registry `metadata.version` 1.23.0 -> 1.24.0. v1.6.0 is the manifest-completeness release: a new Universal check `U13` (`skill-registration`) catches a plugin that ships a skill on disk it never registered (invisible to installers), growing the Standard 0.11 -> 0.12 and the spine 29 -> 30 - the first Standard growth since v0.11, shipped under the warn-for-one-minor burndown so no existing plugin newly fails (ADR 0035). It also adds a per-check report glossary and the Bronze `universal-checks.md` reference page.

## [1.23.0] - 2026-06-13

Re-pinned `thinking-framework-skills` to its `v0.8.0` release.

### Changed

- Re-pinned `thinking-framework-skills` to its `v0.8.0` release tag (commit `650e3a0`), from `v0.7.1` (`6d92039`); entry `version` 0.7.1 -> 0.8.0. Registry `metadata.version` 1.22.0 -> 1.23.0. v0.8.0 is the "Learn by example" release: a Showcase of 16 worked prompt-to-artifact journeys (a founder, an engineer, a policy analyst), a "Does this actually work?" page publishing the behavioral-eval numbers (99% routing with 0 false-fires; 99% of output checks), an operating guide, and a prompt gallery. No catalog change (56 frameworks / 4 tools / 9 recipes); documentation and trust only.

## [1.22.0] - 2026-06-12

Re-pinned `agent-skills-toolkit` to its `v1.5.2` release.

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.5.2` release tag (commit `7b1ba92`), from `v1.5.1` (`6f1d8b0`); entry `version` 1.5.1 -> 1.5.2. Registry `metadata.version` 1.21.0 -> 1.22.0. v1.5.2 is the eval-run patch (the ADR 0033 U5 description-scorer recalibration, the ADR 0034 component-scope gate-config fix, the advisory delegates' doc-fix batch, the eval-run record + methodology + measured token dossier, and the responsive-table render fix); no Standard or spine change.

### Fixed

- Backfilled the missing `[1.20.0]` and `[1.21.0]` entries below (the two `thinking-framework-skills` re-pins, PRs #30 and #31, bumped `metadata.version` without changelog lines).

## [1.21.0] - 2026-06-11

Re-pinned `thinking-framework-skills` to its `v0.7.1` release. (Backfilled 2026-06-12: PR #31 bumped `metadata.version` without a changelog entry.)

### Changed

- Re-pinned `thinking-framework-skills` to its `v0.7.1` release tag; entry `version` 0.7.0 -> 0.7.1. Registry `metadata.version` 1.20.0 -> 1.21.0.

## [1.20.0] - 2026-06-11

Re-pinned `thinking-framework-skills` to its `v0.7.0` release. (Backfilled 2026-06-12: PR #30 bumped `metadata.version` without a changelog entry.)

### Changed

- Re-pinned `thinking-framework-skills` to its `v0.7.0` release tag; entry `version` 0.6.0 -> 0.7.0. Registry `metadata.version` 1.19.0 -> 1.20.0.

## [1.19.0] - 2026-06-10

Re-pinned `agent-skills-toolkit` to its `v1.5.1` release.

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.5.1` release tag (commit `6f1d8b0`), from `v1.5.0` (`6bd2daa`); entry `version` 1.5.0 -> 1.5.1. Registry `metadata.version` 1.18.0 -> 1.19.0. v1.5.1 is the batch-2 calibration patch (the ADR 0030/0031/0032 grading calibrations plus the token-usage dossier); no Standard or spine change.

## [1.18.0] - 2026-06-10

Re-pinned `pm-skills` to its `v2.26.0` release. (Backfilled: the re-pin shipped in marketplace PR #28.)

### Changed

- Re-pinned `pm-skills` to its `v2.26.0` release tag (commit `c11de12`), from `v2.25.2` (`f7f3622`); entry `version` 2.25.2 -> 2.26.0. Registry `metadata.version` 1.17.0 -> 1.18.0.

## [1.17.0] - 2026-06-10

Re-pinned `pm-skills` to its `v2.25.2` release. (Backfilled: the re-pin shipped in marketplace PR #25.)

### Changed

- Re-pinned `pm-skills` to its `v2.25.2` release tag (commit `f7f3622`), from `v2.25.1` (`2b5044a`); entry `version` 2.25.1 -> 2.25.2. Registry `metadata.version` 1.16.0 -> 1.17.0.

## [1.16.0] - 2026-06-10

Re-pinned `thinking-framework-skills` to its `v0.6.0` release. (Backfilled: the re-pin shipped in marketplace PR #24.)

### Changed

- Re-pinned `thinking-framework-skills` to its `v0.6.0` release tag (commit `d0b4a33`), from `v0.5.0` (`12f4613`); entry `version` 0.5.0 -> 0.6.0. v0.6.0 is the phase-2 catalog expansion (40 -> 47 shipped frameworks, 7 builds + 11 folds + 2 recipes + 6 rejects reconciled). Registry `metadata.version` 1.15.0 -> 1.16.0.

## [1.15.0] - 2026-06-09

Re-pinned `agent-skills-toolkit` to its `v1.5.0` release (outward grading).

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.5.0` release tag (commit `6bd2daa`), from `v1.4.1` (`01a5fac`); entry `version` 1.4.1 -> 1.5.0. v1.5.0 is the outward-grading release: a `--profile` flag grades a third-party plugin under a chosen profile without writing config into its tree, and `U2` / `U5` are reclassified as house conventions (ADR 0029) so a plain plugin is graded only on portable defects. No spine or Standard change (29 checks, Standard 0.11); a plugin graded the default way is unaffected. Registry `metadata.version` 1.14.0 -> 1.15.0.

## [1.14.0] - 2026-06-09

Re-pinned `thinking-framework-skills` to its `v0.5.0` release. (Backfilled: the re-pin shipped in marketplace PR #22.)

### Changed

- Re-pinned `thinking-framework-skills` to its `v0.5.0` release tag, from `v0.4.0`; entry `version` 0.4.0 -> 0.5.0. Registry `metadata.version` 1.13.0 -> 1.14.0.

## [1.13.0] - 2026-06-09

Re-pinned `agent-skills-toolkit` to its `v1.4.1` release (a hardening patch over v1.4.0). (Backfilled: the re-pin shipped in marketplace PR #21.)

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.4.1` release tag (commit `01a5fac`), from `v1.4.0` (`da6eded`); entry `version` 1.4.0 -> 1.4.1. v1.4.1 hardens the report renderer (graceful malformed-advisory handling, full Markdown HTML-escaping, invalid-target-tier rejection); no spine or Standard change. Registry `metadata.version` 1.12.0 -> 1.13.0.

## [1.12.0] - 2026-06-09

Re-pinned `agent-skills-toolkit` to its `v1.4.0` release (the designed evaluation report, F2 / E1).

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.4.0` release tag (commit `da6eded`), from `v1.3.0` (`d8279c2`); entry `version` 1.3.0 -> 1.4.0. v1.4.0 ships the designed evaluation-report renderer: one pure renderer over the `evaluate.mjs` report object emits a self-contained HTML page or a Markdown twin in five report types (conformance, migration, release, review, behavioral). A presentation layer over the deterministic gate, with no spine or Standard change (29 checks, Standard 0.11). Registry `metadata.version` 1.11.0 -> 1.12.0.

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
