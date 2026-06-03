# Spec: consistent page formatting

> Consistent formatting across two surfaces: the rendered documentation-site pages, and the repo-native docs (READMEs and friends). Status: DRAFT / PROPOSED (2026-06-02). Backlog epic E4. Depends on the Astro preset (E3 / Astro ROADMAP Phase 2).

## 1. Goal

A reader sees one visual and structural language across the family: the same site theme (accent, diagrams, page frontmatter) and the same repo-native doc shape (README hero, INDEX, house style). Two layers because they have two render channels: built HTML (Starlight) and GitHub Markdown.

## 2. The two layers

### 2a. Rendered-site formatting (owned by the Astro preset)

The single source of truth is `@product-on-purpose/astro-docs-preset` (spec: [`standards/domains/astro-sites/shared-preset-spec.md`](../../../standards/domains/astro-sites/shared-preset-spec.md)): the `#5C7CFA` accent (+ AA-safe light-mode text accent), branded mermaid theme, the `docsSchemaShared` frontmatter superset, the family favicon, and the default `og:image`. **Current drift**: accent converged; mermaid branded in only two of four; schema extensions diverged; favicon now present everywhere but as an interim mark. The preset collapses all of these to one pinned dependency.

### 2b. Repo-native doc formatting (a shared template + the house rules)

The Markdown a contributor reads on GitHub. **Current state**: READMEs are converging on the family "hero" pattern (centered title, badges, nav/issue belts, collapsible TOC, a tier/overview section, a per-component catalog), proven on the agent-skills-toolkit and pm-skills READMEs. **Drift**: emoji vs no-emoji section headers; presence of INDEX; folder READMEs; the em/en-dash rule enforced in CI in some repos only.

Define:
- A **README family template** (the hero pattern; no emoji section headers per the formal-sibling convention; the find-your-way-in router; the at-a-glance status table).
- **INDEX.md** presence and shape (human map of components), per `STANDARD.md` 10.3.
- **Folder READMEs + docblocks** (the anti-sidecar legibility model: `STANDARD.md` 8.7 / 10.3), not per-file sidecars.
- The **no-em/en-dash** rule enforced in CI everywhere (the dash-check scan set is settled in the Astro `ci-standard`: includes `.py`, code-point detector, excludes `.json`).

## 3. Target

- Site formatting: every repo pins the preset; per-config divergence drops to title/base/sidebar/content.
- Repo docs: every repo's README matches the family template; INDEX + folder-README legibility present; the dash check runs in CI fleet-wide.

## 4. Plan

1. **E4.1** Ship the preset (Astro ROADMAP Phase 2) - unblocks site-formatting consistency.
2. **E4.2** Author the README family template + the repo-doc formatting clause (graduate the hero pattern, already proven, into a `standards/` template).
3. **E4.3** Orchestrate adoption: a fleet change that pins the preset (site) and applies the README template + dash-check (repo docs), pilot first. README content is judgment-heavy (per-repo prose), so this fans out **with stop-and-flag** and expects per-repo review.

## 5. Acceptance

- All four sites pin the preset; mermaid branded and schema unified everywhere.
- All four READMEs follow the family template; INDEX + folder READMEs present; CI dash check green fleet-wide.

## 6. Dual documentation

Central: this spec + the preset + the README template/clause + the campaign record. Local: each repo's README/INDEX/config PR + CHANGELOG referencing the campaign id. The visual language is defined once (preset + template); repos reference and pin it.

## 7. Open questions

- Emoji section headers: ban fleet-wide (match the formal siblings) or allow per-repo voice? Recommendation: no emoji in section headers; allow tasteful inline.
- How much README content is templated vs per-repo authored (the hero/structure is shared; the prose is local).
- Favicon re-master: ship an SVG family mark to replace the interim PNG placeholder.
