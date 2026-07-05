---
title: "B7 - Codex distribution workstream (D17) approval package"
description: Staged cross-repo package to deliver native Codex packaging for skills and MCP across the four family repos, gated on maintainer go
status: draft
last-updated: "2026-07-03"
---

# B7 - Codex distribution workstream (D17: deliver Codex)

**Lane:** B (cross-repo, approval-gated). **Gate:** per-package maintainer go (R2). **Decision of record:** [D17 (deliver Codex)](../../standards-plan-roadmap/03-decisions.md) - supersedes the D10 (truth-in-targeting) Codex-defer half.

This package OPERATIONALIZES the locked plan. It invents no decisions and allocates no version, ADR, or section numbers. The "why" (D17 rationale, scope exclusions, the two honest Codex states) lives in [cross-tool-targeting.md](../../standards-plan-roadmap/drafts/cross-tool-targeting.md); the confirmed on-disk facts live in [codex-paths-spike.md](../../standards-plan-roadmap/spikes/codex-paths-spike.md). This doc states only the executable what: the change set, the caveat-resolution tasks, verification, rollback, risks, and the approval ask.

## Purpose

Deliver **codex-distributed** for the family: native OpenAI Codex CLI packaging so a `"codex"` claim in a plugin's `agent-targets` resolves to an installable native plugin, not merely portable skills. Scope is deliberately narrow: **skills and MCP only.**

**Explicitly NOT in scope** (carve-outs reconfirmed by the spike, Section 2, and fixed by D17):
- **Codex subagents** - a distributed plugin cannot ship them; the Codex `plugin.json` has no `agents` field and subagents are user/project config under `~/.codex/agents/` or `.codex/agents/`. Subagents remain Claude-only.
- **Output styles and statusline** - Claude-only, no Codex distribution surface. Codex receives skills plus MCP, full stop.

## Naming hazard (disambiguate in every doc and commit message)

Two unrelated things share the name "codex". State which one on first use, always.

| Term | What it is | Role here |
| --- | --- | --- |
| **OpenAI Codex CLI (the distribution target)** | OpenAI's agent CLI, a first-class Standard target beside Claude Code | The `"codex"` in `agent-targets`; the thing this package packages for. |
| **the `codex` Claude Code plugin** | This family's `codex:*` consumer skills that drive a local Codex helper from inside Claude Code | A tool a user runs. NEVER what `agent-targets: ["codex"]` means. |

`agent-targets: ["codex"]` always means "consumable by OpenAI Codex CLI". Do not conflate the target with the consumer plugin that shares the name (per cross-tool-targeting.md Section 5).

## What this delivers (confirmed emitter target list)

Fixed by the spike (Section 4), unchanged from the drafts' assumptions.

**Per plugin** (in each skill repo, generated from canonical `library.json`):
- `.codex-plugin/plugin.json` - required `name` (kebab-case), `version` (semver), `description`; component pointers `skills: "./skills/"` and `mcpServers: "./.mcp.json"` when the plugin ships MCP; optional `interface`/metadata mapped from `library.json` (minimal - see caveat task T2).
- Bundled skills reachable via the manifest `skills` pointer, `skills/<name>/SKILL.md`, the same portable body as the Universal-tier source, no per-tool fork.
- `.mcp.json` at plugin root only when MCP is shipped.
- NO `agents` field, NO subagent files, NO output-style artifacts.

**Marketplace** (in agent-plugins, alongside the Claude `.claude-plugin/marketplace.json`):
- `.agents/plugins/marketplace.json` - root `{ name, interface:{displayName}, plugins:[...] }`; one entry per distributed plugin using the confirmed entry schema **`{ name, source:{source,path}, policy:{installation,authentication}, category }`** with `./`-prefixed paths relative to the marketplace root.

The emitter is not net-new tooling: per D7 (no new init skill), extend `askit-init-plugin` (plugin internals) and `askit-init-marketplace` (marketplace format), which already scaffold the Codex shapes.

## Change manifests (per repo, all additive)

Four skill repos ship the per-plugin artifacts; agent-plugins ships the marketplace and the gate flag.

| Repo | Files | Nature |
| --- | --- | --- |
| agent-skills-toolkit | `.codex-plugin/plugin.json`; `.mcp.json` (if MCP); confirm `library.json` `agent-targets` includes `"codex"`; extend `askit-init-plugin` / `askit-init-marketplace` emitters | new + tooling; **pilot repo** |
| thinking-framework-skills | `.codex-plugin/plugin.json`; `.mcp.json` (if MCP); confirm `agent-targets` | new |
| writing-style-catalog | `.codex-plugin/plugin.json`; `.mcp.json` (if MCP); confirm `agent-targets` | new |
| pm-skills | same as above, **blocked on its `library.json` landing** (Phase 1 / [B3](B3-phase-1-pm-skills.md)) | new, sequenced last |
| agent-plugins | `.agents/plugins/marketplace.json` (one entry per distributed plugin); enable `REGISTRY_CODEX_NATIVE` native verification in `validate-registry.mjs` check 9 (truth-in-targeting), advisory first | new + config |

The gate check itself (check 9, truth-in-targeting) is authored in [ci-repin-check.md](../../standards-plan-roadmap/drafts/ci-repin-check.md) and lands via the CI packages ([B5 (Phase 4 CI and Section 14)](B5-phase-4-ci-and-section-14.md)); this workstream's job is to emit real artifacts so `REGISTRY_CODEX_NATIVE` can be turned on.

## Caveat-resolution plan (resolve each spike caveat as a task, do not defer)

The spike is CONFIRMED-WITH-CAVEATS. Each residual (Section 5) becomes a concrete build-time task with a deliverable, discharging it rather than carrying it forward. None blocks the emitter's primary paths; all sit on optional or test-only surfaces.

| Task | Caveat resolved | Action | Deliverable |
| --- | --- | --- | --- |
| **T1 (install verb)** | Install verb not confirmed as a CLI (`codex plugin add` absent; `codex plugin marketplace add` is confirmed) | Run `codex plugin --help` on the pinned CLI; use a CLI install verb if present, else drive install via the TUI `/plugins` enable flow | Documented round-trip install path; affects the test harness only, no emitted file |
| **T2 (interface fields)** | `interface` object required-vs-cosmetic fields unknown for a non-app plugin | Build a minimal skills+MCP manifest, load it, observe which `interface` fields Codex requires vs ignores | The minimal `interface` sub-schema the emitter populates (no over/under-population) |
| **T3 (`.mcp.json` shape)** | Direct server map vs wrapped `mcp_servers` object unpinned | Pin the accepted shape against then-current docs plus a real load; MCP-bearing plugins only | The canonical `.mcp.json` shape the emitter writes |
| **T4 (CLI version pin)** | Exact Codex CLI version tag could not be corroborated from the changelog | Record `codex --version` on the round-trip machine; write the tested baseline into this doc, the workstream notes, and STANDARD Appendix A | A concrete tested-against version `<codex-cli-vX.Y.Z, recorded at round-trip time>` replacing the soft claim |

Version note: per the allocation-at-land invariant this doc does not pre-pick a Codex CLI version; T4 records the real one when the round-trip runs.

## Sequencing and dependencies

- **Unblocked to start.** The path-reconfirm spike has run and discharged OQ-6 (Codex on-disk paths reconfirm); it was the named prerequisite.
- **Parallelizable with Phase 4** (consolidate CI and graduate domains) per the roadmap; runs as its own cross-cutting workstream, not inside a phase.
- **pm-skills waits on Phase 1.** pm-skills has no `library.json` yet, so its Codex emission is sequenced after [B3 (Phase 1 pm-skills)](B3-phase-1-pm-skills.md) lands one. The other three repos proceed independently.
- **Blocking flip is deferred.** Native gate verification runs advisory (`warn`) once artifacts exist; the flip to blocking (`error`) is Phase 4 work owned by [B5](B5-phase-4-ci-and-section-14.md), the advisory-then-blocking rollout per D15 (advisory-then-blocking rollout) and D17.

## Verification

1. **Round-trip on a real Codex CLI** (pilot plugin first): `codex plugin marketplace add <owner/repo>` (or `--local <path>`), enable via `/plugins` (or the T1-confirmed verb), then confirm the plugin's bundled skills surface as `@skill-name` in the composer and any MCP servers load.
2. **Pin the tested version** (T4): capture `codex --version`; record it as the validated baseline.
3. **Gate verification:** run `validate-registry.mjs` with `REGISTRY_CODEX_NATIVE` enabled in advisory; for each codex-distributed plugin, check 9 asserts `.codex-plugin/plugin.json` exists with required fields, the `skills` pointer resolves to real `SKILL.md` files, and a matching `.agents/plugins/marketplace.json` entry is present.
4. **Green live run recorded** on the pilot before fan-out; the blocking flip stays with Phase 4 / B5.

## Rollback

Every emitted file is additive and the Claude distribution is untouched, so rollback is clean and per-repo independent.
- Revert the per-repo PR (delete `.codex-plugin/`, `.mcp.json`, the marketplace entry) and drop `"codex"` from that plugin's `agent-targets` (or reset it to codex-portable). Per D12 (exceptions), a deliberate divergence is a recorded suppression, never a silent omission.
- No consumer breakage: install is opt-in (users enable via `/plugins`); an un-emitted plugin simply is not listed.
- Keep `REGISTRY_CODEX_NATIVE` advisory or off during rollback so a partial emit never blocks CI on the way out.

## Risks

| ID | Risk | Mitigation |
| --- | --- | --- |
| R-CX1 (install verb) | No documented CLI install verb; round-trip depends on the TUI flow | T1 confirms the verb or uses `/plugins`; test-harness only, no emitted-file impact |
| R-CX2 (interface bloat) | Emitter over- or under-populates `interface` | T2 pins the minimal sub-schema before fan-out |
| R-CX3 (MCP shape) | `.mcp.json` shape drift breaks MCP-bearing plugins | T3 pins the shape; scoped to MCP plugins only |
| R-CX4 (version churn) | Codex paths could move in a future CLI release (soft version pin) | T4 records the tested version; native gate stays advisory until a green round-trip on it; re-run the spike on a version bump |
| R-CX5 (pm-skills P0 hole) | pm-skills has no `library.json`; a blocking check would fail it | Sequence pm-skills Codex emission after Phase 1 / B3; other repos proceed |
| R-CX6 (naming confusion) | OpenAI Codex CLI vs the `codex` Claude Code plugin leaks into docs/commits | The naming-hazard note; disambiguate on first use everywhere |
| R-CX7 (marketplace coupling) | Marketplace lists a plugin whose repo has not emitted `.codex-plugin/` (declare > emit mismatch) | Land per-repo emission before adding the marketplace entry; check 9 catches the mismatch |

## Recommendation

**Approve the workstream to open, staged as a pilot-then-fan-out.** OQ-6 is discharged, the scope is additive and fully reversible, and the emitter reuses existing scaffolding (D7). Recommended shape:
1. Run caveat tasks T1-T4 and one full round-trip on a single pilot plugin in **agent-skills-toolkit** (the tooling home); record the pinned Codex CLI version.
2. Enable `REGISTRY_CODEX_NATIVE` in advisory only after the pilot round-trip is green.
3. Fan out to the remaining plugins and repos, one PR per repo (stop-and-flag), pm-skills last (after B3).
4. Hold the blocking-gate flip for Phase 4 / B5.

This is a Lane B cross-repo package: nothing fires without the maintainer's per-package go (R2). It has no hard dependency on Lane A merges beyond the general CI keystone.

## Approval checklist

- [ ] Maintainer go to open the Codex distribution workstream (R2 per-package go)
- [ ] Pilot repo/plugin confirmed (recommend agent-skills-toolkit)
- [ ] Caveat tasks T1-T4 scheduled before fan-out
- [ ] pm-skills Codex emission sequenced after Phase 1 `library.json` (B3)
- [ ] `REGISTRY_CODEX_NATIVE` enabled advisory-only until the pilot round-trip is green; blocking flip deferred to Phase 4 (B5)
- [ ] Tested Codex CLI version to be recorded in this doc and STANDARD Appendix A at round-trip time
- [ ] Naming-hazard disambiguation applied in all workstream docs and commit messages

## Related

- [03-execution-plan.md](../03-execution-plan.md) - two-lane model and gates
- [06-ci-plan.md](../06-ci-plan.md) - CI evolution, where check 9 native verification sits
- [08-decision-register.md](../08-decision-register.md) - D17 ruling and open questions
- [09-risk-register.md](../09-risk-register.md) - program risk roll-up
- [B5-phase-4-ci-and-section-14.md](B5-phase-4-ci-and-section-14.md) - the Phase 4 blocking flip for check 9
- [B3-phase-1-pm-skills.md](B3-phase-1-pm-skills.md) - the pm-skills `library.json` this workstream waits on

## Change log

| Date | Change |
| --- | --- |
| 2026-07-03 | created |
