# User Guide: Pattern-First AI

> **Status:** Active Development — This guide will grow alongside the project. See `todos-tasks.md` for the current milestone.

---

## What is Pattern-First AI?

Pattern-First AI is a methodology and toolset for turning human intent into **reusable execution patterns** — replacing fragile, one-shot prompts with structured, auditable, repeatable decision processes.

Instead of asking "what prompt should I write?", you ask:

> "What execution pattern should I compile?"

---

## Core Concepts

### The Pattern

A pattern is a machine-readable contract that encodes:

- **Intent** — What you want to accomplish (single goal, falsifiable success criteria)
- **Constraints** — Hard limits (latency, retries, output format, human review)
- **Invariants** — Non-negotiable rules that must be true at every phase
- **Phases** — Discrete execution stages with defined inputs, outputs, and transitions
- **Evaluation** — How success is measured (automated rubric, human review, or hybrid)

### The Interview

Before a pattern is compiled, the **interview** surfaces implicit knowledge:

1. **Goal Extraction** — What does this need to produce?
2. **Success Definition** — What does "done" look like?
3. **Constraint Discovery** — What are the hard limits?
4. **Invariant Elicitation** — What must always be true?
5. **Contradiction Resolution** — Where are the trade-offs?

### The Lifecycle

```
Interview → Compile → Pattern → Execute → Evaluate → Optimize
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18 (check with `node --version`)
- Git
- A CLI terminal

### Installation

```bash
git clone git@github.com:papajo/pattern-first.git
cd pattern-first
```

No npm install needed — the CLI uses zero dependencies (Node.js core modules only).

### First Run

```bash
node pattern-runner --keyword "Wireless Charging Pad" --location "US"
```

The runner will:
1. Load the MVP Research pattern from `pattern-schema-test-results.json`
2. Generate simulated product data (Google Trends proxy)
3. Run 7 falsifiability checks (Q1–Q7) against each product
4. Output ranked results: passing products first, then failures with a constraint report

### Quick Examples

```bash
# Simple research query
node pattern-runner --keyword "Yoga Mat" --location "DE"

# Verbose mode — shows every check for every product
node pattern-runner --keyword "Coffee Maker" --location "US" --verbose

# JSON output — machine-readable for piping into other tools
node pattern-runner --keyword "Smart Lighting" --location "US" --format json

# Help
node pattern-runner --help
```

### Using the Example Scripts

Pre-built examples are in the `examples/` directory:

```bash
bash examples/run-wireless-charging-pad.sh
bash examples/run-yoga-mat.sh
bash examples/run-verbose.sh
bash examples/run-json-output.sh
```

---

## CLI Reference

### Usage

```
pattern-runner --keyword <keyword> [options]
```

### Required

| Flag | Alias | Description |
|---|---|---|
| `--keyword` | `-k` | Starting keyword for product research |

### Options

| Flag | Alias | Default | Description |
|---|---|---|---|
| `--location` | `-l` | `US` | Geographic market to research |
| `--pattern` | `-p` | `pattern-schema-test-results.json` | Pattern file name or path |
| `--format` | `-f` | `table` | Output format: `table` (default) or `json` |
| `--verbose` | `-v` | off | Show per-check detail for every product |
| `--help` | `-h` | — | Show usage help |
| `--list-patterns` | — | — | List available pattern files in `patterns/` |

### Exit Codes

| Code | Meaning |
|---|---|
| 0 | At least one product passed all checks |
| 1 | No products passed — all failed |

---

## Understanding the Output

### Default (Table) Output

The standard report shows:

1. **Header** — Pattern name, keyword, location, data source
2. **Summary** — Count of passing vs. total products
3. **Passed products** — Each with all 7 metrics and check result icons
4. **Failed products** — Each with failure count and first failure reason
5. **Constraint Report** — Most restrictive criterion, how many products failed it, average actual value, and a suggestion for adjusting the threshold

### Verbose Output

Includes everything in the table output **plus** a per-check detail section listing every check (pass or fail) for every product with actual and threshold values.

### JSON Output

Machine-readable payload with:

```json
{
  "runner": "pattern-first-ai",
  "version": "0.1.0",
  "keyword": "Wireless Charging Pad",
  "location": "US",
  "timestamp": "2026-06-11T...",
  "summary": { "total": 10, "passedCount": 4, "failedCount": 6, "passedRate": 40 },
  "constraintReport": { ... },
  "products": {
    "passed": [{ "id": "P001", "name": "...", "metrics": { ... } }],
    "failed": [{ "id": "P002", "name": "...", "firstFailure": "Q1", ... }]
  }
}
```

---

## Interpreting Results

| Output | Meaning |
|---|---|
| **Product list (ranked)** | Products that passed all 7 checks |
| **All products failed** | Every product failed at least one check. The Constraint Report identifies the most restrictive criterion and suggests adjustments. |
| **Constraint Report** | Shows which criterion blocked the most products, their average metric value, and a suggestion for threshold tuning. |

---

## The 7 Falsifiability Checks (MVP Research Pattern)

| ID | Metric | Pass Condition | Why It Matters |
|---|---|---|---|
| Q1 | Market Share | > 50% | Ensures the product isn't too niche |
| Q2 | Search Volume | > 5,000 | Sufficient demand exists |
| Q3 | Score | < 10 | Low competition score |
| Q4 | Competition Count | < 5 | Few direct competitors |
| Q5 | Profit Margin | > 30% | Viable margins |
| Q6 | Keyword Saturation | < 3 | Ranking opportunities exist |
| Q7 | Review Volume | < 50 | Untapped market (not oversaturated) |

---

## Architecture Overview

```
pattern-runner       ← Executable CLI (Node.js, zero deps)
lib/
  cli.js            ← Argument parsing
  pattern-loader.js ← Pattern file loading & validation
  runner.js         ← (embedded in pattern-runner) Main orchestration
  checks.js         ← Falsifiability check engine
  seed-data.js      ← Deterministic mock product data generator
  formatter.js      ← Output formatting (table, verbose, JSON)
examples/           ← Ready-to-run usage scripts
patterns/           ← Reusable pattern definitions
```

---

## Customizing the Pattern

The default pattern is `pattern-schema-test-results.json` in the project root. You can:

- Edit the success criteria thresholds directly in the JSON file
- Create new pattern files in the `patterns/` directory and select them with `--pattern`
- Run `node pattern-runner --list-patterns` to see available patterns

**Note:** The CLI uses simulated data for now. When real data sources are integrated, the pattern execution logic remains the same — only the data source changes.

---

## Contributing

Read the docs first. Understand the methodology. Then:

1. Run an interview on your task
2. Compile into a pattern
3. Submit the pattern — not a prompt

See `CONTRIBUTING.md` (coming soon) for details.

---

## FAQ

**Q: Is this just a fancy prompt template system?**

A: No. Prompts are text that must be re-explained every run. Patterns are compiled decision structures with encoded invariants, constraints, and evaluation criteria. The key difference: invariants are non-negotiable rules checked at runtime, not suggestions in a prompt.

**Q: Do I need to write JSON?**

A: Not directly. You go through the interview (a structured conversation). The compiler produces the pattern. The CLI runner abstracts the JSON — you just provide a keyword and location.

**Q: Is the data real or simulated?**

A: Currently simulated. The CLI generates deterministic mock data based on your keyword and location. The seed is reproducible: same keyword + location always produces the same products. Real data source integration (Google Trends API, etc.) is a future milestone.

**Q: Can I export back to a prompt?**

A: Yes. The `runtime.export_as_prompt` field in the schema tells the runtime it can serialize the pattern into a prompt string for tools that don't support structured execution.

**Q: What should never become a pattern?**

A: One-off tasks. Unstable/exploratory work. Tasks where you don't yet know what "done" means. The interview overhead pays off only for repeated execution.

---

## Next Steps

1. Read the [Interview Method](docs/interview-method.md) to understand the 5-act process
2. Study the [Worked Example](docs/worked-example.md) to see a full pattern lifecycle
3. Try the CLI: `node pattern-runner --keyword "Your Keyword" --location "US"`
4. Check [todos-tasks.md](todos-tasks.md) for the current development milestone

---

*Pattern-First AI — Turn conversations into executable patterns.*
