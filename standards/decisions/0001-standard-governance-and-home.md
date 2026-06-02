# 0001 - Standard governance and canonical home

## TL;DR
- **Decision:** Adopt a serialized amendment process for the Advanced Skill Library Standard now, in place; set the Standard's canonical home to `agent-plugins/standards/`; sequence the physical relocation of `STANDARD.md` and its checks to a later, separate landing.
- **Why:** agent-plugins is the family's only neutral, plugin-free repo, so it is the right owner of family-level law; a dedicated standard repo is premature noise at four plugins; keeping the Standard inside the `agent-skills-toolkit` plugin is a category error (a plugin cannot neutrally own the law it must obey). Adopting the process is reversible, collision-killing, and independent of the move.
- **Status:** Accepted (2026-06-01).

- **Status:** Accepted
- **Date:** 2026-06-01
- **Deciders:** maintainer (jprisant), with Claude (Opus 4.8)

## Context and problem statement

The family has one normative Standard (`STANDARD.md`, v0.8) that governs all four plugins but physically lives inside, and is versioned with, one member plugin (`agent-skills-toolkit`), which is itself not listed in the marketplace. The governance design (a three-homes model and a serialized PROPOSE / REVIEW / LAND / RE-ADOPT amendment process) existed only as a gitignored working draft (`_LOCAL/standards-plan.md` Section 10) and had never been operationalized. Parallel sessions evolving standards independently had begun to collide: two drafts both reaching for a next section number ("Section 13" and "Section 14"), both reinventing a version-bump ritual. Two questions had to be answered together: where should the Standard live, and how does a change to it land without colliding.

## Decision drivers

- Neutral ownership: family law should not be owned by one member plugin that must itself conform to it.
- Decouple-and-pin already gives version independence: the `library.json` `standard` field is a string and does not require a separate repository.
- The Standard's teeth are its CI checks; separating the text from its checks across repositories is a recurring coordination cost, so the home decision is really "where do the text and its checks live together."
- Solo maintainer at family scale (four plugins, two not yet conforming): added repositories and release lines are overhead paid continuously and cashed in only at larger scale or on external adoption.
- Reversibility: adopting a process is cheap and undoable; moving files and extracting checks is not, so the two should not be coupled.

## Considered options

- **A. Keep the Standard in `agent-skills-toolkit`** (status quo), relabelled as family law governed by an amendment process. Owner: a member plugin.
- **B. Dedicated `product-on-purpose/standard` repository** with its own SemVer, ADR trail, and release tags. Owner: a neutral standards repo; the toolkit becomes purely the reference implementation.
- **C. Co-locate in `agent-plugins/standards/`**, beside the listing contract, in the existing neutral registry repo. Owner: the family registry repo.

## Decision outcome

**Chosen: C (canonical home `agent-plugins/standards/`), adopted as a sequenced move, with the amendment process adopted immediately in place.**

- **B was rejected as premature.** Its only benefit over C, an independent release-tag line, is already delivered by the `standard` version pin, while it adds a repository, a release cadence, and a forced early extraction of the check spine. B becomes warranted only if the Standard is to be **publicly adopted** by repositories outside the family, or the family grows well beyond a handful of independently-maintained plugins. C can be graduated into B later with history-preserving extraction; the version pins survive the move untouched because they are strings.
- **A was rejected as the permanent home.** A member plugin pinning a Standard that lives inside itself is circular; the law currently sits in a plugin that is not even listed in the marketplace; and "family law owned by one sibling" muddies the serialization story. A remains correct only as the *interim* physical location, because the enforcing checks were born in the toolkit and remain entangled with its own validation.
- **The split is therefore: process now, in place; home is C; the physical relocation of `STANDARD.md` plus extraction of the generic checks into `standards/checks/` is a later, separate landing,** sequenced after the documentation-site question settles and the shared CI workflow is built. The governance artifacts (this ADR and `GOVERNANCE.md`) are born in `agent-plugins/standards/` immediately, since they are family-level and do not depend on the check extraction.

## Consequences

- Positive: the operating model becomes a committed, citable artifact instead of a gitignored note; version, ADR, and section numbers are allocated at land time on a protected branch, ending parallel-session collisions; neutral ownership is established for governance without standing up a new repository; the move is de-risked by separating the cheap reversible part (process) from the costly part (relocating text and checks).
- Negative, to manage: during the transition the home is split (governance in `agent-plugins/standards/`, the Standard text still in `agent-skills-toolkit/`), which MUST be stated wherever the Standard is referenced until the relocation lands. The check extraction is non-trivial and remains queued.
- Follow-on (not in this landing): relocate `STANDARD.md` to `standards/STANDARD.md`; extract the generic conformance checks into `standards/checks/`; rewrite `CONTRIBUTING.md` thin (bind by version); add `library.json` to `pm-skills` and `writing-style-library` so they can pin the Standard; surface `standard` / `tier` in the registry.
- This ADR begins the Standard's own decision trail (0001), distinct from the `agent-skills-toolkit` plugin's ADRs (0020-0023), which remain that plugin's record and, where they shaped the Standard before this separation, stand as provenance.
