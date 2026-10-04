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
