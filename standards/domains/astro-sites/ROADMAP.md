# Astro site standard: roadmap

> The sequenced plan to finish convergence, build the shared infrastructure, add the features that make adoption durable, and land the standard as `STANDARD.md` Section 14. Grounded in the 2026-06-02 audit ([`../../../docs/internal/audits/2026-06-02_astro-implementation.md`](../../../docs/internal/audits/2026-06-02_astro-implementation.md)). Status verbs: NOW (do next), NEXT (after its dependency), LATER (sequenced behind the infra), FUTURE (idea, not yet committed).

## Where the family stands

The hard part is done. Both original High-severity drift findings are closed, three of four sites are Pattern S on `main`, and the fourth has Pattern S staged on a branch. No repo commits build output; all set `site`, deploy via `@v5`, and pin `.nvmrc=24`. The roadmap is therefore short on rescue and long on alignment: close three P1s, build the shared infra that carries the link/route guards to the siblings, and formalize the standard.

The single highest-value item is not a clause; it is **carrying pm-skills' four build-aware validators to the three siblings that lack them**, because that is the only place a real failure (a shipped broken link or a lost route) can happen today undetected.

## Phase 0 - Close the P1s (NOW, independent, days)

These are correctness/conformance items with no dependency on the shared infra. Each is one PR in its own repo.

| # | Repo | Action | Acceptance |
|---|---|---|---|
| 0.1 | writing-style-catalog | Confirm A-6 = migrate (ADR 0011 already amended on the branch); merge `refactor/astro-pattern-s-convergence` to `main`. | `main` is Pattern S; Python generator gone; `astro build` green; `git ls-files` shows no build output; deploy uploads `site/dist`. |
| 0.2 | thinking-framework-skills | Delete the 7 `.md` config/data sidecars; fold any rationale into config comments or one docs page. | `git ls-files \| grep -E '\.(mjs\|json)\.md$'` is empty; site still builds. |
| 0.3 | pm-skills | Extract the base literal to one source (e.g. `scripts/site-base.mjs`) imported by `astro.config.mjs` and `check-rendered-links.mjs`; land with a test that a wrong base fails the check. | `git grep -nF "/pm-skills"` shows the literal only in the single source; rendered-link check still green. |
| 0.4 | agent-skills-toolkit | Modernize deploy: `checkout@v5` + `setup-node@v5` with `node-version-file: .nvmrc` (drop the hardcoded `node-version: "24"`). | All site jobs read `.nvmrc`; deploy green. |

Phase 0 is parallelizable across repos. It leaves four fully per-repo-conformant sites (wsl merged, tfs sidecar-free, pm-skills base single-sourced, askit on the current toolchain). Each repo's Phase 0 work is dispatched by its packet in [`rollout/`](rollout/README.md) (scorecard + corrections + checklist + a kickoff prompt to run in that repo's working directory).

## Phase 1 - Build the shared CI workflow + validators (NEXT, the high-value infra)

Depends on Phase 0.3 (the base single-source extraction is the one piece of genuinely new work). Full design in [`ci-standard.md`](ci-standard.md).

1. **1.1** Create `product-on-purpose/.github` `.github/workflows/astro-site.yml` (`workflow_call`); tag `@v1` (moving major tag).
2. **1.2** Land `scripts/ci-checks.mjs` + the four parameterized validators in the preset package skeleton (see Phase 2), seeded from donors (askit `no-dashes.mjs` + internal-exclusion; pm-skills `check-rendered-links` + `verify-edit-links` + `check-route-parity` + `remark-resolve-links`). Lift `BASE` / edit-base-URL into parameters.
3. **1.3** Pilot the caller on **thinking-framework-skills** (cleanest). It gains the four link/route guards. Run alongside the existing workflow as a non-required check for >=3 PRs + 1 main deploy, confirm parity, then make it required and retire the old.
4. **1.4** Roll to **agent-skills-toolkit** (its `node-version` mechanism drift normalizes for free), then **writing-style-catalog** (proves the `.md` vs `.mdx` remark passthrough), then **pm-skills** last (it donates the validators; confirm parity).

Exit criterion: all four siblings run the same build-aware link/route guards on every PR. The cross-family link/route blind spot is closed.

## Phase 2 - Extract the shared preset (LATER, from a converged baseline)

Depends on Phase 0 (so it is extracted from a converged, not moving, target). Full spec in [`shared-preset-spec.md`](shared-preset-spec.md).

1. **2.1** Create `product-on-purpose/astro-docs-preset` (plain ESM, no build step): `defineDocsConfig()`, `docsSchemaShared()`, `accent.css`, `editLinkFor(repo)`, and re-export the `ci-checks.mjs` + validators from Phase 1. `peerDependencies` pin the resolved Astro/Starlight/mermaid matrix (closing the 6.3.3-vs-6.4.2 drift). Self-test fixture; tag `v0.1.0`.
2. **2.2** Distribute via **git-tag dependency** (Option A); record the registry-promotion trigger.
3. **2.3** Migrate the sites in order (tfs, askit, wsl, pm-skills). Each adopts branded mermaid + the shared accent (askit and wsl gain branding; pm-skills gains the accent it lacks), `docsSchemaShared()`, and the default `og:image`. pm-skills also gains `robots.txt`.

Exit criterion: each `astro.config.mjs` is thin config + content; branding, SEO, schema, and base discipline are single-sourced.

## Phase 3 - Land the standard (LATER, formalization)

Depends on Phases 0-2 having proven the clauses against reality (a clause MUST NOT be ratified from a non-conforming exemplar).

1. **3.1** Land `STANDARD.md` Section 14 (clauses 14.1-14.11) via the serialized amendment process ([`../../GOVERNANCE.md`](../../GOVERNANCE.md) Section 5): one PR on the protected branch with the text, one version bump, one ADR, and the CHANGELOG/RELEASE-NOTES entries. Section 14.1 supersedes the pending `proposed-standard-site-layout-clause.md`; 14.10 aligns with the anti-sidecar legibility clause.
2. **3.2** Each plugin re-adopts by bumping its `library.json` `standard` field on its own cadence (note: pm-skills and writing-style-catalog still need a `library.json` to pin the Standard at all - that is a prerequisite tracked in `standards-plan.md`).
3. **3.3** Surface each plugin's `standard` + a site-conformance signal in the marketplace registry.

## Phase 4 - Features and hardening (FUTURE, not yet committed)

Ideas that make the standard more valuable or close known limitations. None is blocking; each needs its own go/no-go.

| Feature | Problem it solves | Notes |
|---|---|---|
| **Templated `og:image` card** | `og:image` is a SHOULD that no site ships because no one wants to hand-roll a throwaway asset. | The preset templates a card per-site from accent + title at build time, so no maintainer-supplied brand asset is needed. Satisfies 14.9 family-wide in one bump. |
| **Route-parity content-hash / stub detection** | Route-parity is presence-only: a route that keeps its path but regresses to a stub or empty page passes today. | Add an optional content-hash or stub-detection pass for the "page silently became a stub" class. Opt-in; keep the redirect escape hatch. |
| **Site-conformance check in the spine** | Conformance is verified ad hoc (this audit). | A `scripts/check-site.mjs` (or a preset module) that asserts the 14.x clauses a repo can self-check (Pattern S loader, no committed build output, base single-source, no sidecars, node-pin mechanism), runnable locally and in CI, so conformance is continuous, not a one-time audit. |
| **`starlight-versions` adoption** | No multi-version doc archive yet (deferred at tfs v0.1 because it needs a real prior snapshot). | Adopt when a site has a genuine prior version to archive; revisit per-repo. |
| **Generated-content provenance footer** | A reader cannot tell a generated page from a hand-authored one. | A small "generated from `<source>`, do not edit" banner the generator emits, driven by the `generated`/`source` frontmatter the schema already carries. |
| **Link check across siblings** | Cross-plugin links (one site linking to another) are unguarded. | A periodic external-link / cross-site check, out of the per-repo PR gate (it depends on sibling deploy state), run on a schedule against the live sites. |
| **`.node-version` companion everywhere** | Some tools read `.node-version`, not `.nvmrc`. | Commit both (askit already does) so every toolchain resolves the pin; or standardize on one and document it. |

## Dependency graph (text)

```
Phase 0 (close P1s, parallel)
   |
   +--> 0.3 base single-source ---> Phase 1 (reusable workflow + validators)
   |                                     |
   +--> 0.1 wsl merge -----------------> Phase 2 (shared preset)  [also needs 0.* converged]
                                              |
                                         Phase 3 (land Section 14) ---> re-adopt via library.json
                                              |
                                         Phase 4 (features, each independent)
```

## Risks to carry

- **The base single-source extraction is delicate** (Phase 0.3): a wrong base passes the rendered-link check while the live site 404s, so it lands with a test, in the donor (pm-skills), before the validators are parameterized for siblings.
- **`.md` vs `.mdx` remark divergence** (writing-style-catalog): a preset/workflow injecting only into `markdown.remarkPlugins` covers `.md` but not `.mdx`; wsl's mdx+gfm pipeline needs the transform inside `@astrojs/mdx` too, or its MDX links are not rewritten.
- **Reusable-workflow env does not propagate** to the callee; move `STRICT_ANCHORS` and similar to inputs. Keep build + validators in one job (artifacts are not auto-shared).
- **Do not over-centralize:** the per-repo generator, redirects map, sidebar, route manifest, and each repo's bespoke validator/conformance matrix stay local. The preset owns invariants; the workflow owns the build/deploy contract; neither owns the generator.
- **Land from a conforming exemplar only** (Phase 3): if any clause's reference repo regresses, fix it before landing that clause.
