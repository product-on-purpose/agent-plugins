# Contributing a plugin to Product on Purpose

> The **listing contract**: what a repo must satisfy to be listed, and to stay pinned, in the `product-on-purpose` marketplace. This is the thin contract that [`standards/GOVERNANCE.md`](standards/GOVERNANCE.md) (Section 2) assigns to this file: it **binds to the family Standard by version and restates nothing from it**. Authoring rules (manifest schema, naming, versioning, component anatomy) live in [the Standard](https://github.com/product-on-purpose/agent-skills-toolkit/blob/main/STANDARD.md); a plugin's internal design choices live in that plugin's own ADRs.
>
> The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are as defined in RFC 2119. Clause levels are marked honestly: some clauses are enforced today, some are advisory until the enforcement machinery lands. Section 8 is the truthful enforcement state.

## 1. The contract at a glance

| # | Clause | Level | Enforcement today |
|---|---|---|---|
| L1 | A valid native plugin at the repo root | MUST | Install validation + registry review |
| L2 | Independently valid; one-way pointing; no embedded self-listing marketplace | MUST | Review (two legacy violations tracked, Section 8) |
| L3 | Binds the family Standard: root `library.json` pinning a Standard version and declaring a tier; conformant at that version, tier at least universal (Bronze) | MUST | Advisory; two legacy members converging (Section 8) |
| L4 | Release hygiene: the pinned `sha` sits on a release tag, versions agree everywhere, changelogs are written | MUST | Re-pin checklist (Section 7) + review |
| L5 | The documentation site conforms to the family site standard | SHOULD (becomes MUST when STANDARD.md Section 14 lands) | Site CI guards in each member repo |
| L6 | Repo scaffolding follows the intended family conventions | SHOULD (intended convention, pre-standard) | None; evidence gathering via the audit program |

New listings MUST meet L1-L4 from day one. Members listed before this contract converge through the audit program ([`docs/internal/convergence/audit-plan.md`](docs/internal/convergence/audit-plan.md)); their known gaps are tracked openly in Section 8, not waived silently.

## 2. L1 - a valid plugin at the repo root

- `.claude-plugin/plugin.json` exists at the repo root.
- Required fields: `name` (kebab-case, unique within the marketplace), `version` (SemVer), `description`, `license`.
- Recommended fields: `homepage`, `repository`, `author`, `keywords`.
- Component frontmatter follows the **pinned Standard** (Section 3.8 and the agentskills.io mapping in Section 6); this contract does not restate frontmatter law. (Corrected 2026-06-10: an earlier restated bullet here conflicted with the Standard's own top-level `chain:` mechanism - the audits caught the contract violating its own restate-nothing rule.)
- The plugin installs cleanly on a fresh Claude Code.

## 3. L2 - independently valid (the one-way rule)

- The plugin installs and runs standalone.
- The plugin repo MUST NOT carry any **machine-readable** marketplace association: no embedded self-listing `marketplace.json` (the Standard's Section 12 anti-pattern), no registry metadata pointing back here. Association is declared only here, in this repo's `marketplace.json`; pointing is one-way: marketplace to plugin.
- Prose install instructions that name the external marketplace (README, getting-started, release notes) are expected, not a violation. (Corrected 2026-06-10: all three audits flagged the earlier "MUST NOT reference" wording as over-broad - it banned the install docs every member is required to carry.)

## 4. L3 - the Standard, bound by version

- The repo MUST carry a root `library.json` whose `standard` field pins the version of the Advanced Skill Library Standard it meets, and whose `tier` field declares its conformance target.
- A listed plugin MUST conform to the Standard **at the version it pins**, at tier **universal (Bronze) or higher**. Conformance is demonstrated by the Standard's checks passing at the pinned commit: self-hosted in the plugin's own CI, or graded externally via the toolkit's outward-grading profile.
- This contract deliberately restates none of the Standard's content. The manifest schema is STANDARD.md Section 5/5.1; the tiers are Section 2; the required checks are Section 4.2. When the Standard's version advances, members re-adopt on their own cadence by bumping their pin (GOVERNANCE.md Section 5); the pin, not this document, says which version of the family law a plugin meets.
- A repo with no `library.json` is "loose components" under the Standard's Section 5 and is not eligible for a new listing.

## 5. L4 - release hygiene

- The registry pins each plugin by `sha`. That `sha` MUST sit on a release tag `vX.Y.Z` in the plugin repo.
- Versions MUST agree everywhere they appear: the registry entry `version` == the release tag == `library.json` `version` == **every native manifest the repo emits** (`.claude-plugin/plugin.json`, and `.codex-plugin/plugin.json` where present).
- The plugin repo MUST have a `CHANGELOG.md` entry for the released version, and SHOULD maintain user-facing `RELEASE-NOTES` for milestone releases.
- The registry holds itself to the same bar: every re-pin bumps `metadata.version` in `marketplace.json` and adds an entry to this repo's [`CHANGELOG.md`](CHANGELOG.md).

## 6. L5 and L6 - the pre-normative clauses (marked honestly)

**L5 - documentation site (SHOULD, on a path to MUST).** A member's docs site SHOULD conform to the family site standard at [`standards/domains/astro-sites/SITE-STANDARD.md`](standards/domains/astro-sites/SITE-STANDARD.md) (Pattern S, the clause-14.11 link/route guards). All four current members conform today. When the proposed Section 14 lands in STANDARD.md through the amendment process, this clause becomes a MUST via each member's `standard` re-adoption, not via an edit here.

**L6 - repo scaffolding (SHOULD, intended convention).** These conventions are intended but not yet standardized; the audit program gathers the evidence before any clause is ratified (the folder-structure epic, E2). The intent:

- `_agent-context/` holds **committed** agent-facing context; session logs (the wrap-session skill's output) live under it (`session-log/` today in most members; singular vs plural is one of the things E2 will pin down).
- `_local/` (or `_LOCAL/`) is **fully gitignored** local scratch. It is never published, even if the repo goes public.
- `agents/` is **reserved for plugin subagents** (native registration, see the component palette below) and MUST NOT hold session logs or agent knowledge. Lineage: `agents/` originally held session logs and agent-based knowledge; that collided with the subagent namespace, and `_agent-context/` was created to relieve it.
- What the 2026-06-10 audits actually found (the E2 evidence): all four members now use `agents/` only for subagents (pm-skills completed its migration in v2.17.0); members **differ** on whether `_agent-context/` is committed (pm-skills) or fully gitignored (thinking-framework-skills, agent-skills-toolkit), and on session-log naming (`session-log/` vs `session-logs/`). E2 ratifies clauses from this evidence; until then these conventions stay SHOULD.

## 7. Operations - getting listed, staying pinned

### Registry entry

Add one entry to `.claude-plugin/marketplace.json` in this repo, in the `plugins` array:

```jsonc
{
  "name": "<plugin-name>",
  "source": { "source": "url", "url": "https://github.com/product-on-purpose/<repo>.git", "sha": "<released-commit>" },
  "description": "...",
  "version": "<matches the plugin's released version>",
  "strict": true
}
```

- `source` forms: `url` (full `.git` URL, any host - the standard for github-hosted plugins here), `github` (`repo` shorthand), `git-subdir` (a subdirectory of another repo), or a relative path string (only if the plugin lives inside this repo). Prefer the https `url` form: a `github` shorthand resolves to an SSH clone, which breaks installs for any user without an authorized SSH key (see `docs/internal/registry-maintenance.md`).
- **Pin `sha`** to a released commit. This is what makes the marketplace authoritative over what users receive.
- Set `strict: true` once the plugin passes strict validation.

### Component palette (what a plugin may contain)

A plugin can ship any subset of these. It does not have to ship all of them.

| Directory / file | Component |
|---|---|
| `skills/` | agent skills (`SKILL.md` + references) |
| `commands/` | slash commands |
| `agents/` | sub-agents (native registration) |
| `hooks/` | event hooks (`hooks.json` + scripts) |
| `.mcp.json` or `mcpServers` config | bundled MCP server(s) |
| `_workflows/` | multi-skill workflow chains |

### Naming conventions

- Plugin `name` should match the repo name where practical (`pm-skills`, `thinking-framework-skills`).
- kebab-case, descriptive, unique within the marketplace.
- MCP servers: bundle into the owning plugin, or list as their own plugin. It is a choice, not a requirement.

### The re-pin checklist (copy into every re-pin PR)

```markdown
- [ ] The pinned `sha` sits on release tag vX.Y.Z, and CI at that sha is green
- [ ] Versions agree: registry entry == release tag == library.json == plugin.json
- [ ] The plugin repo's CHANGELOG.md has the vX.Y.Z entry
- [ ] Registry `metadata.version` bumped; entry added to this repo's CHANGELOG.md
- [ ] `strict: true` preserved; registry `validate` check green
```

## 8. Enforcement today, and the ratchet

**Enforced now:** the registry `validate` CI check (registry shape), install validation, and maintainer review against the Section 7 checklist.

**Advisory now (tracked, not waived; state as of 2026-06-10, post-audit):**

- **L3**: `pm-skills` carries no `library.json` (convergence scoped in [its packet](docs/internal/convergence/pm-skills-conformance.md)); `writing-style-catalog`'s manifest is in its open convergence PR (its repo PR #19) and clears on merge. `thinking-framework-skills` and `agent-skills-toolkit` pass.
- **L2**: one embedded self-listing marketplace remains, in `pm-skills` (a recorded deliberate back-compat retention; removal scoped in its packet, decision D6). `writing-style-catalog`'s is deleted in its open convergence PR.
- **L6**: scaffolding is unstandardized; the audit evidence is recorded in the four convergence packets (the E2 input).

**The ratchet (deliberate, in order):**

1. **Audit** - score every member against this contract, one convergence packet per repo ([`docs/internal/convergence/audit-plan.md`](docs/internal/convergence/audit-plan.md)).
2. **Converge** - each member closes its gaps in its own repo, own PR (Level-0 changes per the [orchestration guide](docs/internal/orchestration/guide.md)).
3. **Enforce** - an automated re-pin check (the pinned sha's repo has `library.json` with a `standard` pin; CI green at that sha) lands advisory, then flips to blocking once all four members pass.

Findings from the audits amend this contract **before** clauses harden - the same evidence-then-law discipline GOVERNANCE.md Section 7 requires of Standard amendments.

**Amendments:** this contract changes by PR to this repo. The queued STANDARD.md Section 12 cross-reference to this contract lands separately through the amendment process (GOVERNANCE.md Section 8 backlog).
