# 🎯 Todos & Feature Backlog: Pattern-First AI

> **Vision:** Turn human intent into executable patterns instead of repeatedly writing prompts or building uncontrolled loops.
> **Mission:** Transition the validated MVP pattern from a functional prototype into a production-ready, user-friendly platform with structured acquisition, compilation, runtime, and optimization layers.

---

## 🔷 Milestone 0: Repository Foundation & First Commit

**Goal:** Establish clean project roots, commit discipline, and push to origin.

| ID | Task | Status | Notes |
|---|---|---|---|
| 0.1 | Initialize git repo, configure `.gitignore` | ✅ Done | `.atl/`, `node_modules`, `files.zip`, `big-picture.md`, `redesign-thoughts.md` excluded |
| 0.2 | Verify remote origin (`git@github.com:papajo/pattern-first.git`) | ✅ Done | |
| 0.3 | Clean up stray / duplicate files | ✅ Done | Removed `pattern.schema copy.json` |
| 0.4 | Organize file tree: `docs/`, `schemas/`, `patterns/` structure | 🔄 Revise | `lib/`, `examples/`, `docs/` created. `schemas/` and `patterns/` pending. |
| 0.5 | **First commit + push** — project scaffold + core docs | ✅ DONE | Commit `638e79c` |

---

## 🔷 Milestone 1: Documentation & Onboarding (The "Beginner" View)

**Goal:** Make the system understandable and accessible to users who are not prompt engineers.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 1.1 | **[README.md] High-Level Guide** | ✅ Done | — | Focus on *workflow*, not code. 3-Step Workflow at top, CLI demo, simplified language. |
| 1.2 | **[README.md] Conceptual Flowchart** | ✅ Done | 1.1 | Mermaid diagram: Input → 7 Falsifiability checks → Pass/Reject. |
| 1.3 | **[user-guide.md] Expand into real user guide** | ✅ Done | 1.0 | Expanded with CLI reference, output formats, FAQ. |
| 1.4 | **[docs/interview-method.md] Finalize as standalone doc** | 🔄 Revise | — | Already exists. Linked from README. |
| 1.5 | **[docs/worked-example.md] Finalize as standalone doc** | 🔄 Revise | — | Already exists. Linked from README. |
| 1.6 | **[docs/test-run-deploy.md] Finalize as standalone doc** | 🔄 Revise | — | Already exists. |
| 1.7 | **Answer the "30 skeptical questions"** | ☐ TODO | 1.0 | `big-picture.md` contains 30 critical questions. Each needs a documented answer. |
| 1.8 | **CONTRIBUTING.md** | ☐ TODO | 1.1 | Guidelines: submit patterns, not prompts. |
| 1.9 | **CHANGELOG.md** | ☐ TODO | 1.0 | Track changes from the start. |
| 1.10 | **✨ [docs/from-idea-to-pattern.md] Pipeline walkthrough** | ✅ Done | — | Visual step-by-step: raw idea → interview → compiled pattern → execution → output. |

**30 Skeptical Questions Reference** (`big-picture.md`):
- Categories: Is this new? (Q1-5), Does it reduce cost? (Q6-9), Pattern behavior (Q10-15), Adoption friction (Q16-19), Trust/failure (Q20-25), Uncomfortable truths (Q26-30).
- Each question should eventually have a documented answer in `docs/` or in the relevant artifact.

---

## 🔷 Milestone 2: CLI Wrapper & Usability (The User Experience)

**Goal:** Abstract away technical complexity of the JSON contract — no user should ever edit a schema file directly.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 2.1 | **Design CLI interface contract** | ✅ Done | 1.1 | Flags defined: `--keyword`, `--location`, `--pattern`, `--format`, `--verbose`, `--help`, `--list-patterns` |
| 2.2 | **Build thin CLI wrapper** (Node.js, zero deps) | ✅ Done | 2.1 | `pattern-runner` executable + `lib/` modules (cli, checks, seed-data, formatter, pattern-loader) |
| 2.3 | **CLI output formatting** | ✅ Done | 2.2 | Three modes: table (ANSI-colored), verbose (per-check), JSON (machine-readable) |
| 2.4 | **Template / example files** | ✅ Done | 2.2 | `examples/` with 4 ready-to-run scripts |
| 2.5 | **Install script** | ☐ TODO | 2.2 | One-command setup (brew / npm / pip). For now: clone + `ln -s` |

---

## 🔷 Milestone 3: Pattern Infrastructure & Versioning (The "Developer" View)

**Goal:** Prepare the system for multiple patterns, versioned contracts, and architectural growth.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 3.1 | **Add `version` field to pattern schema** | ☐ TODO | — | `"version": "0.1"` root field. Process for creating new versions. |
| 3.2 | **Restructure repo into pattern library** | ☐ TODO | 3.1 | Move current file to `patterns/mvp_research_v1.0.json`. CLI `--pattern` flag already supports this. |
| 3.3 | **Formalize pattern.schema.json (v0.1)** | 🔄 Revise | — | Schema exists. Review for completeness. |
| 3.4 | **Create `schemas/interview.schema.json`** | ☐ TODO | 3.3 | Schema for interview.yaml output. |
| 3.5 | **Create `schemas/runtime.schema.json`** | ☐ TODO | 3.3 | Schema for runtime execution config. |
| 3.6 | **Establish pattern lifecycle docs** | ☐ TODO | 3.3 | How to create, version, deprecate, and archive patterns. |
| 3.7 | **Remove duplicate `pattern.schema copy.json`** | ✅ Done | — | Cleaned up in M0.3. |

---

## 🔷 Milestone 4: Operational Intelligence (The "Refinement" View)

**Goal:** Turn simple failures into actionable insights — the pattern doesn't just fail, it explains *why*.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 4.1 | **Automated failure analysis in CLI** | ✅ Done | 2.2, 3.3 | Implemented in `lib/checks.js` — identifies most restrictive criterion |
| 4.2 | **Constraint Report output** | ✅ Done | 4.1 | Displayed in table output: criterion, failure count, average actual, suggestion |
| 4.3 | **Execution trace log** | ☐ TODO | 3.3 | Per-phase log: which invariants checked, which passed/failed, how long each phase took. |
| 4.4 | **Pattern metrics collector** | ☐ TODO | 3.3, 4.3 | Track: tokens consumed, latency, retries, success rate, constraint violation frequency. |

---

## 🔷 Milestone 5: Compiler & Runtime (The Engine Room)

**Goal:** Build the core machinery — acquisition (interview) → compiler → pattern → runtime → optimizer.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 5.1 | **Compiler: interview → pattern** | ☐ TODO | 1.4, 3.3 | Convert `interview.yaml` → `pattern.yaml`. Validate constraints, resolve contradictions. |
| 5.2 | **Runtime executor** | ☐ TODO | 2.2, 3.3 | Execute compiled patterns phase-by-phase. Enforce invariants at checkpoints. |
| 5.3 | **Runtime memory manager** | ☐ TODO | 5.2 | Handle stateless, session, persistent, compressed strategies. |
| 5.4 | **Phase-level rerun support** | ☐ TODO | 5.2 | User can redo one section without full rerun. |
| 5.5 | **Human review workflow** | ☐ TODO | 5.2 | Approve / reject-section / reject-all workflow. |
| 5.6 | **Multi-runtime support** | ☐ TODO | 5.2 | Compatible with: Claude Code, Cursor, local Ollama. |

---

## 🔷 Milestone 6: Pattern Library & Ecosystem (The "Platform" View)

**Goal:** The repo holds many curated patterns. Users browse, pick, and run — or author their own.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 6.1 | **Structure `patterns/` directory** | ☐ TODO | 3.2 | Subdirs: `default/`, `generated/`, `curated/` |
| 6.2 | **MVP Research Pattern** `patterns/default/mvp_research_v1.0.json` | ☐ TODO | 3.2 | Migrate from root. |
| 6.3 | **Competitor Analysis Pattern** | ☐ TODO | 6.1 | Second pattern: competitive weakness analysis. |
| 6.4 | **Market Sizing Pattern** | ☐ TODO | 6.1 | Third pattern: geographic trend + market size estimation. |
| 6.5 | **Pattern registry / index** | ☐ TODO | 6.1 | `patterns/index.json` listing available patterns with metadata. |
| 6.6 | **Pattern search by tag** | ☐ TODO | 6.5 | `--tag docs`, `--tag research` filtering in CLI. |

---

## 🔷 Milestone 7: Benchmark & Optimization (The "Credibility" View)

**Goal:** Prove the pattern-first approach with numbers. Answer Q6-Q9 from the skeptical questions.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 7.1 | **Establish benchmark methodology** | ☐ TODO | 5.2 | What we measure: tokens, latency, retries, quality score, pattern reuse frequency. |
| 7.2 | **Prompt vs. Loop vs. Pattern benchmark** | ☐ TODO | 7.1, 5.2 | Same task executed 3 ways. Measure all 5 metrics. |
| 7.3 | **Pattern compression optimizer** | ☐ TODO | 7.2 | Reduce pattern size via token dedup, invariant consolidation. |
| 7.4 | **Pattern drift detection** | ☐ TODO | 7.2 | Detect when pattern output quality degrades across runs. |
| 7.5 | **Pattern evolution / distillation** | ☐ TODO | 7.3 | When a pattern stabilizes, distill into a smaller model. |

---

## 📊 Current Status

| Area | Status | Notes |
|---|---|---|
| Pattern schema (`pattern.schema.json`) | ✅ Defined | v0.1, covers intent, constraints, invariants, phases, evaluation, runtime |
| Interview method (`interview-method.md`) | ✅ Documented | 5-act interview structure |
| Worked example (`worked-example.md`) | ✅ Documented | Full API docs pattern lifecycle |
| **From idea to pattern walkthrough** | ✅ **NEW** | `docs/from-idea-to-pattern.md` — visual pipeline guide |
| MVP validation (`pattern-schema-test-results.json`) | ✅ Validated | ProductResearchMVP with 7 falsifiability checks |
| Test run (`test-run-deploy.md`) | ✅ Documented | Full conversation history |
| Repository initialization | ✅ Done | Git remote set, `.gitignore` ready |
| **README.md** | ✅ **Revised** | Beginner workflow, "Start Here" section, Mermaid flowchart, CLI demo |
| **user-guide.md** | ✅ **Expanded** | CLI reference, output formats, FAQ |
| **CLI wrapper (`pattern-runner`)** | ✅ **BUILT** | Zero-dependency Node.js, 3 output modes, constraint reports |
| **Example scripts** | ✅ **CREATED** | 4 ready-to-run examples in `examples/` |
| Pattern library structure (`patterns/`) | ❌ Not started | `patterns/` directory |
| Compiler & Runtime | ❌ Not started | Core engine missing |
| Benchmarks | ❌ Not started | Credibility gap |

---

## 🧭 Guiding Principles

1. **Prompts are authoring interfaces** — Execution should run on structure, not text.
2. **State beats context** — Persist decisions. Avoid retransmitting knowledge.
3. **Constraints outperform instructions** — Define boundaries. Allow execution freedom.
4. **Compile once, execute repeatedly** — Minimize repeated reasoning.
5. **Patterns are the product** — The interview is the factory. Submit patterns, not prompts.

---

## 📐 Architecture Reference

```
acquisition/   ← interview method, goal extraction
    ↓
compiler/      ← interview.yaml → pattern.yaml
    ↓
pattern/       ← normalized execution plans (versioned)
    ↓
runtime/       ← execute, checkpoint, enforce invariants
    ↓
optimizer/     ← compress, benchmark, evolve patterns
```

---

## ⚡ Quick Start for Contributors

```bash
# Clone & explore
git clone git@github.com:papajo/pattern-first.git
cd pattern-first

# Start here — understand the pipeline
cat docs/from-idea-to-pattern.md

# Then run the CLI
node pattern-runner --keyword "Your Idea" --location "US"

# Or use an example script
bash examples/run-wireless-charging-pad.sh
```

---

*Last updated: 2026-06-11 — Added from-idea-to-pattern.md walkthrough. M1 (docs) and M2 (CLI) complete. M4 (constraint reports) also done.*
