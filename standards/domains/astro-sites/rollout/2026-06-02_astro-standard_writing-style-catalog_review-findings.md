# writing-style-catalog conformance: review findings and learnings

> Companion to [`writing-style-catalog.md`](writing-style-catalog.md) (the conformance packet).
> Records what actually happened when an agent executed that packet against the live
> repo on 2026-06-02: two packet-vs-repo conflicts found during verification, the
> work performed, and an adversarial multi-agent review of the resulting diff (6
> findings confirmed, 5 refuted). Written for the standard/packet maintainers: the
> "Learnings" sections are feedback for the packet, the SITE-STANDARD, the
> ci-standard, and the shared preset. Nothing here was pushed or merged; the branch
> `chore/astro-starlight-conformance` awaits maintainer review.

## 1. What was executed

The packet listed five corrections (C1 brand mermaid, C2 fix the Starlight title,
C3 add a CI dash check, C4 add the 14.11 link/route guards, C5 optional
`.node-version`). Outcome:

- **C1 (mermaid branding):** done. Mirrors the pm-skills / thinking-framework-skills
  `mermaidConfig.themeVariables` block byte-for-byte (lineColor `#5C7CFA`, system-ui,
  14px).
- **C2 (Starlight title):** **rejected as wrong-for-this-repo** (see Learning L1).
- **C3 (CI dash check):** done, then hardened during review (see L4). New
  `scripts/check-no-dashes.mjs`, wired into the `validate` job.
- **C4 (14.11 guards):** done. Ported `check-rendered-links` + `check-route-parity`
  from pm-skills with one deliberate improvement (see L2), plus the link breakage it
  exposed (see L3). Wired into both the PR build and the deploy build (see review
  finding F2).
- **C5 (`.node-version`):** done (optional item); minor drift caveat noted (F3).

Final state: `cd site && npm run build` green (111 pages); rendered-link check
`STRICT_ANCHORS=1` 0 broken / 0 broken anchors; route-parity 111/111; dash check
clean; `python tools/validate.py` green; no tracked build output.

## 2. Packet-vs-repo conflicts found during verification (the important learnings)

### L1. C2 is wrong: the Starlight title was deliberately retained, not stale

The packet (scorecard line 61, correction line 68, checklist line 77, acceptance
line 86) treats `title: 'Writing Style Library'` as a stale leftover of the rename
and directs changing it to "Writing Style Catalog." That is incorrect for this repo.

**ADR 0014** (`docs/internal/adr/0014-repository-naming.md:45`, status Accepted) and
the **CHANGELOG** both state explicitly that the 2026-06-02 rename changed only the
slug and identifiers and **retained the human display title "Writing Style
Library"**, because the maintainer values the plain-English "library" connotation.
"Writing Style Library" is the display name in 39 authored places (README, AGENTS.md,
CLAUDE.md, NOTICE, CONTRIBUTING, ROADMAP, REPOSITORY, the glossary and
contribution-process prose, `index.mdx`, the favicon). Changing only the Starlight
title to "Catalog" would have made `astro.config.mjs` the single inconsistent
outlier and contradicted an Accepted ADR.

Action taken: left the title as "Writing Style Library" with an inline config comment
citing ADR 0014. The packet's title item should be struck.

**Recommendation for the packet/standard:** a conformance packet that touches
identity or naming MUST cross-check the repo's own ADRs/CHANGELOG before asserting a
value is "stale." A repo slug and its display title are intentionally separable; the
audit inferred "renamed repo therefore stale title" without consulting ADR 0014.

### L2. The donor's hardcoded base is a 14.7 violation; do not carry it forward

pm-skills `check-rendered-links.mjs:28` hardcodes `const BASE = '/pm-skills'` with a
"keep in sync" comment. The 2026-06-02 audit itself flags this as the family's one
live clause-14.7 violation (a wrong base there passes the check while the live site
404s), and notes the planned `scripts/site-base.mjs` single-source "does not exist on
disk."

Porting the donor verbatim would have imported that violation into
writing-style-catalog. Instead the port adds `scripts/site-base.mjs`, which extracts
the base from `site/astro.config.mjs` at runtime (the single source), and both this
repo's link checker derives the base from it. `check-route-parity` needs no base (its
manifest paths are dist-relative).

**Recommendation:** when the shared validators are extracted to the preset (A-2 /
ci-standard rollout), lift the base out of the inline const exactly this way. The
`site-base.mjs` here is a working reference for that extraction. Until then, any
sibling that ports the donor should use this pattern, not the hardcoded literal.

### L3. Landing 14.11 surfaced 16 pre-existing live-site 404s the packet did not anticipate

The rendered-link guard, on its first run, found **16 browser-broken internal links**
in the hand-authored narrative pages (concepts, governance, guides, design-standards).
All were file-relative `.md` links (for example `../guides/compose-instruction.md`)
that 404 on the live site: Starlight serves extensionless directory URLs one level
deeper than the source file, so a filesystem-correct `.md` link is URL-broken. These
shipped with the Pattern S migration (PR #11) because no link guard existed to catch
them. 13 were cross-section `../<section>/<file>.md` (caught by the guard); 3 were
bare-relative `<file>.md` (which the donor guard skips, see F1) but equally broken.

Action taken (maintainer chose "fix the links"): all 16 rewritten to relative-slug
URLs (`../../<section>/<file>/` cross-section, `../<file>/` same-section), the form
the generator already emits. Guard is green and now prevents regression.

**Recommendation for the rollout:** expect the same when 14.11 lands on the other
siblings. The guard is doing exactly its job, but "add the guard" is not free on a
repo that never had one - budget for the pre-existing link debt it exposes. The
structural fix that lets authors keep writing natural `.md` links is the fourth
validator, `remark-resolve-links` (build-time mdast transform), which this repo
deferred; see Follow-ups.

### L4 (minor). 14.6 scorecard evidence mis-locates the deploy chain

The packet's 14.6 row (line 55) attributes the full Pages deploy chain
(`upload-pages-artifact` / `deploy-pages` / `environment`) AND the PR `build-site`
job all to `validate.yml`. In the live repo the deploy chain lives in a separate
`.github/workflows/build-site.yml`; `validate.yml` carries only the non-deploying PR
`build-site` job. 14.6 still PASSes; this is stale evidence, not a defect. Worth
correcting in the packet so the next reader wires guards into the right file.

## 3. Adversarial review of the diff

Method: a 6-dimension multi-agent review workflow (`wsl-astro-conformance-review`,
17 agents) over the staged diff - validators-robustness, ci-wiring, link-fixes,
house-style, packet-conflicts, scope-regression. Each reviewer finding was then
handed to an independent verifier prompted to refute it. 6 findings survived
verification; 5 were refuted. The refuted set independently confirmed that the title
revert (L1), the 16 link rewrites, the scope, and the route-manifest are all correct.

### Confirmed findings and dispositions

| ID | Sev | Finding | Disposition |
|---|---|---|---|
| F1 | P3 | `check-rendered-links` skips bare-relative hrefs (no `./`, `../`, base, or `/`) - a donor limitation; latent (zero live breaks; the 16 fixes are all parent-relative). | **Documented** the limitation in the script; the structural fix is `remark-resolve-links` (follow-up). Not widened, because a naive widen false-positives on intentional `.md` demo text inside rendered README example content. |
| F2 | P2 | The 14.11 guards were wired into the PR `build-site` job only; the deploy workflow (`build-site.yml`, push to main / `workflow_dispatch`) ran none of them, so the artifact that actually deploys was unguarded. | **Fixed:** added both guards to `build-site.yml`'s build job after `npm run build`, before the artifact upload. PR build and deploy build now run the identical guards. |
| F3 | P3 | New `.node-version` is unused by CI (both workflows read `.nvmrc`); a future bump editing only `.node-version` would leave CI on a stale `.nvmrc`. | **Accepted with rationale:** kept as the packet's optional local-dev companion (fnm/asdf/nodenv read it); `.nvmrc` remains the CI source of truth, both pin 24. Documented here. |
| F4 | P2 | `check-no-dashes.mjs` scanned `.md/.mdx/.mjs/.ts/.astro/.css/.yml` but omitted `.py` (5 tracked tools with authored docstrings) - a real coverage gap vs the "no dashes anywhere" house rule, proven by `tools/validate.py:54-55` carrying both dash code points yet passing. | **Fixed:** added `.py` to the scan and de-literalized `validate.py`'s own detector via `chr(0x2014/0x2013)` (identical runtime value, ASCII source) so it stays dash-free. `.json` deliberately not added (lockfile / third-party metadata risk). |
| F5 | P3 | The `docs/internal/` exclusion comment claimed the tree is "imported, read-only ... which house style does not govern" - inaccurate; it holds team-authored ADRs/plans the rule does govern. | **Fixed the rationale:** `docs/internal/` is excluded because its markdown is already dash-scanned by `tools/validate.py` (`check_no_em_dashes` rglobs `docs/`), so excluding it here avoids redundant coverage and the imported-artifact modification trap. The verifier confirmed there is no enforcement gap (validate.py covers it). |
| F6 | P3 | `scripts/README.md` documented a narrower extension set than the checker scanned (omitted `.mdx`, `.yaml`). | **Fixed:** README now lists the accurate set (and `.py`). |

### Refuted (verifier overturned the reviewer)

- "Empty-dist symmetry comment inaccurate" - refuted: on the real committed
  111-route baseline, both guards do fail loudly on an empty dist; the counterexample
  needs an empty baseline that only `--update` against an empty dist could create.
- "All link rewrites valid / no unfixed links" - this was an all-clear, independently
  re-derived: all 16 resolve; the only unresolved raw `.md` strings are inert demo
  text inside rendered README/example code blocks (correctly not emitted as `href`).
- "Title revert correct" and "packet mis-locates deploy chain" and ".node-version is
  the optional item" - all factually accurate but flag no code defect (the diff is
  already correct); captured above as L1 / L4 / F3.

## 4. Consolidated recommendations for the standard and shared infra

1. **Packet hygiene (identity):** cross-check ADRs/CHANGELOG before asserting a value
   is stale. Strike the C2 title item for this repo (L1).
2. **Shared validators (14.7):** extract the base via a `site-base.mjs`-style single
   source, not the donor's hardcoded literal. This repo's `scripts/site-base.mjs` is a
   working reference (L2). Fixing pm-skills' `check-rendered-links.mjs:28` remains the
   family's one live 14.7 item.
3. **Rollout expectation (14.11):** adding the rendered-link guard to a repo that
   never had one will expose pre-existing broken links; budget for the fix. Consider
   sequencing `remark-resolve-links` with the guard so the structural fix and the
   regression net land together (L3).
4. **ci-standard (guard placement):** the reusable workflow's single-build,
   event-gated-tail design already runs the guards on both PR and push. Interim
   per-repo wiring should do the same - guard the deployed artifact, not only the PR
   (F2). The packet's "run in the PR build-site job" phrasing under-specifies this.
5. **Shared dash check:** decide the canonical scan set. The "no dashes anywhere" rule
   argues for including `.py` (authored docstrings); a checker that builds the
   forbidden chars from code points keeps the detector itself compliant (F4). Note
   that `.json` lockfiles and third-party license text are a false-positive hazard.
6. **Packet evidence (14.6):** correct the deploy-chain location (it lives in
   `build-site.yml`, not `validate.yml`) (L4).

## 5. Follow-ups (out of scope for this pass)

- **`remark-resolve-links` (the 4th validator):** the build-time mdast transform that
  rewrites `.md` links to Starlight slugs, hooked into BOTH `markdown.remarkPlugins`
  and the `@astrojs/mdx` pipeline (the packet's `.md`/`.mdx` caveat). It would let
  authors keep natural `.md` links and would close the bare-relative gap (F1)
  structurally. Deferred per the packet's two-validator C4 scope.
- **Shared reusable workflow + preset:** when it lands, it should subsume the two
  per-repo guard wirings (PR + deploy) and ship the `site-base.mjs` base extraction.
- **`verify-edit-links`:** the remaining donor validator, not in this repo's scope.
