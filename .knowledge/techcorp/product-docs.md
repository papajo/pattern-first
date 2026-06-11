# TechCorp Product Documentation

> Product suite overview | Last updated: 2026-02-20

---

## TechCorp API Gateway (TCAG)

The TechCorp API Gateway is the single entry point for all external API traffic. It handles authentication, rate limiting, request routing, and logging.

### Authentication

All API requests require an API key passed via the `X-API-Key` header. Keys are generated through the Developer Portal and support the following permission scopes:
- `read` — read-only access to public endpoints
- `write` — create and update resources
- `admin` — full access including user management

Rate limits:
- Free tier: 1,000 requests/hour
- Pro tier: 10,000 requests/hour
- Enterprise tier: 100,000 requests/hour

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/users | List all users |
| POST | /v1/users | Create a new user |
| GET | /v1/users/:id | Get user by ID |
| PUT | /v1/users/:id | Update user |
| DELETE | /v1/users/:id | Delete user |
| GET | /v1/products | List all products |
| POST | /v1/products | Create a product |
| GET | /v1/products/:id | Get product by ID |

### Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request — malformed payload |
| 401 | Unauthorized — missing or invalid API key |
| 403 | Forbidden — API key lacks required scope |
| 404 | Not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## TechCorp Analytics Platform (TCAP)

The Analytics Platform provides real-time dashboards and reporting for business metrics.

### Key Features

- Real-time data pipeline with < 100ms latency
- Custom dashboard builder with drag-and-drop widgets
- Scheduled PDF report delivery via email
- Webhook integration for anomaly alerts
- Export to CSV, JSON, and Excel

### Data Retention

- Raw event data: 90 days
- Aggregated data: 2 years
- Dashboard configurations: indefinite

---

## TechCorp Authentication Service (TCAS)

Single sign-on service supporting SAML, OAuth 2.0, and OpenID Connect.

### Supported Identity Providers

- Okta
- Azure AD
- Google Workspace
- OneLogin
- Custom SAML 2.0

### Session Management

- Default session timeout: 8 hours
- Maximum session lifetime: 30 days
- Concurrent sessions: unlimited (configurable per org)
