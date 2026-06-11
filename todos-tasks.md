# 🎯 Todos & Feature Backlog: Pattern-First AI

> **Vision:** Turn human intent into executable patterns instead of repeatedly writing prompts or building uncontrolled loops.
> **Mission:** Transition the validated MVP pattern from a functional prototype into a production-ready, user-friendly platform with structured acquisition, compilation, runtime, and optimization layers.

---

## 🔷 Milestone 0: Repository Foundation & First Commit

**Goal:** Establish clean project roots, commit discipline, and push to origin.

| ID | Task | Status | Notes |
|---|---|---|---|
| 0.1 | Initialize git repo, configure `.gitignore` | ✅ Done | `.atl/`, `node_modules`, `files.zip`, `big-picture.md`, `redesign-thoughts.md`, `.memory/` excluded |
| 0.2 | Verify remote origin (`git@github.com:papajo/pattern-first.git`) | ✅ Done | |
| 0.3 | Clean up stray / duplicate files | ✅ Done | Removed `pattern.schema copy.json` |
| 0.4 | Organize file tree: `docs/`, `schemas/`, `patterns/` structure | 🔄 Revise | `lib/`, `examples/`, `docs/`, `templates/` created. `schemas/` and `patterns/` pending. |
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
| 1.10 | **[docs/from-idea-to-pattern.md] Pipeline walkthrough** | ✅ Done | — | Visual step-by-step: raw idea → interview → compiled pattern → execution → output. |

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

## 🔷 Milestone 8: Multi-Model Orchestration

**Goal:** Abstract execution backend so the same pattern runs on simulated, local, or remote LLMs.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 8.1 | **Provider abstraction layer** | ✅ Done | 2.2 | `lib/provider.js` — registerable providers with standard `runChecks()` interface |
| 8.2 | **Simulated provider** | ✅ Done | 8.1 | Deterministic local execution (default) |
| 8.3 | **`--provider` CLI flag** | ✅ Done | 8.1, 2.2 | Select provider at runtime |
| 8.4 | **`--list-providers` CLI flag** | ✅ Done | 8.1 | List available providers |
| 8.5 | **Ollama provider** | ☐ TODO | 8.1 | Local LLM execution via Ollama |
| 8.6 | **Provider comparison mode** | ☐ TODO | 8.1 | `--compare` — run same pattern on multiple providers side-by-side |
| 8.7 | **Provider config / API key management** | ☐ TODO | 8.1 | `.env` or config file for API keys |

---

## 🔷 Milestone 9: Intelligent Memory Systems

**Goal:** Give patterns session awareness — the runtime remembers past executions and improves over time.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 9.1 | **Session memory store** | ✅ Done | 2.2 | `lib/memory.js` — disk-backed JSON store tracking run history per keyword+location |
| 9.2 | **`--memory` CLI flag** | ✅ Done | 9.1, 2.2 | View run history for a keyword+location |
| 9.3 | **`--clear-memory` CLI flag** | ✅ Done | 9.1 | Clear all saved run history |
| 9.4 | **Auto-record runs** | ✅ Done | 9.1, 2.2 | Every `pattern-runner` execution records summary in memory |
| 9.5 | **Format: memory display** | ✅ Done | 9.1, 2.3 | `formatMemory()` — colored run history output |
| 9.6 | **Persistent phase memory** | ☐ TODO | 9.1, 5.2 | Carry forward named state keys between phases within a run |
| 9.7 | **Compressed memory strategy** | ☐ TODO | 9.6 | Summarize after N tokens (from schema) |

---

## 🔷 Milestone 10: Prompt Templates & Authoring

**Goal:** Provide fill-in-the-blank templates so users can create their own patterns without starting from scratch.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 10.1 | **Pattern starter template** | ✅ Done | — | `templates/pattern-starter.json` — blank pattern with field instructions |
| 10.2 | **Interview worksheet template** | ✅ Done | — | `templates/interview-notes.md` — fill-in-the-blank 5-act worksheet |
| 10.3 | **Research pattern template** | ✅ Done | — | `templates/pattern-research.json` — full working example |
| 10.4 | **Template registry / index** | ☐ TODO | 10.1-3 | `templates/index.json` listing available templates |
| 10.5 | **Template authoring guide** | ☐ TODO | 10.1-3 | How to create and contribute templates |

---

## 🔷 Milestone 11: Production Deployment & CI/CD

**Goal:** Make the project installable, distributable, and continuously tested.

| ID | Task | Status | Dependencies | Notes |
|---|---|---|---|---|
| 11.1 | **Package metadata** | ✅ Done | — | `package.json` with bin entry, description, repository |
| 11.2 | **`.gitignore` for runtime artifacts** | ✅ Done | — | Excludes `.memory/`, `.atl/`, `node_modules/` |
| 11.3 | **GitHub Actions CI** | ☐ TODO | — | Run `node pattern-runner --help` on push |
| 11.4 | **Dockerfile** | ☐ TODO | — | Containerized execution |
| 11.5 | **npm publish config** | ☐ TODO | 11.1 | Prepublish checks, version bump |
| 11.6 | **CHANGELOG.md** | ☐ TODO | — | Track releases |
| 11.7 | **Install script (one-liner)** | ☐ TODO | — | `curl ... | bash` or `brew` |

---

## 📊 Current Status

| Area | Status | Notes |
|---|---|---|
| Pattern schema (`pattern.schema.json`) | ✅ Defined | v0.1, covers intent, constraints, invariants, phases, evaluation, runtime |
| Interview method (`interview-method.md`) | ✅ Documented | 5-act interview structure |
| Worked example (`worked-example.md`) | ✅ Documented | Full API docs pattern lifecycle |
| From idea to pattern walkthrough | ✅ Done | `docs/from-idea-to-pattern.md` — visual pipeline guide |
| MVP validation (`pattern-schema-test-results.json`) | ✅ Validated | ProductResearchMVP with 7 falsifiability checks |
| **Feature analysis** | ✅ **Done** | `new-features.md` — 6-claim analysis with gaps and mapping |
| **CLI runner** | ✅ **Built** | `pattern-runner` with 3 output modes, constraint reports, provider abstraction, memory |
| **Provider abstraction** | ✅ **Built** | `lib/provider.js` — `simulated` provider built, pluggable architecture for future backends |
| **Session memory** | ✅ **Built** | `lib/memory.js` — disk-backed run history per keyword+location |
| **Templates** | ✅ **Created** | `templates/` with starter JSON, interview worksheet, research example |
| README + user-guide | ✅ Revised | Beginner workflow, CLI reference, all flags documented |
| Pattern library (`patterns/`) | ❌ Not started | Directory exists but empty |
| Compiler & Runtime | ❌ Not started | Core engine missing |
| Benchmarks | ❌ Not started | Credibility gap |
| CI/CD, Docker, publish | ❌ Not started | M11 pending |

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
provider/      ← pluggable execution backends (simulated, Claude, GPT, Ollama)
    ↓
runtime/       ← execute with invariants + memory
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

# See available providers
node pattern-runner --list-providers

# Check run history
node pattern-runner --keyword "Yoga Mat" --location "US" --memory

# Browse templates
ls templates/
```

---

*Last updated: 2026-06-11 — Major restructure: M8 (Multi-Model), M9 (Memory), M10 (Templates), M11 (Deployment) added. All 6 feature claims from new-features.md analyzed and gaps addressed.*
