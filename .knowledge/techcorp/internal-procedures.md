# TechCorp Internal Procedures

> Operations runbook | Last updated: 2026-03-01

---

## 1. Incident Response

### Severity Levels

| Severity | Definition | Response Time |
|----------|------------|---------------|
| P0 | Critical — complete service outage | 5 minutes |
| P1 | Major — feature unavailability | 15 minutes |
| P2 | Minor — non-critical bug | 1 hour |
| P3 | Low — cosmetic issue | 1 business day |

### Escalation Flow

1. **Detect**: Automated monitoring (PagerDuty) alerts the on-call engineer
2. **Triage**: On-call assesses severity within the response time window
3. **Respond**: For P0/P1, create a war room in Slack #incidents channel
4. **Mitigate**: Apply fix or workaround; document in incident report
5. **Post-mortem**: Within 48 hours for P0, 1 week for P1

### On-Call Rotation

- Primary on-call: 1 week rotation, 2 engineers per team
- Secondary on-call: 1 engineer, escalations from primary
- Schedule managed through PagerDuty
- Handoff meeting every Monday at 10 AM ET

---

## 2. Deployment Process

### Environments

| Environment | Purpose | Deploy Method |
|-------------|---------|---------------|
| development | Local testing | `docker compose up` |
| staging | Integration testing | CI/CD pipeline (auto on merge) |
| production | Live traffic | CI/CD pipeline (manual approval) |

### Required Checks Before Production Deploy

1. All tests pass (unit, integration, e2e)
2. Code review approved by at least 1 senior engineer
3. Staging deploy green for minimum 1 hour
4. Feature flag disabled if feature is incomplete
5. Database migration reviewed by DBA

### Rollback Procedure

If a production deploy causes issues:
1. Immediately revert the deploy via CI/CD "Rollback" button
2. Notify #engineering channel
3. Investigate root cause before re-deploying

---

## 3. Code Review Standards

### Requirements

- Every PR must have at least 1 approval from a team member
- Changes > 400 lines require 2 approvals
- No self-merging (author cannot approve their own PR)
- All CI checks must pass before merge

### Review Timeline

- Standard PR: review within 24 hours
- Urgent PR (P0/P1 fix): review within 2 hours
- Draft PR: no SLA, author marks Ready when complete

---

## 4. Data Access and Privacy

- Customer data must never be accessed outside of production incident resolution
- All queries on production databases must use the read-only replica
- Data export requests must be approved by Legal and Security
- PII must be masked in all internal dashboards and logs
- GDPR deletion requests must be fulfilled within 30 days
