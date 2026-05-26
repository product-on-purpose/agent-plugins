#!/usr/bin/env node
// validate-registry.mjs - enforcing validator for the product-on-purpose marketplace registry.
// Implements the checks specified in pm-skills docs/internal/release-plans/v2.21.0/registry-ci-spec.md
// (design rationale) and documented operationally in docs/internal/registry-maintenance.md (this repo).
//
// Checks (1-6 + the metadata.version lint are enforcing; 7 is enforcing-at-launch with a documented
// advisory fallback): see registry-maintenance.md.
//
// Usage:  node scripts/validate-registry.mjs
// Env:    GITHUB_TOKEN (optional) - raises the GitHub API rate limit and is required for private plugin repos.
//         REGISTRY_CHECK7=advisory - demote check 7 to a warning (the D-V3-4 fallback if it proves flaky).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = join(ROOT, ".claude-plugin", "marketplace.json");
const SHA_RE = /^[0-9a-f]{40}$/;
const REPO_RE = /^[^/\s]+\/[^/\s]+$/;

const errors = [];
const warnings = [];
const fail = (check, msg) => errors.push(`[FAIL ${check}] ${msg}`);
const warn = (check, msg) => warnings.push(`[WARN ${check}] ${msg}`);

const token = process.env.GITHUB_TOKEN;
const check7Advisory = process.env.REGISTRY_CHECK7 === "advisory";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Distinguish a transient/rate-limit failure (retry, and surface clearly) from a hard 4xx.
class TransientError extends Error {}

async function fetchRetry(url, headers, { attempts = 3 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    let res;
    try {
      res = await fetch(url, { headers });
    } catch (e) {
      lastErr = new TransientError(`network error: ${e.message}`);
      await sleep(500 * (i + 1));
      continue;
    }
    if (res.ok) return res;
    const remaining = res.headers.get("x-ratelimit-remaining");
    const rateLimited = res.status === 429 || (res.status === 403 && remaining === "0");
    if (rateLimited || res.status >= 500) {
      const hint = rateLimited && !token ? " (set GITHUB_TOKEN to raise the limit)" : "";
      lastErr = new TransientError(`${res.status}${hint}`);
      await sleep(800 * (i + 1));
      continue;
    }
    const body = await res.text().catch(() => "");
    const err = new Error(`${res.status}: ${body.slice(0, 160)}`);
    err.hard = true;
    throw err;
  }
  throw lastErr;
}

async function gh(path) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "validate-registry" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetchRetry(`https://api.github.com${path}`, headers);
  return res.json();
}

// Resolve every tag in repo to its target commit SHA (dereferencing annotated tags),
// return a Set of commit SHAs that a tag points at.
async function tagTargetCommits(repo) {
  const refs = await gh(`/repos/${repo}/git/refs/tags`);
  const commits = new Set();
  for (const ref of refs) {
    const obj = ref.object;
    if (obj.type === "commit") {
      commits.add(obj.sha);
    } else if (obj.type === "tag") {
      // Annotated tag: dereference to the commit it points at.
      const tag = await gh(`/repos/${repo}/git/tags/${obj.sha}`);
      if (tag.object?.type === "commit") commits.add(tag.object.sha);
    }
  }
  return commits;
}

async function fetchPluginJson(repo, sha) {
  // Raw content of the pinned commit's plugin manifest.
  const url = `https://raw.githubusercontent.com/${repo}/${sha}/.claude-plugin/plugin.json`;
  const headers = { "User-Agent": "validate-registry" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetchRetry(url, headers);
  return JSON.parse(await res.text());
}

// Mark a check failure as transient (infra/rate-limit) vs a genuine registry defect,
// so a human reading CI can tell "re-run" from "fix the registry".
const labelErr = (e) => (e instanceof TransientError ? `transient/infra - ${e.message}` : e.message);

async function main() {
  // --- Check 1: JSON parse ---
  let raw;
  try {
    raw = readFileSync(REGISTRY_PATH, "utf8");
  } catch (e) {
    fail(1, `cannot read ${REGISTRY_PATH}: ${e.message}`);
    return report();
  }
  let reg;
  try {
    reg = JSON.parse(raw);
  } catch (e) {
    fail(1, `marketplace.json is not valid JSON: ${e.message}`);
    return report();
  }

  // --- Check 2: schema (top-level required fields + types) ---
  if (typeof reg.$schema !== "string") fail(2, "missing or non-string `$schema`");
  if (typeof reg.name !== "string") fail(2, "missing or non-string `name`");
  if (reg.owner == null || typeof reg.owner !== "object") fail(2, "missing or non-object `owner`");
  if (!Array.isArray(reg.plugins)) fail(2, "missing or non-array `plugins`");

  // metadata.version monotonicity is advisory-only; here we just sanity-check shape.
  if (reg.metadata && reg.metadata.version != null && typeof reg.metadata.version !== "string") {
    warn("meta", "`metadata.version` should be a SemVer string");
  }

  const plugins = Array.isArray(reg.plugins) ? reg.plugins : [];

  for (const [i, p] of plugins.entries()) {
    const id = p?.name ? `plugins[${i}] (${p.name})` : `plugins[${i}]`;

    // --- Check 3: per-entry required fields ---
    for (const field of ["name", "source", "version", "description"]) {
      if (p?.[field] == null) fail(3, `${id} missing required field \`${field}\``);
    }
    if (p?.source == null) continue;

    // --- Check 4: source shape + pinned sha ---
    const s = p.source;
    if (s.source !== "github") {
      fail(4, `${id} source.source must be "github" (got ${JSON.stringify(s.source)})`);
      continue;
    }
    if (typeof s.repo !== "string" || !REPO_RE.test(s.repo)) {
      fail(4, `${id} source.repo must be "owner/repo" (got ${JSON.stringify(s.repo)})`);
    }
    if (typeof s.sha !== "string" || !SHA_RE.test(s.sha)) {
      fail(4, `${id} source.sha must be a 40-char commit hash (got ${JSON.stringify(s.sha)})`);
    }

    const repoOk = typeof s.repo === "string" && REPO_RE.test(s.repo);
    const shaOk = typeof s.sha === "string" && SHA_RE.test(s.sha);

    // --- Check 6: no placeholder in production / strict requires a real pinned plugin ---
    const looksPlaceholder =
      /placeholder/i.test(p.description || "") || /placeholder/i.test(p.name || "");
    if (looksPlaceholder) {
      fail(6, `${id} looks like a placeholder entry; remove it before it ships in production`);
    }
    if (p.strict === true && !(repoOk && shaOk)) {
      fail(6, `${id} is strict:true but lacks a valid pinned source`);
    }

    if (!(repoOk && shaOk)) continue;

    // --- Check 5: sha is a release-tag target ---
    try {
      const tagged = await tagTargetCommits(s.repo);
      if (!tagged.has(s.sha)) {
        fail(5, `${id} sha ${s.sha} is not the target of any release tag in ${s.repo}`);
      }
    } catch (e) {
      fail(5, `${id} could not verify sha-on-tag for ${s.repo}: ${labelErr(e)}`);
    }

    // --- Check 7: installability smoke (pinned commit's plugin.json parses + required fields) ---
    try {
      const pj = await fetchPluginJson(s.repo, s.sha);
      for (const field of ["name", "version", "description", "license"]) {
        if (pj?.[field] == null) {
          const m = `${id} pinned plugin.json missing \`${field}\` at ${s.repo}@${s.sha}`;
          check7Advisory ? warn(7, m) : fail(7, m);
        }
      }
    } catch (e) {
      const m = `${id} installability check failed for ${s.repo}@${s.sha}: ${labelErr(e)}`;
      check7Advisory ? warn(7, m) : fail(7, m);
    }
  }

  return report();
}

function report() {
  for (const w of warnings) console.log(w);
  if (errors.length === 0) {
    console.log("=== registry valid: all enforcing checks passed ===");
    process.exit(0);
  }
  for (const e of errors) console.error(e);
  console.error(`\n=== registry INVALID: ${errors.length} failing check(s) ===`);
  process.exit(1);
}

main().catch((e) => {
  console.error(`[FATAL] ${e.stack || e.message}`);
  process.exit(1);
});
