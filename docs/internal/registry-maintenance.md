# Registry maintenance (operations)

How to operate and extend the `product-on-purpose` marketplace registry. This is the living operational doc for *this* repo. The design rationale (why enforcing, why tag-target-only, the version-line reasoning) lives with the release that commissioned the registry, in the pm-skills repo at `docs/internal/release-plans/v2.21.0/registry-ci-spec.md`.

## What this repo is

A **thin registry**: it holds `.claude-plugin/marketplace.json` (the listing) and docs, and **no plugin code**. Each listed plugin lives in its own repo with its own version, changelog, and release cadence. The registry points outward at each plugin via a pinned `source`; plugins never point back (the one-way rule, see `CONTRIBUTING.md`).

This repo has its own version line in `metadata.version` (independent of any plugin's version): `0.1.0` = the private preview registry; `1.0.0` = the first public launch. See `CHANGELOG.md`.

## The registry file

`.claude-plugin/marketplace.json` carries every field the CI enforces:

- Top level: `$schema`, `name`, `owner`, `plugins` (and an optional `metadata` with `description` + `version`).
- Each `plugins[]` entry: `name`, `source` (`{ source: "github", repo: "owner/repo", sha: "<40-char commit>" }`), `description`, `version`, `strict`.

## Adding or bumping a plugin

1. Confirm the plugin repo satisfies the listing contract in `CONTRIBUTING.md` (valid `.claude-plugin/plugin.json`, independently installable).
2. Edit `.claude-plugin/marketplace.json`: add or update the entry. **Pin `sha` to a released-tag commit** (not a branch head). Set `version` to match the plugin's released version.
3. Run `node scripts/validate-registry.mjs` locally (set `GITHUB_TOKEN` to avoid the unauthenticated rate limit; `gh auth token` works).
4. Open a PR. CI must pass before merge.

## CI contract (`scripts/validate-registry.mjs`, wired in `.github/workflows/validate-registry.yml`)

Runs on push/PR to `main` and on demand. Enforcing: CI fails and blocks merge on any of these.

| # | Check | Fails when |
|---|---|---|
| 1 | JSON parse | `marketplace.json` is not valid JSON |
| 2 | Schema | `$schema` / `name` / `owner` / `plugins` missing or wrong type |
| 3 | Per-entry required fields | an entry lacks `name`, `source`, `version`, or `description` |
| 4 | `source` shape + pinned `sha` | `source.source != "github"`, `repo` not `owner/repo`, or `sha` not a 40-char hex |
| 5 | `sha` is a release-tag target | the `sha` is not the exact commit a release tag points at (annotated tags are dereferenced) |
| 6 | No placeholder in production | an entry looks like a placeholder, or is `strict: true` without a valid pinned source |
| 7 | Installability | the pinned commit's `.claude-plugin/plugin.json` is missing/invalid or lacks `name`/`version`/`description`/`license` |

Notes:
- **Checks 5 and 7 read the listed plugin repo over the network.** CI passes `GITHUB_TOKEN` (5000 req/hr); locally, set `GITHUB_TOKEN` or you will hit the 60 req/hr unauthenticated limit. Transient/rate-limit failures are retried and labeled `transient/infra` (distinct from a real defect) so a failed run is diagnosable as "re-run" vs "fix the registry".
- **Check 7 ships enforcing.** The `REGISTRY_CHECK7=advisory` env var demotes it to a warning - the documented fallback only if it proves flaky.
- **`metadata.version` monotonicity** is advisory (warn, not block).

## Go-public checklist (the launch flip)

The registry starts private. Before flipping it public (a single deliberate step), every box must be green:

- [ ] README updated for a public audience: **remove the Preview banner**, ensure the canonical install commands and the "Migration during transition" section are accurate.
- [ ] LICENSE present (Apache-2.0) and CONTRIBUTING accurate.
- [ ] Secret scan over the tree and full history shows zero findings; `.gitignore` excludes `_LOCAL/`, `.memsearch/`, `.claude/`.
- [ ] `validate-registry` CI green on `main`.
- [ ] Branch protection on `main` requires the `validate-registry` check.
- [ ] Repo About description + topics point at the canonical install.
- [ ] The pm-skills entry is pinned to the launch tag (not a stale preview pin).

## Rollback: broken public listing

If a public install verification fails after the flip (the pm-skills launch runbook's S8), **flip this repo back to private immediately** so no public user hits the broken listing, then diagnose. Re-flip public only once the cause is fixed and the install verification passes. Never leave a reachable-but-broken public registry.
