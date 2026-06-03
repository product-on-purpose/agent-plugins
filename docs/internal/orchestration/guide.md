# Fleet orchestration: a guide

> The learning document. It explains what fleet orchestration is, when to use it, how it works concretely in Claude Code, and how documentation is split between each repo and this control repo (the dual-documentation model). Written to be read start to finish once, then used as a reference.

## 0. TL;DR

- The family is four independently-released repos. Many changes are **uniform** (same intent, all four). Running them four times in four sessions is repetitive and lets the four interpretations **drift**.
- The fix is **fleet orchestration**: author and drive the change from one place (`agent-plugins`), but **land one PR per repo**. Four repos are four release units; there is no single cross-repo commit, and you do not want one.
- This is a recognized industry pattern (batch changes / org-wide codemods / fleet management). It is not an anti-pattern *as long as* each repo stays independently reviewable and revertible, and the change is parameterized rather than copy-pasted with drift.
- It shines for uniform, mechanical, low-judgment changes. Judgment-heavy, reconcile-with-local-state changes still want a focused per-repo pass (or a fan-out with a strong "stop and flag" rule).
- Documentation is **dual**: the *intent* lives once here (a spec + a campaign record), each repo's PR carries its own *local application* record (CHANGELOG, ADR, diff), and the two are linked by a stable id. Single source of truth on each side; no duplication.

## 1. The problem

Four repos, each with its own version, CHANGELOG, CI, and branch protection. A consistency change (add a CI step, adopt a favicon, standardize a folder, apply a formatting rule) means, today, four separate sessions: open Claude in repo 1, set context, make the change, PR; repeat three more times. Two costs:

1. **Repetition** - the context-setup and the change are re-done four times.
2. **Drift** - four independent sessions interpret "the same change" four slightly different ways, which is how the family got divergent mermaid branding, divergent schema extensions, and a guard that existed in only one repo in the first place.

Orchestration removes the repetition and, more importantly, kills the drift by making the change **one authored artifact** applied identically.

## 2. The core principle

> **Orchestrate from one place; land one PR per repo.**

Author the change once, here, as a parameterized spec. Drive its application to all four repos from one control session. But each repo still gets its **own branch, its own PR, its own CI run, its own merge.** You cannot make a single git commit across four repositories, and you should not want to: independence is the property that lets each repo's CI gate its own change and lets you revert one without touching the others.

"From this repo as source" therefore means: **author + drive here; apply + land there.** This is the operational twin of the family's existing **decouple-and-pin** discipline (the marketplace pins plugins by SHA; plugins pin the Standard by version; nobody copies anyone's code). The orchestrator does not couple the repos; it coordinates four independent landings of one decision.

## 3. The levels

Pick the level per change. Higher is more leverage and more blast radius.

| Level | Shape | Best for |
|---|---|---|
| **0** | Four separate sessions (one per repo) | Heavy, judgment-laden, repo-specific work (the Pattern S migrations) |
| **1** | One session, all four repos as working directories, done serially by hand | Small changes you want to watch land one at a time |
| **2** | One **orchestrator** session that fans out **one sub-agent per repo in parallel**, each opening a PR | **Uniform consistency changes - the sweet spot** |
| **3** | A **saved, parameterized fleet-change** you re-run for any uniform change | When you do this repeatedly and want a reusable runner |

The Astro rollout was effectively Level 1 (you ran each repo's packet in its own session). This program is about making Level 2-3 routine.

## 4. The decision rule

```
Is the change uniform across repos (same intent, small per-repo variation)?
├── No  → per-repo focused session (Level 0). Stop.
└── Yes → Is it mechanical / low-judgment (no reconciling with each repo's ADRs or unique state)?
          ├── Yes → orchestrate + fan out (Level 2/3).
          └── No  → fan out WITH a strict "stop and flag if local state conflicts" rule,
                    and expect some agents to pause for your decision.
```

Worked examples:

- **Favicon adoption, `.nvmrc` bump, add a shared CI step, dash-check rollout, robots.txt template, a re-pin** → uniform + mechanical → **orchestrate (Level 2).**
- **The 14.11 guard ports** → uniform intent but judgment-heavy (each repo surfaced unique pre-existing link debt; one repo's layout differs) → **fan out with stop-and-flag**, or per-repo.
- **A repo's identity/naming change** (the writing-style-catalog title that was deliberately retained per its ADR 0014) → **never** blind-apply; the stop-and-flag rule is what caught this.

The hard-won lesson from the Astro rollout: **a fleet change MUST cross-check each repo's own ADRs/CHANGELOG before asserting a value is "stale" or wrong.** Orchestration amplifies both good changes and bad assumptions; the stop-and-flag rule is the safety valve.

## 5. How it works concretely (in Claude Code)

The enabling facts in this setup:

- All four repos are local siblings under `E:\Projects\product-on-purpose\`, and a session here already has that parent as a working directory, so **one session can reach all four working trees.**
- Because the four repos are **separate directories**, parallel agents writing to different repos **cannot collide** - no git-worktree isolation is needed across repos (they are already isolated). Worktree isolation is only for parallel agents editing the *same* repo.
- The `gh` CLI reaches all four repos, so an orchestrator can open and watch a PR in each.

The Level-2 recipe:

1. **Author the fleet-change spec** here (see [`specs/orchestration-capability.md`](specs/orchestration-capability.md) for the format): the uniform change, the per-repo parameters (base path, repo name, where scripts/CI live), the acceptance check, and the **stop-and-flag** rule.
2. **From an orchestrator session** (all four repos as working dirs), **dispatch one sub-agent per repo in parallel** (the Agent tool, the `dispatching-parallel-agents` skill, or a Workflow). Each agent, operating only in its repo's path: creates a branch, applies the parameterized change, runs that repo's build/tests, opens a PR, and **does not merge**.
3. The orchestrator **collects the four PR links and any flagged conflicts** and reports back.
4. **You review and merge** the four PRs (or tell the orchestrator to merge the ones whose CI is green).

This is the exact shape of the read-only Astro audit (four audit agents + four verifiers, one per repo). The write version is the same shape, each agent landing a PR instead of returning findings. The Workflow tool's `pipeline`/`parallel` primitives express it directly: `parallel(REPOS.map(r => () => agent(applySpec(r))))`.

**Pilot then fan out.** For anything with real blast radius, apply to one repo first (the rollout's "thinking-framework-skills first"), prove it green, then fan the *proven* change to the other three. The orchestrator can open all four PRs but you merge the pilot first.

## 6. The dual-documentation model

This is the part worth getting right, because it is where orchestration either stays clean or rots into duplication. When a fleet change lands, documentation is produced in **two places with two different jobs.** The governing rule is the family's own: **single source of truth; the other view references, never copies.**

### 6.1 The two homes

| | **Central (here, `agent-plugins`)** | **Local (each plugin repo / its PR)** |
|---|---|---|
| **Answers** | What is the change, why, and which repos got it? | What landed in *this* repo, and how does it read in this repo's history? |
| **Artifacts** | the fleet-change **spec** (intent, parameters); the **campaign record** (status table: repo -> PR link -> result/flagged); the **standard/clause** it enforces; the **backlog** item | the **CHANGELOG** entry; an **ADR** if the repo made a local decision; the **diff** itself; the repo's **release-plan** if it tracks one |
| **Audience** | the maintainer coordinating the fleet; future fleet changes | that repo's contributors and consumers; that repo's version history |
| **Lifecycle** | one record per *campaign*, lives as long as the program | one record per *repo*, lives in that repo's history forever |
| **Source of truth for** | the **intent** (the canonical change and why) | the **local state** (what this repo actually has now) |

### 6.2 The link

The two sides are joined by a **stable id** - a fleet-change/campaign id (for example `FC-0007-favicon`). The central campaign record lists the four PRs under that id; each repo's CHANGELOG/ADR/PR references the same id ("per fleet-change FC-0007"). Neither side copies the other:

- The repo does **not** copy the central spec's reasoning into its ADR; it **references** the id and records only what is local (what changed here, any repo-specific deviation, the local version bump). Exactly as a plugin pins the Standard by version instead of copying its text.
- The central record does **not** duplicate each repo's CHANGELOG; it **links** the PRs and records only the cross-repo view (who got it, who flagged, who is pending).

### 6.3 Why dual (not single)

You might ask: why not just document everything centrally? Because the two views have different audiences and lifecycles. A consumer reading `pm-skills`' CHANGELOG needs to see what changed *in pm-skills*, in pm-skills' version, without leaving the repo. A maintainer running the next fleet change needs the cross-repo campaign view without spelunking four CHANGELOGs. Each view is the source of truth for its own axis; the id ties them so neither drifts.

This is the **same dual-representation principle** the Standard already states in Section 10.3 (agent-view vs human-view, structured facts in exactly one canonical place), applied on a different axis: **central-intent vs local-application.**

### 6.4 The anti-patterns it prevents

- **Duplication drift**: copying the spec's rationale into four ADRs means five copies that diverge on the next edit. Reference the id instead.
- **Orphan local changes**: a repo change with no central campaign record is invisible to fleet tracking - you cannot tell if all four landed. Every fleet change has a campaign id.
- **Central-only documentation**: if the change is only described here, a contributor in `pm-skills` sees an unexplained diff with no local CHANGELOG. Each repo always carries its own local record.

## 7. The consistency domains (what we will orchestrate)

The first real uses of this capability are the four consistency initiatives you want, each with its own spec and phased plan:

- **Folder structure** ([`specs/consistency-folder-structure.md`](specs/consistency-folder-structure.md)) - one canonical repo layout (extending `STANDARD.md` 10.1), audited and converged.
- **CI** ([`specs/consistency-ci.md`](specs/consistency-ci.md)) - the reusable `workflow_call` shape (proven in the Astro `ci-standard`) plus a shared conformance-gate invocation.
- **Page formatting** ([`specs/consistency-page-formatting.md`](specs/consistency-page-formatting.md)) - the rendered-site formatting (the Astro preset: accent, mermaid, schema) plus repo-native docs (README house style, the dash rule).
- **Processes** ([`specs/consistency-processes.md`](specs/consistency-processes.md)) - shared release/review/ADR/rollout-packet discipline.

Each follows the graduate-into-the-Standard arc: draft here, prove on a pilot, orchestrate to the rest, promote to `standards/domains/`.

## 8. Caveats and risks (read before your first orchestration)

- **Blast radius**: a bad uniform change hits all four at once. Mitigate by piloting on one repo, then fanning the proven change.
- **You still review N PRs**: orchestration removes setup repetition and drift, not review. Four repos means four reviews; that is inherent.
- **Parameterization is the real work**: the repos differ (`site/scripts/` vs `scripts/`, different base literals, different CI file names). The spec encodes the parameters; stop-and-flag covers the surprises.
- **CI per repo**: each PR needs its own checks green before merge (the plugin repos have strict branch protection). The orchestrator can watch and report, but cannot bypass a required check.
- **Stop-and-flag is mandatory for judgment changes**: without it, orchestration confidently applies a wrong assumption four times (the "stale title" trap).
- **Auth/scope**: the orchestrator session needs `gh` access to all four repos and all four as working directories.

## 9. Glossary

- **Fleet** - the set of repos managed together (the four plugins; sometimes plus `agent-plugins`).
- **Fleet change / campaign** - one change applied across the fleet under a single id.
- **Orchestrator session** - the single control session that drives a fleet change.
- **Fan-out** - dispatching one sub-agent per repo in parallel.
- **Stop-and-flag** - the rule that an agent pauses and reports instead of applying a change that conflicts with its repo's local state/ADRs.
- **Pilot** - applying a change to one repo first to prove it before fanning out.
- **Dual documentation** - intent documented centrally, application documented locally, joined by a stable id.
- **Graduation** - a consistency spec drafted here being promoted into `standards/` once proven.

## 10. FAQ

- **Is one PR across all four repos possible?** No. Separate repos, separate git histories. Always one PR per repo. That is a feature (independent CI, independent revert).
- **Can I do it all in one session without sub-agents?** Yes (Level 1) - add all four as working dirs and do them serially. Sub-agents (Level 2) just parallelize and enforce uniformity.
- **What if a repo should be excluded from a change?** Record the exclusion in the campaign record with a reason (no silent skips), exactly as the Astro rollout recorded deferrals.
- **Where do the consistency *rules* themselves live?** They graduate to `standards/` (the law); the orchestration docs here are how the rules get applied and kept true.
- **Does this replace the per-repo rollout packets?** No - a packet is a Level-1 spec for one repo. A fleet change is the Level-2 generalization. Packets remain ideal for judgment-heavy, single-repo work.
