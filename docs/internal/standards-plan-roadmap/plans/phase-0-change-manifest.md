# Phase 0 change manifest: current state vs new state

> The before/after review gate for the Phase 0 relocation. Every change in every repo, with its current state, new state, the reasoning, and the Standard or decision that justifies it. Read this with [`phase-0-truth-and-relocation.md`](phase-0-truth-and-relocation.md) (the task-by-task plan). Nothing executes until this is reviewed.

## Locked premises (so every row below is unambiguous)

- **Version bump: NO bump.** The relocation changes zero normative clauses, so it lands as a structural ADR-only move; the `STANDARD.md` header stays `0.12`. `0.13` is left free for the U13 (skill-registration) warn-to-error burndown already declared in the v0.12 header. The ADR and the new `standards/CHANGELOG.md` record "structural relocation, no normative change."
- **askit keeps its Gold grade.** Moving the checks out does NOT violate G2, because G2 requires a plugin to RUN the validators, not OWN them.
- **The runner is location-portable.** It grades whatever root is passed as its first argument (D14 spike: it graded `thinking-framework-skills` against that repo's own `0.8` pin, exit 0). So relocation does not change what it grades.
- **No dark window.** askit's gate stays green at every step: the runner is COPIED into `agent-plugins` first (askit still has its copy), askit is repointed and verified green, and only THEN is askit's copy deleted.

## Reference key (the clauses cited in the tables)

| Ref | What it says | Where |
|---|---|---|
| ADR 0001 | Canonical home of the Standard is `agent-plugins/standards/`; a member plugin must not neutrally own the law it must obey. | `agent-plugins/standards/decisions/0001-standard-governance-and-home.md` |
| GOV 2 | The "three homes": the Standard's text and its changelog/RELEASE-NOTES live together, separate from any plugin. | `standards/GOVERNANCE.md` Section 2 |
| GOV 4 | The canonical version is declared in ONE place (the `STANDARD.md` header); every other version mention is illustrative and MUST be swept. | `standards/GOVERNANCE.md` Section 4 |
| GOV 5 | LAND = one PR: text + version handling + exactly one ADR + the changelog entry. | `standards/GOVERNANCE.md` Section 5 |
| GOV 6 | Allocation-at-land: the version, ADR number, and section number are taken only at merge against the protected head. | `standards/GOVERNANCE.md` Section 6 |
| STD 4.1 | Conformance scripts are "runnable locally, in any CI, or invoked by a skill" - the runner is decoupled from the plugin tree. | `agent-skills-toolkit/STANDARD.md` Section 4.1 |
| STD 4.4 | Validation logic MUST NOT live in CI YAML; CI invokes the portable scripts. Local and CI run the same command. | `agent-skills-toolkit/STANDARD.md` Section 4.4 |
| STD G2 | Gold: "ships CI that runs the full tier-applicable check suite via the portable scripts and passes it; self-hosting = the plugin passes its own validators." Satisfied-by: CI green + self-hosting check. | `agent-skills-toolkit/STANDARD.md` Section 2.6 |
| STD G8 | Gold: every meaningful folder carries a `README.md` whose inventory set-equals its actual immediate children. | `agent-skills-toolkit/STANDARD.md` Section 2.6 |
| D2 | Hybrid rollout: the Standard version pin is PULLED by each plugin on its own cadence (RE-ADOPT). | `03-decisions.md` D2 |
| D14 | Runner consumption = a reusable GitHub Actions workflow; thin per-repo callers; pin by ref. | `03-decisions.md` D14 |
| MKT | `marketplace.json` lists the plugin as `writing-style-catalog` - the single canonical name. | `agent-plugins/.claude-plugin/marketplace.json` |

---

## Repo 1: agent-skills-toolkit (the SOURCE - the most change)

Current pin: `library.json` `standard = 0.12`, tier `advanced` (Gold). Gate runs at three sites: `ci.yml:39`, `release.yml:39`, `package.json:10` - all `node scripts/check.mjs`.

| # | Item | Current state | New state | Why | Ref |
|---|---|---|---|---|---|
| A1 | `STANDARD.md` (repo root) | The single normative Standard text lives here; the family resolves to `../../agent-skills-toolkit/STANDARD.md`. | **Deleted** (relocated to `agent-plugins/standards/STANDARD.md`). | A member plugin must not own the family law; the neutral repo owns it. | ADR 0001, GOV 2 |
| A2 | `scripts/check.mjs`, `scripts/tier-report.mjs`, `scripts/lib/` (19 files), `scripts/checks/` (31 modules), `scripts/generators/` | The canonical 30-check runner lives here; askit self-validates via `node scripts/check.mjs`. | **Deleted** (relocated to `agent-plugins/standards/checks/` as one unit). askit runs the relocated runner instead. | One canonical runner, never copied into N repos (decouple-and-pin); the runner is portable so it grades askit from the new home. | ADR 0001, STD 4.1, D14 |
| A3 | `scripts/evaluate.mjs`, `scripts/README.md` | In `scripts/` alongside the runner. | **Assess at execution:** move if they share `scripts/lib/` sibling imports (then part of the canonical runner); else stay (askit-specific eval entry). | Sibling-import coupling determines whether they must move with the runner. | STD 4.1 |
| A4 | `scripts/checks/agentskills.mjs` | Present in the folder but NOT registered in `lib/registry.mjs`; only a unit test references it. | **Decide:** keep-as-dead (move with the unit) or drop. Default: move with the unit, flag for cleanup. | It is dead relative to the registry; not load-bearing either way. | (internal) |
| A5 | `tests/` (~63 files; 68 import `scripts/`) | The runner's unit + integration tests live here. | The runner's tests **move** to `standards/checks/tests/` (imports repointed to the co-located runner); askit keeps only tests of its OWN components. | Tests follow the code they test; keeps `node --test` green where the runner now lives. | STD G2 (self-hosting), G3 |
| A6 | `.github/workflows/ci.yml:39` | `run: node scripts/check.mjs` (the conformance-gate step). | Replaced by a `uses:` call to the reusable `standards-gate.yml@v1.0.0`, passing `standards-ref` = the agent-plugins ref matching askit's `0.12` pin. | Consume the one canonical runner; the reusable workflow holds no logic, it only shells out to `node`. | STD 4.4, D14 |
| A7 | `.github/workflows/release.yml:39` | `run: node scripts/check.mjs` (the release gate). | Replaced by the same reusable-workflow call (release stays gated). | Same as A6; the release gate must run the same checks. | STD 4.4, D14 |
| A8 | `package.json:10` | `"check": "node scripts/check.mjs"`. | `"check"` resolves to the relocated runner (e.g. `node ./.standards-runner/standards/checks/check.mjs .`). | Preserves local-equals-CI parity AND keeps G2 green: `self-hosting.mjs` matches an npm `check`/`test` script, so the Gold grade survives with no regex edit. | STD 4.4, STD G2 |
| A9 | `CHANGELOG.md`, `RELEASE-NOTES.md` | Hold both askit's own release history AND the Standard's version history. | The **Standard's** version history migrates out to `standards/CHANGELOG.md` + `RELEASE-NOTES.md`; askit keeps only its own plugin history. | The Standard's changelog belongs with the Standard's text; askit becomes purely the reference implementation. | GOV 2 |
| A10 | `library.json` `standard` pin | `0.12`. | **Unchanged** (no version bump). | The relocation is structural; no normative change means no pin change. | (version ruling) |
| A11 | Folder `README.md` inventories (G8) for any folder whose children changed by the deletion (e.g. `scripts/`) | Inventory set-equals the current children. | Re-synced so the inventory set-equals the post-deletion children. | G8 requires the folder-README inventory to match actual immediate children. | STD G8 |

**Not changed in askit:** its skills, agents, commands, site, and all of its OWN components and conventions. Only the Standard text, the runner, and the three gate-invocation sites move or repoint.

---

## Repo 2: agent-plugins (the DESTINATION)

`standards/README.md` lines 15-23 currently say `STANDARD.md`, the checks, and the changelog are "not here yet."

| # | Item | Current state | New state | Why | Ref |
|---|---|---|---|---|---|
| B1 | `standards/STANDARD.md` | Does not exist. | **Created** - the relocated Standard text (header stays `0.12`). | The neutral repo becomes the Standard's canonical home. | ADR 0001 |
| B2 | `standards/checks/` | Does not exist. | **Created** - the relocated runner (entry, `checks/`, `lib/`, `generators/`, `tier-report.mjs`) + `tests/`. | The canonical runner lives with the law it enforces, in the neutral repo. | ADR 0001, D14 |
| B3 | `standards/CHANGELOG.md`, `standards/RELEASE-NOTES.md` | Do not exist. | **Created** - the Standard's release history (migrated from askit) + a top entry for the structural relocation. | GOV 5 requires a changelog entry on a LAND; the Standard's changelog arrives with its text. | GOV 2, GOV 5 |
| B4 | `standards/decisions/` | Holds only `0001`. | **Added** - one ADR (next free number, taken at LAND) recording the relocation, the structural-no-bump ruling, and the G2/npm-check migration. | GOV 5: exactly one ADR per LAND; GOV 6: allocate the number at merge. | GOV 5, GOV 6 |
| B5 | `standards/README.md` (lines 15-23) | "Not here yet (sequenced relocation)" section + See-also links to `../../agent-skills-toolkit/STANDARD.md`. | The caveats are removed; it states the text/checks/changelog now live here; links point local. | The relocation it described as pending is now done. | (doc accuracy) |
| B6 | `standards/GOVERNANCE.md` (lines 4, 41, 52, 54, 95-96) | Illustrative "current version 0.8" mentions. | Swept to `0.12`. | GOV 4: every version mention besides the header is illustrative and swept to the one truth. | GOV 4 |
| B7 | `standards/GOVERNANCE.md:137`, `standards/decisions/0001-...:42` | Use `writing-style-library` (and `0001:42` also cites `0.8`). | Converged to `writing-style-catalog` (and `0.12`). | `writing-style-catalog` is the canonical `marketplace.json` name; the registry is the source of truth for the name. | MKT, GOV 4 |
| B8 | `docs/internal/standards-plan-roadmap/01-current-state.md:38`, `02-roadmap.md` Phase 0 notes; `docs/internal/audits/2026-06-02_astro-implementation.md`; `standards/domains/astro-sites/rollout/writing-style-catalog.md` + review-findings | Carry the name drift / track the stale-ref item as open. | Name converged to `writing-style-catalog`; the GP-4 / Phase 0 sweep items noted done. | Same name-convergence reasoning; close the tracked sweep item. | MKT |

**Not changed in agent-plugins (Phase 0):** `.claude-plugin/marketplace.json` and `scripts/validate-registry.mjs` (the re-pin + truth-in-targeting checks are Phase 2, not Phase 0). The other package docs (`03`-`06`, drafts) are unchanged except the name sweep.

---

## Repo 3: product-on-purpose/.github (the HARNESS - net-new)

Confirmed local at `E:/Projects/product-on-purpose/.github`, origin `product-on-purpose/.github`, no `.github/workflows/` dir yet.

| # | Item | Current state | New state | Why | Ref |
|---|---|---|---|---|---|
| C1 | `.github/workflows/standards-gate.yml` | Does not exist (no workflows dir). | **Created** - the reusable `workflow_call` gate (two checkouts: the caller + sparse `standards/` at a pinned ref; then `node .standards-runner/standards/checks/check.mjs .`). Verbatim from the proven D14 spike YAML. | The consumption harness every repo calls; holds no validation logic, only invokes the portable runner. | D14, STD 4.1, STD 4.4 |
| C2 | git tag `v1.0.0` | None. | **Created** on the merged workflow commit so callers pin `@v1.0.0`. | Decouple-and-pin: callers pin the workflow by an immutable ref, never floating HEAD. | D14 |

---

## What Phase 0 deliberately does NOT touch (so the blast radius is clear)

- **The Standard's clause text** - zero normative changes; the move is structural.
- **The marketplace registry** (`marketplace.json`) and `validate-registry` - untouched; the re-pin + truth-in-targeting checks are Phase 2.
- **pm-skills, thinking-framework-skills, writing-style-catalog callers** - NOT wired in Phase 0. Only askit's caller is wired (it is re-acquiring its own gate). The other three adopt the reusable workflow on their own cadence under the tiered ramp (D15) and pull discipline (D2).
- **askit's library.json pin** - unchanged (no bump).
- **askit's own components** - skills, agents, commands, site - untouched.

## The choreography (which PR carries which rows)

- **PR-A** (`.github`): C1, C2.
- **PR-B** (`agent-plugins`, atomic LAND): B1-B8. askit still has its copies during this PR (A-rows not yet applied), so no dark window.
- **PR-C** (`agent-skills-toolkit`, RE-ADOPT): A6, A7, A8 first (repoint + verify green), THEN A1, A2, A5, A9, A11 (deletions + re-sync). A10 is a no-op (no bump).

## Open items resolved by this manifest

- Version bump: NO (structural). [row A10, B4]
- askit G2 after the move: preserved via the npm `check` script. [row A8, ref G2]
- Tests: move with the runner. [row A5]
- Standard's changelog home: created in `standards/`, history migrated from askit. [rows A9, B3]
- Canonical name: `writing-style-catalog`. [rows B7, B8]
