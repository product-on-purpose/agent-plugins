# pm-skills - conformance convergence packet

> **Goal:** bring `pm-skills` from "loose components" to an honest **convergent-tier (Silver)** plugin under the family Standard, and clear its two live listing-contract violations: the missing root `library.json` (L3) and the embedded self-listing marketplace (L2). The contract is [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) (clauses L1-L6) and [`agent-skills-toolkit/STANDARD.md`](../../../../agent-skills-toolkit/STANDARD.md) **v0.11** (the repo pins nothing, so the audit graded against current). Audited 2026-06-10 against `origin/main` @ `ac0acfb` via a read-only worktree (the local checkout was dirty with in-flight v2.26.0 planning docs; the worktree was removed after the audit). The marketplace pin `f7f3622` (registry entry v2.25.2) is the parent commit of the audited HEAD and was verified separately for L4.
>
> This is the heavy sibling the [program roadmap](../program-roadmap.md) warns about: roughly ninety-five components to enumerate, native manifests the Standard says must be **generated**, and a live Section 12 violation. It is a deliberate convergence session in the pm-skills repo, with its own tooling, bundling the manifest work with the marketplace cleanup - not a drive-by PR.

## 1. Kickoff prompt (copy-paste, or point a session at this file and say "go")

```
You are working in the pm-skills repository to bring it to honest convergent-tier (Silver)
conformance with the Product on Purpose family Standard and to clear its two listing-contract
violations: it has NO root library.json (so it is "loose components" under STANDARD.md
Section 5) and it ships an embedded self-listing marketplace (.claude-plugin/marketplace.json,
the Section 12 anti-pattern).

Read first, in order:
1. The contract: agent-skills-toolkit/STANDARD.md Sections 5 + 5.1 (manifest + field schema),
   2.2 + 2.5 (Convergent/Silver requirements), 3.6 (chain contracts), 3.7 (component version),
   7.3 (per-component HISTORY), 12 (the embedded-marketplace anti-pattern). If you cannot read
   the askit path, ask me to add E:\Projects\product-on-purpose\agent-skills-toolkit as a
   working directory.
2. This packet (scorecard, decisions, checklist):
   E:\Projects\product-on-purpose\agent-plugins\docs\internal\convergence\pm-skills-conformance.md

Then:
- Confirm you are on a clean main (or a fresh branch off it). The repo was mid-v2.26.0
  planning at audit time; do not mix that work into this change.
- Resolve the maintainer decisions (D1-D7 in section 5). D3 (agent-targets), D4 (prefix),
  D5 (chain contract), and D6 (embedded-marketplace removal) are genuine forks; if the
  maintainer has not answered them, STOP and ask.
- DO NOT hand-author the component index. Build the enumeration/generation tooling first
  (D1): a repo-local Node .mjs that reads component frontmatter from disk, emits the
  library.json components index, regenerates .claude-plugin/plugin.json and
  .codex-plugin/plugin.json from library.json, and drift-checks all three (wired into
  scripts/validation-manifest.yaml so the parity referee carries it).
- Add the missing component versions (subagents, commands, workflows) so the manifest has
  truthful inputs; seed per-component HISTORY.md files per D7.
- Remove .claude-plugin/marketplace.json per D6; update the README legacy-marketplace note
  with migration instructions pointing at the external product-on-purpose/agent-plugins
  registry.
- House rule: no em-dashes or en-dashes anywhere (use " - " or restructure). Make changes as
  normal commits/PRs in THIS repo (CHANGELOG entry; ADR or decision-log entry for D4/D6).
  Do NOT edit other repos. Do NOT push or merge without my confirmation.

Stop and ask if: a decision is unanswered, the repo state conflicts with this packet, or a
fix is not obvious.

When the checklist is complete and the manifests validate and regenerate cleanly, summarize
what changed and prepare the PR.
```

## 2. Current state (2026-06-10, `origin/main` @ `ac0acfb`)

**Components (counted from disk; the convergence session re-enumerates with tooling):**

| Type | Count | Where | Notes |
|---|---|---|---|
| Skills | 65 | `skills/<name>/SKILL.md` | 30 phase + 9 foundation + 11 utility + 15 tool (matches the plugin.json claim). All 65 carry `metadata.version`; all 65 have `references/`. |
| Commands | 10 | `commands/workflow-*.md` | Claude-format workflow launchers. No `version` frontmatter on any. |
| Subagents | 5 | `agents/*.md` | pm-critic, pm-skill-auditor, pm-changelog-curator, pm-release-conductor, pm-workflow-orchestrator. No `version` frontmatter on any. |
| Workflows | 12 | `_workflows/*.md` | Frontmatter carries `title` only; no `version`. |
| Hooks | 2 | `hooks/hooks.json` | PreToolUse guardrails + SessionStart phase router; libs + tests + `hooks/README.md` documenting contracts. |
| Chain contract | 1 | `agents/_chain-permitted.yaml` | At the Standard's pinned path, but narrower semantics than 3.6 (see D5). |
| MCP | 0 | - | No `.mcp.json`. |

Total: ~95 component entries. Per-component `HISTORY.md`: exactly 1 of ~95 (`skills/foundation-prioritized-action-plan/HISTORY.md`).

**Manifests:**

- `.claude-plugin/plugin.json` - hand-authored (no generator exists in `scripts/`); `name: pm-skills`, `version: 2.25.2`, license Apache-2.0, homepage/repository/author/keywords present. Its `description` is a ~5,000-character multi-release changelog narrative.
- `.codex-plugin/plugin.json` - hand-authored Codex native manifest, `version: 2.25.2`, `skills: ./skills/`, rich `interface` block.
- `.claude-plugin/marketplace.json` - an **embedded self-listing marketplace** (`name: pm-skills-marketplace`, listing pm-skills @ 2.25.2 with `ref: main`). The Section 12 anti-pattern, live. Retained deliberately at v2.21.0 so legacy installs keep working (README: "Already installed via the old pm-skills-marketplace? It keeps working - no action needed"); the external registry is already the recommended install path (README's primary instructions point at `product-on-purpose/agent-plugins`).
- **No `library.json`** anywhere (`git ls-files` confirms none tracked).

**Present and good:** root `AGENTS.md`, `CHANGELOG.md` (Keep a Changelog), Apache-2.0 LICENSE, `CLAUDE.md`, `QUICKSTART.md`, SECURITY/PRIVACY/CODE_OF_CONDUCT, a large portable validator suite (`scripts/`, bash + PowerShell + Node, unified behind `scripts/validation-manifest.yaml` with an enforcing CI parity referee), eight CI workflows including plugin-packaging validation (`validate-plugin.yml`) and a two-OS validation matrix (`validation.yml`), and a fully conformant Pattern S Astro site (see L5 below).

**No Standard self-hosting gate:** the extensive CI validates pm-skills' own house rules (counts, cross-references, links, frontmatter YAML, samples), not the askit Standard checks. Adding `library.json` is additive; correctness is on the convergence tooling to get right.

## 3. Scorecard

### 3.1 Listing contract (L1-L6)

| Clause | Verdict | Evidence |
|---|---|---|
| L1 - valid native plugin at root | **PASS** | `.claude-plugin/plugin.json` with all required + recommended fields; skill frontmatter agentskills.io-shaped (metadata-nested since v2.17.0; CI `lint-skills-frontmatter`); install validated in CI (`.github/workflows/validate-plugin.yml`: manifest-shape check + `validate-plugin-install`). |
| L2 - independently valid; no self-listing marketplace | **FAIL** | Standalone install is fine, but `.claude-plugin/marketplace.json` self-lists pm-skills - the live violation CONTRIBUTING.md Section 8 tracks. Deliberate transitional retention since v2.21.0 (back-compat for legacy installs), now slated for removal here (D6). See also Contract corrections on the "MUST NOT reference" wording. |
| L3 - binds the Standard via `library.json` | **FAIL (P0)** | No `library.json` tracked or on disk. "Loose components" under Standard Section 5; cannot pin any Standard version; not eligible for a new listing. Audited against current Standard v0.11. |
| L4 - release hygiene | **PASS** | Pinned sha `f7f3622` is exactly tag `v2.25.2` (`git rev-list -n1 v2.25.2` == the pin). Versions agree end to end: registry entry 2.25.2 == tag == `.claude-plugin/plugin.json` == `.codex-plugin/plugin.json` == CHANGELOG `[2.25.2] - 2026-06-10` (present at the pinned sha). `library.json` leg vacuous (absent, the L3 gap). CI green at the pin (8/8 check runs success). No root `RELEASE-NOTES.md`, but GitHub Releases + README release-note sections serve the SHOULD. |
| L5 - family site standard | **PASS** | Pattern S shipped (PR #154), guards landed (PR #159), full 14.7-14.9 conformance (PR #160). `site/` app, stock `docsLoader()`, gitignored-and-rebuilt generated content (`scripts/gen-site.mjs`); base single-sourced in `scripts/site-base.mjs` (14.7); `.nvmrc` 24 + `engines.node >=22.12.0` + `node-version-file` in all workflows (14.8); `site/public/favicon.svg` + `robots.txt` (14.9); the full four-validator 14.11 set (`check-rendered-links.mjs`, `check-route-parity.mjs` + `scripts/route-manifest.txt`, `verify-edit-links.mjs`, `remark-resolve-links.mjs`) - pm-skills is the family donor. One wiring note: the guards run in `validation.yml` (push to main + PR, both OS legs) in parallel with `deploy-pages.yml` rather than gating the deploy job (P2-3). |
| L6 - repo scaffolding | **RECORDED** (evidence only, no judgment) | See 3.3. |

### 3.2 Convergent-tier (Silver) scorecard - the declared target (roadmap decision #4)

Bronze layer (included in Silver):

| Requirement | Status | Note |
|---|---|---|
| Valid skill frontmatter | PASS | agentskills.io metadata-nested shape; CI-enforced (`lint-skills-frontmatter`, `check-frontmatter-yaml`). |
| Skill `name` equals directory | PASS | Spot-checked (`deliver-prd` et al.); repo validators police naming. |
| Description meets the 8.1 bar | PASS (skills) | Skill descriptions state what + when (spot-checked). The plugin-level `plugin.json` description is a changelog narrative - regenerated concise by D1 (P2-2). |
| References one level deep | NOT MACHINE-VERIFIED | 65/65 skills carry `references/`; depth not audited here. The convergence session runs the toolkit gate. |
| Root `AGENTS.md` | PASS | Present; CI syncs it (`sync-agents-md.yml`, `validate-agents-md`). |
| Minimal `library.json` | **FAIL** | The P0. |
| Component `version` (3.7, every tier) | **PARTIAL** | Skills 65/65 carry `metadata.version`; subagents 0/5, commands 0/10, workflows 0/12 carry none. |
| `U12` mermaid-valid | NOT MACHINE-VERIFIED | The repo carries mermaid content (`utility-mermaid-diagrams`); run the gate at convergence. |

Silver layer:

| Requirement | Status | Note |
|---|---|---|
| `agent-targets` declared in manifest | **FAIL** | No manifest. Resolve per D3. |
| `prefix` declared (5.1, Convergent+) | **FAIL** | No manifest, and components carry no uniform prefix (skills use phase prefixes like `deliver-`; subagents use `pm-`). Resolve per D4 - do NOT rename 65 skills. |
| Each convergent component emitted per target | **PARTIAL** | Skills reach both targets (`.codex-plugin` points at `skills/`). Commands are Claude-only (`commands/*.md`, no Codex skill counterpart). Subagents are Claude-only, which Standard 3.3 itself sanctions for distributed plugins (not a violation). |
| Chain contracts valid (no orphans/phantoms) | **PARTIAL** | `agents/_chain-permitted.yaml` exists at the Standard's pinned path, but it is an "Agent-in-tools allowlist" (which subagents may hold the Agent tool), not the 3.6 per-component may-invoke map. Dispatch skills that invoke subagents are not covered, so orphan/phantom analysis is not possible as-is. Resolve per D5. |
| Manifest matches disk | **PARTIAL** | Native manifests are hand-authored; counts are CI-checked (`check-count-consistency`) and currently truthful (65/5), but Standard Section 5 requires native manifests be **generated** from `library.json`. |
| Semver | PASS | Strict semver tags v2.x; deterministic release discipline evidenced across CHANGELOG. |
| Two backlogs (7.1, Silver governance) | PARTIAL (SHOULD) | `docs/internal/backlog.md` + `backlog-canonical.md` exist, not the 7.1 `docs/internal/backlog/` two-file split. |
| Per-component `HISTORY.md` (7.3, Silver+ MUST) | **FAIL** | 1 of ~95 components has one. Resolve per D7. |
| `CHANGELOG.md` | PASS | Keep a Changelog, thorough, current. |

### 3.3 L6 scaffolding evidence (E2 input; recorded, not judged)

- **`agents/` contains exactly:** 5 subagent definitions (`pm-*.md`, native Claude registration) + `agents/_chain-permitted.yaml`. **No session logs, no agent knowledge.** The legacy lineage the contract describes was relieved in **v2.17.0**: "the sub-agent definitions moved to the canonical agents/ directory (the coordination directory was renamed to `_agent-context/` to free the name)" (plugin.json version narrative; CHANGELOG v2.17.0).
- **Committed agent context:** `_agent-context/` with `claude/` and `codex/` (each carrying committed `CONTEXT.md` + `DECISIONS.md`; codex also `README.md`, `WORKTREE-PRIMER.md`, a wrap-session template, `_archived/`), a shared `_agent-context/DECISIONS.md`, and `_agent-context/session-log/` (singular naming; 2 committed logs, `YYYY-MM-DD_HH-MM_agent_slug.md` pattern).
- **Gitignore coverage:** `_LOCAL/` fully ignored; also `SESSION-LOG/` (the legacy uppercase form), `_NOTES/`, `_staging/`, `_spike/`, `_pm-skills/`, `.memsearch/`, `_agent-context/*/TODO.md`, `_agent-context/*/PLANNING/` (with negations keeping `CONTEXT.md`/`DECISIONS.md` tracked). Policy documented at `docs/internal/planning-persistence-policy.md`.
- **Decision record:** no `docs/internal/decisions/` MADR directory; decisions live in `_agent-context/DECISIONS.md` plus dated docs under `docs/internal/` (e.g. `marketplace-multi-plugin-migration_2026-05-18.md`, `planning-persistence-policy.md`).

## 4. Gaps, tiered

**P0 - would block a NEW listing (L1-L4 failures):**

1. **No root `library.json`** (L3). Loose components under Standard Section 5; no Standard pin, no declared tier, no component index. The single highest-leverage fix in the family per the program roadmap.
2. **Embedded self-listing marketplace** (`.claude-plugin/marketplace.json`, L2 / Standard Section 12 anti-pattern). Live, tracked in CONTRIBUTING.md Section 8, slated for removal in this convergence (D6).

**P1 - contract/Standard MUSTs, advisory today (the L3-conformance body of work at the declared tier):**

3. **Native manifests hand-authored**, not generated from `library.json` (Standard Section 5 MUST). The fix is the D1 tooling, not hand-syncing a third copy of the same facts.
4. **Component `version` missing on 27 non-skill components** (Standard 3.7 MUST at every tier): 5 subagents, 10 commands, 12 workflows. Blocks a truthful manifest `components` index.
5. **`agent-targets` and `prefix` undeclared** (Standard 5.1 MUSTs at Convergent+), and command emission is Claude-only. Resolve via D3/D4 in the manifest rather than by renaming or mass-porting.
6. **Chain contract not in 3.6 form** - the existing allowlist cannot prove "no orphans, no phantoms" because skill-to-subagent dispatch is not declared (D5).
7. **Per-component `HISTORY.md` missing** (Standard 7.3, REQUIRED at Silver+): 1 of ~95 components carries one (D7).

**P2 - SHOULDs and polish:**

8. Backlogs not in the 7.1 layout (`docs/internal/backlog/` split into new-component vs enhancement files). Cheap rename + split, or defer.
9. `plugin.json` `description` is a ~5,000-character multi-release narrative; the 8.1 bar wants concise what + when. The D1 generator should emit a short description (and the history lives in CHANGELOG where it belongs).
10. 14.11 guards run in `validation.yml` parallel to `deploy-pages.yml` on push to main, so a failing guard does not technically block the deploy job of the same commit. Consider a `needs:`/shared-job wiring so the deploy is gated. (pm-skills is the 14.11 donor; this is wiring polish, not a conformance failure.)
11. No root `RELEASE-NOTES.md` (L4 SHOULD / Standard G5 at Gold). GitHub Releases serve the purpose today; optional to add.
12. No `docs/internal/decisions/` MADR home (Standard 10.4 SHOULD); decision records are scattered across `_agent-context/DECISIONS.md` and dated docs. Worth consolidating when an ADR is next written (D4/D6 are candidates).

## 5. Maintainer decisions (genuine forks; resolve before executing)

- **D1 - How to generate the manifest (the central call).** The roadmap is explicit: ~95 components is "the wrong thing to author blind." Options: **(a) repo-local Node `.mjs` tooling** (recommended) - a `scripts/gen-library-manifest.mjs` (name per house style) that enumerates components from disk + frontmatter, emits/syncs the `library.json` `components` index, regenerates `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` from `library.json`, and ships a `--check` drift mode wired into `scripts/validation-manifest.yaml` so the existing CI parity referee enforces it on both OS legs. This matches the repo's zero-dependency `.mjs` validator house style and the Standard's G4 shape (generated native manifests + drift check). **(b)** Adopt askit's `gen-manifest` outward - cleaner family story, but the toolkit's generator maturity against a 95-component repo is unproven and adds a cross-repo dependency mid-convergence. **Recommended: (a)**, designed schema-compatible so a later swap to the toolkit's generator is a drop-in. `library.json` itself stays authored (top-level fields by hand; the `components` index tool-synced and drift-checked, per Standard 2.6 G4).
- **D2 - Standard pin and tier.** Pin `standard: "0.11"` (current; per 7.7 newer checks surface as warn, never error). Tier: the roadmap (decision #4) already declared **convergent**. The honest-declaration caveat: tooling MUST flag a tier claim above what is met (5.1), so declaring convergent obliges closing the Silver blockers (gaps 4-7) in this same session. Fallback if the session must split: declare `universal` first and raise to `convergent` in the follow-up that closes the Silver set. **Recommended: `convergent`, with the Silver blockers closed in-session.**
- **D3 - `agent-targets` (genuine fork).** The plugin genuinely targets both agents for skills (`.codex-plugin` exists), but commands are Claude-only and subagents are Claude-only by the Standard's own 3.3 carve-out. Options: (a) plugin-level `agent-targets: ["claude", "codex"]` with per-component overrides (`agent-targets: ["claude"]` on commands and subagents, the 5.1 component-entry mechanism); (b) declare `["claude"]` only and treat Codex as best-effort. (a) is truthful to the shipped `.codex-plugin` and keeps the Codex story first-class. **Recommended: (a).**
- **D4 - `prefix` (genuine fork; STOP-AND-FLAG applies).** 5.1 REQUIRES a `prefix` field at Convergent+; 8.2 says components SHOULD carry it in their names. pm-skills' 65 skill names are deliberate phase taxonomy (`discover-`/`define-`/`develop-`/`deliver-`/`measure-`/`iterate-`/`foundation-`/`tool-`/`utility-`), user-facing invocation slugs, and stable identity - renaming them would break every documented invocation for zero user value. Options: (a) declare `prefix: "pm"` (matches the plugin name and the `pm-*` subagents) and explicitly do NOT rename existing components, recording the stance in the manifest/decision log (8.2's per-name carry is a SHOULD, so this is conformant); (b) rename everything (rejected: massive breaking change). **Recommended: (a)**, with a decision-log/ADR entry so future audits cite it instead of flagging drift.
- **D5 - Chain contract form (genuine fork).** `agents/_chain-permitted.yaml` is a security allowlist ("which subagents may hold the Agent tool", master-plan D14/D21), not the 3.6 may-invoke map. Options: (a) extend the existing file in place to the 3.6 schema (per skill/subagent, which components it MAY invoke - covering the five dispatch skills, the orchestrator's skill-running, and the conductor), preserving the allowlist semantics as a section or derivable view; (b) add a second file and keep the allowlist untouched. (a) keeps one contract at the Standard's pinned path. **Recommended: (a)**, with the orphan/phantom check added to the D1 tooling or taken from the toolkit gate.
- **D6 - Embedded marketplace removal (genuine fork; STOP-AND-FLAG: the retention was deliberate).** v2.21.0 deliberately kept `pm-skills-marketplace` working ("no action needed") while making the external registry the recommended home; the 2026-05-18 migration design (`docs/internal/marketplace-multi-plugin-migration_2026-05-18.md`) is the lineage. Removing the file ends the legacy update path for anyone still on the old marketplace. Options: (a) remove now in the convergence PR with a loud CHANGELOG migration note and an updated README legacy note (two-command migration to the external registry); (b) keep a deprecation stub one more release, then remove. The external path has been the recommended home since v2.21.0 (four minor releases ago), and the contract tracks this as a live violation. **Recommended: (a)** - remove now; version-bump magnitude is the maintainer's call (MINOR with a migration note is defensible since the plugin interface is unchanged; MAJOR if honoring the v2.21.0 "keeps working" promise strictly).
- **D7 - HISTORY backfill (genuine fork: backfill now vs defer).** 7.3 requires per-component `HISTORY.md` at Silver+; ~94 are missing. Options: (a) tool-seed them in this session - the D1 enumerator emits a minimal seeded `HISTORY.md` per component (current version + "seeded at convergence; prior history in CHANGELOG"), honest and cheap since the tool already walks every component; (b) defer with a documented warn and backfill incrementally. (b) leaves a declared-Silver plugin failing a Silver MUST on day one. **Recommended: (a).**

## 6. Implementation checklist (the executing session updates this)

- [ ] Confirm clean `main` (or fresh branch); the v2.26.0 planning work stays out of this change.
- [ ] **D1** Build the manifest tooling: enumerate all components from disk + frontmatter (65 skills, 10 commands, 5 subagents, 12 workflows, 2 hooks, 1 chain contract); emit/sync the `library.json` `components` index; generate `.claude-plugin/plugin.json` + `.codex-plugin/plugin.json` from `library.json`; add `--check` drift mode; register it in `scripts/validation-manifest.yaml` (script docs per the repo's `validate-script-docs` convention).
- [ ] Add `version` frontmatter to the 27 components missing it (5 subagents, 10 commands, 12 workflows) - the truthful inputs the index needs. Seed `0.1.0` (or derive from CHANGELOG first-appearance where cheap).
- [ ] **D7** Tool-seed per-component `HISTORY.md` for all components lacking one; the `validate-skill-history` validators already read `metadata.version` and enforce agreement.
- [ ] Author `library.json` top-level fields: `name: pm-skills`, `version` (current release), a concise 8.1-bar `description`, `standard: "0.11"`, `tier: "convergent"` (D2), `agent-targets` (D3), `prefix` (D4), `license`, `repository`, `homepage`; components index tool-synced.
- [ ] Regenerate both native manifests from `library.json`; replace the changelog-narrative `description` with the concise generated one (P2-9); verify the count-consistency validators still pass.
- [ ] **D5** Extend `agents/_chain-permitted.yaml` to the 3.6 may-invoke schema covering dispatch skills, orchestrator, and conductor; add (or run) the orphan/phantom check.
- [ ] **D6** Delete `.claude-plugin/marketplace.json`; update the README legacy-marketplace note (line ~124 and ~470) with migration instructions to `product-on-purpose/agent-plugins`; CHANGELOG migration note; decision-log/ADR entry.
- [ ] **D4** Record the prefix/no-rename stance in the decision log (or a first `docs/internal/decisions/` ADR, also banking P2-12).
- [ ] Run the toolkit gate read-only (outward profile) against the repo; close or document any remaining Bronze/Silver findings (references depth, U12 mermaid, description scores).
- [ ] Optional P2s as scope allows: backlog split to `docs/internal/backlog/` (P2-8), deploy-gating wire-up for the 14.11 guards (P2-10), root `RELEASE-NOTES.md` (P2-11).
- [ ] CHANGELOG entry; version bump per 7.4 (the manifest + marketplace removal scope suggests MINOR; D6 magnitude is the maintainer's call); open the PR; CI green on both OS legs; await maintainer review (do not merge without confirmation).
- [ ] After merge + tag: re-pin in `agent-plugins` per the CONTRIBUTING.md Section 7 checklist (separate registry PR; not this session's job).

## 7. Acceptance criteria (done = all true)

- A root `library.json` exists with `name`, `version`, `description`, `standard: "0.11"`, `tier: "convergent"`, `agent-targets`, `prefix`, and a tool-synced `components` index whose every entry's `name`/`path`/`version`/`status` matches the component on disk.
- Every component (95-ish) carries `version` frontmatter and a co-located `HISTORY.md` whose latest entry equals that version.
- `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` are **generated** from `library.json` by committed tooling with a CI drift check registered in `scripts/validation-manifest.yaml`; a hand-edit to either fails CI.
- `agents/_chain-permitted.yaml` declares the 3.6 may-invoke map; no orphan invocations, no phantom entries.
- No `.claude-plugin/marketplace.json` remains; README install paths reference only the external registry, with a migration note for legacy-marketplace users.
- The toolkit gate (outward profile) reports Silver satisfied, or every remaining finding is documented with a decision reference.
- CHANGELOG entry written; PR prepared and CI green; not merged without maintainer confirmation.

> Outcome: pm-skills moves from "loose components with a live distribution anti-pattern" to a conformant convergent-tier plugin that pins the Standard at 0.11 - closing both Section 8 tracked violations, giving the family's flagship a manifest generated by tooling rather than authored blind, and clearing the path for the enforcement ratchet's re-pin check to go blocking.

## Contract corrections

1. **L2 wording ("MUST NOT reference the marketplace") is broader than its intent.** Read literally, CONTRIBUTING.md Section 3 prohibits the very README install instructions the convergence work standardizes on (`/plugin marketplace add product-on-purpose/agent-plugins` - pm-skills' recommended path since v2.21.0, and the wsl packet's D4 explicitly directs install docs at the external registry). The clause's evident intent is to prohibit embedded listing/association **artifacts** (self-listing marketplaces, registry metadata), not install-instruction mentions of the external registry. Propose rewording L2 to: the plugin repo MUST NOT embed listing metadata or a self-listing marketplace; install documentation MAY point users at the external registry.
2. **The L6 lineage note appears stale for pm-skills.** Section 6 says "One member still carries the legacy layout" (agents/ holding session logs and agent knowledge). At the audited commit, pm-skills - the known legacy case - carries no legacy layout: `agents/` holds only the 5 subagent definitions plus the chain contract, and session logs live under `_agent-context/session-log/` (migrated in v2.17.0). If pm-skills was the member meant, update the note after the parallel audits reconcile; if another member was meant, name it in the tracking.
