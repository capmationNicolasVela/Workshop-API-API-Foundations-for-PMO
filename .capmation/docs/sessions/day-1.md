# Day 1 — API Foundations + First Call

**Date:** Wednesday, April 15 · 10:00 AM · ~2 hours
**Tool:** Postman (free tier)
**Public API used:** REST Countries · JSONPlaceholder

---

## Learning Objectives

By the end of this session, participants will be able to:
- Explain what an API is in project management terms
- Identify the parts of an HTTP request and response
- Make their first GET request in Postman
- Extract specific data fields from a JSON response

---

## Timing Guide

| Section | Duration |
|---------|----------|
| Welcome + context | 10 min |
| Concepts block | 30 min |
| Postman setup | 15 min |
| Guided session | 20 min |
| Exercise | 25 min |
| Wrap-up + homework | 10 min |

---

## Slide Outline

### Slide 1 — Welcome & What We'll Build Together

- 5 sessions · 2 hours each · April 15–22
- No code required — just Postman and curiosity
- Goal: become a confident collaborator on integration projects
- Today: understand what APIs are and make your first call

---

### Slide 2 — Why This Matters for Your Projects

- Modern software systems communicate through APIs
- Every integration in your backlog involves an API
- PMs who understand APIs write better requirements
- BAs who understand APIs identify risks earlier
- You don't need to build them — you need to understand them

---

### Slide 3 — What Is an API?

- **API** = Application Programming Interface
- A contract: "if you ask me X this way, I'll respond with Y"
- Like a waiter: you don't go to the kitchen — you use the menu
- The "menu" defines what you can request and what you'll get back
- APIs connect systems: CRM → ERP, mobile app → backend, Slack → your tools

---

### Slide 4 — A Real Example: Your Daily APIs

- Google Maps showing traffic → weather API
- Paying with a card → payment gateway API
- Logging in with Google → OAuth API
- Receiving an invoice by email → billing system API
- Every time two systems exchange data, an API is involved

---

### Slide 5 — REST: The Most Common Style

- **REST** = Representational State Transfer (just a set of rules)
- Resources identified by URLs: `/users`, `/products`, `/orders`
- Actions expressed with HTTP methods: GET, POST, PUT, DELETE
- Stateless: each request carries all the information needed
- Response format: almost always **JSON**

---

### Slide 6 — Anatomy of a URL

```
https://api.example.com/users/42?format=json
│        │               │     │   │
│        │               │     │   └─ Query parameter
│        │               │     └───── Resource ID
│        │               └─────────── Path (endpoint)
│        └─────────────────────────── Domain
└──────────────────────────────────── Protocol
```

- **Protocol:** how the communication travels (https = secure)
- **Domain:** which server to talk to
- **Path:** which resource you're asking for
- **Query params:** filters or options for the request

---

### Slide 7 — Anatomy of an HTTP Request

Every API call has 4 parts:

| Part | Description | Example |
|------|-------------|---------|
| **Method** | What action to perform | GET |
| **URL** | Which resource | /users/42 |
| **Headers** | Metadata about the request | Content-Type, Authorization |
| **Body** | Data sent (POST/PUT only) | `{"name": "Ana"}` |

---

### Slide 8 — Anatomy of an HTTP Response

Every API response has 3 parts:

| Part | Description | Example |
|------|-------------|---------|
| **Status code** | Did it work? | 200, 404, 500 |
| **Headers** | Metadata about the response | Content-Type |
| **Body** | The data returned | `{"id": 42, "name": "Ana"}` |

- Status codes 2xx = success · 4xx = your error · 5xx = server error

---

### Slide 9 — JSON: The Language APIs Speak

```json
{
  "name": "Argentina",
  "capital": "Buenos Aires",
  "population": 45376763,
  "region": "Americas",
  "languages": ["Spanish"]
}
```

- **Object:** `{}` — a collection of key-value pairs
- **Array:** `[]` — a list of items
- **Key:** always a string in quotes
- **Value:** string, number, boolean, object, array, or null

---

### Slide 10 — Postman: Your API Workbench

- Free tool to send API requests without writing code
- Used by developers, testers, and increasingly by PMs/BAs
- Saves requests, organizes collections, stores environments
- Perfect for: testing an API, validating integrations, exploring documentation
- Download: postman.com (free account required)

---

### Slide 11 — Postman Interface Tour

_(Screen share: live walkthrough)_

- **New Request** → method + URL
- **Params tab** → query parameters
- **Headers tab** → metadata
- **Body tab** → data to send (POST/PUT)
- **Send** → execute the request
- **Response panel** → status code + body + headers

---

### Slide 12 — Today's APIs

**REST Countries** — `https://restcountries.com/v3.1`
- Free, no authentication required
- Returns country data in JSON
- Perfect for our first GET requests

**JSONPlaceholder** — `https://jsonplaceholder.typicode.com`
- Free fake REST API for practice
- Simulates real responses: users, posts, todos
- Accepts POST/PUT/DELETE (simulated, doesn't save)

---

## Guided Session — First GET Request

**Step 1 — Open Postman and create a new request**
- Method: `GET`
- URL: `https://restcountries.com/v3.1/name/argentina`
- Click **Send**

**Step 2 — Read the response**
- Status: `200 OK`
- Body: a JSON array with one object
- Observe: name, capital, population, flags, languages

**Step 3 — Extract a specific field**
- Look at the response and find: `name.common`
- Find: `capital[0]`
- Find: `population`

**Step 4 — Try another country**
- Change `argentina` to `france` in the URL
- Send again — observe the response structure is identical
- This is the **contract**: same structure regardless of the value

**Step 5 — Use query parameters**
- URL: `https://restcountries.com/v3.1/all?fields=name,capital,region`
- The `?fields=` is a **query parameter** filtering the response
- Observe how the response is now smaller and more focused

---

## Exercise — Read and Interpret a Real API Response

**Instructions**

1. Make a GET request to: `https://jsonplaceholder.typicode.com/users/1`
2. Observe the full response
3. Complete the table below with data from the response:

| Field | Value from response |
|-------|-------------------|
| Full name | |
| Email | |
| City | |
| Company name | |
| Website | |

4. Now call: `https://jsonplaceholder.typicode.com/users/1/posts`
5. Answer:
   - How many posts does this user have?
   - What is the title of the first post?
   - What data type is the `id` field?

**Expected output:** a completed table + 3 answers

**Stretch goal:** Call `/users/1/todos` and count how many are `completed: true`

---

## Homework

Document the request and response from today's exercise in your own words. For each part, write one sentence explaining what it is and why it matters for a PM/BA:

1. **URL** — what does each part mean?
2. **Method (GET)** — what did it do?
3. **Status code (200)** — what does it tell you?
4. **Response body** — what information did you receive?
5. **Headers** — what metadata was in the response?

Format: a short document (half a page) as if explaining to a teammate who missed today's session.

---

## Facilitator Notes

- **Before the session:** confirm all participants have Postman installed and can open it
- **Common issue:** participants get CORS errors — clarify that Postman bypasses browser CORS restrictions
- **Pace tip:** spend extra time on JSON structure (Slide 9) — this is foundational for all subsequent days
- **Real connection:** ask participants "what integrations are in your current project?" — use their answers as examples
- **Environment setup:** import the Postman collection and select the `Capmation Workshop API — Local` environment before the session (even though today's exercises use public APIs)
