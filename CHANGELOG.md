# Changelog

All notable changes to the `product-on-purpose` marketplace **registry** are documented here. This tracks the registry's own version line (`metadata.version` in `.claude-plugin/marketplace.json`), which is independent of any listed plugin's version.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this registry adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Upgraded `CONTRIBUTING.md` into the Standard-bound thin listing contract (clauses L1-L6, the re-pin checklist, and the enforcement ratchet), per `standards/GOVERNANCE.md` Section 2. Committed the program roadmap and convergence packet docs (written 2026-06-07) and queued the family conformance audit (`docs/internal/convergence/audit-plan.md`: one packet per member, writing-style-catalog first). Registry data unchanged.
- Ran the family conformance audits (2026-06-10): packets added for `agent-skills-toolkit` (audited @ `1fd44b7`, L1-L6 PASS, P0: 0), `thinking-framework-skills` (audited @ `d0b4a33`, L1-L6 PASS, P0: 0), and `pm-skills` (audited @ `ac0acfb`, P0: 2 - no `library.json`, embedded marketplace). Executed the `writing-style-catalog` convergence packet (its repo PR #19, open: `library.json` at tier universal / standard 0.11, skill slug canonicalized, embedded marketplace removed). Applied the audits' contract corrections to `CONTRIBUTING.md`: L2 scoped to machine-readable marketplace association (install docs are expected, not violations), L1 defers frontmatter law to the pinned Standard, L4 version agreement covers every emitted native manifest, L6 lineage note refreshed with the observed cross-member variance. Registry data unchanged.

## [1.54.0] - 2026-08-08

### Added

- **Listed `product-lifecycle-templates` v0.2.1** (pinned `d0ac358`), the registry's sixth plugin and its
  first document-template library rather than a skill collection. 26 researched document bundles covering
  the complete Tier-1 floor of a 205-type product-artifact catalog.

  **L1-L4 verified before listing, not asserted.** L1: a valid native plugin at the repo root
  (`.claude-plugin/plugin.json`). L2: independently valid, no embedded self-listing marketplace. L3: root
  `library.json` pinning Standard `0.12` at tier **universal**, and the tier was **measured** by running
  the Standard's own gate against the repository (exit 0) rather than self-declared. L4: the pinned sha
  sits on release tag `v0.2.1`, and the registry entry version, the tag, `library.json` and
  `.claude-plugin/plugin.json` all read `0.2.1`.

  **L3 was the reason the listing did not happen at v0.2.0.** That tag was cut before the listing contract
  was read and its tree carries no `library.json`, which makes a repository "loose components" under the
  Standard and ineligible. The member re-cut as `v0.2.1` rather than moving a published tag.

  **Recorded convergence backlog:** the Standard's gate reports findings at the *convergent* tier, above
  the member's declared universal ceiling, so none gates. The largest is 25 decision records carrying no
  `## TL;DR` block. Noted here so the audit program has it rather than discovering it later.

## [1.53.0] - 2026-08-08

### Changed

- Re-pinned `critique-skills` from `v0.1.2` (`db750e8`) to **`v0.1.3`** (`3f5b623`); entry `version` 0.1.2 -> 0.1.3. Registry `metadata.version` 1.52.0 -> 1.53.0. **A dependency-hygiene release, and the reason it is not batched is that the listed version misrepresents what installing this plugin costs you.** `requirements.txt` carried the Anthropic API client alongside `jsonschema`, so the obvious install command pulled an API client into every environment that installed the plugin, including the overwhelming majority that will never run its benchmark. A reader reasonably concluded the library expected them to bring an API key. It does not, and never did: a skill is a set of instructions read by the agent already in use and never places a call of its own, so there is nothing for it to authenticate. The SDK moved to a new `requirements-bench.txt`, needed only by someone re-running the measurement grid live; `requirements-dev.txt` inherits the runtime file and so no longer pulls it either. Verified on a machine with `jsonschema` and no `anthropic` package: all six skills produce contract-valid envelopes and the harness dry-run plans the full grid without a key. The release also adds a public explanation page for the benchmark harness, which answers the API-key question in its first line, and scores the plugin's joint-routing eval on its second pinned model tier (18/18 at k=3, matching the first). **No skill behavior changed and no catalog entry was added, removed, or re-scored**; the six skills, 96 criteria, and every published measurement figure are the v0.1.0 ones. Listing `description` unchanged.

## [1.52.0] - 2026-08-07

### Changed

- Re-pinned `critique-skills` from `v0.1.1` (`0ffbf0d`) to **`v0.1.2`** (`db750e8`); entry `version` 0.1.1 -> 0.1.2. Registry `metadata.version` 1.51.0 -> 1.52.0. **The version this replaces shipped a subagent nobody wrote.** Claude Code discovers subagents by scanning `agents/` for `*.md` and loads every one it finds, and the plugin carried an `agents/README.md` folder guide there, so a `README` subagent with no name and no description registered silently on every install. The cause was upstream in `agent-skills-toolkit`, whose `G8` check **required** that file, so following the family Standard produced the defect; it was withdrawn in toolkit v1.10.0 (registry 1.51.0) and this pin carries the plugin's adoption of it. v0.1.2 also adds a `smoke` CI job that runs every skill from a bare checkout with nothing installed, which is the check whose absence let v0.1.1 ship an install crash; closes a fourth skill-description collision found by measurement rather than review, on a case the plugin's own fixture had labelled an unambiguous control; scores its joint-routing eval at 18/18 on sonnet at k=3, having established that routing is stochastic and a single run proves nothing; and accepts its ADR 0030, which establishes that a CI benchmark run can authenticate from a Claude subscription rather than an API key. Above-tier conformance findings went from five to zero, four of which were grader bugs fixed upstream rather than plugin defects; the plugin stays at the Convergent tier deliberately. **No skill behavior changed and no catalog entry was added, removed, or re-scored**; the six skills, 96 criteria, and every published measurement figure are the v0.1.0 ones. Listing `description` unchanged.

## [1.51.0] - 2026-08-07

### Changed

- Re-pinned `agent-skills-toolkit` from `v1.9.0` (`395b93b`) to **`v1.10.0`** (`4f3168c`); entry `version` 1.9.0 -> 1.10.0. Registry `metadata.version` 1.50.0 -> 1.51.0. **This re-pin withdraws a rule that was creating a real defect in every plugin that followed it.** `G8` required a folder README in `agents/`, and Claude Code discovers subagents by scanning that directory for `*.md` and loads every one it finds, so a conforming plugin silently registered a phantom subagent with no name and no description. Established empirically rather than reasoned about: a probe plugin holding `real-agent.md`, `README.md`, `_README.md` and `README.txt` was loaded with `claude --plugin-dir` and returned three subagents. The underscore prefix does not protect a file. Two plugins had shipped one, including the toolkit itself, which is why this pin matters to anyone installing the toolkit as a plugin rather than pinning it in CI. Two further grader defects are fixed in the same release, both reported by `critique-skills` as the first plugin built against the Standard from scratch: `SKIP_DIRS` covered the Node ecosystem's scratch directories and not Python's, so the folder-README check walked into `__pycache__` and reported findings no plugin could act on; and `gen-index` emitted the toolkit's own file list into every consuming plugin's `INDEX.md`, a failure that hid itself because the drift check compares an index against the same generator that wrote it. **Minor rather than patch on the toolkit's own line, deliberately:** two checks changed what they require, which is a behaviour change for anyone grading against them, and a plugin previously reported as failing may now pass. Nothing that passed before newly fails; the spine stays 30 checks and the Standard stays v0.12. The release also ships two new public pages, a working practice for running more than one plugin and a statement of what the toolkit cannot do. Listing `description` unchanged.

## [1.50.0] - 2026-08-07

### Changed

- Re-pinned `writing-style-catalog` from `v0.12.0` (`4fcd0ee`) to **`v0.13.0`** (`00e4884`); entry `version` 0.12.0 -> 0.13.0. Registry `metadata.version` 1.49.0 -> 1.50.0. The release completes diff-pair coverage: all twelve anchor topics now carry side-by-side pairs, up from five, at 158 pairs total with authored commentary on every one. It also re-grounds every count the plugin publishes about itself in the files those counts describe. The listing `description` is updated in the same pass and for the same reason: it advertised 1164 worked examples and 134 diff-pairs, two figures that were already stale and that disagreed with the plugin's own manifest, which said 130. All three now read 1193 and 158, each verified by counting files rather than by copying from another document. No skill behavior changed and no catalog entry was added, removed, or promoted; the 97 stable entries are the v0.12.0 ones.

## [1.49.0] - 2026-08-06

### Changed

- Re-pinned `critique-skills` from `v0.1.0` (`aed5984`) to **`v0.1.1`** (`0ffbf0d`); entry `version` 0.1.0 -> 0.1.1. Registry `metadata.version` 1.48.0 -> 1.49.0. **This re-pin fixes a defect that made the listed version crash on a fresh install**, which is the reason it is not batched. `contract/validate.py` imported `jsonschema` at module load, and every skill's scripted lane reaches that module, so on any machine without the package a freshly installed plugin answered step 2 of every skill's protocol with a raw `ImportError` traceback. Claude Code's `/plugin install` clones a repository; it does not run `pip`. Because this registry pins a commit, every install between the 2026-08-04 listing and this entry served the broken commit: the fix landing on `main` reached nobody until the pin moved. The import is now lazy and both CLI boundaries report the exact install command with no traceback. Also in v0.1.1: `python` corrected to `python3` in the `critique-critic` subagent (the documented commands did not resolve on stock Linux or macOS); `.gitattributes` widened after all 22 recorded example-artifact hashes were found to be wrong on any Windows checkout, with a test added that recomputes them; sibling boundary clauses added to the descriptions of three colliding skill pairs (`critique-argument`/`critique-clarity`, `critique-microcopy`/`critique-usability`, `critique-accessibility`/`critique-docs`) after an external review found nothing in the pipeline tested cross-skill discrimination; a new `evals/joint-routing.eval.json`, deliberately unscored in CI; an architecture doc pair; and a provenance record for the calibration run set that three separate documents had flagged as missing. `TOOLKIT_REF` was also bumped to adopt `agent-skills-toolkit` PR #189, taking the plugin's above-tier findings from five to zero, so `tier-report` now reports no blockers to Advanced. **No skill behavior changed and no catalog entry was added, removed, or re-scored**; the six skills, 96 criteria, and every published measurement figure are the v0.1.0 ones. Listing `description` unchanged.

## [1.48.0] - 2026-08-04

### Added

- Listed **`critique-skills`**, pinned to its `v0.1.0` release tag (commit `aed5984`), https `url` source, `strict: true`. Registry `metadata.version` 1.47.0 -> 1.48.0. This is the registry's first new listing since `writing-style-catalog` and brings the family to five members. Six skills (`critique-accessibility`, `critique-argument`, `critique-clarity`, `critique-docs`, `critique-microcopy`, `critique-usability`) plus the `critique-critic` sub-agent, each reviewing an artifact against a published external rubric (WCAG 2.2, Nielsen's ten usability heuristics, the Toulmin model, Diataxis, NN/g's error-message guidelines, the Federal Plain Language Guidelines, Williams' *Style*) and reporting criterion-cited structured findings rather than freeform commentary. What separates it from a generic critique prompt is not output quality but accountability: every finding carries a permanent criterion ID traceable to its published source, emits against a frozen JSON Schema contract, and the plugin publishes its own measured recall, precision, and run-to-run consistency against a seeded-defect corpus with known ground truth (502 committed run envelopes across two pinned model tiers). It publishes where it loses as well: precision is the weak axis at 0.155 to 0.38 at criterion level, and `critique-usability` does not qualify on the Sonnet tier. **L1-L4 evidence:** `.claude-plugin/plugin.json` sits at the repo root with every required field; no embedded self-listing marketplace exists anywhere in the repo; `library.json` pins Standard `0.12` and declares tier `convergent` (Silver), above the universal floor, with the repo's own conformance gate returning 0 errors and 0 warnings at that tier; versions agree across the release tag, `library.json`, `.claude-plugin/plugin.json`, and this entry (all 0.1.0); and the plugin repo carries a dated `[0.1.0] - 2026-08-03` CHANGELOG entry. **L5 is not met, and is not waived:** `critique-skills` ships no documentation site yet, so there is nothing for the family site standard to apply to. Its site is scheduled for v0.2, and L5 remains a SHOULD until STANDARD.md Section 14 lands.

## [1.47.0] - 2026-08-02

### Changed

- Re-pinned pm-skills from v2.31.0 (`a0111e8`) to v2.31.1 (`32e2837`); listed version 2.31.0 to 2.31.1. v2.31.1 is a maintenance patch in the plugin repo: the merge-pipeline required-check fix, a dependency security drain (ten open alerts to zero), two documentation-site build repairs, and a validator race fix. No pm-skills catalog change (68 skills / 6 sub-agents).

## [1.41.0] - 2026-07-27

### Changed

- Re-pinned `agent-skills-toolkit` from `v1.7.0` (`8340a6f`) straight to **`v1.9.0`** (`395b93b`); entry `version` 1.7.0 -> 1.9.0. Registry `metadata.version` 1.40.0 -> 1.41.0. This skips a v1.8.0 pin deliberately: two releases landed in quick succession and pinning each in turn would have published an intermediate state nobody would install, so both are described here. **v1.8.0 "deep builders, measured advisory"** made the thirteen builder skills teach rather than merely scaffold: every one now ships working examples, where previously not a single one did, and the four hardest ship three good examples plus a deliberately wrong one each. It also made the optional AI review layer measurable, with a test plugin carrying nine known flaws and three deliberate traps that are not flaws, scored so that a confident wrong answer counts as both a false alarm and a miss and therefore rates worse than saying nothing. **v1.9.0 "standards watch and the decisions discipline"** added the twenty-fourth skill, `askit-standards-watch`, which discharges an obligation the toolkit's own Standard had stated and never implemented: knowing when the upstream agentskills.io spec has moved. It pins a git blob hash per normative artifact rather than a version or a repository head, because the upstream publishes neither tags nor releases and its head moves on unrelated commits. It reports what changed and which checks it lands on, and deliberately refuses to judge whether a prose change matters, because that is a person's call. Alongside it, every decision record now names the exact files that implement it, a discipline which found a real defect on its first application. Also fixed across the two releases: a report that could announce a quality tier the plugin had never declared, and a text-escaping defect found in three independently written places. Spine stays 30 checks and the Standard stays 0.12 throughout: nothing that passed before newly fails. Listing `description` unchanged; no catalog entries were added, removed, or re-scored.

## [1.40.0] - 2026-07-26

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.7.0` release tag (commit `8340a6f`), from `v1.6.1` (`cd12e10`); entry `version` 1.6.1 -> 1.7.0. Registry `metadata.version` 1.39.0 -> 1.40.0. v1.7.0 is "trust and craft", the first release of that repo's four-release uplift program, and it does two things this registry cares about. First, it makes the toolkit's own claims about itself true and keeps them true: its README advertised a version three releases old and the wrong check count, both now corrected and both now asserted by a check that fails the build if the front page and the manifest ever disagree again. A validator that misreports its own version has a credibility problem before it grades anything. Second, it adds judgment on top of conformance: the skill builder can now run an optional craft review against a written rubric once the deterministic gate is already clean, applying only a closed list of mechanical fixes and only with explicit consent, and structurally unable to move the grade. Also in this release: grading a corpus of real third-party libraries became one command that refuses a drifted, empty, or dirty checkout rather than silently grading nothing; checks that were never exercised now report "not applicable" instead of "passed"; and CI gained Dependabot, a real Node version matrix, a blocking dependency audit, commit-pinned third-party actions, and static security analysis, which found two genuine high-severity escaping defects on its first day. Spine stays 30 checks and the Standard stays 0.12: nothing that passed before newly fails. Listing `description` unchanged: no catalog entries were added, removed, or re-scored.

## [1.39.0] - 2026-07-26

### Changed

- Re-pinned `agent-skills-toolkit` to its `v1.6.1` release tag (commit `cd12e10`), from `v1.6.0` (`c2bcbe2`); entry `version` 1.6.0 -> 1.6.1. Registry `metadata.version` 1.38.0 -> 1.39.0. v1.6.1 is that repo's trust patch, and it matters to this registry because the toolkit is the validator every other member is graded by: pointed at five real repositories, its Mermaid-diagram check turned out to be wrong about two pieces of legitimate notation, and **11 of the 14 diagram errors it reported across those repositories were its own fault**. Sequence-diagram async arrows (`-)`) and entity-relationship cardinality (`||--o{`) are now read as the grammar they are, scoped per diagram type so a genuinely unbalanced bracket still fails. Template-placeholder links (`{{path}}`, `{release-url}`) are no longer counted as broken links. The gate's output also stopped contradicting itself: findings above a plugin's declared tier now print under a heading saying plainly that they cannot affect the grade, instead of appearing as a wall of `[error]` lines directly above a line reading "0 error(s)", and a plugin pinned to an older Standard is now told how many findings that pin is holding back and when they come due. Measured against the audited repositories: 56 -> 43 errors on one, 18 -> 14 on another, landing exactly on the counts that had been hand-verified independently before the fix existed. No Standard implication: spine stays 30 checks, Standard stays 0.12, and nothing that passed before newly fails. Listing `description` unchanged: no catalog entries were added, removed, or re-scored.

## [1.38.0] - 2026-07-16

### Changed

- Re-pinned `writing-style-catalog` to its `v0.7.0` release tag (commit `1456ff5`), from `v0.6.0` (`6a82bd5`); entry `version` 0.6.0 -> 0.7.0. Registry `metadata.version` 1.37.0 -> 1.38.0. v0.7.0 is that repo's audit release: 41 of the 45 findings from its 2026-07-10 six-dimension audit, including every confirmed high-severity one. The change users will actually notice is the `entry-recommender` payload. It returned full field text for every qualifying candidate on every call, which on a real situation meant 106,847 bytes (roughly 27,000 tokens) in a single response, past the tool-response cap the skill has to fit inside; its own documented headline example was unusable as written. Full text now loads only for candidates that clear the relevance bar, and a situation where nothing qualifies no longer pays full price for near-misses (36,302 -> 8,667 bytes). Also in this release: all three skills' documented commands now work in marketplace and ZIP installs rather than only in a repo checkout (they were CWD-relative, so the install path this listing serves was the broken one); `style-profile` enforces where a profile may be written in code rather than in instructions; the test suite went 111 -> 178 and now actually runs in CI; and the manifests declare the dual license (`Apache-2.0 AND CC-BY-4.0`) that ADR 0003 ratified but no machine could read. Listing `description` unchanged: no catalog entries were added, removed, or re-scored.

## [1.37.0] - 2026-07-05

### Changed

- Re-pinned `pm-skills` to its `v2.31.0` release tag (commit `fa0111e8`), from `v2.30.0` (`87e423c5`); entry `version` 2.30.0 -> 2.31.0. Registry `metadata.version` 1.36.0 -> 1.37.0. v2.31.0 is that repo's zero-drift release: v2.30.0 had fixed every live instance of count drift across its surfaces, and this one removes the hand-write path that produced it. A generator now owns the README catalog tables and badges, both quickstarts, the sub-agent compatibility matrix, the three plugin-manifest description headlines, and the release-notes mirrors, each inside a marker pair with a `--check` tripwire that fails CI on a hand edit. Also in this release: release-please runs in shadow (its Release PR observed and diffed, never merged), two CI-hanging shell validators ported to Node, trigger-fixture coverage lifted from 31 to 43 of 68 skills, an output-eval CI lane, a published evals page, and a provenance page in SECURITY.md. Catalog unchanged at 68 skills (30 phase + 11 foundation + 12 utility + 15 tool) and 6 sub-agents; no new skills. Listing `description` unchanged: no catalog entries were added, removed, or re-scored.
- **Backfilled 2026-07-26.** This entry was missing: the `metadata.version` bump to 1.37.0 shipped in PR #51 without a matching CHANGELOG entry, which the following 1.38.0 entry then referenced as its own starting point. Reconstructed from the registry diff at commit `efe67f5` and the pinned repo's own `v2.31.0` release notes. Recorded here rather than silently closed, because the gap is exactly the failure mode the re-pin checklist's fourth item exists to prevent.

## [1.36.0] - 2026-07-05

### Changed

- Re-pinned `writing-style-catalog` to its `v0.6.0` release tag (commit `6a82bd5`), from `v0.5.2` (`ce0aefe`); entry `version` 0.5.2 -> 0.6.0. Registry `metadata.version` 1.35.0 -> 1.36.0. v0.6.0 adds a third skill, `entry-recommender`: describe a writing situation and it scores the stable catalog, picks a voice/tone/style/format combination with a reason quoting each entry's own field language, and composes the prompt in the same step - reusing `writing-instruction-builder`'s existing conflict-detection and composition logic rather than reimplementing either. The new skill went through 8 rounds of design-level adversarial review, 11 rounds against the real implementation, and one independent cross-model verification pass before release (see `docs/internal/entry-recommender-spec.md`'s Revisions section in that repo). Listing `description` updated: entry count corrected 1193 -> 1164 (the prior figure was never accurate; verified against the real file count), and the new skill named alongside `style-profile`.

## [1.34.0] - 2026-07-03

### Changed

- Re-pinned `writing-style-catalog` to its `v0.5.2` release tag (commit `ce0aefe`), from `v0.5.1` (`2869c37`); entry `version` 0.5.1 -> 0.5.2. Registry `metadata.version` 1.33.0 -> 1.34.0. v0.5.2 is a content-accuracy and documentation-hygiene patch (no new taxonomy entries): fixed fictional entry IDs used as copy-pasteable examples in several hand-authored guides, a stale promotion-criteria description superseded by the real Gate 2 system, stale single-anchor-topic framing now that twelve anchor topics exist, and two `AGENTS.md` governance claims (the `docs/internal/` read-only rule and the shipped-skill count) that no longer matched the repo's own demonstrated practice. Listing `description` unchanged - still accurate at 97 entries / 1193 examples / 130 diff-pairs / 14 recipes.

## [1.33.0] - 2026-07-02

### Changed

- Re-pinned `writing-style-catalog` to its `v0.5.1` release tag (commit `2869c37`), from `v0.2.0` (`3685d65`); entry `version` 0.2.0 -> 0.5.1. Registry `metadata.version` 1.32.0 -> 1.33.0. This catches up four releases at once (v0.3.0 through v0.5.1) - the listing had never been re-pinned since its initial v0.2.0 launch. v0.5.1 ships 97 curated entries (up from 60: a gated Stream-B breadth program promoted 37 new format entries across two waves), 1193 worked examples across twelve anchor topics (up from 195 across three), a `style-profile` skill, conflict-aware composition, and an agentic generation factory for scaling the catalog. Also corrected the listing `description`, which still named the pre-rename `compose-instruction` skill and v0.2.0-era counts.

## [1.25.0] - 2026-06-16

### Changed

- Re-pinned `thinking-framework-skills` to its `v0.9.0` release tag (commit `c9ce723`), from `v0.8.0` (`650e3a0`); entry `version` 0.8.0 -> 0.9.0. Registry `metadata.version` 1.24.0 -> 1.25.0. v0.9.0 ("Discoverable by agents") ships a generated, drift-gated machine-readable discovery surface at the site root - `llms.txt` (the llmstxt.org index), `catalog.json` (the 69 invokable skills, tools, and recipes with routing and chaining fields), and `evaluated.json` (all 135 graded methods) - so other agents can find and route to the library, plus the post-v0.8.0 measurement loop and example-coverage ratchet. No new skills; the catalog stays 56 frameworks / 4 tools / 9 recipes.

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
