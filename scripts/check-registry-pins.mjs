#!/usr/bin/env node
// what-it-is:   the registry re-pin drift detector, and the re-pin applier
// what-it-does: compares every pinned member against that repo's latest GitHub release, and can apply one member's re-pin
// why:          a member can ship a release the registry never picks up, and nothing here noticed until someone looked
// used-by:      .github/workflows/repin-watch.yml; runnable locally with no arguments
//
// check-registry-pins.mjs - is every member pinned at its latest release?
//
// THE PROBLEM THIS EXISTS FOR. `agent-skills-toolkit` tagged and GitHub-released v1.16.2 and v1.16.3
// on 2026-08-25. Three days later this registry was still pinned to v1.16.1, and so was npm. Two
// fixes written for consumers of that toolkit's reusable GitHub Action had reached those consumers
// by neither route. Nothing was broken; nobody had looked. validate-registry.mjs would not have
// caught it either, and correctly so: it asks whether the pin is VALID, and a pin to an older
// release is perfectly valid. "Valid" and "current" are different questions, and this asks the
// second one.
//
// SCOPE, deliberately narrow. This reports drift and, in apply mode, edits two files. It never
// merges anything. The re-pin still arrives as a pull request that a maintainer reviews against the
// CONTRIBUTING.md Section 7 checklist, because deciding that a member's new release SHOULD be
// carried is a judgement (a member can ship a release the registry deliberately skips) and only the
// noticing is mechanical.
//
// Usage:
//   node scripts/check-registry-pins.mjs                    report drift; exit 1 if any member is behind
//   node scripts/check-registry-pins.mjs --json             the same, as JSON on stdout, exit always 0
//   node scripts/check-registry-pins.mjs --apply <name>     re-pin one member and write the CHANGELOG entry
//
// Env: GITHUB_TOKEN (optional locally, set in CI) raises the API rate limit from 60/hour per IP to
// 5000/hour. Unauthenticated on a shared runner IP this can be rate-limited, which is reported as a
// REFUSAL rather than as "no drift" - a check that cannot see is not a check that found nothing.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = path.join(ROOT, ".claude-plugin/marketplace.json");
const CHANGELOG = path.join(ROOT, "CHANGELOG.md");

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const applyIdx = args.indexOf("--apply");
const applyName = applyIdx >= 0 ? args[applyIdx + 1] : null;

/** GitHub API GET returning parsed JSON, or a typed refusal the caller must handle. */
async function api(pathname) {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "product-on-purpose-repin-watch",
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${pathname}`, { headers });
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") return { refusal: "rate-limited" };
  }
  if (res.status === 404) return { missing: true };
  if (!res.ok) return { refusal: `HTTP ${res.status}` };
  return { data: await res.json() };
}

/** owner/repo from a marketplace `source.url` such as https://github.com/o/r.git */
export function ownerRepo(url) {
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/.exec(String(url || ""));
  return m ? { owner: m[1], repo: m[2] } : null;
}

/** Semver-ish minor bump, used for the registry's own version line: 1.69.0 becomes 1.70.0. */
export function bumpMinor(version) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(version));
  if (!m) throw new Error(`registry metadata.version is not X.Y.Z: ${version}`);
  return `${m[1]}.${Number(m[2]) + 1}.0`;
}

/** One row per member: where it is pinned, where that repo's latest release is, and whether they agree. */
async function survey(registry) {
  const rows = [];
  for (const p of registry.plugins) {
    if (p.source?.source !== "url") continue;
    const or = ownerRepo(p.source.url);
    if (!or) {
      rows.push({ name: p.name, status: "skipped", detail: "source.url is not a github.com URL" });
      continue;
    }
    const rel = await api(`/repos/${or.owner}/${or.repo}/releases/latest`);
    if (rel.refusal) {
      rows.push({ name: p.name, status: "refused", detail: rel.refusal });
      continue;
    }
    if (rel.missing) {
      rows.push({ name: p.name, status: "skipped", detail: "no published GitHub release" });
      continue;
    }
    const tag = rel.data.tag_name;
    const commit = await api(`/repos/${or.owner}/${or.repo}/commits/${encodeURIComponent(tag)}`);
    if (commit.refusal || commit.missing) {
      rows.push({ name: p.name, status: "refused", detail: `could not resolve ${tag} to a commit` });
      continue;
    }
    const latestSha = commit.data.sha;
    const behind = `v${p.version}` !== tag || p.source.sha !== latestSha;
    rows.push({
      name: p.name,
      status: behind ? "behind" : "current",
      owner: or.owner,
      repo: or.repo,
      pinnedVersion: p.version,
      pinnedSha: p.source.sha,
      latestTag: tag,
      latestSha,
      releasedAt: rel.data.published_at,
    });
  }
  return rows;
}

/** Rewrite marketplace.json and CHANGELOG.md for exactly one member. Touches no other entry. */
function applyRepin(registryRaw, row) {
  const registry = JSON.parse(registryRaw);
  const entry = registry.plugins.find((p) => p.name === row.name);
  if (!entry) throw new Error(`no registry entry named ${row.name}`);
  if (entry.strict !== true) throw new Error(`${row.name} is not strict: true; refusing to touch it`);

  const fromVersion = entry.version;
  const fromSha = entry.source.sha;
  const toVersion = row.latestTag.replace(/^v/, "");
  const fromRegistry = registry.metadata.version;
  const toRegistry = bumpMinor(fromRegistry);

  entry.version = toVersion;
  entry.source.sha = row.latestSha;
  registry.metadata.version = toRegistry;

  // Preserve the file's existing two-space indentation and trailing newline.
  writeFileSync(REGISTRY, `${JSON.stringify(registry, null, 2)}\n`);

  const today = new Date().toISOString().slice(0, 10);
  const changelog = readFileSync(CHANGELOG, "utf8");
  const eol = changelog.includes("\r\n") ? "\r\n" : "\n";
  const lines = changelog.split(/\r?\n/);
  // Insert a new versioned section directly above the most recent one.
  const anchor = lines.findIndex((l, i) => i > 0 && /^## \[\d+\.\d+\.\d+\]/.test(l));
  if (anchor < 0) throw new Error("no existing versioned CHANGELOG section to insert above");
  const block = [
    `## [${toRegistry}] - ${today}`,
    "",
    "### Changed",
    "",
    `- Re-pinned \`${row.name}\` from **\`v${fromVersion}\`** (\`${fromSha.slice(0, 7)}\`) to ` +
      `**\`${row.latestTag}\`** (\`${row.latestSha.slice(0, 7)}\`).`,
    "  `strict: true` preserved; no other member entry moves.",
    `- Opened automatically by \`repin-watch\`, which noticed that ${row.owner}/${row.repo} had published ` +
      `${row.latestTag} while this registry was still pinned to v${fromVersion}. The re-pin checklist in ` +
      "`CONTRIBUTING.md` Section 7 is in the pull request body and is the maintainer's to complete; this " +
      "automation does the noticing, not the deciding.",
    "",
  ];
  lines.splice(anchor, 0, ...block);
  writeFileSync(CHANGELOG, lines.join(eol));

  return { fromVersion, toVersion, fromSha, toSha: row.latestSha, fromRegistry, toRegistry };
}

async function main() {
  const registryRaw = readFileSync(REGISTRY, "utf8");
  const rows = await survey(JSON.parse(registryRaw));

  if (applyName) {
    const row = rows.find((r) => r.name === applyName);
    if (!row) throw new Error(`no member named ${applyName} in the registry`);
    if (row.status !== "behind") throw new Error(`${applyName} is ${row.status}, not behind; nothing to apply`);
    const result = applyRepin(registryRaw, row);
    console.log(JSON.stringify({ applied: row.name, ...result }, null, 2));
    return 0;
  }

  if (asJson) {
    console.log(JSON.stringify({ rows }, null, 2));
    return 0;
  }

  const behind = rows.filter((r) => r.status === "behind");
  const refused = rows.filter((r) => r.status === "refused");
  for (const r of rows) {
    if (r.status === "behind") {
      console.log(`BEHIND   ${r.name}  pinned v${r.pinnedVersion} (${r.pinnedSha.slice(0, 7)})  latest ${r.latestTag} (${r.latestSha.slice(0, 7)})`);
    } else if (r.status === "current") {
      console.log(`ok       ${r.name}  ${r.latestTag}`);
    } else {
      console.log(`${r.status === "refused" ? "REFUSED " : "skipped "} ${r.name}  ${r.detail}`);
    }
  }
  console.log("");
  if (refused.length) {
    console.log(`check-registry-pins: REFUSED - ${refused.length} member(s) could not be read, so this run proves nothing about them.`);
    return 2;
  }
  if (behind.length) {
    console.log(`check-registry-pins: ${behind.length} member(s) behind their latest release.`);
    return 1;
  }
  console.log("check-registry-pins: OK, every member is pinned at its latest release.");
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("check-registry-pins.mjs")) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error(`check-registry-pins: ${err.message}`);
      process.exit(2);
    });
}
