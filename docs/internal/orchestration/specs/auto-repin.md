# Spec: auto-repin

> Invert the re-pin default. Delivery becomes automatic on a member release; **skipping** becomes the deliberate act. The member announces, the registry decides and writes with its own credentials, and the existing daily poll stays as reconciliation. Status: DRAFT / PROPOSED (2026-09-01). Prompted by pm-skills v2.33.0 shipping to a registry that still served v2.32.0.

## 1. Goal

A member repository publishes a GitHub Release, and within minutes the registry pins it, without a human in the path. A maintainer who wants to *withhold* a release does so explicitly.

`repin-watch` already answers "is a member behind?" correctly. This spec changes what happens next, not how the question is asked.

## 2. Why the current default is wrong

`repin-watch` notices drift daily and opens an issue. It never opens the PR and never merges. Its stated reason, in the workflow header:

> Deciding that a new release SHOULD be carried is a judgement, because a member can ship a release this registry deliberately skips. Only the noticing is mechanical, and only the noticing is automated here.

**That justification is falsifiable, and the registry's own history falsifies it.** Across every re-pin in `CHANGELOG.md`, exactly one deliberate skip is documented, at registry `1.41.0`:

> Re-pinned `agent-skills-toolkit` from `v1.7.0` straight to **`v1.9.0`**. This skips a v1.8.0 pin deliberately: two releases landed in quick succession and pinning each in turn would have published an intermediate state nobody would install.

That is **debouncing, not curation**. It coalesced two closely-spaced releases into one pin. An auto-repin would have pinned v1.8.0 and then v1.9.0, reaching the same end state at the cost of one extra version bump. The gate has never rejected a member release on quality.

### The scoreboard

**Delivery failures the human gate permitted**, all self-documented:

| # | Incident | Evidence |
|---|---|---|
| 1 | `agent-skills-toolkit` v1.16.2 / v1.16.3 stale three days | "fixes written for consumers of that toolkit's reusable Action had reached those consumers by neither route" |
| 2 | `product-lifecycle-templates` v0.4.0 stale | found by `repin-watch`'s first run, "which nobody had reported" |
| 3 | A re-pin silently skipped (registry `1.61.0` era) | "the catalogue advertised `1.11.1` while the member's own manifest said `1.12.0`" |
| 4 | **pm-skills v2.33.0** (2026-09-01) | Tagged, released, and undeliverable. The registry served v2.32.0; the release's own G4 checklist carried the re-pin as an open row annotated "cross-repo, nothing blocks it" |

**Judgment the gate preserved:** one debounce, mechanically solvable.

Four to one against.

### The framing that resolves it

**Is this registry a curator or a mirror?** If curator, the gate is the product and latency is its price. If mirror, the gate is pure cost and every hour of lag is a defect.

The intent was clearly curation: the Section 7 checklist, `strict: true`, the conformance docs under `docs/internal/convergence/`. But member repos gate their own quality at their own release tags, so nothing has been left for the registry to reject. **It has been paying curator overhead while behaving as a mirror.**

This is the control-arm problem: the gate was specified and then never compared against its own absence, so it graded its own homework for the registry's entire re-pin history.

## 3. Target

```
member repo (on release published)
      │  repository_dispatch  ── trigger-only credential
      │                          member CANNOT write the registry
      ▼
agent-plugins
      ├─ debounce ~15 min, then resolve the member's LATEST release
      ├─ verify member CI green at that release's commit
      ├─ verify no opt-out marker
      ├─ run the existing survey + validate-registry against the edited tree
      └─ commit with the REGISTRY's own token
```

The member announces. **The registry decides and writes.** No member ever holds a registry-write credential.

### The four guards

1. **Debounce.** Wait ~15 minutes after the dispatch, then pin the member's *latest* release rather than the one that fired. This mechanically solves the only judgment the gate has ever exercised (`1.41.0` above), because a burst of releases collapses to its last member.
2. **Member CI must be green at the pinned commit.** Section 7 checklist item 1 is already machine-checkable. Make it a precondition, not a box a human ticks.
3. **The daily poll stays, as reconciliation.** Push gives latency; poll gives convergence. A dispatch that is lost to an expired token, an outage, or an edited workflow leaves no trace and nothing retries, whereas the survey re-asks from scratch every run and self-heals. This is not either/or, and dropping the poll would reintroduce the exact failure `repin-watch` was built for.
4. **Opt-out, not opt-in.** A `skip-repin` marker on the member release, or a `hold` label on the registry issue, withholds a pin. Deliberate skipping stays possible and becomes visible; it stops being the default path.

## 4. Credential topology

The naive objection to push-based re-pinning is "now N member repos hold registry-write credentials." That is the wrong shape and this spec does not use it.

- The member's credential authorizes **`repository_dispatch` only**. It cannot modify `marketplace.json`.
- The registry writes using its own `GITHUB_TOKEN` (or its own App installation token), exactly as `repin-watch` does today.
- One org-level GitHub App can serve every member, giving **one revocable credential** rather than one secret per repo.

### The `can_approve_pull_request_reviews` trap has a third exit

`repin-watch` today opens an issue rather than a PR because its first real run failed with:

```
GitHub Actions is not permitted to create or approve pull requests (createPullRequest)
```

The recorded reasoning for not enabling the toggle is **correct and should stand**: it bundles CREATE with APPROVE, `main` requires no reviews today so the approve half is inert, and that is precisely what makes it the wrong trade, because it becomes a latent self-approval hole the day someone adds a review requirement, with nothing connecting the two changes.

But the choice was framed as binary. **That toggle constrains only the built-in `GITHUB_TOKEN`.** A GitHub App installation token creating a PR is not "GitHub Actions creating a PR", and an App can hold `pull_requests: write` with no review-approval capability at all. The self-approval hole is avoidable rather than a cost that had to be paid.

Also relevant: `agent-plugins` `main` requires **no PR reviews**, only the `validate` status check. The ceremony being protected is already thin.

## 5. The annotated-tag constraint: already correct, and unprotected

`validate-registry.mjs` check 5 requires the pinned `sha` to be **the exact commit a release tag points at, with annotated tags dereferenced**. This is the sharpest correctness constraint in the pipeline, because getting it wrong produces a pin that looks entirely plausible.

Members use annotated tags. For pm-skills v2.33.0 the tag *object* is `bf69b6a8` and the commit it dereferences to is `7a42570e`. A naive implementation reading the tag ref would pin `bf69b6a8` and fail check 5.

**`check-registry-pins.mjs` already handles this correctly**, and it was verified rather than assumed. It resolves via:

```js
const tag = rel.data.tag_name;
const commit = await api(`/repos/${or.owner}/${or.repo}/commits/${encodeURIComponent(tag)}`);
const latestSha = commit.data.sha;
```

The `/commits/{ref}` endpoint dereferences an annotated tag to its commit on GitHub's side, so the tag-object SHA never appears. Confirmed empirically on 2026-09-01: a `workflow_dispatch` run against pm-skills v2.33.0 produced `7a42570e`, not `bf69b6a8`.

**The risk is not that this is broken. It is that nothing protects it.** `scripts/` carries no test for `check-registry-pins.mjs` at all. The correct behaviour here depends on an undocumented property of one API endpoint, expressed in one unremarkable line, with no test asserting it and no comment explaining why `/commits/` was chosen over `/git/ref/tags/`. A refactor toward what looks like the more precise endpoint would silently reintroduce the defect, and `validate-registry` check 5 would then reject every generated re-pin with an error pointing at the registry rather than at the resolver.

**Action, and it is cheap:** add a regression test that resolves an annotated tag and asserts the commit SHA rather than the tag-object SHA, plus a one-line comment at the call site naming the dereference as load-bearing. This is worth doing before any other step in section 8, since every later step inherits it.

## 6. What does not change

- `scripts/check-registry-pins.mjs` remains the single place the decision lives, and the same command a maintainer runs locally. The workflow holds no logic of its own, per repo convention.
- One member per run. Every historical re-pin moves exactly one entry, which keeps a bisect and a revert meaningful.
- `metadata.version` bump plus a `CHANGELOG.md` entry per re-pin.
- `strict: true` preserved; `validate-registry` green before anything lands.
- Exit code 2 stays a refusal: a check that cannot see a member is not a check that found nothing.

## 7. Open questions

1. **Auto-commit to `main`, or auto-open a PR that a human merges?** Direct commit is simplest but interacts with the required `validate` check, which cannot have passed on a commit that does not yet exist. The App-token PR route in section 4 avoids that and preserves a reviewable artifact. **Recommend the PR route**, auto-opened and left for a one-click merge.
2. **Debounce window.** 15 minutes is a guess. The `1.41.0` case is the only datapoint; worth measuring the actual gap between the v1.8.0 and v1.9.0 releases before fixing a number.
3. **Should a member be able to opt out of automation entirely**, staying on the issue-only path? Probably yes for any member outside this org.
4. **Does the closing check belong on the member side too?** pm-skills declared its release essentially complete while the registry still served the prior version. A member-side G4 check comparing the registry's pin against its own tag would catch that where the accountability sits, rather than asking the registry to notice on the publisher's behalf. Out of scope for this spec, noted because this incident is what prompted it.

## 8. Rollout

1. Land this spec. **(done)**
2. Add the annotated-tag regression test and the call-site comment (section 5). The behaviour is already correct; this only protects it. No behaviour change, and every later step depends on it.
3. Add the debounce-and-resolve-latest step, still on the issue-only path. Observe for one or two member releases.
4. Add the App credential and flip the terminal step from "open an issue" to "open a PR".
5. Add the member-side `repository_dispatch` on release. Latency drops from up to a day plus cron drift to minutes. Keep the poll.

Steps 2 and 3 carry no new credentials and no new authority, so they can land well ahead of 4 and 5.

## 9. A measurement worth keeping

The nominal schedule is `0 6 * * *`. Observed run starts: `11:28Z`, `12:34Z`, `11:43Z`, `13:21Z`. **Every scheduled run landed five to seven hours late**, because GitHub's scheduled events are best-effort and deprioritized under load. The real exposure window is a day *plus drift*, not a day. If steps 4 and 5 are deferred, tightening the cron to `0 */2 * * *` recovers most of the benefit at the cost of a handful of API calls, with no new credentials and no change in authority.
