# pm-skills Astro conformance - adversarial review findings + learnings

> Review of the pm-skills site-standard conformance change (branch
> `chore/astro-site-14-conformance`, on top of `main` @ `1eea16f`) against the family
> Astro site standard ([`../SITE-STANDARD.md`](../SITE-STANDARD.md), clauses 14.1-14.11)
> and the conformance packet ([`pm-skills.md`](pm-skills.md)).
> Date: 2026-06-02. Method: 6 parallel adversarial reviewers (one per lens), each
> instructed to refute correctness with concrete evidence; findings synthesized and
> each actionable item verified directly before disposition.

## 1. What was reviewed

The conformance change implements the packet's one P1 and three P2 corrections:

| Clause | Correction | Files |
|---|---|---|
| 14.7 (P1) | Single-source the base path; parameterize the validator; add a wrong-base-fails test | `scripts/site-base.mjs` (new), `scripts/check-rendered-links.mjs`, `scripts/check-rendered-links.test.mjs` (new), `site/astro.config.mjs` |
| 14.9 (P2) | Ship `robots.txt` pointing at the sitemap | `site/public/robots.txt` (new) |
| A-2 (P2) | Set the `#5C7CFA` brand accent | `site/src/styles/custom.css` |
| 14.8 (P2) | Pin Astro `6.4.2` family-wide; read the workflow Node pin from `.nvmrc` | `site/package.json`, `site/package-lock.json`, `.github/workflows/create-issues-from-drafts.yml` |
| (CI) | Run the new test in CI | `.github/workflows/validation.yml` |

Plus the plan/CHANGELOG docs.

## 2. Verdict

**No CRITICAL or HIGH findings. The change is correct and standard-conformant.**
The most-probed risks (refactor behavior preservation of a load-bearing validator,
the 6.3.3 -> 6.4.2 bump perturbing rendered output, cross-OS CI) all held up under
direct verification. Multiple lenses independently converged on the same two real
items (a latent guard crash and a stale doc count), which raised confidence that
those were genuine rather than artifacts of one reviewer.

Severity tally: 1 MEDIUM, 5 LOW, several NIT, plus explicit positive confirmations.

## 3. Findings and dispositions

| # | Sev | Finding | Disposition |
|---|---|---|---|
| F1 | MEDIUM | Plan doc said the test had **4 cases / 4 pass**; it has **5** (the test was tightened from 4 to 5 after the doc was written) | **FIXED** - `release-plan.md` updated to 5 cases / 5 pass, all five enumerated |
| F2 | LOW | New CLI guard `import.meta.url === pathToFileURL(process.argv[1]).href` **throws** on a bare import where `argv[1]` is undefined (`node -e`, REPL). New crash surface the pre-refactor code lacked | **FIXED** - null-guarded: `process.argv[1] && ...`. Verified a bare dynamic import now imports cleanly; CLI + test paths unchanged |
| F3 | LOW | Verification-log row claimed git status shows "only the 9 intended files"; it shows 13 (9 impl + 4 docs) | **FIXED** - reworded to "9 implementation files + 4 planning/CHANGELOG docs" |
| F4 | LOW | Test PASS/default cases are tautological w.r.t. the base **value** (they derive fixture + base from the same import); only the explicit value-pin (test 1) catches a wrong value in `site-base.mjs` | **ACCEPTED + hardened** - this is by design (tests 2-4 prove *consumption*; the value-pin proves *value*). Added a "load-bearing, do not remove" comment on test 1 |
| F5 | LOW | `package.json` uses caret `^6.4.2` (a floor), not an exact pin; determinism comes from the lockfile | **ACCEPTED** - matches repo convention (`sharp ^`, `astro-mermaid ~`); CI uses `npm ci` (lockfile-authoritative, confirmed). Doc wording tightened to "lockfile-pinned `6.4.2` (floor `^6.4.2`)" |
| F6 | NIT | STRICT_ANCHORS "scrolls to top, does not 404" rationale comment dropped in the refactor | **FIXED** - rationale restored next to the declaration |
| F7 | NIT | `spec.md` base-literal acceptance bullet did not mention the in-scope test pin (a literal `git grep` shows one extra hit) | **FIXED** - acceptance reworded to name the test pin, sitemap URL, and repo/slash-command literals as out of scope |
| F8 | NIT | `robots.txt` embeds the base path literally (4th occurrence of the base) | **ACCEPTED** - Astro cannot template `public/` assets and robots.txt needs an absolute URL; documented as a manual base-change touchpoint until the preset generates it |
| F9 | NIT | `markdown-remark` 7.1.2 + 7.2.0 coexist after the bump | **ACCEPTED** - intentional npm hoisting; Starlight stays on 7.1.2, which is *why* anchor ids are byte-stable. Documented a "do not `npm dedupe` without re-verifying STRICT_ANCHORS" caution |
| F10 | NIT | Light-mode accent link text (`#5C7CFA` on white = 3.67:1) is AA-borderline | **ACCEPTED** - inherent to the standardized brand hue; Starlight's own default is ~3.6:1 (no regression). Flagged for the shared preset's `accent.css` to address family-wide |
| F11 | NIT | `create-issues` uses `setup-node@v6` while other workflows use `@v5` | **ACCEPTED (out of scope)** - predates this PR; `node-version-file` works on both majors |
| F12 | NIT | Workflow files + `.nvmrc` carry CRLF | **ACCEPTED** - benign (setup-node trims; YAML parses); any normalization is a repo-wide `.gitattributes` job, not this PR |

### Positive confirmations (explicitly verified clean)

- **Behavior preservation:** all exit-code scenarios (clean / broken-link / advisory-anchor / strict-anchor / missing-dist / empty-dist) match the pre-refactor script. The `pages` -> `anchorPages` rename fixed a harmless pre-existing shadow with no logic change.
- **Bump parity:** lockfile churn is exactly astro + two nested astro-core helpers; `github-slugger` stays a single 2.0.0 copy and Starlight stays on markdown-remark 7.1.2, so heading/anchor ids are byte-stable. Astro 6.4.0-6.4.2 changelog has no head/sitemap/canonical/redirect/anchor/base changes. 386 routes preserved.
- **The high-sev vuln is pre-existing** (`dompurify` 3.4.4 via `astro-mermaid` -> `mermaid`, identical in `main`), not introduced by the bump.
- **robots.txt** is served at dist root (`/robots.txt`, not under base) and its sitemap URL matches the emitted `sitemap-index.xml`; both scanners ignore it (they filter `.html`).
- **CI cross-platform:** the new `node --test` step uses only builtins + two local `.mjs`, needs no `node_modules`, is Windows-path-safe, and runs on both matrix legs (`if: always()`, no OS guard).
- **House rule:** zero em-dash / en-dash characters in any changed or new authored file.
- **CHANGELOG honesty:** the remove-then-readd churn of the base module is correctly collapsed to net state under `[Unreleased]`; the "CI green" claim is correctly left unticked and hedged as "local equivalents green, awaiting CI."

## 4. Re-verification after fixes

- `node --test scripts/check-rendered-links.test.mjs` -> 5 pass / 0 fail.
- `node -e "import('./scripts/check-rendered-links.mjs')"` -> imports clean (no crash).
- `node scripts/check-rendered-links.mjs site/dist` -> PASS (CLI path intact).
- (Pre-fix gates already green: build 386 routes, route-parity 386=386, STRICT_ANCHORS 0/0, verify-edit-links 358, no tracked build output.)

## 5. Learnings (for the standard, the packet, and future rollouts)

**For the standard / packet authors:**

1. **The "single-source base" acceptance criterion needs sharper wording.** The packet's `git grep -nF "/pm-skills"` "only in site-base.mjs" criterion is literally false the moment you add the recommended test: a good test *pins the expected value* with one assertion, which is a legitimate second occurrence. Recommend the standard phrase it as "the base appears as a *consumed config value* only in the single source; a test value-pin and the (untemplatable) robots.txt sitemap URL are sanctioned." This will recur on every sibling rollout.
2. **14.11 guard-robustness applies to the new CLI entry seam, not just the link logic.** Parameterizing a validator (standard preset-migration step 2) means adding a `run-only-if-main` guard; that guard is itself a guard-robustness surface and must null-check `process.argv[1]`. Worth a one-line note in the preset spec's "lift BASE into parameters" step so the three siblings don't each re-introduce the `pathToFileURL(undefined)` crash.
3. **robots.txt cannot be single-sourced under Pattern S** (Astro copies `public/` verbatim). The standard should either bless the literal base in robots.txt explicitly (14.9) or specify that the shared preset *generates* it from the base. Until then every site will carry this "4th base literal."
4. **Family version conformance is a lockfile property, not a `package.json` property.** "Pin one resolved set" is satisfied by the committed lockfile + `npm ci`, and chasing latest (here `^6.4.2` resolving to 6.4.3) actively *breaks* convergence. The standard already implies this; making it explicit ("pin = lockfile-resolved, not caret range; bump in lockstep") would prevent a well-meaning per-repo `npm update`.
5. **The mandated `#5C7CFA` is AA-borderline for light-mode link text** (3.67:1). Not a per-repo defect, but the shared `accent.css` should ship a slightly darker `--sl-color-text-accent` for light mode if AA on body-size links matters family-wide.

**For the execution process:**

6. **Update the verification log when you tighten the artifact.** F1/F3 both came from editing code/scope *after* writing the plan doc and not re-syncing the counts. A verification log is only trustworthy if its numbers are re-derived at the moment of the claim, not carried forward.
7. **The adversarial fan-out earned its cost on the blind-spot findings.** The two real items (guard crash, parity-via-hoisting reasoning) are exactly what the automated gates can't see: route-parity is presence-only and would not catch a `<head>`/anchor shift, and no fixture exercised a missing `argv[1]`. Diverse-lens review (not N identical reviewers) is the right shape when the failure modes are heterogeneous.
8. **Reconcile inherited plans by reading their end-state, not their title.** The `_unreleased` P1 plan was marked "ABSORBED" and *claimed* the base was single-sourced - but it had been single-sourced in `astro.config.mjs` only, and deleting the interim module re-duplicated it into the checker. Trusting the "absorbed" label would have missed that the P1 was a live regression.

## 6. Status

Implementation complete on `chore/astro-site-14-conformance`; all gates green locally;
fixes above applied and re-verified. **Not pushed or merged** - awaiting maintainer
review per the packet. The sibling rollouts (thinking-framework-skills,
agent-skills-toolkit, writing-style-catalog) should fold learnings 1-5 into their
packets before execution.
