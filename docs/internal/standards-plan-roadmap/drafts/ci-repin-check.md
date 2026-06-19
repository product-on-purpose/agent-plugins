# Draft: the marketplace CI keystone (re-pin conformance + truth-in-targeting)

This is the implementation-ready spec for Phase 2 (CI keystone). It extends the existing registry validator (`scripts/validate-registry.mjs`) with two new checks - the re-pin conformance check and the truth-in-targeting check - and surfaces `standard` and `tier` in the validator's output. It also defines the advisory-then-blocking rollout that flips to blocking only once all four current members pass. Together these turn listing conformance (CONTRIBUTING.md clauses L3 and L4) from hand-policed review into a CI gate, and operationalize the ratchet step 3 named in CONTRIBUTING.md Section 8.

This is staged draft text for the Phase 2 effort. It is not yet landed. Cross-references in this package: the listing contract lives in `02-roadmap.md` (Phase 2 narrative) and `drafts/contributing-edits.md` (the L3/L4 enforcement-state edits); truth-in-targeting design rationale lives in `drafts/cross-tool-targeting.md` (decision D10, cross-tool / truth-in-targeting); the orchestration of the per-repo convergence that must precede blocking lives in `drafts/orchestration-campaigns.md`.

## 1. What exists today (ground truth)

Read before editing: `scripts/validate-registry.mjs` and `.github/workflows/validate-registry.yml`.

The validator is a portable, zero-dependency Node script (matching the Standard's runner philosophy). It reads `.claude-plugin/marketplace.json` and runs numbered checks. Current checks:

| # | Check | Level |
|---|---|---|
| 1 | `marketplace.json` reads and parses as JSON | enforcing |
| 2 | Top-level schema: `$schema`, `name`, `owner`, `plugins` present and correctly typed | enforcing |
| `meta` | `metadata.version` is a string (shape only; monotonicity is advisory) | advisory (warn) |
| 3 | Per-entry required fields: `name`, `source`, `version`, `description` | enforcing |
| 4 | `source` shape + pinned `sha` is a 40-char hex commit hash; `source.source` is `github` or `url` | enforcing |
| 5 | The pinned `sha` is the target of a release tag in the plugin repo (annotated tags dereferenced) | enforcing |
| 6 | No placeholder entry; `strict: true` requires a valid pinned `sha` | enforcing |
| 7 | Installability smoke: the pinned commit's `.claude-plugin/plugin.json` parses and carries `name`, `version`, `description`, `license` | enforcing-at-launch, advisory fallback via `REGISTRY_CHECK7=advisory` |

Existing infrastructure this spec reuses verbatim:

- `gh(path)` - authenticated GitHub REST helper with `GITHUB_TOKEN`.
- `fetchRetry(...)` and the `TransientError` class - retry-with-backoff that separates transient/rate-limit failures from hard 4xx, so CI readers can tell "re-run" from "fix the registry" (`labelErr`).
- `deriveRepo(s)` - resolves `owner/repo` from a `github` source or an https `github.com` URL; returns `null` for non-github hosts.
- `fetchPluginJson(repo, sha)` - reads raw content at the pinned commit (used by check 7). The new checks read `library.json` the same way.
- The `fail(check, msg)` / `warn(check, msg)` accumulators and the `report()` exit-code contract (exit 0 when `errors` is empty, else exit 1).
- The `REGISTRY_CHECK7=advisory` env-var pattern, which this spec mirrors with per-check advisory toggles.

The workflow runs the validator on push to `main` (path-filtered), on every PR to `main`, on a weekly `cron` drift check, and on `workflow_dispatch`, with `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`.

## 2. New checks at a glance

| # | Check | Enforces | Initial level | Becomes blocking when |
|---|---|---|---|---|
| 8 | Re-pin conformance: the pinned-commit repo carries a `library.json` with a `standard` version pin and a `tier`, and the repo's own CI is green at that `sha` | CONTRIBUTING.md L3 (binds the Standard by version) + L4 (CI green at the pinned sha) | advisory | all four current members pass |
| 9 | Truth-in-targeting: every declared `agent-targets` entry has its native distribution + context shim present at the pinned commit; Codex is scoped to the portability level, not native packaging | Standard Section 5.1 `agent-targets`; decision D10 (cross-tool / truth-in-targeting) | advisory | landed in advisory in Phase 2; flips to blocking in Phase 4 |

Both checks read only the pinned commit (`repo@sha`) via the GitHub API and raw content, never `HEAD`. This keeps the gate authoritative over exactly what users receive (the same principle that makes the sha pin load-bearing, CONTRIBUTING.md Section 7).

## 3. Check 8 - re-pin conformance

### 3.1 Intent

CONTRIBUTING.md L3 says a listed plugin MUST carry a root `library.json` that pins a Standard version and declares a tier, and MUST be conformant at that version. L4 says the pinned `sha` MUST sit on a release tag (already check 5) and CI MUST be green at that sha. Check 8 makes both machine-verifiable at the pinned commit. It is the automated re-pin check named in CONTRIBUTING.md Section 8 ratchet step 3.

### 3.2 Inputs

- `repo` (owner/repo, from `deriveRepo(s)`).
- `s.sha` (the pinned commit; already validated as 40-char hex by check 4).
- Read at the pinned commit: `library.json` (raw content), the GitHub commit-status / check-runs API for `repo@sha`.
- Env: `GITHUB_TOKEN` (already wired); `REGISTRY_CHECK8=advisory` (new toggle; see Section 5).

### 3.3 Outputs

- `fail(8, ...)` for a genuine L3/L4 defect (no `library.json`, missing `standard` pin, missing/invalid `tier`, or red CI at the pinned sha).
- `warn(8, ...)` when the toggle is advisory, or for non-github hosts (cannot read raw `library.json` or check-runs), reusing the existing `5/7` skip-warning pattern.
- Transient/infra failures are surfaced via `labelErr(e)` so they read as "re-run", not "fix the registry".

### 3.4 Validation logic (pseudocode)

Insert after check 7 in the per-entry loop, guarded by the same `if (!repo) continue-with-warning` gate that protects checks 5 and 7.

```
// --- Check 8: re-pin conformance (L3 standard pin + tier; L4 CI green at sha) ---
const advisory8 = process.env.REGISTRY_CHECK8 === "advisory";
const emit8 = (msg) => (advisory8 ? warn(8, msg) : fail(8, msg));

// 8a. library.json present + parses at the pinned commit
let lib;
try {
  lib = await fetchLibraryJson(repo, s.sha);   // new helper, mirrors fetchPluginJson
} catch (e) {
  emit8(`${id} could not read library.json at ${repo}@${s.sha}: ${labelErr(e)}`);
  // record null standard/tier for the registry summary (Section 6) and skip 8b-8d
}

if (lib) {
  // 8b. standard pin present and shaped like a version
  if (typeof lib.standard !== "string" || !/^\d+\.\d+(\.\d+)?$/.test(lib.standard)) {
    emit8(`${id} library.json `standard` must pin a Standard version (got ${JSON.stringify(lib.standard)})`);
  }
  // 8c. tier present and one of the Standard's named tiers (>= Bronze/universal)
  const TIERS = ["universal", "convergent", "advanced"];  // Standard Section 2; "universal" == Bronze floor
  if (typeof lib.tier !== "string" || !TIERS.includes(lib.tier)) {
    emit8(`${id} library.json `tier` must be one of ${TIERS.join("|")} (got ${JSON.stringify(lib.tier)})`);
  }
  // 8c-bis. version agreement (L4): library.json version == registry entry version
  if (lib.version != null && lib.version !== p.version) {
    emit8(`${id} version disagreement: registry ${p.version} != library.json ${lib.version} at ${repo}@${s.sha}`);
  }
}

// 8d. CI green at the pinned sha (L4). Combined commit status OR check-runs conclusion.
try {
  const green = await ciGreenAtSha(repo, s.sha);  // new helper, see 3.5
  if (green === "failure") {
    emit8(`${id} CI is not green at ${repo}@${s.sha} (combined status/check-runs report failure)`);
  } else if (green === "none") {
    warn(8, `${id} no CI status or check-runs found at ${repo}@${s.sha}; cannot confirm L4 green`);
  } // green === "success" -> pass silently
} catch (e) {
  emit8(`${id} could not read CI status for ${repo}@${s.sha}: ${labelErr(e)}`);
}
```

### 3.5 Two new helpers

`fetchLibraryJson(repo, sha)` is a copy of `fetchPluginJson` pointed at `library.json` at the repo root:

```
async function fetchLibraryJson(repo, sha) {
  const url = `https://raw.githubusercontent.com/${repo}/${sha}/library.json`;
  const headers = { "User-Agent": "validate-registry" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetchRetry(url, headers);
  return JSON.parse(await res.text());
}
```

`ciGreenAtSha(repo, sha)` reads the GitHub combined commit status and the check-runs for the pinned commit, then collapses them to one of `"success" | "failure" | "none"`:

```
async function ciGreenAtSha(repo, sha) {
  // Combined legacy commit statuses (state: success|failure|pending|error).
  const status = await gh(`/repos/${repo}/commits/${sha}/status`);
  // Modern Checks API (conclusion: success|failure|neutral|cancelled|timed_out|...).
  const runs = await gh(`/repos/${repo}/commits/${sha}/check-runs`);

  const hasStatus = status.total_count > 0;
  const hasRuns = (runs.total_count || 0) > 0;
  if (!hasStatus && !hasRuns) return "none";

  // Any hard failure -> failure. Otherwise require every signal to be success/neutral.
  const statusBad = hasStatus && status.state !== "success";          // pending also counts as not-green
  const runBad = (runs.check_runs || []).some(
    (r) => r.status === "completed" && !["success", "neutral", "skipped"].includes(r.conclusion)
  );
  if (statusBad || runBad) return "failure";
  return "success";
}
```

Design notes:

- `ciGreenAtSha` MUST treat `pending` / `in_progress` as not-green only at the moment of evaluation; because the registry pins a released commit whose CI has already run, a non-success state at a pinned sha is a genuine L4 violation, not a race. The weekly `cron` re-run catches a status that later turned red (for example a deleted required workflow).
- The validator MUST NOT require a specific workflow name. L4 is "CI green", not "this exact job ran"; the plugin repo owns its own CI shape. A repo that runs no CI at all yields `"none"` and a non-blocking warning (it cannot demonstrate L4 conformance, but absence is not a red signal).
- All GitHub reads reuse `gh()` and therefore `fetchRetry`, so rate-limit and 5xx responses are retried and labeled transient rather than failing the registry.

## 4. Check 9 - truth-in-targeting

### 4.1 Intent

Decision D10 (cross-tool / truth-in-targeting) makes `agent-targets` load-bearing: a plugin MUST emit, and the gate MUST verify, the native distribution plus the context shim for every declared target. If a target is not actually shipped, it MUST be dropped from `agent-targets` (no claiming a target you do not deliver). Check 9 is the gate side of that rule, evaluated at the pinned commit.

Codex is scoped to truth (D10, scope-to-truth): declaring `"codex"` claims PORTABILITY (agentskills.io-compatible skills plus a root `AGENTS.md`, which is essentially free and already true), NOT native `.agents/plugins/` marketplace distribution. So for `"codex"` the gate verifies the portability floor, not a native Codex plugin manifest. Native Codex packaging is deferred until a real Codex consumer exists.

### 4.2 The target-to-evidence table (what "shipped" means at the pinned commit)

| Declared target | Native distribution evidence (at `repo@sha`) | Context shim evidence |
|---|---|---|
| `claude` | `.claude-plugin/plugin.json` parses (already proven by check 7) | root `AGENTS.md` present, and a `CLAUDE.md` shim present (Standard Section 3.10; D10 fixes the missing-shim drift) |
| `codex` (portability scope) | agentskills.io-compatible skills present (a `skills/` tree with at least one `SKILL.md`) | root `AGENTS.md` present (the cross-tool canonical source, agents.md) |

The CLAUDE.md and any other native-target shim MUST be a thin pointer to `AGENTS.md`, never a divergent copy (D10). Check 9 verifies presence at the pinned commit; it does not parse shim contents for divergence in Phase 2 (a contents check is a Phase 4 hardening, noted in Section 7).

`agent-targets` is read from `library.json` (already fetched in check 8 as `lib`). Per Standard Section 5.1, `agent-targets` is REQUIRED at Convergent+ and omitted at Universal (skills are agent-agnostic). So a Universal plugin with no `agent-targets` array is conformant and check 9 SHOULD pass it with no assertions.

### 4.3 Inputs and outputs

- Inputs: `repo`, `s.sha`, and `lib` (the parsed `library.json` from check 8); raw content reads at the pinned commit for `AGENTS.md`, `CLAUDE.md`, `.claude-plugin/plugin.json`, and a `skills/` listing via the git-tree API.
- Outputs: `fail(9, ...)` / `warn(9, ...)` via a `REGISTRY_CHECK9` toggle (defaults to advisory in Phase 2 regardless, see Section 5); non-github hosts warn-and-skip.

### 4.4 Validation logic (pseudocode)

Runs after check 8 (it depends on `lib`). If `lib` is null (8a failed), check 9 warns that it cannot evaluate targeting and skips.

```
// --- Check 9: truth-in-targeting (D10) ---
const advisory9 = true;  // Phase 2: always advisory; Phase 4 flips this (Section 5 + 7)
const emit9 = (msg) => (advisory9 ? warn(9, msg) : fail(9, msg));

if (!lib) {
  warn(9, `${id} cannot evaluate agent-targets; library.json unreadable at ${repo}@${s.sha}`);
} else {
  const targets = Array.isArray(lib["agent-targets"]) ? lib["agent-targets"] : [];
  // Universal-with-no-targets is conformant: skills are agent-agnostic (Standard 5.1).
  const present = await pathsPresent(repo, s.sha, [
    "AGENTS.md", "CLAUDE.md", ".claude-plugin/plugin.json"
  ]);
  const hasSkills = await hasSkillTree(repo, s.sha);  // any skills/**/SKILL.md

  for (const t of targets) {
    if (t === "claude") {
      if (!present[".claude-plugin/plugin.json"])
        emit9(`${id} declares target "claude" but ships no .claude-plugin/plugin.json at ${repo}@${s.sha}`);
      if (!present["AGENTS.md"])
        emit9(`${id} declares target "claude" but ships no root AGENTS.md (D10 canonical context source)`);
      if (!present["CLAUDE.md"])
        emit9(`${id} declares target "claude" but ships no CLAUDE.md shim pointing at AGENTS.md (D10)`);
    } else if (t === "codex") {
      // scope-to-truth: portability floor, NOT native .agents/plugins packaging
      if (!hasSkills)
        emit9(`${id} declares target "codex" (portability) but ships no agentskills.io skills/ tree at ${repo}@${s.sha}`);
      if (!present["AGENTS.md"])
        emit9(`${id} declares target "codex" but ships no root AGENTS.md (the cross-tool source)`);
    } else {
      emit9(`${id} declares unknown agent-target ${JSON.stringify(t)} (expected "claude" or "codex")`);
    }
  }
}
```

### 4.5 Two more helpers

```
async function pathsPresent(repo, sha, paths) {
  // One git-tree read (recursive) is cheaper than N raw HEAD requests and avoids 404 noise.
  const tree = await gh(`/repos/${repo}/git/trees/${sha}?recursive=1`);
  const set = new Set((tree.tree || []).map((e) => e.path));
  return Object.fromEntries(paths.map((p) => [p, set.has(p)]));
}

async function hasSkillTree(repo, sha) {
  const tree = await gh(`/repos/${repo}/git/trees/${sha}?recursive=1`);
  return (tree.tree || []).some((e) => /^skills\/[^/]+\/SKILL\.md$/.test(e.path));
}
```

Optimization: fetch the recursive git tree once per entry and pass it to both `pathsPresent` and `hasSkillTree` (the pseudocode shows two reads for clarity; the implementation MUST cache the tree per `repo@sha` to stay inside the API budget). The recursive tree is truncated by the API for very large repos; if `tree.truncated === true`, fall back to direct raw reads for the specific files and warn that the skills-tree probe was best-effort.

## 5. Advisory-then-blocking rollout

The rollout follows the existing `REGISTRY_CHECK7` precedent (a per-check env toggle that demotes failures to warnings) and the CONTRIBUTING.md Section 8 ratchet (audit, converge, enforce - blocking only after all four members pass).

| Stage | Check 8 (re-pin) | Check 9 (targeting) | Gate behavior |
|---|---|---|---|
| Phase 2 land | advisory (`REGISTRY_CHECK8=advisory` default-on, see below) | advisory (hard-coded advisory in Phase 2) | warnings only; never fails merge on 8/9 |
| Phase 2 converge | toggle removed for 8 once all four members emit a clean `library.json` with a `standard` pin + tier and green CI | still advisory | check 8 blocking; check 9 advisory |
| Phase 4 harden | blocking | flip `advisory9` to blocking (Phase 4 exit: "flip truth-in-targeting to blocking") | both blocking |

Default-level mechanics, mirroring check 7:

- Check 8 reads `REGISTRY_CHECK8`. To make the advisory-first stance the default at land, the workflow sets `REGISTRY_CHECK8: advisory` in Phase 2; the flip to blocking is a one-line deletion of that env var in the workflow once `01-current-state.md` confirms all four members pass (a P0 hole still open: `pm-skills` has no `library.json`, so check 8 would `fail` it the moment it is blocking - the toggle is what lets the check land before pm-skills converges in Phase 1).
- Check 9 is hard-advisory in Phase 2 (`advisory9 = true`) and reads `REGISTRY_CHECK9` only as an escape hatch; the Phase 4 hardening replaces `advisory9 = true` with `advisory9 = process.env.REGISTRY_CHECK9 === "advisory"` and removes the env var from the workflow.
- The flip to blocking is gated by evidence, not by date: it MUST NOT be flipped while any of the four current members would fail. The flip PR MUST cite the green advisory run that shows all four passing (the evidence-then-law discipline of GOVERNANCE.md Section 7 and CONTRIBUTING.md Section 8).

Sequencing dependency: check 8 blocking depends on Phase 1 (close P0 holes) landing `library.json` in `pm-skills` and on the three other members keeping their pins current (`agent-skills-toolkit` 0.12, `writing-style-catalog` 0.11, `thinking-framework-skills` 0.8 per `01-current-state.md`). Until then check 8 stays advisory.

## 6. Surfacing standard + tier in the registry output

CONTRIBUTING.md L3 and Phase 2's exit ("surface standard + tier in the registry") want the validator to report, per entry, which Standard version and tier the pinned plugin meets. Two layers:

### 6.1 Human-readable validator log (always)

After the per-entry loop, before `report()`, print a one-line-per-entry summary table to stdout from the values already gathered in check 8 (`lib.standard`, `lib.tier`). Entries whose `library.json` was unreadable show `standard=?`, `tier=?`:

```
=== registry conformance summary ===
pm-skills                    standard=?     tier=?        ci=?        (library.json missing)
thinking-framework-skills    standard=0.8   tier=advanced ci=success
writing-style-catalog        standard=0.11  tier=convergent ci=success
agent-skills-toolkit         standard=0.12  tier=advanced ci=success
```

This is informational and never affects the exit code.

### 6.2 Machine-readable artifact (optional, behind a flag)

When run with `REGISTRY_SUMMARY_JSON=<path>` (or `--summary <path>`), the validator MUST also write a JSON array of `{ name, version, standard, tier, ci, repo, sha }` records. The workflow MAY upload this as a build artifact and a later step MAY render it into the marketplace README or a status badge. This keeps `marketplace.json` itself untouched (the registry stays a thin catalog; the conformance facts live in the plugin's `library.json` and are reported, not duplicated into the registry - consistent with the decouple-and-pin discipline and CONTRIBUTING.md's restate-nothing rule).

To collect these records, check 8 pushes one entry into a module-level `summary` array as it evaluates each plugin (using `p.name`, `p.version`, `lib?.standard ?? null`, `lib?.tier ?? null`, the `ciGreenAtSha` result, `repo`, `s.sha`).

## 7. Wiring into the existing script + workflow

### 7.1 Script changes (`scripts/validate-registry.mjs`)

- Add helpers `fetchLibraryJson`, `ciGreenAtSha`, `pathsPresent`, `hasSkillTree` next to `fetchPluginJson` / `tagTargetCommits`.
- Add the module-level `const summary = []` accumulator and the two new env toggles (`REGISTRY_CHECK8`, `REGISTRY_CHECK9`).
- Insert checks 8 and 9 inside the per-entry loop, after check 7, both guarded by the existing `if (!repo) { warn(...); continue; }` non-github skip (extend its message to mention 8/9). Both MUST run only when `shaOk` (already the case at that point in the loop).
- Cache the recursive git tree per entry so checks 8 (none needed) and 9 reuse one `gh()` call.
- After the loop, print the Section 6.1 summary and, if `REGISTRY_SUMMARY_JSON` is set, write the Section 6.2 artifact. Then call `report()` unchanged.
- Update the file header comment block (the check inventory at the top) to list 8 and 9 and their levels.

### 7.2 Workflow changes (`.github/workflows/validate-registry.yml`)

- Phase 2 land: add to the `env:` block of the validate step:
  ```yaml
  REGISTRY_CHECK8: advisory   # re-pin conformance: advisory until all four members carry library.json (Phase 1)
  REGISTRY_SUMMARY_JSON: registry-conformance.json
  ```
  Check 9 needs no env var (hard-advisory in Phase 2).
- Add an `actions/upload-artifact@v4` step that uploads `registry-conformance.json` so the standard+tier summary is inspectable per run.
- Path filters already include the validator script and the workflow; no change needed there. The PR trigger (no `paths:` filter) already runs the validator on every PR, so a pin change in any PR is checked.
- The weekly `cron` already re-runs the validator; checks 8 and 9 ride along, so a Standard pin or CI status that goes stale between pushes surfaces on the next scheduled run (the same drift-catch rationale that the workflow comment gives for check 5).

### 7.3 The flip-to-blocking PRs (later, evidence-gated)

- Check 8 blocking: delete `REGISTRY_CHECK8: advisory` from the workflow `env:` block. Land only after `01-current-state.md` and an advisory run confirm all four members pass.
- Check 9 blocking (Phase 4): change `advisory9 = true` to read `REGISTRY_CHECK9`, then ensure the workflow does not set `REGISTRY_CHECK9`. Land with the Phase 4 frontmatter-tier and shared-workflow work.

## 8. Edge cases and non-goals

- Non-github hosts: `deriveRepo` returns `null`; checks 8 and 9 warn-and-skip exactly like checks 5 and 7. They cannot read raw `library.json`, the git tree, or check-runs via the GitHub API.
- Rate limits: every new GitHub read goes through `gh()` and `fetchRetry`, so a `403 remaining=0` or `5xx` is retried and labeled transient (re-run), never a hard registry failure. `GITHUB_TOKEN` is already provided by the workflow.
- Truncated git tree: if `tree.truncated`, fall back to direct raw reads for the named files and warn that the skills-tree probe (check 9) was best-effort.
- The validator MUST NOT clone repos or run plugin CI itself; it reads published GitHub state (commit status, check-runs, raw content) at the pinned commit. The plugin repo owns and runs its own conformance checks (the Standard's runner); check 8 only confirms that those ran green at the pinned sha, per L3's "Conformance is demonstrated by the Standard's checks passing at the pinned commit ... in the plugin's own CI".
- Shim-divergence (does a `CLAUDE.md` shim actually point at `AGENTS.md` rather than diverge?) is out of scope for Phase 2; check 9 verifies presence only. A contents/divergence probe is a Phase 4 hardening candidate.
- Native Codex packaging (`.agents/plugins/marketplace.json`, `.codex-plugin/plugin.json`) is explicitly NOT asserted by check 9 (D10 scope-to-truth). When a real Codex consumer appears, a new evidence row is added to the Section 4.2 table and the `"codex"` branch is upgraded; the upgrade is additive, not a rewrite.

## 9. External references

- Anthropic plugin / marketplace reference (the `marketplace.json` and `plugin.json` formats this validator reads): https://code.claude.com/docs/en/plugins-reference
- agentskills.io specification (the portable skill floor that the `"codex"` portability scope verifies): https://agentskills.io/specification.md
- AGENTS.md (the single canonical cross-tool context source, D10): https://agents.md/
- SemVer (the `version` / `standard` pin shape): https://semver.org
- RFC 8174 / BCP 14 (the MUST / SHOULD / MAY keywords used here): https://www.rfc-editor.org/rfc/rfc8174
- OpenAI Codex plugins (the deferred native packaging path; reconfirm on-disk paths before building any Codex emitter, per STANDARD.md line 495 residual): https://developers.openai.com/codex/plugins and skills https://developers.openai.com/codex/skills
