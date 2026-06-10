# writing-style-catalog - library.json convergence packet

> **Goal:** give `writing-style-catalog` a canonical `library.json` so it can pin the family Standard at all (the [`GOVERNANCE.md`](../../../standards/GOVERNANCE.md) Section 9 precondition), and in doing so bring it to **honest universal-tier (Bronze) conformance**. Today the repo carries no `library.json`, so under `STANDARD.md` Section 5 it is "loose components, not a plugin." The contract is [`agent-skills-toolkit/STANDARD.md`](../../../../agent-skills-toolkit/STANDARD.md) Sections 5, 5.1, 2.1, 2.5. Written 2026-06-07 against `main` @ `8d8250f` (clean).
>
> This is a small, self-contained Level-0 change in one repo. It is the safe counterpart to the heavier pm-skills manifest work (see the [program roadmap](../program-roadmap.md)). Scope is the manifest and the universal-tier blockers it exposes; the embedded-marketplace cleanup is an optional adjacent step (decision D4), not required to add the manifest.

## 1. Kickoff prompt (copy-paste, or point a session at this file and say "go")

```
You are working in the writing-style-catalog repository to add a canonical library.json
and bring the plugin to honest universal-tier (Bronze) conformance with the Product on
Purpose family Standard. It currently has NO library.json, so it is "loose components" under
the Standard's Section 5.

Read first, in order:
1. The contract: agent-skills-toolkit/STANDARD.md Sections 5 and 5.1 (the manifest + its field
   schema), Section 2.1 + 2.5 (universal/Bronze requirements). If you cannot read the askit path,
   ask me to add E:\Projects\product-on-purpose\agent-skills-toolkit as a working directory.
2. This packet (your scorecard, decisions, proposed manifest, checklist):
   E:\Projects\product-on-purpose\agent-plugins\docs\internal\convergence\writing-style-catalog-library-json.md

Then:
- Confirm you are on main and it is clean.
- Resolve the four maintainer decisions (D1-D4 in section 4). D3 (skill name) and D4 (embedded
  marketplace) are genuine forks; if the maintainer has not answered them, STOP and ask.
- Apply the universal-tier fixes (section 6): fix the skill name/dir mismatch, add the component
  version to the skill frontmatter, write library.json (section 5), keep .claude-plugin/plugin.json
  consistent with it.
- House rule: no em-dashes or en-dashes anywhere (use " - " or restructure). Make changes as normal
  commits/PRs in THIS repo (ADR in docs/internal if the name change warrants one; CHANGELOG entry).
  Do NOT edit other repos. Do NOT push or merge without my confirmation.

Stop and ask if: a decision is unanswered, the repo state conflicts with this packet, or a fix is
not obvious.

When the checklist is complete and the manifest validates, summarize what changed and prepare the PR.
```

## 2. Current state (2026-06-07, `main` @ `8d8250f`)

- **Components:** one skill. Directory `skills/writing-instruction-builder/`; its `SKILL.md` frontmatter declares `name: compose-instruction` and has **no `version`**.
- **Manifests:** `.claude-plugin/plugin.json` (hand-authored native manifest, `name: writing-style-catalog`, `version: 0.2.0`); `.claude-plugin/marketplace.json` (an **embedded self-listing marketplace** - the Section 12 anti-pattern; the repo is already listed in the external `agent-plugins` registry).
- **No `library.json`** anywhere (confirmed: `git ls-files` shows none tracked, none in history).
- **Present and good:** root `AGENTS.md`, `Apache-2.0` license, `repository`/`homepage` URLs, a green Astro site (Pattern S, the 14.11 guards), a Python taxonomy toolchain under `tools/`.
- **No self-hosting Standard gate:** wsl's CI (`validate.yml`) runs the taxonomy drift guard, the site build, and a dash check, but it does not run the askit Standard checks. So adding `library.json` is additive and will not trip a conformance gate; correctness is on us to get right.

## 3. Universal-tier (Bronze) scorecard

What it takes to honestly *meet* the universal tier this manifest will declare (Standard 2.1 + 2.5):

| Requirement | Status | Note / fix |
|---|---|---|
| Valid skill frontmatter | PASS | `name` + `description` present and well-formed. |
| Skill `name` equals parent directory | **FAIL** | dir `writing-instruction-builder` vs frontmatter `compose-instruction`. Bronze blocker - see D3. |
| Description meets the 8.1 bar (what + when + triggers) | PASS (minor) | States what; the "when" is implicit. Tighten in the manifest description (section 5). |
| References one level deep | PASS | No deep reference nesting observed. |
| Root `AGENTS.md` present | PASS | Present. |
| Minimal `library.json` (name/version/tier) | **FAIL** | None exists. Add it (section 5). |
| Component `version` present (Standard 3.7, every tier) | **FAIL** | The skill frontmatter has no `version`. Add `version: 0.1.0`. |
| `U12` mermaid-valid (conditional) | PASS (vacuous) | The skill carries no mermaid diagrams. |

**Net: three blockers** - the name/dir mismatch, the missing component version, and the absent manifest. Fixing all three takes the plugin from "loose components, below Bronze" to a conformant universal-tier plugin.

## 4. Decisions (resolve before executing)

- **D1 - Tier.** Declare `universal`. Rationale: one skill, no convergent components (no subagents, commands, workflows, or chain contracts). `tier` is a *declared target* the gate verifies and flags if over-claimed (Standard 5.1), so this is an honest target, not a fabricated grade. **Recommended: `universal`.**
- **D2 - Standard pin.** Set `standard: "0.11"` (the current version). Per Standard 7.7, a check newer than the pin is surfaced as a `warn`, never a gate-failing `error`, so pinning current is safe and reads as "targets today's ruleset." Pinning lower only buys leniency this plugin does not need. **Recommended: `"0.11"`.**
- **D3 - Skill name canonicalization (genuine fork).** The directory (`writing-instruction-builder`) and the frontmatter / invocation / manifest descriptions (`compose-instruction`) disagree; the Standard requires `name` == directory. Two ways to resolve:
  - **(a) Complete the rename to `writing-instruction-builder`** (recommended): update the `SKILL.md` `name`, the in-file invocation example, and the "compose-instruction skill" phrase in `plugin.json`/`marketplace.json` descriptions. This looks like the intended direction (the directory was already renamed) and the name is more descriptive. Cost: the invocation slug changes to `/writing-style-catalog:writing-instruction-builder`, a user-facing change worth a CHANGELOG note (and an ADR if you treat the slug as stable identity per Standard 8.2).
  - **(b) Revert the directory to `compose-instruction`**: preserves the existing slug, discards the more descriptive name.

    **Recommended: (a)**, but this is the maintainer's call because it changes a user-facing invocation.
- **D4 - Embedded marketplace (optional adjacent step).** `.claude-plugin/marketplace.json` self-lists wsl - the Section 12 anti-pattern - while the external `agent-plugins` registry already lists it. Deleting it removes a live violation and is low-risk (the external listing is the real one). Out of the stated scope (library.json) but cheap to bundle. **Recommended: delete it in the same PR**, updating any README/CHANGELOG install instructions to point only at the external marketplace. If you would rather keep the PR single-purpose, defer it to its own change.
- **D5 - Native manifest generation.** Standard Section 5 says `.claude-plugin/plugin.json` MUST be *generated* from `library.json`, not hand-maintained in parallel. wsl has no generator (that is askit's `gen-manifest`). For a universal-tier plugin this is not a Bronze blocker; the near-term requirement is only that the two do not drift. **Recommended:** make `library.json` the authored source of truth, keep `plugin.json` consistent by hand for now, and note auto-generation as a later (Gold) follow-up.

## 5. Proposed `library.json` (concrete, assuming D1 universal, D2 0.11, D3 option a)

```json
{
  "name": "writing-style-catalog",
  "version": "0.2.0",
  "description": "Composable writing instructions on four orthogonal axes (Voice, Tone, Style, Format): pick one entry per axis and the builder assembles a ready-to-paste prompt prefix that steers any LLM toward a precise register, reasoning pattern, and layout. Ships 60 curated entries, 195 worked examples, 12 diff-pairs, and 5 recipes. Use when you need a precise, composable writing instruction for an LLM.",
  "standard": "0.11",
  "tier": "universal",
  "license": "Apache-2.0",
  "keywords": ["writing", "style", "voice", "tone", "format", "composition", "taxonomy", "prompts", "agent-skills", "agentskills-io"],
  "components": {
    "skills": [
      { "name": "writing-instruction-builder", "path": "skills/writing-instruction-builder/SKILL.md", "version": "0.1.0", "tier": "universal", "status": "active" }
    ]
  },
  "repository": "https://github.com/product-on-purpose/writing-style-catalog",
  "homepage": "https://github.com/product-on-purpose/writing-style-catalog"
}
```

Notes: `agent-targets` and `prefix` are omitted - they are REQUIRED only at Convergent and above (Standard 5.1); skills are agent-agnostic. The `components.skills[0].version` MUST equal the value added to the skill's frontmatter (0.1.0). The plugin `version` (0.2.0, the release version) and the component `version` (0.1.0) are independent by design (Standard 7.4). If D3 resolves to option (b), set the skill `name`/`path` to `compose-instruction` instead.

## 6. Implementation checklist (the executing session updates this)

- [ ] Confirm `main` is clean.
- [ ] **D3** Resolve the skill name: align `skills/writing-instruction-builder/SKILL.md` `name` to `writing-instruction-builder` (option a) - update the frontmatter `name`, the in-file `/writing-style-catalog:...` invocation example, and the "compose-instruction skill" phrase in `plugin.json` (and `marketplace.json` if it survives D4). Add a CHANGELOG entry; add an ADR if treating the slug as stable identity.
- [ ] Add `version: 0.1.0` (under `metadata` or top-level per the skill's frontmatter convention) to the skill so the component carries its required version (Standard 3.7).
- [ ] Write `library.json` at the repo root (section 5), with the component `version` matching the frontmatter.
- [ ] Reconcile `.claude-plugin/plugin.json` so its `name`/`version`/`description` agree with `library.json` (D5).
- [ ] **D4 (optional)** Delete `.claude-plugin/marketplace.json`; point README/CHANGELOG install steps at the external `agent-plugins` registry only.
- [ ] Validate: `library.json` is well-formed JSON; every `components` entry's `path`/`version`/`status` matches disk; `name` equals the directory; `tier`/`standard` are set.
- [ ] CHANGELOG entry summarizing the manifest addition and any rename.
- [ ] Open the PR; CI green; await maintainer review (do not merge without confirmation).

## 7. Acceptance criteria (done = all true)

- A root `library.json` exists with `name`, `version`, `description`, `standard: "0.11"`, `tier: "universal"`, and a `components.skills` entry whose `name`/`path`/`version`/`status` match the skill on disk.
- The skill's directory name and frontmatter `name` agree, and the skill frontmatter carries a `version` equal to the manifest's component entry.
- `.claude-plugin/plugin.json` is consistent with `library.json` (no drift in name/version/description).
- (If D4 taken) no `.claude-plugin/marketplace.json` remains; install instructions reference only the external registry.
- The PR is prepared and CI is green; not merged without maintainer confirmation.

> Outcome: writing-style-catalog moves from "loose components, below Bronze" to a conformant universal-tier plugin that pins the Standard at 0.11 - the precondition for it to participate in versioned governance and to re-adopt future amendments (including §14) on its own cadence.
