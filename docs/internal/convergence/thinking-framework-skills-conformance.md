# thinking-framework-skills - listing-contract conformance packet

> **Goal:** score `thinking-framework-skills` against the listing contract ([`CONTRIBUTING.md`](../../../CONTRIBUTING.md) L1-L6) and the family Standard at the version it pins (`library.json` `standard: "0.8"`, declared tier `advanced`), and queue the residual convergence items. Written 2026-06-10 against `main` @ `d0b4a332ddd9fcfe25e8059910a66e94e6f0acea` (clean local checkout, up to date with `origin/main`; no worktree needed). That commit IS the marketplace pin and sits exactly on release tag `v0.6.0`.
>
> **Net result: effectively clean.** No P0 listing blockers; L1-L5 all PASS, with the gate verifying `Tier: advanced` at 0 errors. The residuals are one Standard-text-vs-gate finding (per-component HISTORY.md), the Standard-pin cadence question (0.8 vs current 0.11, with a measured 81-warn burndown), and small polish. This packet is the L3-currency and L4-hygiene check the [audit plan](audit-plan.md) queued at position 3.

## 1. Kickoff prompt (copy-paste, or point a session at this file and say "go")

```
You are working in the thinking-framework-skills repository to close the residual items
from its conformance audit (the repo passed L1-L5 cleanly at v0.6.0; this is polish and
cadence work, not rescue work).

Read first, in order:
1. This packet (scorecard, decisions, checklist):
   E:\Projects\product-on-purpose\agent-plugins\docs\internal\convergence\thinking-framework-skills-conformance.md
2. agent-skills-toolkit/STANDARD.md (current version header; Sections 2.5, 2.6, 7.3, 7.7, 8.4).

Then:
- Confirm you are on main and it is clean.
- Resolve the three maintainer decisions (D1-D3 in section 5). D1 (when to re-pin the
  Standard from 0.8) and D2 (per-component HISTORY.md) are genuine forks; if the
  maintainer has not answered them, STOP and ask. D3 needs no repo change now.
- Apply the P2 fixes from the checklist (section 6) that survive the decisions.
- House rule: no em-dashes or en-dashes anywhere (use " - " or restructure). Make changes
  as normal commits/PRs in THIS repo (CHANGELOG entry; the gate `node scripts/check.mjs`
  must stay at 0 errors). Do NOT edit other repos. Do NOT push or merge without my
  confirmation.

Stop and ask if: a decision is unanswered, the repo state conflicts with this packet, or
a fix is not obvious.
```

## 2. Current state (2026-06-10, `main` @ `d0b4a33`)

- **Components (per `library.json`):** 51 skills under `skills/` (47 registry-graded frameworks + 4 meta-skills), 1 subagent (`agents/think-research-framework.md`), 1 command (`commands/think-research-framework.md`), 8 workflow recipes under `_workflows/`, plus a chain contract at `agents/_chain-permitted.yaml`. Prefix `think-`, `agent-targets: ["claude", "codex"]`.
- **Manifests:** authored `library.json` (`version: 0.6.0`, `standard: "0.8"`, `tier: "advanced"`) is the source of truth; `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `manifest.generated.json`, and `INDEX.md` are generated from it by the toolkit's `gen-manifest` / `gen-index` (documented in `docs/internal/AUTHORING.md`) and drift-checked (toolkit `U8` plus the repo's own gate layers). Both native manifests carry `version: 0.6.0`.
- **Self-hosted gate:** `scripts/check.mjs` runs five layers - the toolkit's structural validators (toolkit pinned in CI at ref `2f480d1`), the static eval-case validator (`scripts/eval-cases.mjs`, 51 skills), the registry conformance check (`scripts/check-registry.mjs`, 105 entries / 47 shipped), the engine-copy drift check (`gen-engine.mjs --check`), and the `AGENTS.md` table drift check (`gen-agents.mjs --check`).
- **CI:** `.github/workflows/ci.yml` has four jobs (`check`, `recommendable-drift`, `site-build` with the 14.11 guards, `guard-tests`); `.github/workflows/deploy-pages.yml` builds, re-runs both 14.11 guards on the deploy build, and publishes via the Pages artifact flow. **CI is green at the pinned sha**: runs 27283694029 (Conformance gate) and 27283692334 (Deploy docs site), both `completed / success` on the `d0b4a33` push.
- **Gate re-run for this audit** (local, read-only, current toolkit honoring the 0.8 pin per Standard 7.7): `Tier: advanced`, **0 errors, 81 warnings** - every warning is a `G7`/`G8`/`G9`/`G10` check introduced at Standard v0.10, after the pinned 0.8, so each surfaces as a warn, never a gate-failing error. Breakdown: G7 docs-frontmatter x6 (the `docs/*.md` pages), G8 folder-readme x56 (51 skill dirs + `scripts/`, `scripts/lib/`, `agents/`, `templates/`, `.github/workflows/`), G9 source-docblock x14 (the `scripts/*.mjs` files), G10 docs-presence x5 (empty Diataxis quadrants + the architecture pair).
- **Release machinery:** tags `v0.1.0` through `v0.6.0`, GitHub Releases published (v0.6.0 is Latest, 2026-06-10), Keep-a-Changelog `CHANGELOG.md` + curated `RELEASE-NOTES.md` (both carry 0.6.0), and a written `docs/internal/release-process.md` whose step 8 is the marketplace re-pin.
- **Docs site:** Astro + Starlight under `site/` (Pattern S), generated from `library.json` + the registry by `scripts/gen-site.mjs`; generated content gitignored and rebuilt each build, with the one sanctioned committed-generated exception (`recommendable.{json,md}`, `--check` in CI).
- **No ADR directory** (`docs/internal/decisions/` does not exist); decisions live in release plans, specs, and `AUTHORING.md`. Checked per the stop-and-flag rule before judging any named value; no identity values are flagged in this packet.
- **Skill anatomy** (spot-checked `think-premortem`): spec-conformant frontmatter (top-level `name`/`description`/`license`; proprietary keys nested under `metadata:` including `version: 0.1.0` and `standard: "0.8"`), plus `eval/cases.md`, `evidence/dossier.md`, `references/`, and a rich `skill.meta.yml` sidecar. No component anywhere carries a `HISTORY.md` (confirmed repo-wide).

## 3. Scorecard

### 3.1 Listing contract (L1-L6)

| Clause | Verdict | Evidence |
|---|---|---|
| L1 - valid native plugin at root | **PASS** | `.claude-plugin/plugin.json` with all required fields (`name: thinking-framework-skills`, `version: 0.6.0`, `description`, `license: Apache-2.0`) and all recommended fields (`homepage`, `repository`, `author`, `keywords`). Skill frontmatter follows agentskills.io (proprietary fields under `metadata:`). Registry entry carries `strict: true`. Install-cleanliness is evidenced by the live listing + strict validation, not re-tested here. |
| L2 - independently valid, one-way pointing | **PASS** | Installs standalone (plugin at repo root, no marketplace dependency). No embedded self-listing marketplace in either format: no `marketplace.json` tracked anywhere (Claude `.claude-plugin/` holds only `plugin.json`; no Codex `.agents/plugins/marketplace.json`). The README (`README.md:76`), `docs/getting-started.md:14`, and `docs/internal/release-process.md` step 8 do name the external marketplace in install/release instructions - correct practice, but a literal reading of L2's "MUST NOT reference the marketplace" forbids it; see Contract corrections. |
| L3 - Standard bound by version, tier >= Bronze | **PASS** | Root `library.json` pins `standard: "0.8"` and declares `tier: "advanced"`. Conformance at the pin is demonstrated exactly as L3 defines it: the self-hosted gate passes at the pinned commit (CI run 27283694029 green) and a fresh read-only run for this audit reports `Tier: advanced`, 0 errors, 81 warnings - all from checks introduced after 0.8, correctly surfaced as warns per Standard 7.7 pinned-version grading. Pin currency: 0.8 vs current 0.11 (three minors behind) - contractually legitimate (members re-adopt on their own cadence, GOVERNANCE.md Section 5); the cadence call is D1. |
| L4 - release hygiene | **PASS** | Pinned sha `d0b4a33` sits exactly on tag `v0.6.0` (`git tag --points-at` confirms). Versions agree end to end: registry entry `0.6.0` == tag `v0.6.0` == `library.json` `0.6.0` == `.claude-plugin/plugin.json` `0.6.0` == `.codex-plugin/plugin.json` `0.6.0` == `CHANGELOG.md` `[0.6.0] - 2026-06-10` == `RELEASE-NOTES.md` `## v0.6.0`. GitHub Release published. Registry side held its own bar too: `metadata.version` 1.17.0 + agent-plugins CHANGELOG entry (re-pin PR #22). |
| L5 - family site standard | **PASS** | Pattern S with the 14.11 guards; clause-by-clause detail in 3.2 below. |
| L6 - repo scaffolding | **EVIDENCE RECORDED** | See 3.3; recorded without judgment per the audit plan (E2 input). |

### 3.2 L5 detail (SITE-STANDARD clauses 14.1-14.11)

| Clause | Verdict | Evidence |
|---|---|---|
| 14.1 Pattern S | PASS | App in `site/`; content in `site/src/content/docs/` via stock `docsLoader()` with no arguments (`site/src/content.config.ts`); repo-root `docs/` never built; `gen-site.mjs` reads `../library.json` + skills and writes into `site/src/content/docs/`. |
| 14.2 Astro + Starlight | PASS | `astro.config.mjs`: `site` set, `astro-mermaid` registered before `starlight`. |
| 14.3 / 14.4 generate + drift guard | PASS | Reference pages generated from `library.json` + the registry (zero-dependency Node `gen-site.mjs`); generated content gitignored and rebuilt; the one committed-generated artifact (`recommendable.{json,md}`) runs `gen-recommendable.mjs --check` in CI - the SITE-STANDARD names this repo as the sanctioned exception's reference. |
| 14.5 no committed build output | PASS | No `dist/`, `.astro/`, or `sitemap.xml` tracked. |
| 14.6 Pages artifact flow | PASS | `deploy-pages.yml`: build job then `upload-pages-artifact@v5` + `deploy-pages@v5` gated to `environment: github-pages`; PR-time non-deploying `site-build` job runs the same recipe. |
| 14.7 base single source | PASS | The base literal lives only in `scripts/site-base.mjs`, imported by both `astro.config.mjs` and the link guard; the advisor redirect derives its destination from the same `BASE`. |
| 14.8 versions + Node | PASS | `.nvmrc` = `24`; `site/package.json` `engines.node: ">=22.12.0"`; every CI job uses `node-version-file: '.nvmrc'`; lockfile + `npm ci`. (The 2026-06-02 audit's "align check job to .nvmrc" P2 is closed.) |
| 14.9 search + SEO | PASS | Starlight Pagefind; `site` set (sitemap); `site/public/robots.txt` and `site/public/favicon.svg` shipped. |
| 14.10 no config sidecars | PASS | No `*.mjs.md` / `*.json.md` sidecars tracked (the seven flagged on 2026-06-02 are gone; generators self-document in file headers per `AUTHORING.md`). |
| 14.11 link/route guards | PASS | Local 2-guard port: `scripts/check-rendered-links.mjs` (STRICT_ANCHORS=1) + `scripts/check-route-parity.mjs` against the committed `scripts/route-manifest.txt`, run in BOTH the PR `site-build` job and the deploy build; guard robustness proven by `tests/check-rendered-links.test.mjs` (the `guard-tests` job). Generated-page Edit links are emitted correctly at generation time (`gen-site.mjs`: per-skill pages set `editUrl` to the real `SKILL.md`, aggregations set `editUrl: false`), so the missing `verify-edit-links` port is enforced by construction rather than by guard (P2-3). |

### 3.3 L6 scaffolding evidence (recorded, not judged - E2 input)

- **Committed agent context: none.** `_agent-context/` exists on disk but is **gitignored** (`.gitignore` comment: "Agent session context and logs (local for now)"). This diverges from the family expectation that `_agent-context/` is committed; the "(local for now)" comment reads as a deliberate go-public-era posture, not an accident.
- **Session logs:** locally under `_agent-context/session-log/` - **singular** naming, matching most members - with 12 wrap-session logs named `YYYY-MM-DD_HH-MM_claude_<slug>.md`, plus one loose file at the `_agent-context/` root (`2026-05-28_fork-reconciliation.md`).
- **Local scratch:** `_local/` (lowercase) is fully gitignored (`audit/`, `initial-discovery/`, `insights/`). The repo also gitignores `.claude/`, `.memsearch/`, `.playwright-mcp/`, and `.agent-skills-toolkit/` (the CI clone target for the toolkit validators).
- **`agents/` namespace:** holds exactly the intended L6 contents - the native subagent definition `agents/think-research-framework.md` and the chain contract `agents/_chain-permitted.yaml`. No session logs, no agent knowledge. This is the clean post-lineage layout.

### 3.4 Declared-tier requirements (advanced/Gold at the pinned Standard 0.8)

At Standard 0.8 the Gold set is G1-G6 plus tier inclusion (G7-G10 and U12 arrived at v0.10; U10 was retired at v0.11).

| Requirement | Verdict | Evidence |
|---|---|---|
| Bronze: frontmatter valid; name=dir; description bar; references one level; root `AGENTS.md`; minimal `library.json`; component `version` | PASS | Gate U-checks: 0 errors across 51 skills; `AGENTS.md` present with generated, drift-checked tables; every `library.json` component entry carries `version`/`tier`/`status` and matches frontmatter (spot-checked). |
| Silver: `agent-targets` + `prefix` declared; per-target emission; chain contracts valid; manifest matches disk; semver | PASS | `library.json` declares both; Codex target emitted (`.codex-plugin/plugin.json` + `skills: "./skills/"`); Claude command + subagent present; `agents/_chain-permitted.yaml` covers the `think-research-framework` chain; gate S-checks 0 errors. |
| Silver governance: per-component `HISTORY.md` (Standard 7.3, MUST at Silver+) | **FAIL (text level, ungated)** | Zero `HISTORY.md` files exist repo-wide. The toolkit gate has no check for 7.3, so the gate passes and L3 is contractually met; the Standard's text at the pinned 0.8 is nonetheless unmet. See P1-1 / D2. |
| G1 hooks documented | PASS (vacuous) | The plugin ships no hooks. |
| G2 self-hosting CI that passes | PASS | The five-layer `scripts/check.mjs` in CI (`check` job), green at the pin; CI contains no validation logic of its own (4.4 parity). |
| G3 eval/regression coverage (chains) | PASS | Every shipped skill has `eval/cases.md` enforced by the gate's eval-cases layer; the registry layer enforces eval-coupling and chain referential integrity; `guard-tests` covers the link guard. No hooks to cover. |
| G4 generated INDEX + manifests, drift-checked | PASS | `INDEX.md`, both native manifests, and `manifest.generated.json` generated from authored `library.json` (toolkit `gen-manifest`/`gen-index`); drift surfaced by toolkit `U8` and regenerated at release time per `release-process.md`. |
| G5 RELEASE-NOTES distinct from CHANGELOG | PASS | Both exist and are kept distinct. |
| G6 deprecation policy | PASS | `status` handling present (`library.json` entries all `active`; the registry models folded/rejected lifecycles); gate's tier computation reports `advanced`. |
| Post-0.8 checks (U12, G7-G10) | WARN-ONLY | 81 warns; the measured burndown for D1's re-pin. |

## 4. Gaps

**P0 (would block a new listing - L1-L4 failures): none.**

**P1 (contract/Standard MUSTs that are advisory or ungated today):**

1. **Per-component `HISTORY.md` absent (Standard 7.3).** At the pinned 0.8, 7.3 already required a co-located `HISTORY.md` on every component at Silver and above; the repo declares advanced and has none (51 skills, 1 subagent, 1 command, 8 workflows). Invisible to the gate because the toolkit ships no 7.3 check - a genuine Standard-text-vs-gate-implementation gap this audit surfaces as family evidence. Resolution is D2, deliberately not a unilateral 61-file mechanical add.

**P2 (SHOULDs + polish):**

1. **Standard pin currency (0.8 -> 0.11).** Three minors behind. The exact burndown to re-pin clean is the 81 warns: Section 8.4 frontmatter on the 6 `docs/*.md` pages (G7); folder `README.md` inventories for 56 folders (G8); four-field docblocks on 14 `scripts/*.mjs` files (G9); non-empty Diataxis quadrants plus the architecture overview/detailed pair (G10). A re-pin also sweeps `metadata.standard: "0.8"` in all 51 skill frontmatters and the spec templates that stamp it. Owned by D1.
2. **Subagent component entry lacks the `agent-targets: ["claude"]` override.** Standard 3.3: plugin-distributed subagents are Claude-only (Codex plugins cannot ship subagents), so the entry currently inherits the plugin default `["claude", "codex"]` and over-declares Codex support. One-line fix in `library.json` + regenerate manifests.
3. **(Optional) port the `verify-edit-links` guard.** `gen-site.mjs` already emits correct `editUrl` values by construction; the guard would keep that true mechanically when the generator changes. Low value while the generator is the only writer; reasonable to defer to the shared CI workflow migration.

## 5. Maintainer decisions (genuine forks only)

- **D1 - When to re-pin the Standard (0.8 -> 0.11).** Staying at 0.8 is contractually legitimate and zero-cost (new checks surface as warns forever), but the pin grows stale and the 81-warn backlog compounds as the Standard advances. Re-pinning requires the full P2-1 burndown first (sizeable: it is mostly documentation work, dominated by 56 folder READMEs). **Recommended:** treat the burndown as its own scoped release arc (or a phase inside the next non-catalog release), re-pin `standard: "0.11"` in the release that completes it, and do not block catalog releases on it. Note that 0.11 also retired U10 (no-dashes), so re-pinning costs nothing on that axis.
- **D2 - Per-component `HISTORY.md` (P1-1).** Two honest paths: (a) adopt now - add `HISTORY.md` to all 61 components, almost all a single `0.1.0` line, satisfying 7.3 at the pin; (b) surface first - feed this finding to the family (the toolkit has no 7.3 check, and a 61-file ceremony for components that have never individually changed is exactly the kind of evidence the audit program exists to gather before clauses harden), and adopt once the toolkit ships the check warn-first per 7.7. **Recommended: (b)**, with the incremental discipline that any component whose `version` bumps from here on gains its `HISTORY.md` at that moment, and new components ship with one.
- **D3 - `_agent-context/` gitignored vs committed (L6).** This repo keeps all agent context local ("local for now"); most members commit `_agent-context/`. This is E2's question to ratify family-wide, not this repo's to answer unilaterally. **Recommended: no repo change now**; the evidence is recorded in 3.3 and the maintainer states the intent (commit-later vs local-by-design) when E2 convenes.

## 6. Implementation checklist (the executing session updates this)

- [ ] Confirm `main` is clean and the gate is at 0 errors before starting.
- [ ] **P2-2** Add `"agent-targets": ["claude"]` to the subagent entry in `library.json`; regenerate the manifests (`gen-manifest --write --target=all`, `gen-index`); gate stays at 0 errors.
- [ ] **D2** Record the maintainer's HISTORY.md path; if (b), note the incremental rule in `docs/internal/AUTHORING.md` and raise the toolkit-check gap to the family (askit backlog).
- [ ] **D1 (if re-pin chosen, separate arc)** Burn down the 81 warns: G7 frontmatter on the 6 `docs/*.md` pages; G8 folder READMEs (56 folders; the toolkit's folder-readme scaffolder helps); G9 docblocks on the 14 scripts; G10 Diataxis quadrants + the architecture pair. Then bump `library.json` `standard` to `"0.11"`, sweep `metadata.standard` in the 51 skill frontmatters + templates, and confirm the gate reports 0 errors AND 0 warnings.
- [ ] **(Optional, P2-3)** Port `verify-edit-links` when convenient or when the shared CI workflow lands.
- [ ] CHANGELOG entries for whatever ships; PR; CI green; no merge without maintainer confirmation.

## 7. Acceptance criteria (done = all true)

- The subagent component entry declares `agent-targets: ["claude"]` and the regenerated manifests are committed with no drift (gate 0 errors).
- D2 is decided and recorded (either 61 `HISTORY.md` files exist, or the incremental rule is documented and the toolkit gap is filed upstream).
- D1 is decided and scheduled; if executed, `library.json` pins `standard: "0.11"`, the skill-frontmatter `standard` values match, and the gate reports 0 errors and 0 warnings.
- CI green at the resulting commit; nothing merged without maintainer confirmation.
- L4 invariants undisturbed: any release out of this work follows `docs/internal/release-process.md` (tag, version agreement everywhere, CHANGELOG + RELEASE-NOTES, marketplace re-pin PR).

> Outcome: thinking-framework-skills was already the family's cleanest L1-L5 pass at a fresh pin; this packet leaves only the Standard-cadence decision, one family-level Standard-vs-gate finding, and one-line polish. It is the counter-evidence the ratchet wants: the contract is satisfiable in full by a member that grew up inside it.

## Contract corrections (proposed CONTRIBUTING.md amendments from this audit)

1. **L2 wording is over-broad.** "The plugin repo MUST NOT reference the marketplace" read literally prohibits this repo's install instructions (`README.md:76` and `docs/getting-started.md`: `/plugin marketplace add product-on-purpose/agent-plugins`) and its release-process re-pin step (`docs/internal/release-process.md` step 8) - all of which are correct, contract-serving practice that the writing-style-catalog packet itself recommends ("point install steps at the external registry"). Propose scoping L2 to **machine-readable listing association**: no embedded self-listing marketplace file in any agent's format, and no manifest field pointing back at the marketplace; human-facing install documentation and maintainer release-process references to the marketplace are explicitly permitted.
2. **L4's version-agreement list omits the Codex manifest.** Section 5 enumerates "registry entry == release tag == library.json == .claude-plugin/plugin.json"; a member that emits `.codex-plugin/plugin.json` (this repo does, and it carries a version) should have it covered by the same MUST. Propose "== every native plugin manifest the repo emits". (This repo agrees everywhere regardless.)
