# Draft: ready-to-land edits to CONTRIBUTING.md (the listing contract)

Precise before/after edits to [`agent-plugins/CONTRIBUTING.md`](../../../../CONTRIBUTING.md), the listing contract whose clauses are L1-L6. The contract stays thin: it binds the family Standard by version and reference, and restates no Standard clause text. These edits carry the locked decisions into the contract and align it with the post-relocation Standard home. They are staged by roadmap phase so each lands behind its own enforcing check (the sequencing invariant: no clause ratified without a named check or an explicit aspirational label). Cross-references use the package file names; the live edits will resolve them to the repo paths.

## Scope and non-scope

| In scope (this file) | Out of scope (other package files) |
|---|---|
| New and amended L-clauses and Section 8 enforcement state | The Standard clause edits ([drafts/standard-amendments.md](standard-amendments.md)) |
| L6 rewrite to the settled folder layout (D5 (dissolve _agent-context), D6 (lowercase _local)) | The CI re-pin check itself ([drafts/ci-repin-check.md](ci-repin-check.md)) |
| The truth-in-targeting listing statement (D10 (cross-tool / truth-in-targeting)) | The frontmatter schemas ([drafts/frontmatter-schemas.md](frontmatter-schemas.md)) |
| The Standard-home reference sweep (Phase 0 (truth and relocation)) | The AGENTS.md + shim contract body ([drafts/agents-md-and-context.md](agents-md-and-context.md)) |

The contract names the Standard sections it binds (so a reader can follow), but copies no clause text from them. Where a decision changes Standard or repo behavior, the contract references the Standard section or the package draft and does not re-derive the rule.

## Edit set, in landing order

| Edit | Phase | Clause touched | Decision(s) | Lands with check / label |
|---|---|---|---|---|
| E-A (Standard-home reference sweep) | Phase 0 | header, L1, L3, L4, L6, Section 8 | ADR 0001 (canonical home) | Phase 0 reference-consistency sweep; gate green at new path |
| E-B (Section 8 truth refresh) | Phase 1 | Section 8 | D1 (deliverable), pm-skills convergence | Mirrors the pm-skills convergence packet outcome |
| E-C (L4 re-pin / CI keystone link) | Phase 2 | L4, Section 8 ratchet | D7 (no new init skill), CI keystone | The validate-registry re-pin check ([drafts/ci-repin-check.md](ci-repin-check.md)), advisory then blocking |
| E-D (L7 truth-in-targeting, new clause) | Phase 2 land, Phase 4 flip | new L7 | D10 (truth-in-targeting) | Truth-in-targeting check, advisory at Phase 2, blocking at Phase 4 |
| E-E (L6 rewrite to settled layout) | Phase 3 | L6 | D5 (dissolve _agent-context), D6 (_local lowercase), D4 (decision homes) | Frontmatter + layout checks landing in Phase 3 |
| E-F (L8 scaffolding-is-evidence-only, new clause) | Phase 3 | new L8 | D7 (no new init skill) | None; explicit advisory label (evidence-only) |

Each edit below gives the exact before text (when amending) and the exact after text.

---

## E-A. Standard-home reference sweep (Phase 0)

Per ADR 0001 (canonical home) and Phase 0 (truth and relocation), the normative Standard moves from the `agent-skills-toolkit` repo to `agent-plugins/standards/STANDARD.md`, and the checks to `standards/checks/`. Every reference in this contract that points at the old toolkit-hosted `STANDARD.md` URL MUST be repointed to the in-repo path. This is a mechanical sweep; it changes no clause meaning.

Before (header, line 3):

> Authoring rules (manifest schema, naming, versioning, component anatomy) live in [the Standard](https://github.com/product-on-purpose/agent-skills-toolkit/blob/main/STANDARD.md); a plugin's internal design choices live in that plugin's own ADRs.

After:

> Authoring rules (manifest schema, naming, versioning, component anatomy) live in [the Standard](standards/STANDARD.md); a plugin's internal design choices live in that plugin's own ADRs.

Sweep rule for the rest of the file: every bare "STANDARD.md" section citation (for example "STANDARD.md Section 14", "the Standard's Section 12") keeps its prose but, where it is a link, resolves to `standards/STANDARD.md`. No section numbers change in this edit; Section 14 is still the (proposed) site section, Section 12 is still distribution-and-marketplaces (confirmed against the Standard v0.12 source). Update the L5 link target from `standards/domains/astro-sites/SITE-STANDARD.md` only if Phase 0 confirms a path change; as of this draft that path is correct and stays.

Exit condition for E-A: a reader following any Standard reference in CONTRIBUTING.md lands inside `agent-plugins`, not the toolkit repo.

---

## E-B. Section 8 truth refresh (Phase 1)

Section 8 records the truthful enforcement state. After the pm-skills convergence session (Phase 1 (close P0 holes)) the two tracked P0 violations are resolved, and Section 8 MUST say so rather than describing them as open. This edit is driven by the convergence outcome; land it when pm-skills actually carries a `library.json` and has removed its embedded self-listing marketplace.

Before (Section 8, "Advisory now" bullets):

> - **L3**: `pm-skills` carries no `library.json` (convergence scoped in [its packet](docs/internal/convergence/pm-skills-conformance.md)); `writing-style-catalog`'s manifest is in its open convergence PR (its repo PR #19) and clears on merge. `thinking-framework-skills` and `agent-skills-toolkit` pass.
> - **L2**: one embedded self-listing marketplace remains, in `pm-skills` (a recorded deliberate back-compat retention; removal scoped in its packet, decision D6). `writing-style-catalog`'s is deleted in its open convergence PR.

After:

> - **L3**: all four members now carry a root `library.json` pinning a Standard version. Version-pin currency is pull-based per GOVERNANCE.md Section 5: pins are agent-skills-toolkit `0.12`, writing-style-catalog `0.11`, thinking-framework-skills `0.8`. A pin behind the current Standard is conformant (the gate honors the pin, STANDARD.md Section 5.1); it is not a violation.
> - **L2**: no embedded self-listing marketplace remains in any member. The pm-skills embedded marketplace was removed in its Phase 1 convergence session ([drafts/ci-repin-check.md](ci-repin-check.md) notes the gate that now prevents regressions).

Note for the editor: confirm the exact pins at land time by reading each member's `library.json`; do not copy these numbers blind. The "D6" reference in the old L2 bullet was an internal-to-pm-skills decision id and is dropped here to avoid colliding with this package's D6 (lowercase _local).

---

## E-C. L4 re-pin / CI keystone link (Phase 2)

Phase 2 (CI keystone) builds a marketplace re-pin conformance check into `validate-registry`: a pinned-sha repo has a `library.json` with a `standard` pin and CI green at that sha. L4 today points only at the human re-pin checklist (Section 7); it MUST also reference the automated keystone once it lands, and Section 8's ratchet step 3 updates to past tense as the check flips to blocking. The contract still does not describe the check's internals; it references the draft.

Before (L4 row, Section 1 table, "Enforcement today" cell):

> Re-pin checklist (Section 7) + review

After:

> Re-pin checklist (Section 7) + the registry re-pin check (advisory, blocking once all four members pass)

Before (Section 8, ratchet step 3):

> 3. **Enforce** - an automated re-pin check (the pinned sha's repo has `library.json` with a `standard` pin; CI green at that sha) lands advisory, then flips to blocking once all four members pass.

After:

> 3. **Enforce** - the registry re-pin check (the pinned sha's repo has a `library.json` with a `standard` pin, and CI is green at that sha) runs in `validate-registry`. It lands advisory and flips to blocking once all four members pass; the check is specified in [drafts/ci-repin-check.md](ci-repin-check.md).

No L4 body bullet changes: L4 already states the sha-on-tag and version-agreement rules the check verifies, so the check enforces existing contract text rather than adding new obligations.

---

## E-D. New clause L7 - truthful agent-targets (Phase 2 land, Phase 4 flip)

D10 (truth-in-targeting) makes `agent-targets` load-bearing: a plugin MUST deliver the native distribution and context shim for every target it declares, or drop the target. This is a Standard rule ([drafts/standard-amendments.md](standard-amendments.md) lands the authoring clause and its check). The listing contract needs a thin mirror so that "what the marketplace lists" cannot over-claim targets beyond what the plugin ships. The contract binds the Standard rule by reference; it does not restate the per-target delivery requirements.

Add a row to the Section 1 table (after L6):

> | L7 | A listed plugin truthfully declares `agent-targets`: it ships the native distribution and context shim for every declared target, per the Standard | MUST | Advisory at Phase 2; blocking when the truth-in-targeting check flips at Phase 4 |

Add a clause body. Because L5 and L6 currently share Section 6 ("the pre-normative clauses"), insert L7 as its own short section after Section 6 and renumber the operations section if needed, or append L7 under a new heading "## 6a. L7 - truthful agent-targets". Recommended: give L7 its own numbered heading at land time. Body text:

> **L7 - truthful agent-targets (MUST; enforcement phased).** A plugin's `library.json` `agent-targets` (STANDARD.md Section 5.1) is a claim the marketplace surfaces. A listed plugin MUST actually emit the native distribution and the context shim for every target it declares; a target it does not deliver MUST be dropped from `agent-targets`. The delivery requirements per target, and the meaning of a `"codex"` target (portability via agentskills.io skills plus AGENTS.md, not native Codex marketplace packaging until a real consumer exists), are defined in the Standard and summarized in [drafts/cross-tool-targeting.md](cross-tool-targeting.md); this contract restates neither. Enforcement: the truth-in-targeting check runs advisory from Phase 2 and becomes blocking at Phase 4, in step with the Standard clause it mirrors.

Rationale for placement in the contract (not only the Standard): the marketplace registry can surface `standard` and `tier` (Phase 2), and once it surfaces `agent-targets`, the listing must not advertise a capability the plugin does not ship. That is a listing-integrity concern, which is this file's job.

---

## E-E. L6 rewrite - the settled folder layout (Phase 3)

The current L6 describes `_agent-context/` and an unresolved `session-log/` vs `session-logs/` question as open SHOULD-level convention. D5 (dissolve _agent-context), D6 (_local lowercase), and D4 (decision homes) settle all of it. L6 is rewritten from "evidence-gathering, undecided" to "settled convention, pushed mechanically per D2 (Hybrid rollout), validated in CI at Phase 3". The contract states the layout it expects and points at the Standard clause and the campaign that enforces it; it does not re-derive the rationale (that lives in the decisions file).

Before (Section 1 table, L6 row):

> | L6 | Repo scaffolding follows the intended family conventions | SHOULD (intended convention, pre-standard) | None; evidence gathering via the audit program |

After:

> | L6 | Repo scaffolding follows the family folder layout: root `AGENTS.md` + a thin `CLAUDE.md` shim, `docs/internal/` (decisions under `docs/internal/decisions/`), and gitignored `_local/` scratch with no `_agent-context/` and no `AGENTS/` folder | MUST when the layout clause lands in the Standard (Phase 3); SHOULD until then | The Standard layout + frontmatter checks (Phase 3); mechanical parts pushed one-PR-per-repo per D2 |

Before (entire Section 6 L6 body, the four bullets describing `_agent-context/`, `_local/`/`_LOCAL/`, `agents/`, and the 2026-06-10 audit finding):

> **L6 - repo scaffolding (SHOULD, intended convention).** These conventions are intended but not yet standardized; the audit program gathers the evidence before any clause is ratified (the folder-structure epic, E2). The intent:
>
> - `_agent-context/` holds **committed** agent-facing context; session logs (the wrap-session skill's output) live under it (`session-log/` today in most members; singular vs plural is one of the things E2 will pin down).
> - `_local/` (or `_LOCAL/`) is **fully gitignored** local scratch. It is never published, even if the repo goes public.
> - `agents/` is **reserved for plugin subagents** (native registration, see the component palette below) and MUST NOT hold session logs or agent knowledge. Lineage: `agents/` originally held session logs and agent-based knowledge; that collided with the subagent namespace, and `_agent-context/` was created to relieve it.
> - What the 2026-06-10 audits actually found (the E2 evidence): all four members now use `agents/` only for subagents (pm-skills completed its migration in v2.17.0); members **differ** on whether `_agent-context/` is committed (pm-skills) or fully gitignored (thinking-framework-skills, agent-skills-toolkit), and on session-log naming (`session-log/` vs `session-logs/`). E2 ratifies clauses from this evidence; until then these conventions stay SHOULD.

After:

> **L6 - repo folder layout.** The family layout is settled (decisions D4 (decision homes), D5 (dissolve _agent-context), D6 (lowercase _local)) and becomes a MUST through the Standard layout clause landing in Phase 3 (scaffolding and dual-audience); until that clause lands it is a SHOULD that members converge to. The committed agent-facing layer and the scratch layer are distinct:
>
> - **Orientation file:** root `AGENTS.md` is the single canonical cross-tool context source (see [drafts/agents-md-and-context.md](agents-md-and-context.md)). Each declared target that reads its own file gets a **thin shim** referencing `AGENTS.md`, never a divergent copy: `CLAUDE.md` for Claude Code; `GEMINI.md` only if `gemini` is a declared target.
> - **Durable knowledge:** lives under `docs/internal/`. Internal decisions are MADR 4.0 ADRs under `docs/internal/decisions/` (`NNNN-` numbering, status frontmatter, immutable once accepted), per D4. Family-law ADRs live separately in `agent-plugins/standards/decisions/`.
> - **Scratch:** `_local/` (lowercase, per D6) is fully gitignored ephemeral scratch, never published. Session logs are `_local/session-logs/` (lowercase plural). There is **no** `_agent-context/` directory (D5) and **no** `AGENTS/` folder; the `agents/` name is reserved for Claude Code subagent components (see the component palette).
>
> The mechanical parts of converging to this layout (casing rename, `adr/` -> `decisions/`, adding the missing `CLAUDE.md` shim) are pushed one-PR-per-repo as judgment-free campaigns per D2 (Hybrid rollout); see [drafts/orchestration-campaigns.md](orchestration-campaigns.md).

Knock-on edit (component palette, Section 7): the palette table row `_workflows/` and the `agents/` row are unchanged. Add no `_agent-context/` row (there never was one in the palette, confirmed). The Section 7 palette's `agents/` description stays "sub-agents (native registration)", which now agrees with the rewritten L6.

---

## E-F. New clause L8 - scaffolding is evidence-only (Phase 3)

D7 (no new init skill) settles that `agent-plugins` owns the contract and the CI gate, while the toolkit owns scaffolding (`askit-init-plugin`, `askit-init-marketplace`, `askit-migrate`). The contract should make explicit that using a particular scaffolding tool is **not** a listing requirement: conformance is judged on the artifact, not on how it was produced. This prevents the contract from accidentally mandating a toolkit dependency, and keeps the door open for hand-authored or third-party-scaffolded plugins.

Add a row to the Section 1 table (after L7):

> | L8 | Conformance is judged on the artifact, not on the scaffolding used to produce it; the family scaffolding skills are a convenience, never a listing requirement | MAY (informational) | None (evidence-only) |

Add a short body under the L7 section:

> **L8 - scaffolding is evidence-only (informational).** A plugin MAY be produced by the toolkit scaffolding skills (`askit-init-plugin`, `askit-init-marketplace`, `askit-migrate`), by hand, or by any other means. The listing gate verifies the resulting artifact against L1-L7; it does not inspect or require provenance. A plugin that satisfies L1-L7 is listable regardless of how it was built. The scaffolding skills exist to make satisfying those clauses easy, not to gate listing on a tool.

This clause is deliberately MAY/informational: it removes a requirement rather than adding one, so it needs no enforcing check, only an explicit aspirational label, satisfying the sequencing invariant.

---

## After all edits: the contract at a glance (target Section 1 table)

For the editor's reference, the L-clause set after E-A through E-F:

| # | Clause (one line) | Level | Enforcement |
|---|---|---|---|
| L1 | Valid native plugin at the repo root | MUST | Install validation + registry review |
| L2 | Independently valid; one-way pointing; no embedded self-listing marketplace | MUST | Review + re-pin check guards regressions |
| L3 | Binds the Standard: root `library.json` pinning a version and tier (>= Bronze) | MUST | Re-pin check (Phase 2) + review |
| L4 | Release hygiene; sha on a release tag; versions agree; changelogs written | MUST | Re-pin checklist + registry re-pin check |
| L5 | Docs site conforms to the family site standard | SHOULD -> MUST when Section 14 lands | Site CI guards |
| L6 | Family folder layout: `AGENTS.md` + thin shim, `docs/internal/`, gitignored `_local/`, no `_agent-context/` | SHOULD -> MUST when the layout clause lands (Phase 3) | Layout + frontmatter checks (Phase 3); D2 push |
| L7 | Truthful `agent-targets`: ship native distribution + shim for every declared target | MUST (enforcement phased) | Truth-in-targeting check (advisory Phase 2, blocking Phase 4) |
| L8 | Conformance judged on the artifact, not the scaffolding | MAY (informational) | None (evidence-only) |

"New listings MUST meet L1-L4 from day one" (current line 18) is preserved; consider extending it to "L1-L4, and L7 for any plugin declaring more than the default single target" once L7 is blocking (Phase 4), but do not change line 18 before then.

## Verification before landing each edit

- Confirm Standard section numbers against `standards/STANDARD.md` at land time: as of Standard v0.12, Section 5.1 is the `library.json` field schema, Section 12 is distribution-and-marketplaces, Section 14 is the (proposed) site section. Read, do not trust this draft's numbers blind.
- Confirm each member's `library.json` `standard` pin before writing the E-B numbers.
- Do not flip any clause's level to MUST in this file ahead of its enforcing check landing; the level cells above encode the phased schedule and MUST track it.
