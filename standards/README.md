# Product on Purpose standards

The family's standards home: the Advanced Skill Library Standard and the process that governs it. This directory is the canonical owner of family-level law, separate from any single plugin (see [ADR 0001](decisions/0001-standard-governance-and-home.md)).

## Contents

| Path | What it is |
|---|---|
| [`GOVERNANCE.md`](GOVERNANCE.md) | How the Standard is expanded, promoted, and versioned: the operating model. |
| [`decisions/`](decisions/) | The Standard's own MADR ADRs (numbered, immutable), starting at 0001. |
| [`domains/`](domains/) | Promoted standards domains: tracked, refined drafts proposed for landing into `STANDARD.md`. The first is [`domains/astro-sites/`](domains/astro-sites/README.md) (documentation sites, proposed as Section 14). |

## Not here yet (sequenced relocation)

The canonical home is `agent-plugins/standards/`, but the move is deliberately staged (ADR 0001). Until the relocation lands, these live elsewhere:

- **`STANDARD.md`** (the normative authoring Standard): currently at [`../../agent-skills-toolkit/STANDARD.md`](../../agent-skills-toolkit/STANDARD.md).
- **the enforcing checks**: currently in `agent-skills-toolkit/scripts/`, entangled with that plugin's own validation; they relocate to `standards/checks/` when the generic spine is extracted.
- **`CHANGELOG.md` / `RELEASE-NOTES.md`** for the Standard: arrive with the text.

Working drafts (gitignored) live in [`../_LOCAL/`](../_LOCAL/): `standards-plan.md` (the full family analysis) and `astro/` (the original documentation-site drafts, now promoted to [`domains/astro-sites/`](domains/astro-sites/README.md) and refined against the 2026-06-02 implementation audit; the `_LOCAL/astro/` copies remain as provenance).
