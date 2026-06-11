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

- Git
- A CLI terminal
- (Coming soon) The Pattern-First CLI wrapper

### Installation

```bash
git clone git@github.com:papajo/pattern-first.git
cd pattern-first
```

### First Run

Once the CLI wrapper is built (see [Milestone 2](todos-tasks.md#-milestone-2-cli-wrapper--usability)):

```bash
pattern-runner --keyword "Wireless Charging Pad" --location "US"
```

The runner will:
1. Load the MVP Research pattern
2. Fetch Google Trends data
3. Run 7 falsifiability checks (Q1–Q7)
4. Output a ranked list of products that pass all checks

### Interpreting Results

| Output | Meaning |
|---|---|
| **Product list (ranked)** | Products that passed all 7 checks |
| **"No product met criteria"** | Every product failed at least one check. See Constraint Report for why. |
| **Constraint Report** | Identifies the most restrictive criterion and suggests adjustments. |

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
docs/           ← Documentation (interview method, worked example, user guide)
schemas/        ← JSON schemas for patterns, interviews, and runtime
patterns/       ← Reusable pattern definitions
examples/       ← Ready-to-run usage templates
```

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

A: Not directly. You go through the interview (a structured conversation). The compiler produces the pattern. A future CLI wrapper will hide all JSON from end users.

**Q: Can I export back to a prompt?**

A: Yes. The `runtime.export_as_prompt` field tells the runtime it can serialize the pattern into a prompt string for tools that don't support structured execution.

**Q: What should never become a pattern?**

A: One-off tasks. Unstable/exploratory work. Tasks where you don't yet know what "done" means. The interview overhead pays off only for repeated execution.

---

## Next Steps

1. Read the [Interview Method](docs/interview-method.md) to understand the 5-act process
2. Study the [Worked Example](docs/worked-example.md) to see a full pattern lifecycle
3. Check [todos-tasks.md](todos-tasks.md) for the current development milestone
4. Watch for the CLI wrapper release (Milestone 2)

---

*Pattern-First AI — Turn conversations into executable patterns.*
