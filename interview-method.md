# Interview Method

> The interview is not a form. It is a structured conversation designed to surface what the user actually needs — including the parts they haven't articulated yet.

---

## Why interview at all?

When a prompt-based thinker wants an AI to do something, they write instructions.

The problem: instructions describe *what to do*, not *why it matters*, *what can't be compromised*, or *what done looks like*. Every time the task runs, all of that implicit knowledge has to be re-transmitted — or re-assumed.

The interview captures that implicit knowledge once.

The compiler turns it into a pattern.

The pattern runs as many times as needed without re-asking.

---

## The prompt thinker's translation map

Before walking through the method, here is the mental shift:

| Prompt thinking | Pattern thinking |
|---|---|
| "Write instructions for the AI" | "Extract structure from my intent" |
| "Give it context each time" | "Encode context once into the pattern" |
| "Tell it what to do" | "Tell it what must be true" |
| "Retry if it goes wrong" | "Define what wrong means before running" |
| "The prompt is the product" | "The pattern is the product" |
| "I own the text" | "I own the decision structure" |

The interview is how you make that shift.

---

## Interview structure

Every interview has five acts. They always run in this order.

```
Act 1 — Goal extraction
Act 2 — Success definition
Act 3 — Constraint discovery
Act 4 — Invariant elicitation
Act 5 — Contradiction resolution
```

The output of all five acts is a normalized `interview.yaml` that the compiler can consume.

---

## Act 1 — Goal extraction

**Purpose:** Get the single, unambiguous goal this pattern must accomplish.

**The problem with skipping this:** Most users open with *how* they want to accomplish something, not *what* they actually need. The interview surfaces the real goal.

**Questions to ask:**

```
1. In one sentence — what does this need to produce?
2. Who receives the output? What do they do with it?
3. Why does this matter right now?
```

**Compiler signal:** The goal field in `intent.goal` must be a single declarative sentence. If the user gives two goals, that's two patterns.

**Common failure:** User gives a method, not a goal.

```
Bad:  "I want it to search the web and summarize results."
Good: "I need a competitive analysis brief I can share with stakeholders."
```

The interviewer's job is to keep asking "what do you need to *have* at the end?" until the answer is a noun phrase, not a verb phrase.

---

## Act 2 — Success definition

**Purpose:** Define done in falsifiable terms. Not vibes. Observables.

**The problem with skipping this:** "Good output" means different things to different people. Without explicit success criteria, the runtime has no evaluation target and the user has no acceptance test.

**Questions to ask:**

```
4. What does the output look like when it's exactly right?
5. Who needs to be able to use it? What would they do with it?
6. What would make you reject the output immediately?
7. Is there an existing example you'd point at and say "like this"?
```

**Compiler signal:** Answers to question 4–6 map directly to `intent.success_looks_like` and `intent.failure_looks_like`. These are the evaluation rubric.

**The anti-vague rule:** Every success criterion must be falsifiable. Push back on anything subjective.

```
Vague:    "It should be clear and professional."
Falsifiable: "A developer with no prior context can follow it without asking questions."

Vague:    "It should cover everything."
Falsifiable: "Every public method is documented with at least one example."
```

---

## Act 3 — Constraint discovery

**Purpose:** Find the hard limits. Things that, if violated, make the output unusable regardless of quality.

**The problem with skipping this:** Without constraints, the runtime optimizes freely — which means it will optimize for the wrong things.

**Questions to ask:**

```
8.  How fast does this need to run? Is latency critical?
9.  How many times will you run this per day / week?
10. Are there things the output must never include?
11. Does a human need to review before it goes anywhere?
12. Is there a format requirement? Length limit? Language?
13. What existing tools does this need to work with?
```

**Compiler signal:** Answers map to `constraints`. Every constraint is a hard limit — not a preference. If the user says "ideally it's short," that's a preference, not a constraint. If they say "it must fit in a Slack message," that's a constraint.

**Token budget note:** Question 9 (run frequency) unlocks the ROI calculation. A task run once per year does not justify a complex pattern. A task run 50 times a week almost certainly does.

---

## Act 4 — Invariant elicitation

**Purpose:** Find the non-negotiables. Properties that must be true at every stage, regardless of what the runtime does.

**This is the most important act.** Invariants are what separates patterns from prompts. A prompt can drift. An invariant cannot.

**The prompt thinker's translation:** Invariants are the things you'd catch in a review and say "this is wrong even though the instructions didn't explicitly say not to do this."

**Questions to ask:**

```
14. What is the one thing that, if wrong, makes everything else irrelevant?
15. Are there any rules that cannot be broken no matter what?
16. Have you ever gotten output that looked right but was actually unusable? What was wrong with it?
17. What would make you immediately distrust the output before even reading it?
```

**Compiler signal:** Each invariant becomes an entry in `invariants[]`. Every invariant has an `id`, a `description` (plain language), a `check` time (pre-phase, post-phase, or continuous), and an `on_violation` action (halt, warn, or rollback).

**Examples from real interviews:**

```
"Never include internal Jira ticket numbers in external documentation."
→ invariant: check post-phase, on_violation: halt

"Code examples must compile without modification."
→ invariant: check post-phase, on_violation: rollback

"Output language must match input language."
→ invariant: check continuous, on_violation: halt
```

---

## Act 5 — Contradiction resolution

**Purpose:** Surface and resolve conflicts in the requirements before compilation. A pattern with unresolved contradictions will fail unpredictably at runtime.

**The problem with skipping this:** Users routinely express contradictory requirements without realizing it. If these aren't resolved in the interview, the runtime will resolve them arbitrarily — usually in the wrong direction.

**Standard contradiction patterns:**

```
Speed vs. quality
"I need it fast" + "every detail must be perfect"
→ Ask: which one do you optimize for when they conflict?

Coverage vs. brevity
"Cover everything" + "keep it short"
→ Ask: what's the minimum viable coverage? What can be cut?

Automation vs. control
"Run without me" + "I want to review before it goes out"
→ Ask: review every time, or only when something looks off?

Creativity vs. consistency
"Be creative" + "match our style guide"
→ Ask: where does the style guide apply strictly vs. as a default?
```

**Compiler signal:** Resolved contradictions become explicit entries in `constraints.custom` or phase-level `transitions`. Unresolved contradictions block compilation.

**The resolution rule:** The user must choose. The interviewer never resolves contradictions on behalf of the user. The pattern must reflect real decisions, not assumed trade-offs.

---

## Interview output format

The raw interview produces an `interview.yaml`:

```yaml
interview:
  id: "int-2024-001"
  conducted_at: "2024-01-15T14:30:00Z"
  duration_minutes: 12

  raw_responses:
    - question_id: 1
      question: "In one sentence — what does this need to produce?"
      answer: "A Markdown doc that explains every public API endpoint."

    - question_id: 4
      question: "What does the output look like when it's exactly right?"
      answer: "A junior dev can onboard using only this doc. No back-and-forth."

    - question_id: 14
      question: "What is the one thing that, if wrong, makes everything else irrelevant?"
      answer: "If the examples don't actually run, the doc is worse than useless."

  extracted:
    goal: "Produce accurate, readable API documentation from source code."

    success_criteria:
      - "Every public endpoint is documented with method, path, parameters, and response."
      - "All code examples execute without modification."
      - "A junior developer can onboard using only this output."

    failure_criteria:
      - "Examples contain placeholder values or pseudo-code."
      - "Internal paths or non-public endpoints are exposed."

    constraints:
      latency: "medium"
      human_review: "optional"
      output_format: "text/markdown"
      retries: 1

    invariants:
      - "Code examples must be runnable as-written."
      - "No internal implementation details in public docs."

    contradictions_found: []
    contradictions_resolved: []
```

This file is the compiler's input. The compiled `pattern.yaml` is its output.

---

## Interview anti-patterns

**Do not interview for tasks that should stay as prompts.**

The interview → compile cycle has overhead. It is not appropriate for:

- One-off tasks
- Tasks with no repeat value
- Tasks where the user genuinely doesn't know what they want yet (explore first, interview second)

**Do not let the interview become a requirements document.**

Requirements documents are exhaustive. Interviews surface the minimum structure needed for reliable execution. If an interview takes more than 20 minutes, something is wrong — either the scope is too large (split the pattern) or the user hasn't thought about what they need yet (stop and think first).

**Do not resolve contradictions by compromise.**

"We'll try to balance speed and quality" is not a resolved contradiction. It means the runtime will guess. Force a decision.

**Do not skip Act 4.**

Every interview that skips invariant elicitation produces a pattern that will eventually produce output that "looks right but isn't." Invariants are where correctness is encoded, not just quality.

---

## When the interview is done

You should be able to fill in:

```
intent.goal                    ← from Act 1
intent.success_looks_like      ← from Act 2
intent.failure_looks_like      ← from Act 2
constraints.*                  ← from Act 3
invariants[]                   ← from Act 4
```

...and have no unresolved contradictions from Act 5.

If any of these are still blank, the interview is not done.

---

## The thing prompt thinkers don't expect

The most common reaction after a first interview:

> "I didn't realize I had so many assumptions baked in."

That's the point.

Prompts inherit your assumptions silently.

Patterns surface them explicitly so the runtime can honor them reliably.
