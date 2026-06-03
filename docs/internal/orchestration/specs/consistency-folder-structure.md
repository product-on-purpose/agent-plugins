# Spec: consistent folder structure

> Bring the four plugin repos onto one canonical layout, extending `STANDARD.md` Section 10.1, and orchestrate convergence. Status: DRAFT / PROPOSED (2026-06-02). Backlog epic E2.

## 1. Goal

One predictable repository layout across the family, so a contributor (or an agent) moving between repos finds the same folders in the same places, and so fleet changes can target stable paths. The Standard already specifies a layout (10.1); this initiative makes the four live repos match it and sharpens the clause where reality disagrees.

## 2. Current drift (to be confirmed by the E2.1 audit)

Observed divergences worth auditing precisely (do not treat as final until E2.1):

- **Working-scratch casing**: `_LOCAL/` (pm-skills, writing-style-catalog, agent-plugins) vs `_local/` (agent-skills-toolkit, thinking-framework-skills).
- **Tooling dir**: `scripts/` (pm-skills, tfs, wsl, askit) vs an additional `tools/` (writing-style-catalog, for its Python taxonomy tooling).
- **Decision records**: `docs/internal/decisions/` (MADR, per 10.1) vs `docs/internal/adr/` (writing-style-catalog, where ADR 0011/0014 live).
- **Agent-context**: `_agent-context/` naming and contents vary (session-logs presence/location).
- **Site sub-case**: all four now use the Astro `site/` subdir (Pattern S, already converged) - a proven instance of this initiative.
- **Repo-specific roots**: `library/` (pm-skills), `taxonomy/`/`schemas/`/`examples/` (wsl), `recipes/`/`intros/` (tfs), `evals/`/`templates/` (askit) - some are legitimate per-plugin content, some are drift.

The audit must separate **legitimate per-plugin content** (keep) from **convention drift** (converge).

## 3. Target

- Adopt the `STANDARD.md` 10.1 layout as canonical; resolve the open casing/naming choices once (recommendations: `_LOCAL/` upper-case to match the gitignore convention and the majority; `scripts/` as the tooling home with language-agnostic content; `docs/internal/decisions/` (MADR) as the single decision home, migrating `adr/`).
- Fold in the Astro `site/` sub-case (already in 10.1's spirit; make it explicit).
- Each repo documents any intentional deviation as a local ADR (so the stop-and-flag rule has something to read).

## 4. Plan

1. **E2.1** Orchestrate a read-only **layout audit** (one agent per repo - the read-only fan-out shape) producing a per-repo drift table vs 10.1. (This is itself a good first orchestration exercise; no writes.)
2. **E2.2** Reconcile the audit into a canonical layout; resolve the casing/naming decisions; draft the 10.1 amendment.
3. **E2.3** Orchestrate convergence as a fleet change (renames/moves), pilot first; stop-and-flag on any path another tool/CI depends on.
4. **E2.4** Graduate the layout clause into `STANDARD.md` via GOVERNANCE; repos re-adopt by version pin.

## 5. Acceptance

- A committed canonical-layout definition (10.1 amendment) with the open naming choices resolved.
- The four repos match it, or carry a local ADR for each sanctioned deviation.
- No CI/tooling path breaks (each convergence PR green).

## 6. Dual documentation

Central: this spec + the 10.1 clause + the campaign record. Local: each repo's move PR + a CHANGELOG entry (and an ADR for any retained deviation) referencing the campaign id. The canonical layout is defined once (the Standard); repos reference it, never copy it.

## 7. Open questions

- `_LOCAL` vs `_local` final casing.
- `tools/` retained for non-Node tooling, or folded into `scripts/`?
- Migration order for `docs/internal/adr/` -> `decisions/` (touches committed ADR references).
