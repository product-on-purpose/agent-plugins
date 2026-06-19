# 02 - The phased program (Phase 0 through Phase 5)

> The sequenced execution plan for the standards package. It lays out six phases, each with its goal, key moves, dependencies (and why they bind), the locked decisions (D-ids) and draft files it consumes, and a crisp exit gate. The rule that orders the whole program: nothing lands without a named enforcing check or an explicit aspirational label, nothing lands from a non-conforming exemplar, and the three scarce numbers (Standard version, ADR number, section number) are allocated only at LAND time. Decision records are not duplicated here (see [03-decisions.md](03-decisions.md)); clause text is not duplicated here (see the files under [drafts/](drafts/standard-amendments.md)).

## How to read this file

- This is a planning and lock-in deliverable per D1 (deliverable: roadmap plus ready-to-land drafts). It produces a roadmap and staged draft text written to `docs/internal/standards-plan-roadmap/`. Execution and the per-plugin conformance audit are separate later efforts.
- Phases are sequenced by **dependency**, not by calendar. A later phase MAY begin as soon as its stated precondition is met; some moves run in parallel (called out per phase).
- "Decisions consumed" link to [03-decisions.md](03-decisions.md). "Drafts consumed" link to the exact `drafts/` files that carry the land-ready text.
- Rollout discipline throughout is D2 (rollout: Hybrid): the Standard version pin is **pulled** by each plugin on its own cadence (this preserves the allocation-at-land collision-avoidance); mechanical, judgment-free conventions are **pushed** as orchestrated one-PR-per-repo campaigns with stop-and-flag, specced in [drafts/orchestration-campaigns.md](drafts/orchestration-campaigns.md).

## The dependency spine (why this order)

Three load-bearing dependencies set the whole sequence. Read these first; the per-phase tables below assume them.

1. **Phase 0 (truth and relocation) unblocks everything because the Standard is currently homeless-in-transition and internally inconsistent.** The canonical home is decided (`agent-plugins/standards/`, ADR 0001 in [standards/decisions/0001-standard-governance-and-home.md](../../../standards/decisions/0001-standard-governance-and-home.md)) but the text still physically lives in `agent-skills-toolkit/STANDARD.md` at header version 0.12, while `GOVERNANCE.md` Section 4 and ADR 0001 both still cite version 0.8 and the writing-style repo appears under two names (writing-style-library and writing-style-catalog). Every later phase amends, cites, or relocates the Standard; doing any of that against a split home and a stale version is building on sand. Phase 0 collapses the home to one place, sweeps the version refs to a single 0.12 truth, and keeps the gate green. Until it exits, no amendment can land cleanly.

2. **pm-skills must get a `library.json` (Phase 1) before the re-pin check can flip to blocking (Phase 2), or CI would red-flag a member it cannot fix in time.** The marketplace re-pin check asserts that a pinned-sha repo carries a `library.json` with a `standard` pin and is CI-green. pm-skills today has no `library.json` and ships an embedded self-listing marketplace (the Section 12 anti-pattern). A blocking check landed before pm-skills converges would block its own re-pins. So Phase 2 lands the check **advisory first**, and only flips it to blocking once all four members pass, with pm-skills closed in Phase 1.

3. **A clause is never ratified from a non-conforming exemplar.** This is why scaffolding and dual-audience clauses (Phase 3) follow the structural fixes, and why Section 14 (the astro site standard) graduates in Phase 4 only after the shared workflow proves the four repos converge on one enforcement, not four drifting copies. Formalizing a rule the exemplars violate would bake a contradiction into the Standard.

Visualized:

```
Phase 0 (truth + relocation)  ──┬─→ Phase 1 (close P0 holes, pm-skills)
   one home, version swept,     │
   gate green                   ├─→ Phase 2 (CI re-pin keystone, advisory→blocking)
                                │        depends on Phase 1 for the blocking flip
                                │
                                └─→ Phase 3 (scaffolding + dual-audience amendment)
                                          │  one coordinated amendment, mechanical push
                                          ▼
                                    Phase 4 (consolidate CI, graduate domains / §14)
                                          │  shared workflow proves convergence
                                          ▼
                                    Phase 5 (process + hooks: release, exceptions, conventions)
```

## Phase 0 - truth and relocation

| Field | Detail |
|---|---|
| **Goal** | One normative home for the Standard, internally consistent, with the conformance gate green. This is the unblocker for all later phases. |
| **Key moves** | Execute ADR 0001: move `STANDARD.md` to `standards/STANDARD.md` and the checks to `standards/checks/`, preserving the `GATE_PATH` and folder-readme conventions the runner depends on. Sweep stale version references (`GOVERNANCE.md` Section 4 and ADR 0001 still cite 0.8; the live header is 0.12) to one 0.12 truth. Resolve the writing-style-library / writing-style-catalog name drift to a single canonical name. |
| **Dependencies (precede, and why)** | None upstream. This phase is the precondition: every later amendment edits or cites the Standard, so the home and version must be singular and correct first. ADR 0001 itself sequences the physical move "after the documentation-site question settles and the shared CI workflow is built" - this roadmap brings the move forward as its own deliberate landing because the split home is now the active blocker, not a deferred nicety. |
| **Decisions consumed** | ADR 0001 (standard governance and canonical home) is the authority for the move. See [03-decisions.md](03-decisions.md) for the family-law ADR trail. |
| **Drafts consumed** | None directly; this phase is a relocation and sweep, not a new clause. It sets the stage that [drafts/standard-amendments.md](drafts/standard-amendments.md) writes into. |
| **Exit gate** | `STANDARD.md` and its checks live under `standards/`; references resolve to the new home; no source file cites 0.8 or the wrong repo name; the conformance runner passes green at the relocated path. |

**Sequencing and readiness note (the consumption decision, now LOCKED into Phase 0).** ADR 0001 (standard governance and canonical home) sequenced the `STANDARD.md` + checks relocation to land AFTER the documentation-site question settles and the shared CI workflow is built. This roadmap deliberately brings the relocation forward to Phase 0 (truth and relocation) because the split home is the active blocker, not a deferred nicety. Bringing it forward exposes one sub-question: once the runner physically lives under `agent-plugins/standards/`, how do the four plugin repos consume it? The relocation MUST NOT leave the runner half-moved (askit's own in-repo gate must keep working throughout, and the other three repos must have a defined way to run the relocated checks).

This is now DECIDED (OQ-3 locked): the consumption model is resolved AS PART OF Phase 0, an atomic relocation with no dark-gate window. The earlier "split Phase 0 into relocate-now and wire-consumption-later" alternative is rejected, because deferring the wiring would leave a dark gate (the relocated runner exists but no repo consumes it) until Phase 4. Per D14 (runner-consumption = reusable workflow), the relocated 30-check runner is consumed via a REUSABLE GitHub Actions workflow that lives in `product-on-purpose/.github`, checks out `standards/` at a pinned ref, and runs the gate against the calling repo. Each plugin repo carries a THIN caller (about three lines) in its own `.github/workflows/`. Two pins, both decouple-and-pin: (a) the WORKFLOW version pin in each caller (`uses: ...@<tag-or-sha>`, NEVER `@main`), so workflow updates propagate by re-pinning on the Hybrid PUSH lane (one-PR-per-repo campaign, D2); (b) the STANDARD version as a workflow INPUT, each repo passing its `library.json` standard pin so the workflow checks out `standards/` at that version (pull-based, matching the repo's declared pin). An npm package is the named fallback. This is recorded as a family-law ADR beside ADR 0001 and needs a confirming spike in Phase 0 (the GitHub Actions two-checkout mechanics). The consumption decision is tracked in [drafts/runner-consumption.md](drafts/runner-consumption.md) and resolved before the relocation is declared done.

**CI architecture (D15) - one set of check logic, one harness, thin per-repo triggers.** Per D15 (enforcement = full, tiered ramp), the family targets FULL CI-enforced conformance across all four repos, delivered as a TIERED, WARN-FIRST ramp. The architecture that Phase 0 stands up and the later phases build on: the check LOGIC lives centrally in `standards/checks/`, the CI HARNESS is the reusable workflow (D14 above), and each repo carries only a thin TRIGGER (the caller). The Bronze/Universal floor blocks first (cheap, every repo passes fast), then Silver, then Gold; each new check ships `warn` for one minor then flips to `error`, per the Standard's Section 7.7 burndown (the same pattern used for U13 at v0.12). Per-repo migration is that repo's convergence packet (under [../../../docs/internal/convergence/](../../../docs/internal/convergence/)) plus its warn burndown. This tiered warn-first ramp is what scopes the enforcement work in Phase 2 (CI keystone), Phase 4 (consolidate CI / missing checks), and Phase 5 (process and hooks) to full enforcement.

## Phase 1 - close the P0 conformance holes (pm-skills)

| Field | Detail |
|---|---|
| **Goal** | pm-skills passes the Universal tier and can pin the Standard, retiring the two P0 holes (no `library.json`; embedded self-listing marketplace). |
| **Key moves** | A deliberate in-repo pm-skills session, not a drive-by PR from agent-plugins. Build repo-local generated-manifest tooling (the Standard treats `library.json` as authored source-of-truth and native manifests as generated; the roughly ninety components MUST NOT be hand-enumerated into drift). Add `library.json` pinning Standard 0.12 and declaring the convergent tier (subagents, workflows, commands, the chain contract, multi-target). Remove the embedded self-listing `.claude-plugin/marketplace.json` (Section 12 anti-pattern), keeping association one-way per CONTRIBUTING.md clause L2 (independently valid, no embedded self-listing). |
| **Dependencies (precede, and why)** | Phase 0 (truth and relocation): pm-skills should pin the Standard at its singular relocated home and version, not at a soon-to-move path. This is the named precondition for Phase 2's blocking flip - the re-pin check cannot block on a member that has no `library.json` yet. |
| **Decisions consumed** | D7 (no new init/listing skill): the toolkit already owns scaffolding via askit-init-plugin, askit-init-marketplace, and askit-migrate; pm-skills uses repo-local tooling, agent-plugins adds none. The pm-skills convergence detail lives in its convergence packet, [../../../docs/internal/convergence/pm-skills-conformance.md](../../../docs/internal/convergence/pm-skills-conformance.md). |
| **Drafts consumed** | None new in this phase; it is conformance execution against the existing Standard. It produces the conforming exemplar that Phase 2's truth-in-targeting and Phase 3's clauses rely on. |
| **Exit gate** | pm-skills carries a root `library.json` (standard 0.12, convergent tier), ships no embedded self-listing marketplace, and passes Universal at its pinned commit. All four members can now pin the Standard. |

## Phase 2 - the CI keystone (the re-pin conformance check)

| Field | Detail |
|---|---|
| **Goal** | Listing conformance is CI-enforced, not hand-policed: a pinned-sha repo provably carries a `library.json` with a `standard` pin and is CI-green; the registry surfaces each member's `standard` and `tier`. |
| **Key moves** | Build the re-pin conformance check into `scripts/validate-registry.mjs` (run by `.github/workflows/validate-registry.yml`): for each pinned plugin, fetch the pinned sha, assert a root `library.json` exists with a `standard` field, and assert CI was green at that sha. Land it **advisory first**, flip to **blocking** once all four members pass. Surface `standard` plus `tier` in the registry output. Land truth-in-targeting (D10) in **advisory** mode: the gate begins verifying that each declared `agent-targets` entry ships its native distribution plus context shim. |
| **Dependencies (precede, and why)** | Phase 1 (close P0 holes) for the **blocking** flip specifically - a member without a `library.json` would be red-flagged by a check it cannot yet satisfy. The advisory landing MAY proceed in parallel with Phase 1; only the flip waits on all four passing. Phase 0 for the singular `standard` home the check reads against. |
| **Decisions consumed** | D2 (rollout: Hybrid) - the check enforces the pulled version pin without forcing a synchronized bump. D10 (cross-tool / truth-in-targeting) - advisory landing of agent-targets verification. See [03-decisions.md](03-decisions.md). |
| **Drafts consumed** | [drafts/ci-repin-check.md](drafts/ci-repin-check.md) (the check spec and advisory-then-blocking rollout); [drafts/cross-tool-targeting.md](drafts/cross-tool-targeting.md) (the truth-in-targeting verification this phase lands advisory); [drafts/contributing-edits.md](drafts/contributing-edits.md) (the L1-L6 enforcement-state row this check moves from "advisory" to "enforced"). |
| **Exit gate** | The re-pin check is blocking with all four members green; the registry shows `standard` and `tier` per plugin; truth-in-targeting runs advisory. CONTRIBUTING.md clause L3 (binds the Standard by version pin) is machine-enforced, not review-only. |

## Phase 3 - scaffolding and dual-audience (one coordinated amendment)

| Field | Detail |
|---|---|
| **Goal** | The canonical repo-layout, context-file, and frontmatter clauses are landed in the Standard and promoted in CONTRIBUTING.md, with CI validating frontmatter; the mechanical parts are pushed fleet-wide. |
| **Key moves** | One coordinated Standard amendment (one PR: text plus version bump plus one ADR, per the LAND invariant). It carries: the canonical folder layout (D5 dissolve `_agent-context`, D6 lowercase `_local` and `session-logs`); the AGENTS.md plus thin CLAUDE.md shim contract (D10); one frontmatter schema per artifact type validated in CI (D11); and the release-plans `plan_vX.Y.Z` convention (D8 PLAN layer). Then push the mechanical, judgment-free parts one-PR-per-repo per D2: the casing rename, `adr/` to `decisions/`, and the missing CLAUDE.md shim on thinking-framework-skills and agent-skills-toolkit. Leave the version pin pull-based. |
| **Dependencies (precede, and why)** | Phase 0 (one home to amend) and Phase 1 (a conforming pm-skills exemplar) - clauses MUST NOT ratify from a non-conforming exemplar, and the AGENTS.md / context-shim and frontmatter clauses must be true of the repos before they are mandated. The push campaigns assume the orchestration model is in place. |
| **Decisions consumed** | D5 (dissolve `_agent-context`), D6 (casing: lowercase `_local`, `session-logs`), D10 (cross-tool / truth-in-targeting, the shim contract), D11 (frontmatter: one schema per artifact type), D8 (release subsystem, the PLAN layer only). Full records in [03-decisions.md](03-decisions.md). |
| **Drafts consumed** | [drafts/standard-amendments.md](drafts/standard-amendments.md) (the coordinated clause text); [drafts/contributing-edits.md](drafts/contributing-edits.md) (the L5/L6 promotion); [drafts/frontmatter-schemas.md](drafts/frontmatter-schemas.md) (the per-artifact schemas and CI validation); [drafts/agents-md-and-context.md](drafts/agents-md-and-context.md) (the AGENTS.md plus CLAUDE.md shim contract and the layout); [drafts/orchestration-campaigns.md](drafts/orchestration-campaigns.md) (the one-PR-per-repo push specs for the mechanical parts). |
| **Exit gate** | The coordinated amendment is landed (text plus single version bump plus one ADR); CI validates frontmatter against the per-artifact schemas; the casing rename, `adr/` to `decisions/`, and CLAUDE.md shim are pushed across the affected repos; the version pin remains pull-based. |

## Phase 4 - consolidate CI and graduate domains (Section 14)

| Field | Detail |
|---|---|
| **Goal** | One shared site-CI workflow replaces four duplicated guard copies (the real drift fix); Section 14 (the astro site standard) is normative; the missing enforcing checks are added. |
| **Key moves** | Stand up the shared `astro-site.yml` workflow, collapsing the four duplicated clause-14.11 link/route guard copies; extract the shared preset (accent, mermaid, schema, favicon, og:image). Land Section 14 as **formalization** (the enforcement already runs in all four repos; landing it makes the site rules a normative MUST and lets a plugin declare site conformance by bumping its `standard` pin). Add the missing enforcing checks: HISTORY.md presence (per the maintainer amend-vs-conform decision), frontmatter-tier agreement, and flip truth-in-targeting (D10) from advisory to blocking. |
| **Dependencies (precede, and why)** | Phase 3 (the frontmatter schema must exist before frontmatter-tier agreement can be checked) and the prior advisory landing of truth-in-targeting in Phase 2 (you flip an advisory check to blocking only after it has run quietly and all targets are honest). Section 14 graduates only once the shared workflow demonstrates the four repos converge on one enforcement - ratifying from convergence, not from four drifting exemplars. |
| **Decisions consumed** | D10 (truth-in-targeting flips to blocking here). The Pattern S separation (D3 docs/internal kept; published content under `site/src/content/docs/`) is the reason no docs-rename churn is needed. See [03-decisions.md](03-decisions.md). |
| **Drafts consumed** | [drafts/standard-amendments.md](drafts/standard-amendments.md) (the Section 14 clause graduation and the new check definitions); [drafts/cross-tool-targeting.md](drafts/cross-tool-targeting.md) (the blocking flip of truth-in-targeting); [drafts/orchestration-campaigns.md](drafts/orchestration-campaigns.md) (the workflow consolidation as an orchestrated campaign). |
| **Exit gate** | Section 14 is normative; one shared `astro-site.yml` workflow serves all sites with the preset extracted; HISTORY.md-presence, frontmatter-tier, and (now blocking) truth-in-targeting checks are live. |

## Phase 5 - process and hooks

| Field | Detail |
|---|---|
| **Goal** | Graduate the release subsystem, the hooks authoring and exit-code clause, the exception rule, and the issue/effort/roadmap conventions - each with a named enforcing check or an explicit aspirational label. |
| **Key moves** | Release subsystem (D8 EXECUTE and NOTES layers): make Conventional Commits the load-bearing prerequisite, ship the commitlint commit-msg hook (which doubles as the worked hook exemplar and unblocks release automation), and decide release-please (CI bot) versus askit-release (agent-driven). Hooks clause (D9): ratify the Claude Code hook exit-code contract (exit 0 with stdout JSON; exit 2 with stderr fed back as blocking), reference plugin paths only via `${CLAUDE_PLUGIN_ROOT}`, include `hookEventName` in structured output; confirm the live contract against the Claude Code hooks reference https://code.claude.com/docs/en/hooks before landing. The dash-ban stays a RECOMMENDED family convention, not a mandated check (the Standard retired the no-dashes check at v0.11; re-mandating it would contradict the Standard). Exception rule (D12) and issue/effort/roadmap conventions (D13). |
| **Dependencies (precede, and why)** | Last by design. D13 is explicitly lowest urgency - codified after the structural P0/P1 work lands so the convention reflects settled practice. The release EXECUTE layer assumes Conventional Commits is enforced (the commitlint hook is the enforcer), and the hook clause assumes the hooks reference is reconfirmed. The exception rule (D12) presupposes the tier-ceiling mechanism and the gate's machine-readable suppression are in place from the earlier phases. |
| **Decisions consumed** | D8 (release subsystem, EXECUTE and NOTES layers), D9 (hooks), D12 (exceptions), D13 (issues / effort / roadmap conventions). Full records in [03-decisions.md](03-decisions.md). |
| **Drafts consumed** | [drafts/release-subsystem.md](drafts/release-subsystem.md) (the three-layer release model, Conventional Commits, release-please versus askit-release); [drafts/standard-amendments.md](drafts/standard-amendments.md) (the hooks clause, the exception rule, and the issue/effort conventions as clause text). |
| **Exit gate** | The release subsystem is operational with Conventional Commits enforced by the commitlint hook and the execution mechanism chosen; the hooks exit-code clause is landed; the exception rule (ADR plus machine-readable suppression, no silent suppressions) is live; the issue/effort/roadmap conventions are ratified or explicitly labeled aspirational. |

## Codex distribution (cross-cutting workstream, D17)

This is not a numbered phase; it is a dedicated cross-cutting WORKSTREAM that runs after its spike and is parallelizable with Phase 4 (consolidate CI and graduate domains). Per D17 (Codex = deliver; supersedes D10 Codex-defer), the family will DELIVER codex-distributed: native OpenAI Codex CLI plugin packaging plus a Codex marketplace, reversing the earlier scope-to-truth DEFER. The D10 truth-in-targeting PRINCIPLE stands unchanged (declare == emit == verify); what changes is that a "codex" claim now resolves to codex-distributed (native install), not merely codex-portable.

Note: this is OpenAI Codex CLI, never the `codex` Claude Code plugin (the consumer-side `codex:*` skills). Do not conflate the distribution target with the consumer tool that shares the name.

**Sequence.**

0. **Path-reconfirmation SPIKE first.** Reconfirm the on-disk layout against current Codex docs (Codex CLI is about v0.135 now): the `.agents/skills` vs `.codex/skills` discovery roots, the `.agents/plugins/marketplace.json` location plus schema, and how a loaded plugin surfaces its bundled skills. This resolves the build-time residual recorded at `agent-skills-toolkit/STANDARD.md` around line 495.
1. **Per-plugin emit.** Each plugin emits `.codex-plugin/plugin.json` (generated from `library.json`) and places bundled skills where Codex discovery surfaces them.
2. **Marketplace emit.** The marketplace (agent-plugins) emits `.agents/plugins/marketplace.json` alongside the Claude `.claude-plugin/marketplace.json`.
3. **Round-trip test.** `codex plugin marketplace add` then `codex plugin add`, verified locally end-to-end.
4. **Gate verification.** The truth-in-targeting gate verifies the codex-distributed artifacts (`.codex-plugin/plugin.json` present, the Codex marketplace entry resolves), with the advisory-then-blocking rollout still applying and the spike as a prerequisite before native verification flips on.

**Scope.** Codex receives skills plus MCP only. It does NOT receive subagents (Codex `[agents.*]` is user/project `config.toml`, not plugin-shipped), and it does NOT receive output styles or statusline (Claude-only). The tooling already scaffolds the formats (`askit-init-marketplace`, `askit-init-plugin`).

## Sequencing invariants (apply to every phase)

These are non-negotiable and govern every LAND in the program:

1. **No clause is ratified without a named enforcing check OR an explicit aspirational label.** A rule the conformance spine cannot verify is marked aspirational, not silently asserted.
2. **No clause is ratified from a non-conforming exemplar.** A plugin proposing a clause MUST itself satisfy the clauses it already claims; otherwise its proposal waits.
3. **The three scarce numbers are allocated only at LAND on the protected branch:** the Standard version, the ADR number, and any new section number. Drafts reference sections by name plus a `(provisional)` number and MUST NOT treat a provisional number as reserved. Branch protection requiring up-to-date-before-merge enforces this mechanically and is what ends parallel-session collisions.
4. **One version bump plus one ADR per landing is invariant** (the LAND step is a single atomic PR: text plus version bump plus one ADR plus the changelog entry).

## What is explicitly NOT in this program yet

- **A dedicated standard repository.** ADR 0001 keeps the Standard in `agent-plugins/standards/` and rejects a separate repo as premature at four plugins. The graduation to a standalone repo is a future decision, warranted only on external public adoption or much larger scale.
- **Native Codex marketplace packaging is NO LONGER deferred.** Per D17 (Codex = deliver; supersedes D10 Codex-defer), the family WILL deliver codex-distributed (native `.codex-plugin/plugin.json` plus a Codex marketplace). This lands as the cross-cutting Codex distribution workstream above (after its path-reconfirmation spike, parallelizable with Phase 4), not as an indefinitely deferred item. The exact on-disk Codex paths and manifest location still have version churn and MUST be reconfirmed against current Codex docs (https://developers.openai.com/codex/plugins, https://developers.openai.com/codex/skills) in the spike before the emitter is built.
- **The per-plugin conformance audit and execution itself.** This package is planning and lock-in (D1); the audit program runs as a separate effort against the convergence packets in [../../../docs/internal/convergence/](../../../docs/internal/convergence/).
- **A new agent-plugins scaffolding or init skill.** Per D7, agent-plugins owns only the listing contract (CONTRIBUTING.md L1-L6) and the CI gate; scaffolding stays in the toolkit. An optional short re-pin runbook in `docs/internal/` is the only allowed addition.
- **Re-mandating the dash-ban as a conformance check.** Per D9, it stays a RECOMMENDED family convention; the Standard retired the no-dashes check at v0.11.

## See also

- [00-README.md](00-README.md) - the package map and reading order.
- [01-current-state.md](01-current-state.md) - the as-built starting point this roadmap moves from.
- [03-decisions.md](03-decisions.md) - the 17 locked decisions (D1-D17), full records (referenced here by D-id).
- [04-standards-definition.md](04-standards-definition.md) - the Standard, governance, and listing-contract definitions.
- [drafts/](drafts/standard-amendments.md) - the land-ready clause and check text each phase consumes.
- [../../standards/GOVERNANCE.md](../../../standards/GOVERNANCE.md) - the amendment lifecycle (EXPAND, PROPOSE, REVIEW, LAND, RE-ADOPT) and the allocation invariant this program obeys.
