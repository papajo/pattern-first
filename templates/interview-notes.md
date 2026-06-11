# Interview Notes: 5-Act Worksheet

> Use this template to run a structured interview and capture the raw material
> for a compiled pattern. Answer each question for your task.

---

## Task / Idea

> Describe your task in one sentence:

```


```

---

## Act 1 — Goal Extraction

**Question:** In one sentence — what does this need to produce?

```


```

**Tip:** The answer must be a noun (a document, a list, a report), not a verb (search, analyze, write).

**Who receives the output and what do they do with it?**

```


```

---

## Act 2 — Success Definition

**Question:** What does the output look like when it's exactly right?

List **falsifiable** success criteria (each must be measurable):

| # | Criterion | How to measure | Pass/fail threshold |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

**Question:** What would make you reject the output immediately?

```


```

---

## Act 3 — Constraint Discovery

**Hard limits:**

| Question | Answer |
|---|---|
| How fast must this run? | |
| How many times per week? | |
| What must the output never include? | |
| Does a human need to review? | |
| Any format requirements? | |
| What data sources are allowed? | |
| What inputs does the user need to provide? | |

---

## Act 4 — Invariant Elicitation

**Non-negotiables** (things that must always be true):

| # | Invariant | When to check? | What if violated? |
|---|---|---|---|
| 1 | | pre/post/continuous | halt/warn/rollback |
| 2 | | pre/post/continuous | halt/warn/rollback |
| 3 | | pre/post/continuous | halt/warn/rollback |

---

## Act 5 — Contradiction Resolution

**Are there any trade-offs or conflicting requirements?**

| Conflict | Resolution (must choose) |
|---|---|
| vs. | |
| vs. | |
| vs. | |

---

## Ready to Compile?

If you can fill in all 5 acts above, you have a pattern waiting to be compiled.
Copy these answers into `templates/pattern-starter.json` and fill in the fields.

---

*Template: interview-notes.md — Part of the Pattern-First AI toolset.*
