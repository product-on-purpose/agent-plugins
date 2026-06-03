# Fleet orchestration: program backlog

> The prioritized program: build the orchestration capability, then use it to drive the consistency initiatives. Each epic links to its spec. Status verbs: NOW (do next), NEXT (after its dependency), LATER (sequenced behind), DONE, IDEA (not yet committed). This is the index; the specs hold the detail.

## How to read priority

The capability (E1) is the enabler; the consistency epics (E2-E5) are what it carries; the dual-documentation model (woven through the [guide](guide.md) Section 6) is the discipline all of them follow. Sequence: build a thin capability, prove it on the lowest-risk consistency change, then widen.

## Epics

| Epic | What | Spec | Status |
|---|---|---|---|
| **E1** | Orchestration capability (the mechanism) | [`specs/orchestration-capability.md`](specs/orchestration-capability.md) | NOW |
| **E2** | Consistent folder structure | [`specs/consistency-folder-structure.md`](specs/consistency-folder-structure.md) | NEXT |
| **E3** | Consistent CI | [`specs/consistency-ci.md`](specs/consistency-ci.md) | NEXT |
| **E4** | Consistent page formatting | [`specs/consistency-page-formatting.md`](specs/consistency-page-formatting.md) | LATER |
| **E5** | Consistent processes | [`specs/consistency-processes.md`](specs/consistency-processes.md) | LATER |

## E1 - Orchestration capability (NOW)

- [ ] **E1.1** Adopt the fleet-change **spec format** (the template in the capability spec): uniform change, per-repo parameters, acceptance check, stop-and-flag rule, campaign id.
- [ ] **E1.2** Adopt the **campaign record** format (the central dual-doc artifact: id -> repo -> PR -> result/flagged). Decide its home (`docs/internal/orchestration/campaigns/<id>.md`).
- [ ] **E1.3** Run a **pilot fleet change** end to end on a low-risk uniform change to validate the pattern. Candidate: **favicon adoption** (swap each repo's interim favicon to the family compass placeholder) or the **CI dash-check** rollout. Pilot one repo, then fan to three.
- [ ] **E1.4** Capture the pilot's learnings back into the capability spec and the guide (the Astro loop: apply, review, fold back).
- [ ] **E1.5 (IDEA)** A reusable orchestration **runner** (a saved Workflow script parameterized by a fleet-change spec) for Level-3 repeatability.

## E2 - Consistent folder structure (NEXT, depends E1)

- [ ] **E2.1** Audit the four repos against `STANDARD.md` 10.1; record the drift (e.g. `_LOCAL` vs `_local`, `scripts/` vs `tools/`, `_agent-context/` naming, `docs/` shape).
- [ ] **E2.2** Define the canonical layout (extend 10.1; include the Astro `site/` sub-case already proven).
- [ ] **E2.3** Orchestrate convergence (fan-out, stop-and-flag on intentional deviations recorded in a repo ADR).
- [ ] **E2.4** Graduate the layout clause into `STANDARD.md` / `standards/`.

## E3 - Consistent CI (NEXT, depends E1; overlaps Astro ROADMAP Phase 1)

- [ ] **E3.1** Stand up `product-on-purpose/.github` with the reusable `astro-site.yml` `workflow_call` (already specced in [`standards/domains/astro-sites/ci-standard.md`](../../../standards/domains/astro-sites/ci-standard.md)).
- [ ] **E3.2** Define the shared **conformance-gate** invocation (each repo runs the portable `check.mjs`/`ci-checks.mjs`; the CI only shells out, per `STANDARD.md` 4.x).
- [ ] **E3.3** Orchestrate adoption of the reusable workflow across the four site repos (pilot tfs, then the rest).
- [ ] **E3.4** Standardize action-version pins and the `node-version-file` mechanism fleet-wide (re-pins are a textbook uniform fleet change).

## E4 - Consistent page formatting (LATER, depends E3 + the Astro preset)

- [ ] **E4.1** Ship the `@product-on-purpose/astro-docs-preset` (accent, mermaid, schema, favicon, og:image) - the rendered-site formatting source of truth (Astro ROADMAP Phase 2).
- [ ] **E4.2** Define the **repo-native** doc formatting standard (README family hero pattern, INDEX, the no-em/en-dash rule, folder READMEs).
- [ ] **E4.3** Orchestrate adoption (preset pin + README template) across the fleet.

## E5 - Consistent processes (LATER)

- [ ] **E5.1** Codify the shared **release** process (gates; the pm-skills release-conductor model as the reference).
- [ ] **E5.2** Codify the shared **review** process (the adversarial multi-agent review the rollout used; crit / cross-LLM review).
- [ ] **E5.3** Codify **ADR + backlog** discipline (MADR in `docs/internal/decisions/`, `backlog/`, the rollout-packet pattern).
- [ ] **E5.4** Codify the **dual-documentation** convention as a process clause (campaign id, central record, local CHANGELOG/ADR reference).

## Cross-cutting / risks (carry into every epic)

- Pilot-then-fan-out for anything with blast radius.
- Stop-and-flag is mandatory for judgment changes (the "stale title" trap).
- No silent skips: record every exclusion in the campaign record with a reason.
- Each consistency epic graduates into `standards/` once proven (do not let the rules live only here).
