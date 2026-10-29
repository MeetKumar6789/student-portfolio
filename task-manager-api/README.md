# Task Manager API - Practical 7

## Objective
This project extends the full-stack Task Management application with JWT authentication and request-validation middleware. MongoDB stores users and tasks through Mongoose.

## Practical 7 Authentication

- `POST /register` validates the email and password, hashes the password with bcrypt, and stores the user.
- `POST /login` verifies the password and returns a JWT that expires after one hour.
- `GET /me` returns the authenticated user's ID and email.
- Every `/tasks` route requires `Authorization: Bearer <token>`.
- Request validation runs before task database queries and rejects malformed bodies with HTTP 400.
- The React task page includes registration, login, sign-out, and redirects to login when an authenticated request returns HTTP 401.

The JWT secret is required from `task-manager-api/.env`; there is no source-code fallback. Copy `.env.example` to `.env` and replace the placeholder with a long random secret. Keep `.env` untracked.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- JavaScript (CommonJS)

## Project Structure
```bash
task-manager-api/
├── .env
├── .env.example
├── .gitignore
├── models/
│   └── Task.js
├── package.json
├── README.md
├── server.js
└── node_modules/
```

## Installation
1. Open the project folder:
```bash
cd task-manager-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a local environment file:
```bash
copy .env.example .env
```

Set `JWT_SECRET` in `.env` to a long random value before starting the API.

4. Make sure MongoDB is running locally. The default connection string is:
```bash
mongodb://127.0.0.1:27017/task-manager-db
```

## Run the Server
```bash
npm start
```

The server will start at:
```bash
http://localhost:5000
```

You should see:
```bash
Connected to MongoDB
Server running on port 5000
```

## MongoDB Schema Design
The Task model is defined in `models/Task.js` and includes:
- `title` - required string
- `description` - optional string with default empty value
- `completed` - boolean with default false
- `priority` - required enum: `low`, `medium`, `high`
- `timestamps` - createdAt and updatedAt automatically added by Mongoose

## API Endpoints

### GET /health
Returns HTTP 200 with the backend service status and an ISO timestamp. This liveness endpoint does not query MongoDB.

### POST /register
Creates a user. The request body requires `email` and a password of at least six characters.

### POST /login
Accepts `email` and `password`; returns a signed JWT on successful authentication.

### GET /me
Returns the currently authenticated user's ID and email.

### GET /tasks
Returns all tasks from MongoDB. Requires a valid bearer token.

### GET /tasks/:id
Returns a single task by MongoDB ObjectId. Requires a valid bearer token.

### POST /tasks
Creates a new task. Requires a valid bearer token and non-empty `title` and valid `priority`.

### PUT /tasks/:id
Updates an existing task. Requires a valid bearer token and at least one valid task field.

### DELETE /tasks/:id
Deletes a task. Requires a valid bearer token.

### GET /test-error
Deliberately triggers the global error handler.

## Practical 13 — AI Task Description Suggestions

The task creation form can request an editable description suggestion for its title. React sends only the title to the authenticated Express endpoint; the backend calls Groq using its official JavaScript SDK (`groq-sdk`) and returns the generated text. The selected model is `openai/gpt-oss-20b`, shown in Groq's [model catalog](https://console.groq.com/docs/models) and [model deprecation guidance](https://console.groq.com/docs/deprecations). Availability depends on the current Groq model catalog and account eligibility. The suggestion is not saved until the user submits the existing task form.

```text
React task form
  -> POST /api/ai/generate-description (Bearer token, task title)
  -> Express authentication, validation, and per-user cooldown
  -> Groq openai/gpt-oss-20b (backend-only API key)
  -> JSON suggestion displayed in the editable description field
  -> Existing POST /tasks saves only after user confirmation
```

### Configuration and startup

1. Install backend dependencies from `task-manager-api/` with `npm install`.
2. If no backend `.env` exists, create it from `.env.example`:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Create a key in the [Groq Console](https://console.groq.com/keys). Add `GROQ_API_KEY=your-key` to `task-manager-api/.env`, alongside `JWT_SECRET` and `MONGO_URI`. If `.env` already exists, edit it without replacing the file. Do not paste the key into chat, frontend settings, source code, or Git.
4. Start MongoDB, then start the backend from `task-manager-api/` using `npm start`.
5. From the repository root, start the frontend with `npm run dev`. The frontend uses `VITE_API_URL` if set, otherwise it connects to `http://localhost:5000`.

The `.env` file is ignored by Git. `.env.example` contains only placeholders. The Groq key is read only by the backend and is never sent to React; the frontend receives only the generated description. The interface warns that the title is sent to an external AI provider, so do not include sensitive information.

For Docker Compose, set `GROQ_API_KEY` in the shell before `docker compose up --build`; Compose passes it only to the backend container. Groq API access, model availability, rate limits, and any charges depend on the current provider terms and account eligibility. See the repository's `README-DOCKER.md` for the local Compose workflow.

### Generate-description endpoint

`POST http://localhost:5000/api/ai/generate-description`

The endpoint requires the same bearer token used by other authenticated task features.

```json
{
  "title": "Complete the database assignment"
}
```

Successful response (`200`):

```json
{
  "success": true,
  "description": "Review the requirements and complete the database assignment."
}
```

The description text comes from Groq; the example is illustrative. Empty, non-string, and over-160-character titles return `400`. Missing or invalid AI configuration, unavailable models, account restrictions, and upstream rate limits return safe `503` responses; timeouts return `504`, and network or other provider failures return safe `502` responses. Provider credentials and internal error details are not returned to the browser.

The backend permits one AI request per authenticated user per minute. This conservative in-memory limit cannot be bypassed by changing the task title or request body, which is not yet a stable task ID at generation time. It resets on server restart and is not shared across multiple backend instances; production deployments should use a shared rate-limit store. A failed AI call also consumes the cooldown.

### Manual verification with Postman

1. Sign in through the existing `POST http://localhost:5000/login` endpoint and copy its token.
2. Create a Postman `POST` request to `http://localhost:5000/api/ai/generate-description`.
3. Set **Authorization** to **Bearer Token** and paste the token. Set `Content-Type: application/json`.
4. Send `{"title":"Complete the database assignment"}`. With a valid locally configured key and available provider quota, expect HTTP `200` and a non-empty `description`.
5. Send an empty title or a title longer than 160 characters; expect HTTP `400`.
6. Send a request without a token; expect HTTP `401`. Make a second valid request within one minute; expect HTTP `429` and a `Retry-After` header.
7. For the missing-key path, temporarily remove or blank `GROQ_API_KEY` in the local backend `.env`, restart the backend, then send a valid title; expect HTTP `503`. Restore the key locally if available. To test an invalid key, use a temporary invalid local value and restart; expect a safe failure response, then restore the key. Never share either key.

To verify a real response locally in PowerShell, first start the backend with the valid key in `.env`, then sign in through the app and copy your JWT into the command below. A successful call returns `{ "success": true, "description": "..." }`. If the model is unavailable, check its current status in Groq's model catalog and verify your account access and usage limits.

```powershell
$headers = @{ Authorization = "Bearer YOUR_JWT" }
$body = @{ title = "Complete the database assignment" } | ConvertTo-Json
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:5000/api/ai/generate-description" `
  -Headers $headers `
  -ContentType "application/json" `
  -Body $body
```

### Automated tests

The AI route tests use injected mock generation functions and make no paid API requests:

```powershell
cd task-manager-api
npm test
```

They cover successful response shape, title validation, missing configuration, sanitized Groq failures, authenticated access, and per-user cooldown enforcement. Groq SDK calls are mocked; a live response requires a valid key and is not part of automated testing.

### Practical viva

- **Why keep the API key on the backend?** Browser code is visible to users; a server-side key avoids exposing credentials.
- **What is graceful degradation?** Task CRUD remains usable manually when AI generation is unavailable.
- **Why show a loading state?** AI requests take time; feedback prevents confusion and repeated submissions.
- **What happens when AI fails?** The UI shows a safe error and users can enter a description themselves.
- **What are the privacy implications?** The task title is sent to a third-party provider, so sensitive information should not be included.
- **Why is AI output editable?** Generated text can be incorrect or unsuitable and should be reviewed before saving.
- **Why rate-limit?** It controls repeated usage and helps avoid unnecessary provider costs.
- **Why not commit `.env`?** It may contain credentials that must remain private.
- **How does React communicate with Express?** It sends an authenticated JSON `fetch` request to the backend route.
- **How are provider failures tested without paid requests?** Automated tests inject mock Groq clients instead of making provider API calls.

## Example Requests

### Register
```http
POST http://localhost:5000/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "secret123"
}
```

### Login
```http
POST http://localhost:5000/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "secret123"
}
```

Copy the returned `token` and include it on protected requests:

```http
Authorization: Bearer <token>
```

### Get the current user
```http
GET http://localhost:5000/me
Authorization: Bearer <token>
```

### Get all tasks
```http
GET http://localhost:5000/tasks
Authorization: Bearer <token>
```

### Create a task
```http
POST http://localhost:5000/tasks
Content-Type: application/json

{
  "title": "Learn MongoDB",
  "description": "Practice schema design in Mongoose",
  "completed": false,
  "priority": "high"
}
```

### Update a task
```http
PUT http://localhost:5000/tasks/66d8f0d0b0d8230012345678
Content-Type: application/json

{
  "title": "Learn Mongoose",
  "description": "Review validation and queries",
  "completed": true,
  "priority": "medium"
}
```

### Delete a task
```http
DELETE http://localhost:5000/tasks/66d8f0d0b0d8230012345678
```

## Example Response
```json
{
  "success": true,
  "data": {
    "_id": "66d8f0d0b0d8230012345678",
    "title": "Learn MongoDB",
    "description": "Practice schema design in Mongoose",
    "completed": false,
    "priority": "high",
    "createdAt": "2025-09-03T10:00:00.000Z",
    "updatedAt": "2025-09-03T10:00:00.000Z"
  }
}
```

## Middleware Used

### 1. Global Request Logging Middleware
Logs each request method and URL with a timestamp.

### 2. JSON Body Parser
Uses `express.json()` to parse incoming JSON.

### 3. Content-Type Validation Middleware
Rejects POST and PUT requests without `Content-Type: application/json`.

### 4. Route-Specific ID Validation Middleware
Validates the MongoDB ObjectId before querying the database.

### 5. 404 Middleware
Returns a structured JSON error for undefined routes.

### 6. Global Error Handler
Catches unexpected errors and returns a safe JSON response.

## Viva Questions and Answers

### Question 1: What is the purpose of Mongoose schema validation?
Schema validation helps ensure that only valid data is saved to the database. It enforces requirements such as required fields, allowed values, and data types.

### Question 2: Why do we use `mongoose.connect()` in the server?
It creates the connection between the Express application and the MongoDB database so data can be saved and retrieved persistently.

### Question 3: What is the difference between `find()` and `findById()`?
`find()` returns multiple documents matching a query, while `findById()` retrieves a single document using its unique MongoDB `_id`.

### Question 4: Why is the `priority` field important in schema design?
It standardizes possible values and prevents invalid data such as unsupported priorities. This improves consistency and data quality.

### Question 5: Why is `.env` used for MongoDB connection details?
Sensitive configuration values, such as database URIs, should not be hardcoded into the source code. Storing them in `.env` keeps the project cleaner and safer.

## Notes
- This practical uses MongoDB and Mongoose instead of an in-memory array.
- Data persists across server restarts.
- The API routes remain similar to Practical 4, but IDs are stored and validated as MongoDB ObjectIds.
