# thinking-framework-skills - Astro site conformance packet

> Target: full compliance with the family Astro site standard ([`../SITE-STANDARD.md`](../SITE-STANDARD.md), clauses 14.1-14.11). Current state from the 2026-06-02 audit (tfs `main` @ 0673399). The site is Pattern S, fully Node, with the cleanest generator pipeline; the drift `--check` is wired. One P1 to fix this session (delete the config sidecars); 14.11 (the link/route guards) is **deferred** to the shared-workflow pilot (ROADMAP Phase 1.3, where tfs is the pilot) and recorded, not ported locally; plus two P2s.

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
| 14.11 Link/route integrity | **non-conformant (DEFERRED)** | None of the four build-aware validators present. | **Deferred to ROADMAP Phase 1.3** (tfs is the shared-workflow pilot; it gains all four guards via the preset). Do NOT port locally now. Record the deferral. |

**Net: 1 FAIL-P1 to fix this session (14.10 sidecars), 14.11 deferred to Phase 1.3 (tracked), 2 P2, rest PASS.** No P0.

## 3. Corrections to reach full compliance

- **P1 (14.10) Delete the seven `.md` sidecars.** Remove each; move any rationale they carry into a comment in the config/generator itself or into one short `docs/` page (for example a "generated artifacts" reference). Confirm `git ls-files | grep -E '\.(mjs|json)\.md$'` is empty.
- **14.11 (DEFERRED, do NOT port locally now) - Link/route integrity guards.** Adopt them via the shared reusable workflow at ROADMAP Phase 1.3, where tfs is the designated pilot and gains all four guards (`check-rendered-links`, `check-route-parity`, `verify-edit-links`, `remark-resolve-links`) from the preset. Porting locally now is the wrong order: three of the four carry a `BASE` / edit-URL literal whose single-source extraction must land in pm-skills (the donor) first, with a test, because a wrong base makes the rendered-link check pass while the live site 404s; a hand-ported guard also risks the documented crash-on-malformed-input failure. **This session: do not add local validators. Instead record the deferral** (in this repo's `release-plan.md` and `spec.md`): "14.11 deferred to Astro standard ROADMAP Phase 1.3 (shared `workflow_call` pilot)." Do NOT pre-commit a `route-manifest.txt`; its format is defined by the shared check at pilot time.
- **P2 (14.8) Align the `check` job Node pin** to `node-version-file: .nvmrc` so every job reads the single pin (currently the `check` job hardcodes `22`).
- **P2 (editLink) Verify and fix the `editLink` `/site/` segment by hand now.** `editLink.baseUrl` is `.../edit/main/` without the `/site/` segment the other Pattern S repos carry. This is the one latent correctness item `verify-edit-links` would have caught, so do not let the 14.11 deferral hide it: spot-check that a hand-authored page's "Edit" link resolves to a real `.../edit/main/site/src/content/docs/...` path, and add `/site/` to `editLink.baseUrl` if it 404s.

## 4. Implementation checklist (the agent updates this; copy into release-plan.md)

- [ ] Create `docs/internal/release-plans/astro-starlight-conformance/spec.md` + `release-plan.md`.
- [ ] **P1** Delete the 7 `.md` sidecars; relocate any rationale into config comments or one docs page.
- [ ] **P1** Confirm `git ls-files | grep -E '\.(mjs|json)\.md$'` is empty; site still builds.
- [ ] **14.11 DEFERRED** Record the deferral in `spec.md` + `release-plan.md` ("14.11 deferred to Astro ROADMAP Phase 1.3, shared `workflow_call` pilot"). Do NOT add local validators or a `route-manifest.txt`.
- [ ] **P2** Set the `check` job to `node-version-file: .nvmrc`.
- [ ] **P2 (editLink)** By hand: confirm a hand-authored page's edit link resolves; add `/site/` to `editLink.baseUrl` if it 404s.
- [ ] Run `cd site && npm run build`; site builds; `git ls-files` shows no build output.
- [ ] Open PR(s); CI green; await maintainer review.

## 5. Acceptance criteria (done = all true)

- `git ls-files | grep -E '\.(mjs|json|yml|yaml)\.md$'` returns nothing.
- 14.11 is recorded as deferred to Phase 1.3 in `spec.md` + `release-plan.md`; no local validators or `route-manifest.txt` were added this session.
- Edit links on hand-authored pages resolve to real source paths (verified by hand; `editLink.baseUrl` carries `/site/`).
- Every CI job resolves Node from `.nvmrc` (=24); no hardcoded `node-version` remains.
- `cd site && npm run build` green; no tracked build output; PR(s) prepared, not merged without confirmation.
