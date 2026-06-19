# Tier requirements reference - Bronze, Silver, Gold

> Reference for maintainers. It states, precisely, what each conformance tier of the Advanced Skill Library Standard demands: the tier philosophy, the per-tier hard and governance requirements, the complete 30-check spine, the tier-report format, where each of the four family repos stands today, and how the tiers map onto the enforcement ramp.
>
> Grounded in `agent-skills-toolkit/STANDARD.md` v0.12 (Section 2 tier model, the frozen Gold criteria G1-G10 in 2.6, the 2.5 concrete-requirements table, Section 3 component specs) and the actual check modules under `agent-skills-toolkit/scripts/checks/`. The Standard lives in the sibling repo `agent-skills-toolkit` today; Phase 0 relocates it to `standards/STANDARD.md` (see D14 (runner-consumption = reusable workflow) and the Phase 0 plan). RFC 2119 keywords (MUST, SHOULD, MAY) are normative and appear in caps.

Per-repo current standing draws from the convergence packets under [`../convergence/`](../convergence/): [agent-skills-toolkit](../convergence/agent-skills-toolkit-conformance.md), [pm-skills](../convergence/pm-skills-conformance.md), [thinking-framework-skills](../convergence/thinking-framework-skills-conformance.md), and [writing-style-catalog](../convergence/writing-style-catalog-library-json.md).

---

## 1. Tier philosophy

The three tiers are not arbitrary difficulty bands. Each tier corresponds to a **verified portability reality**: Claude Code (CC) and OpenAI Codex CLI (CX) support the same *concepts*, but the artifact that carries a concept is portable to a different degree depending on the concept. The tier of a component is fixed by how portable its artifact is, not by how hard it was to build (Standard 2.1-2.3).

### 1.1 The portability axis

| Tier | Standard name | Portability property | What it means concretely |
|---|---|---|---|
| **Bronze** | Universal | **Identical files** work across all agentskills.io-compliant agents (~50 agents, CC and CX among them). | An agentskills.io `SKILL.md`, an `AGENTS.md`, an MCP server definition: the same bytes run everywhere. Nothing is emitted per target. |
| **Silver** | Convergent | **Same concept, per-target formats.** Both agents support the concept, but each ingests a different file. | Subagents, slash commands, workflows, chain contracts, plugin packaging. The plugin MUST emit each such component once per declared target. |
| **Gold** | Advanced | **Deep, lifecycle, and often agent-specific** capability. | Hooks, output styles, statusline, full self-hosting CI, generated manifests, eval/regression coverage. Some of these exist on only one agent (output styles are Claude-only), which is exactly why they sit at the agent-specific tier. |

### 1.2 Monotonic inclusion

Higher tiers include all requirements of lower tiers. A Silver plugin satisfies every Bronze requirement plus the Silver additions; a Gold plugin satisfies Bronze + Silver + Gold. This is a structural property of the tier model, not a separately verified check: tier inclusion was carried as a numbered "G7" before Standard v0.10 and is now an unnumbered statement, freeing `G7` for the `docs-frontmatter` check (Standard 2.6). A plugin at Gold is, by construction, a self-proving example of the Standard - an advanced skill library.

A plugin MAY conform at any single tier. It declares its **target** tier in `library.json` (`tier`), and tooling verifies the **highest tier actually satisfied**, flagging any claim above what is met (Standard 2.4, 5.1).

### 1.3 Audience per tier

The tiers are also an on-ramp ordered by reader sophistication (Standard 2.5, audience row):

- **Bronze - beginner on-ramp.** The cheapest honest plugin: a folder of valid skills plus a minimal manifest. Every repo can pass this fast.
- **Silver - intermediate.** Multi-agent emission, a real manifest with a component index, governance backlogs and per-component history.
- **Gold - advanced.** The full lifecycle: self-hosting CI, generated artifacts, eval/regression coverage, deprecation policy, documentation taxonomy. This is the bar the toolkit holds itself to as the family's self-proving reference.

---

## 2. Bronze (Universal)

**What a Bronze plugin IS.** A package of agentskills.io-compliant skills (optionally an `AGENTS.md` and MCP servers) carrying a minimal `library.json` - the manifest that turns a bare folder of "loose components" into a *plugin* (a release unit with a version). Its files run unchanged on any agentskills.io agent. It does not emit anything per target; it ships no subagents, commands, workflows, hooks, or chain contracts as Bronze components.

**What a Bronze plugin is expected to do.** Provide one or more well-formed, discoverable skills whose `name` matches its directory, whose `description` meets the discoverability bar, and whose references resolve. Carry the manifest that pins the Standard version and declares the tier.

### 2.1 Hard requirements (MUST)

- **`library.json` present** with at least `name`, `version`, `tier`, plus `description` and `standard` (the manifest schema, Standard 5/5.1). A folder of skills without it is "loose components," not a Bronze plugin.
- **Valid component frontmatter** - parses as YAML, carries a valid `name` and `description` (Standard 3.1, 3.8).
- **`name` equals the directory name** for every skill (Standard 3.1).
- **`description` meets the 8.1 bar** - states what the component does AND when to use it, with trigger keywords (scored; below 0.7 is a warn, never a hard gate).
- **References one level deep** - every relative link in a component resolves on disk (Standard 3.1).
- **Instruction budget** - each skill body stays within budget so later instructions are not silently dropped (Standard 1, 3.1; warn).
- **Root `AGENTS.md` present** (Standard 3.10) - the agent-facing project entrypoint, required at every tier.
- **Component `version` present** on every component at every tier (Standard 3.7).
- **`mermaid` blocks structurally valid** where the plugin carries diagrams (`U12`; conditional - a plugin with no mermaid passes vacuously).
- **Skill registration consistent** where the manifest enumerates skills: every skill on disk is registered and every registered skill exists on disk (`U13`, Standard 2.1; conditional on an enumerating manifest; ships `warn` at Standard 0.12, becomes `error` at 0.13 per the burndown).
- **Native manifest non-drift** - committed native manifests match what is generated from `library.json` (`U8`; version drift is an `error`, name drift a `warn`).
- **MCP definitions well-formed** where present - one portable `.mcp.json` at the plugin root (`U11`; conditional on the plugin shipping MCP).
- **`library.json` version agreement** - the manifest is the version source of truth and the versions agree (`U9`).

### 2.2 Governance requirements

- Samples are **optional** at Bronze (Standard 2.5). A skill SHOULD ship representative golden + anti examples (Standard 7.2), but the count is a SHOULD; no governance file is required.
- A per-component `HISTORY.md` is **RECOMMENDED** at Bronze (it becomes a MUST at Silver+; Standard 7.3).

### 2.3 Enforcing checks

`U1` library-json, `U2` anatomy (root `AGENTS.md`), `U3` frontmatter-valid, `U4` name-matches-dir, `U5` description-score, `U6` reference-links, `U7` instruction-budget, `U8` manifest-drift, `U9` version-match, `U11` mcp-valid, `U12` mermaid-valid, `U13` skill-registration. (`U10` no-dashes was retired at Standard v0.11 - house style is not a portability requirement.)

---

## 3. Silver (Convergent)

**What a Silver plugin IS.** A multi-agent plugin. In addition to Bronze, it carries Convergent components - subagents, slash commands, workflows, plugin packaging, chain contracts - and emits each of them in the correct format for every agent target it declares. Its manifest is no longer minimal: it declares `agent-targets` and a name `prefix`, and carries a full `components` index that mirrors what is on disk.

**What a Silver plugin is expected to do.** Reach both CC and CX (where it claims both) by emitting each convergent component per target; keep its manifest and disk in lock-step; declare safe inter-component invocation explicitly; and maintain the lifecycle governance (two backlogs, per-component history, a changelog) that makes "best in class" reproducible by contributors.

### 3.1 Hard requirements (MUST, in addition to Bronze)

- **`agent-targets` declared** in `library.json` (`claude`, `codex`, or both) (`S1`, Standard 2.2, 5.1).
- **Component name `prefix` declared** in the manifest (`S2`, Standard 8.2) - so generic names disambiguate on every agent.
- **`components` index present and accurate** - each entry's `path`, `version`, `status` matches the component on disk (`S3`, Standard 5.1).
- **Manifest mirrors disk both ways** - every component on disk is declared, every declared component exists (`S8`, the bidirectional mirror).
- **Each convergent component emitted per declared target** (`S6`, Standard 2.2, 3). Note the Codex carve-out: a distributed plugin cannot ship Codex-ingested **subagents** (Codex `[agents.*]` is user/project `config.toml`, not a plugin-distributable component as of Codex CLI ~v0.135), so a plugin-shipped subagent targets Claude only (`agent-targets: [claude]`). "Emit both formats" applies to components Codex CAN ingest as a plugin: skills, hooks, MCP.
- **Chain contracts valid** - a **conditional MUST**: required if and only if chaining is used. Any inter-component invocation MUST be permitted by `agents/_chain-permitted.yaml`; tooling flags orphans (invocations not covered) and phantoms (entries pointing at missing components) (`S4`, Standard 3.6). A plugin that chains nothing ships no contract file.
- **Workflow skill-existence** - every skill a workflow references actually exists (`S5`, Standard 3.4).
- **Command contract** - each command declares its contract and maps to exactly one skill or workflow for every declared target (`S7`, Standard 3.2).
- **Semver** throughout, with the deterministic plugin-version propagation rule (the plugin bump equals the largest component bump since the last release; Standard 7.4).

### 3.2 Governance requirements (in addition to Bronze)

- **Two backlogs** in `docs/internal/backlog/` - one for new-component proposals, one for enhancements (Standard 7.1).
- **Per-component `HISTORY.md`** - a co-located dated history file beside each component (Standard 7.3, MUST at Silver+; RECOMMENDED at Bronze). Per D16 (HISTORY.md = amend + grandfather): the enforcing check ships warn-then-error and requires `HISTORY.md` only on NEW or CHANGED components going forward; existing components are grandfathered, no mass backfill.
- **`CHANGELOG.md`** maintained, aggregating component histories; the frontmatter version, history file, and changelog MUST NOT contradict each other (Standard 7.3).

### 3.3 Enforcing checks

`S1` agent-targets, `S2` prefix, `S3` components-index, `S4` chain-contract, `S5` workflow-skills, `S6` per-target-presence, `S7` command-contract, `S8` components-mirror. (HISTORY-presence is the new enforcing check D16 adds, shipping warn-then-error.)

---

## 4. Gold (Advanced)

**What a Gold plugin IS.** The self-proving reference. In addition to Bronze + Silver, it carries Advanced components (hooks, optionally output styles / statusline) and the full lifecycle apparatus: self-hosting CI that runs the tier-applicable check suite and passes it, generated INDEX and native manifests drift-checked against the authored `library.json`, eval/regression coverage for chains and hooks, a curated release-notes file, a deprecation policy, and a documented docs tree. A Gold plugin proves the Standard by passing it against itself.

**What a Gold plugin is expected to do.** Validate itself in CI (self-hosting), generate rather than hand-maintain its native manifests, demonstrate that changing one component does not silently break a chained consumer or a hook, and carry audience-aware documentation. The toolkit targets Gold at v1 and MUST pass `G1-G10` against itself before release.

The Gold criteria are **frozen** (Standard 2.6): every Gold requirement is a hard, testable build target, with the line drawn between the v1 baseline (required) and the advanced elaboration the roadmap defers.

### 4.1 Hard requirements (MUST, in addition to Bronze + Silver)

| # | Requirement | Deferred elaboration (NOT required at Gold) |
|---|---|---|
| **G1** | **Hooks documented.** Every hook documents its event, trigger, matcher (if applicable), scope, and failure behavior (Standard 3.5, 9). | - |
| **G2** | **Self-hosting CI that passes.** The plugin ships CI that runs the full tier-applicable check suite via the portable scripts and passes it. "Self-hosting" = the plugin passes its own validators. | - |
| **G3** | **Eval/regression coverage for chains and hooks (baseline).** Each chain edge and each hook has at least one eval/regression case; CI executes them; a regression check confirms a change to one component does not silently break a chained consumer or hook. | the multi-tier eval **engine** (Static / LLM-Judge / Monte-Carlo). Baseline presence + execution is required; the advanced judging system is roadmap. |
| **G4** | **Generated INDEX + manifests.** `INDEX.md`, the native plugin manifests (`.claude-plugin/plugin.json`, Codex `plugin.json`), and `manifest.generated.json` are generated from the authored `library.json` + component frontmatter and drift-checked; a hand-edited generated file is an `error`. (`library.json` itself is authored canonical, not generated.) | - |
| **G5** | **RELEASE-NOTES.** A curated, user-facing `RELEASE-NOTES.md`, distinct from the technical `CHANGELOG.md`. | - |
| **G6** | **Deprecation policy.** Defines and follows `status: deprecated` + `deprecated-by` + `remove-in` handling; tooling recognizes deprecated components. | a dedicated `deprecate` **automation skill**. The policy + frontmatter handling are required; automating them is roadmap. |
| **G7** | **Docs frontmatter taxonomy.** Every published `docs/**` page (excluding `docs/internal/`) carries `title`, `description` (no colon-space), `audience`, `level`, optional `tags` / `doc-role` (Standard 8.4). Conditional on a published docs tree. | - |
| **G8** | **Folder-README inventory.** Every meaningful folder carries a `README.md` with a frontmatter `title` and an inventory whose listed immediate children set-equal the folder's actual immediate children. Conditional on the allowlisted folder existing. | - |
| **G9** | **Source docblocks.** Every hand-authored `*.mjs` / `*.js` / `*.py` under the in-scope source roots carries a four-field header docblock (what it is / what it does / why / what uses it). Presence of the four fields, never prose quality. Conditional on in-scope source existing. | - |
| **G10** | **Docs presence.** The four Diataxis quadrants (`docs/{tutorials,how-to,reference,explanation}`) are non-empty, every ADR (`docs/internal/decisions/NNNN-*.md`) carries a `## TL;DR`, and the `doc-role: architecture-overview` page resolvably links the `architecture-detailed` page. Conditional on a published docs tree. | - |

### 4.2 Governance requirements (in addition to Bronze + Silver)

- **RELEASE-NOTES** (G5) and a **deprecation policy** (G6), per the table above.
- Regression coverage for chains and hooks is a MUST at Advanced (Standard 8.3).

### 4.3 Enforcing checks

`G1` hook-documentation, `G2` self-hosting, `G3` library-regression, `G4` index-drift, `G5` release-notes, `G6` deprecation, `G7` docs-frontmatter, `G8` folder-readme, `G9` source-doc, `G10` docs-presence.

Conformance **badges/branding** are not a Gold requirement at v1: tooling reports the tier it verifies (Section 5), it does not brand it.

---

## 5. The complete 30-check spine

The spine is `U1-U9` + `U11-U13` + `S1-S8` + `G1-G10` = **30** checks (`U10` no-dashes retired at Standard v0.11; `U13` skill-registration added at v0.12). Each check is one deterministic, model-free module under `agent-skills-toolkit/scripts/checks/`, registered to a single requirement id. (`agentskills.mjs` is an aggregator surfacing the agentskills.io surface and carries no requirement id; it is not one of the 30.)

Severity convention (Standard 4.5): the aggregate gate fails on any `error` and never on `warn` alone. "Conditional" means the check is vacuous (passes) when the triggering artifact is absent.

### 5.1 Universal (Bronze) - 12 checks

| id | check module | tier | what it verifies | severity / conditional |
|---|---|---|---|---|
| U1 | library-json | Bronze | `library.json` exists at root with the required fields (`name`, `version`, `description`, `standard`, `tier`). | error |
| U2 | anatomy | Bronze | Repo-root `AGENTS.md` exists (a house anatomy convention). | error |
| U3 | frontmatter-valid | Bronze | Each component's frontmatter parses and carries a valid `name` and `description`. | error |
| U4 | name-matches-dir | Bronze | Each skill's frontmatter `name` equals its directory name. | error |
| U5 | description-score | Bronze | Scores each skill description against the 8.1 bar (what + when-to-use trigger). | warn below 0.7 (never a hard gate) |
| U6 | reference-links | Bronze | Every relative link in a component resolves on disk (no dangling references). | error |
| U7 | instruction-budget | Bronze | Each skill body stays within the instruction budget so later steps are not silently dropped. | warn |
| U8 | manifest-drift | Bronze | Committed native manifests match what `gen-manifest` produces from `library.json`. | version drift error / name drift warn |
| U9 | version-match | Bronze | `library.json` is the version source of truth; versions agree. | error |
| U11 | mcp-valid | Bronze | MCP server definitions live in one portable `.mcp.json` at the plugin root and are well-formed. | error; conditional on shipping MCP |
| U12 | mermaid-valid | Bronze | Every fenced `mermaid` block is structurally valid (recognized diagram keyword, balanced brackets, no tabs). | error; conditional on carrying diagrams |
| U13 | skill-registration | Bronze | Skills registered in the enumerating manifest set-equal the skill dirs on disk (no on-disk-but-unregistered, no registered-with-no-dir). | conditional on an enumerating manifest; `warn` at Standard 0.12, `error` at 0.13 (burndown) |

### 5.2 Convergent (Silver) - 8 checks

| id | check module | tier | what it verifies | severity / conditional |
|---|---|---|---|---|
| S1 | agent-targets | Silver | `library.json` declares `agent-targets` and each is a recognized agent. | error |
| S2 | prefix | Silver | Every component name carries the library `prefix` so names do not collide once emitted. | error |
| S3 | components-index | Silver | Each `library.json` components entry (`path`, `version`, `status`) matches the component on disk. | error |
| S4 | chain-contract | Silver | Every inter-component invocation is permitted by `agents/_chain-permitted.yaml` (no orphans, no phantoms). | error; **conditional MUST** - required only if chaining is used |
| S5 | workflow-skills | Silver | Every skill a workflow references actually exists. | error; conditional on shipping workflows |
| S6 | per-target-presence | Silver | Each convergent component is present in the correct format for every declared target agent. | error |
| S7 | command-contract | Silver | Each command declares its contract and maps to exactly one skill for every declared target. | error; conditional on shipping commands |
| S8 | components-mirror | Silver | Every component on disk is declared in `library.json` and every declared component exists (bidirectional mirror). | error |

### 5.3 Advanced (Gold) - 10 checks

| id | check module | tier | what it verifies | severity / conditional |
|---|---|---|---|---|
| G1 | hook-documentation | Gold | Every hook documents its event, trigger, matcher, scope, and failure behavior. | error; conditional on shipping hooks |
| G2 | self-hosting | Gold | A workflow under `.github/workflows/` runs the conformance gate (the plugin passes its own validators in CI). | error |
| G3 | library-regression | Gold | Each chain edge and each hook event carries at least one eval/regression case under `evals/`. | error; conditional on chains/hooks present |
| G4 | index-drift | Gold | `INDEX.md` (and native manifests) are generated from `library.json` + frontmatter and drift-checked; a hand-edited generated file is an error. | error |
| G5 | release-notes | Gold | The plugin maintains a curated, user-facing `RELEASE-NOTES.md` at the root, distinct from `CHANGELOG.md`. | error |
| G6 | deprecation | Gold | Every component `status` is valid and a deprecated component declares `deprecated-by` and `remove-in`. | error |
| G7 | docs-frontmatter | Gold | Every published `docs/**` page (excluding `docs/internal/`) carries the 8.4 taxonomy (`title`, `description` no colon-space, `audience`, `level`). | error; conditional on a published docs tree |
| G8 | folder-readme | Gold | Every meaningful folder carries a `README.md` with a `title` and an inventory set-equal to its actual immediate children. | error; conditional on the allowlisted folder existing |
| G9 | source-doc | Gold | Every hand-authored `.mjs`/`.js`/`.py` under the in-scope source roots carries the four-field header docblock. | error; conditional on in-scope source existing |
| G10 | docs-presence | Gold | The four Diataxis dirs are non-empty, every ADR carries a `## TL;DR`, and the architecture-overview page links the architecture-detailed page. | error; conditional on a published docs tree |

---

## 6. The tier report

Tooling MUST emit both a machine-readable and a human-readable form (Standard 2.4). The report names the **tier achieved**, the **tiers satisfied** (monotonic, so a Silver plugin satisfies Bronze + Silver), and - for the next tier up - the specific **blocking requirements keyed to their requirement ids**. The `blocked` list is the actionable payload: a to-do list to the next tier, not just a grade.

Machine form:

```json
{ "tier": "silver",
  "satisfies": ["bronze", "silver"],
  "blocked": { "gold": ["G3: no eval cases for chain rs-synthesis"] } }
```

Human form (one line): `Tier: Silver (Gold blocked: G3 eval coverage missing for 1 chain)`.

Reading a report:

- **`tier`** is the highest tier actually satisfied, which MAY be below the declared `library.json` `tier`. Tooling MUST flag a claim above what is met.
- **`satisfies`** lists every tier met, lowest to declared.
- **`blocked`** maps the next tier up to the requirement ids (`U#`/`S#`/`G#`) that block it, each with a one-line remediation naming the offending artifact.

Pinned-version grading (Standard 7.7): tooling reads `library.json.standard` and grades against that version's requirement set. A check introduced AFTER the pinned version is surfaced as a `warn` (never gate-failing) until the plugin re-pins. This is why a repo pinned at an old Standard can report 0 errors with many warnings (see thinking-framework-skills below).

---

## 7. Current per-repo standing

Snapshot from the convergence packets (audited 2026-06-07 to 2026-06-10). All four repos are listed in the external `agent-plugins` registry; the question here is each repo's honest tier and what blocks the next one.

| Repo | Declared tier | Pinned Standard | Highest tier met today | Headline |
|---|---|---|---|---|
| agent-skills-toolkit | advanced | 0.11 | **Gold** (gate Advanced, 0/0) | Self-proving reference; no listing blockers. |
| thinking-framework-skills | advanced | 0.8 | **Gold** at the pin (0 errors, 81 warns) | Cleanest L1-L5 pass; warns are all post-0.8 checks. |
| pm-skills | (declared none yet) | none | **below Bronze** ("loose components") | Heaviest converge; no `library.json` + live embedded marketplace. |
| writing-style-catalog | (declared none yet) | none | **below Bronze** ("loose components") | Smallest converge; no `library.json`, name/dir mismatch. |

### 7.1 agent-skills-toolkit - Gold, no blockers

The family's Gold self-proving reference. Pins `standard: "0.11"`, declares `tier: "advanced"`; the self-hosted gate reports `Tier: Advanced` at 0 errors / 0 warnings and CI is green at the pinned sha. **No blocker to its declared tier.** The residual work is governance fidelity, not tier movement:

- **Per-component `HISTORY.md` absent** (0 of 32 components), a Silver+ MUST the gate does not yet enforce. Resolved by D16 (HISTORY.md = amend + grandfather): grandfather existing components, enforce forward.
- **The shipped hook is not in the components index** (`library.json` has no `hooks` key) - a manifest-vs-disk blind spot to close.
- Two small L5 site residuals (deploy-build 14.11 guards, a base single-source).

### 7.2 thinking-framework-skills - Gold at its pin, cadence decision open

Pins `standard: "0.8"`, declares `tier: "advanced"`; the gate reports `Tier: advanced`, **0 errors, 81 warnings**. Every warning is a `G7`/`G8`/`G9`/`G10` or `U12` check introduced after the pinned 0.8, correctly surfaced as a warn under pinned-version grading. **No blocker to Gold at its pin.** What is open:

- **Standard-pin currency** (0.8 vs current 0.12). Re-pinning to a current Standard requires burning down the 81 warns first (G7 docs frontmatter on 6 pages, G8 folder READMEs for 56 folders, G9 docblocks on 14 scripts, G10 Diataxis quadrants + the architecture pair). This is the measured cost of re-adoption, scheduled on the repo's own cadence.
- **Per-component `HISTORY.md` absent** (same Silver+ governance item as the toolkit; resolved by D16).
- One-line polish: the subagent component entry should carry the `agent-targets: ["claude"]` override (it currently over-declares Codex).

### 7.3 pm-skills - below Bronze, the heavy converge

The heaviest sibling: roughly 95 components. **Two P0 listing blockers** keep it below Bronze:

- **No root `library.json`** - "loose components" under Standard Section 5. It cannot pin any Standard version or declare a tier. This is the single highest-leverage fix in the family.
- **An embedded self-listing marketplace** (`.claude-plugin/marketplace.json`) - the Section 12 anti-pattern, live.

Its declared target is **Silver (Convergent)**. To get there in one converge session it must, beyond the two P0s: generate (not hand-author) its native manifests from `library.json` via repo-local tooling; add `version` frontmatter to the 27 non-skill components missing it (5 subagents, 10 commands, 12 workflows); declare `agent-targets` and a `prefix`; convert its chain file to the 3.6 may-invoke form so orphan/phantom analysis is possible; and seed per-component `HISTORY.md`. Blockers to its next tier (Silver): `S1` agent-targets, `S2` prefix, `S3`/`S8` components index + mirror, `S4` chain-contract form, plus the Bronze floor (`U1` library-json above all).

### 7.4 writing-style-catalog - below Bronze, the light converge

One skill, the smallest self-contained converge. **Below Bronze** today because it carries no `library.json` ("loose components"). Three Bronze blockers:

- **No `library.json`** (`U1`).
- **`name`/dir mismatch** - directory `writing-instruction-builder` vs frontmatter `compose-instruction` (`U4`).
- **No component `version`** in the skill frontmatter (Standard 3.7).

Its declared target is **Bronze (Universal)** - honest, since it has no convergent components. Fixing the three blockers takes it from "loose components, below Bronze" to a conformant universal-tier plugin. It optionally drops its embedded marketplace in the same change.

---

## 8. Mapping to the enforcement ramp (D15)

D15 (enforcement = full, tiered ramp) sets the family target: **full CI-enforced conformance across all four repos, delivered as a tiered, warn-first ramp.** The tiers in this reference are the ramp's stages.

### 8.1 The ramp order

1. **Bronze floor blocks first.** It is the cheapest gate and every repo can pass it fast. The two below-Bronze repos (pm-skills, writing-style-catalog) earn a `library.json` and clear their `U1`/`U4` blockers; the two Gold repos already clear it. Once the floor is green family-wide, Bronze flips to gate-blocking.
2. **Silver next.** Convergent emission, manifest mirror, chain contracts, and the per-component `HISTORY.md` governance (D16) become blocking, in that order of cheapness.
3. **Gold last.** Self-hosting CI, generated-artifact drift, eval/regression coverage, docs taxonomy.

### 8.2 Warn-then-error per check

Each newly enforced check ships as a `warn` for one Standard minor, then flips to `error` in the next (Standard 7.7 burndown). This is the same mechanism `U13` (skill-registration) uses at v0.12 (`warn`) -> 0.13 (`error`), and the same mechanism D16 prescribes for the HISTORY-presence check. A downstream plugin always gets a one-version migration window before a tightening can fail its build, and pinned-version grading (Section 6) means a repo on an older pin sees post-pin checks as warns until it chooses to re-pin.

### 8.3 CI architecture under the ramp

Per D15 and D14 (runner-consumption = reusable workflow): the **check logic** lives centrally in `standards/checks/` (the relocated 30-check spine); the **CI harness** is a reusable GitHub Actions workflow in `product-on-purpose/.github` that checks out `standards/` at a pinned ref and runs the gate against the calling repo; each plugin repo carries only a **thin trigger** (~3 lines) in its own `.github/workflows/`. The Standard version is a workflow input - each repo passes its `library.json` standard pin, and the workflow grades against exactly that version. So a repo's place on the ramp is governed by two pins it controls: the workflow version pin in its caller, and the Standard version it declares in `library.json`.

### 8.4 Per-repo migration

Each repo's migration plan is its convergence packet (`docs/internal/convergence/`) plus that repo's warn burndown. The packets above already enumerate the blocking requirement ids per repo, which are exactly the `blocked` lists the tier report (Section 6) produces. The ramp is complete when all four repos pass the Bronze floor as `error`, then Silver, then Gold, with each new check having ridden its warn-then-error window.
