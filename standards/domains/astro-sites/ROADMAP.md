# Astro site standard: roadmap

> The sequenced plan to finish convergence, build the shared infrastructure, add the features that make adoption durable, and land the standard as `STANDARD.md` Section 14. Grounded in the 2026-06-02 audit ([`../../../docs/internal/audits/2026-06-02_astro-implementation.md`](../../../docs/internal/audits/2026-06-02_astro-implementation.md)). Status verbs: NOW (do next), NEXT (after its dependency), LATER (sequenced behind the infra), FUTURE (idea, not yet committed).

## Where the family stands

The hard part is done. Both original High-severity drift findings are closed, **all four sites are Pattern S on `main`**, and **all four per-repo conformance sessions have landed** (pm-skills #160, thinking-framework-skills #30, agent-skills-toolkit #83, writing-style-catalog #11+#12). No repo commits build output; all set `site`, deploy via `@v5`, pin `.nvmrc=24`, and ship a favicon. The roadmap is now alignment, not rescue: consolidate the per-repo guards into the shared infra, and formalize the standard.

**Update (post-rollout):** three of the four repos (askit, pm-skills, wsl) implemented the 14.11 link/route guards **locally** rather than deferring, and were right to - the shared workflow is unbuilt, 14.11 is a MUST, and the local guards caught real shipped breakage (a family-wide favicon 404; sixteen live 404s in wsl). Only thinking-framework-skills deferred; its follow-up (add the two local bridge guards now) is open in its [packet](rollout/thinking-framework-skills.md). So the highest-value item is no longer "carry the guards to repos that lack them" - it is **consolidating the now-three local guard ports into one shared, hardened validator** so they stop drifting, and adding tfs's. The per-repo reviews hardened the donor guard (bare-relative resolution, quote symmetry, defensive decode, CLI `argv` null-check); extract the shared validator from the FIXED agent-skills-toolkit versions, not the raw pm-skills donor.

## Phase 0 - Close the P1s (NOW, independent, days)

These are correctness/conformance items with no dependency on the shared infra. Each is one PR in its own repo.

| # | Repo | Action | Acceptance |
|---|---|---|---|
| ~~0.0~~ | writing-style-catalog | ~~Merge the Pattern S branch~~ | **DONE (PR #11).** `main` is Pattern S; Python site generator gone; deploy uploads `site/dist`. Residual P2 (mermaid branding, CI dash check) closed in PR #12. |
| ~~0.1~~ | thinking-framework-skills | ~~Delete the 7 `.md` config/data sidecars~~ | **DONE (PR #30).** Sidecars deleted; rationale consolidated into `AUTHORING.md` + generator headers. (14.11 deferred; follow-up open - see Update above.) |
| ~~0.2~~ | pm-skills | ~~Extract the base literal to one source + wrong-base-fails test~~ | **DONE (PR #160).** `scripts/site-base.mjs` single-sources the base; 5-case test; robots.txt + accent + Astro 6.4.2 also landed. |
| ~~0.3~~ | agent-skills-toolkit | ~~Modernize deploy majors + `node-version-file`~~ | **DONE (PR #83).** `@v5` actions + `node-version-file`; also branded mermaid, shipped the favicon, and ported two 14.11 guards (ADR 0026). |

Phase 0 is parallelizable across repos. It leaves four fully per-repo-conformant sites (wsl already shipped via #11, tfs sidecar-free, pm-skills base single-sourced, askit on the current toolchain). Each repo's work is dispatched by its packet in [`rollout/`](rollout/README.md) (scorecard + corrections + checklist + a kickoff prompt to run in that repo's working directory).

## Phase 1 - Build the shared CI workflow + validators (NEXT, the high-value infra)

Depends on Phase 0.3 (the base single-source extraction is the one piece of genuinely new work). Full design in [`ci-standard.md`](ci-standard.md).

1. **1.1** Create `product-on-purpose/.github` `.github/workflows/astro-site.yml` (`workflow_call`); tag `@v1` (moving major tag).
2. **1.2** Land `scripts/ci-checks.mjs` + the four parameterized validators in the preset package skeleton (see Phase 2). Seed from the **FIXED agent-skills-toolkit versions** (`agent-skills-toolkit/site/scripts/`), which already carry the rollout-hardened fixes (bare-relative resolution, both quote styles, defensive decode, the CLI `argv[1]` null-check), plus askit `no-dashes.mjs` (`.py` + code-point detector) and internal-exclusion; take `remark-resolve-links` from pm-skills. Use the `site-base.mjs` base extraction (pm-skills / wsl) as the reference for the `BASE` / edit-base-URL parameterization. Bake in the CI build-outcome gate and the deploy-build guarding (ci-standard section 4).
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
wsl Pattern S merge (PR #11) ............ DONE
Phase 0 (close P1s, parallel)
   |
   +--> 0.2 pm-skills base single-source ---> Phase 1 (reusable workflow + validators)
   |                                                |
   +--> 0.1 / 0.3 converged ----------------------> Phase 2 (shared preset)  [needs all four converged]
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
