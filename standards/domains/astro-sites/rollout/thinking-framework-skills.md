# thinking-framework-skills - Astro site conformance packet

> Target: full compliance with the family Astro site standard ([`../SITE-STANDARD.md`](../SITE-STANDARD.md), clauses 14.1-14.11). Current state from the 2026-06-02 audit (tfs `main` @ 0673399). The site is Pattern S, fully Node, with the cleanest generator pipeline; the drift `--check` is wired. Two P1s remain (config sidecars, link/route guards) plus one P2.

## 1. Kickoff prompt (copy-paste, or point a session at this file and say "go")

```
You are working in the thinking-framework-skills repository to bring its existing Astro
Starlight documentation site into FULL compliance with the Product on Purpose family Astro
site standard. The site is already Pattern S and fully Node; this is conformance hardening.

Read first, in order:
1. The contract (the standard, clauses 14.1-14.11 + decisions A-1..A-6):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\SITE-STANDARD.md
2. This repo's conformance packet (your pass/fail scorecard, corrections, checklist):
   E:\Projects\product-on-purpose\agent-plugins\standards\domains\astro-sites\rollout\thinking-framework-skills.md
   (If you cannot read the agent-plugins path, ask me to add
   E:\Projects\product-on-purpose\agent-plugins as a working directory, or to copy the packet in.)
3. As needed: ...\astro-sites\ci-standard.md (the four build-aware validators) and the audit at
   agent-plugins\docs\internal\audits\2026-06-02_astro-implementation.md.

Then:
- Prime the codebase: read site/astro.config.mjs, site/src/content.config.ts, scripts/gen-site.mjs,
  scripts/gen-recommendable.mjs, ci.yml, deploy-pages.yml, and the seven tracked *.md sidecars.
- Create docs/internal/release-plans/astro-starlight-conformance/ with spec.md (the conformance
  target + acceptance criteria from this packet) and release-plan.md (the checkbox plan ported from
  this packet's section 4). You OWN and UPDATE release-plan.md as you execute.
- Execute the corrections P1 before P2, keeping the repo buildable and CI green between steps. After
  each step run its acceptance check (typically: `cd site && npm run build` succeeds; sidecar grep is
  empty; link/route checks pass) and tick the box in release-plan.md.
- House rule: no em-dashes or en-dashes anywhere (use " - " or restructure). Make changes as normal
  commits/PRs in THIS repo (ADRs, CHANGELOG/RELEASE-NOTES per its convention). Do NOT edit other repos.
  Do NOT push or merge without my confirmation.
- Scope: only the Astro site conformance in this packet. If a clause seems wrong, stop and flag it.

Stop and ask if: an acceptance check fails and the fix is not obvious, the packet conflicts with the
repo's actual state, or you hit an unresolved decision.

When the checklist is complete and the build + checks are green, summarize what changed and prepare
the PR(s).
```

## 2. Compliance scorecard (2026-06-02)

| Clause | Status | Evidence | Correction (if any) |
|---|---|---|---|
| 14.1 Pattern S | PASS | `content.config.ts:11` stock `docsLoader()`; app in `site/`. | - |
| 14.2 Framework | PASS | Astro + Starlight; `site` set; `astro-mermaid` before `starlight`, branded. | - |
| 14.3 Generate from source | PASS | Node `gen-site.mjs` + `gen-recommendable.mjs`; zero `.py` in the repo. | - |
| 14.4 Drift guard | PASS | Site content gitignored + rebuilt; committed advisor `recommendable.{json,md}` guarded by `gen-recommendable.mjs --check` in `ci.yml` (`recommendable-drift`). | - |
| 14.5 No committed build output | PASS | `dist/`, `.astro/` gitignored; nothing tracked. | - |
| 14.6 Deploy + PR build + pins | PASS (P2 nit) | `upload-pages-artifact@v5`/`deploy-pages@v5`/`github-pages`; all `checkout@v5`/`setup-node@v5`; PR build `ci.yml` `site-build`. | P2: `ci.yml` `check` job hardcodes Node `22` (site jobs read `.nvmrc`). |
| 14.7 Base single source | PASS | Base literal once at `astro.config.mjs:27`; consumers use `import.meta.env.BASE_URL`. | - |
| 14.8 Versions + Node | PARTIAL (P2) | `engines.node >=22.12.0`; `.nvmrc=24`; Astro resolves `6.4.2`. | P2: align the `check` job to `node-version-file: .nvmrc`. |
| 14.9 Search + SEO | PASS | Pagefind + sitemap; `robots.txt` present; no `og:image` (preset-owned). | - |
| 14.10 No config sidecars | **FAIL (P1)** | Seven tracked `.md` sidecars: `library.json.md`, `manifest.generated.json.md`, `scripts/gen-site.mjs.md`, `scripts/gen-recommendable.mjs.md`, `skills/think-framework-advisor/references/recommendable.json.md`, `.claude-plugin/plugin.json.md`, `.codex-plugin/plugin.json.md`. | **Delete all seven; fold rationale into config comments or one docs page.** |
| 14.11 Link/route integrity | **FAIL (P1)** | None of the four build-aware validators present. | **Adopt the link/route guards** (shared workflow preferred; repo-local port acceptable now). |

**Net: 2 FAIL-P1, 1 PARTIAL-P2, rest PASS.** No P0.

## 3. Corrections to reach full compliance

- **P1 (14.10) Delete the seven `.md` sidecars.** Remove each; move any rationale they carry into a comment in the config/generator itself or into one short `docs/` page (for example a "generated artifacts" reference). Confirm `git ls-files | grep -E '\.(mjs|json)\.md$'` is empty.
- **P1 (14.11) Add link/route integrity guards.** Preferred: adopt the shared reusable workflow once it exists (ROADMAP Phase 1), which carries the four validators. If proceeding before that lands, port `check-rendered-links.mjs` (with `STRICT_ANCHORS=1`) and `check-route-parity.mjs` (+ a committed `route-manifest.txt`) from pm-skills into `scripts/`, parameterized by this repo's base, and run them in the `site-build` job against `dist`. Include `verify-edit-links.mjs` since most pages carry a per-page `editUrl`.
- **P2 (14.8) Align the `check` job Node pin** to `node-version-file: .nvmrc` so every job reads the single pin (currently the `check` job hardcodes `22`).
- **P2 (14.11 detail) Verify the `editLink` `/site/` segment.** `editLink.baseUrl` is `.../edit/main/` without the `/site/` segment the other Pattern S repos carry; confirm hand-authored page edit links resolve (and add `verify-edit-links` to catch it), fixing to `.../edit/main/site/` if they 404.

## 4. Implementation checklist (the agent updates this; copy into release-plan.md)

- [ ] Create `docs/internal/release-plans/astro-starlight-conformance/spec.md` + `release-plan.md`.
- [ ] **P1** Delete the 7 `.md` sidecars; relocate any rationale into config comments or one docs page.
- [ ] **P1** Confirm `git ls-files | grep -E '\.(mjs|json)\.md$'` is empty; site still builds.
- [ ] **P1** Add link/route guards (shared workflow, or port `check-rendered-links` + `check-route-parity` [+ `verify-edit-links`]) wired into the PR `site-build` job.
- [ ] **P2** Set the `check` job to `node-version-file: .nvmrc`.
- [ ] **P2** Verify/fix the `editLink` `/site/` segment.
- [ ] Run `cd site && npm run build`; link + route checks green; `git ls-files` shows no build output.
- [ ] Open PR(s); CI green; await maintainer review.

## 5. Acceptance criteria (done = all true)

- `git ls-files | grep -E '\.(mjs|json|yml|yaml)\.md$'` returns nothing.
- The PR build runs a rendered-link check (anchors enforced) and a route-parity check against a committed manifest; both green.
- Edit links on hand-authored pages resolve to real source paths (verified).
- Every CI job resolves Node from `.nvmrc` (=24); no hardcoded `node-version` remains.
- `cd site && npm run build` green; no tracked build output; PR(s) prepared, not merged without confirmation.
