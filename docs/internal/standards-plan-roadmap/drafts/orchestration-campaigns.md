# Orchestration campaigns (Hybrid PUSH)

> Ready-to-run campaign briefs for the mechanical, judgment-free conventions that decision D2 (rollout: Hybrid) PUSHes across the family as one-PR-per-repo fleet changes. Each brief is authored in the format of the orchestration capability spec ([`docs/internal/orchestration/specs/orchestration-capability.md`](../../../../docs/internal/orchestration/specs/orchestration-capability.md)): a uniform-intent change, a per-repo parameter table, an acceptance check, and explicit stop-and-flag rules. These campaigns carry the mechanical clauses; the Standard version pin is never pushed - it stays PULL per repo (each plugin re-adopts on its own cadence, preserving the allocation-at-land collision-avoidance). FC ids below are PLACEHOLDERS, allocated for real at campaign open per the allocation-at-land discipline.

## How to read this file

- The fleet model, the levels, the decision rule, and the dual-documentation model live in the orchestration [guide](../../../../docs/internal/orchestration/guide.md). This file does not restate them; it instantiates them for the five mechanical convergences this roadmap requires.
- Every campaign here is Class `uniform-mechanical` (guide Section 4 decision rule: uniform intent, low judgment). Mechanical does NOT mean unguarded: each one still carries stop-and-flag rules because the family learned (Astro rollout) that orchestration amplifies a wrong assumption four times. The triggers below are concrete, drawn from on-disk tooling that actually depends on the paths being moved.
- Each campaign lands one PR per repo (`chore/fc-NNNN`), each with its own CHANGELOG entry referencing the FC id, each green on its own CI before merge. There is no cross-repo commit.
- Sequencing: these campaigns map onto the roadmap phases. C4 (_agent-context dissolution) and C1 (_local casing) are Phase 3 (scaffolding and dual-audience) mechanical pushes; C2 (decision-home convergence) and C3 (CLAUDE.md shim) are Phase 3 as well; C5 (frontmatter keys) is gated on D11 (frontmatter schema) landing in the Standard, so it is also Phase 3 but sequenced last. None push the Standard version pin.

## PULL vs PUSH (the invariant for all five)

| Axis | Mechanism | Why |
|---|---|---|
| Standard version pin (`standard` field in `library.json`) | PULL - each repo re-adopts on its own cadence | Preserves allocation-at-land; a forced pin would couple four release units and bypass each repo's re-adoption review |
| Folder casing, decision-home location, context shim files, frontmatter keys | PUSH - orchestrated one-PR-per-repo campaign | Judgment-free, identical-intent conventions; running them four times by hand invites drift |

The campaigns below ONLY push the right-hand row. Where a campaign would otherwise nudge a repo's `standard` pin (for example C5, which depends on a Standard amendment), the brief notes that the repo picks up the schema requirement when it next re-adopts the pin, not when the campaign lands.

---

## Affected-repos key

The fleet is four plugin repos plus `agent-plugins` (the control repo, sometimes itself a target for mechanical hygiene). On-disk facts below were confirmed by reading each repo's `git ls-files`, `.gitignore`, and CI scripts as of 2026-06-17. Because Windows is case-insensitive, `_LOCAL` and `_local` resolve to the same directory on disk; what matters is the **git-tracked** casing and the **.gitignore** literal, which is what each table records.

| Repo | base path | tracked scratch casing | _agent-context tracked? | gitignore literals (scratch/context) | decision home | CLAUDE.md present? |
|---|---|---|---|---|---|---|
| pm-skills | /pm-skills | (none tracked) | YES - `_agent-context/` tree incl. `DECISIONS.md`, `claude/`, `codex/`, `session-log/` | `_LOCAL/`; `_agent-context/*/TODO.md`; `_agent-context/*/PLANNING/`; un-ignores `CONTEXT.md`/`DECISIONS.md` | `_agent-context/DECISIONS.md` (ad-hoc, NOT root, NOT MADR) | YES |
| thinking-framework-skills | /thinking-framework-skills | (none tracked) | no | `_local/`; `_agent-context/` | none yet | NO (drift) |
| agent-skills-toolkit | /agent-skills-toolkit | (none tracked) | no | `_local/`; `_LOCAL/` (dual-cased, with comment); `_agent-context/` | `docs/internal/decisions/` (correct reference) | NO (drift) |
| writing-style-catalog | /writing-style-catalog | (none tracked) | YES (gitignored split: `session-log/`, `gate-pilot/`) | `_LOCAL/`; `_agent-context/session-log/`; `_agent-context/gate-pilot/` | `docs/internal/adr/` (16 ADRs, to rename) | YES |
| agent-plugins | /agent-plugins | (none tracked) | YES - commits `_agent-context/session-logs/` | `_LOCAL/`; `_agent-context/*`; un-ignores `session-logs/` | `standards/decisions/` (family-law ADRs, separate, correct) | n/a (no root CLAUDE.md; only `.claude-plugin/`) |

---

## Campaign C1 - FC-CASING (_LOCAL -> _local family-wide)

- Id: FC-CASING (placeholder; allocate at open)
- Class: uniform-mechanical
- Enforces: D6 (casing: _local lowercase everywhere) ahead of the Phase 3 folder-layout clause
- Pilot repo: thinking-framework-skills (already gitignores `_local/` lowercase; lowest blast radius)

### Change (uniform intent)

Make `_local` the single tracked + gitignored casing for the working-scratch directory in every repo. Eliminate the `_LOCAL`/`_local` git case-collision footgun (a case-insensitive Windows checkout cannot hold both; a contributor on a case-sensitive filesystem can create a phantom second directory). agent-skills-toolkit's own gitignore comment already documents this trap.

### Per-repo parameters

| Repo | current gitignore literal | action | git mv needed? |
|---|---|---|---|
| pm-skills | `_LOCAL/` | rewrite to `_local/` | only if tracked files exist under `_LOCAL/` (none tracked - rename is gitignore-only) |
| thinking-framework-skills | `_local/` | already correct - PILOT proves the no-op baseline | no |
| agent-skills-toolkit | `_local/` + `_LOCAL/` (dual) | drop the `_LOCAL/` line and its two comment lines; keep `_local/` | no |
| writing-style-catalog | `_LOCAL/` | rewrite to `_local/`; sweep `check-no-dashes.mjs` SKIP_PREFIX | no (gitignore) - BUT script edit required (see flag) |
| agent-plugins | `_LOCAL/` | rewrite to `_local/`; the standards-plan-roadmap package has moved to committed `docs/internal/standards-plan-roadmap/` and is out of scope here, so this campaign only retargets any remaining `_LOCAL/` scratch | no |

### The Windows two-step git mv mechanic (only if a casing rename ever touches TRACKED files)

No repo currently tracks files under `_LOCAL/`, so for this campaign the change is gitignore-literal-only and the two-step is not triggered. The mechanic is documented here because the layout campaigns reuse it and a future tracked-file casing rename WILL need it. On a case-insensitive filesystem `git mv _LOCAL _local` is a no-op (same inode). The reliable two-step is:

```
git mv _LOCAL _local_tmp
git mv _local_tmp _local
git commit
```

Each step is a distinct path git records, so the rename is captured even though the OS sees one directory. Verify with `git show --stat HEAD` that the rename lines appear.

### Stop-and-flag triggers

- writing-style-catalog `scripts/check-no-dashes.mjs` hardcodes `const SKIP_PREFIX = ['docs/internal/', '_LOCAL/'];` (line 40) and `scripts/README.md` documents `_LOCAL/`. The casing change MUST update both, or the dash-check stops skipping scratch and may go red. This is the one repo where C1 is not a pure gitignore edit - STOP and confirm the script edit landed and the `validate` job is still green.
- Any other repo: grep `_LOCAL` across `scripts/`, `.github/`, `site/scripts/` before committing; if a literal is found in tooling, flag rather than silently rename.
- If a repo has on-disk `_LOCAL/` content that is NOT gitignored (unexpected), STOP - do not blindly delete.

### Verification (per repo)

- `grep -rn '_LOCAL' .gitignore scripts .github site/scripts 2>/dev/null` returns nothing (only `_local`).
- The repo's existing CI (`validate`/`ci`) is green on the PR.

### PULL vs PUSH

Pure PUSH. No Standard version pin touched.

---

## Campaign C2 - FC-DECISIONS (converge decision homes to docs/internal/decisions/ MADR)

- Id: FC-DECISIONS (placeholder)
- Class: uniform-mechanical for the MOVE; the pm-skills CONVERSION carries one judgment seam (flagged below)
- Enforces: D4 (decision homes - MADR 4.0 ADRs in `docs/internal/decisions/`) per the canonical reference at agent-skills-toolkit. Cite MADR 4.0: https://adr.github.io/madr/
- Pilot repo: writing-style-catalog (a clean directory rename; proves the path before the messier pm-skills conversion)

### Change (uniform intent)

Every repo records its internal decisions as MADR 4.0 ADRs under `docs/internal/decisions/` (NNNN- numbering, status frontmatter, immutable once accepted). Converge the two non-conforming repos to that home. The family-law ADRs at `agent-plugins/standards/decisions/` are a SEPARATE, correct home and are explicitly OUT of scope.

### Per-repo parameters

| Repo | current state | action |
|---|---|---|
| agent-skills-toolkit | `docs/internal/decisions/` already correct | no-op (the reference; do not touch) |
| writing-style-catalog | `docs/internal/adr/` with 16 tracked ADRs (0001-0016, minus 0009) | two-step `git mv` of the directory `adr/` -> `decisions/`; update any in-repo references to `docs/internal/adr/` |
| pm-skills | `_agent-context/DECISIONS.md` (single ad-hoc log) | CONVERT the log into proper per-decision MADR ADR files under `docs/internal/decisions/` + a thin generated index; remove the ad-hoc log from `_agent-context/` (it also leaves with C4) |
| thinking-framework-skills | none yet | no move; create `docs/internal/decisions/` with a README only when the repo first records a decision (out of THIS campaign's write scope - note in record as "no decisions yet") |
| agent-plugins | `standards/decisions/` (family-law) | OUT of scope - do not touch |

### The directory rename mechanic (writing-style-catalog)

Use the two-step from C1 on the directory:

```
git mv docs/internal/adr docs/internal/decisions_tmp
git mv docs/internal/decisions_tmp docs/internal/decisions
```

Then grep for and update `docs/internal/adr` references (the repo's own docs, READMEs, and any CI script). writing-style-catalog ADR 0011 and 0014 are referenced by other docs per the folder-structure spec - the references move with the rename, not the meaning.

### Stop-and-flag triggers

- writing-style-catalog: any tracked file referencing the literal `docs/internal/adr/` (validator config, README, cross-ADR links) MUST be updated in the same PR. STOP if a reference points outside the repo's own tree.
- writing-style-catalog ADR 0014 (repository naming) records a DELIBERATE identity decision; do not let the rename tempt any renumbering or content edit - it is a path move only, ADR bodies are immutable.
- pm-skills: the conversion from one log to many ADRs is the single non-mechanical seam in this whole file. Each historical decision in `_agent-context/DECISIONS.md` (and the `claude/DECISIONS.md` / `codex/DECISIONS.md` variants) must be split into a numbered MADR file. This is real authoring; run it as a deliberate in-repo session (Phase 1 already schedules a pm-skills session), NOT a blind fan-out. The fleet record references it but the work is per-repo. STOP and hand back if decisions conflict between the claude/ and codex/ copies.
- pm-skills CI: `scripts/check-count-consistency.ps1` references `_agent-context/claude/CONTEXT.md` and `_agent-context/claude/DECISIONS.md` (lines 70-71); removing those files without updating the check turns CI red. Coordinate with C4.

### Verification (per repo)

- writing-style-catalog: `docs/internal/adr/` no longer exists; `docs/internal/decisions/` holds the 16 ADRs; `git show --stat` shows renames; no tracked file references the old path; CI green.
- pm-skills: `docs/internal/decisions/NNNN-*.md` exist with MADR frontmatter; a thin index lists them; the old log is gone; the count-consistency check passes.

### PULL vs PUSH

PUSH for the writing-style-catalog directory move (judgment-free). The pm-skills conversion is per-repo deliberate work coordinated under the campaign id, not a fan-out. No Standard version pin touched.

---

## Campaign C3 - FC-SHIM (add thin CLAUDE.md shim to the two repos missing it)

- Id: FC-SHIM (placeholder)
- Class: uniform-mechanical
- Enforces: D10 (cross-tool / truth-in-targeting) - AGENTS.md is the single canonical cross-tool source; each declared target that reads its own file gets a THIN shim referencing AGENTS.md, never a divergent copy. Cite AGENTS.md: https://agents.md/
- Pilot repo: thinking-framework-skills (smaller AGENTS.md surface)

### Change (uniform intent)

Add a thin root `CLAUDE.md` to every repo that declares `claude` as an agent-target but lacks the shim. The shim references `AGENTS.md` and adds only Claude-Code-specific orientation if any; it MUST NOT duplicate AGENTS.md content (a divergent copy is the drift this fixes). Use the same shim shape that pm-skills and writing-style-catalog already carry, so the fleet ends with four identical-shaped shims.

### Per-repo parameters

| Repo | CLAUDE.md present? | declares claude target? | action |
|---|---|---|---|
| pm-skills | YES | yes | no-op (reference shim shape) |
| writing-style-catalog | YES | yes | no-op (reference shim shape) |
| thinking-framework-skills | NO (drift) | yes (`library.json` agent-targets) | ADD thin shim referencing AGENTS.md |
| agent-skills-toolkit | NO (drift) | yes (`library.json` agent-targets) | ADD thin shim referencing AGENTS.md |
| agent-plugins | no root CLAUDE.md | not a plugin (only `.claude-plugin/`) | OUT of scope (not a published plugin with agent-targets) |

### Stop-and-flag triggers

- Before adding the shim, confirm the repo's `library.json` actually lists `claude` in `agent-targets`. D10's truth-in-targeting rule says a declared target MUST get its shim AND its native distribution; if a repo does NOT declare `claude`, do not add a CLAUDE.md (and separately flag that as a targeting question, not a C3 action).
- Copy the SHAPE of the existing shims (pm-skills / writing-style-catalog), not their content - the shim must point at THIS repo's AGENTS.md. STOP if the existing shims themselves contain divergent (non-pointer) content, because then the "reference shape" is itself drift to resolve first.
- Do NOT add a GEMINI.md (no repo declares gemini) and do NOT create a `.agents/` directory (reserved by Codex; native Codex distribution is deferred per D10 until a real Codex consumer exists).

### Verification (per repo)

- Root `CLAUDE.md` exists, is thin (points to `AGENTS.md`), and contains no copied AGENTS.md body.
- All four plugin repos now carry the shim with the same shape.
- CI green.

### PULL vs PUSH

Pure PUSH. No Standard version pin touched. (The Standard CLAUSE that mandates the shim contract lands in Phase 3 and is adopted per repo by version pin - PULL - but the FILE itself is pushed now so the drift is fixed ahead of the clause.)

---

## Campaign C4 - FC-CONTEXT (dissolve _agent-context; fix .gitignore everywhere)

- Id: FC-CONTEXT (placeholder)
- Class: uniform-mechanical for the gitignore/relocation; pm-skills carries CI-script coupling (flagged)
- Enforces: D5 (dissolve _agent-context). Remove the `_agent-context/` concept entirely. Session logs become `_local/session-logs/` (gitignored ephemeral scratch). The committed agent-facing layer is root `AGENTS.md` + thin `CLAUDE.md` shim + `docs/internal/`. There is NO `_agent-context/` and NO `AGENTS/` folder. Pairs with D6 (session-logs/ lowercase plural).
- Pilot repo: thinking-framework-skills (gitignores `_agent-context/` already, tracks nothing under it - a clean baseline) then agent-plugins (committed `session-logs/` is the canonical case to prove relocation)

### Change (uniform intent)

1. Remove every `_agent-context/` rule from `.gitignore` and stop tracking anything under `_agent-context/`.
2. Relocate any DURABLE content that lived in `_agent-context/` into its proper home: decisions -> `docs/internal/decisions/` (via C2), durable context/orientation -> `AGENTS.md` + `docs/internal/`. Raw session logs -> `_local/session-logs/` (gitignored ephemeral). Principle: distill durable knowledge into its home; keep raw scratch ephemeral.
3. Add `_local/session-logs/` is covered by the existing `_local/` ignore - no special un-ignore line. Retire the split-pattern that committed `session-logs/`.

### Per-repo parameters

| Repo | _agent-context tracked content | gitignore action | relocation action |
|---|---|---|---|
| thinking-framework-skills | none | drop `_agent-context/` line | none (baseline) |
| agent-skills-toolkit | none | drop `_agent-context/` line | none |
| writing-style-catalog | gitignored only (`session-log/`, `gate-pilot/`) | drop the two `_agent-context/...` lines | move any on-disk durable content; on-disk session-logs become `_local/session-logs/` (already ignored) |
| pm-skills | TRACKED tree: `DECISIONS.md`, `claude/`, `codex/`, `session-log/` | rewrite the `_agent-context/*` un-ignore block away | DECISIONS -> ADRs (C2); CONTEXT durable bits -> AGENTS.md/docs; session-log/ -> `_local/session-logs/`; codex/ templates -> `_local/` or docs as appropriate |
| agent-plugins | TRACKED: `_agent-context/session-logs/...` (the split D5 retires) | replace `_agent-context/*` + `!_agent-context/session-logs/` with a single `_local/` ignore | `git rm` the tracked session-logs (move to `_local/session-logs/` as ephemeral) |

### Stop-and-flag triggers (this campaign has the most coupling - read carefully)

- pm-skills CI scripts hardcode `_agent-context` paths and WILL break:
  - `scripts/check-context-currency.ps1` and `.sh` scan `_agent-context/*/CONTEXT.md`.
  - `scripts/check-count-consistency.ps1` lists `_agent-context/claude/CONTEXT.md` and `_agent-context/claude/DECISIONS.md` (lines 70-71).
  These checks MUST be rewritten (point at the new homes) or retired in the SAME PR, or pm-skills CI goes red. STOP and hand back if the right new home for `check-context-currency` is unclear (does AGENTS.md inherit the currency check?). This is the judgment seam in C4.
- agent-skills-toolkit `scripts/checks/source-doc.mjs` line 20 lists `_agent-context` among ignored-source prefixes. Removing the directory does not break it (an absent prefix is harmless), but flag it for cleanup so the prefix list stops naming a retired concept.
- agent-plugins: `git rm --cached` the committed `_agent-context/session-logs/...` so history is preserved but the file leaves the index; confirm no doc links to the committed path.
- General: before deleting any `_agent-context/` content, classify each file as DURABLE (relocate, do not lose) vs SCRATCH (ephemeral, drop). STOP if a file's classification is unclear rather than deleting durable knowledge.

### Verification (per repo)

- `git ls-files | grep _agent-context` returns nothing.
- `grep -rn '_agent-context' .gitignore scripts .github` returns nothing (pm-skills and askit scripts updated/flagged).
- Session logs (if any) live under `_local/session-logs/` and are gitignored.
- CI green.

### PULL vs PUSH

PUSH for the gitignore + relocation mechanic across the three clean repos. pm-skills CI-script rewrite is per-repo deliberate work (Phase 1 session) under the campaign id. No Standard version pin touched.

---

## Campaign C5 - FC-FRONTMATTER (adopt the one-schema-per-artifact frontmatter keys)

- Id: FC-FRONTMATTER (placeholder)
- Class: uniform-mechanical, GATED on D11 landing in the Standard
- Enforces: D11 (frontmatter) - one schema per artifact type (skill, ADR, doc, spec): kebab-case keys, version-like and date-like scalars quoted, correct types (keywords is an array not a comma string), required keys validated in CI. agentskills.io caps are the floor: name regex + 64-char name cap, 1024-char description cap. Cite agentskills.io: https://agentskills.io/specification.md and YAML 1.2.2 (why quote scalars): https://yaml.org/spec/1.2.2/
- Pilot repo: agent-skills-toolkit (owns the conformance runner; proves the keys against the gate first)

### Gate (do not open before this is true)

C5 MUST NOT open until D11's frontmatter schema has LANDED as a Standard clause with a named enforcing check (the sequencing invariant: no clause ratified without a named check or an explicit aspirational label). The campaign rolls out CONFORMANCE to an already-ratified schema; it does not invent keys. Until then this brief is staged, not runnable.

### Change (uniform intent)

Normalize artifact frontmatter to the ratified schema in every repo: kebab-case keys; quote version-like (`"0.12"`) and date-like (`"2026-06-13"`) scalars to dodge YAML float/date coercion; convert any comma-string `keywords` to a YAML array; ensure required keys per artifact type are present. Claude-Code-only fields (allowed-tools, model, disable-model-invocation, context fork, etc.) stay as labeled extensions per D10, never inlined into the portable floor.

### Per-repo parameters

| Repo | artifact types present | likely fixes |
|---|---|---|
| pm-skills | skills, ADRs (post-C2), docs | quote versions/dates; array-ize keywords; required-key fill |
| thinking-framework-skills | skills, docs | same |
| agent-skills-toolkit | skills, ADRs, docs, specs, evals | same; this repo's checks validate the keys |
| writing-style-catalog | skills, ADRs (post-C2), docs | same |
| agent-plugins | family-law ADRs (`standards/decisions/`), docs | quote versions/dates in ADR frontmatter; align with the ADR schema |

### Stop-and-flag triggers

- A bare `keywords: a, b, c` comma string vs a YAML array is a TYPE change; confirm downstream consumers (the gate, site generators) read the array form before flipping, or you break rendering. STOP if any tool parses the comma form.
- Quoting a previously-unquoted version that a script parses as a number could change a comparison; flag any version field consumed by tooling.
- Do NOT add or rename keys beyond the ratified schema; if a repo has an extra key, that is a per-clause exception question (D12 - exceptions: ADR + machine-readable suppression), not a silent C5 edit.
- agentskills.io caps (64-char name, 1024-char description) are hard limits; if a fix would exceed them, STOP - that is content work, not a mechanical key normalization.

### Verification (per repo)

- The repo's frontmatter-validation check (the D11 enforcing check) passes.
- Spot-check: version and date scalars are quoted; `keywords` is an array; required keys present.
- CI green.

### PULL vs PUSH

PUSH for the key normalization (judgment-free against a ratified schema). The SCHEMA itself arrives by Standard amendment, adopted per repo via the version pin - PULL. So a repo that has not yet re-adopted the D11-bearing Standard version may be normalized for hygiene now but only ASSERTS the check when its pin reaches that version (tier ceiling, D12, prevents a premature failure).

---

## Cross-campaign coordination notes

- **C2 + C4 are coupled in pm-skills.** The pm-skills `_agent-context/DECISIONS.md` is both a decision-home problem (C2) and an _agent-context-dissolution problem (C4), and the same CI script (`check-count-consistency.ps1`) names the files both touch. Run pm-skills' C2 and C4 in the SAME deliberate in-repo session (the Phase 1 pm-skills session), under both campaign ids, so the ADR conversion, the file removal, and the CI-script rewrite land together and green.
- **C1 + the layout clause.** C1 settles casing ahead of the Phase 3 folder-layout amendment so the clause ratifies from a conforming fleet (sequencing invariant: no clause ratified from a non-conforming exemplar). The existing folder-structure spec recommends UPPERCASE `_LOCAL`; D6 overrides it to lowercase `_local`, so that spec's open question is resolved by D6 and the spec text should be updated when the layout clause is drafted.
- **C3 ahead of the shim clause.** C3 fixes the CLAUDE.md drift before the Phase 3 shim contract ratifies, for the same conforming-exemplar reason.
- **C5 last.** C5 cannot precede its Standard clause. It is staged here so the brief is ready the moment D11 lands.

## Dual documentation for these campaigns

Per the guide's dual-documentation model: the CENTRAL record for each campaign is its `docs/internal/orchestration/campaigns/FC-NNNN/` spec + record (status table: repo -> PR -> result/flagged). The LOCAL record is each repo's PR + CHANGELOG entry referencing the FC id (and an ADR only where a repo makes a local decision, for example a sanctioned deviation under D12). Neither side copies the other; the FC id is the join. These five briefs are the DRAFT central intent; they become live campaign specs (with real FC ids allocated at open) when execution starts in Phase 3.
