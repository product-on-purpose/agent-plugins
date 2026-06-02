# pm-skills - Astro site conformance packet

> Target: full compliance with the family Astro site standard ([`../SITE-STANDARD.md`](../SITE-STANDARD.md), clauses 14.1-14.11). Current state from the 2026-06-02 audit (pm-skills `main` @ 1eea16f). pm-skills is the family **reference implementation** and the donor of the four build-aware validators; this is conformance hardening, not a greenfield install. One P1, three P2.

## 1. Kickoff prompt (copy-paste, or point a session at this file and say "go")

```
You are working in the pm-skills repository to bring its existing Astro Starlight
documentation site into FULL compliance with the Product on Purpose family Astro
site standard. pm-skills is the family reference implementation and is already very
close; this is conformance hardening, not a greenfield install.

Read first, in order:
1. The contract (the standard, clauses 14.1-14.11 + decisions A-1..A-6):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\SITE-STANDARD.md
2. This repo's conformance packet (your pass/fail scorecard, corrections, checklist):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\rollout\pm-skills.md
   (If you cannot read the agent-plugins path from this session, ask me to add
   E:\Projects\product-on-purpose\agent-plugins as a working directory, or to copy the
   packet into this repo.)
3. As needed: ...\astro-sites\ci-standard.md and the audit at
   agent-plugins\docs\internal\audits\2026-06-02_astro-implementation.md.

Then:
- Prime the codebase before editing: read site/astro.config.mjs, site/src/content.config.ts,
  scripts/gen-site.mjs, scripts/check-rendered-links.mjs, the deploy + validation workflows,
  and the package.json files.
- Create docs/internal/release-plans/astro-starlight-conformance/ containing:
    - spec.md: the conformance target (the clauses this repo must satisfy + acceptance
      criteria, lifted from this packet's sections 2 and 5), and
    - release-plan.md: the sequenced, checkbox release plan (port this packet's section 4
      Implementation checklist). You OWN release-plan.md and UPDATE its checkboxes as you go.
  Reconcile with the EXISTING docs/internal/release-plans/_unreleased/astro-site-p1-conformance/
  plan rather than duplicating it; supersede or fold it in explicitly.
- Execute the corrections P1 before P2, keeping the repo buildable and CI green between steps.
  After each step run its acceptance check (typically: `cd site && npm run build` succeeds;
  `git ls-files` shows no tracked build output; the rendered-link + route-parity checks pass)
  and tick the box in release-plan.md.
- House rule: no em-dashes or en-dashes anywhere (use " - " or restructure). Make changes as
  normal commits/PRs in THIS repo following its conventions (ADRs in docs/internal/decisions,
  CHANGELOG). Do NOT edit other repos. Do NOT push or merge without my confirmation.
- Scope: only the Astro site conformance in this packet. Do not refactor unrelated code. If a
  clause seems wrong for this repo, stop and flag it rather than diverging.

Stop and ask if: an acceptance check fails and the fix is not obvious, the packet conflicts
with the repo's actual state, or you hit an unresolved decision.

When the checklist is complete and the build + checks are green, summarize what changed and
prepare the PR(s) for my review.
```

## 2. Compliance scorecard (2026-06-02)

| Clause | Status | Evidence | Correction (if any) |
|---|---|---|---|
| 14.1 Pattern S | PASS | `site/src/content.config.ts:15` stock `docsLoader()`; app in `site/`. | - |
| 14.2 Framework | PASS | Astro + Starlight; `site` set; `astro-mermaid` before `starlight`, branded (`lineColor:'#5C7CFA'`). | - |
| 14.3 Generate from source | PASS | One Node `scripts/gen-site.mjs`; `build-skill-catalog.py` writes a SKILL reference, not the site. | - |
| 14.4 Drift guard | PASS | Generated subdirs gitignored + rebuilt; `validation.yml` regenerates on PR before build. | - |
| 14.5 No committed build output | PASS | `dist/`, `.astro/` gitignored; nothing tracked. | - |
| 14.6 Deploy + PR build + pins | PASS (P2 nit) | `checkout@v5`/`setup-node@v5` (`node-version-file: .nvmrc`)/`upload-pages-artifact@v5`/`deploy-pages@v5`/`github-pages`; PR build in `validation.yml` runs the four checks. | P2: `create-issues-from-drafts.yml:28` hardcodes Node `22.12` (unrelated workflow). |
| 14.7 Base single source | **PARTIAL (P1)** | `const BASE='/pm-skills'` single-sourced in `astro.config.mjs:10`, but **duplicated** at `scripts/check-rendered-links.mjs:28`. | **Extract to one source; a wrong base passes the check while the live site 404s.** |
| 14.8 Versions + Node | PARTIAL (P2) | `engines.node >=22.12.0`; `.nvmrc=24`. Astro resolves `6.3.3` (family is `6.4.2`). | P2: bump Astro to resolve `6.4.2`; fix the one workflow hardcode. |
| 14.9 Search + SEO | PARTIAL (P2) | Pagefind + sitemap PASS; favicon present; **`robots.txt` absent** (only repo without it); no `og:image` (conformant, preset-owned). | P2: add `site/public/robots.txt`. |
| 14.10 No config sidecars | PASS | No `.md` sidecars beside site config/generators. | - |
| 14.11 Link/route integrity | PASS | Donor of all four validators (`check-route-parity` + `route-manifest.txt`, `check-rendered-links` with `STRICT_ANCHORS=1`, `verify-edit-links`, `remark-resolve-links`); run in `validation.yml`. | - |

**Net: 1 PARTIAL-P1, 3 PARTIAL-P2, rest PASS.** No P0.

## 3. Corrections to reach full compliance

- **P1 (14.7) Single-source the base literal.** Create `scripts/site-base.mjs` exporting `export const BASE = '/pm-skills';`, import it in `site/astro.config.mjs` and `scripts/check-rendered-links.mjs` (remove the `:28` literal). Add a test asserting that a wrong base makes the rendered-link check fail (it must not pass silently). This is the careful change: a wrong base passes the check while the live site 404s.
- **P2 (14.9) Add `site/public/robots.txt`** with `User-agent: *`, `Allow: /`, and `Sitemap: https://product-on-purpose.github.io/pm-skills/sitemap-index.xml`.
- **P2 (branding) Set the family accent.** Add `--sl-color-accent: #5C7CFA` (with low/high companions) to `site/src/styles/custom.css` (currently no override; uses the Starlight default). When the shared preset lands this comes from `accent.css` instead.
- **P2 (14.8) Pin one Astro version.** Refresh `site/package-lock.json` so Astro resolves `6.4.2` to match the family; align `create-issues-from-drafts.yml` to `node-version-file: .nvmrc` or document it as a non-site workflow.

## 4. Implementation checklist (the agent updates this; copy into release-plan.md)

- [ ] Create `docs/internal/release-plans/astro-starlight-conformance/spec.md` + `release-plan.md`; reconcile with the existing `_unreleased/astro-site-p1-conformance/` plan.
- [ ] **P1** Add `scripts/site-base.mjs`; import `BASE` in `astro.config.mjs` and `check-rendered-links.mjs`; delete the duplicate literal.
- [ ] **P1** Add a test that a wrong base fails the rendered-link check; confirm `git grep -nF "/pm-skills"` shows the literal only in `site-base.mjs`.
- [ ] **P2** Add `site/public/robots.txt`.
- [ ] **P2** Set `--sl-color-accent: #5C7CFA` in `custom.css`.
- [ ] **P2** Bump Astro to resolve `6.4.2`; align/justify the `create-issues` Node pin.
- [ ] Run `cd site && npm run build`; confirm rendered-link, route-parity, verify-edit-links all green; `git ls-files` shows no build output.
- [ ] Open PR(s); CI green on ubuntu + windows; await maintainer review.

## 5. Acceptance criteria (done = all true)

- `git grep -nF "/pm-skills"` returns the base literal only in `scripts/site-base.mjs` (plus the unavoidable `robots.txt` sitemap URL).
- A deliberately wrong base in `site-base.mjs` makes the rendered-link check FAIL (test proves it).
- `site/public/robots.txt` is served and points at the sitemap.
- `cd site && npm run build` is green; route-parity (386-route baseline) unchanged or updated with intent; no tracked build output.
- `--sl-color-accent` is `#5C7CFA`.
- CI green on both OS legs; PR(s) prepared, not merged without maintainer confirmation.
