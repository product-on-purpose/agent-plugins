# Astro site standard: implementation audit (2026-06-02)

> Committed audit. It measures the four family plugins against the proposed Astro documentation-site standard (clauses 14.1 to 14.10, the CI guardrails, and the shared-preset readiness signals) as they actually stand in their live repositories on 2026-06-02. It supersedes the conformance snapshots in the gitignored working docs under `_LOCAL/astro/`, which were written 2026-06-01 and are now stale in several load-bearing places (Section 5). The refined standard this audit feeds lives at [`standards/domains/astro-sites/`](../../../standards/domains/astro-sites/README.md).

> **Update (2026-06-02, later same day): the family is now 4/4 Pattern S on `main`.** When the audit ran, writing-style-catalog's Pattern S work was on an unmerged branch (`refactor/astro-pattern-s-convergence`) and its `main` was still Pattern W. That work has since shipped to `main` via **PR #11 (`197c426`, "refactor(site): converge the docs site to Pattern S")**. The rows for writing-style-catalog below have been updated to reflect `main`; the original branch-vs-main caveat is retained as provenance. wsl's residual gaps on `main` are now P2 only (mermaid branding, a CI dash check) plus the shared 14.11 validators gap it has in common with agent-skills-toolkit and thinking-framework-skills.

> **Update 2 (2026-06-02, post-rollout): all four conformance sessions landed, and two findings in this audit were corrected by the work.** Per-repo review-findings docs are in [`../../../standards/domains/astro-sites/rollout/`](../../../standards/domains/astro-sites/rollout/). (1) **The favicon is a MUST, not "minor."** Starlight emits a `<link rel="icon">` on every page, so a missing favicon is a 404 on every page; the strict rendered-link guard caught this live on agent-skills-toolkit. The 3.1 "no favicon override (minor)" note is wrong - it was a latent 404, now fixed. (2) **The writing-style-catalog Starlight title "Writing Style Library" is deliberate, not stale.** ADR 0014 retained the display title through the slug rename; the 3.4 "stale title" carry-over and the Section 6 P2 are withdrawn. (3) **Three of four repos implemented 14.11 locally rather than deferring** (only tfs deferred), correctly: the shared workflow/preset are unbuilt, 14.11 is a MUST, and the local guards caught real shipped breakage (the favicon 404; sixteen pre-existing live 404s in wsl). The standard now mandates the local-bridge approach and folds in the guard-robustness fixes the reviews surfaced (bare-relative hrefs, quote symmetry, defensive decode, CLI `argv` null-check, deploy-build guarding). See `SITE-STANDARD.md` section 1 items 6-10.

## 0. How this was produced (provenance)

Each repository was deep-audited against its actual files on disk (`astro.config.mjs`, `src/content.config.ts`, `package.json` + lockfile, `.github/workflows/*`, generators, `.gitignore`, `public/`) by one agent per repo, then a second independent agent adversarially re-ran the load-bearing and surprising claims with `git`, `grep`, and `Read`, trying to refute each one. Eight agents total. The adversarial pass changed the result in two material ways, both carried into this audit and flagged **[corrected]**:

- **agent-skills-toolkit's catalog IS drift-guarded.** The first pass called the hand-authored `catalog.md` an unguarded P1 gap. That was **refuted**: `tests/unit/catalog-coverage.test.mjs` runs in CI via `npm test` on every push and PR and asserts both directions (every `library.json` component appears in the catalog; no phantom `askit-*` name appears that is absent from `library.json`). The first pass missed it by grepping `scripts/` and not `tests/`.
- **writing-style-catalog was audited mid-merge.** When the audit ran, the repo was checked out on `refactor/astro-pattern-s-convergence`, seven commits ahead of a `main` that was still Pattern W with a Python generator. That branch has since shipped to `main` via PR #11 (`197c426`), so `main` is now Pattern S. The rows below reflect the shipped `main`; the branch-vs-main split is retained only where it explains the timeline.

A third, smaller correction: tfs's `gen-recommendable.mjs --check` is **wired** into CI (the `recommendable-drift` job), so the "one High-severity unguarded `--check`" finding from the 2026-06-01 docs is also stale.

## 1. TL;DR

**The convergence has happened, and both original High-severity findings are closed.** The 2026-06-01 audit found two High-severity drift gaps (tfs's unwired `--check`, agent-skills-toolkit's unguarded catalog). Both are now resolved in the live repos. **All four sites are Pattern S on `main`** (writing-style-catalog shipped its migration via PR #11 after the audit run). No repo commits build output. All four set `site`, register `astro-mermaid` before `starlight`, pin `.nvmrc` to `24`, declare `engines.node >=22.12.0`, deploy via the Pages artifact flow with `deploy-pages@v5`, and run a PR-time non-deploying build (on the shipped branch).

**The frontier has moved from per-repo conformance to shared infrastructure.** The biggest live risk is no longer site layout; it is that **the four build-aware link/route validators exist only in pm-skills**, so the other three siblings can ship browser-broken internal links or silently removed routes undetected. The shared preset and the reusable CI workflow are specified but not built. The remaining per-repo conformance gaps reduce to three P1s and a handful of P2 polish items.

The real remaining work, ranked:

1. **Spread the link/route integrity guards** (the four pm-skills validators) to the three siblings, via a reusable workflow. This is the one finding with concrete, already-live harm.
2. **Delete thinking-framework-skills' seven `.md` sidecars** (the one clean 14.10 violation left).
3. **De-duplicate pm-skills' base literal** (the one clean 14.7 violation left).
4. **Extract the shared preset + reusable workflow** from the now-converged baseline.

Done since the 2026-06-01 drafts: writing-style-catalog's Pattern S migration shipped to `main` (PR #11), resolving its layout, Python-to-Node, CI, accent, and robots gaps in one move (A-6 / ADR 0011 = migrate, executed); its residual is P2 polish only.

## 2. Conformance matrix

Status is reported against `main` for all four repos. writing-style-catalog's Pattern S work shipped via PR #11 (`197c426`) after the audit run, so its earlier `main -> branch` split is resolved and the column below is its shipped `main`.

| Clause | agent-skills-toolkit | pm-skills | thinking-framework-skills | writing-style-catalog (main, post #11) |
|---|---|---|---|---|
| **14.1 Pattern S** (site/, stock `docsLoader()`) | conformant | conformant | conformant | conformant |
| **14.2 Framework** (Astro+Starlight, `site`, mermaid before starlight) | conformant | conformant | conformant | conformant (+ mdx) |
| **14.3 Generate from source** (Node `.mjs`, no Python site gen) | conformant (via 14.4 catalog path) | conformant | conformant | conformant |
| **14.4 Drift guard** | conformant **[corrected]** | conformant | conformant **[corrected]** | conformant |
| **14.5 No committed build output** | conformant | conformant | conformant | conformant |
| **14.6 Deploy + PR build + pinned actions** | partial (stale majors, hardcoded node) | conformant | conformant | conformant |
| **14.7 Base single source** | conformant | partial (dup in `check-rendered-links.mjs`) | conformant | conformant |
| **14.8 Versions + Node** | partial (node-pin mechanism) | partial (one workflow hardcode) | partial (one job hardcode) | conformant (no `.node-version`; minor) |
| **14.9 Search + SEO** | conformant (robots, no og) | partial (no robots.txt) | conformant (robots, no og) | conformant (robots, no og) |
| **14.10 No config sidecars** | conformant | conformant | **non-conformant (7 sidecars)** | conformant |
| Build-aware validators (4) | none | all four (donor) | none | none |
| Mermaid branded (#5C7CFA) | no | yes | yes | no |
| Accent #5C7CFA | yes | no (default) | yes | yes |

"partial" on 14.8 means the floor and pin are correct (`engines.node >=22.12.0`, `.nvmrc=24`) but one or more workflow jobs hardcode a Node version instead of reading `.nvmrc`, and the resolved Astro version is not pinned family-wide (6.3.3 in pm-skills, 6.4.2 in the other three).

## 3. Per-repo findings

### 3.1 agent-skills-toolkit (`main` @ 674257f)

The reference plugin. It is Pattern S, hand-authors its six-page site, and is correct on the structural clauses.

- **14.1 / 14.2 conformant.** `site/src/content.config.ts:6` calls the stock `docsLoader()` with no arguments; `site/astro.config.mjs:12-13` set `site` + `base: '/agent-skills-toolkit'`; `astro-mermaid` is registered before `starlight`.
- **14.4 conformant [corrected].** The site catalog is hand-authored prose (`catalog.md`), which the standard allows **only with a coverage check** (14.4). That check exists and runs in CI: `tests/unit/catalog-coverage.test.mjs`, executed by `npm test` in `ci.yml`'s validate job on push and PR, asserts coverage both ways against `library.json`. This is the reference implementation of the 14.4 hand-authored-catalog path and should be cited as such in the standard.
- **14.3 conformant via 14.4.** There is no site generator (`scripts/generators/` holds only the spine generators `gen-index`, `gen-manifest`, `sync-agents-md`). That is fine: 14.3 requires generation OR the 14.4 coverage check for an enumerating page, and the coverage check is present.
- **14.6 partial (P2).** Deploy uses `upload-pages-artifact@v5` + `deploy-pages@v5` gated to `environment: github-pages`, and a PR non-deploying build job exists (`ci.yml` `build-site`). But `checkout@v4` + `setup-node@v4` are stale majors and all three jobs hardcode `node-version: "24"` instead of `node-version-file: .nvmrc` (so the committed `.nvmrc`/`.node-version` are not actually the source of truth in CI). This is the concrete "deploy ignores its own `.nvmrc`" drift the findings doc named.
- **14.9 partial [corrected].** `robots.txt` present and points at the sitemap; no `og:image` (preset-owned, conformant); **no favicon at audit time** - and since Starlight emits a `<link rel="icon">` on every page, that was a live 404 on every page, not the "minor" this audit first called it. The rollout (#83) added the family favicon; the standard now makes a favicon a 14.9 MUST.
- **14.10 conformant.** No config sidecars.
- **Preset divergence:** mermaid is **unbranded** (`mermaid({ theme: 'default', autoTheme: true })`, no `themeVariables`); accent is at `#5c7cfa`. Schema is stock `docsSchema()`.
- **Distance to standard:** small. P2 only: modernize the deploy action majors and switch to `node-version-file`; brand mermaid (lands via the preset).

### 3.2 pm-skills (`main` @ 1eea16f)

The most-hardened reference implementation and the donor of every build-aware validator. PRs #154 and #159 shipped Pattern S, the Node generator, the build-time remark resolver, and the route-parity + anchor-resolution gates.

- **14.1 / 14.2 / 14.3 / 14.5 conformant.** Stock `docsLoader()` (`content.config.ts:15`); `BASE` single-sourced in `astro.config.mjs:10`; one zero-dependency Node `scripts/gen-site.mjs`; generated content gitignored and rebuilt each build; mermaid branded (`lineColor: '#5C7CFA'`) before starlight.
- **14.4 conformant.** Generated subdirs (`skills/*/`, `workflows/`, `showcase/`, `samples/*/`, `reference/commands.md`) are gitignored; CI regenerates on every PR before building (`validation.yml:40` then the enforcing build). This is the gitignored-and-rebuilt model in its cleanest form.
- **14.6 conformant.** `checkout@v5` + `setup-node@v5` (`node-version-file: .nvmrc`) + `upload-pages-artifact@v5` (`./site/dist`) + `deploy-pages@v5` + `environment: github-pages`. The PR non-deploying build runs the four build-aware checks (internal-leak, `verify-edit-links`, `check-rendered-links` with `STRICT_ANCHORS=1`, `check-route-parity`). One unrelated workflow (`create-issues-from-drafts.yml:28`) hardcodes Node `22.12`; minor.
- **14.7 partial (P1).** `BASE = '/pm-skills'` is single-sourced in `astro.config.mjs`, but **duplicated** at `scripts/check-rendered-links.mjs:28` (with a "keep in sync" comment). A wrong base there makes the rendered-link check pass while the live site 404s, so this is the careful single-source-extraction the findings doc flags (the planned `scripts/site-base.mjs` does not exist on disk). This is the one clean 14.7 violation left in the family.
- **14.9 partial (P2).** `robots.txt` is **absent** (pm-skills is the only one of the four without it); favicon present; no `og:image`. A reverse divergence: the donor lacks the SEO file three siblings have.
- **Preset divergence:** mermaid branded; accent has **no `--sl-color-accent` override** (uses Starlight default), the inverse of the other three. Schema extension is the largest (~24 fields), the natural superset for `docsSchemaShared`.
- **Build-aware validators:** all four present (`check-route-parity`, `check-rendered-links` with anchor resolution, `verify-edit-links`, `remark-resolve-links`). pm-skills is the donor.
- **Distance to standard:** very close. One P1 (base de-dup), two P2 (robots.txt, accent unification via preset).

### 3.3 thinking-framework-skills (`main` @ 0673399)

Pattern S, fully Node, the cleanest generator pipeline. One real conformance gap remains.

- **14.1 / 14.2 / 14.3 / 14.5 conformant.** Stock `docsLoader()` (`content.config.ts:11`); zero `.py` files anywhere; `gen-site.mjs` + `gen-recommendable.mjs` are dependency-free Node; mermaid branded before starlight; no committed build output.
- **14.4 conformant [corrected].** Site content is gitignored and rebuilt. The one committed generated artifact is the advisor's `recommendable.{json,md}` (it feeds the advisor's name-safety set), and `gen-recommendable.mjs --check` **is wired** into CI (`ci.yml` `recommendable-drift` job, exits 1 on either-artifact drift). The 2026-06-01 "unwired `--check`, can recommend a nonexistent skill" High-severity finding is resolved.
- **14.6 conformant.** `upload-pages-artifact@v5` + `deploy-pages@v5` gated to `github-pages`; all `checkout@v5` / `setup-node@v5`; PR non-deploying build (`ci.yml` `site-build`). P2: the core `check` job hardcodes `node-version: '22'` while every site job reads `.nvmrc` (=24).
- **14.7 conformant.** Base literal appears exactly once (`astro.config.mjs:27`); consumers use `import.meta.env.BASE_URL`.
- **14.9 conformant.** `robots.txt` present; no `og:image`.
- **14.10 non-conformant (P1).** Seven per-file `.md` sidecars are tracked: `library.json.md`, `manifest.generated.json.md`, `scripts/gen-site.mjs.md`, `scripts/gen-recommendable.mjs.md`, `skills/think-framework-advisor/references/recommendable.json.md`, `.claude-plugin/plugin.json.md`, `.codex-plugin/plugin.json.md`. This is the one clean 14.10 violation in the family. Fold rationale into config comments or a single docs page; delete the sidecars.
- **Preset divergence:** mermaid branded; accent `#5c7cfa`; schema extension medium (8 fields). One latent item worth verifying: `editLink.baseUrl` is `.../edit/main/` without the `/site/` segment the other Pattern S repos carry, so edit links on hand-authored pages may resolve to the wrong repo path. Low confidence, low severity; verify before acting.
- **Distance to standard:** one P1 (sidecars), small P2 (node-pin in the `check` job).

### 3.4 writing-style-catalog (`main` @ 197c426, Pattern S, shipped via PR #11)

The Pattern S migration shipped to `main` (PR #11, "refactor(site): converge the docs site to Pattern S"). What the audit saw on the branch is now the `main` state, so wsl joins agent-skills-toolkit and thinking-framework-skills as a close-conformance Pattern S repo with P2 polish left.

- **14.1 / 14.3 / 14.5 conformant.** App under `site/`; stock `docsLoader()` (`site/src/content.config.ts:10`, stock `docsSchema()`); a zero-dependency Node `scripts/gen-site.mjs` (with an `assertSafeOutRoot` guard refusing to generate into source trees) replaced the Python `generate_site_pages.py`, which is gone from `main`; generated catalog gitignored and rebuilt; no committed build output. The Python that remains (`tools/build-indexes.py`, `tools/taxonomy.py`, `tools/diff-pair-generator.py`, `tools/validate.py`, a skill build script) is taxonomy/skill tooling, not a site generator, so 14.3 is satisfied for the site.
- **14.2 conformant (branding gap).** Astro + Starlight; `site` set; `astro-mermaid` before `starlight`; `@astrojs/mdx` after `starlight` (correct order, for GFM tables in `.mdx`). Mermaid is **unbranded** (`theme:'default'`, no `themeVariables`) - the P2 branding gap it shares with agent-skills-toolkit.
- **14.4 conformant.** The `taxonomy.json` drift guard (`tools/build-indexes.py` then `git diff --exit-code taxonomy.json`) runs in CI; the generated catalog is gitignored-and-rebuilt.
- **14.6 conformant.** `checkout@v5` + `setup-node@v5` (`node-version-file: .nvmrc`) + `upload-pages-artifact@v5` (`./site/dist`) + `deploy-pages@v5` + `environment`; a PR non-deploying `build-site` job (`validate.yml`, `if: github.event_name == 'pull_request'`). The earlier `./dist` path and hardcoded `22.12.0` are gone.
- **14.7 / 14.9 / 14.10 conformant.** Base once in `astro.config`; `robots.txt` + favicon present, no `og:image`; no config sidecars.
- **14.8 conformant (minor).** `engines.node >=22.12.0`, `.nvmrc=24`, CI reads `node-version-file`. No `.node-version` companion (optional). Astro resolves `6.4.2`.
- **14.11 non-conformant (shared gap).** None of the four build-aware validators present - the same gap as agent-skills-toolkit and thinking-framework-skills; closed by the shared workflow.
- **Carry-over P2s:** mermaid is unbranded; the em/en-dash check exists only as a pre-commit hook, not in CI, so a contributor who bypasses pre-commit can land a dash. (The Starlight `title` "Writing Style Library" is **not** a carry-over: ADR 0014 deliberately retained the display title through the slug rename. The first pass mis-read it as stale; corrected.)
- **A-6 = migrate, executed.** The migrate decision shipped with #11 (the Pattern S catalog now lives under `site/`); A-6 is closed, not pending.
- **Distance to standard:** close. P2 only: brand mermaid, add the CI dash check, optional `.node-version`; plus the shared 14.11 validators.

## 4. Cross-cutting findings

### 4.1 Link and route integrity: the real cross-family drift (highest live risk)

The four build-aware validators that protect a built Starlight site from shipping broken links and silently removed routes exist **only in pm-skills**:

- `check-rendered-links.mjs` (walks `dist/*.html`, validates internal hrefs, resolves `#anchor` fragments against real element ids; enforcing via `STRICT_ANCHORS=1`),
- `check-route-parity.mjs` + a committed `route-manifest.txt` (fails the build if a published URL disappears without a redirect; presence-only by design),
- `verify-edit-links.mjs` (confirms every edit link resolves to a real source path),
- `remark-resolve-links.mjs` (the build-time mdast transform that emits Starlight-correct slug links, replacing the retired post-build HTML rewriter).

agent-skills-toolkit, thinking-framework-skills, and writing-style-catalog have **none** of these. Concrete harm: any of those three can ship a browser-broken internal link or a dead-bookmark route regression with nothing in CI to catch it. This is the single strongest argument for the shared work, and it is drift correction, not code reuse.

A guard-robustness lesson from pm-skills' own hardening (worth codifying for the shared validators): an unguarded `decodeURIComponent` on a URL fragment threw an uncaught `URIError` on any literal `%`, crashing the entire rendered-link check. A guard that crashes on malformed input is worse than no guard. The shared validators MUST decode defensively, fail on their own assertions rather than on parse errors, and hard-fail on an empty-but-existing `dist` (symmetric with route-parity).

A second, narrower instance of the same class surfaced during the thinking-framework-skills conformance session (2026-06-02): **generated pages' Edit links 404** when the generator lets Starlight auto-derive `editUrl` from the page's on-disk path, because that path is gitignored and rebuilt each build. This is the exact failure `verify-edit-links` exists to catch, and it is not family-wide: pm-skills sets each generated page's `editUrl` to its true source (`skills/<skill>/SKILL.md`, `_workflows/<name>`) or `false`, and writing-style-catalog sets `editUrl: false` on all generated pages; only thinking-framework-skills had the gap (its `gen-site.mjs` did no `editUrl` handling), now recorded for the Phase 1.3 pilot. The rule is carried into the standard (reference architecture "Generated-page Edit links" + the 14.11 edit-link verifier): a generated page MUST set `editUrl` to its true source or `false`, never an auto-derived gitignored path.

### 4.2 Shared-preset divergence (what one preset would unify)

| Signal | askit | pm-skills | tfs | wsl |
|---|---|---|---|---|
| Mermaid branded (`#5C7CFA` themeVariables) | no | yes | yes | no |
| Accent `--sl-color-accent` | `#5c7cfa` | none (default) | `#5c7cfa` | `#5c7cfa` |
| `content.config` schema | stock | ~24 fields | 8 fields | stock |
| `robots.txt` | yes | no | yes | yes (branch) |
| editLink `/site/` segment | yes | yes | no (`/edit/main/`) | yes |

The accent is now far more converged than the 2026-06-01 docs claimed (the "`#7c3aed` in wsl" divergence is resolved; the residual is that pm-skills sets no accent and two repos do not brand mermaid). A `defineDocsConfig` factory plus a shared `accent.css` and `docsSchemaShared` would make all five rows uniform at once and is the natural next step once the per-repo work lands.

### 4.3 Toolchain pinning

All four declare `engines.node >=22.12.0` and pin `.nvmrc=24` (agent-skills-toolkit also has `.node-version=24`). The residual drift is in the **mechanism**, not the value: agent-skills-toolkit hardcodes `node-version: "24"` in three jobs, pm-skills hardcodes `22.12` in one workflow, thinking-framework-skills hardcodes `22` in its `check` job, and writing-style-catalog hardcodes `22.12.0` on main. Every site job should read `node-version-file: .nvmrc`. Astro resolves to `6.4.2` in three repos and `6.3.3` in pm-skills; the family should pin one resolved set (the preset's peerDependencies are the place to do it).

The Standard's own runner floor was raised from EOL Node 20 to `>=22.12.0` (pin 24) in **Standard v0.9 (ADR 0025)**, so clause 14.8's core-floor cross-reference is satisfied; agent-skills-toolkit's core should re-adopt v0.9.

## 5. Corrections to the 2026-06-01 working docs (staleness)

The gitignored `_LOCAL/astro/` docs and `_LOCAL/standards-plan.md` predate the convergence work and are wrong in these load-bearing places. The refined standard fixes them:

- **Both High-severity findings are resolved.** "tfs `gen-recommendable --check` unwired" and "agent-skills-toolkit catalog has no drift guard" are both closed in the live repos.
- **All four sites are Pattern S on `main`.** The "pm-skills and writing-style-library are Pattern W" framing, the "move app to site/ is P2 polish" line, and the "two-and-two Pattern S/W split" are stale. writing-style-catalog was the last to ship (PR #11).
- **The big Python-to-Node refactor is done.** pm-skills ported to one Node `gen-site.mjs` (PR #154); writing-style-catalog ported and shipped to `main` (PR #11). No Python touches any SITE now: pm-skills' surviving `build-skill-catalog.py` writes a SKILL reference, and wsl's surviving `tools/*.py` are taxonomy/skill tooling, not site generators.
- **The repo was renamed** `writing-style-library` -> `writing-style-catalog`. The rollout docs hardcode the old name and base literal (`/writing-style-library`); the live base is `/writing-style-catalog`.
- **Deploy actions already moved to `@v5`.** The "v3/v4 and v5/v5 coexist" drift is gone for the Pages actions; do not re-bump backward. The residual is stale `checkout`/`setup-node` majors in agent-skills-toolkit only.
- **The post-build HTML rewriter is retired** in pm-skills (replaced by `remark-resolve-links.mjs`); the `_unreleased` plan's "third base duplicate in the rewriter" is stale.
- **Accent is converged** to `#5C7CFA`; the wsl `#7c3aed` divergence is resolved.

## 6. Re-prioritized gap list

**P0 (correctness now):** none. Both former High-severity items are closed.

**P1 (conformance-blocking):**
- ~~writing-style-catalog: merge the Pattern S branch~~ - DONE (PR #11). wsl's residual is P2 only.
- thinking-framework-skills: delete the seven `.md` config/data sidecars (14.10).
- pm-skills: extract the base literal to a single source so `check-rendered-links.mjs:28` stops duplicating it (14.7); land it with a test, since a wrong base passes the check while the site 404s.
- Family: carry the four build-aware validators to the three siblings (via the reusable workflow). The only finding with already-live harm.

**P2 (polish, mostly absorbed by the preset):**
- agent-skills-toolkit: modernize `checkout`/`setup-node` to v5 and switch to `node-version-file: .nvmrc`; brand mermaid (preset).
- pm-skills: add `public/robots.txt`; set the `#5C7CFA` accent (preset).
- thinking-framework-skills: align the `check` job to `.nvmrc`; verify the `editLink` `/site/` segment.
- writing-style-catalog: add the em/en-dash check to CI; brand mermaid (preset). (The "fix the stale title" item is withdrawn: the title was deliberately retained per ADR 0014.)
- Family: pin one resolved Astro version set; build the shared preset and reusable workflow; add a default `og:image` via the preset.

## 7. Implications for the standard (what to refine)

The audit feeds five refinements, carried into [`standards/domains/astro-sites/SITE-STANDARD.md`](../../../standards/domains/astro-sites/SITE-STANDARD.md):

1. **14.4 now has a proven hand-authored-catalog path.** Cite agent-skills-toolkit's `tests/unit/catalog-coverage.test.mjs` as the reference implementation of the coverage-check exception, and make explicit that the check may live in `tests/` rather than `scripts/check.mjs` (so a consumer without a site is not burdened).
2. **Add a link/route integrity clause (14.11).** The four build-aware validators are not in the original ten clauses; the implementation proved they are load-bearing. Promote them to a named guardrail with the guard-robustness rule (a guard that crashes on malformed input is worse than no guard).
3. **Prefer gitignored-and-rebuilt generated content.** It is now the dominant pattern (pm-skills, tfs, wsl-branch) and removes the drift surface entirely; reserve committed-generated for artifacts a non-site consumer reads (the tfs `recommendable.*` case), which then MUST run `--check` in CI.
4. **Make `node-version-file: .nvmrc` the required mechanism**, not just a pinned value, so a committed `.nvmrc` is actually the CI source of truth.
5. **Reframe the preset decision (A-2) around drift correction.** Ship the reusable CI workflow + the four validators first (the payload that fixes the verified gap); consume the preset as a git-tag dependency; defer the registry publish behind a written trigger (a fourth consumer, open-sourcing, or upgrade churn). Pick `defineDocsConfig` over `popDocs` as the factory name.

## Appendix A: stack and branch snapshot (2026-06-02)

| Repo | Branch audited | HEAD | Astro (resolved) | Starlight | astro-mermaid | sharp | Node pin |
|---|---|---|---|---|---|---|---|
| agent-skills-toolkit | main | 674257f | 6.4.2 | 0.39.2 | 2.0.1 | 0.34.5 | `.nvmrc`+`.node-version`=24 |
| pm-skills | main | 1eea16f | 6.3.3 | 0.39.2 | 2.0.1 | 0.34.5 | `.nvmrc`=24 |
| thinking-framework-skills | main | 0673399 | 6.4.2 | 0.39.2 | 2.0.1 | 0.34.5 | `.nvmrc`=24 |
| writing-style-catalog | main (post PR #11) | 197c426 | 6.4.2 | 0.39.2 | 2.0.1 | 0.34.5 | `.nvmrc`=24 |

All four: `site: 'https://product-on-purpose.github.io'`, `base: '/<repo>'`, Pagefind search, sitemap emitted (because `site` is set), GitHub Pages Actions artifact deploy, no committed build output, no custom domain, no `og:image`.

## Appendix B: evidence index

- Audit method: 8-agent workflow (4 audit + 4 adversarial verify), 2026-06-02; raw transcript in this session's workflow output.
- Branch states verified via `git rev-parse` / `git log main..HEAD` per repo (Section 3.4, Appendix A).
- Source standard (pre-refinement): the gitignored 2026-06-01 drafts `_LOCAL/astro/astro-site-standards.md`, `ci-standard.md`, `shared-preset-spec.md`, now promoted and refined into `standards/domains/astro-sites/` and swept from `_LOCAL/` (their content lives, refined, in the tracked bundle).
- Session log reviewed: `agent-skills-toolkit/_agent-context/session-logs/2026-06-02_08-00_claude_readme-depth-tier-mirror-and-standards-home.md`.
- Findings annotated: `_LOCAL/astro/findings-suggestions/2026-06-02_pm-skills-session_after-astro.md` (inline audit-response blocks added this session).
- Refined standard: `standards/domains/astro-sites/` (this session).
