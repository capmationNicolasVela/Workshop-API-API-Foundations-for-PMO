# Day 4 — Reading API Documentation & Real Scenarios

**Date:** Tuesday, April 21 · 10:00 AM · ~2 hours
**Tool:** Postman (free tier) + Browser (Swagger UI)
**Workshop API:** `https://workshop-api-api-foundations-for-pmo-production.up.railway.app`

---

## Learning Objectives

By the end of this session, participants will be able to:
- Navigate a Swagger / OpenAPI documentation page
- Identify endpoints, parameters, required fields, and response schemas
- Translate API endpoints into user stories with acceptance criteria
- Spot risks, ambiguities, and gaps in an API specification

---

## Timing Guide

| Section | Duration |
|---------|----------|
| Recap Day 3 | 10 min |
| What is API documentation? | 15 min |
| Swagger UI live walkthrough | 20 min |
| From endpoints to user stories | 20 min |
| Guided session | 15 min |
| Exercise | 25 min |
| Wrap-up + homework | 5 min |

---

## Slide Outline

### Slide 1 — Day 3 Recap

- Auth = identity (authentication) + permission (authorization)
- Bearer token flow: login → token → use token → refresh → logout
- 401 = not authenticated · 403 = authenticated but not allowed
- Token expiry and refresh are integration requirements, not just dev concerns
- System dependencies: every step has credentials, order, and failure modes
- Today: how do you read an API's full contract before building against it?

---

### Slide 2 — The Problem Without Documentation

Imagine your team agreed to integrate with a partner system. The developer says:
> "Just call POST /orders and send the order data"

Questions that immediately arise:
- What fields does `/orders` require?
- What format does the date field expect? ISO 8601? Unix timestamp?
- What does the response look like on success? On failure?
- Is there a rate limit?
- Who do we call if it returns 500?

**Without documentation, every integration is a guessing game.**

---

### Slide 3 — What Is API Documentation?

- The formal description of an API's contract
- Defines: endpoints, methods, parameters, request bodies, responses, auth requirements
- Modern standard: **OpenAPI Specification** (formerly Swagger)
- Human-readable format that can also be machine-processed
- **PM/BA value:** documentation is the source of truth for requirements, acceptance criteria, and risk identification

---

### Slide 4 — OpenAPI / Swagger: The Industry Standard

- **OpenAPI Specification (OAS):** a standard for describing REST APIs
- **Swagger UI:** a browser-based interface that renders OpenAPI specs as interactive docs
- Every endpoint is documented with:
  - HTTP method and path
  - Parameters (path, query, header)
  - Request body schema (fields, types, required/optional)
  - Response schemas for each status code
  - Authentication requirements

---

### Slide 5 — Swagger UI: The 5 Things to Always Check

For every endpoint you encounter in a spec:

1. **Method + Path** → what does it do and at what URL?
2. **Security** → does it require a token? Which type?
3. **Parameters** → what goes in the URL (path/query)?
4. **Request body** → what fields are required? What types?
5. **Responses** → what does success look like? What errors are defined?

---

### Slide 6 — Reading an Endpoint: Example

```
POST /users

Security: 🔒 bearerAuth (admin only)

Request body (required):
  username  string  minLength: 3  ✱ required
  email     string  format: email  ✱ required
  password  string  minLength: 8  ✱ required
  role      enum    "admin" | "client"  ✱ required

Responses:
  201  Created     → user object (id, username, email, role, createdAt)
  400  Bad Request → duplicate username or email
  401  Unauthorized → invalid token
  403  Forbidden   → not an admin
```

**Reading this as a PM/BA:** creating a user requires 4 fields, an admin token, and the system validates uniqueness of username and email.

---

### Slide 7 — Parameters: Three Types

| Type | Location | Example |
|------|----------|---------|
| **Path parameter** | Inside the URL | `/users/{id}` — the `id` is a path param |
| **Query parameter** | After `?` in the URL | `/users?role=admin&limit=10` |
| **Header parameter** | In request headers | `Authorization: Bearer token` |

- **Required vs optional** — the spec will tell you which are mandatory
- **PM/BA risk:** if a required parameter isn't documented, it's a gap in the spec

---

### Slide 8 — Response Schemas: What to Expect

A well-documented API tells you the shape of every response:

**200 OK — User object**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "admin" | "client",
  "createdAt": "2026-04-15T10:00:00.000Z"
}
```

**Things to verify:**
- Does `createdAt` include timezone? (Important for reports)
- Is `id` a string or a number? (Impacts database design)
- Are there fields in the response you don't see in the request body?

---

### Slide 9 — From Endpoint to User Story

**API endpoint:**
```
POST /users  (admin only)
Body: { username, email, password, role }
Response: 201 user object | 400 duplicate | 403 not admin
```

**User story:**
> As an **admin**, I want to **create a new user account** so that **new team members can access the system**.

**Acceptance criteria:**
- Given I am authenticated as admin, when I send a valid POST /users request with username, email, password, and role, then the system returns 201 and the created user object
- Given the username already exists, when I send POST /users, then the system returns 400 with a clear error message
- Given I am authenticated as a client (not admin), when I send POST /users, then the system returns 403

---

### Slide 10 — Spotting Risks in an API Spec

When reviewing API documentation, look for:

| Risk | Question to ask |
|------|----------------|
| **Missing endpoint** | Is there a "get by ID" if there's a "create"? |
| **No error documentation** | What responses are defined for 4xx/5xx? |
| **Ambiguous types** | Is `date` a string? What format? |
| **No pagination** | If I GET /users and there are 50,000 users, what happens? |
| **Missing auth spec** | Which endpoints require a token? |
| **Undocumented constraints** | Are there rate limits? Max file sizes? |
| **Unclear ownership** | Who maintains this API? What's the SLA? |

---

### Slide 11 — The PM/BA Deliverable from API Review

After reviewing an API spec, a BA/PM should produce:

1. **Endpoint inventory** — list of all endpoints relevant to the integration
2. **Data mapping** — which fields in the spec map to fields in your system?
3. **Open questions** — ambiguities and gaps to resolve with the dev team
4. **Risk register items** — risks identified from missing docs, unclear behavior, or constraints
5. **Acceptance criteria** — derived from the spec for each user story

---

## Guided Session — Navigating Our Swagger UI

**Step 1 — Open the documentation**
- Browser: `https://workshop-api-api-foundations-for-pmo-production.up.railway.app/docs`
- Observe: the page structure — sections, tags (Auth, Users), endpoint list

**Step 2 — Explore an endpoint without executing it**
- Click `POST /auth/login` to expand it
- Read: the request body schema — what fields, what types, what's required?
- Read: the response schemas — what does 200 look like? What does 401 look like?

**Step 3 — Execute directly from Swagger**
- Click "Try it out" on `POST /auth/login`
- Fill in the body with admin credentials
- Click "Execute"
- Observe: the request URL, the curl command, the response body and status code

**Step 4 — Authorize in Swagger**
- Copy the `accessToken` from the login response
- Click the 🔒 **Authorize** button (top right)
- Paste: `Bearer <your-token>` → Authorize
- Now try executing `GET /auth/me` — it uses your token

**Step 5 — Find a gap in the spec**
- Open `PATCH /users/{id}`
- Read the request body schema — which fields are optional?
- Read the responses — is there a 409 Conflict documented?
- Note: what would happen if two admins try to update the same user simultaneously?

---

## Exercise — Endpoint to User Story Conversion

**Instructions**

Using the Swagger UI at `/docs`, select 3 endpoints and for each one produce:

1. A **user story** in "As a... I want to... so that..." format
2. At least **3 acceptance criteria** (happy path + 2 error cases)
3. One **open question or risk** identified from reading the spec

**Suggested endpoints:**
- `GET /users/by-username/{username}`
- `PATCH /users/{id}`
- `POST /auth/refresh`

**Template:**

---
**Endpoint:** `[METHOD] [path]`

**User Story:**
> As a [role], I want to [action] so that [business value].

**Acceptance Criteria:**
- Given [context], when [action], then [expected result]
- Given [error condition 1], when [action], then [expected error response]
- Given [error condition 2], when [action], then [expected error response]

**Open Question / Risk:**
> [Your question or risk observation]

---

**Expected output:** 3 completed user story cards

**Stretch goal:** Review ALL endpoints and produce an endpoint inventory table:
| Method | Path | Auth required | Role | Purpose |
|--------|------|--------------|------|---------|

---

## Homework

Review the full API spec at `/docs` and produce a **BA deliverable**:

1. **Endpoint inventory** — all endpoints in a table (method, path, auth, role, purpose)
2. **Gap analysis** — identify at least 3 things that are missing, unclear, or potentially risky
3. **Open questions** — a list of questions you would ask the development team before starting the integration
4. **One risk register item** — write it in standard format: Risk | Probability | Impact | Mitigation

This document should be presentable to a project sponsor or client.

---

## Facilitator Notes

- **Key message:** the API spec is the most important contract in an integration project — reading it carefully prevents integration bugs that appear months after go-live
- **Live demonstration tip:** use the "Try it out" feature in Swagger to show that docs and behavior are aligned (or sometimes aren't — that's a gap)
- **Real project connection:** ask "does your current integration project have API documentation? Is it up to date?" — common answer is no, which reinforces why this skill matters
- **On gaps:** deliberately point out the missing 409 in PATCH /users/:id — real-world APIs always have undocumented behavior, and finding it early is a BA's job
- **Preview Day 5:** "Tomorrow we put everything together in a full integration simulation — you'll act as the BA responsible for validating the integration"
