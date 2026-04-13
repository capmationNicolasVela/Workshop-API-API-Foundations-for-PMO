# Day 2 — HTTP Methods & Data Handling

**Date:** Thursday, April 16 · 10:00 AM · ~2 hours
**Tool:** Postman (free tier)
**Public API used:** JSONPlaceholder

---

## Learning Objectives

By the end of this session, participants will be able to:
- Identify when to use GET, POST, PUT/PATCH, and DELETE
- Read and interpret HTTP status codes from a project perspective
- Navigate and understand a JSON structure with nested objects and arrays
- Send a POST request with a JSON body and interpret the response

---

## Timing Guide

| Section | Duration |
|---------|----------|
| Recap Day 1 | 10 min |
| HTTP Methods concept | 25 min |
| Status codes | 15 min |
| JSON deep dive | 15 min |
| Guided session | 20 min |
| Exercise | 20 min |
| Wrap-up + homework | 5 min |

---

## Slide Outline

### Slide 1 — Day 1 Recap

- An API is a contract between systems
- Every call has: method + URL + headers + body (optional)
- Every response has: status code + headers + body
- JSON is the language — objects `{}`, arrays `[]`, key-value pairs
- Today: we add actions (methods) and learn what responses tell us

---

### Slide 2 — The 4 Core HTTP Methods

| Method | Action | Analogy |
|--------|--------|---------|
| **GET** | Read data | Looking up a record |
| **POST** | Create new data | Filling out a form |
| **PUT / PATCH** | Update existing data | Editing a record |
| **DELETE** | Remove data | Deleting a record |

- These map directly to **CRUD** operations in any system
- The method tells the API what you want to *do* with the resource

---

### Slide 3 — GET: Read Without Side Effects

- Retrieves data — **never modifies anything**
- Safe to call repeatedly (idempotent)
- Parameters go in the URL (query params or path)
- No body required
- **PM/BA use:** verify data exists, inspect current state of a record

```
GET /users/42        → get user with ID 42
GET /users?role=admin → get all admin users
```

---

### Slide 4 — POST: Create Something New

- Sends data **in the body** to create a new resource
- Not idempotent: calling it twice creates two records
- Server usually responds with the created resource + a new ID
- Status code: `201 Created`
- **PM/BA use:** understand what data is required to create a record, validate required fields

```json
POST /users
Body: { "name": "Ana", "email": "ana@co.com" }
Response: { "id": 101, "name": "Ana", "email": "ana@co.com" }
```

---

### Slide 5 — PUT vs PATCH: Update with Nuance

**PUT** — Replace the entire resource
```json
PUT /users/42
Body: { "name": "Ana García", "email": "ana@new.com", "role": "admin" }
→ All fields must be sent, even unchanged ones
```

**PATCH** — Update only specific fields
```json
PATCH /users/42
Body: { "email": "ana@new.com" }
→ Only the changed fields are sent
```

- **PATCH** is more common in modern APIs
- **PM/BA impact:** a PATCH that forgets a required field can corrupt data

---

### Slide 6 — DELETE: Remove with Care

- Removes a resource permanently (usually)
- No body required
- Status: `204 No Content` (success, nothing to return)
- Some APIs use **soft delete** (marks as inactive, data stays)
- **PM/BA consideration:** is this hard delete or soft delete? Can it be undone? Who has permission?

```
DELETE /users/42   → removes user 42
Response: 204 No Content (empty body)
```

---

### Slide 7 — Status Codes: The API's Answer

```
2xx  ✅  Success
3xx  ↪️  Redirect
4xx  ❌  Your mistake
5xx  💥  Their mistake
```

- The status code is the **first thing to read** in any response
- It tells you whether to look at the body for data or for an error message

---

### Slide 8 — The Status Codes You'll See Every Day

| Code | Name | Meaning for PM/BA |
|------|------|-------------------|
| **200** | OK | Request succeeded, data in body |
| **201** | Created | New record was created |
| **204** | No Content | Success, but nothing to return |
| **400** | Bad Request | Sent invalid or missing data |
| **401** | Unauthorized | Not authenticated — need to log in |
| **403** | Forbidden | Authenticated, but no permission |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Duplicate — record already exists |
| **422** | Unprocessable | Validation failed |
| **500** | Internal Server Error | Bug on the server side |

---

### Slide 9 — 4xx vs 5xx: Who Is Responsible?

**4xx = Client error → your team's issue**
- Missing required field → fix the request
- Wrong credentials → fix the auth flow
- Calling a deleted record → check the workflow

**5xx = Server error → their team's issue**
- Bug in the API provider's code
- Database is down
- Something unexpected happened on their side

**PM/BA action:** 4xx errors go in your backlog. 5xx errors go in their incident tracker.

---

### Slide 10 — JSON: Nested Objects

```json
{
  "user": {
    "id": 1,
    "name": "Ana García",
    "address": {
      "city": "Buenos Aires",
      "country": "AR"
    }
  }
}
```

- To access city: `user.address.city`
- **PM/BA implication:** mapping fields between systems requires knowing the full path
- A field called `name` in System A might be `fullName` in System B → data mapping requirement

---

### Slide 11 — JSON: Arrays of Objects

```json
{
  "orders": [
    { "id": 1, "product": "Laptop", "status": "shipped" },
    { "id": 2, "product": "Mouse", "status": "pending" }
  ],
  "total": 2
}
```

- `orders` is an array — `[]` means multiple items
- Access first order: `orders[0]`
- Access second order's status: `orders[1].status`
- **PM/BA implication:** pagination — if there are 10,000 orders, does the API return all of them? What are the limits?

---

### Slide 12 — Required Fields and Validation

When a POST fails with `400 Bad Request`:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body/email must match format \"email\""
}
```

- The API is telling you exactly what's wrong
- This is a **validation error** — the data sent doesn't meet the contract
- **PM/BA implication:** required fields, formats, and validations belong in your acceptance criteria
- Every validation rule is a potential integration bug if not documented

---

## Guided Session — POST Request with JSON Body

**Step 1 — Create a new POST request**
- Method: `POST`
- URL: `https://jsonplaceholder.typicode.com/posts`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "title": "Mi primer post desde Postman",
  "body": "Aprendiendo a usar APIs en el taller de Capmation",
  "userId": 1
}
```
- Send → Status: `201 Created`

**Step 2 — Read the response**
- The server returned the object with a new `id` (101)
- JSONPlaceholder always returns 101 for demos — note this is simulated

**Step 3 — Inspect the difference between success and failure**
- Change `userId` to `"uno"` (a string instead of a number)
- Send → Status: `201` still (JSONPlaceholder is permissive)
- Discuss: a real API would return `400 Bad Request` here

**Step 4 — Send an incomplete request**
- Remove `title` from the body
- Send → discuss what a real API validation would return

**Step 5 — Trigger a 404**
- Method: `GET`
- URL: `https://jsonplaceholder.typicode.com/posts/999`
- Send → Status: `404 Not Found`
- Observe: `{}` empty body (JSONPlaceholder) vs a real error message

---

## Exercise — Create, Read, and Compare

**Instructions**

1. **Create** a new user via POST:
   - URL: `https://jsonplaceholder.typicode.com/users`
   - Body: your own invented user data (name, email, phone)
   - Note the status code and the `id` in the response

2. **Read** an existing user:
   - URL: `https://jsonplaceholder.typicode.com/users/3`
   - Map the response: fill in the table below

3. **Update** the user (PATCH):
   - URL: `https://jsonplaceholder.typicode.com/users/3`
   - Method: PATCH
   - Body: change only the `email` field

4. Complete this comparison table:

| Scenario | Method | Status Code | Had a body? |
|----------|--------|-------------|-------------|
| Read existing user | GET | | |
| Create new user | POST | | |
| Update email only | PATCH | | |
| Request non-existent user (id 9999) | GET | | |

**Expected output:** completed table + 4 Postman screenshots (or notes)

**Stretch goal:** Try DELETE on `/posts/1` — what status code do you get? What does the empty body mean?

---

## Homework

Find 3 different API responses from your current project (or ask your dev team for examples). For each one, document:

| # | Endpoint called | Method | Status code | What it means for the project |
|---|-----------------|--------|-------------|-------------------------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

If you don't have real examples, use the JSONPlaceholder collection from today and invent 3 scenarios that could map to real project situations (create a task, update a status, delete a record).

---

## Facilitator Notes

- **Key message to reinforce:** the status code is always the first thing to read — before looking at the body
- **Common confusion:** PUT vs PATCH — use the analogy of "replacing the whole form" (PUT) vs "correcting one field" (PATCH)
- **Real project connection:** ask "in your project, when a user updates their profile, does the system send all fields or just the changed ones?" — this distinction matters for integration design
- **If time allows:** show a real 500 error response and discuss how to document it in a risk register
- **Preview Day 3:** "On Monday we'll add authentication to everything we've learned — and we'll start using our own API"
