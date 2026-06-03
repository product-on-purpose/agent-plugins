# writing-style-catalog - Astro site conformance packet

> Target: full compliance with the family Astro site standard ([`../SITE-STANDARD.md`](../SITE-STANDARD.md), clauses 14.1-14.11). Current state from the 2026-06-02 audit, **updated after PR #11**. The Pattern S migration has **shipped to `main`** (`197c426`, "refactor(site): converge the docs site to Pattern S"): the site is now Pattern S with a Node generator, `robots.txt`, and the `#5C7CFA` accent. So this is conformance polish against `main`, not a migration or a merge. Remaining: a few P2s plus the shared 14.11 link/route guards.

> **Status: EXECUTED (PR #12, `1d7eac1`).** This packet ran on 2026-06-02; review findings in [`2026-06-02_astro-standard_writing-style-catalog_review-findings.md`](2026-06-02_astro-standard_writing-style-catalog_review-findings.md). Two corrections the execution surfaced, applied below: (1) the "fix the stale Starlight title" item (C2) was **wrong and is withdrawn** - the title "Writing Style Library" is deliberately retained per the repo's ADR 0014; (2) the 14.6 deploy chain lives in `build-site.yml`, not `validate.yml` (the PR `build-site` job). The session also implemented the 14.11 guards locally (two-of-four, with a `site-base.mjs` base extraction) rather than deferring, and the rendered-link guard exposed 16 pre-existing live 404s, now fixed.

## 1. Kickoff prompt (copy-paste, or point a session at this file and say "go")

```
You are working in the writing-style-catalog repository to bring its Astro Starlight
documentation site into FULL compliance with the Product on Purpose family Astro site
standard. The site is ALREADY Pattern S on main (shipped via PR #11): app under site/,
stock docsLoader, a Node scripts/gen-site.mjs (the old Python generator is gone), robots.txt
and the #5C7CFA accent in place. This is conformance polish, not a migration.

Read first, in order:
1. The contract (the standard, clauses 14.1-14.11 + decisions A-1..A-6):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\SITE-STANDARD.md
2. This repo's conformance packet (your pass/fail scorecard, corrections, checklist):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\rollout\writing-style-catalog.md
   (If you cannot read the agent-plugins path, ask me to add
   E:\Projects\product-on-purpose\agent-plugins as a working directory, or to copy the packet in.)
3. As needed: ...\astro-sites\ci-standard.md and the audit at
   agent-plugins\docs\internal\audits\2026-06-02_astro-implementation.md.

Then:
- Confirm you are on main and it is Pattern S: site/src/content.config.ts uses stock docsLoader();
  scripts/gen-site.mjs exists; there is NO Python site generator (tools/*.py are taxonomy tooling,
  not the site); `cd site && npm run build` is green; `git ls-files` shows no tracked build output.
- Create docs/internal/release-plans/astro-starlight-conformance/ with spec.md (the conformance
  target + acceptance criteria from this packet) and release-plan.md (the checkbox plan from
  section 4). You OWN and UPDATE release-plan.md as you execute.
- Execute the corrections, keeping the repo buildable and CI green between steps. After each step run
  its acceptance check (typically: `cd site && npm run build` succeeds; no tracked build output;
  link check green) and tick the box in release-plan.md.
- House rule: no em-dashes or en-dashes anywhere (use " - " or restructure). Make changes as normal
  commits/PRs in THIS repo (ADRs in docs/internal, CHANGELOG). Do NOT edit other repos. Do NOT push
  or merge without my confirmation.
- Scope: only the Astro site conformance in this packet. If a clause seems wrong, stop and flag it.

Stop and ask if: an acceptance check fails and the fix is not obvious, the packet conflicts with the
repo's actual state, or you hit an unresolved decision.

When the checklist is complete and the build + checks are green, summarize what changed and prepare
the PR(s).
```

## 2. Compliance scorecard (2026-06-02, `main` @ 197c426 post PR #11)

| Clause | Status | Evidence | Correction (if any) |
|---|---|---|---|
| 14.1 Pattern S | PASS | `site/src/content.config.ts:10` stock `docsLoader()`; app in `site/`. | - |
| 14.2 Framework | PASS (branding gap) | Astro + Starlight; `site` set; `astro-mermaid` before `starlight`; `@astrojs/mdx` after `starlight` (GFM tables in `.mdx`). Mermaid **unbranded** (`theme:'default'`, no `themeVariables`). | P2: brand mermaid (`#5C7CFA`). |
| 14.3 Generate from source | PASS | Node `scripts/gen-site.mjs` (with `assertSafeOutRoot`); Python `generate_site_pages.py` is gone. `tools/*.py` are taxonomy/skill tooling, not a site generator. | - |
| 14.4 Drift guard | PASS | `taxonomy.json` guard (`tools/build-indexes.py` then `git diff --exit-code`) in `validate.yml`; generated catalog gitignored + rebuilt. | - |
| 14.5 No committed build output | PASS | `dist/`, `.astro/` gitignored; nothing tracked. | - |
| 14.6 Deploy + PR build + pins | PASS | `checkout@v5`/`setup-node@v5` (`node-version-file: .nvmrc`)/`upload-pages-artifact@v5` (`./site/dist`)/`deploy-pages@v5`/`environment`; PR `build-site` job in `validate.yml`. | - |
| 14.7 Base single source | PASS | `base` once at `astro.config.mjs:17`; `gen-site.mjs` uses relative links ("no base literal in this file"). | - |
| 14.8 Versions + Node | PASS (minor) | `engines.node >=22.12.0`; `.nvmrc=24`; CI reads `node-version-file`; Astro resolves `6.4.2`. No `.node-version` companion. | (optional) add `.node-version=24`. |
| 14.9 Search + SEO | PASS | Pagefind + sitemap; `robots.txt` + favicon present; no `og:image` (preset-owned). | - |
| 14.10 No config sidecars | PASS | No `.md` sidecars. | - |
| 14.11 Link/route integrity | **FAIL (P1/P2)** | None of the four validators present (shared gap with askit + tfs). | Add link/route guards (mind the `.md`/`.mdx` remark caveat). |
| Carry-over | - | Starlight `title` still "Writing Style Library" (`astro.config.mjs:30`) after the rename; em/en-dash check only in `.pre-commit-config.yaml`, not in CI. | P2: fix title; add CI dash check. |

**Net: 14.11 FAIL (shared), mermaid branding + title + CI dash check P2, rest PASS.** No P0/P1-unique.

## 3. Corrections to reach full compliance

- **P2 (branding) Brand mermaid.** Add `mermaidConfig.themeVariables` (`lineColor:'#5C7CFA'`, system-ui, 14px) to the `mermaid()` call (or adopt from the shared preset when it lands).
- ~~**P2 (identity) Fix the Starlight `title`**~~ **WITHDRAWN.** The title "Writing Style Library" is deliberately retained per the repo's ADR 0014 (the rename changed only the slug; the display title is intentional, used in ~39 places). Do not change it. Lesson folded into the standard: a packet MUST cross-check a repo's ADRs/CHANGELOG before asserting a value is "stale."
- **P2 (family rule) Add the em/en-dash check to CI.** It currently runs only as a pre-commit hook (`.pre-commit-config.yaml`); a contributor who bypasses pre-commit can land a dash. Add it as a CI step.
- **P1/P2 (14.11) Add link/route guards.** Preferred: adopt the shared reusable workflow (ROADMAP Phase 1). If proceeding now, port `check-rendered-links.mjs` (anchors enforced) and `check-route-parity.mjs` from pm-skills, parameterized by this repo's base, run in the PR `build-site` job. **Mind the `.md` vs `.mdx` caveat:** this repo carries `@astrojs/mdx` + `remark-gfm`, so any link resolver must run inside the mdx pipeline too, not only `markdown.remarkPlugins`, or `.mdx` links are not rewritten/checked.
- **P2 (optional) Add `.node-version=24`** companion alongside `.nvmrc` for tools that read it.

## 4. Implementation checklist (the agent updates this; copy into release-plan.md)

- [ ] Confirm `main` is Pattern S and builds green; create `docs/internal/release-plans/astro-starlight-conformance/spec.md` + `release-plan.md`.
- [ ] **P2** Brand mermaid (`themeVariables` `#5C7CFA`, system-ui, 14px).
- [ ] **P2** Fix Starlight `title` -> "Writing Style Catalog".
- [ ] **P2** Add the em/en-dash check to CI (not just pre-commit).
- [ ] **P1/P2** Add a rendered-link check (+ route-parity), handling the `.md`/`.mdx` remark caveat.
- [ ] (optional) Add `.node-version=24`.
- [ ] Run `cd site && npm run build`; link check green; `git ls-files` shows no build output.
- [ ] Open PR(s); CI green; await maintainer review.

## 5. Acceptance criteria (done = all true)

- Mermaid renders with `#5C7CFA`; the Starlight title reads "Writing Style Catalog".
- The em/en-dash check runs in CI; a rendered-link check runs against `dist` (mdx links included) and is green.
- `cd site && npm run build` green; no tracked build output.
- PR(s) prepared, not merged without maintainer confirmation.

> History: the Pattern S migration (app to `site/`, Python-to-Node generator, stock loader, accent + robots, ADR 0011 = migrate) shipped via PR #11 (`197c426`). This packet covers only what remains on `main` after that.
