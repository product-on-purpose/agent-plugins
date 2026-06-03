# Shared docs preset spec: `@product-on-purpose/astro-docs-preset`

> Companion to [`SITE-STANDARD.md`](SITE-STANDARD.md) decision A-2. Promoted and refined from `_LOCAL/astro/shared-preset-spec.md`. The package that turns each site into thin config + content, owns the family branding/SEO invariants, and ships the four build-aware validators.
>
> **What changed from the draft:** the factory name is settled as `defineDocsConfig` (not `popDocs`); distribution follows Option A (a git-tag dependency now, registry publish deferred behind a written trigger); and the preset's scope is extended to ship the link/route validators (clause 14.11) as parameterized modules, since the audit showed those are the highest-value shared payload.

## 1. What it is

A small, internal, build-time-only ESM package (plain ESM, no build step, matching the family generator standard). It does NOT ship as an Astro integration; it exports plain config-factory functions plus static assets, a schema module, and the shared CI/validator entrypoint, which each site's `astro.config.mjs`, `content.config.ts`, and CI import and call. The site stays in charge of what is genuinely per-site (title, `base`, `sidebar`, content source, redirects, `head`) and passes those in. Because the preset is consumed only at build time (never shipped to end users), the self-containment constraint that forces vendoring for skills does NOT apply: importing it is correct, vendoring it is the anti-pattern.

The package depends on `astro`, `@astrojs/starlight`, and `astro-mermaid` as `peerDependencies`, so all sites resolve one shared version matrix and the preset never pins a second copy.

## 2. Exports

| Export | Kind | Purpose |
|---|---|---|
| `defineDocsConfig(siteOptions)` | config factory | Takes `{ base, title, description, repo, sidebar, head?, components?, markdown?, redirects?, extraIntegrations?, mermaidThemeVariables? }` and returns the full object to spread into Astro's `defineConfig()`. Hardwires the family invariants: `site: 'https://product-on-purpose.github.io'`; the integrations array with `mermaid({ theme:'default', autoTheme:true, mermaidConfig:{ themeVariables:{ lineColor:'#5C7CFA', fontFamily:'system-ui,...', fontSize:'14px' } } })` placed BEFORE `starlight()`; and `starlight()` wired with the shared `customCss` path, `editLink.baseUrl` derived from `repo` (carrying the `/site/` segment under Pattern S), Pagefind, and a `head` entry with the default `og:image`. `extraIntegrations` is appended AFTER starlight (for `@astrojs/mdx`, preserving the expressive-code-before-mdx order). Eliminates the per-site duplication of site origin, integration ordering, mermaid theme, and editLink shape. |
| `docsSchemaShared(extend?)` | schema factory | Wraps `@astrojs/starlight/schema` `docsSchema()` and extends it with the superset of optional frontmatter fields the family generators emit (the union of the pm-skills ~24-field and thinking-framework-skills 8-field extensions: `generated`, `source`, `version` (string\|number), `updated`/`created`/`date` (string\|Date), `draft`, `tags`, `artifact`, `status`, `phase`, `classification`, `license`, `metadata`, `family`, `evidence_tier`, `skill_id`, `skill_name`, ...). Accepts an optional `extend` for truly site-unique fields. Replaces the two divergent `z.object()` extensions and gives the two stock-loader sites (toolkit, writing-style-catalog) the same validated surface for free. |
| `./styles/accent.css` | static CSS asset | The brand layer: the `--sl-color-accent` triplet (`#5C7CFA` with low/high companions) + shared mermaid SVG polish (`.mermaid` width/stroke/node radius/cluster fill) + quiet `<details>` styling. A site lists it first in `customCss` and MAY append its own bespoke CSS after. Centralizes the accent (and gives pm-skills, which sets none, the family accent) and the mermaid polish. |
| `defineDocsConfig` constants: `FAMILY_SITE_URL`, `editLinkFor(repo)` | constant + helper | The canonical origin and the GitHub edit-URL shape declared once, so no site re-hardcodes the origin or the `/edit/main/site/` pattern. Sites still own their own `base` (repo-specific). |
| `./ci/ci-checks.mjs` (+ the four validators) | CI module | The portable guard suite (`node ci-checks.mjs all` / `dist` / `node-pin`) and the four build-aware validators (`check-rendered-links` with anchor resolution, `check-route-parity`, `verify-edit-links`, `remark-resolve-links`), parameterized by `base` and edit-base-URL. The reusable workflow's `build-cmd` invokes them. Version and parameterization live in one place; see [`ci-standard.md`](ci-standard.md). |

## 3. How a site consumes it

```js
// site/astro.config.mjs after adopting the preset. Everything family-invariant
// (origin, mermaid-before-starlight, #5C7CFA theme, accent CSS, editLink shape,
// default og:image) lives in the preset. What remains is genuinely per-site.
import { defineConfig } from 'astro/config';
import { defineDocsConfig } from '@product-on-purpose/astro-docs-preset';

const GA_ID = process.env.PUBLIC_GA_ID;           // GA stays per-site (only one site injects it)
const gaHead = GA_ID ? [/* gtag tags */] : [];

export default defineConfig(
  defineDocsConfig({
    base: '/thinking-framework-skills',
    repo: 'thinking-framework-skills',             // preset derives editLink baseUrl + /site/ suffix
    title: 'Thinking Framework Skills',
    description: 'An evidence-graded library of agent-executable thinking-method skills.',
    head: gaHead,
    components: { Footer: './src/components/SiteFooter.astro' },
    sidebar: [ /* repo-specific */ ],
  })
);

// site/src/content.config.ts (Pattern S, stock docsLoader, shared schema):
import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchemaShared } from '@product-on-purpose/astro-docs-preset/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchemaShared() }),
};
// A site needing one extra field: schema: docsSchemaShared(z.object({ my_field: z.string().optional() }))
```

## 4. What it centralizes

- The site origin (`https://product-on-purpose.github.io`), declared once.
- The integration ORDERING invariant (`astro-mermaid` before `starlight`), enforced inside the factory so no site can re-break it.
- Mermaid branding (theme variables), currently in only 2 of 4 sites; the preset gives all four branded diagrams.
- The `#5C7CFA` accent + mermaid SVG polish + `<details>` styling, as one `accent.css`.
- The editLink org+URL shape (with the Pattern S `/site/` segment), replacing four hand-written `baseUrl` strings. (Per-page `editUrl` on generated pages stays a generator concern - the true source or `false`, per SITE-STANDARD "Generated-page Edit links" - the preset only sets the `editLink.baseUrl` default that hand-authored pages inherit.)
- The content frontmatter schema superset, replacing the two divergent `z.object()` extensions and giving the bare sites validation parity.
- The SEO surface the standard names (`robots.txt` policy, default `og:image`, favicon), so one bump reaches all sites.
- The shared dependency matrix (`astro`, `@astrojs/starlight`, `astro-mermaid` as `peerDependencies`), so the family pins one resolved set, not four (closing the 6.3.3-vs-6.4.2 drift).
- The CI guard suite + the four build-aware validators, parameterized, so version + parameterization live in one place.

## 5. Distribution and pinning (Option A)

Follows the family's decouple-and-pin discipline (the same logic by which the marketplace pins plugins by SHA and plugins pin the Standard by version). The audit's recommendation, adopted here:

- **Now: a git-tag dependency.** Each site pins `'@product-on-purpose/astro-docs-preset': 'github:product-on-purpose/astro-docs-preset#v0.1.0'` and commits the lockfile, so a preset change is adopted deliberately per site, never force-pushed. This is the spec's own sanctioned fallback and is the lighter of two blessed modes; the shareable mass (3-4 internal build-time consumers) does not yet justify a registry.
- **Later: registry publish, behind a written trigger.** Promote to a normal semver npm package (npm public, or GitHub Packages under the org) when a concrete trigger appears: a fourth-plus consumer, open-sourcing, or upgrade churn that makes git-tag bumps painful. Record the trigger so the deferral is a decision, not silent drift.
- **Rejected: vendoring** (copying the package into each repo), because it recreates the four-way duplication the preset exists to remove.

Upgrades are deliberate: bump the pin in one site, run that site's build + drift-check, then roll the same pin across the others (the same one-at-a-time cadence the marketplace already uses for plugin re-pins).

## 6. Migration (extract from a converged baseline)

Prerequisite: all four apps on Pattern S (so the preset can assume the stock loader) and the per-repo generators emitting Starlight-correct slug links. As of 2026-06-02 all four are Pattern S on `main` (writing-style-catalog shipped via PR #11), so this prerequisite is met; extract the preset once the per-repo P2s settle.

1. **Create the package** `product-on-purpose/astro-docs-preset`: `type: 'module'`, `engines.node >=22.12.0`, exports map for `.`, `./schema`, `./styles/accent.css`, `./ci/ci-checks.mjs`; `astro`/`@astrojs/starlight`/`astro-mermaid` as `peerDependencies` pinned to the family matrix. No em/en dashes in any emitted file.
2. **Extract the invariants** from a now-conformant config (thinking-framework-skills or agent-skills-toolkit) into `defineDocsConfig()`, `docsSchemaShared()`, and `accent.css`. Lift the four validators' `BASE` / edit-base-URL out of their inline consts into parameters (do this in pm-skills first, the donor, with a test).
3. **Self-test fixture:** one tiny page that builds against the factory, so the package has its own green build. Tag `v0.1.0`.
4. **Migrate thinking-framework-skills first** (cleanest, already branded). Replace the config body with `defineDocsConfig({...})`, swap the schema to `docsSchemaShared()`, point `customCss` at the preset asset, delete the redundant local accent block and the 7 `.md` sidecars (clause 14.10). Build, diff `dist` against pre-migration, confirm parity.
5. **agent-skills-toolkit:** collapse the config to the factory (it gains branded mermaid + shared accent it currently lacks - an intentional, reviewed visual change), swap to `docsSchemaShared()`.
6. **writing-style-catalog:** same, plus pass its `@astrojs/mdx` + `remark-gfm` through `extraIntegrations` / `markdown`, and fix the Starlight title to "Writing Style Catalog".
7. **pm-skills last** (highest blast radius: redirects, samples sidebar, the largest schema). Pass redirects + full sidebar through the factory; replace the schema with `docsSchemaShared()` (the union already covers its fields); add `robots.txt`; set the `#5C7CFA` accent via the shared CSS; confirm the base single-source extraction (the `check-rendered-links.mjs:28` duplicate) is gone.
8. After all four are green, tag the preset `v0.2.0` if any API shifted during migration and update each site's pin.

## 7. Trade-offs

**Cost:** a fifth thing to own (a version/release cadence, a `peerDependency` matrix to keep aligned on Astro/Starlight bumps, a coordination step on each toolchain bump). An indirection cost too: a contributor reading a thin `astro.config.mjs` no longer sees the full Starlight config at a glance, so the factory MUST document its invariants in-file. Migration is front-loaded, and pm-skills / writing-style-catalog carry real edge cases (redirects, the mdx+gfm pipeline, the large schema) the factory must expose as passthrough without becoming a leaky god-config.

**Benefit:** one-place fixes for everything the family treats as a standard. The accent, the mermaid-before-starlight rule, the branded mermaid theme, the editLink shape, the SEO surface, the base discipline, the frontmatter superset, and the four validators are declared once and inherited by all four sites. It enforces the invariants structurally: a site physically cannot reorder mermaid/starlight or re-hardcode a second origin if those come from the factory. The configs already drifted under copy-paste (only two of four brand mermaid; pm-skills sets no accent), so the release burden buys consistency the current approach has already failed to hold. The Option A git-tag mode keeps that burden bounded until scale justifies a registry.
