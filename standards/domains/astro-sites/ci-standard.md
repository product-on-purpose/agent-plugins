# Astro site CI: the reusable workflow and required checks

> Companion to [`SITE-STANDARD.md`](SITE-STANDARD.md) (clauses 14.4, 14.6, 14.8, 14.11). Promoted and refined from `_LOCAL/astro/ci-standard.md`. It specifies the CI that keeps the four family sites aligned over time: one reusable `workflow_call` workflow, a portable guard suite, and the four build-aware validators.
>
> **What changed from the draft:** the audit found 3 of 4 sites already run a PR non-deploying build and deploy via `@v5`. So this CI's primary job is no longer "add PR builds"; it is to **carry the four build-aware link/route validators to the three siblings that lack them** (the one finding with live harm) and to end the residual `node-version` mechanism drift. The validators are specified as parameterized modules shipped from the shared preset and invoked by the workflow's `build-cmd`.

## 1. Shape: one reusable workflow, thin callers

One callable workflow committed to a shared infra repo (`product-on-purpose/.github` at `.github/workflows/astro-site.yml`) exposes a single `workflow_call` interface. Each site repo keeps a roughly 20-line caller that does nothing but `uses:` the reusable workflow with typed inputs. The reusable workflow encodes the whole CI contract: checkout, pin Node from `.nvmrc` and assert agreement, `npm ci` in the site working-directory, the portable guard suite, build via the repo's `build-cmd` (generator then `astro build`), then on PR stop after build + guards (no deploy), and on push-to-main upload the Pages artifact and deploy.

Composable steps are used deliberately (not `withastro/action`) because every site runs a Node `.mjs` generator before `astro build`, and the all-in-one action runs `astro build` directly with no pre-build hook. Base path, accent, and mermaid config are not a CI concern; they live in the preset and `astro.config.mjs`. CI only enforces that they stay single-sourced.

**Single build job, event-gated tail.** PR and push-to-main execute the identical `build` job (checkout, Node pin, `npm ci`, guard suite, generator + `astro build`, drift guard, no-committed-output guard, the build-aware validators against `dist`). The only difference is the tail: `upload-pages-artifact` carries `if: github.event_name != 'pull_request'`, and the entire `deploy` job carries the same guard plus `needs: build`. So a green PR is a faithful predictor of the deploy build; there is no second build recipe to drift.

**Inputs the caller passes:** `node-version` (default `24`), `working-directory` (default `site`), `build-cmd` (default `npm run build`, which MUST run the generator then `astro build`), `base-literal` (the repo's Pages base segment, used only by the base single-source guard), and `generated-content-mode` (`committed` triggers the drift diff; `gitignored` triggers the ignored-output assertion).

**Triggers, concurrency, permissions.** The reusable workflow is `on: workflow_call` only; the caller owns triggers (`pull_request`, `push`, `workflow_dispatch` on `main`). Path filters are intentionally not applied to the deploy trigger: several repos generate from `library.json` + `skills/` outside `site/`, so a generator-input change must still rebuild. The deploy job uses concurrency group `pages-${{ github.ref }}` with `cancel-in-progress: false` (never interrupt an in-flight production deploy); the PR build can use a separate group with `cancel-in-progress: true`. Permissions are least-privilege: `contents: read` at workflow scope; `pages: write` + `id-token: write` only on the deploy job.

## 2. The workflow (reference)

```yaml
# ---- shared reusable workflow: .github/workflows/astro-site.yml (in product-on-purpose/.github) ----
name: astro-site
on:
  workflow_call:
    inputs:
      node-version:           { type: string, default: "24" }
      working-directory:      { type: string, default: "site" }
      build-cmd:              { type: string, default: "npm run build" }
      base-literal:           { type: string, required: true }   # e.g. "/pm-skills"
      generated-content-mode: { type: string, default: "gitignored" } # gitignored|committed

permissions:
  contents: read

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ${{ inputs.working-directory }}
    steps:
      - uses: actions/checkout@v5
        with: { fetch-depth: 0 }

      - uses: actions/setup-node@v5
        with:
          node-version-file: ${{ inputs.working-directory }}/../.nvmrc   # read the pin, never hardcode
          cache: npm
          cache-dependency-path: ${{ inputs.working-directory }}/package-lock.json

      - name: Node pin guard          # engines + .nvmrc agree with the input
        run: node scripts/ci-checks.mjs node-pin --expect "${{ inputs.node-version }}"

      - run: npm ci

      - name: Guard suite             # one shared entrypoint from the preset
        env:
          BASE_LITERAL: ${{ inputs.base-literal }}
          GEN_MODE: ${{ inputs.generated-content-mode }}
        run: node scripts/ci-checks.mjs all

      - name: Build site              # generator THEN astro build (build-cmd encodes both)
        run: ${{ inputs.build-cmd }}

      - name: Build-aware validators  # against dist (links, anchors, routes, edit-links)
        env:
          BASE_LITERAL: ${{ inputs.base-literal }}
          STRICT_ANCHORS: "1"
        run: node scripts/ci-checks.mjs dist

      - name: Generated-content drift guard
        if: inputs.generated-content-mode == 'committed'
        run: git diff --exit-code -- src/content/ || (echo 'Generated content drift: re-run the generator and commit.' && exit 1)

      - name: No committed build output
        working-directory: .
        run: |
          tracked=$(git ls-files 'site/dist/**' '**/.astro/**' 'site/sitemap*.xml' 'dist/**' || true)
          if [ -n "$tracked" ]; then echo "Build output committed:"; echo "$tracked"; exit 1; fi

      - name: Upload Pages artifact    # push-to-main only
        if: github.event_name != 'pull_request'
        uses: actions/upload-pages-artifact@v5
        with:
          path: ${{ inputs.working-directory }}/dist

  deploy:
    needs: build
    if: github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    permissions: { contents: read, pages: write, id-token: write }
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5

# ---- per-repo caller: each repo's .github/workflows/site.yml (entire file) ----
# name: Site
# on: { pull_request: { branches: [main] }, push: { branches: [main] }, workflow_dispatch: {} }
# jobs:
#   site:
#     uses: product-on-purpose/.github/.github/workflows/astro-site.yml@v1
#     with: { working-directory: "site", build-cmd: "npm run build", base-literal: "/pm-skills", generated-content-mode: "gitignored" }
#     permissions: { contents: read, pages: write, id-token: write }
```

## 3. Required checks

Portable where possible (Node `scripts/ci-checks.mjs`, shared from the preset, so one implementation runs identically on Windows and Linux). The "live status" column reflects the 2026-06-02 audit.

| Check | Purpose | Sev | Live status |
|---|---|---|---|
| **PR site build verification** | The same build recipe the deploy job runs, event-gated to skip artifact/deploy, so a green PR predicts a green deploy. | error | Present in all four on the shipped branch (pm-skills, tfs, askit; wsl on its branch). |
| **Generated-content drift guard** | `committed` mode: `git diff --exit-code` on the generated tree. `gitignored` mode: assert the output dir is git-ignored and `git ls-files` returns nothing for it. | error | Satisfied: pm-skills/tfs/wsl-branch gitignored-rebuilt; askit catalog via `tests/catalog-coverage.test.mjs`; tfs `recommendable.* --check`. |
| **Base-path single-source guard** | `git grep -nF "$BASE_LITERAL"` outside `astro.config.mjs` (excluding `node_modules`, `dist`, validators that import the base). Any hit fails. | error | Would catch pm-skills' `check-rendered-links.mjs:28` duplicate (the one live 14.7 violation). |
| **No-committed-build-output guard** | `git ls-files` against `site/dist/**`, `**/.astro/**`, `site/sitemap*.xml`, `dist/**`. Any match fails. | error | All four pass; this guard locks it in. |
| **No-config-sidecars guard** | Fail on any tracked `*.{mjs,json,ts,yml}.md` sidecar beside config/generators. | error | Would catch thinking-framework-skills' 7 sidecars (the one live 14.10 violation). |
| **Em/en-dash check** | Scan authored content + generator source for U+2014/U+2013. Donor: agent-skills-toolkit `no-dashes.mjs`. | error | askit has it (U10); wsl has it only as a pre-commit hook (not CI); spread via the suite. |
| **Node-version pin check** | `engines.node` satisfies `>=22.12.0`, `.nvmrc`/`.node-version` reads `24`, and the `setup-node` input matches `.nvmrc`. | error | Value correct everywhere; mechanism drift (hardcoded `node-version`) in askit (3 jobs), tfs (`check` job), pm-skills (1 workflow). |
| **Internal-content leak check** | After build, fail if any `dist` path matches `*internal*` or an agreed private marker. Donor: agent-skills-toolkit. | error | askit + pm-skills gate on this; spread to all four. |
| **Stock-docsLoader / Pattern S guard** | Assert `site/src/content/docs` is non-empty, `content.config` calls `docsLoader()` with no path argument, and repo-root `docs/` is not referenced by any Astro config. | error | Locks Pattern S in once wsl merges. |

## 4. Link and route integrity (clause 14.11): the four build-aware validators

These are the payload that fixes the one live-harm gap (three siblings can ship broken links / lost routes undetected). They run in the `build` job against `dist`, so they gate PRs. Shipped from the preset, parameterized by `base` and edit-base-URL; pm-skills is the donor.

| Validator | What it guards | Parameterization | Notes |
|---|---|---|---|
| `check-rendered-links` | Every internal href in `dist/*.html` resolves to an emitted route; every `#anchor` resolves to a real element id (enforcing via `STRICT_ANCHORS=1`). | `BASE` lifted out of the inline const. | Hard-fail on empty-but-existing `dist`. |
| `check-route-parity` | No previously published URL disappears without a redirect, against a committed `route-manifest.txt`. | base-agnostic; only the manifest is per-repo. | Presence-only by design (a route that regresses to a stub passes); document the limitation in the header. |
| `verify-edit-links` | Every Starlight edit link resolves to a real source path (carries the `/site/` segment under Pattern S). | edit-base-URL lifted out of the inline const. | Catches the tfs `editLink` `/site/` question. |
| `remark-resolve-links` | The generator emits Starlight-correct slug links at build time (an mdast transform), so there is no post-build HTML rewriter to drift. | base passed as plugin option. | `.md` via `markdown.remarkPlugins`; `.mdx` needs the transform inside `@astrojs/mdx` too (the writing-style-catalog gotcha). |

**Guard robustness is normative (clause 14.11).** A guard MUST decode defensively (an unguarded `decodeURIComponent` on a `%` fragment crashed pm-skills' entire rendered-link check), fail on its own assertions rather than on a parse error, accept single and double quotes in the id regex so a future markdown plugin cannot turn a real anchor into a false failure, and hard-fail an empty `dist` (symmetric with route-parity). A guard that crashes on a content typo is worse than no guard: it turns a typo into an opaque CI red far from its cause.

## 5. Reusable-workflow gotchas (carry into execution)

- Caller workflow-level `env` does NOT propagate to the callee; move `STRICT_ANCHORS` and similar into inputs or step-level `env`.
- Artifacts are not auto-shared across jobs; keep build + validators in ONE job so `dist` stays on the runner (do not split and shuttle).
- `GITHUB_TOKEN` permissions only downgrade down the `workflow_call` chain; declare what the deploy job needs at the caller.
- `.md` vs `.mdx`: Astro configures remark/rehype separately for `.md` (top-level `markdown.remarkPlugins`) and `.mdx` (inside `@astrojs/mdx`). writing-style-catalog carries extra mdx + remark-gfm, so its caller needs an mdx/remark passthrough or its MDX links are not rewritten.
- Do NOT fold a repo's bespoke matrix into the shared workflow: pm-skills' dual-OS shell-validator matrix and agent-skills-toolkit's `scripts/check.mjs` conformance gate stay as separate repo-specific jobs running alongside the shared site workflow. The shared workflow covers the site; the repo job covers skill conformance.

## 6. Rollout (no flag day)

1. **Step 0 (prereq).** Create the reusable workflow in `product-on-purpose/.github`, tag `@v1` (moving major tag so callers pin `@v1` and pick up patches). Land `scripts/ci-checks.mjs` in `@product-on-purpose/astro-docs-preset`, seeded from donors (agent-skills-toolkit `no-dashes.mjs` + internal-exclusion; pm-skills `check-rendered-links.mjs` + `verify-edit-links.mjs` + `check-route-parity.mjs`). Lift `BASE` / edit-base-URL out of the inline consts (this is the one piece of new work, not lift-and-shift; do it in pm-skills first, the donor, with a test).
2. **Pilot on thinking-framework-skills** (cleanest: already Pattern S, pure Node, branded). It gains the four guards it lacks. Run the new caller alongside its existing workflow as a non-required check for >=3 PRs + 1 main deploy, confirm parity, then make the new build job required and retire the old.
3. **agent-skills-toolkit** second. Its deploy drift (stale `checkout`/`setup-node` majors, hardcoded `node-version`) is normalized by the shared workflow's `node-version-file` step; keep its `scripts/check.mjs` conformance gate as a separate job.
4. **writing-style-catalog** third, after its Pattern S branch merges (A-6 confirmed). This is where the `.md` vs `.mdx` remark passthrough proves out.
5. **pm-skills** last (highest blast radius: redirects map, samples sidebar, the four validators it donates). Confirm the base single-source extraction landed first.
6. After all four are green on the shared workflow, record the registry-promotion trigger for the preset and proceed to land `STANDARD.md` Section 14.

Throughout: each repo keeps its old workflow until the shared one is green on at least 3 PRs and one main deploy; only then delete the old file and mark the shared build job a required status check. Because callers pin `@v1`, later refinements ship to all four by moving the `v1` tag, with `@<sha>` available to hold any repo back.
