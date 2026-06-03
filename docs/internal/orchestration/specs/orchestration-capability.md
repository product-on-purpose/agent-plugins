# Spec: orchestration capability

> The mechanism for driving a uniform change across the family repos from one control point. Defines the fleet-change spec format, the campaign record, the orchestrator pattern, and a phased plan to stand it up. Status: DRAFT / PROPOSED (2026-06-02). Companion to the [guide](../guide.md) (concepts) and the [backlog](../backlog.md) (E1).

## 1. Goal

Make Level-2 orchestration (one control session, fan out one sub-agent per repo, one PR each) routine and safe for uniform consistency changes, with dual documentation (central intent + local application) joined by a campaign id.

**Non-goals:** a cross-repo monocommit (impossible, undesired); replacing per-repo focused sessions for judgment-heavy work; a bespoke external tool (we use Claude Code's existing Agent/Workflow primitives + `gh`).

## 2. The fleet-change spec (the central source of truth for intent)

Every fleet change is authored once as a spec under `docs/internal/orchestration/campaigns/<id>/spec.md`. Template:

```
# Fleet change FC-NNNN: <short title>

- Id: FC-NNNN
- Class: uniform-mechanical | uniform-judgment
- Author / date:
- Standard/clause it enforces (if any): <link>
- Pilot repo: <repo>

## Change (uniform intent)
<the exact change, written once, repo-agnostic>

## Per-repo parameters
| Repo | base | scripts dir | site CI file | deploy CI file | notes |
|---|---|---|---|---|---|
| pm-skills | /pm-skills | scripts/ | validation.yml | deploy-pages.yml | |
| thinking-framework-skills | /thinking-framework-skills | scripts/ | ci.yml | deploy-pages.yml | |
| agent-skills-toolkit | /agent-skills-toolkit | site/scripts/ | ci.yml | deploy-pages.yml | |
| writing-style-catalog | /writing-style-catalog | scripts/ | validate.yml | build-site.yml | |

## Acceptance check (per repo)
<the command(s) that prove the change landed correctly>

## Stop-and-flag rules
- Cross-check this repo's ADRs/CHANGELOG before changing any named/identity value.
- Stop and report if <the change conflicts with local state / a guard goes red / the acceptance check fails non-obviously>.

## Exclusions
<any repo deliberately not in scope, with reason - no silent skips>
```

The per-repo parameter table is the antidote to drift: the difference between repos is **data**, not a re-interpretation.

## 3. The campaign record (the central source of truth for status)

Alongside the spec, `docs/internal/orchestration/campaigns/<id>/record.md` tracks the fan-out. Template:

```
# Campaign FC-NNNN: <title>  -  status

| Repo | Branch | PR | CI | State |
|---|---|---|---|---|
| pm-skills | chore/fc-NNNN | #__ | green | merged |
| thinking-framework-skills | chore/fc-NNNN | #__ | pending | open |
| agent-skills-toolkit | - | - | - | FLAGGED: <reason> |
| writing-style-catalog | chore/fc-NNNN | #__ | green | merged |

## Flags / deviations
<what an agent stopped on, and the resolution>

## Outcome / learnings
<folded back into the spec/guide/Standard>
```

This is the central half of the dual-documentation model (guide Section 6). The local half is each repo's own CHANGELOG/ADR/PR, which references `FC-NNNN` and records only what is local.

## 4. The orchestrator pattern

### Level 2 (default for uniform changes)

1. Author the spec + open the campaign record (id allocated).
2. In a control session with all four repos as working directories, **dispatch one sub-agent per repo in parallel**. Each agent is given: the spec, its row of the parameter table, and the stop-and-flag rules. Each agent, in its repo only:
   - creates branch `chore/fc-NNNN`,
   - applies the parameterized change,
   - runs the acceptance check + the repo's build/tests,
   - adds the local CHANGELOG entry (and ADR if it made a local decision) referencing `FC-NNNN`,
   - opens a PR (title references `FC-NNNN`), does **not** merge,
   - returns: PR link, CI state, and any flag.
3. The orchestrator writes the results into the campaign record and reports the PR links + flags.
4. The maintainer reviews/merges; the orchestrator may watch CI and merge the green, non-flagged PRs on instruction.

Because the four repos are separate directories, the parallel agents never collide; no worktree isolation is needed (that is only for same-repo parallelism).

The Workflow expression (sketch):

```js
// one agent per repo, parallel, each lands a PR
const results = await parallel(REPOS.map(repo => () =>
  agent(`Apply fleet change FC-NNNN to ${repo.path} using params ${JSON.stringify(repo.params)}.
         Follow the spec at <spec path>. Branch chore/fc-NNNN, run the acceptance check,
         add the CHANGELOG entry referencing FC-NNNN, open a PR, do NOT merge.
         STOP and report instead of guessing if <stop-and-flag>.`,
        { label: `fc:${repo.name}`, schema: FC_RESULT_SCHEMA })))
```

### Level 3 (reusable runner, IDEA)

A saved Workflow script that takes a fleet-change spec path as `args`, reads the parameter table, and runs the Level-2 fan-out generically. Build this only after a few Level-2 runs prove the spec format is stable.

## 5. Pilot then fan out

For any change with real blast radius: the spec names a **pilot repo**; apply there first, prove green, fold any surprise back into the spec, then fan the proven change to the other three. The orchestrator may open all PRs but the maintainer merges the pilot first.

## 6. Definition of done (for the capability)

- The fleet-change spec + campaign record formats are adopted and live under `docs/internal/orchestration/campaigns/`.
- One pilot fleet change has run end to end (E1.3) producing: one central spec+record, four local PRs each referencing the id, all green or explicitly flagged.
- The dual-documentation link (id on both sides; no duplication) is demonstrated and documented.

## 7. Phased plan

1. **P1** Land these orchestration docs (this set). Adopt the spec + record templates.
2. **P2** Pick the pilot change (favicon adoption or the CI dash-check), author its spec, allocate `FC-0001`.
3. **P3** Run the pilot: orchestrate one repo, prove green; fan to the other three; fill the campaign record.
4. **P4** Fold learnings back; decide whether to build the Level-3 runner (E1.5).
5. **P5** Use the capability for E2-E5 (the consistency epics).

## 8. Open questions

- **Campaign home**: `docs/internal/orchestration/campaigns/<id>/` here (recommended), vs a lighter single-file record. Recommendation: a folder per campaign once they accrue artifacts; a single file is fine to start.
- **Id scheme**: `FC-NNNN` allocated at campaign open (mirrors the ADR/Standard allocation-at-land discipline so parallel campaigns do not collide).
- **Merge authority**: does the orchestrator ever auto-merge green PRs, or always hand back to the maintainer? Recommendation: hand back by default; allow "merge the green, non-flagged" on explicit instruction.
- **Where the consistency rules graduate**: each consistency epic's clause lands in `STANDARD.md`/`standards/` via the GOVERNANCE amendment process; the campaign that rolls it out references that clause.
