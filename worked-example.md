# Worked Example: API Documentation Generator

> This example traces the complete journey from "I have a prompt that kind of works"
> to a compiled, reusable, reliable execution pattern.
>
> Follow this if you're coming from prompt-based thinking.

---

## Starting point: the prompt you probably have

Most people arrive here with something like this:

```
You are a technical documentation writer.

Given the following source code, generate comprehensive API documentation.
Include all endpoints, their parameters, request/response examples,
and any important notes. Make it clear and professional.

Here is the code:
{source_code}
```

This works. Sometimes. Let's trace exactly what's unreliable about it,
then fix it structurally.

---

## What goes wrong with the prompt

**Run 1:** Produced great docs. All endpoints covered. Examples look right.

**Run 2:** Same code, different session. Examples use placeholder values like
`YOUR_API_KEY`. Junior dev tries to use them. They break.

**Run 3:** Included internal helper methods that aren't part of the public API.
Sent this to a client. Embarrassing.

**Run 4:** Got lucky again.

The problem isn't the prompt. The problem is that the prompt doesn't encode:
- What "comprehensive" means (you meant all *public* endpoints)
- What "examples" means (you meant *runnable* examples)
- What "clear and professional" means (no definition, so it varies)

You know all of this. The prompt doesn't. So you re-learn it every run via retry.

---

## Step 1: The interview

Here is the actual interview transcript for this pattern.

```
Interviewer: In one sentence — what does this need to produce?

User: A Markdown doc that explains every public API endpoint so developers
      can integrate without asking me questions.

Interviewer: Who receives this? What do they do with it?

User: External developers. They copy the examples, run them, and build
      their integration from there.

Interviewer: What does the output look like when it's exactly right?

User: A junior dev who's never seen our API can get their first successful
      call within 10 minutes of reading it.

Interviewer: What would make you reject the output immediately?

User: If the examples don't actually run. If they use placeholder values
      like "YOUR_TOKEN" that I have to go fix manually — that's worse than
      nothing because I'll miss one.

Interviewer: What else would make it unusable?

User: If internal methods or private endpoints show up. We had that happen
      once and had to pull the docs.

Interviewer: How fast does this need to run?

User: Doesn't matter. It runs maybe twice a week.

Interviewer: Does anyone need to review before it goes out?

User: I review it. But I don't want to have to rewrite it — just approve or
      ask for one specific fix.

Interviewer: What is the one thing that, if wrong, makes everything else
             irrelevant?

User: Non-runnable examples. Everything else I can edit. If the examples are
      fake, the whole doc is broken.

Interviewer: Any rules that can never be broken?

User: No internal implementation details. Ever. And the output format must
      be Markdown — it goes into our docs site directly.

Interviewer: You said examples must be runnable. What does that mean exactly —
             runnable with what credentials?

User: Good catch. We have a sandbox environment with fixed test credentials.
      Examples should use those.

Interviewer: Last one: you mentioned you want to "just approve or ask for
             one specific fix." What if the output is mostly right but one
             section is wrong?

User: I want to be able to say "redo the authentication section" without
      rerunning everything.
```

That last exchange is critical. It reveals a constraint (phase-level reruns)
that would never appear in a prompt.

---

## Step 2: The interview.yaml

The compiler's input. Normalized from the transcript above.

```yaml
interview:
  id: "int-api-docs-001"
  conducted_at: "2024-01-15T14:30:00Z"
  duration_minutes: 11

  extracted:
    goal: >
      Produce accurate, runnable API documentation in Markdown so external
      developers can integrate without additional support.

    success_criteria:
      - "Every public endpoint is documented with method, path, parameters, and response."
      - "All code examples use sandbox credentials and execute without modification."
      - "A developer with no prior context can make their first successful call within 10 minutes."
      - "Output is valid Markdown ready for direct import into the docs site."

    failure_criteria:
      - "Any example uses placeholder values (e.g. YOUR_TOKEN, <api_key>)."
      - "Any internal or private endpoint appears in the output."
      - "Output format is not Markdown."

    constraints:
      latency: "medium"
      human_review: "required"
      output_format: "text/markdown"
      retries: 1
      execution_mode: "sequential"
      custom:
        sandbox_credentials_required: true
        phase_level_rerun: true

    invariants:
      - id: "no-placeholders"
        description: "Code examples must never contain placeholder credential values."
        check: "post-phase"
        on_violation: "halt"
      - id: "public-only"
        description: "Only public, documented endpoints appear in output."
        check: "post-phase"
        on_violation: "halt"
      - id: "markdown-format"
        description: "Output is valid Markdown throughout."
        check: "continuous"
        on_violation: "halt"

    contradictions_found: []
    contradictions_resolved: []
```

---

## Step 3: The compiled pattern.yaml

The compiler's output. This is the reusable asset.

```yaml
version: "0.1"

pattern:
  id: "generate-api-docs"
  name: "Generate API Documentation"
  description: >
    Produces runnable Markdown API documentation from source code.
    Targeted at external developers integrating for the first time.
  tags: ["docs", "api", "developer-experience"]
  compiled_at: "2024-01-15T14:41:00Z"
  source:
    interview_id: "int-api-docs-001"
    compiler_version: "0.1.0"

intent:
  goal: >
    Produce accurate, runnable API documentation in Markdown so external
    developers can integrate without additional support.

  success_looks_like:
    - "Every public endpoint is documented with method, path, parameters, and response."
    - "All code examples use sandbox credentials and execute without modification."
    - "A developer with no prior context can make their first call within 10 minutes."
    - "Output is valid Markdown ready for direct import into the docs site."

  failure_looks_like:
    - "Any example uses placeholder values."
    - "Any internal or private endpoint appears in output."
    - "Output is not valid Markdown."

  scope:
    in:
      - "Public API endpoints"
      - "Request/response schemas"
      - "Authentication flow"
      - "Runnable code examples using sandbox credentials"
    out:
      - "Internal helper methods"
      - "Private endpoints"
      - "Implementation details"
      - "Deployment or infrastructure docs"

constraints:
  latency: "medium"
  retries: 1
  human_review: "required"
  output_format: "text/markdown"
  execution_mode: "sequential"
  custom:
    sandbox_credentials_required: true
    phase_level_rerun: true

invariants:
  - id: "no-placeholders"
    description: >
      Code examples must never contain placeholder credential values
      such as YOUR_TOKEN, <api_key>, or similar patterns.
    check: "post-phase"
    on_violation: "halt"

  - id: "public-only"
    description: >
      Only endpoints explicitly marked public or exported in the source
      may appear in the output.
    check: "post-phase"
    on_violation: "halt"

  - id: "markdown-format"
    description: "All output must be valid Markdown throughout."
    check: "continuous"
    on_violation: "halt"

memory:
  strategy: "session"
  carry_forward:
    - "endpoint_list"
    - "type_map"
    - "auth_scheme"

phases:
  - id: "analyze"
    name: "Analyze Source"
    objective: >
      Parse source code and extract all public endpoints with their
      method, path, parameters, types, and return signatures.
      Do not include internal or private members.
    input:
      requires: ["source_files"]
      accepts: ["existing_docs", "openapi_spec"]
    output:
      produces: ["endpoint_list", "type_map", "auth_scheme"]
      format: "structured"
    transitions:
      on_success: "generate"
      on_failure: "halt"
      on_empty: "halt"
    hint: "Preserve original parameter names exactly. Note deprecation markers."

  - id: "generate"
    name: "Generate Documentation"
    objective: >
      For each endpoint in endpoint_list, produce a Markdown section
      containing: description, method + path, parameter table,
      request body schema, response schema, and one runnable code example
      using sandbox credentials.
    input:
      requires: ["endpoint_list", "type_map", "auth_scheme"]
    output:
      produces: ["draft_docs"]
      format: "text/markdown"
    transitions:
      on_success: "validate"
      on_failure: "retry"
    hint: >
      Use sandbox credentials from auth_scheme in all examples.
      Code examples must be copy-paste runnable.

  - id: "validate"
    name: "Validate Output"
    objective: >
      Check draft_docs against all invariants and success criteria.
      Flag any endpoint missing required sections.
      Flag any example containing placeholder patterns.
      Flag any non-public endpoint that appeared.
    input:
      requires: ["draft_docs", "endpoint_list"]
    output:
      produces: ["validation_report", "final_docs"]
      format: "structured"
    transitions:
      on_success: "review"
      on_failure: "generate"
    hint: >
      Validation is a separate pass, not an edit. Produce a report,
      then produce the corrected output. Do not silently fix — document
      what was wrong.

  - id: "review"
    name: "Human Review"
    objective: >
      Present final_docs and validation_report to the user.
      Accept: approve (done), reject-section (rerun generate for named section only),
      or reject-all (rerun from generate).
    input:
      requires: ["final_docs", "validation_report"]
    output:
      produces: ["approved_docs"]
      format: "text/markdown"
    transitions:
      on_success: "done"
      on_failure: "generate"

evaluation:
  strategy: "hybrid"
  rubric:
    - criterion: "All public endpoints documented"
      weight: 0.35
      threshold: 1.0
    - criterion: "All examples are runnable (no placeholders)"
      weight: 0.35
      threshold: 1.0
    - criterion: "No internal endpoints exposed"
      weight: 0.20
      threshold: 1.0
    - criterion: "Valid Markdown format"
      weight: 0.10
      threshold: 1.0
  minimum_pass_score: 0.9

runtime:
  preferred_model: "claude-sonnet-4"
  temperature: 0.1
  compatible_runtimes: ["claude-code", "cursor", "local-ollama"]
  export_as_prompt: true
```

---

## Step 4: Execution trace

Running: `run pattern:generate-api-docs --input ./src/api/`

```
[pattern:generate-api-docs] Starting execution
[pattern:generate-api-docs] Loading memory: session

━━ Phase 1/4: Analyze Source ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input:    source_files (14 files, ./src/api/)
Checking: invariant:public-only [pre-phase] ✓

  Extracted 23 public endpoints
  Extracted 41 type definitions
  Identified auth scheme: Bearer token (sandbox: sk_test_*)

Checking: invariant:public-only [post-phase] ✓
Output:   endpoint_list (23), type_map (41), auth_scheme
Memory:   endpoint_list → session, type_map → session, auth_scheme → session

━━ Phase 2/4: Generate Documentation ━━━━━━━━━━━━━━━━━━━━━━━━━━
Input:    endpoint_list (23), type_map (41), auth_scheme
Checking: invariant:markdown-format [continuous] ✓
Checking: invariant:no-placeholders [continuous] ✓

  Generating docs for 23 endpoints...
  ████████████████████████ 23/23

Checking: invariant:no-placeholders [post-phase] ✓
Checking: invariant:public-only [post-phase] ✓
Output:   draft_docs (4,847 words, 23 sections)

━━ Phase 3/4: Validate Output ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input:    draft_docs, endpoint_list (23)

  Checking: all 23 endpoints have required sections...
  → 22/23 ✓
  → 1 ISSUE: /v1/webhooks missing response schema

  Checking: no placeholder credentials...
  → 23/23 ✓ All examples use sk_test_* credentials

  Checking: no internal endpoints...
  → 23/23 ✓ All endpoints are public

Validation report:
  PASS: 22 endpoints fully documented
  WARN: 1 endpoint (/v1/webhooks) missing response schema
  Action: regenerate section before proceeding

  Regenerating /v1/webhooks section...
  → Response schema added ✓

  Final check: 23/23 ✓
Output:   validation_report, final_docs

━━ Phase 4/4: Human Review ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Presenting to user...

  REVIEW REQUIRED
  ┌─────────────────────────────────────────────┐
  │ 23 endpoints documented                      │
  │ 0 invariant violations                       │
  │ 1 auto-corrected issue (webhooks schema)     │
  │                                              │
  │ [Approve]  [Reject section]  [Reject all]   │
  └─────────────────────────────────────────────┘

User: Approve

Output:   approved_docs → ./docs/api-reference.md

━━ Evaluation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  All public endpoints documented:  1.00 × 0.35 = 0.35
  All examples runnable:            1.00 × 0.35 = 0.35
  No internal endpoints exposed:    1.00 × 0.20 = 0.20
  Valid Markdown format:            1.00 × 0.10 = 0.10
  ─────────────────────────────────────────────────────
  Score: 1.00 / minimum: 0.90 → PASS

━━ Pattern Metrics ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Run #: 1
  Tokens consumed:     3,841
  Retries:             0 (auto-corrected 1 issue in validate phase)
  Human interventions: 1 (approval)
  Duration:            47s

[pattern:generate-api-docs] Complete → ./docs/api-reference.md
```

---

## Step 5: What happens on run #7

Same source. No interview. No re-setup.

```
run pattern:generate-api-docs --input ./src/api/

[pattern:generate-api-docs] Starting execution (run #7)
...
[pattern:generate-api-docs] Complete → ./docs/api-reference.md

Metrics (run #7):
  Tokens:  3,612  (vs 3,841 on run #1 — pattern learning minor compression)
  Retries: 0
  Score:   1.00
```

The invariants didn't need to be re-explained.
The success criteria didn't need to be re-stated.
The sandbox credentials didn't need to be re-specified.
The review workflow didn't need to be re-configured.

You ran one command.

---

## Side-by-side comparison

| | Prompt | Pattern |
|---|---|---|
| Setup time | 5 min (rewrite each time) | 12 min (once) |
| Run #1 output quality | Variable | Consistent |
| Run #7 output quality | Still variable | Still consistent |
| Placeholder credentials | Appears occasionally | Invariant: never |
| Internal endpoints in output | Happened once | Invariant: never |
| Human review workflow | Manual, ad hoc | Encoded in pattern |
| Phase-level rerun | Not possible | Built-in |
| Tokens per run | ~4,200 (re-explains context) | ~3,600 (pattern encodes it) |
| Debuggable? | No — just retry | Yes — trace + violation log |

---

## The key insight

The prompt you started with wasn't bad.

It just had no memory of your decisions.

Every run started from zero. Every run re-inherited your assumptions silently.
Every failure required a post-mortem to figure out what context was missing.

The pattern remembers your decisions as structure, not as text.

The interview is how you get them out of your head.
The compiler is how they become reusable.
The runtime is how they execute reliably.

---

## Try it yourself

Take any prompt you've been iterating on for more than a week.

Run through the five interview acts:

1. What is the single goal?
2. What does done look like (falsifiable)?
3. What are the hard limits?
4. What must always be true?
5. Where are the trade-offs, and how are they resolved?

If you can answer all five, you have a pattern waiting to be compiled.
