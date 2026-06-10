# agent-skills-toolkit - listing-contract conformance packet

> **Goal:** score the family's Gold self-proving reference against the listing contract ([`CONTRIBUTING.md`](../../../CONTRIBUTING.md) L1-L6) and the Standard at its declared tier (`advanced`, pinned `standard: "0.11"` in its own `library.json`), and queue the small convergence work the audit found. Written 2026-06-10. Audited at `origin/main` @ `1fd44b703771327da394429496e7309c53560f51` via a **read-only worktree** (`git worktree add` of `origin/main`; the local checkout was 9 commits ahead of origin with untracked files, so it was not audited directly; the worktree was removed after the audit). The registry pin `6bd2daaf7f0f070a120957a245eaa3cea480c91e` (tag `v1.5.0`) is one docs-only commit behind the audited HEAD (the delta is `docs/internal/STATUS.md` only), so every finding holds at both commits.
>
> Headline: **no listing blockers.** L1-L4 all pass; the gate self-grades Advanced with zero findings and CI is green at the pinned sha. The real findings are one written-Standard governance requirement the gate does not enforce (per-component `HISTORY.md`), two small L5 site residuals, and two places where the audit proved the CONTRACT wrong rather than the repo (see Contract corrections).

## 1. Kickoff prompt (copy-paste for the future convergence session, or point a session at this file and say "go")

```
You are working in the agent-skills-toolkit repository to close the convergence gaps
recorded in its conformance packet. The repo is the family's Gold self-proving reference;
it has NO listing blockers, so this is polish plus one genuine governance decision.

Read first, in order:
1. The packet (scorecard, decisions, checklist):
   E:\Projects\product-on-purpose\agent-plugins\docs\internal\convergence\agent-skills-toolkit-conformance.md
2. The Standard sections the decisions touch: STANDARD.md 2.5 (tier table), 7.3 (per-component
   history), 5.1 (components index), and agent-plugins/standards/domains/astro-sites/SITE-STANDARD.md
   clauses 14.7 and 14.11.

Then:
- Confirm you are on main and it is clean.
- Resolve the three maintainer decisions (D1-D3 in section 5). D1 (per-component HISTORY
  policy) is a genuine fork that may require a Standard amendment through the GOVERNANCE.md
  serialized process; if the maintainer has not answered it, STOP and ask.
- Apply the checklist (section 6): deploy-build 14.11 guards, the 14.7 base single-source,
  the hook components-index entry (per D2), and the D1 outcome.
- House rule: no em-dashes or en-dashes anywhere (use " - " or restructure). Make changes as
  normal commits/PRs in THIS repo (ADR if D1 amends the Standard; CHANGELOG entry). Do NOT
  edit other repos except a separate agent-plugins PR if a contract correction is approved.
  Do NOT push or merge without my confirmation.

Stop and ask if: a decision is unanswered, the repo state conflicts with this packet, or a
fix is not obvious.
```

## 2. Current state (2026-06-10, `origin/main` @ `1fd44b7`)

- **Components:** 23 skills (`skills/askit-*/`), 7 subagents (`agents/askit-*.md`), 2 commands (`commands/`), 1 hook (`hooks/hooks.json` + `hooks/no-dashes.mjs`, documented in `hooks/README.md`), a chain contract (`agents/_chain-permitted.yaml`), 6 eval sets (`evals/*.eval.json`, covering chain edges and the hook).
- **Manifests:** authored `library.json` (name `agent-skills-toolkit`, version `1.5.0`, `standard: "0.11"`, `tier: "advanced"`, `prefix: "askit-"`, `agent-targets: ["claude","codex"]`, full components index for skills/subagents/commands); generated `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` (both version `1.5.0`, emitted by `scripts/generators/gen-manifest.mjs`, drift-checked by `scripts/checks/manifest-drift.mjs` U8); generated `manifest.generated.json` and `INDEX.md`.
- **Gate (run in the audit worktree):** `node scripts/check.mjs` exits 0 with `Tier: Advanced (no blockers detected), 0 error(s), 0 warning(s)`; `node scripts/evaluate.mjs --json` reports `tier: advanced`, `satisfies: [universal, convergent, advanced]`, zero findings, profile `askit-library`; `npm test` passes 358/358.
- **CI at the pinned sha `6bd2daa`:** all three workflows succeeded (`CI`, `Release`, `Deploy docs site to GitHub Pages`) per `gh run list --commit`. `ci.yml` shells out only to the portable scripts (Standard 4.4); `release.yml` re-runs the gate and enforces tag == every version-bearing manifest.
- **Release chain:** annotated tag `v1.5.0` dereferences to exactly `6bd2daa`; versions agree across registry entry, tag, `library.json`, both native plugin.json files, `package.json`, `CHANGELOG.md` (`[1.5.0] - 2026-06-09`), and `RELEASE-NOTES.md` (`1.5.0`).
- **Site:** Astro + Starlight under `site/` (Pattern S; `gen-docs-site.mjs` writes a gitignored generated tree; `scripts/check-generated-untracked.mjs` enforces it), favicon + robots.txt shipped, `.nvmrc` 24 read via `node-version-file`, two local 14.11 guards in `site/scripts/` per ADR 0026.
- **Known-going-in items verified:** the repo hosts `STANDARD.md` transitionally (agent-plugins `standards/decisions/0001` sequenced the relocation) and ships **no** embedded self-listing marketplace in either agent's format, so this is NOT an L2 violation.

## 3. Scorecard

### 3.1 Listing contract L1-L6

| Clause | Verdict | Evidence |
|---|---|---|
| L1 valid native plugin at root | **PASS** | `.claude-plugin/plugin.json` with `name` (kebab-case, matches repo), `version` 1.5.0, `description`, `license` Apache-2.0, plus `homepage`/`repository`/`author`/`keywords`. Skills validate against the agentskills.io surface (gate U3/U4/U5/U6 green over all 23). Registry entry is `strict: true` and the registry validate check is green. Note: two skills (`skills/askit-build-skill/SKILL.md`, `skills/askit-evaluate/SKILL.md`) carry a top-level `chain:` key - this is the Standard's own chaining declaration (sec 3.6/3.8, read by the S4 check `scripts/checks/chain-contract.mjs:23`), not drift; it collides with L1's restated frontmatter bullet, see Contract correction C2. |
| L2 independently valid; one-way; no self-listing marketplace | **PASS** | `.claude-plugin/` holds only `plugin.json`; no `.claude-plugin/marketplace.json`, no `.agents/plugins/marketplace.json`, no marketplace artifact anywhere in the tree. The plugin runs standalone (its gate, tests, and skills need only the repo plus Node). Prose install instructions in `README.md:68-71` and the site (`site/src/content/docs/getting-started.md:14`, `index.mdx:24`) do reference `product-on-purpose/agent-plugins`; the repo's own launch spec required exactly that (`docs/internal/release-plans/plan_v1.0.0/marketplace-launch/SPEC.md` R-DOCS-1) while asserting the one-way rule held (R-MKT-6) - see Contract correction C1. |
| L3 Standard bound by version, tier >= Bronze | **PASS** | Root `library.json` pins `standard: "0.11"` and declares `tier: "advanced"`. Conformance at the pin is demonstrated by the self-hosted checks passing at the audited commit (gate Advanced 0/0, 358 tests) and CI green at the pinned sha. |
| L4 release hygiene | **PASS** | Pinned sha `6bd2daa` is the exact commit of annotated tag `v1.5.0` (`git rev-parse v1.5.0^{commit}`). Versions agree end to end: registry entry `1.5.0` == tag == `library.json` == `.claude-plugin/plugin.json` == `.codex-plugin/plugin.json` == `package.json`. `CHANGELOG.md` has the `[1.5.0] - 2026-06-09` entry; `RELEASE-NOTES.md` carries the curated 1.5.0 section. `release.yml` mechanizes the invariant (tag must equal every version-bearing manifest; gate re-run at release time). |
| L5 docs site conforms to the family site standard (SHOULD) | **PASS with 2 residuals** | 14.1 Pattern S (generated tree gitignored + `check-generated-untracked.mjs`); 14.2 Starlight, mermaid before starlight, branded `#5C7CFA` themeVariables; 14.4 `tests/unit/catalog-coverage.test.mjs` (the standard's named reference); 14.5 no committed build output; 14.6 Pages artifact flow (`upload-pages-artifact@v5` + `deploy-pages@v5`, `environment: github-pages`, PR `build-site` job same recipe); 14.8 `.nvmrc` 24 via `node-version-file`, `engines >=22.12.0`; 14.9 `site/public/favicon.svg` + `robots.txt`; 14.10 no sidecars; 14.11 two-guard local port (sanctioned small-site subset, ADR 0026). Residuals: the guards run only in `ci.yml` `build-site`, not in the `deploy-pages.yml` build job (gap G-1 below); `site/scripts/check-rendered-links.mjs:30` redeclares `const BASE = '/agent-skills-toolkit'` (14.7 single-source, gap G-2, acknowledged in ADR 0026's consequences). |
| L6 repo scaffolding (SHOULD, evidence only) | **RECORDED** | See 3.3. |

### 3.2 Declared-tier requirements (Standard 0.11 sec 2.5, tier `advanced`)

| Requirement | Verdict | Evidence |
|---|---|---|
| Bronze hard requirements (frontmatter, name=dir, 8.1 descriptions, one-level references, root `AGENTS.md`, minimal `library.json`, component `version`, U12 mermaid) | PASS | Gate U-checks all green; root `AGENTS.md` present; every components-index entry carries `version`/`tier`/`status` matching frontmatter. |
| Silver: `agent-targets` declared; per-target emission; chain contracts valid; manifest matches disk; semver | PASS | `agent-targets: ["claude","codex"]`; both native manifests generated (S6); subagents are Claude-only by the Standard's own 3.3 carve-out (Codex plugins cannot ship subagents); `agents/_chain-permitted.yaml` valid, no orphans or phantoms (S4); components index set-equal with disk for skills/subagents/commands/mcp (S3). Exception: the shipped hook is not enumerated anywhere in the index, see gap G-3. |
| Silver governance: two backlogs, per-component HISTORY, CHANGELOG | **PARTIAL** | Two backlogs present (`docs/internal/backlog/new-components.md` + `enhancements.md`); `CHANGELOG.md` present and disciplined. **Per-component `HISTORY.md`: 0 of 32 components have one** (sec 7.3 makes it a MUST at Silver and above; the gate's `version-match` is match-when-present, so nothing fails). See gap G-4 and decision D1. |
| Gold G1-G10 | PASS | G1 `hooks/README.md` documents event/matcher/scope/failure for the one hook; G2 self-hosting CI green at the pinned sha; G3 six eval sets cover every chain edge + the hook, enforced by `scripts/checks/library-regression.mjs` and executed via the CI test+gate run (the 2.6 baseline; the multi-tier eval engine is deferred by design); G4 INDEX + both native manifests + `manifest.generated.json` generated from `library.json` and drift-checked (U8); G5 `RELEASE-NOTES.md`; G6 deprecation check wired; G7-G10 docs frontmatter taxonomy, folder READMEs, source docblocks, Diataxis quadrants + ADR TL;DRs all green. |

### 3.3 L6 scaffolding evidence (E2 input; recorded, not judged)

- **Committed agent context:** root `AGENTS.md`; `docs/internal/` is the committed governance home (`decisions/` ADRs numbered from 0020, with the earlier D1-D19 consolidated in `docs/internal/DESIGN.md` per `decisions/README.md`; `backlog/`; `rfcs/`; `release-plans/`; `STATUS.md`; `template/`).
- **There is NO committed `_agent-context/`:** the repo gitignores it entirely (`.gitignore` line 9, comment: "Agent working context kept out of the public repo (session logs live here)"). This diverges from the L6 intent that `_agent-context/` holds committed context - direct evidence the intended convention is not what the family's best repo practices.
- **Gitignore coverage:** `_local/` and `_LOCAL/` both ignored (lines 4-5, with a comment noting the casing split between on-disk practice and the Standard's name); `.memsearch/` also ignored.
- **`agents/` namespace:** holds only plugin subagents (7 `askit-*.md`), `_chain-permitted.yaml`, and a folder README - the reserved-for-subagents convention holds; no session logs or agent knowledge.
- **Session logs:** none tracked (`git ls-files` has no session files). In the live checkout's untracked `_agent-context/`, BOTH `session-log/` and `session-logs/` directories coexist, naming pattern `YYYY-MM-DD_HH-MM_<agent>_<topic>.md` - the singular-vs-plural fork E2 must pin down is live inside a single repo.

## 4. Gaps

**P0 (would block a new listing - L1-L4 failures): none.**

**P1 (written MUSTs that are advisory today):**

- **G-4 - per-component `HISTORY.md` absent (Standard 2.5 Silver governance row + 7.3 MUST at Silver+).** 0 of 32 components carry one, and the gate has no presence check (`version-match` only enforces agreement when a HISTORY exists). Compounding: component content has changed materially across releases (30 files under `skills/` changed between `v1.0.0` and `v1.5.0`) while every component `version` stayed at `0.1.0`, so the 7.3/7.4 lifecycle machinery has never actually been exercised by its own reference implementation. Resolution is decision D1.
- **G-3 - the shipped hook is not in the components index.** `hooks/hooks.json` registers the `no-dashes` PreToolUse hook (a real component: documented per G1, eval-covered per G3) but `library.json.components` has no `hooks` key, `manifest.generated.json` does not list it, and the S3 check (`scripts/checks/components-index.mjs`) does not enumerate hooks at all, although Standard 5.1 names `hooks` as a components-index type and sec 5 requires manifests consistent with disk. Resolution is decision D2.

**P2 (SHOULDs and polish):**

- **G-1 - 14.11 guards do not run on the deploy build.** `check-rendered-links.mjs` and `check-route-parity.mjs` run in `ci.yml` `build-site` (PRs and pushes to main) but the `deploy-pages.yml` build job builds and uploads the artifact unguarded, and the deploy is not gated on `ci.yml`; a `workflow_dispatch` deploy runs no guards at all. SITE-STANDARD 14.11 requires guards on both the PR build and the deploy build. ADR 0026 placed them in the PR job only. Decision D3.
- **G-2 - 14.7 base single-source.** `site/scripts/check-rendered-links.mjs:30` redeclares the base as a literal instead of importing it from one source; ADR 0026 lists this as a tracked negative. Fix: a `site-base.mjs`-style module read from `astro.config.mjs` (the pm-skills donor carries the same P1, per SITE-STANDARD section 5).

## 5. Maintainer decisions (genuine forks only)

- **D1 - per-component history policy (genuine fork; may require a Standard amendment).** The written Standard (2.5 + 7.3) requires a co-located `HISTORY.md` per component at Silver+; the Gold reference ships none and the gate does not check presence. Two honest resolutions:
  - **(a) Conform the repo to the law:** backfill `HISTORY.md` for all 32 components, start maintaining real component version bumps (content changed since v1.0.0 with versions frozen at 0.1.0), and add a Silver+ HISTORY-presence check to the spine (warn-then-error per 7.7 burndown).
  - **(b) Amend the law to match the evidence:** through the GOVERNANCE.md serialized amendment process (one PR: text + Standard version bump + one ADR), relax 7.3 to require `HISTORY.md` from a component's first post-initial change rather than unconditionally, keeping match-when-present; pair it with a check that flags a component whose content changed since the last release without a version bump (which the toolkit currently fails in spirit).
  - **Recommended: (b)** - the family's stated discipline is evidence-then-law, and the evidence is that 32 uniform `0.1.0` HISTORY files would be pure ceremony; but the version-staleness half must land either way, because change-without-bump is the part that silently broke. This is the maintainer's call: (a) is the purer self-proving move.
- **D2 - hook indexing.** (a) Add a `components.hooks` entry to `library.json`, extend `components-index.mjs` (S3) and `gen-manifest.mjs`/`manifest.generated.json` to enumerate hooks, with tests; or (b) document hooks as registration-only artifacts (`hooks/hooks.json`) deliberately outside the index, which needs a Standard 5.1 clarification. **Recommended: (a)** - 5.1 already names `hooks` as an index type, so (a) needs no law change and closes a real manifest-vs-disk blind spot for every downstream plugin the gate grades.
- **D3 - deploy-build guards.** (a) Add the two guard steps to the `deploy-pages.yml` build job (after `npm run build`, before `upload-pages-artifact`); or (b) wait for the shared reusable workflow (astro-sites ROADMAP Phase 1) to own it. **Recommended: (a)** - 14.11's own text names the local guard the sanctioned bridge and rejects deferral to unbuilt shared infra; the steps already exist and the cost is six lines of YAML.

## 6. Implementation checklist (the executing session updates this)

- [ ] Confirm `main` is clean and up to date with `origin/main`.
- [ ] **D1** resolved by the maintainer. If (a): backfill 32 `HISTORY.md` files + presence check (warn first, per 7.7). If (b): Standard amendment PR (7.3 text + version bump + ADR), then add the change-without-bump check; re-pin `library.json.standard` when the amendment lands.
- [ ] **D2** Add `components.hooks` to `library.json`; extend `scripts/checks/components-index.mjs` and `scripts/generators/gen-manifest.mjs` (plus `manifest.generated.json` regeneration) to hooks; add golden/anti fixtures + tests.
- [ ] **D3** Add the two 14.11 guard steps to `deploy-pages.yml`'s build job, mirroring the `ci.yml` steps (including `STRICT_ANCHORS=1` and the same gating on build outcome).
- [ ] **G-2** Extract the site base to one source (a `site-base.mjs` importable by `check-rendered-links.mjs`, value derived from `astro.config.mjs`); keep the route-parity guard base-agnostic as it is.
- [ ] Regenerate manifests (`gen-manifest.mjs --write --target=all`) and `INDEX.md`; gate green locally (`node scripts/check.mjs`, `npm test`).
- [ ] CHANGELOG entry (and RELEASE-NOTES if released); open the PR; CI green; await maintainer review (do not merge without confirmation).
- [ ] If the maintainer approves the contract corrections below, open a separate agent-plugins PR amending CONTRIBUTING.md (per its own amendment rule, Section 8).

## 7. Acceptance criteria (done = all true)

- The gate still reports `Tier: Advanced` with 0 errors at HEAD, and the new/extended checks (hook indexing; HISTORY or change-without-bump per D1) pass against the repo itself.
- `library.json.components` enumerates every shipped component type present on disk, including the hook, and `manifest.generated.json` reflects it.
- The D1 outcome is landed on whichever side was chosen: either every component has a `HISTORY.md` and a presence check, or the Standard amendment is merged (version bumped, ADR recorded) and the repo re-pins it.
- Both 14.11 guards run in the `deploy-pages.yml` build job, and no consumed base literal remains in `site/scripts/` outside the sanctioned 14.7 exceptions.
- CHANGELOG updated; PR(s) prepared and CI green; nothing merged without maintainer confirmation.

> Outcome: the Gold reference stays the fastest pass in the family, and the two places where its practice and the written law disagreed (per-component history, hook indexing) are resolved deliberately - in law or in repo - instead of remaining silent.

## Contract corrections (audit findings that amend CONTRIBUTING.md before clauses harden)

- **C1 - L2's "MUST NOT reference the marketplace" over-reaches.** Read literally it bans the install instructions every listed plugin needs. The Gold reference ships them (`README.md:68-71`, `site/src/content/docs/getting-started.md:14`) because its own launch spec mandated them (R-DOCS-1: "The README Quick start MUST show the marketplace install") in the same document that asserted the one-way rule held (R-MKT-6: "the toolkit repo does not reference the marketplace"). The family's working interpretation is therefore structural, not prose: the prohibition is on embedded self-listing marketplaces and listing-association artifacts, not on documentation pointing users at the registry. Proposed rewording for the L2 bullet: "The plugin repo MUST NOT declare its marketplace association structurally - no embedded self-listing marketplace.json (either agent's format) and no listing metadata in its manifests. Prose install instructions that point users at the external registry are expected and conformant."
- **C2 - L1's frontmatter bullet conflicts with the Standard it binds.** L1 restates "top level keeps `name` / `description` / `license`; proprietary fields nest under `metadata:`", but the Standard's own chaining mechanism (sec 3.6/3.8) is a top-level `chain:` frontmatter key, which the toolkit's S4 check reads (`scripts/checks/chain-contract.mjs:23`) and two reference skills carry. The contract promised to restate nothing from the Standard (its L3 text); this bullet restates frontmatter law and got it out of sync. Proposed fix: drop the restated bullet and defer skill-frontmatter conformance to the Standard at the plugin's pinned version (which already binds agentskills.io at sec 3.1/6). Companion Standard clarification to queue in the toolkit's own backlog: sec 3.8 lists `chain` only under the Subagent row while the gate accepts it on any component; amend 3.8 to name `chain` for skills explicitly.
- Not a contract correction but recorded for E2: the L6 intent says `_agent-context/` holds committed context, while the Gold reference gitignores `_agent-context/` entirely and keeps both `session-log/` and `session-logs/` under it locally. L6 is explicitly pre-normative and evidence-gathering, so this is input to the folder-structure epic, not a clause failure.
