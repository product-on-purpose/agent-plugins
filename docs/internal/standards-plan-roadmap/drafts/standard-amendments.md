# Standard amendments - land-ready clause text

This is the actual RFC-2119 clause text a LAND pull request would paste into `standards/STANDARD.md` for the roadmap decisions D5/D6, D8, D9, D10, D11, and D12. It is written to match the live Standard's voice, severity labels, and the "named enforcing check" expectation. Every section here is a target by **name** with a `(provisional)` marker, never a baked-in number, because the Standard version, ADR number, and section number are allocated only at LAND on the protected branch (GOVERNANCE.md Section 6, "the allocation invariant"). Each clause states its target section, severity, the clause text, the named enforcing check (or an explicit aspirational label), and the burndown / collision constraints that govern when it can land. Companion drafts: `drafts/frontmatter-schemas.md` (D11 schemas in full), `drafts/agents-md-and-context.md` and `drafts/cross-tool-targeting.md` (D5/D10 narrative), `drafts/release-subsystem.md` (D8 layout), `drafts/contributing-edits.md` (listing-contract L-clause edits), `drafts/ci-repin-check.md` (the registry-side gate).

External standards invoked by these clauses, cited by URL where they are first used:

- agentskills.io specification: https://agentskills.io/specification.md
- AGENTS.md: https://agents.md/
- Anthropic plugins/marketplace reference: https://code.claude.com/docs/en/plugins-reference
- Anthropic hooks reference: https://code.claude.com/docs/en/hooks
- OpenAI Codex plugins: https://developers.openai.com/codex/plugins and skills: https://developers.openai.com/codex/skills
- YAML 1.2.2: https://yaml.org/spec/1.2.2/
- MADR 4.0: https://adr.github.io/madr/
- RFC 8174 / BCP 14: https://www.rfc-editor.org/rfc/rfc8174
- Keep a Changelog 1.1.0: https://keepachangelog.com/en/1.1.0/
- Conventional Commits 1.0.0: https://www.conventionalcommits.org/en/v1.0.0/

## How to read each clause block

| Field | Meaning |
|---|---|
| **Target section** | The `STANDARD.md` section by name to edit or add. New sections carry a `(provisional)` number per GOVERNANCE.md Section 6. |
| **Severity** | RFC 2119 keyword per RFC 8174 / BCP 14 (https://www.rfc-editor.org/rfc/rfc8174). |
| **Enforcing check** | The named check module (`scripts/checks/<id>.mjs`, `meta.id`/`reqId`) that verifies it, OR an explicit `aspirational` label per the sequencing invariant (GOVERNANCE.md Section 7: a clause without a named enforcing check is aspirational, not normative). |
| **Burndown** | Per Standard Section 7.7: a newly introduced or tightened requirement SHOULD ship as `warn` for the introducing MINOR, then become a gate-failing `error` at the next MINOR. New `error`-from-day-one only in a MAJOR. |
| **Collision** | Same-section overlaps that MUST be reconciled into one coordinated edit at REVIEW (GOVERNANCE.md Sections 5-6). |

Check `meta` follows the live convention seen in `scripts/checks/*.mjs`: `{ id, tier, reqId, since, provenance }`, severity `error` | `warn`, `reqId` prefixed `U`/`S`/`G`. New `reqId`s here are written as `Unn`/`Snn`/`Gnn` (provisional) because the next free number is allocated at LAND, exactly as the version, ADR, and section numbers are.

---

## Amendment A - canonical folder layout, _agent-context dissolution, _local/session-logs (D5 dissolve _agent-context, D6 casing)

Implements **D5 (dissolve _agent-context)** and **D6 (casing)**. This is the single largest collision risk in the package: it edits the repository-layout block and the working-documentation block that several drafts also touch. It MUST land as **one coordinated edit** with the gitignored-scratch wording in Section 10.4.

### A.1 - Repository layout: dissolve _agent-context, name the scratch home

- **Target section:** Section 10 "Plugin anatomy and internal structure", subsection "Repository layout" (existing 10.1).
- **Severity:** SHOULD (the layout block is already a SHOULD; this clause changes WHICH paths the SHOULD names, and adds two MUST NOT carve-outs below).
- **Collision:** the same layout block is touched by the release-plans clause (Amendment F below) and by any site-layout edit; reconcile into one Section 10 edit at REVIEW.

Replace the working-scratch line and add the dissolution statement. Clause text:

> The committed agent-facing layer of a plugin is exactly three things: the repository-root `AGENTS.md` orientation file (Section 3.10), a thin per-target context shim that points at it (the "AGENTS.md canonical + thin shim" rule, Section 3.10), and the committed governance under `docs/internal/`. There is no committed `_agent-context/` directory and no top-level `AGENTS/` directory: `agents/` is reserved for Claude Code subagent components (Section 3.3), `.agents/` is reserved by OpenAI Codex (https://developers.openai.com/codex/plugins), and `AGENTS.md` (https://agents.md/) is the orientation FILE, not a folder. A plugin MUST NOT carry a committed `_agent-context/` directory.
>
> Ephemeral working scratch - design drafts, session logs, agent-context material - lives in a gitignored `_local/` directory (lowercase) and MUST NOT be committed. Session logs live under `_local/session-logs/` (lowercase, plural). The principle is distill-then-discard: durable knowledge is promoted into its committed home (an ADR in `docs/internal/decisions/`, a plan, or a spec); raw scratch stays ephemeral in `_local/` and never earns a place on the entry surface.

Update the layout listing in the same block so the tree shows `_local/` (lowercase) in place of `_LOCAL/`, with `_local/session-logs/` shown as the session-log home, and remove any `_agent-context/` line.

- **Enforcing check:** `anatomy` (existing, `reqId` U2 family) extended with a new sibling `reqId` (provisional `U14`, `scratch-layout`) that emits an `error` when a committed `_agent-context/` directory is present and an `error` when a committed `_LOCAL/` (uppercase) directory is present where `.gitignore` does not ignore it. The casing half (D6) is also covered here. New check module suggestion: `scripts/checks/scratch-layout.mjs`, `meta = { id: "scratch-layout", tier: "universal", reqId: "U14", since: "<allocated-at-land>", provenance: "house" }`.
- **Burndown:** ships as `warn` for the introducing MINOR, becomes `error` at the next MINOR (Section 7.7). Rationale: every family repo currently has at least one of the retired patterns; the warn window is the migration runway the mechanical push (D2 PUSH) rides on.

### A.2 - Casing is normative and case-collision-safe (D6)

- **Target section:** Section 10.4 "Internal and working documentation", the gitignored-scratch bullet; and Section 8.2 "Naming and taxonomy" (cross-reference only).
- **Severity:** MUST.
- **Collision:** Section 10.4 is also the home of the "promotion flow" bullet (unchanged) and is referenced by the docs-home decision (D4, kept as-is). Reconcile the scratch bullet only.

Clause text (replaces the `_LOCAL/` mention in 10.4):

> The gitignored scratch directory MUST be named `_local/` in lowercase, and the session-log subdirectory MUST be named `session-logs/` in lowercase and plural. Mixed casing (`_LOCAL/` alongside `_local/`, or `session-log/` alongside `session-logs/`) is a case-collision footgun on case-insensitive filesystems (Windows, default macOS) and MUST NOT occur. A repository MUST contain at most one casing of each name.

- **Enforcing check:** same `scratch-layout` check (provisional `U14`) as A.1; the casing assertion is one of its findings. No separate module.
- **Burndown:** as A.1 (`warn` then `error`).

---

## Amendment B - AGENTS.md canonical + thin shim, and truth-in-targeting (D10 cross-tool / truth-in-targeting)

Implements **D10 (cross-tool / truth-in-targeting)**: AGENTS.md is the single canonical cross-tool context source; every declared target that reads its own file gets a thin shim, never a divergent copy; and `agent-targets` becomes load-bearing - a plugin MUST emit, and the gate MUST verify, the native distribution and context shim for every declared target, or that target MUST be dropped.

### B.1 - AGENTS.md is canonical; each declared target gets a thin shim

- **Target section:** Section 3.10 "AGENTS.md (Universal)", adding to "Content" and "Validation rules".
- **Severity:** MUST.
- **Collision:** Section 3.10 is otherwise stable; the only overlap is the A.1 reference to "the thin shim" - keep the definitive text here and have A.1 cross-reference it.

Clause text (append to Section 3.10):

> `AGENTS.md` (https://agents.md/) is the single canonical cross-tool context source. A target that reads its own root context file MUST receive a THIN shim that references `AGENTS.md`, never a divergent copy of its content: Claude Code reads `CLAUDE.md`; Google Gemini reads `GEMINI.md`, emitted only if `gemini` is a declared target. A shim MUST be short, MUST point the reader to `AGENTS.md` as the source of truth, and MUST NOT restate orientation content that would then drift. There MUST be exactly one canonical body (`AGENTS.md`); the per-target shims are pointers, not forks. Adding a new tool is an adapter operation: declare it in `agent-targets`, emit its native manifest, add its shim, and the gate verifies all three.

- **Enforcing check:** new check `agents-shim` (provisional `U15`), `meta = { id: "agents-shim", tier: "universal", reqId: "U15", since: "<at-land>", provenance: "house" }`, in `scripts/checks/agents-shim.mjs`. It asserts: (a) `AGENTS.md` exists (delegated to the existing `anatomy`/U2 finding, not duplicated); (b) for each declared target with a known context-file convention, the shim file exists and is below a small size ceiling (a heuristic, emitted as `warn` not `error`, because "thin" is judgment, mirroring the description-score `warn`-only treatment in Section 8.1); (c) the shim contains a resolvable reference to `AGENTS.md`.
- **Burndown:** `warn` for the introducing MINOR, `error` (for the existence half) at the next MINOR. The size-heuristic half stays `warn` permanently (judgment, never a hard gate), per the Section 8.1 precedent.

### B.2 - Truth-in-targeting: agent-targets is load-bearing

- **Target section:** Section 2.2 "Tier 2 - Convergent (Silver)" (where `agent-targets` is first required) and Section 5.1 (`agent-targets` field row).
- **Severity:** MUST.
- **Collision:** Section 2.2 and 5.1 both describe `agent-targets`; this clause MUST edit both in one coordinated pass so the field definition and the tier obligation agree.

Clause text (add to Section 2.2, and cross-reference from the Section 5.1 `agent-targets` row):

> `agent-targets` is load-bearing: a declared target is a promise of delivery, not an aspiration. For every value in `agent-targets`, the plugin MUST emit that target's native distribution for each Convergent component it ships AND that target's context shim (Section 3.10). A target a plugin does not actually deliver for MUST be removed from `agent-targets`; a plugin MUST NOT claim a target it does not emit. The "codex" value claims PORTABILITY only - agentskills.io-compatible skills (https://agentskills.io/specification.md) plus root `AGENTS.md`, both of which a Universal plugin already provides - and does NOT by itself claim native Codex marketplace distribution (https://developers.openai.com/codex/plugins). A plugin that ships native Codex packaging (`.codex-plugin/plugin.json`) claims that stronger delivery; a plugin that ships only portable skills claims only portability. The gate verifies the claim against what is on disk and MUST flag a target with no corresponding emitted distribution or shim.

- **Enforcing check:** extend the existing `agent-targets` check (`reqId` S1, `scripts/checks/agent-targets.mjs`) with the delivery assertion, OR add a sibling `per-target-presence` finding (that module already exists, `scripts/checks/per-target-presence.mjs`). The shim half is covered by `agents-shim` (B.1). No third module needed; the new assertion is "every declared target has at least one emitted native artifact OR is a portability-only `codex` claim backed by agentskills.io skills."
- **Burndown:** **advisory (`warn`) first, then blocking**, per Phase 2 (CI keystone) and Phase 4 (consolidate): truth-in-targeting lands in advisory mode in Phase 2 and flips to blocking `error` in Phase 4. This staged flip is itself the burndown.

### B.3 - Skills stay on the portable floor; Claude-only frontmatter is quarantined

- **Target section:** Section 3.1 "Skill (Universal)", "Frontmatter" and "Validation rules".
- **Severity:** MUST.
- **Collision:** D11 (Amendment D below) also touches frontmatter; this clause is specifically about the agentskills.io floor versus quarantined extensions, while D11 is about per-artifact schemas. Land them as one Section 3 / Section 8 frontmatter pass if both are in the same window.

Clause text (append to Section 3.1 validation rules):

> A skill body MUST remain valid on the agentskills.io portable floor (https://agentskills.io/specification.md) so the same `SKILL.md` degrades gracefully across all compliant agents. Claude-Code-only frontmatter keys (for example `allowed-tools`, `model`, `disable-model-invocation`, and context-fork directives) are permitted only as labeled extensions and MUST be quarantined so a non-Claude reader can ignore them without the skill becoming invalid. A plugin MUST NOT fork a skill body per target; one skill body serves every target, with target-specific power expressed as ignorable extensions.

- **Enforcing check:** `frontmatter-valid` (existing, `scripts/checks/frontmatter-valid.mjs`) extended to recognize the quarantined extension keys and to `warn` (not `error`) when a Claude-only key appears without the labeled-extension marker. This is `warn`-only because the agentskills.io floor treats unknown keys as ignorable, so a stray extension is non-fatal portability noise, not a hard break.
- **Burndown:** `warn` only (no flip to `error`); the underlying portability is already guaranteed by the agentskills.io mapping in Section 6.

---

## Amendment C - hooks authoring and the exit-code contract (D9 hooks)

Implements **D9 (hooks)**: ratify the Claude Code hook exit-code contract, the `CLAUDE_PLUGIN_ROOT` reference rule, and `hookEventName` in structured output; confirm the dash-ban is a RECOMMENDED convention, not a mandated check (Standard v0.11 retired the U10 no-dashes check, ADR 0028; re-mandating it would contradict the Standard). The live contract MUST be reconfirmed against https://code.claude.com/docs/en/hooks at LAND time.

### C.1 - Hook exit-code and reference contract

- **Target section:** Section 3.5 "Hook (Advanced)", "Rules"; and Section 9 "Security and least privilege" (the blocking-hook bullet, cross-reference only).
- **Severity:** MUST for the exit-code and reference mechanics; RECOMMENDED for the dash-ban convention.
- **Collision:** Section 3.5 is also referenced by the Gold `G1` hook-documentation check; this clause adds mechanics, it does not change `G1`'s documentation requirement. No reconciliation needed beyond keeping `G1` wording intact.

Clause text (append to Section 3.5 rules):

> A Claude Code hook (https://code.claude.com/docs/en/hooks) MUST honor the exit-code contract: exit code 0 signals success and any structured result is read from stdout as JSON; exit code 2 signals a blocking decision and the message on stderr is fed back to the agent as the blocking reason; any other non-zero exit is a non-blocking error surfaced to the user. A hook that emits structured JSON MUST include `hookEventName` in that output so the consumer can route it. A hook MUST reference plugin-bundled paths only through the `${CLAUDE_PLUGIN_ROOT}` variable (dollar-brace syntax), never a hard-coded absolute path, so the hook relocates with the plugin (https://code.claude.com/docs/en/plugins-reference). A blocking hook MUST emit an actionable message (Section 9). Hooks MUST be idempotent where the event can repeat (existing Section 3.5 rule, retained).
>
> The family no-em-dash / no-en-dash house style is a RECOMMENDED convention a plugin MAY enforce for itself via an opt-in `PreToolUse` hook (the toolkit ships one); it is NOT a graded conformance check. This restates Section 7.7 / ADR 0028: a stylistic house preference with no portability basis is not a tier requirement, and re-mandating it as a check would contradict the v0.11 relaxation.

- **Enforcing check:** the exit-code and `hookEventName` mechanics are **aspirational** at first: a static check cannot execute a hook to observe its exit codes, and "honors the contract at runtime" is behavioral. The verifiable slice - `${CLAUDE_PLUGIN_ROOT}` usage instead of absolute paths, and presence of an `on-failure` declaration - is enforced by extending `hook-documentation` (existing, `reqId` G1, `scripts/checks/hook-documentation.mjs`) with a `warn` for an absolute-path reference inside a registered hook command. The runtime exit-code behavior is labeled **aspirational** per the sequencing invariant (no named runtime check exists), pending eval coverage (`G3`).
- **Burndown:** the static `${CLAUDE_PLUGIN_ROOT}` finding ships `warn` then `error`; the runtime behavior stays aspirational (explicitly labeled) until an eval harness can exercise it.

---

## Amendment D - frontmatter requirements per artifact type (D11 frontmatter)

Implements **D11 (frontmatter)**: one frontmatter schema per artifact type (skill, ADR, doc, spec) with kebab-case keys, quoted version-like and date-like scalars, correct scalar/array types, and required keys validated in CI. The agentskills.io caps are the floor. The full field tables live in `drafts/frontmatter-schemas.md`; this clause is the normative obligation that points at them.

### D.1 - One schema per artifact type, validated in CI

- **Target section:** Section 3.8 "Frontmatter contract (all component types)" (extend to non-component artifacts), with a new subsection under Section 8 "Quality and discoverability" titled "Frontmatter schemas by artifact type" `(provisional Section 8.5)`.
- **Severity:** MUST.
- **Collision:** Section 3.8 and Section 8.1 both govern frontmatter; the new 8.5 subsection MUST cross-reference 8.4 (docs taxonomy, already enforced by `G7` `docs-frontmatter`) rather than re-stating it, and MUST NOT collide with the 8.4 docs schema (8.4 owns published-docs frontmatter; 8.5 owns ADR and spec frontmatter and the typing rules common to all).

Clause text (new subsection `provisional 8.5`):

> Each authored artifact type carries exactly one frontmatter schema, validated in CI:
>
> - **Skill** - the agentskills.io frontmatter (Section 3.1): `name` (the 1-64 char regex floor), `description` (the 1024-char cap and the 8.1 bar). These caps are the floor and MUST NOT be loosened.
> - **Non-skill component** (command, subagent, hook, workflow) - the Section 3.8 contract plus the applicable Section 3.7 metadata keys.
> - **ADR** - a MADR 4.0 (https://adr.github.io/madr/) frontmatter block: `status`, `date`, and a title; immutable once accepted (Section 10.4, D4).
> - **Published doc** - the Section 8.4 taxonomy, enforced by `G7`; not restated here.
> - **Spec** - the spec frontmatter defined in `drafts/frontmatter-schemas.md`.
>
> Across every schema: keys MUST be kebab-case; a value that looks like a version or a date (for example `version`, `updated`, `date`, `remove-in`) MUST be quoted to defeat YAML 1.2.2 (https://yaml.org/spec/1.2.2/) float and timestamp coercion; a value whose type is a list (for example `keywords`, `tags`, `agent-targets`) MUST be a YAML sequence, never a comma-joined string; and every schema's required keys MUST be present. Claude-Code-only fields are quarantined as labeled extensions (Section 3.1, Amendment B.3) and are not part of any portable schema.

- **Enforcing check:** extend `frontmatter-valid` (existing, `scripts/checks/frontmatter-valid.mjs`) with per-artifact-type rules: kebab-case key assertion, quoted-scalar assertion for version-like/date-like keys, and array-type assertion for list keys. ADR frontmatter gets a finding via a new sibling `reqId` (provisional, `adr-frontmatter`) OR is folded into `docs-frontmatter` scoping; pick one at LAND to avoid two modules claiming `docs/internal/decisions/`. The full key list is in `drafts/frontmatter-schemas.md`.
- **Burndown:** `warn` for the introducing MINOR, `error` at the next MINOR. The quoting and array-type rules are the highest-value `error`s (a coerced YAML date silently corrupts the manifest); the kebab-case rule MAY stay `warn` longer if existing artifacts use mixed casing.

---

## Amendment E - the exceptions rule (D12 exceptions)

Implements **D12 (exceptions)**: the tier ceiling is the PRIMARY mechanism; genuine per-clause exceptions MUST carry an ADR plus a machine-readable suppression the gate reads; no silent suppressions. This builds on the live Section 7.7 "Consumer-side configuration" clause, which already names a suppressions baseline, and tightens it into a normative auditability rule.

### E.1 - Tier ceiling first; exceptions are ADR-backed and machine-readable

- **Target section:** Section 7.7 "Standard versioning and compatibility", the "Consumer-side configuration" paragraph; and Section 4.5 "Check results and severity" (cross-reference).
- **Severity:** MUST.
- **Collision:** Section 7.7 is dense and already governs pinned-version grading and the suppressions baseline. This clause MUST be a coordinated edit with that paragraph, not a new parallel section, so there is one statement of how a plugin legitimately does not assert a requirement.

Clause text (extend the Section 7.7 consumer-side paragraph):

> A plugin opts out of a requirement in exactly two legitimate ways, in this order of preference. First, the **tier ceiling** is the PRIMARY mechanism: a plugin asserts only the requirements at or below its declared `tier`, so a clause above that tier does not fail its build and needs no exception. Second, a genuine per-clause exception below the declared tier MUST be recorded as an ADR in the plugin's `docs/internal/decisions/` (MADR 4.0, https://adr.github.io/madr/) AND as a machine-readable suppression entry the gate reads (the suppressions baseline named in this section). Each suppression entry MUST name the `reqId` it suppresses and SHOULD reference the ADR that justifies it. A plugin MUST NOT silently suppress a finding: a suppression with no corresponding ADR is itself a finding. This keeps a stop-and-flag fleet push (the mechanical PUSH campaigns) from clobbering a deliberate exception, and keeps every exception auditable. A published conformance verdict MUST NOT let a graded subject suppress an objective or vendor-cited finding to dodge it (the published-verdict clamp already in this section).

- **Enforcing check:** extend the suppressions machinery (`scripts/lib/suppressions.mjs`, already present) with a finding that emits an `error` when a suppression entry has no `reqId` and a `warn` when a suppression entry references no ADR file under `docs/internal/decisions/`. New check module suggestion: `scripts/checks/suppression-audit.mjs`, `meta = { id: "suppression-audit", tier: "universal", reqId: "<at-land>", since: "<at-land>", provenance: "house" }`.
- **Burndown:** `warn` for the introducing MINOR, `error` at the next MINOR. Rationale: the suppressions baseline exists today but is not yet audited; the warn window lets existing baselines add their ADR references before the gate blocks.

---

## Amendment F - the release-plans convention (D8 release subsystem, PLAN layer)

Implements the **PLAN layer of D8 (release subsystem, three layers)**: a `docs/internal/release-plans/plan_vX.Y.Z/` convention with a subfolder per feature holding `spec.md` + `impl-plan.md`, plus a go/no-go checklist template. The EXECUTE layer (askit-release vs release-please) and the NOTES layer (curated CHANGELOG, Conventional Commits prerequisite) are decided and ratified in Phase 5 and drafted in `drafts/release-subsystem.md`; only the PLAN layout is a Standard clause here.

### F.1 - Release-plans layout

- **Target section:** Section 10 "Plugin anatomy", the "Repository layout" block (the same block A.1 edits - reconcile), and Section 10.4 "Internal and working documentation" (the committed-governance bullet).
- **Severity:** SHOULD.
- **Collision:** **same Section 10 layout block as Amendment A.1 and the site-layout clause.** These MUST be one coordinated Section 10 edit at REVIEW. A.1 removes `_agent-context/` and names `_local/`; F.1 adds `release-plans/` under `docs/internal/`; do both in one PR.

Clause text (add to Section 10.4 committed-governance bullet and reflect in the layout tree):

> A plugin SHOULD record release planning under `docs/internal/release-plans/`, one directory per planned release named `plan_vX.Y.Z/`, each containing a subfolder per feature that holds a `spec.md` (what the feature is) and an `impl-plan.md` (how it is built), plus a go/no-go checklist for the release. The checklist SHOULD follow a staged-gate model (a small fixed set of named gates from kickoff to ship). Release plans are committed maintainer governance (they live under `docs/internal/`, not in `_local/` scratch); they are distinct from the curated `CHANGELOG.md` (https://keepachangelog.com/en/1.1.0/), which remains the user-facing source of truth (Section 10.6).

- **Enforcing check:** **aspirational** at LAND. There is no structural property a static check can assert about a release plan's existence without false-positives (not every commit is a release; a plugin between releases legitimately has none). Labeled `aspirational` per the sequencing invariant until Phase 5 decides the EXECUTE layer, at which point a presence check MAY be added keyed to "a tagged release has a matching `plan_vX.Y.Z/`."
- **Burndown:** not applicable while aspirational (no graded check). When a check is added in Phase 5 it ships `warn` then `error` per Section 7.7.

---

## Landing order and cross-amendment constraints

These are the sequencing invariants from GOVERNANCE.md Sections 5-6 applied to this package, plus the package's own phase mapping. No clause is ratified without a named enforcing check OR an explicit aspirational label; no clause is ratified from a non-conforming exemplar; the Standard version, ADR number, and section number are allocated only at LAND on the protected branch.

| Amendment | Decision | Target section (provisional) | Severity | Enforcing check | Roadmap phase |
|---|---|---|---|---|---|
| A - folder layout, _agent-context dissolution, casing | D5, D6 | 10 (layout), 10.4 | SHOULD + MUST | `scratch-layout` (new, `U14`) | Phase 3 |
| B.1 - AGENTS.md canonical + thin shim | D10 | 3.10 | MUST | `agents-shim` (new, `U15`) | Phase 3 |
| B.2 - truth-in-targeting (load-bearing targets) | D10 | 2.2, 5.1 | MUST | `agent-targets` (S1) + `per-target-presence` | Phase 2 advisory -> Phase 4 blocking |
| B.3 - portable floor, quarantined extensions | D10 | 3.1 | MUST | `frontmatter-valid` (warn) | Phase 3 |
| C.1 - hook exit-code + reference contract | D9 | 3.5, 9 | MUST + RECOMMENDED | `hook-documentation` (G1) static slice; runtime aspirational | Phase 5 |
| D.1 - frontmatter schema per artifact type | D11 | 3.8, new 8.5 | MUST | `frontmatter-valid` extended | Phase 3 |
| E.1 - exceptions rule | D12 | 7.7, 4.5 | MUST | `suppression-audit` (new) | Phase 5 |
| F.1 - release-plans layout | D8 (PLAN) | 10 (layout), 10.4 | SHOULD | aspirational (Phase 5 may add presence check) | Phase 5 |

**Hard collision groups (MUST be one coordinated edit each):**

1. **Section 10 layout block** - Amendments A.1, F.1, and any site-layout clause all edit the same repository-layout tree. One Section 10 PR.
2. **Section 7.7** - Amendment E.1 edits the same dense paragraph that governs pinned-version grading; one coordinated 7.7 edit, not a parallel section.
3. **Section 2.2 + 5.1** - Amendment B.2 edits both the tier obligation and the field row for `agent-targets`; one pass so they agree.
4. **Frontmatter (Section 3.1, 3.8, 8.4, new 8.5)** - Amendments B.3 and D.1 both touch frontmatter; land in one frontmatter pass if in the same window, and 8.5 MUST cross-reference 8.4 (`G7`) rather than restate it.

**Exemplar constraint.** Per GOVERNANCE.md Section 5, no clause here is ratified from a non-conforming exemplar. Phase sequencing already honors this: pm-skills closes its P0 holes (library.json, embedded-marketplace removal) in Phase 1 before any clause that pm-skills must satisfy is ratified, and the toolkit (the Gold self-prover) must pass each new check against itself before the corresponding clause flips to `error`.

**Burndown discipline.** Every new `error`-class check above ships as `warn` for the MINOR that introduces it and becomes `error` at the next MINOR (Standard Section 7.7). The two exceptions are explicit: judgment-based findings (the shim size heuristic in B.1, the quarantined-extension warn in B.3) stay `warn` permanently, and runtime behavioral contracts (the hook exit-code behavior in C.1, the release-plan presence in F.1) stay aspirational until an eval/execution harness exists to verify them.
