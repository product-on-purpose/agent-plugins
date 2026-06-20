# Spike: runner consumption (D14) - prove the runner grades an arbitrary checked-out root

> Confirming spike for D14 (runner-consumption = reusable GitHub Actions workflow), the decision recorded against OQ-2 (runner-consumption model) in [`../05-open-questions.md`](../05-open-questions.md). The companion analysis is the draft [`../drafts/runner-consumption.md`](../drafts/runner-consumption.md) (Option C - reusable GitHub Actions workflow - recommended). This spike does the one thing the draft asserts but does not execute: it RUNS the real runner against an external repo root and captures the output, then ships the two ready-to-use GitHub Actions YAML artifacts the consumption model needs.

## 1. Objective

The reusable-GitHub-Actions-workflow consumption model (D14, runner-consumption = reusable workflow) rests on one load-bearing mechanical assumption: that the single canonical conformance runner can grade an ARBITRARY checked-out repo root, supplied as an argument, rather than only the repo it physically lives in. A GitHub Actions reusable workflow runs in the CALLER's context and does NOT auto-place the callee's code on the runner ([GitHub: Reuse workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)), so the model needs two things to be true:

1. the runner accepts a target root as an argument (so it can grade a repo other than its own), and
2. a second `actions/checkout` of `standards/` places the canonical runner on the runner alongside the caller's tree.

This spike proves (1) directly with captured output, and supplies the YAML that operationalizes (2). If (1) holds, the runner is relocatable into `standards/checks/` and consumable via a reusable workflow without re-copying it into four repos - which is exactly the decouple-and-pin invariant the relocation exists to honor.

## 2. The mechanism, confirmed in source

`agent-skills-toolkit/scripts/check.mjs` parses its CLI in `parseArgs(argv)` (lines 57-70). The first non-flag token becomes `root`; with no positional argument it falls back to `process.cwd()`:

```js
// scripts/check.mjs, parseArgs (the relevant branches)
else if (!a.startsWith("--") && root === undefined) root = a;   // first non-flag token = root
// ...
return { root: root ?? process.cwd(), mode, profile, strict };  // default = cwd
```

That `root` flows into `loadPlugin(root)` and `runGate(root, ctx, ...)` (lines 82-83), and the tier report is computed as `computeTierReport(root, ctx, ...)` (line 88). Nothing in the gate path is hardwired to the runner's own directory: the graded root is whatever path you hand it. This is the GATE_PATH contract the draft names - `node <checker> <root>` - and it is the precondition for relocating the runner out of the repo it grades.

## 3. Captured run evidence (real output, both runs)

Environment: Node v22.12.0 on Windows. The runner lives in `agent-skills-toolkit`; it was invoked against a DIFFERENT repo root (`thinking-framework-skills`) and, as a control, against its own root.

### 3.1 External target - thinking-framework-skills (a different repo than the runner's)

Command:

```
node "E:/Projects/product-on-purpose/agent-skills-toolkit/scripts/check.mjs" "E:/Projects/product-on-purpose/thinking-framework-skills"
```

`thinking-framework-skills/library.json` pins `"standard": "0.8"` (its package `version` is `0.10.0`; the Standard pin is the relevant field). Result lines (the runner emitted 100 findings, all warnings; the tail of the output):

```
  [warn] docs-presence (G10): the architecture pair is incomplete: a page MUST carry doc-role: architecture-overview and another doc-role: architecture-detailed (found overview=false, detailed=false); R-CONTENT-4 / G10 rule 3. [downgraded: introduced in Standard 0.10, after pinned 0.8]  -> docs

Tier: Advanced (no blockers detected)

0 error(s), 100 warning(s).
```

Exit code: `0`.

The proof is in the downgrade annotations. Every G7/G8/G9/G10 finding carries `[downgraded: introduced in Standard 0.10, after pinned 0.8]`. The runner read `thinking-framework-skills`'s OWN `library.json` standard pin (0.8) from the supplied root and applied that repo's pin - not the runner repo's - downgrading post-0.8 errors to warnings so the external repo gates at its declared Standard version. This is unambiguous evidence that the runner loaded and graded the arbitrary root it was handed, honoring that root's pin.

### 3.2 Control - agent-skills-toolkit itself (the runner's own repo)

Command:

```
node "E:/Projects/product-on-purpose/agent-skills-toolkit/scripts/check.mjs" "E:/Projects/product-on-purpose/agent-skills-toolkit"
```

Result:

```
Tier: Advanced (no blockers detected)

0 error(s), 0 warning(s).
```

Exit code: `0`.

The control grades clean (self-hosting still green), confirming the external run's 100 warnings are a property of the external repo's content under its 0.8 pin, not a malfunction of pointing the runner at a foreign tree.

## 4. What this proves

The runner grades an arbitrary root: same binary, two different target repos, each graded against ITS OWN `library.json` standard pin, each with a real tier line and a real exit code. Concretely this confirms:

- **Relocatable.** Because the graded root is an argument and not the runner's own directory, the runner can be moved out of `agent-skills-toolkit` into `agent-plugins/standards/checks/` and still grade any repo. The relocation (Phase 0) does not break the gate's ability to target a repo.
- **Reusable-workflow-consumable.** A reusable workflow that (a) checks out the caller into the workspace and (b) checks out `agent-plugins/standards/` at a pinned ref to obtain the runner, then runs `node standards/checks/check.mjs <caller-root>`, will grade the caller exactly as these local runs graded their targets. The two-checkout shape the draft specifies is mechanically sound: the only thing the reusable workflow adds over these local runs is placing the runner's code on the runner via the second checkout, which the YAML below does.
- **Pin-honoring.** The runner respected the TARGET repo's standard pin (tfs's 0.8), which is the decouple-and-pin behavior the consumption model requires: one canonical runner, but each repo graded against the Standard version it has adopted.

## 5. The two ready-to-use YAML artifacts

These are copy-ready. Paths and pins use placeholders only where a real tag/sha is not yet minted (the runner has not been relocated or pushed to the org `.github` repo yet - see Section 6).

### 5.1 Reusable workflow - `standards-gate.yml`

Lives in `product-on-purpose/.github/.github/workflows/standards-gate.yml` (the org-level `.github` repo; the doubled `.github/.github/workflows/` path is correct - the first `.github` is the repo name, the second is the workflows directory). It is `on: workflow_call` with an input for the agent-plugins ref/version to check out, performs the two checkouts, sets up Node 22.12, and runs the relocated runner against the caller's workspace root.

```yaml
# product-on-purpose/.github/.github/workflows/standards-gate.yml
# Reusable conformance gate. A plugin's CI calls this; it obtains the one canonical
# runner from agent-plugins/standards/ at a pinned ref and grades the CALLING repo.
name: standards-gate

on:
  workflow_call:
    inputs:
      standards-ref:
        description: >-
          The agent-plugins ref (tag or sha) to check out for the canonical runner.
          MUST match the calling repo's library.json "standard" pin policy.
        required: true
        type: string

jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      # 1) Check out the CALLER's repo into the workspace root. A reusable workflow
      #    runs in the caller's context but does NOT auto-place any code on the runner,
      #    so this checkout is explicit.
      - name: Check out caller repo
        uses: actions/checkout@v4

      # 2) Second checkout: obtain the one canonical runner from agent-plugins at a
      #    pinned ref, sparse to standards/ only, into a subdirectory so it does not
      #    collide with the caller's tree.
      - name: Check out canonical standards runner
        uses: actions/checkout@v4
        with:
          repository: product-on-purpose/agent-plugins
          ref: ${{ inputs.standards-ref }}
          path: .standards-runner
          sparse-checkout: |
            standards/
          sparse-checkout-cone-mode: true

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '22.12'

      # 3) Run the relocated runner against the CALLER's workspace root ('.').
      #    The first non-flag arg is the graded root (check.mjs parseArgs); '.' is
      #    the caller's checkout from step 1.
      - name: Run conformance gate
        run: node .standards-runner/standards/checks/check.mjs .
```

Notes that make this correct rather than merely plausible:
- The runner checkout is sparse to `standards/` (cone mode), so the caller's job pulls only the runner subtree, not all of agent-plugins (marketplace registry, docs, governance).
- `path: .standards-runner` keeps the runner out of the caller's working tree so the gate grades the caller's files, not the runner's. The gate path is then `.standards-runner/standards/checks/check.mjs` and the graded root is `.` (the caller).
- `ref: ${{ inputs.standards-ref }}` is REQUIRED rather than inferred: a reusable workflow's `github.ref` reflects the CALLER, not the pinned callee, so the agent-plugins ref MUST be passed in, not read from context.

### 5.2 Thin caller - `ci.yml` (each plugin repo carries this)

Lives in each plugin repo at `.github/workflows/ci.yml`. It is `on: pull_request` / `push`, and its conformance job is one `uses:` of the reusable workflow at a pinned tag-or-sha, passing the agent-plugins ref that matches this repo's `library.json` standard pin.

```yaml
# <plugin-repo>/.github/workflows/ci.yml
# Thin caller. All conformance logic lives in the reusable workflow; this repo only
# invokes it at a pinned ref, with the standards ref matching its library.json pin.
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  conformance:
    # Pin the reusable workflow by tag-or-sha (decouple-and-pin: never floating HEAD).
    uses: product-on-purpose/.github/.github/workflows/standards-gate.yml@v1.0.0
    with:
      # The agent-plugins ref whose standards/ matches THIS repo's library.json
      # "standard" pin. Bump on this repo's own re-adoption cadence (D2 Hybrid).
      standards-ref: standards-v0.8
```

Notes:
- `uses: product-on-purpose/.github/.github/workflows/standards-gate.yml@v1.0.0` pins the workflow itself by ref. The `@v1.0.0` is the workflow's release tag; replace with a real tag or sha once the org `.github` workflow ships.
- `standards-ref: standards-v0.8` is the agent-plugins ref to obtain the runner from; for `thinking-framework-skills` this matches its `library.json` `"standard": "0.8"` pin. Each plugin sets this to its own pin and bumps on its own re-adoption cadence.

## 6. What remains to fully close D14

This spike closes the load-bearing local question (the runner grades an arbitrary root) and ships correct, copy-ready YAML. What it does NOT do, and cannot do in a local spike:

- **A live GitHub Actions run is still required.** The two-checkout mechanics (caller checkout + sparse second checkout of agent-plugins at a pinned ref + `node check.mjs .` grading the caller green) have only been proven at the `node check.mjs <root>` layer locally. The Actions wiring (sparse checkout into `.standards-runner`, the reusable-workflow call boundary, the caller-context behavior) needs one real Actions run to be observed end to end.
- **It depends on Phase 0 relocation.** The YAML references `standards/checks/check.mjs`, which does not exist yet - the runner still lives at `agent-skills-toolkit/scripts/check.mjs`. The reusable workflow cannot run for real until the Phase 0 relocation moves `scripts/check.mjs` + `scripts/checks/` + `scripts/lib/` into `agent-plugins/standards/checks/` (and the gate's relative requires - `./lib/...`, `./tier-report.mjs` - are preserved by the move).
- **It needs a push to the org `.github` repo and a test caller.** `standards-gate.yml` must land in `product-on-purpose/.github` at a tagged ref, and at least one plugin (the natural first is `agent-skills-toolkit` re-acquiring its own gate, or a throwaway test caller) must carry the thin `ci.yml` pointing at that tag, before a green live run can be observed.

These three are sequencing/landing work (Phase 0 plus an org-repo push), not open design questions. The mechanism is proven; what remains is to execute the relocation and run it once in anger.

## 7. Verdict

**D14 is CONFIRMED feasible.** The single load-bearing assumption behind the reusable-workflow consumption model - that the one canonical runner can grade an arbitrary checked-out root supplied as an argument, honoring that root's own Standard pin - is proven by real captured output: the runner graded `thinking-framework-skills` against its 0.8 pin (100 downgraded warnings, exit 0) and graded its own repo clean (exit 0), same binary, two foreign roots. That makes the runner relocatable into `standards/checks/` and consumable via the two-checkout reusable workflow without re-copying it into four repos. The two YAML artifacts in Section 5 operationalize the model and are copy-ready against the post-relocation paths. The only thing standing between this spike and full closure is a live GitHub Actions run, which requires the Phase 0 relocation and an org-repo push (Section 6) - sequencing, not unknowns. D14 should land as recorded; this spike removes the mechanical risk that motivated the confirming spike.

## Cross-references

- Companion analysis: [`../drafts/runner-consumption.md`](../drafts/runner-consumption.md) (Option C - reusable GitHub Actions workflow - recommended; Section 3 recommendation, Section 7 ADR recording).
- Open question this confirms: [`../05-open-questions.md`](../05-open-questions.md) OQ-2 (runner-consumption model, RESOLVED -> D14) and OQ-3 (relocation/consumption sequencing, Phase 0 atomic).
- The Standard's gate semantics referenced here live in the sibling repo: `agent-skills-toolkit/STANDARD.md` (G7-G10, the GATE_PATH contract).
