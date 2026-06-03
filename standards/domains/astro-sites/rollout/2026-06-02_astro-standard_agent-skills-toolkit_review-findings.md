# Astro site rollout - adversarial review findings (agent-skills-toolkit)

> Date: 2026-06-02. Scope: the agent-skills-toolkit (askit) Astro site conformance work that closed
> clauses 14.2 (mermaid branding), 14.6/14.8 (node-version-file + `@v5` actions), and 14.11 (link
> and route integrity). See askit `docs/internal/decisions/0026-astro-site-14.11-conformance.md` and
> `docs/internal/release-plans/astro-starlight-conformance/`.
>
> This file records what an adversarial review found, what was done about it, and the cross-cutting
> learnings. Most of the learnings are NOT askit-specific: they apply to the pm-skills donor guards,
> to the sibling rollouts (thinking-framework-skills, writing-style-catalog), and to the shared
> reusable workflow + preset that ROADMAP Phase 1 will build. Treat the "Family learnings" section as
> input to that shared infrastructure.

## How the review was run

After the implementation passed locally (build green, full unit suite green, conformance gate 0/0),
a multi-agent adversarial review ran across four dimensions, and every blocker/major finding was
handed to a second agent told to refute it before it was actioned:

1. **Clause conformance** - does the change set genuinely satisfy 14.2/14.6/14.8/14.9/14.11, and is
   anything (14.5 build output, 14.7 base) regressed?
2. **Guard correctness** - adversarial bug hunt on the two ported guards and their tests.
3. **CI semantics** - workflow correctness (node-version-file resolution, `if:` conditions, YAML).
4. **House style and docs** - no em/en dashes (U10), ADR format, internal consistency.

The verification step mattered: it confirmed the two real defects below and downgraded several
speculative ones, so effort went to genuine fixes rather than churn.

## Findings and follow-up

| # | Severity | Finding | Status | Fix |
|---|---|---|---|---|
| F1 | Blocker | The favicon fix was untracked in git, so a clean CI checkout would 404 the favicon on every page and the enforcing guard would go red. | Fixed | Stage `site/public/favicon.svg` (and the other new files) and verify with `git ls-files` before declaring done. Not a code defect - a commit-hygiene trap. |
| F2 | Major | The rendered-link guard silently skipped bare-relative hrefs (`getting-started/`, `x.html` with no leading `./` or `/`). A broken bare-relative link on a deep page passed with exit 0. | Fixed | Resolve every non-external, non-anchor href via `new URL()` (dropped the `./`/`../`/base/host-root-only classification). Added 3 regression tests. |
| F3 | Minor | The href scanner regex was double-quote-only, while id extraction matched both quote styles; a single-quoted broken href was invisible. | Fixed | `/href=(?:"([^"]+)"|'([^']+)')/g` with `m[1] ?? m[2]`. Regression test added. |
| F4 | Minor | Percent-encoded path segments were matched literally against decoded on-disk names (false positive for `my%20page/`). | Fixed | Defensive `decodeURIComponent` of the path in `existsInDist`/`distFileFor`, mirroring the fragment decode. |
| F5 | Minor | `if: always()` on the guard steps runs them even on a failed build (surfacing "dist not found" instead of the real Astro error) and on cancellation. | Fixed | Gate both on the build step outcome: `if: ${{ !cancelled() && steps.build.outcome == 'success' }}`. Both guards still run independently of each other. |
| F6 | Nit | Docs mixed "six pages" and "seven pages" for the same site. | Fixed | Clarified once: six authored content pages, seven rendered routes including the auto-generated 404. |
| F7 | Nit | New CHANGELOG/STATUS ADR references omitted a descriptive title. | Fixed | Added a short title to the new ADR 0026 references (the maintainer's ADR-reference convention). |
| F8 | Nit | `urlOf` maps a top-level non-index `.html` (404.html) to a pretty URL that differs from its served URL. | Left as-is | Self-consistent within the tool (existsInDist maps it back) and 404 uses base-absolute links; kept faithful to the donor. Noted for the shared validator. |

All fixes verified: site build green, `npm test` 211/211 (16 guard cases), conformance gate 0/0
(including U10 no-dashes), and the fixed guard still passes the real `dist` (0 broken links, 0 broken
anchors) without surfacing false positives on the real `../`-relative and bare-relative links.

## Family learnings (apply to the donor, the siblings, and the shared infra)

- **L1 (donor guard gap, the important one).** The pm-skills `check-rendered-links.mjs` classifies a
  href as relative only when it starts with `./` or `../`; a bare-relative href is skipped entirely.
  pm-skills passes because its generator emits base-absolute links, so the gap is invisible there.
  But any HAND-AUTHORED Starlight site emits bare-relative hrefs verbatim - hero actions
  (`link: getting-started/`), `Card`/`LinkCard`/`LinkButton` - so the guard would silently pass a
  broken one. askit, thinking-framework-skills, and writing-style-catalog are all hand-authored to
  some degree. **Fix the donor (and the shared validator) to resolve every non-external, non-anchor
  href via `new URL(clean, pageUrl)`, not just `./`/`../`.** This is consistent with 14.11's "guard
  robustness is itself normative": a guard that claims full coverage while skipping a reachable class
  is worse than no guard.
- **L2 (quote symmetry).** Match hrefs with both quote styles, symmetric with id extraction. A
  rehype plugin or raw MDX HTML can emit single-quoted attributes.
- **L3 (defensive path decode).** Decode percent-escapes in the resolved path before the filesystem
  lookup (wrapped in try/catch), mirroring the fragment decode. Harmless for ASCII kebab slugs,
  correct for encoded ones.
- **L4 (the favicon 404 is family-wide).** Starlight emits `<link rel="icon"
  href="{base}/favicon.svg">` on EVERY page unconditionally. A site that ships no favicon serves a
  live 404 on every page - a real 14.9 defect that a static file audit misses but the rendered-link
  guard catches immediately. pm-skills ships `site/public/favicon.svg` (a neutral family mark: three
  `#5C7CFA` diamonds); askit now reuses it verbatim. **The shared preset should own this favicon as a
  family default; until it lands, every site must ship the file. Check thinking-framework-skills and
  writing-style-catalog for the same latent 404.** This is the cleaner argument than the earlier
  "skip the favicon like og:image" stance: og:image has no emitted reference, so its absence is a
  clean no-op; a favicon reference is always emitted, so its absence is a broken link.
- **L5 (CI condition).** Prefer gating guard steps on the build step's own outcome
  (`!cancelled() && steps.build.outcome == 'success'`) over `if: always()`. `always()` masks the real
  build error with a secondary "dist not found" and runs on cancellation. The outcome gate keeps the
  "both guards report independently" property while surfacing the true failure. Bake this into the
  reusable workflow.
- **L6 (node-version-file resolution, confirmed correct).** `actions/setup-node`'s
  `node-version-file` resolves relative to the repo root (`GITHUB_WORKSPACE`), NOT a job's
  `defaults.run.working-directory: site`. So one repo-root `.nvmrc` feeds the root-wd `validate` job
  and the site-wd `build`/`build-site` jobs alike. No per-job path juggling.
- **L7 (process: build-aware guards earn their keep on day one).** The strict rendered-link guard
  caught the favicon 404 on its first real run - a defect the prior static audit had marked "no
  favicon override (minor)". Run the guards against a real build during every rollout, with
  `STRICT_ANCHORS=1` for small hand-authored sites, before calling conformance done.
- **L8 (commit hygiene for guard inputs).** An enforcing guard that depends on a committed input (the
  favicon source, the route-manifest) goes red on a clean CI checkout if that input is left
  untracked. After generating such files, verify they are tracked (`git ls-files`, or inspect
  `git archive HEAD`) - working-tree green is not checkout green.

## Recommendations

- **For ROADMAP Phase 1 (shared reusable workflow + validators):** fold L1, L2, L3, L5 into the
  shared `check-rendered-links` before extraction; ship the family favicon (L4) and the build-outcome
  CI condition (L5) in the preset/workflow defaults; consider F8 (the `urlOf` 404 mapping) when
  hardening the validator.
- **For the sibling rollouts (thinking-framework-skills, writing-style-catalog):** when porting the
  guards, start from the FIXED askit versions (`agent-skills-toolkit/site/scripts/`), not the raw
  pm-skills donor; check each for the favicon 404; generate each route-manifest from a clean build and
  commit it; run `STRICT_ANCHORS=1` on the first build.
- **For the standard text (14.11), optional clarification:** state that the rendered-link validator
  MUST resolve bare-relative hrefs (not only `./`/`../`-prefixed) and SHOULD match both attribute
  quote styles, since hand-authored Starlight sites emit both. These are robustness clarifications in
  the spirit of the existing "guard robustness is itself normative" sentence, not new requirements.
