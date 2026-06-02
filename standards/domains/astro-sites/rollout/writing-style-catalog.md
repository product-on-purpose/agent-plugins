# writing-style-catalog - Astro site conformance packet

> Target: full compliance with the family Astro site standard ([`../SITE-STANDARD.md`](../SITE-STANDARD.md), clauses 14.1-14.11). Current state from the 2026-06-02 audit. **This repo is the special case:** `main` is still Pattern W (root `astro.config.mjs`, a Python `generate_site_pages.py`), but a complete Pattern S migration is staged on the branch `refactor/astro-pattern-s-convergence` (7 commits ahead, ADR 0011 already amended for the migrate path). The job is to **finalize that branch and merge it**, then close a few residual P2s, not to implement Pattern S from scratch.

## 1. Kickoff prompt (copy-paste, or point a session at this file and say "go")

```
You are working in the writing-style-catalog repository to COMPLETE and SHIP its Astro Starlight
Pattern S migration, in line with the Product on Purpose family Astro site standard. IMPORTANT:
main is still Pattern W, but a full Pattern S migration already exists on the branch
refactor/astro-pattern-s-convergence (Python generator ported to Node, app moved under site/,
stock docsLoader, accent + robots.txt added, ADR 0011 amended). Your job is to verify that branch,
close the residual gaps ON the branch, and prepare it to merge to main - not to redo the migration.

Read first, in order:
1. The contract (the standard, clauses 14.1-14.11 + decisions, incl. A-6 ADR 0011 = migrate):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\SITE-STANDARD.md
2. This repo's conformance packet (pass/fail for main AND the branch, corrections, checklist):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\rollout\writing-style-catalog.md
   (If you cannot read the agent-plugins path, ask me to add
   E:\Projects\product-on-purpose\agent-plugins as a working directory, or to copy the packet in.)
3. As needed: ...\astro-sites\ci-standard.md and the audit at
   agent-plugins\docs\internal\audits\2026-06-02_astro-implementation.md.

Then:
- Confirm git state: `git log --oneline main..refactor/astro-pattern-s-convergence`,
  `git diff --stat main refactor/astro-pattern-s-convergence`. Check out the branch.
- Verify the branch is genuinely Pattern S and builds: site/src/content.config.ts uses stock
  docsLoader(); there is no Python site generator; `cd site && npm run build` is green;
  `git ls-files` shows no tracked build output.
- Create docs/internal/release-plans/astro-starlight-conformance/ ON THE BRANCH with spec.md
  (the conformance target + acceptance criteria from this packet) and release-plan.md (the checkbox
  plan from section 4). You OWN and UPDATE release-plan.md as you execute.
- Make the residual P2 fixes ON THE BRANCH (Starlight title, mermaid branding, CI dash check,
  link/route guards), keeping it buildable. Tick boxes as you go.
- House rule: no em-dashes or en-dashes anywhere. Make changes as commits on the branch.
- A-6 is decided as MIGRATE (ADR 0011 is already amended on the branch); confirm with me that
  migrate is intended, then prepare the PR to merge refactor/astro-pattern-s-convergence -> main.
  Do NOT merge without my explicit confirmation.

Stop and ask if: the branch does not build, the migration looks incomplete, A-6 is not actually
intended as migrate, or you hit an unresolved decision.

When the branch is green and the residual fixes are in, summarize the diff main..branch and present
the merge PR for my review.
```

## 2. Compliance scorecard (2026-06-02) - main vs branch

| Clause | `main` (Pattern W) | `refactor/astro-pattern-s-convergence` | Correction |
|---|---|---|---|
| 14.1 Pattern S | **FAIL** (root `astro.config.mjs`, no `site/src/content.config.ts`) | PASS (stock `docsLoader()`, app in `site/`) | Merge the branch. |
| 14.2 Framework | PASS (site set) | PASS (mermaid before starlight, **unbranded**; mdx after starlight) | P2: brand mermaid. |
| 14.3 Generate from source | **FAIL** (`scripts/generate_site_pages.py`, Python) | PASS (Node `scripts/gen-site.mjs`, `assertSafeOutRoot` guard) | Merge the branch. |
| 14.4 Drift guard | PASS (`taxonomy.json` guard; `check_generated_fresh.py`) | PASS (`taxonomy.json` guard; catalog gitignored + rebuilt) | - |
| 14.5 No committed build output | PASS | PASS | - |
| 14.6 Deploy + PR build + pins | **FAIL** (no PR build job; uploads `./dist`; hardcoded `node-version: "22.12.0"`) | PASS (PR `build-site`; uploads `./site/dist`; `node-version-file: .nvmrc`; `@v5`) | Merge the branch. |
| 14.7 Base single source | PASS | PASS (base once; `gen-site.mjs` uses relative links, "no base literal in this file") | - |
| 14.8 Versions + Node | PARTIAL (hardcoded `22.12.0`) | PARTIAL (`.nvmrc=24`, `engines >=22.12.0`, Astro `6.4.2`; no `.node-version`) | P2: optional `.node-version` companion. |
| 14.9 Search + SEO | PARTIAL (no robots) | PASS (`robots.txt` added; favicon; no `og:image`) | Merge the branch. |
| 14.10 No config sidecars | PASS | PASS | - |
| 14.11 Link/route integrity | FAIL | FAIL (no validators) | Add link/route guards (note the `.md` + `.mdx` remark caveat). |
| Carry-over | Starlight title "Writing Style Library" (stale after rename); em/en-dash check pre-commit only, not CI | same two carry-overs | P2: fix title; add CI dash check. |

**Net: `main` non-conformant on 14.1/14.3/14.6/14.9; the branch resolves all four. Residual on the branch: mermaid branding, Starlight title, CI dash check, link/route guards.**

## 3. Corrections to reach full compliance

- **P1 Finalize and merge the Pattern S branch.** Confirm A-6 = migrate (ADR 0011 is already amended on the branch), verify the branch builds green and is genuinely Pattern S, then prepare the merge PR to `main`. This single move resolves 14.1, 14.3, 14.6, and 14.9.
- **P2 (branding) Brand mermaid** on the branch: add `themeVariables` (`#5C7CFA`, system-ui, 14px) to the `mermaid()` call.
- **P2 (identity) Fix the Starlight `title`** from "Writing Style Library" to "Writing Style Catalog" (the repo was renamed).
- **P2 (14.11 / family rule) Add link/route guards and a CI dash check.** Move the em/en-dash check from pre-commit-only into a CI job (a contributor who bypasses pre-commit can currently land a dash). Add a rendered-link check (and route-parity manifest) - mind the `.md` vs `.mdx` remark caveat: this repo carries `@astrojs/mdx` + `remark-gfm`, so a link resolver must also run inside the mdx pipeline, not only `markdown.remarkPlugins`.
- **P2 (optional) Add `.node-version=24`** companion alongside `.nvmrc`.

## 4. Implementation checklist (the agent updates this; copy into release-plan.md)

- [ ] Verify branch state: `git log --oneline main..refactor/astro-pattern-s-convergence`; check out the branch; confirm `cd site && npm run build` green and no tracked build output.
- [ ] Create `docs/internal/release-plans/astro-starlight-conformance/spec.md` + `release-plan.md` on the branch.
- [ ] **P2** Brand mermaid (`themeVariables` `#5C7CFA`, system-ui, 14px).
- [ ] **P2** Fix Starlight `title` -> "Writing Style Catalog".
- [ ] **P2** Add the em/en-dash check to CI (not just pre-commit).
- [ ] **P2** Add a rendered-link check (+ route-parity), handling the `.md`/`.mdx` remark caveat.
- [ ] (optional) Add `.node-version=24`.
- [ ] Confirm A-6 = migrate with the maintainer; prepare the merge PR `refactor/... -> main`.
- [ ] Present the `main..branch` diff and the PR for review; do NOT merge without confirmation.

## 5. Acceptance criteria (done = all true)

- The branch is genuinely Pattern S (stock `docsLoader()`, no Python site generator) and `cd site && npm run build` is green with no tracked build output.
- Mermaid renders with `#5C7CFA`; the Starlight title reads "Writing Style Catalog".
- The em/en-dash check runs in CI; a rendered-link check runs against `dist` (mdx links included).
- The merge PR `refactor/astro-pattern-s-convergence -> main` is prepared with a clean diff summary; A-6 confirmed as migrate; not merged without maintainer confirmation.
- After merge, `main` satisfies 14.1, 14.3, 14.6, 14.9.
