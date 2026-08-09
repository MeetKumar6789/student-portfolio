# Task Manager API - Practical 5

## Objective
This project extends the previous Task Management REST API by integrating MongoDB with Mongoose. Instead of keeping tasks in an in-memory array, the application stores and retrieves tasks from a MongoDB database using a schema-driven model.

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

### GET /tasks
Returns all tasks from MongoDB.

### GET /tasks/:id
Returns a single task by MongoDB ObjectId.

### POST /tasks
Creates a new task.

### PUT /tasks/:id
Updates an existing task.

### DELETE /tasks/:id
Deletes a task.

### GET /test-error
Deliberately triggers the global error handler.

## Example Requests

### Get all tasks
```http
GET http://localhost:5000/tasks
```

### Get task by ID
```http
GET http://localhost:5000/tasks/66d8f0d0b0d8230012345678
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
