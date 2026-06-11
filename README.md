# Pattern First AI

> Turn human intent into executable patterns instead of repeatedly writing prompts or building uncontrolled loops.

## Why

AI workflows are increasingly dominated by:

* Bigger prompts
* Longer context windows
* More retries
* More loops
* More token consumption

This project explores an alternative.

Instead of optimizing prompts, we optimize **structure**.

Users express intent once.

The system extracts:

* objectives
* constraints
* invariants
* evaluation criteria
* state transitions

…and compiles them into reusable execution patterns.

---

## Core Idea

Traditional flow:

```text
Human
↓
Prompt
↓
LLM
↓
Output
```

Agent flow:

```text
Human
↓
Prompt
↓
Loop
↓
Evaluate
↓
Retry
↓
Output
```

Pattern-first flow:

```text
Human
↓
Formal Interview
↓
Pattern Compiler
↓
Pattern Runtime
↓
Output
```

Patterns become reusable assets.

---

## Principles

### 1. Prompts are authoring interfaces

Prompts are temporary.

Execution should run on structure.

---

### 2. State beats context

Persist decisions.

Avoid retransmitting knowledge.

---

### 3. Constraints outperform instructions

Define boundaries.

Allow execution freedom.

---

### 4. Compile once, execute repeatedly

Minimize repeated reasoning.

---

## Architecture

```text
acquisition/
↓
compiler/
↓
pattern/
↓
runtime/
↓
optimizer/
```

### Acquisition

Interview users.

Extract requirements.

### Compiler

Convert requirements into executable structure.

### Pattern

Store normalized execution plans.

### Runtime

Execute efficiently.

### Optimizer

Refine patterns over time.

---

## Example

Interview:

Q: What matters most?

A: Speed.

Q: What cannot fail?

A: Data integrity.

Q: Human review?

A: Optional.

Compiled:

```yaml
goal:
  generate_docs

constraints:
  latency: low
  retries: 1

invariants:
  preserve_structure

phases:
  analyze
  generate
  validate
```

Execute:

```bash
run pattern:generate_docs
```

---

## Pattern Spec

```yaml
version: 0.1

pattern:
  id:
  name:

intent:

constraints:

invariants:

memory:

phases:

evaluation:

runtime:
```

---

## Roadmap

### v0.1

* Pattern schema
* Interview engine
* YAML compiler

### v0.2

* Runtime executor
* Pattern metrics

### v0.3

* Pattern optimizer
* Compression

### v1.0

* Multi-runtime execution
* Visual editor
* Pattern marketplace

---

## Contributing

Do not submit prompts.

Submit patterns.
