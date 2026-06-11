# From Idea to Pattern: A Step-by-Step Walkthrough

> Most dev teams start with a thought, a Slack message, or a half-baked prompt.
> **That is exactly where every pattern in this repo began.**

This guide walks through the full transformation pipeline — from a vague idea in your head to a compiled, executable, reusable pattern. You'll see exactly how the raw material (human intent) moves through each stage and what comes out the other side.

We'll use the **Product Research MVP** pattern (already in this repo) as our running example.

---

## The Pipeline at a Glance

```
┌──────────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐    ┌───────────┐
│  IDEA    │ →  │INTERVIEW │ →  │ PATTERN │ →  │ RUNTIME  │ →  │  OUTPUT   │
│ "I need  │    │ (extract │    │ (compiled│    │ (execute)│    │ (ranked   │
│  to..."  │    │  intent) │    │  schema) │    │          │    │  results) │
└──────────┘    └──────────┘    └─────────┘    └──────────┘    └───────────┘
     ▲               ▲               ▲               ▲               ▲
     │               │               │               │               │
  What you      What you        What the        What the        What you
  start with     uncover         compiler        runtime         actually
                                produces        runs           get back
```

---

## Step 0: You Have an Idea

It starts as something vague. Maybe a Slack message:

> "Hey, can we find good products to sell online? Like, underserved niches?"

Or a prompt you've been tweaking:

> *"Act as a product researcher. Find me products with high demand and low competition..."*

This is fine. **This is where every pattern starts.** The question isn't "is my idea polished enough?" — it's "can I extract structure from it?"

**Your input:** A goal, a domain, some intuition.

---

## Step 1: The Interview — Extract Structure from Intent

This is the **key step** that separates patterns from prompts. Instead of writing instructions for an AI, you have a structured conversation with yourself (or your team) that surfaces the implicit knowledge baked into your idea.

### Act 1 — Goal Extraction

> **Question:** In one sentence — what does this need to produce?

```
Vague answer:   "I need to find products."
→ Push for the real output.

Falsifiable:    "Produce a list of keywords and a matching list of
                ranked products that meet all defined success criteria."
```

This becomes the pattern's `intent.goal`.

### Act 2 — Success Definition

> **Question:** What does "done" look like? What would make you reject it?

This is where vague criteria become **falsifiable checks**:

| Vague | Falsifiable |
|---|---|
| "Good demand" | Search volume > 5,000/month (Q2) |
| "Not too competitive" | Competition count < 5 (Q4) |
| "Profitable" | Profit margin > 30% (Q5) |
| "Room to grow" | Review volume < 50 (Q7) |

Each check has a **hard number**. No subjectivity. No "it depends."

### Act 3 — Constraint Discovery

> **Question:** What are the hard limits?

```
Data source:   Google Trends (not Amazon, not internal data)
Input needed:  A keyword and a geographic location
Output format: A ranked list (not a narrative report)
```

### Act 4 — Invariant Elicitation

> **Question:** What must always be true, no matter what?

```
Every result must be backed by a measurable metric.
No subjective ratings. If you can't measure it, it doesn't pass.
```

### Act 5 — Contradiction Resolution

> **Question:** Where are the trade-offs?

```
"I want products with high demand AND low competition" →
These pull in opposite directions. Accept that the sweet spot is narrow.
Set thresholds that reflect the real trade-off.
```

### Interview Output

After the 5 acts, you have structured data ready for the compiler:

```yaml
intent:
  goal: "Produce a list of keywords and ranked products"
  success_criteria:
    - { metric: "Market Share", condition: ">", value: 50% }
    - { metric: "Search Volume", condition: ">", value: 5,000 }
    - { metric: "Score", condition: "<", value: 10 }
    - { metric: "Competition Count", condition: "<", value: 5 }
    - { metric: "Profit Margin", condition: ">", value: 30% }
    - { metric: "Keyword Saturation", condition: "<", value: 3 }
    - { metric: "Review Volume", condition: "<", value: 50 }
  constraints:
    data_access: ["Google Trends"]
    required_inputs: ["starting keyword", "geographic location"]
```

---

## Step 2: The Compiled Pattern — Structure Becomes Executable

The interview output is compiled into a **machine-readable contract** — the pattern. This is the reusable asset.

```json
{
  "name": "ProductResearchMVP",
  "intent": {
    "goal": "Produce a list of keywords and a matching list of ranked products...",
    "success_criteria": [
      { "id": "Q1", "metric": "Market Share",
        "condition": "must be greater than", "value": 0.50 },
      { "id": "Q2", "metric": "Search Volume",
        "condition": "must be greater than", "value": 5000 },
      // ... 5 more criteria
    ]
  },
  "constraints": {
    "data_access": ["Google Trends"],
    "required_inputs": ["starting keyword", "geographic location"]
  }
}
```

**This is the file that lives in the repo.** It's the pattern. Not a prompt. Not a script. A compiled decision structure.

---

## Step 3: Runtime Execution — The Pattern Runs

The pattern file is loaded by the runtime (in our case, the `pattern-runner` CLI). You provide the runtime inputs:

```bash
node pattern-runner --keyword "Wireless Charging Pad" --location "US"
```

Behind the scenes:

```
┌─────────────────────────────────────────────────────────┐
│ 1. LOAD pattern from pattern-schema-test-results.json   │
│ 2. GENERATE simulated market data for keyword+location  │
│ 3. RUN each product through all 7 checks                │
│ 4. COLLECT results: pass/fail per product, per check   │
│ 5. IDENTIFY most restrictive constraint                 │
│ 6. FORMAT output (table/verbose/JSON)                   │
└─────────────────────────────────────────────────────────┘
```

---

## Step 4: The Output — Results You Can Act On

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pattern-First AI — Product Research Runner
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Keyword:  Wireless Charging Pad
Location: US
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Results — 5 of 10 products passed all 7 checks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Products that PASSED
  Pro Wireless Charging Pad    ★ Pass: 7/7
  Wireless Charging Pad Max    ★ Pass: 7/7
  ...

❌ Products that FAILED
  Eco Wireless Charging Pad    ✗ Failed 4/7 checks
    First failure: Q1 (Market Share: 32% must be > 50%)

📊 Constraint Report
  Most restrictive: Q4 (Competition Count must be < 5)
  Failed: 8 product(s) | Average actual: 8.9
  💡 Consider decreasing the Competition Count threshold...
```

The pattern doesn't just give you a yes/no. It tells you **what blocked what** and **how to adjust**.

---

## Step 5: Reuse — Run Again, No Re-Prompting

Same pattern. Different input. Run it again.

```bash
node pattern-runner --keyword "Yoga Mat" --location "DE"
node pattern-runner --keyword "Coffee Maker" --location "US" --verbose
node pattern-runner --keyword "Smart Lighting" --location "UK" --format json
```

**The pattern remembers your decisions.** The thresholds. The success criteria. The constraints. You don't re-explain anything. You just run.

Compare with a prompt-based approach:

| | Prompt | Pattern |
|---|---|---|
| Setup time | 5-10 min rewriting each time | Done once (interview) |
| Run consistency | Variable | Same structure every time |
| New keyword | Rewrite or retry | `--keyword "X"` |
| Debugging | Guess and retry | Constraint Report tells you why |
| Team reuse | Email the prompt | Commit the pattern |

---

## The Full Transformation

```
You have:           "I want to find good products to sell."
                          ↓
You interview:      5 acts → surface goal, checks, constraints
                          ↓
You compile:        pattern-schema-test-results.json
                    (a reusable, executable contract)
                          ↓
You run:            node pattern-runner --keyword "X" --location "US"
                          ↓
You get:            Ranked products that passed all 7 checks
                    + Constraint Report on what failed and why
```

**Start with whatever you have.** A thought. A Slack message. A prompt that sort-of works. The method is the same: extract the structure, compile it, run it, reuse it.

---

## Try It Yourself

### If you have a prompt

Pick any prompt you've been iterating on. Run it through the 5 interview acts:

1. **Goal** — What does this need to produce? (one sentence)
2. **Success** — What does done look like? (falsifiable criteria)
3. **Constraints** — What are the hard limits? (data sources, latency, review)
4. **Invariants** — What must always be true? (non-negotiables)
5. **Contradictions** — Where are the trade-offs? (resolve them now)

If you can answer all five, you have a pattern waiting to be compiled.

### If you just have an idea

Start with Act 1 (Goal Extraction) from the [Interview Method](interview-method.md). One question: "In one sentence — what does this need to produce?" That's enough to begin.

### If you just want to see it work right now

```bash
git clone git@github.com:papajo/pattern-first.git
cd pattern-first
node pattern-runner --keyword "Your Idea" --location "US"
```

---

## Further Reading

- [Interview Method](interview-method.md) — The 5-act structured conversation
- [Worked Example](worked-example.md) — Full lifecycle from prompt to pattern to execution
- [User Guide](user-guide.md) — CLI reference, output formats, FAQ
- [Pattern Schema](pattern.schema.json) — The machine-readable contract
- [Backlog & Roadmap](todos-tasks.md) — What's coming next

---

*Pattern-First AI — Turn conversations into executable patterns.*
