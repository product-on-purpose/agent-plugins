# Draft: runner consumption (how each repo runs the relocated conformance gate)

> Resolves the one open sub-question that gates Phase 0 (truth and relocation): once the conformance runner (`scripts/check.mjs` + `scripts/checks/` + `scripts/lib/`) is relocated out of `agent-skills-toolkit` and into `agent-plugins/standards/checks/`, HOW does each plugin repo (agent-skills-toolkit, pm-skills, thinking-framework-skills, writing-style-catalog) get and run that one canonical checker against itself in its own CI? A repo's CI can only run code it physically has, so relocating the checker out of the repo that runs it creates a consumption gap that MUST be closed in the same breath as the move.

This is staged planning text. It is not yet landed. It resolves a Phase 0 sub-decision and recommends recording the chosen mechanism as a family-law ADR (a D14-class decision, see Section 7). Package cross-references: the phase that consumes this is [`../02-roadmap.md`](../02-roadmap.md) Phase 0; the as-built starting point is [`../01-current-state.md`](../01-current-state.md); the locked decisions are [`../03-decisions.md`](../03-decisions.md); the governance home and relocation sequencing are [`../../../../standards/GOVERNANCE.md`](../../../../standards/GOVERNANCE.md) Section 3 and [ADR 0001 (standard governance and home)](../../../../standards/decisions/0001-standard-governance-and-home.md); the Phase 4 shared site workflow this dovetails with is described in [`../02-roadmap.md`](../02-roadmap.md) Phase 4.

## 1. Problem statement (the consumption question, in plain terms)

Today the conformance gate is self-hosted. `agent-skills-toolkit/.github/workflows/ci.yml` runs one line - `node scripts/check.mjs` - and that script lives in the same repo, so the checkout the CI already does is enough: the checker and the thing being checked are the same working tree. The gate "loads the plugin, runs every registered check, prints the tier and findings, and exits with a real status code" against `process.cwd()` (the repo root). This is the G2 self-hosting target the checker header names: the toolkit proves itself with its own checker.

Phase 0 executes ADR 0001 by moving `STANDARD.md` to `standards/STANDARD.md` and the checker (`scripts/check.mjs`, `scripts/checks/`, `scripts/lib/`) to `agent-plugins/standards/checks/`. The instant that move lands, the self-hosting assumption breaks for every plugin:

- `agent-skills-toolkit` would no longer carry the checker it runs in `ci.yml`. Its own gate goes dark unless it re-acquires the checker from the new home.
- the other three plugins (pm-skills, thinking-framework-skills, writing-style-catalog) need to run the same canonical checker against themselves to demonstrate conformance at their pinned commit, which is exactly what the Phase 2 marketplace re-pin check (check 8, see [`ci-repin-check.md`](ci-repin-check.md)) asserts: a pinned repo MUST be CI-green at its sha, and conformance "is demonstrated by the Standard's checks passing at the pinned commit ... in the plugin's own CI."

So the question is concrete and unavoidable: a repo CI can only run code it has. Once the one canonical checker lives in `agent-plugins/standards/checks/`, by what mechanism does each plugin's CI obtain that checker at a known version and run it against its own working tree, without re-copying the checker into four repos (which would recreate exactly the four-drifting-copies problem the relocation exists to end)?

Two invariants constrain every answer:

- **One canonical checker.** The decouple-and-pin discipline ([`../../../../standards/GOVERNANCE.md`](../../../../standards/GOVERNANCE.md) Section 2) says there is exactly one normative `STANDARD.md` and no divergent copies, only pinned version references. The checker is the Standard's teeth (ADR 0001 decision drivers: "the Standard's teeth are its CI checks"). A consumption mechanism that re-introduces N maintained copies of the checker violates the same rule the relocation enforces for the text.
- **Pin by version, not by floating HEAD.** Each plugin pins the family law by version and re-adopts on its own cadence (D2 rollout: Hybrid, [`../03-decisions.md`](../03-decisions.md)). The checker each repo runs MUST be pinnable to a known `agent-plugins` ref, so a plugin grades against the version of the checker that matches its declared `standard` pin, and a checker change cannot silently re-grade a plugin that has not re-adopted.

The checker also carries path conventions the relocation MUST preserve, and the consumption mechanism MUST respect: the gate is invoked as the GATE_PATH entry point (`node <checker> <root>`, where the first non-flag argument is the root to grade, defaulting to `process.cwd()`), and the folder-README inventory check (G8 in `STANDARD.md`) operates on the graded repo's FIXED_ROOTS, not the checker's own folders. Whatever mechanism is chosen MUST run the checker with the GRADED repo as the root argument, not the checker's repo.

## 2. The four options (with concrete trade-offs)

### Option A - npm package (`@product-on-purpose/standards-checks`)

Publish the checker from `agent-plugins/standards/checks/` as a versioned npm package with a `bin` entry. Each plugin adds it as a dev dependency pinned by SemVer, and its CI runs the gate via the package bin (`npx standards-check .` or an npm script that resolves the installed bin against the repo root).

- **Mechanics.** The package's `package.json` declares `"bin": { "standards-check": "check.mjs" }`; `npm ci` installs it into `node_modules/.bin`; the GATE_PATH invocation becomes `npx standards-check .` (root = the calling repo's cwd). Pinning is the `package.json` version range plus the committed lockfile, so the resolved checker version is reproducible per repo and per commit.
- **Pros.** Idiomatic for a Node toolchain (the checker is already pure ESM Node with `scripts/lib/`). Strong, lockfile-reproducible version pinning. The package boundary forces a clean public surface (the registered checks and the GATE_PATH contract) and discourages a plugin reaching into checker internals. Works identically locally and in CI, preserving the Standard's "local == CI" property (`ci.yml` comment, Standard Section 4.1/4.4).
- **Cons.** Requires a publish pipeline and a registry (npmjs public, or a GitHub Packages private registry with auth wired into every plugin's CI). That is a new release line and a new credential to maintain - precisely the kind of standing overhead ADR 0001 weighed against at four-plugin scale. A version bump to the checker is a publish-then-bump-consumers loop. The checker today reads sibling files by relative path (`./lib/...`, `./tier-report.mjs`); packaging MUST guarantee every transitively-required file under `scripts/checks/` and `scripts/lib/` ships in the `files` allowlist, or the gate breaks at a consumer with a missing-module error.

### Option B - git submodule

Each plugin adds `agent-plugins` (or a checker-only subtree) as a git submodule pinned to a commit, and CI runs `node path/to/submodule/standards/checks/check.mjs .`.

- **Mechanics.** `git submodule add` plus a recorded submodule commit; CI checks out with `submodules: true` (or `recursive`), then invokes the gate at the submodule path with the repo root as the argument.
- **Pros.** Pins by exact commit (stronger than a SemVer range). No registry, no publish step, no credential beyond normal repo read. The checker source is present on disk for local runs and debugging.
- **Cons.** Submodules are a notorious contributor-experience tax: easy to forget `--recursive`, easy to leave a stale or detached submodule pointer, and they pull the WHOLE `agent-plugins` repo (marketplace registry, docs, governance) into every plugin to get one `checks/` folder unless a dedicated checker-only repo is split out first (which is the rejected dedicated-repo move from ADR 0001 in disguise). The pin is a bare commit sha with no human-readable version, which fights the "pin by version" discipline (you cannot tell at a glance which Standard version a submodule sha corresponds to). It couples every plugin's checkout to agent-plugins' layout.

### Option C - reusable GitHub Actions workflow (recommended; see Section 3)

Author one workflow in `product-on-purpose/.github` (or, equivalently, a callable workflow in `agent-plugins`) that, when called by a plugin's CI, checks out `agent-plugins/standards/` at a pinned ref to OBTAIN the canonical checker, checks out the CALLING repo, and runs the gate (`node standards/checks/check.mjs <calling-repo-root>`) against the caller. Each plugin's `ci.yml` shrinks to a few lines that `uses:` the reusable workflow at a pinned ref.

- **Mechanics.** A reusable workflow called from another repo runs in the CALLER's context: the `github` context, secrets default, and the implicit repository are the caller's, and the workflow's own contents are incorporated into the caller's run at call time ([GitHub: Reuse workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)). Critically, calling a reusable workflow does NOT automatically place the checker's code on the runner. The called workflow MUST do two explicit checkouts: (1) `actions/checkout` with `repository: product-on-purpose/agent-plugins` and `ref: <pinned>` into a subdirectory to fetch `standards/checks/`; (2) `actions/checkout` of the caller into the workspace. It then runs `node <checker-path>/check.mjs <caller-path>`. The caller pins the mechanism via `uses: product-on-purpose/.github/.github/workflows/standards-gate.yml@<ref>`.
- **Pros.** ZERO duplication and exactly one canonical checker - the defining requirement. Pins by version: the caller's `@<ref>` (a tag or sha) selects the checker version, satisfying decouple-and-pin without a package registry or a submodule pointer. No publish pipeline, no new registry credential. Each plugin's CI collapses to a thin call (the same shape the Standard already wants - CI holds no validation logic, only invokes the portable runner). It dovetails with the Phase 4 shared `astro-site.yml` reusable workflow: both are reusable workflows pinned by ref, so the family learns one consumption pattern and applies it to both the conformance gate and the site CI.
- **Cons.** GitHub-specific (the gate runs portably as `node check.mjs` locally and on any CI, but THIS consumption wiring is GitHub Actions). A reusable workflow's `github.ref` reflects the CALLER, not the pinned callee ref ([actions/toolkit #1264](https://github.com/actions/toolkit/issues/1264)), so the callee workflow MUST hardcode or input the agent-plugins ref to check out rather than infer it from context. Local reproduction needs a documented one-liner (`node <path-to-local-agent-plugins>/standards/checks/check.mjs .`) since the workflow itself only runs in Actions. A composite action is a close variant; a reusable workflow is preferred because it owns the full job (Node setup, both checkouts, the gate step) rather than only a step, keeping each caller truly thin.

### Option D - vendored-and-synced

Keep a copy of the checker inside each plugin (vendored under, say, `scripts/standards-checks/`) and add an orchestrated sync campaign (one of the D2 PUSH campaigns) that re-copies the canonical checker into all four repos whenever it changes, plus a check that the vendored copy matches the canonical one at the pinned version.

- **Mechanics.** A fleet campaign ([`orchestration-campaigns.md`](orchestration-campaigns.md)) copies `standards/checks/` into each repo; a guard check (a hash or a `diff` against the pinned canonical) fails CI if a vendored copy drifts.
- **Pros.** Each plugin's CI is unchanged in shape (still `node scripts/.../check.mjs`), fully offline, no cross-repo checkout at run time, trivial local runs.
- **Cons.** This is the four-drifting-copies anti-pattern the relocation exists to kill, re-introduced deliberately and then policed by tooling. It maximizes maintenance: every checker change is a four-repo PUSH plus a drift guard, and a missed sync silently grades a plugin against a stale checker. It violates the spirit of decouple-and-pin (one canonical copy, pinned by reference, never re-copied) even though a hash guard makes the drift detectable. It is the option of last resort, retained here only to show the trade-off space.

## 3. Recommendation: the reusable GitHub Actions workflow (Option C), npm package (Option A) the named runner-up

**Adopt Option C, the reusable GitHub Actions workflow, as the consumption mechanism.** It is the only option that simultaneously satisfies both invariants from Section 1 - one canonical checker AND pin-by-version - with no standing release line, no registry credential, and no per-repo copy. It collapses each plugin's CI to a thin pinned call, which is exactly the CI-holds-no-logic shape the Standard already mandates, and it dovetails with the Phase 4 shared `astro-site.yml` reusable workflow so the family maintains one consumption pattern, not two.

Concretely, the workflow lives at `product-on-purpose/.github/.github/workflows/standards-gate.yml` (the org `.github` repo is the conventional home for org-shared reusable workflows; equivalently it MAY live in `agent-plugins` if the family prefers to keep the gate beside the checker). Its job:

1. `actions/checkout` of `product-on-purpose/agent-plugins` at a pinned `ref` (passed as a workflow input defaulting to a tag), into `./_standards`, to obtain `standards/checks/`.
2. `actions/checkout` of the calling repo into the workspace root.
3. `actions/setup-node` from the caller's `.nvmrc` (the family Node floor).
4. `node ./_standards/standards/checks/check.mjs .` - the GATE_PATH invocation with the CALLING repo root (`.`) as the argument, so G8 folder-README and all checks grade the caller, not the checker.

Each plugin's `ci.yml` conformance job becomes:

```yaml
jobs:
  conformance:
    uses: product-on-purpose/.github/.github/workflows/standards-gate.yml@<pinned-tag-or-sha>
    with:
      standards-ref: <agent-plugins-ref matching this plugin's standard pin>
```

**The npm package (Option A) is the named runner-up.** If the family later publishes the checker for consumers OUTSIDE GitHub Actions (a different CI provider, a pre-commit hook, an external adopter), the npm package is the right second mechanism, and the two compose cleanly: the reusable workflow MAY itself `npm i -g` the package instead of checking out agent-plugins. Choosing C first does not foreclose A; it defers the publish pipeline until an external consumer actually exists, matching ADR 0001's "do not pay standing overhead before scale or external adoption warrants it." Submodule (B) and vendored-and-synced (D) are rejected: B fails the pin-by-version and contributor-experience tests and drags the whole repo along; D deliberately re-creates the drift the relocation removes.

## 4. Phase 0 sequencing reconciliation (ADR 0001 vs the roadmap)

There is a real ordering tension to resolve, and it is the heart of why this sub-decision gates Phase 0.

- **ADR 0001 sequenced the physical relocation AFTER the shared-CI extraction.** Its decision outcome reads: "the physical relocation of `STANDARD.md` plus extraction of the generic checks into `standards/checks/` is a later, separate landing, sequenced after the documentation-site question settles and the shared CI workflow is built." In that ordering, the shared CI workflow (the consumption mechanism) exists first, so when the checker moves, every repo already has a way to run it.
- **The roadmap pulls the relocation forward to Phase 0** because the split home is now the active blocker for every later amendment ([`../02-roadmap.md`](../02-roadmap.md) Phase 0 dependencies: "this roadmap brings the move forward as its own deliberate landing because the split home is now the active blocker"). But moving the checker in Phase 0 without first deciding consumption would land a half-done relocation: the checker would be in its new home with no repo able to run it, and `agent-skills-toolkit`'s own gate (the G2 self-hosting target) would go dark.

Two ways to reconcile:

- **(Recommended) Pull the consumption decision INTO Phase 0.** Treat "relocate the checker" and "wire consumption" as one atomic Phase 0 landing: the move PR (or its immediate successor in the same phase) also stands up the reusable workflow and re-points `agent-skills-toolkit/ci.yml` to call it. This is the recommendation because it guarantees the relocation is never half-done - the checker never sits in its new home unreachable - and agent-skills-toolkit's own gate keeps working across the move with no dark window. It is also faithful to ADR 0001's intent ("the home decision is really where the text and its checks live together"): the consumption wiring is what makes the new home a working home. The cost is that Phase 0 grows from a pure text-and-path relocation into a relocation-plus-CI-wiring landing, which is acceptable because the wiring is small (one reusable workflow plus one thin caller for agent-skills-toolkit; the other three plugins re-point on their own re-adoption cadence per D2).

- **(Alternative, not recommended) Split Phase 0 into "text relocation now / consumption wiring lands with Phase 4."** Move `STANDARD.md` text and the checker files in Phase 0, but keep `agent-skills-toolkit` running the checker from a temporary in-repo path (or a thin local pointer) until the Phase 4 shared-CI work stands up the reusable workflow. This keeps Phase 0 minimal and lets the reusable workflow be built once, alongside `astro-site.yml`. The cost is a transitional period where the checker has two effective locations (canonical in agent-plugins, operationally read from a toolkit-local copy or path shim), which is exactly the split-state ADR 0001 warns "MUST be stated wherever the Standard is referenced" and which the roadmap's Phase 0 exists to END, not to extend. It trades a clean Phase 0 exit for a longer-lived inconsistency.

**Recommendation: pull the consumption decision into Phase 0 (the first option above).** The relocation and its consumption wiring land together so the move is atomic and no gate ever goes dark. The reusable workflow is built in Phase 0 for the conformance gate, and Phase 4 reuses the SAME pattern (not the same workflow) for `astro-site.yml`; the two are siblings, not a dependency that forces conformance consumption to wait for the site work.

## 5. Concrete migration steps (and what each repo's CI becomes)

Sequenced inside Phase 0, after (or within) the checker relocation:

1. **Relocate the checker (the ADR 0001 move).** Move `scripts/check.mjs`, `scripts/checks/`, and `scripts/lib/` from `agent-skills-toolkit` into `agent-plugins/standards/checks/`, preserving the internal relative-import layout (the entry point imports `./lib/...` and `./tier-report.mjs`; keep that tree intact so the GATE_PATH invocation resolves). Tag `agent-plugins` so there is a pinnable ref.
2. **Author the reusable workflow** at `product-on-purpose/.github/.github/workflows/standards-gate.yml` with the two-checkout + setup-node + gate job described in Section 3. Inputs: `standards-ref` (which agent-plugins ref to fetch the checker from) and optional `gate-args` (for example `--strict` or `--profile`, matching the CLI in `check.mjs`).
3. **Re-point `agent-skills-toolkit/ci.yml`.** Replace the inline `node scripts/check.mjs` step with a `uses:` call to the reusable workflow at a pinned tag, passing `standards-ref` equal to the agent-plugins ref that carries Standard 0.12 (its current pin). agent-skills-toolkit keeps its `npm test` job in place (its unit tests are repo-local and stay); only the conformance step moves to the shared workflow. Net: the toolkit no longer self-hosts the checker but still runs the same gate, now sourced canonically.
4. **The other three plugins re-point on their own re-adoption cadence (D2 PULL).** pm-skills picks this up as part of its Phase 1 convergence (when it gains a `library.json` and a real conformance job); thinking-framework-skills and writing-style-catalog re-point when they next re-adopt their `standard` pin. The reusable workflow is pull-consumed, exactly like the version pin, so no synchronized cross-repo flip is needed.
5. **Document the local-run one-liner.** Because the gate now lives in agent-plugins, the local reproduction command becomes `node <path-to-agent-plugins>/standards/checks/check.mjs .` from a plugin root. Record this in the relocated `standards/checks/README.md` (folder-README per G8) so "local == CI" stays reproducible.

What each repo's conformance CI becomes: a thin `uses:` call to `standards-gate.yml` at a pinned ref, with `standards-ref` selecting the checker version that matches that repo's `standard` pin. No repo carries the checker; all four run the one canonical checker; each pins its version independently.

## 6. The named enforcing check this implies

This sub-decision produces (and is verified by) a concrete check, in two layers:

- **Per-repo:** each plugin's CI runs the shared conformance gate GREEN at a pinned standards ref. This is the gate exit-code contract preserved across the move: `node standards/checks/check.mjs .` exits non-zero on any gated error, run via the reusable workflow at a pinned `standards-ref`. The named check is "shared conformance gate green at the declared standards ref."
- **At the registry:** the Phase 2 marketplace re-pin check (check 8 in [`ci-repin-check.md`](ci-repin-check.md)) already asserts a pinned plugin is CI-green at its sha. With consumption wired through the reusable workflow, "CI-green" now provably means "the one canonical gate ran green," not "some repo-local copy of a checker ran." The consumption mechanism is what gives check 8 its meaning: it makes the green signal authoritative because every repo runs the same checker.

A clause without a named enforcing check is aspirational ([`../../../../standards/GOVERNANCE.md`](../../../../standards/GOVERNANCE.md) Section 7); this one has teeth on both layers.

## 7. This is THE one open sub-decision gating Phase 0 - record it as a family-law ADR (D14-class)

Phase 0's exit gate ([`../02-roadmap.md`](../02-roadmap.md)) requires that "the conformance runner passes green at the relocated path." That exit cannot be met until the consumption mechanism is chosen, because "passes green at the relocated path" presumes a repo can RUN the runner from its relocated path - which is precisely this question. The relocation and the consumption mechanism are inseparable: you cannot land one cleanly without deciding the other, or you land a half-done move (Section 4).

Therefore this is the single open sub-decision that gates Phase 0, and it SHOULD be recorded as a family-law ADR when chosen - a D14-class decision in the `../03-decisions.md` series and an ADR in [`../../../../standards/decisions/`](../../../../standards/decisions/), the same trail ADR 0001 began. It is family law (not a single plugin's choice) because it determines how EVERY plugin consumes the family's one canonical checker; it belongs beside ADR 0001 (which decided the home) as the decision that decided how the home is consumed. The ADR SHOULD: state the chosen mechanism (recommended: the reusable GitHub Actions workflow, npm package as runner-up); record the Phase 0 sequencing reconciliation (recommended: consumption pulled into Phase 0, relocation atomic); name the enforcing check (shared gate green at the pinned standards ref); and note the deferred npm-package path for any future external consumer.

## 8. External references

- GitHub Actions, reusing workflows (the reusable-workflow mechanics, caller context, and pinning by ref): https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows
- GitHub Actions reusable workflow runs in the caller context (so the callee MUST explicitly check out the checker repo at a pinned ref): https://github.com/actions/toolkit/issues/1264
- npm `bin` field (the package-bin consumption mechanism for the runner-up option): https://docs.npmjs.com/cli/v10/configuring-npm/package-json#bin
- Git submodules (the submodule option mechanics and the recursive-checkout caveat): https://git-scm.com/book/en/v2/Git-Tools-Submodules
- SemVer (the version-pin shape for the npm-package option): https://semver.org
- RFC 8174 / BCP 14 (the MUST / SHOULD / MAY keywords used here): https://www.rfc-editor.org/rfc/rfc8174
