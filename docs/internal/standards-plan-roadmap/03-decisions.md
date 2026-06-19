# The 13 Locked Decisions

This file records the thirteen decisions that anchor the standards roadmap as ADR-ready entries, in order D1 (deliverable) through D13 (issue and effort conventions). Each entry is written so it can be lifted directly into a MADR 4.0 record ([https://adr.github.io/madr/](https://adr.github.io/madr/)): a status, the context and drift it resolves, the normative decision in RFC-2119 language where appropriate ([https://www.rfc-editor.org/rfc/rfc8174](https://www.rfc-editor.org/rfc/rfc8174)), the alternatives weighed and rejected, the consequences and any new enforcing check, the external standard it aligns with, and where the record graduates to land per [`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md). Family-law decisions graduate to [`agent-plugins/standards/decisions/`](../../../standards/decisions/); plugin-binding conventions graduate to Standard clauses and, where they touch listability, to [`CONTRIBUTING.md`](../../../CONTRIBUTING.md). Companion files: the staged plan is [`02-roadmap.md`](02-roadmap.md); current-state evidence is [`01-current-state.md`](01-current-state.md); the home/lifecycle framing is [`04-standards-definition.md`](04-standards-definition.md).

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are as defined in RFC 2119 / BCP 14.

A note on allocation: per [`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 6 (the allocation invariant), the concrete Standard version, ADR number, and section number for any clause below are taken only at LAND on the protected branch. The "Graduates-to" lines name the destination and the provisional target by name, never a reserved number.

---

## D1 (deliverable: roadmap plus ready-to-land drafts)

**Status:** accepted

**Context.** The family's standards thinking lived in a single gitignored working note (`_LOCAL/standards-plan.md`, gitignored scratch, not in-tree) that still cites a stale Standard header (0.8) against the live 0.12. That note mixed settled decisions, open questions, execution detail, and draft clause text in one place, which made it impossible to lock decisions without also committing to execution. The maintainer needs the decisions and the staged path frozen first, with the actual plugin audit and clause landings handled as separate later efforts under the existing amendment lifecycle.

**Decision.** This effort's deliverable is a comprehensive roadmap PLUS staged, land-ready draft text, written to [`docs/internal/standards-plan-roadmap/`](.). It is a planning and lock-in artifact only. It MUST NOT itself land any Standard clause, edit any plugin, or run the conformance audit; those are separate efforts sequenced by [`02-roadmap.md`](02-roadmap.md). Draft clause text in `drafts/` is EXPAND-stage material under [`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 5 and carries no allocated numbers.

**Alternatives considered.**
- *One combined plan-and-execute pass.* Rejected: it would force version, ADR, and section allocations before REVIEW, violating the allocation invariant and re-creating the parallel-collision problem ADR 0001 (standard governance and home) was written to end.
- *Decisions-only memo, no drafts.* Rejected: without staged draft text each phase would re-derive its clauses cold, losing the grounding work and inviting drift between the decision and its eventual wording.

**Consequences.** The package is the single citable source for the locked decisions during execution. Each later phase opens by lifting the relevant `drafts/` text into a PROPOSE-stage RFC or land-ready draft. No new enforcing check; this is a process artifact, not a clause.

**Aligns-with.** MADR 4.0 [https://adr.github.io/madr/](https://adr.github.io/madr/) (record shape); the EXPAND stage of [`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 5.

**Graduates-to.** Committed under `docs/internal/standards-plan-roadmap/` as the tracked planning record. The decisions below graduate individually to their named homes; this meta-decision does not itself become a Standard clause.

---

## D2 (rollout: Hybrid)

**Status:** accepted

**Context.** Two kinds of change must reach four plugins (agent-skills-toolkit pinned at Standard 0.12, writing-style-catalog at 0.11, thinking-framework-skills at 0.8, pm-skills at none). Pushing a Standard version bump onto every repo at once would defeat the allocation-at-land collision-avoidance that [`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 6 depends on. But genuinely mechanical conventions (folder casing, a shared CI workflow, frontmatter keys, context shim files) gain nothing from per-repo cadence and only drift if left to each repo's discretion.

**Decision.** Adopt a Hybrid rollout. The Standard version pin MUST be PULLED: each plugin re-adopts the new Standard version on its own cadence by bumping its `library.json` `standard` field and making the conformance edits (the RE-ADOPT stage). Mechanical, judgment-free conventions MUST be PUSHED as orchestrated one-PR-per-repo campaigns with stop-and-flag, never a single fleet-wide commit. A change qualifies for PUSH only if applying it requires no per-repo judgment; anything requiring a tier decision or content authoring is PULLED.

**Alternatives considered.**
- *Pure pull (everything on each repo's cadence).* Rejected: mechanical conventions would drift indefinitely (the live CLAUDE.md shim drift and four duplicated CI guard copies are exactly this failure).
- *Pure push (fleet-wide synchronized bumps).* Rejected: synchronizing version bumps re-introduces the multi-session number collisions and removes each plugin's ability to absorb conformance work when it can.

**Consequences.** Two operating modes coexist: the amendment lifecycle for law (pull) and the orchestration campaign model (push, with FC-NNNN campaign records). The push lane needs the exception mechanism (D12, exceptions) so a stop-and-flag campaign does not clobber a deliberate per-repo exception.

**Aligns-with.** The RE-ADOPT stage of [`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 5; the orchestration model in [`docs/internal/orchestration/`](../../../docs/internal/orchestration/).

**Graduates-to.** Family-law ADR in [`agent-plugins/standards/decisions/`](../../../standards/decisions/) (it governs how the Standard reaches consumers). The PUSH-lane mechanics are documented in [`drafts/orchestration-campaigns.md`](drafts/orchestration-campaigns.md).

---

## D3 (docs/internal kept)

**Status:** accepted

**Context.** A rename of `docs/internal/` to `docs/_internal/` was floated to mark the directory as non-published. All four repos already use `docs/internal/` consistently, and Pattern S (the graduated astro-sites domain at [`standards/domains/astro-sites/`](../../../standards/domains/astro-sites/)) already separates published content (`site/src/content/docs/`) from repo-root governance docs that are never built. The leading-underscore rename would solve a problem Pattern S already solves.

**Decision.** The internal governance docs directory MUST remain `docs/internal/`. No repo SHALL rename it to `docs/_internal/` or any underscore variant. Publication separation is achieved by Pattern S (governance docs at repo root are never built; published docs live under `site/`), not by directory-name convention.

**Alternatives considered.**
- *Rename to `docs/_internal/`.* Rejected: pure fleet churn across four conforming repos for a separation Pattern S already enforces; it would also touch every internal cross-reference for no behavioral gain.

**Consequences.** The decision-home convention (D4) and every "Graduates-to" line in this file resolve against `docs/internal/decisions/`, the path that already exists. No new check; this decision prevents work rather than creating it.

**Aligns-with.** Pattern S in [`standards/domains/astro-sites/`](../../../standards/domains/astro-sites/) (published-versus-internal separation).

**Graduates-to.** Recorded as context within the Phase 3 (scaffolding and dual-audience) Standard layout amendment; it is a constraint on that amendment, not a standalone clause.

---

## D4 (decision homes)

**Status:** accepted

**Context.** Decision records are scattered: agent-skills-toolkit uses `docs/internal/decisions/` (the correct reference shape); writing-style-catalog uses `docs/internal/adr/`; pm-skills keeps an ad-hoc `DECISIONS.md` log; thinking-framework-skills has none. The family-law ADRs correctly and separately live in [`agent-plugins/standards/decisions/`](../../../standards/decisions/). Without one convention, decisions rot in scratch or fragment across naming variants.

**Decision.** Each repo MUST record its own internal decisions as MADR 4.0 ADRs in `docs/internal/decisions/`, using `NNNN-` numbering, a status in frontmatter, immutable once accepted (superseded, never edited in place). Decisions MUST NOT live in scratch (`_local/`). The Standard family-law ADRs MUST remain in [`agent-plugins/standards/decisions/`](../../../standards/decisions/), distinct from any plugin's record. Convergence required: writing-style-catalog `adr/` -> `decisions/`; pm-skills `DECISIONS.md` -> proper ADRs plus a thin generated index; thinking-framework-skills stands up the directory on first decision.

**Alternatives considered.**
- *Keep `adr/` as the directory name.* Rejected: the established reference shape is `decisions/` (agent-skills-toolkit and the family-law home both use it); two names is the drift.
- *Keep a single flat `DECISIONS.md` log per repo.* Rejected: a single mutable log violates ADR immutability and cannot carry per-record frontmatter status; a thin generated index over individual immutable ADRs preserves both browsability and auditability.

**Consequences.** Two convergence tasks (writing-style-catalog rename, pm-skills conversion) ride the D2 PUSH lane in Phase 3. A thin index generator is needed for the pm-skills conversion (generated, not hand-authored). Enforcing check candidate: a presence/shape check for `docs/internal/decisions/` once the layout clause lands.

**Aligns-with.** MADR 4.0 [https://adr.github.io/madr/](https://adr.github.io/madr/).

**Graduates-to.** Standard clause (canonical layout, Phase 3, provisional Section 10 layout area) plus the family-law separation already stated in [`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 2.

---

## D5 (dissolve _agent-context)

**Status:** accepted

**Context.** The `_agent-context/` directory carries a split-commit pattern that is the live source of drift: agent-plugins' [`.gitignore`](../../../.gitignore) ignores `_agent-context/*` EXCEPT it commits `_agent-context/session-logs/`, and the four plugins disagree on whether `_agent-context/` is committed (pm-skills) or fully gitignored (others). The name also collides conceptually: `agents/` is the Claude Code subagent component directory, `.agents/` is reserved by Codex, and AGENTS.md is the orientation file ([https://agents.md/](https://agents.md/)). Three near-identical names for three different concepts invites mistakes.

**Decision.** The `_agent-context/` directory concept MUST be removed entirely. Session logs MUST move to `_local/session-logs/`, which is gitignored ephemeral scratch. The committed agent-facing layer MUST consist of root AGENTS.md plus a thin CLAUDE.md shim (D10, cross-tool targeting) plus `docs/internal/`. No repo SHALL carry an `_agent-context/` directory or an `AGENTS/` folder: `agents/` is reserved for Claude Code subagent components, `.agents/` is reserved by Codex, and AGENTS.md is the orientation FILE. The governing principle: distill durable knowledge into its home (decisions, plans, specs); keep raw scratch ephemeral and uncommitted.

**Alternatives considered.**
- *Keep `_agent-context/` fully committed.* Rejected: it commits raw session scratch that belongs in ephemeral storage and perpetuates the committed-versus-gitignored disagreement across repos.
- *Keep `_agent-context/` fully gitignored.* Rejected: it loses durable knowledge that should be distilled into committed homes (decisions, specs) rather than thrown away wholesale; the split pattern was an attempt to keep the durable part, which is better served by distillation.
- *Dissolve (chosen).* Distillation plus ephemeral scratch removes the split, the naming collision, and the cross-repo disagreement in one move.

**Consequences.** agent-plugins' `.gitignore` must drop the `_agent-context/session-logs/` exception and ignore `_local/` wholesale; the same change rides the D2 PUSH lane to the plugins that carry the directory. The wrap-session output target changes to `_local/session-logs/`. Enforcing check candidate: an anti-presence check that fails on a committed `_agent-context/` once the layout clause lands.

**Aligns-with.** AGENTS.md [https://agents.md/](https://agents.md/) (orientation file as the canonical context surface); OpenAI Codex [https://developers.openai.com/codex/plugins](https://developers.openai.com/codex/plugins) (the `.agents/` reservation).

**Graduates-to.** Standard clause (canonical layout, Phase 3, provisional Section 10 layout area) plus a `.gitignore` convention; detailed in [`drafts/agents-md-and-context.md`](drafts/agents-md-and-context.md).

---

## D6 (casing)

**Status:** accepted

**Context.** The scratch directory appears as both `_LOCAL/` and `_local/` across the family, and session logs appear as `SESSION-LOG`, `session-log`, and `session-logs`. Windows is case-insensitive, so a mixed `_LOCAL/_local` history is a git case-collision footgun (two casings of one path can both enter the tree and fail to check out cleanly).

**Decision.** The scratch directory MUST be `_local` (lowercase) everywhere. The session-log directory MUST be `session-logs` (lowercase, plural). No repo SHALL introduce an uppercase or singular variant. This resolves both the case-collision risk and the singular/plural drift in one convention.

**Alternatives considered.**
- *Standardize on `_LOCAL/` uppercase.* Rejected: uppercase on a case-insensitive filesystem is the more dangerous default once any lowercase variant already exists in history, and lowercase matches the dominant Unix convention for dotfile-adjacent scratch.
- *Allow either casing.* Rejected: "either" is exactly the case-collision footgun; the convention exists to remove the choice.

**Consequences.** A casing rename (`_LOCAL/` -> `_local/`) rides the D2 PUSH lane; on Windows the rename MUST go through a case-preserving two-step (`git mv` to a temp name, then to the target) to avoid the no-op trap. Pairs with D5 (`_local/session-logs/` is the session-log home). Enforcing check candidate: a path-casing check in the layout clause.

**Aligns-with.** No external standard; this is a family filesystem-hygiene convention.

**Graduates-to.** Standard clause (canonical layout, Phase 3) alongside D5; detailed in [`drafts/agents-md-and-context.md`](drafts/agents-md-and-context.md).

---

## D7 (no new init or listing skill)

**Status:** accepted

**Context.** A question arose whether agent-plugins should ship its own scaffolding or init skill. The toolkit already owns the scaffolding suite: `askit-init-plugin` (plugin internals and a Bronze seed), `askit-init-marketplace` (create a marketplace, add a plugin entry, and validate entries), and `askit-migrate` (adopt an existing repo). agent-plugins is the neutral registry repo and owns the listing contract and CI gate, not authoring tools. The maintainer confirmed agent-plugins needs no scaffolding or init skill.

**Decision.** agent-plugins MUST NOT add a scaffolding or init skill. Scaffolding remains owned by the toolkit (`askit-init-plugin`, `askit-init-marketplace`, `askit-migrate`). agent-plugins owns only the listing contract ([`CONTRIBUTING.md`](../../../CONTRIBUTING.md) clauses L1-L6) and the CI gate (`validate-registry` plus the new re-pin check, D-CI per Phase 2). agent-plugins MAY add a short re-pin runbook doc under `docs/internal/` as an optional convenience, which is documentation, not tooling.

**Alternatives considered.**
- *Add an agent-plugins init/listing skill.* Rejected: it would duplicate `askit-init-marketplace` (which already scaffolds listing entries and validates them) and blur the neutral registry repo's role as contract-and-gate owner rather than authoring-tool owner.

**Consequences.** Phase 1 (close P0 holes) builds pm-skills' manifest tooling repo-locally rather than as a reusable agent-plugins skill. The only net-new agent-plugins artifact is the CI re-pin check (D-CI) and the optional runbook doc.

**Aligns-with.** Anthropic plugin and marketplace reference [https://code.claude.com/docs/en/plugins-reference](https://code.claude.com/docs/en/plugins-reference) (the marketplace/plugin separation this division mirrors).

**Graduates-to.** No Standard clause. Recorded as a family-law ADR in [`agent-plugins/standards/decisions/`](../../../standards/decisions/) (it allocates ownership between the toolkit and the registry repo).

---

## D8 (release subsystem, three layers)

**Status:** accepted

**Context.** Release practice across the family is uneven: a curated CHANGELOG ([https://keepachangelog.com/en/1.1.0/](https://keepachangelog.com/en/1.1.0/)) exists in agent-plugins, but there is no shared plan-then-execute discipline, and any release automation needs a load-bearing commit convention that is not yet enforced. The pm-release-conductor G0-G4 gate model is a proven go/no-go pattern worth donating.

**Decision.** The release subsystem MUST be modeled in three layers.
- *PLAN:* release plans live at `docs/internal/release-plans/plan_vX.Y.Z/`, with one subfolder per feature holding `spec.md` plus `impl-plan.md`, plus a go/no-go checklist template donated from the pm-release-conductor G0-G4 gate model.
- *EXECUTE:* either `askit-release` (agent-driven, already exists) OR release-please (a CI bot); the choice is DEFERRED to Phase 5 (process and hooks).
- *NOTES:* a curated CHANGELOG following Keep a Changelog is the source of truth; the GitHub Release body is derived from it.

Conventional Commits ([https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)) is the LOAD-BEARING prerequisite for any release automation and MUST be enforced before the EXECUTE layer automates (see D9, hooks).

**Alternatives considered.**
- *Single-layer "just run a release skill."* Rejected: it conflates planning, execution, and notes, leaving no auditable go/no-go record and no source of truth for release content.
- *Pick the executor now.* Rejected as premature: `askit-release` versus release-please is a real tradeoff (agent-driven flexibility versus CI determinism) that should be decided once Conventional Commits is enforced and the PLAN layer is in use.

**Consequences.** Phase 3 lands the PLAN layer convention; Phase 5 graduates EXECUTE and NOTES. The commitlint hook (D9) is the gating prerequisite. Enforcing check candidate at Phase 5: presence of a `plan_vX.Y.Z/` for tagged releases, plus the existing `version-match` and `release-notes` checks already in the runner.

**Aligns-with.** Keep a Changelog 1.1.0 [https://keepachangelog.com/en/1.1.0/](https://keepachangelog.com/en/1.1.0/); SemVer [https://semver.org](https://semver.org); Conventional Commits [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/).

**Graduates-to.** PLAN-layer convention to a Standard clause (Phase 3); EXECUTE/NOTES decision to a family-law ADR at Phase 5. Detailed in [`drafts/release-subsystem.md`](drafts/release-subsystem.md).

---

## D9 (hooks)

**Status:** accepted

**Context.** Hooks are used in the family (the dash-ban PreToolUse hook), but the family has never ratified the Claude Code hook exit-code contract or a hook authoring convention. Separately, the release subsystem (D8) needs Conventional Commits enforced, and the cheapest enforcement is a commit-msg hook. The Standard explicitly RETIRED the no-dashes check at v0.11 (ADR 0028; house style is not a portability requirement), so re-mandating a dash check would contradict the live Standard.

**Decision.** The family MUST ratify the Claude Code hook exit-code contract: exit 0 with stdout JSON for structured success output; exit 2 with stderr fed back to the model as blocking. Hook scripts MUST reference plugin paths only via the `${CLAUDE_PLUGIN_ROOT}` variable (dollar-brace syntax), never a hard-coded path. Structured JSON output MUST include `hookEventName`. The family MUST ship ONE canonical demonstrative hook: a commitlint `commit-msg` hook, which does double duty as a worked hook exemplar AND unblocks the release subsystem by enforcing Conventional Commits. The dash-ban is a RECOMMENDED family convention, NOT a mandated check; the Standard MUST NOT re-introduce a no-dashes conformance check.

**Alternatives considered.**
- *Re-mandate the dash-ban as a check.* Rejected: it directly contradicts Standard v0.11 ADR 0028, which retired it as a non-portability stylistic preference; a plugin MAY still opt in via its own PreToolUse hook.
- *Ship many demonstrative hooks.* Rejected: one canonical hook that also serves a real need (Conventional Commits) is a better exemplar than a gallery of toy hooks with no downstream use.
- *No exit-code clause, just convention by example.* Rejected: the exit-code contract is the load-bearing safety property (exit 2 blocks) and SHOULD be normative, not implicit.

**Consequences.** The commit-msg hook is the gating prerequisite for D8's EXECUTE layer. The live Claude Code hooks reference [https://code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks) MUST be re-read to confirm the exact contract before the clause lands. Enforcing check candidate at Phase 5: a hook-shape check (uses `${CLAUDE_PLUGIN_ROOT}`, emits `hookEventName`); note the runner already has a `hook-documentation` check.

**Aligns-with.** Anthropic hooks reference [https://code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks); Conventional Commits [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/).

**Graduates-to.** Standard clause (hooks authoring and exit-code contract, Phase 5). Detailed in [`drafts/release-subsystem.md`](drafts/release-subsystem.md) (the commitlint hook) and the Standard amendments draft [`drafts/standard-amendments.md`](drafts/standard-amendments.md).

---

## D10 (cross-tool, truth-in-targeting)

**Status:** accepted

**Context.** AGENTS.md ([https://agents.md/](https://agents.md/)) is the cross-tool context surface, but the family has CLAUDE.md shim drift (only pm-skills and writing-style-catalog carry the CLAUDE.md shim; thinking-framework-skills and agent-skills-toolkit lack it), no GEMINI.md anywhere, and no `.agents/` Codex directory in any repo. Meanwhile `library.json` already carries an `agent-targets` array (for example `["claude", "codex"]`), but nothing verifies that a declared target is actually delivered. Codex genuinely supports plugins, a marketplace, agentskills.io-compatible skills, and native AGENTS.md, but the exact on-disk Codex paths have version churn and are not yet pinned.

**Decision.** AGENTS.md MUST be the single canonical cross-tool context source. Each DECLARED target that reads its own file MUST get a THIN shim that references AGENTS.md, never a divergent copy (CLAUDE.md for Claude Code; GEMINI.md only if `gemini` is a declared target). `agent-targets` MUST be load-bearing: a plugin MUST emit, and the gate MUST verify, the native distribution plus context shim for every declared target; if a target's deliverables are not shipped, that target MUST be dropped from `agent-targets` (no claiming a target you do not deliver). Skills MUST sit on the agentskills.io portable floor ([https://agentskills.io/specification.md](https://agentskills.io/specification.md)); Claude-Code-only frontmatter (`allowed-tools`, `model`, `disable-model-invocation`, context fork, and similar) MUST be quarantined as labeled extensions so one skill body degrades gracefully across tools (a skill MUST NOT be forked per tool). Adding a new tool is an adapter operation: declare it, emit its manifest, add its shim, and the gate verifies.

CODEX = SCOPE TO TRUTH: declaring `"codex"` in `agent-targets` claims PORTABILITY (agentskills.io skills plus AGENTS.md, already true and essentially free), NOT native marketplace distribution. Native `.agents/plugins/` Codex packaging is DEFERRED until a real Codex consumer exists; the upgrade path is trivial because `askit-init-marketplace` already scaffolds the Codex format. The CLAUDE.md shim drift on thinking-framework-skills and agent-skills-toolkit MUST be fixed.

**Alternatives considered.**
- *Deliver full native Codex packaging now.* Rejected: the on-disk Codex paths still churn and there is no Codex consumer; building an emitter against unstable paths is speculative work (this matches the STANDARD.md residual on confirming Codex paths before any emitter is built).
- *Drop "codex" from agent-targets entirely.* Rejected: the portability claim (agentskills.io skills plus AGENTS.md) is already true and free; dropping it would understate real capability. Scope-to-truth keeps the honest claim while deferring the expensive one.
- *Per-tool forked skill bodies.* Rejected: forking a skill per tool multiplies maintenance and guarantees divergence; quarantined labeled extensions keep one body that degrades gracefully.

**Consequences.** A new gate check, per-target presence verification (the runner already has `agent-targets.mjs` and `per-target-presence.mjs` to build on), lands advisory in Phase 2 and flips to blocking in Phase 4. The CLAUDE.md shim fix rides the D2 PUSH lane. Before any Codex emitter, the current Codex docs MUST be re-confirmed.

**Aligns-with.** AGENTS.md [https://agents.md/](https://agents.md/); agentskills.io [https://agentskills.io/specification.md](https://agentskills.io/specification.md); OpenAI Codex plugins [https://developers.openai.com/codex/plugins](https://developers.openai.com/codex/plugins) and skills [https://developers.openai.com/codex/skills](https://developers.openai.com/codex/skills).

**Graduates-to.** Standard clause (truth-in-targeting and the cross-tool shim contract, Phase 3 land plus Phase 4 blocking flip). Detailed in [`drafts/cross-tool-targeting.md`](drafts/cross-tool-targeting.md).

---

## D11 (frontmatter)

**Status:** accepted

**Context.** Frontmatter is inconsistent across artifact types and repos: keys vary in case, version-like and date-like scalars risk YAML coercion ([https://yaml.org/spec/1.2.2/](https://yaml.org/spec/1.2.2/) treats unquoted `1.0` as a float and unquoted dates specially), and a `keywords` field appears sometimes as an array and sometimes as a comma string. The agentskills.io specification ([https://agentskills.io/specification.md](https://agentskills.io/specification.md)) sets hard caps (name regex plus a 64-character name cap, a 1024-character description cap) that are the portable floor.

**Decision.** The family MUST define one frontmatter schema per artifact type (skill, ADR, doc, spec). Keys MUST be kebab-case. Version-like and date-like scalars MUST be quoted to avoid YAML float and date coercion. Fields MUST carry their correct type (a `keywords` array MUST be an array, not a comma-delimited string). Required keys per artifact type MUST be validated in CI. The agentskills.io caps (name regex plus 64-char name cap, 1024-char description cap) are the floor and MUST be respected. Claude-Code-only fields MUST be quarantined as labeled extensions per D10.

**Alternatives considered.**
- *One universal frontmatter schema for all artifacts.* Rejected: a skill, an ADR, a doc, and a spec need different required keys; one schema would either over-constrain skills or under-constrain ADRs.
- *Leave scalars unquoted and rely on authors.* Rejected: unquoted `version: 1.0` silently coerces to a float and `date:` values to YAML dates, which breaks string comparisons and pins; quoting is the deterministic fix.

**Consequences.** A frontmatter-validation check per artifact type lands in Phase 3 and Phase 4 (the runner already has `frontmatter-valid.mjs` and `docs-frontmatter.mjs` to extend). Existing artifacts may need scalar re-quoting, which rides the D2 PUSH lane where mechanical.

**Aligns-with.** YAML 1.2.2 [https://yaml.org/spec/1.2.2/](https://yaml.org/spec/1.2.2/); agentskills.io [https://agentskills.io/specification.md](https://agentskills.io/specification.md).

**Graduates-to.** Standard clause (one frontmatter schema per artifact type, validated in CI, Phase 3). Detailed in [`drafts/frontmatter-schemas.md`](drafts/frontmatter-schemas.md).

---

## D12 (exceptions)

**Status:** accepted

**Context.** A stop-and-flag PUSH campaign (D2) can clobber a deliberate per-repo exception unless exceptions are first-class and machine-readable. The Standard already provides a tier ceiling: errors above a repo's declared tier do not fail its build because the repo simply does not assert clauses above its tier. But genuine per-clause exceptions below the ceiling have no auditable home, and silent suppressions would let conformance rot invisibly.

**Decision.** The tier ceiling MUST be the PRIMARY exception mechanism: a repo declares a tier in `library.json` and does not assert clauses above it, so above-tier errors do not fail its build. A genuine per-clause exception MUST carry both an ADR in the repo's `docs/internal/decisions/` AND a machine-readable suppression that the gate reads. There MUST be NO silent suppressions: every exception is auditable through its ADR and its suppression entry. The gate MUST honor recorded suppressions so that PUSH campaigns do not overwrite deliberate exceptions.

**Alternatives considered.**
- *Tier ceiling only, no per-clause mechanism.* Rejected: some legitimate exceptions sit below a repo's declared tier and need a recorded, honored carve-out; without one, a repo would be forced to drop its whole tier to dodge a single clause.
- *Inline code-comment suppressions (the lint-disable pattern).* Rejected: inline suppressions are not auditable as a set and carry no rationale; an ADR plus a machine-readable entry keeps the reason and the suppression together and discoverable.

**Consequences.** The gate gains a suppression-reader; suppressions without a matching ADR SHOULD themselves be flagged. This is the safety interlock that makes D2's stop-and-flag pushes safe. Enforcing check candidate: a suppression-integrity check (every machine-readable suppression has a corresponding accepted ADR).

**Aligns-with.** MADR 4.0 [https://adr.github.io/madr/](https://adr.github.io/madr/) (the per-exception ADR).

**Graduates-to.** Standard clause (the exception rule, Phase 5). Recorded in [`drafts/standard-amendments.md`](drafts/standard-amendments.md).

---

## D13 (issues, effort, and roadmap conventions)

**Status:** accepted

**Context.** The family lacks a settled convention for tracking issues, efforts, and roadmaps. Codifying one now, before the structural P0 and P1 work lands, risks freezing a convention that the actual work would then contradict. This is the LOWEST-urgency decision.

**Decision.** The issue, effort, and roadmap conventions MUST be codified only AFTER the structural P0 and P1 work has landed, so the convention reflects settled practice rather than speculation. The intended direction (not yet ratified) is: MADR decisions for choices, local-first markdown backlogs for work tracking, and the orchestration campaign-record (FC-NNNN ids) for cross-repo work. This direction MUST be confirmed against settled practice at Phase 5 before any clause lands.

**Alternatives considered.**
- *Codify the convention now, alongside the other decisions.* Rejected: it would ratify a convention from an unsettled exemplar, which violates the "no clause ratified from a non-conforming exemplar" sequencing invariant; the convention should describe what the structural work actually settled into.

**Consequences.** This decision intentionally produces no immediate work. At Phase 5 the settled practice is read off the completed P0/P1/structural efforts and codified. Enforcing check is likely an explicit aspirational label rather than a hard check, given the local-first markdown nature.

**Aligns-with.** MADR 4.0 [https://adr.github.io/madr/](https://adr.github.io/madr/); the orchestration campaign model in [`docs/internal/orchestration/`](../../../docs/internal/orchestration/).

**Graduates-to.** Family-law ADR in [`agent-plugins/standards/decisions/`](../../../standards/decisions/) plus, if any clause proves enforceable, a Standard clause at Phase 5. Detailed in [`drafts/orchestration-campaigns.md`](drafts/orchestration-campaigns.md).

---

## Cross-reference summary

| Decision | Type | Graduates to | Phase | Enforcing check status |
|---|---|---|---|---|
| D1 (deliverable) | process | stays in `_local/` | n/a | none (process artifact) |
| D2 (Hybrid rollout) | family law | `standards/decisions/` | all | none (operating model) |
| D3 (docs/internal kept) | constraint | context in Phase 3 amendment | Phase 3 | none (prevents churn) |
| D4 (decision homes) | binding | Standard clause + GOVERNANCE Section 2 | Phase 3 | candidate: decisions-presence |
| D5 (dissolve _agent-context) | binding | Standard clause + `.gitignore` | Phase 3 | candidate: anti-presence |
| D6 (casing) | binding | Standard clause | Phase 3 | candidate: path-casing |
| D7 (no new init skill) | family law | `standards/decisions/` | Phase 1 | none (ownership) |
| D8 (release subsystem) | binding + law | Standard clause (PLAN) + ADR (EXECUTE) | Phase 3, Phase 5 | candidate: release-plan presence |
| D9 (hooks) | binding | Standard clause | Phase 5 | candidate: hook-shape |
| D10 (truth-in-targeting) | binding | Standard clause | Phase 3 land, Phase 4 blocking | per-target presence (advisory -> blocking) |
| D11 (frontmatter) | binding | Standard clause | Phase 3 | frontmatter-valid per type |
| D12 (exceptions) | binding | Standard clause | Phase 5 | candidate: suppression-integrity |
| D13 (issue/effort conventions) | family law | `standards/decisions/` (+ possible clause) | Phase 5 | likely aspirational label |

Sequencing invariants (carried from [`02-roadmap.md`](02-roadmap.md) and [`standards/GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 6): no clause is ratified without a named enforcing check OR an explicit aspirational label; no clause is ratified from a non-conforming exemplar; the Standard version, ADR number, and section number are allocated only at LAND on the protected branch.
