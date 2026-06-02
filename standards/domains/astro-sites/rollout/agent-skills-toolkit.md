# agent-skills-toolkit - Astro site conformance packet

> Target: full compliance with the family Astro site standard ([`../SITE-STANDARD.md`](../SITE-STANDARD.md), clauses 14.1-14.11). Current state from the 2026-06-02 audit (askit `main` @ 674257f). The site is a small (six-page), hand-authored Pattern S site and is the **reference implementation of the 14.4 hand-authored-catalog path** (its `tests/unit/catalog-coverage.test.mjs` drift-guards the catalog). Remaining work is P2 polish plus the link/route guards.

## 1. Kickoff prompt (copy-paste, or point a session at this file and say "go")

```
You are working in the agent-skills-toolkit repository to bring its existing Astro Starlight
documentation site into FULL compliance with the Product on Purpose family Astro site standard.
The site is already Pattern S (six hand-authored pages); this is conformance polish, not a
greenfield install. Note: STANDARD.md (the family Standard text) currently lives in THIS repo,
but the Astro SITE standard is owned in agent-plugins; do not edit STANDARD.md in this work.

Read first, in order:
1. The contract (the standard, clauses 14.1-14.11 + decisions A-1..A-6):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\SITE-STANDARD.md
2. This repo's conformance packet (your pass/fail scorecard, corrections, checklist):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\rollout\agent-skills-toolkit.md
   (If you cannot read the agent-plugins path, ask me to add
   E:\Projects\product-on-purpose\agent-plugins as a working directory, or to copy the packet in.)
3. As needed: ...\astro-sites\ci-standard.md and the audit at
   agent-plugins\docs\internal\audits\2026-06-02_astro-implementation.md.

Then:
- Prime the codebase: read site/astro.config.mjs, site/src/content.config.ts, site/src/styles/custom.css,
  ci.yml, deploy-pages.yml, tests/unit/catalog-coverage.test.mjs, and the catalog page.
- Create docs/internal/release-plans/astro-starlight-conformance/ with spec.md (the conformance target +
  acceptance criteria from this packet) and release-plan.md (the checkbox plan from section 4). You OWN and
  UPDATE release-plan.md as you execute.
- Execute the corrections, keeping the conformance gate (`node scripts/check.mjs`) and CI green between steps.
  After each step run its acceptance check (typically: `cd site && npm run build` succeeds; `npm test`
  green incl. catalog-coverage; all CI jobs resolve Node from .nvmrc) and tick the box in release-plan.md.
- House rule: no em-dashes or en-dashes anywhere (use " - " or restructure). Make changes as normal
  commits/PRs in THIS repo (ADRs in docs/internal/decisions, CHANGELOG/RELEASE-NOTES). Do NOT edit other
  repos and do NOT edit STANDARD.md as part of this. Do NOT push or merge without my confirmation.
- Scope: only the Astro site conformance in this packet. If a clause seems wrong, stop and flag it.

Stop and ask if: an acceptance check fails and the fix is not obvious, the packet conflicts with the
repo's actual state, or you hit an unresolved decision.

When the checklist is complete and the build + checks are green, summarize what changed and prepare the PR(s).
```

## 2. Compliance scorecard (2026-06-02)

| Clause | Status | Evidence | Correction (if any) |
|---|---|---|---|
| 14.1 Pattern S | PASS | `site/src/content.config.ts:6` stock `docsLoader()`; app in `site/`. | - |
| 14.2 Framework | PASS (branding gap) | Astro + Starlight; `site` set; `astro-mermaid` before `starlight` but **unbranded** (`theme:'default'`, no `themeVariables`). | P2: brand mermaid (`#5C7CFA`). |
| 14.3 Generate from source | PASS (via 14.4) | No site generator; catalog hand-authored, which 14.3 permits given the 14.4 coverage check. | - |
| 14.4 Drift guard | PASS (reference) | `tests/unit/catalog-coverage.test.mjs` runs in `ci.yml` via `npm test` on push + PR; asserts catalog covers `library.json` both ways. The reference 14.4 hand-authored-catalog path. | - |
| 14.5 No committed build output | PASS | `site/dist` gitignored; nothing tracked. | - |
| 14.6 Deploy + PR build + pins | **PARTIAL (P2)** | `upload-pages-artifact@v5`/`deploy-pages@v5`/`github-pages` PASS; PR build (`ci.yml` `build-site`) PASS. But `checkout@v4` + `setup-node@v4` (stale majors) and **hardcoded `node-version: "24"`** in all three jobs (ignores the committed `.nvmrc`/`.node-version`). | P2: bump to `@v5`; switch to `node-version-file`. |
| 14.7 Base single source | PASS | `base` once at `astro.config.mjs:13`; other `agent-skills-toolkit` tokens are github.com URLs, not the Pages base. | - |
| 14.8 Versions + Node | PARTIAL (P2) | `engines.node >=22.12.0`; `.nvmrc`+`.node-version`=24; Astro resolves `6.4.2`. | P2: read the pin via `node-version-file` (see 14.6). Re-adopt Standard v0.9 for the core floor. |
| 14.9 Search + SEO | PASS | Pagefind + sitemap; `robots.txt` present; no `og:image` (preset-owned); no favicon override (minor). | (optional) add a favicon. |
| 14.10 No config sidecars | PASS | No `.md` sidecars beside config. | - |
| 14.11 Link/route integrity | **FAIL (P1/P2)** | None of the four validators present (small site, fewer links, but 14.11 is MUST). | Add the link/route guards (shared workflow preferred). |

**Net: 1 FAIL (14.11), 2 PARTIAL-P2, branding gap, rest PASS.** No P0; 14.4 is exemplary.

## 3. Corrections to reach full compliance

- **P2 (14.6 / 14.8) Modernize the deploy toolchain.** In `ci.yml` and `deploy-pages.yml`: `checkout@v4 -> @v5`, `setup-node@v4 -> @v5`, and replace the hardcoded `node-version: "24"` (three jobs) with `node-version-file: .nvmrc` so the committed pin is the CI source of truth.
- **P2 (branding) Brand mermaid.** Add `mermaidConfig.themeVariables` (`lineColor:'#5C7CFA'`, system-ui, 14px) to the `mermaid()` call (or adopt it from the shared preset when it lands).
- **P1/P2 (14.11) Add link/route guards.** The site is small, but 14.11 is a MUST. Preferred: adopt the shared reusable workflow (ROADMAP Phase 1). If proceeding now, run a rendered-link check (anchors enforced) against `dist` in the `build-site` job; a route-parity manifest is light here (a handful of routes) but worth committing.
- **(optional) Add a favicon** override for brand consistency.

## 4. Implementation checklist (the agent updates this; copy into release-plan.md)

- [ ] Create `docs/internal/release-plans/astro-starlight-conformance/spec.md` + `release-plan.md`.
- [ ] **P2** `checkout@v5` + `setup-node@v5` + `node-version-file: .nvmrc` in `ci.yml` and `deploy-pages.yml` (all jobs).
- [ ] **P2** Brand mermaid (`themeVariables` `#5C7CFA`, system-ui, 14px).
- [ ] **P1/P2** Add a rendered-link check (+ optional route-parity manifest) to the PR `build-site` job.
- [ ] (optional) Add a favicon.
- [ ] Run `cd site && npm run build`; `npm test` green (catalog-coverage included); CI jobs resolve Node from `.nvmrc`.
- [ ] Open PR(s); CI green; await maintainer review.

## 5. Acceptance criteria (done = all true)

- `ci.yml` and `deploy-pages.yml` use `checkout@v5` + `setup-node@v5` with `node-version-file: .nvmrc`; no hardcoded `node-version` remains.
- Mermaid diagrams render with the `#5C7CFA` brand line color.
- The PR build runs a rendered-link check against `dist`; it is green.
- `npm test` (with `catalog-coverage`) green; `cd site && npm run build` green; no tracked build output.
- PR(s) prepared, `STANDARD.md` untouched, not merged without maintainer confirmation.
