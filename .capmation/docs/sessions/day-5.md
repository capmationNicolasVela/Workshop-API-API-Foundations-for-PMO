# Day 5 — Integration Simulation

**Date:** Wednesday, April 22 · 10:00 AM · ~2 hours
**Tool:** Postman (free tier) + Browser (Swagger UI)
**Workshop API:** `https://workshop-api-api-foundations-for-pmo-production.up.railway.app`
**Format:** Scenario-based workshop — participants act as BA/PM

---

## Learning Objectives

By the end of this session, participants will be able to:
- Validate the endpoints involved in a real integration scenario
- Map an end-to-end data flow between two systems
- Identify dependencies, failure points, and risks
- Produce a structured BA/PM deliverable from an integration analysis

---

## Timing Guide

| Section | Duration |
|---------|----------|
| Recap Days 1–4 | 10 min |
| Scenario presentation | 10 min |
| Guided analysis (together) | 20 min |
| Independent simulation | 45 min |
| Deliverable presentation | 15 min |
| Course wrap-up | 10 min |

---

## Slide Outline

### Slide 1 — Week in Review

| Day | Key takeaway |
|-----|-------------|
| 1 | APIs are contracts. Every call has method + URL + headers + body |
| 2 | Methods define intent. Status codes tell the story |
| 3 | Auth is a business decision embedded in technology |
| 4 | The spec is the source of truth — gaps and ambiguities are risks |
| **5** | **Put it all together: simulate a real integration as a BA/PM** |

---

### Slide 2 — What Is an Integration Simulation?

- A structured exercise where you act as the BA/PM responsible for validating an integration
- You don't build it — you **validate** it
- Your deliverables become the input for the development team
- Skills used today: reading specs, making API calls, mapping data flows, identifying risks

---

### Slide 3 — The Scenario

**Context:** Contoso, a consulting firm, uses:
- **CRM system** — manages clients and contacts
- **Workshop API** (our system) — manages project users and access

**Business requirement:**
> When a new client is onboarded in the CRM, the system automatically creates a user account in the Workshop API so the client can access the project portal.

**Your role:** You are the BA/PM responsible for validating that this integration works correctly before go-live.

---

### Slide 4 — The Integration Flow

```
CRM (source)                    Workshop API (target)
     │                                   │
     │  1. New client created in CRM      │
     │                                   │
     │  2. CRM calls POST /auth/login ───►│
     │     (with service account creds)  │
     │  ◄── accessToken ─────────────────│
     │                                   │
     │  3. CRM calls POST /users ────────►│
     │     { username, email, password,   │
     │       role: "client" }            │
     │  ◄── 201 { id, username, email } ─│
     │                                   │
     │  4. CRM stores Workshop API userId │
     │     in client record              │
     │                                   │
     │  5. (future) CRM syncs updates ───►│
     │     PATCH /users/{id}             │
```

---

### Slide 5 — What You Need to Validate

As a BA/PM, for this integration you need to verify:

1. **The endpoints exist and work as documented**
2. **The data flows correctly** — CRM fields map to API fields
3. **Auth is properly handled** — the service account has the right role
4. **Error cases are handled** — what happens when something goes wrong?
5. **The API contract is complete** — no gaps or surprises

---

### Slide 6 — The Data Mapping Challenge

CRM system fields:
```
client.fullName     → Workshop API: username (how? first+last? combined?)
client.contactEmail → Workshop API: email
client.id           → Workshop API: ??? (no equivalent — needs to be stored separately)
(none)              → Workshop API: password (who generates it? who communicates it?)
(none)              → Workshop API: role (always "client"? or configurable?)
```

**Gaps identified:**
- How is `username` derived from `fullName`? (Spaces? Special chars?)
- Who generates the initial password? Is it auto-generated or a fixed default?
- How does the CRM receive the Workshop API `userId` to store it?

---

### Slide 7 — Failure Scenarios to Validate

| Failure | What to test | Expected behavior |
|---------|-------------|-------------------|
| CRM sends duplicate email | POST /users with existing email | 400 Bad Request |
| CRM sends duplicate username | POST /users with existing username | 400 Bad Request |
| Auth token expired between login and create | POST /users with expired token | 401 → re-auth flow |
| Workshop API is down | POST /users times out | CRM must queue and retry |
| Client name has special characters | POST /users with `"username": "José García"` | Does API accept it? |

---

### Slide 8 — Risk Register (Sample)

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| 1 | Token expires during bulk onboarding | Medium | High | Implement token refresh before each batch |
| 2 | Username collision on common names | High | Medium | Use email as username, or add numeric suffix |
| 3 | Workshop API returns 500 during onboarding | Low | High | CRM queues failed records, retries with exponential backoff |
| 4 | CRM doesn't store Workshop userId | Low | High | Make userId storage a required step in the integration flow |

---

### Slide 9 — Your Final Deliverable

By end of session, produce:

**1. Endpoint Inventory**
> Which endpoints are used in this integration, in what order, with what data?

**2. Data Flow Map**
> Sequence of calls with request/response at each step

**3. Open Questions for the Dev Team**
> What's unclear or missing from the spec?

**4. Risk Register**
> At least 4 risks with probability, impact, and mitigation

This document should be ready to hand to a project sponsor or technical lead.

---

### Slide 10 — What You've Learned This Week

- APIs connect systems through a contract of endpoints, methods, and data shapes
- Every integration has authentication, dependencies, and failure modes
- Status codes tell the story — learn to read them before the body
- API documentation is the BA's best tool for writing correct requirements
- As a PM/BA, your job is not to build the integration — it's to understand it, validate it, and protect the project from its failure modes

**You are now a more effective collaborator on every integration project in your portfolio.**

---

## Integration Scenario Brief

### Scenario: Client Onboarding Automation

**Background:** Contoso is integrating its CRM with the Capmation Workshop API to automate user creation when new clients are onboarded.

**Your task:** As the BA/PM, validate the integration using Postman and produce the deliverables listed below.

**Systems:**
- **CRM (simulated):** you will manually perform the calls that the CRM would make automatically
- **Workshop API:** `https://workshop-api-api-foundations-for-pmo-production.up.railway.app`

**Service account credentials (the CRM's credentials):**
- Username: `admin`
- Password: `Admin123!`

**New client to onboard:**
- Full name: Laura Martínez
- Email: `laura.martinez@contoso.com`
- Department: PMO

---

## Guided Analysis (Together — First 20 minutes)

**Step 1 — Authenticate as the CRM service account**
- POST /auth/login with `admin / Admin123!`
- Verify: token saved in environment

**Step 2 — Validate the user creation endpoint**
- Open Swagger UI → POST /users
- Read: what fields are required? What validations exist?
- Identify: is there a `fullName` field? How do we handle it?

**Step 3 — Create Laura's user account**
- POST /users
```json
{
  "username": "laura.martinez",
  "email": "laura.martinez@contoso.com",
  "password": "Temp2026!",
  "role": "client"
}
```
- Verify: 201 Created → note the `id` returned

**Step 4 — Verify the account was created**
- GET /users/by-username/laura.martinez
- Verify: the data matches what was sent

**Step 5 — Simulate an update (Day 2 of onboarding)**
- PATCH /users/{id} (use the id from Step 3)
- Update: change the email to `laura@contoso.com`
- Verify: 200 OK with updated data

---

## Independent Exercise — Full Simulation

**Onboard 2 more clients independently:**

**Client 2:** Carlos Rodríguez · `carlos.rodriguez@contoso.com`
**Client 3:** You choose — invent a realistic client

For each client, complete the validation log:

| Step | Endpoint | Status Code | Response (key fields) | Issue found? |
|------|----------|-------------|----------------------|--------------|
| 1. Login | POST /auth/login | | | |
| 2. Create user | POST /users | | | |
| 3. Verify creation | GET /users/by-username/:username | | | |
| 4. Update email | PATCH /users/:id | | | |
| 5. Try duplicate | POST /users (same email) | | | |
| 6. Try without auth | POST /users (no token) | | | |

Then produce the **4 deliverables** (see Slide 9).

---

## Final Deliverable Template

### 1. Endpoint Inventory

| # | Method | Endpoint | Auth | Role | Purpose in this integration |
|---|--------|----------|------|------|----------------------------|
| 1 | POST | /auth/login | — | — | CRM authenticates to get service token |
| 2 | POST | /users | Bearer | admin | Create new client user account |
| 3 | GET | /users/by-username/:username | Bearer | any | Verify user was created correctly |
| 4 | PATCH | /users/:id | Bearer | admin | Update client data after onboarding |

### 2. Data Flow Map

```
[YOUR SEQUENCE DIAGRAM OR TABLE HERE]
Include: system, action, request data, response data, for each step
```

### 3. Open Questions for the Dev Team

1. How should `username` be derived from `fullName`? What are the rules for special characters?
2. Who generates and communicates the initial password to the new client?
3. Is there a way to check if a user was already onboarded (idempotency)?
4. What is the rate limit on POST /users during bulk onboarding?
5. [Add your own questions from your testing]

### 4. Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

---

## Course Wrap-Up

### What to take from this workshop

- Your **Postman collection** — keep it, use it on your next project
- The **API cheat sheet** (to be shared) — methods, status codes, auth patterns
- The **deliverable templates** — endpoint inventory, data flow, risk register
- The **habit** of asking "what does the API spec say?" before writing requirements

### Where to go next

- Practice on public APIs: OpenWeatherMap, GitHub API, Trello API
- Read your internal API documentation with fresh eyes
- In your next integration project: request the Swagger/OpenAPI spec on Day 1
- Share what you learned: explain the 401 vs 403 difference to a colleague

---

## Facilitator Notes

- **Tone shift for Day 5:** this is a simulation, not a lecture — participants are doing most of the work, you are facilitating and unblocking
- **Watch for:** participants who jump straight to Postman without reading the spec first — coach them to read before they click
- **Common finding:** the "duplicate username" test often surprises participants — they expect the API to handle it automatically
- **Deliverable quality:** don't grade on completeness — reward critical thinking, especially in the open questions and risk register
- **Closing reflection question:** "What's one thing from this week that will change how you work on integration projects?" — go around the room
- **After the session:** share the recording, the Postman collection, and the final scenario brief via SharePoint
