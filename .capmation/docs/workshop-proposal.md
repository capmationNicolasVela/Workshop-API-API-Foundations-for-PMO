# API Foundations for PMO — Workshop Proposal

**Target Audience:** Project Managers / Business Analysts (PMO)
**Format:** 5 live sessions, 1 session per day
**Duration per session:** ~1 hours
**Tool required:** Postman (free tier)

---

## Objective

Equip PMO members with practical understanding of APIs — how they work, how to read them, and how to manage projects and requirements around integrations — without needing to write code.

---

## Schedule

| Day | Date | Time | Topic |
|-----|------|------|-------|
| Day 1 | Wednesday, April 15 | 10:00 AM | API Foundations + First Call |
| Day 2 | Thursday, April 16 | 10:00 AM | HTTP Methods & Data Handling |
| Day 3 | Monday, April 20 | 10:00 AM | Authentication & System Dependencies |
| Day 4 | Tuesday, April 21 | 10:00 AM | Reading API Documentation & Real Scenarios |
| Day 5 | Wednesday, April 22 | 10:00 AM | Integration Simulation |

---

## Day-by-Day Agenda

### Day 1 — API Foundations + First Call
**Wednesday, April 15 · 10:00 AM**

**Concepts**
- What is an API and why it matters for project work
- REST basics: endpoints, requests, and responses
- Anatomy of a URL and HTTP request

**Guided Session**
- Install and configure Postman
- Make the first GET request to a public API

**Exercise**
- Call a public API (e.g., REST Countries or JSONPlaceholder)
- Extract specific fields from the response

**Homework**
- Document each part of the request and response in your own words: URL, headers, status code, body

---

### Day 2 — HTTP Methods & Data Handling
**Thursday, April 16 · 10:00 AM**

**Concepts**
- GET vs POST vs PUT vs DELETE — when and why each is used
- HTTP status codes (200, 201, 400, 401, 404, 500) and what they mean for a project
- JSON structure: objects, arrays, key-value pairs

**Guided Session**
- Send a POST request with a JSON body
- Inspect the difference between a successful and failed response

**Exercise**
- Create and modify a resource via API calls using Postman

**Homework**
- Compare 3 different API responses (success, client error, server error) and explain what each means from a BA/PM perspective

---

### Day 3 — Authentication & System Dependencies
**Monday, April 20 · 10:00 AM**

**Concepts**
- API keys, bearer tokens, and basic OAuth flow
- Why authentication matters for integration planning
- Identifying system dependencies in an integration

**Guided Session**
- Configure authentication in Postman (API key and bearer token)
- Access a secured endpoint successfully

**Exercise**
- Access a secured endpoint using provided credentials
- Identify what breaks when auth is missing or incorrect

**Homework**
- Map the dependencies of a sample integration flow: which systems need to talk, what credentials are needed, what order operations must happen

---

### Day 4 — Reading API Documentation & Real Scenarios
**Tuesday, April 21 · 10:00 AM**

**Concepts**
- How to read Swagger / OpenAPI documentation
- Translating API endpoints into requirements and user stories
- Spotting risks and ambiguities in an API spec

**Guided Session**
- Navigate a real API documentation page (Swagger UI)
- Identify endpoints, parameters, required fields, and response schemas

**Exercise**
- Convert 3 API endpoints from a provided spec into user stories with acceptance criteria

**Homework**
- Review a provided API specification and identify: gaps, missing endpoints, unclear behavior, and potential risks for the project

---

### Day 5 — Integration Simulation
**Wednesday, April 22 · 10:00 AM**

**Format:** Scenario-based workshop

**Scenario**
Simulate a real integration between two systems (e.g., a CRM pushing data to a project management tool). Participants act as the BA/PM responsible for validating the integration.

**Exercise**
- Validate the endpoints involved
- Map the data flow end to end
- Identify dependencies and failure points

**Final Assignment**
- Present findings as a structured BA/PM deliverable:
  - Endpoint inventory
  - Dependency map
  - Risk register
  - Open questions for the development team

---

## Deliverables

| # | Deliverable |
|---|-------------|
| 1 | Workshop agenda and facilitation guide |
| 2 | Slide decks per session (concept-focused) |
| 3 | Postman collections for all exercises |
| 4 | Step-by-step exercise guides |
| 5 | Daily homework assignments |
| 6 | Integration scenario brief (Day 5) |
| 7 | API cheat sheet (methods, status codes, structure) |
| 8 | Recorded sessions |

---

## Definition of Done

- [ ] All 5 sessions delivered on schedule
- [ ] All materials created, shared, and uploaded to SharePoint
- [ ] Participants complete all daily exercises and homework
- [ ] Participants complete the final integration scenario
- [ ] Participants demonstrate ability to:
  - Use Postman independently
  - Interpret API responses and status codes
  - Read and extract information from API documentation
  - Identify dependencies, gaps, and risks in an integration
- [ ] Feedback collected from all participants

---

## Pre-Workshop Requirements

- Participants install Postman before Day 1 (free at postman.com)
- Facilitator shares Postman collection + scenario brief 24h before each session
- Sessions delivered via [video conferencing platform]

---

*Prepared for Capmation PMO · April 2026*
