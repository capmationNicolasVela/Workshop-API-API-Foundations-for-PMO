# Day 3 — Authentication & System Dependencies

**Date:** Monday, April 20 · 10:00 AM · ~2 hours
**Tool:** Postman (free tier)
**Workshop API:** `https://workshop-api-api-foundations-for-pmo-production.up.railway.app`

> From today onward we use our own API. Import the Postman collection and select the **Capmation Workshop API** environment before starting.

---

## Learning Objectives

By the end of this session, participants will be able to:
- Explain the difference between API keys, Bearer tokens, and OAuth
- Configure authentication in Postman using a Bearer token
- Successfully access a secured endpoint after authenticating
- Identify what breaks when auth is missing or incorrect
- Map the dependencies between systems in an integration flow

---

## Timing Guide

| Section | Duration |
|---------|----------|
| Recap Day 2 | 10 min |
| Auth concepts | 25 min |
| Guided session (login + secured endpoints) | 30 min |
| System dependencies concept | 10 min |
| Exercise | 25 min |
| Wrap-up + homework | 10 min |

---

## Slide Outline

### Slide 1 — Day 2 Recap

- 4 methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
- Status codes: 2xx success · 4xx client error · 5xx server error
- JSON: objects `{}`, arrays `[]`, nested paths (`user.address.city`)
- 400 = wrong data sent · 404 = not found · 500 = server bug
- Today: how do systems prove they're allowed to talk to each other?

---

### Slide 2 — Why Authentication Matters

- Without auth, any API would be publicly accessible to anyone
- Auth answers: **"Who are you?"** and **"Are you allowed to do this?"**
- Two distinct concepts:
  - **Authentication** → proving your identity (login)
  - **Authorization** → what you're allowed to do (permissions/roles)
- **PM/BA implication:** every integration needs an auth strategy — "who holds the credentials?" is a dependency

---

### Slide 3 — The 3 Auth Methods You'll Encounter

| Method | How it works | Common use case |
|--------|-------------|-----------------|
| **API Key** | A secret string in the header or URL | Third-party services (weather, maps, SMS) |
| **Bearer Token (JWT)** | A signed token after login | Internal systems, user sessions |
| **OAuth 2.0** | Delegated access ("Login with Google") | Enterprise integrations, SaaS |

- Most modern enterprise integrations use Bearer tokens or OAuth
- Today: we practice Bearer tokens — the most common pattern

---

### Slide 4 — How Bearer Token Auth Works

```
1. Client → POST /auth/login { username, password }
         ← { accessToken, refreshToken, user }

2. Client → GET /auth/me
            Header: Authorization: Bearer eyJhbGci...
         ← { id, username, email, role }

3. Token expires (15 min) →
   Client → POST /auth/refresh { refreshToken }
           ← { new accessToken, new refreshToken }
```

- The `accessToken` is a **JWT** (JSON Web Token) — a signed, self-contained credential
- Short-lived by design: if stolen, expires in 15 minutes
- The `refreshToken` enables renewal without re-entering credentials

---

### Slide 5 — What Is a JWT?

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJ1c2VySWQiOiIxIiwicm9sZSI6ImFkbWluIn0
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Three parts separated by `.`:
1. **Header** — algorithm used to sign the token
2. **Payload** — the data inside (userId, role, expiry)
3. **Signature** — proves the token wasn't tampered with

- The payload is **readable** (base64 encoded, not encrypted)
- The signature is **verifiable** — only the server can produce it
- **PM/BA implication:** tokens carry claims (roles, permissions) — these are business rules embedded in the credential

---

### Slide 6 — Token Expiry & Refresh: Why It Matters

| Token | Lifespan | Purpose |
|-------|----------|---------|
| Access Token | 15 minutes | Make API calls |
| Refresh Token | 7 days | Get a new access token |

- Short access token = smaller attack window if stolen
- Refresh token = keeps the user logged in without re-entering credentials
- **PM/BA concern:** what happens to in-flight transactions when a token expires mid-operation?
- **Integration requirement:** the calling system must handle token renewal automatically

---

### Slide 7 — Roles and Permissions

Our API has two roles:

| Role | Can do |
|------|--------|
| **admin** | Everything — including create users and list all users |
| **client** | Read own profile, update own profile, search by username |

- Roles are embedded in the JWT payload
- The server validates the role on every request
- **PM/BA implication:** role design is a business decision — who can see what? Who can change what? This belongs in requirements, not in a developer's judgment call

---

### Slide 8 — What Breaks When Auth Is Wrong

| Scenario | Status Code | Meaning |
|----------|-------------|---------|
| No token sent | 401 Unauthorized | You forgot to authenticate |
| Token expired | 401 Unauthorized | Session ended — refresh or re-login |
| Token revoked (logout) | 401 Unauthorized | Session was explicitly closed |
| Valid token, wrong role | 403 Forbidden | You're authenticated but not permitted |
| Token from wrong environment | 401 Unauthorized | Prod token used in dev — or vice versa |

---

### Slide 9 — Our Workshop API

**Base URL:**
`https://workshop-api-api-foundations-for-pmo-production.up.railway.app`

**Swagger documentation:**
`[base URL]/docs`

**Credentials for today:**
- `admin / Admin123!` → full access
- `usuario1 / Client123!` → limited access

**In Postman:** already configured in the collection — the Login request saves the token automatically.

---

### Slide 10 — System Dependencies in an Integration

Every integration involves:
- **Systems:** which applications are involved?
- **Credentials:** who holds the API key / token for each system?
- **Order of operations:** what must happen before what?
- **Failure points:** what breaks if any step fails?

Example: CRM → Project Management Tool
```
1. User created in CRM
2. CRM calls Project Tool API with user data
3. Project Tool creates the user and returns an ID
4. CRM stores the Project Tool ID for future sync
```

Break step 2 → steps 3 and 4 never happen → data inconsistency

---

## Guided Session — Login and Access Secured Endpoints

**Step 1 — Import the Postman collection**
- File → Import → select `capmation-workshop.postman_collection.json`
- Select environment: `Capmation Workshop API`
- Update `baseUrl` to: `https://workshop-api-api-foundations-for-pmo-production.up.railway.app`

**Step 2 — Login**
- Open: `Auth → Login`
- Body: `{ "username": "admin", "password": "Admin123!" }`
- Send → Status: `200 OK`
- Observe: `accessToken`, `refreshToken`, and `user` in the response
- The test script saves the tokens automatically — check the environment variables

**Step 3 — Access your profile**
- Open: `Auth → Mi Perfil (/me)`
- Notice the `Authorization` tab: `Bearer {{accessToken}}`
- Send → Status: `200 OK`
- Observe your user data in the response

**Step 4 — What happens without the token?**
- In `Auth → Mi Perfil (/me)`, go to the **Authorization** tab
- Change type to `No Auth`
- Send → Status: `401 Unauthorized`
- Read the error message — this is what auth failure looks like

**Step 5 — What happens with a wrong role?**
- Logout: `Auth → Logout`
- Login as: `{ "username": "usuario1", "password": "Client123!" }`
- Try: `Users → Listar Usuarios`
- Send → Status: `403 Forbidden`
- Observe: authenticated (valid token) but not permitted (wrong role)

**Step 6 — Refresh the token**
- Open: `Auth → Refresh Token`
- Body already has `{{refreshToken}}` from the environment
- Send → new `accessToken` and `refreshToken` saved automatically
- The old refresh token is now revoked

---

## Exercise — Map the Auth Dependencies

**Scenario:** Your team is building an integration where an HR system automatically creates user accounts in a project management tool (like our workshop API) whenever a new employee is onboarded.

**Instructions:**

1. Using Postman, perform and document the full auth flow:
   - Login → note the status code and what was returned
   - Access `/auth/me` → note what the token gave you access to
   - Try accessing `/users` as `usuario1` → note what was denied and why
   - Refresh the token → note what changed

2. Fill in the dependency map:

| Step | System | Action | Requires | Can fail if... |
|------|--------|--------|----------|----------------|
| 1 | HR System | Trigger new user event | New employee created | — |
| 2 | Integration layer | Call POST /auth/login | Valid credentials | Wrong credentials, API down |
| 3 | | Call POST /users | | |
| 4 | | Store new user ID | | |

3. Identify: which credential does the integration need? Who owns it? Where is it stored?

**Expected output:** completed dependency map + answers to the 3 questions

---

## Homework

Map the dependencies of a real (or hypothetical) integration from your current project:

1. **Systems involved:** list all systems that need to communicate
2. **Credentials needed:** which system needs credentials to call which?
3. **Order of operations:** what must happen in sequence? What can happen in parallel?
4. **Failure points:** for each step, what breaks if it fails?

Format: a table or diagram (hand-drawn is fine, photographed and attached)

---

## Facilitator Notes

- **Key message:** auth is not just a technical concern — role design, credential ownership, and token expiry are all business decisions that belong in requirements
- **Reinforce the 401 vs 403 distinction:** this comes up constantly in integration work
- **Common question:** "where does the access token get stored?" — for web apps: memory; for server-to-server: environment variables (like our Railway `JWT_SECRET`)
- **If participants are ahead:** show them the JWT contents at jwt.io — decode the payload and show the userId, role, and expiry
- **Preview Day 4:** "Wednesday we look at Swagger documentation — how to read the full contract of an API"
