# Family program roadmap and outcomes

> The one-page synthesis across the three programs the family is running in parallel - governance (the Standard), sites (the Astro domain), and orchestration (the fleet model) - mapped to **outcomes** rather than tasks. This is the index and the "why"; the detail lives in each program's own roadmap, linked below, and is not copied here (single source of truth per axis). Written 2026-06-07.

## The north star

Strip away the individual tasks and the whole effort aims at one end state: **a plugin family that is consistent by construction and independently shippable.** Every plugin conforms to one versioned Standard, every documentation site is built and guarded the same way, and uniform changes propagate through shared machinery instead of per-repo hand-work. Three pillars get there.

| Pillar | The question it answers | "Done" looks like | Source of truth |
|---|---|---|---|
| **Governance** | How is a plugin built, and how does that law evolve without collisions? | One Standard, versioned; each plugin pins the version it meets; amendments land serialized (one PR: text + version + ADR) | [`../../standards/GOVERNANCE.md`](../../standards/GOVERNANCE.md) (Section 8 = the amendment backlog) |
| **Sites** | How does every plugin's docs site stay uniform and unbroken? | One shared CI workflow + one config preset; no shipped 404s; a site change lands once, not four times | [`../../standards/domains/astro-sites/ROADMAP.md`](../../standards/domains/astro-sites/ROADMAP.md) |
| **Orchestration** | How do uniform changes reach all repos reliably? | A repeatable capability: drive from one control point, one PR per repo, dual-documented | [`orchestration/backlog.md`](orchestration/backlog.md), [`orchestration/guide.md`](orchestration/guide.md) |

## Where the family stands (2026-06-07)

The hard part is done. All four sites are Pattern S on `main`, all four carry the clause-14.11 link/route guards, the Standard is at v0.11 (29-check spine), and the governance + orchestration models are committed. What remains is formalization, consolidation, and bringing two laggards into versioned governance. Nothing here is a fire; it is the alignment work that makes the consistency durable.

## The open items, mapped to outcomes

Status verbs: NOW (do next), NEXT (after its dependency), LATER (sequenced behind), IDEA (not committed).

| Item | Outcome (what you get) | What it unlocks | Effort / risk | Status |
|---|---|---|---|---|
| **`library.json` for pm-skills + writing-style-catalog** | The two laggards can pin a Standard version at all; pm-skills stops being "loose components" under its own Section 5 | §14 re-adoption for the *full* family; registry conformance signal; retires pm-skills' duplicated manifest metadata | Low (wsl) / Med (pm-skills) | NOW |
| **Land §14** (site standard) | The site standard becomes **normative** (a MUST) instead of "proposed" | Plugins can *declare* site conformance; re-adoption via the `standard` pin | Low-Med (text + version + 1 ADR; spine untouched) | NOW |
| **Shared CI workflow** (Astro Phase 1) | Four duplicated guard copies collapse into **one** hardened validator | The shared preset; the CI consistency epic E3 | Med-High (new org-repo content; pilot-then-fan) | NEXT |
| **Shared preset** (Astro Phase 2) | One source for accent / mermaid / schema / favicon / og:image across all sites | Page-formatting consistency (E4); closes the version drift | Med (new repo; extract from a converged baseline) | NEXT |
| **Fleet pilot FC-0001** | Proves the cross-repo change capability end to end | The E2-E5 consistency epics | Low-Med | NEXT |
| **Favicon SVG re-master** | An on-brand vector mark | Removes the placeholder and the orange/`#5C7CFA` mismatch (see Open decisions) | Low (but a design call) | LATER |

## The critical insight about §14

Landing §14 is **formalization, not new capability.** The enforcement it describes - the link/route guards - already runs in all four repos. So landing §14:

- makes the site rules a normative MUST and lets a plugin *declare* site conformance by bumping its `standard` pin;
- ratifies clauses now proven against four conforming repos (the "do not ratify from a non-conforming exemplar" gate is satisfied);
- does **not** build the shared workflow or preset, and does **not** change how anything is enforced today.

That reframes the engineering priority. The thing creating *risk* right now is not the absence of §14 - it is that **four repos each carry their own copy of the guards**, which will drift. The move that removes that risk is the **shared CI workflow** (Phase 1), not the §14 paperwork. §14 is cheap and worth doing; the workflow is where the durable value is.

A second-order point: `library.json` for the two laggards is arguably **more foundational than §14**. Landing §14 "to enable re-adoption" is hollow if half the family cannot pin *any* version to re-adopt *from*. The laggards' manifests are the real prerequisite.

## Recommended sequence (and why)

1. **`library.json` for the laggards** - *foundational.* Until pm-skills and writing-style-catalog have one, they cannot pin any Standard version, so §14 re-adoption is moot for half the family. First concrete packet: [`convergence/writing-style-catalog-library-json.md`](convergence/writing-style-catalog-library-json.md) (the small, safe one). pm-skills is the higher-leverage but heavier sibling (see its note below).
2. **Land §14** - *formalize.* Cheap, unblocks re-adoption plus a registry conformance signal. Can run in parallel with step 1.
3. **Shared CI workflow** - *consolidate.* The engineering payoff: four guard copies become one. Highest durable value.
4. **Shared preset** - *consolidate.* Config single-source; unblocks page-formatting consistency.
5. **Fleet pilot + epics** - *generalize.* Make uniform change repeatable.

> Note on the pilot candidate: the two originally-suggested FC-0001 changes have weakened. The **dash-check is stale** (v0.11 retired the U10 no-dashes check via ADR 0028, so a fleet-wide dash-check would contradict the Standard), and **favicon adoption is cosmetic** on an off-brand placeholder. A stronger first pilot is the **CI action-version pin** or the `node-version-file` standardization (Astro ROADMAP / E3.4): genuinely uniform, mechanical, low blast radius.

## pm-skills: the highest-leverage, heaviest sibling

The standards analysis calls giving pm-skills a `library.json` "the single highest-leverage step in the whole family" - it is the mature, distributed flagship, yet formally "loose components." But it is the wrong thing to author blind: roughly ninety components to enumerate without drift, native manifests the Standard says must be **generated** from the manifest (not duplicated), it is mid-feature-branch as of this writing, and it still ships an **embedded self-listing marketplace** (a live Section 12 violation). It should be a deliberate convergence session in its own repo, with its own tooling, bundling the manifest with the marketplace cleanup - not a drive-by PR from here.

## Open decisions for the maintainer

These are genuine forks the existing docs under-specify. The recommendation is noted; the call is yours.

| # | Decision | Recommendation |
|---|---|---|
| 1 | **§14 section number: 13 (strict next-free) vs 14 (keep the wired-in numbering).** The allocation invariant says first-to-land takes 13, but "14.x" is already in all four repos' guard headers, ADR 0026, and CHANGELOGs. | **Keep 14, reserve 13** for the cross-plugin-coupling draft. Renumbering to 13.x would ripple across four repos for no benefit. |
| 2 | **§14 enforcement model: normative text only (delegate to the site CI guards) vs add §14 checks to the core gate.** The self-hosting gate hard-asserts a 29-check spine; the site clauses are conditional and not structural. | **Text only, delegate enforcement.** Keeps the spine intact, matches the ROADMAP (site enforcement lives in the shared workflow), and is the low-risk land. |
| 3 | **Favicon.** The asset is described everywhere as a `#5C7CFA` compass but `assets/favicon.png` is an orange Safari-style mark. | Re-master as an SVG **in the family accent** (`#5C7CFA`), which both fixes the format and the brand mismatch. A design pass worth a deliberate look. |
| 4 | **Laggard tiers.** `tier` is a declared target the gate verifies and flags if over-claimed, so declaring one is intent, not fabrication. | writing-style-catalog: **universal** (one skill). pm-skills: **convergent** (subagents + workflows + commands + chain contract + multi-target). |

## Addendum (2026-06-10)

Two of this roadmap's preconditions are now in place. The **listing contract** is bound to the Standard: `CONTRIBUTING.md` (the GOVERNANCE.md Section 2 home for it) now carries clauses L1-L6, the re-pin checklist, and the enforcement ratchet - previously it listed only Claude-native requirements with no Standard binding. And the **family conformance audit is queued**: [`convergence/audit-plan.md`](convergence/audit-plan.md) defines one packet per marketplace member (writing-style-catalog's already exists and executes first), the audit output contract, and the parameterized kickoff prompt. The audits produce the laggards' manifests (this roadmap's "NOW" row) and the scaffolding evidence the folder-structure epic (E2) needs before any L6 clause is ratified.

## See also

- [`../../standards/GOVERNANCE.md`](../../standards/GOVERNANCE.md) - the amendment lifecycle and the drafting backlog (Section 8).
- [`../../standards/domains/astro-sites/ROADMAP.md`](../../standards/domains/astro-sites/ROADMAP.md) - the sequenced Astro plan (Phases 0-4) this brief summarizes.
- [`../../standards/domains/astro-sites/SITE-STANDARD.md`](../../standards/domains/astro-sites/SITE-STANDARD.md) - the land-ready §14 clauses (14.1-14.11).
- [`orchestration/backlog.md`](orchestration/backlog.md) - the fleet program (E1-E5).
- [`convergence/`](convergence/) - per-repo conformance convergence packets (the first: writing-style-catalog).
- [`../../_LOCAL/standards-plan.md`](../../_LOCAL/standards-plan.md) - the full family analysis (gitignored working doc) this program was promoted from.
