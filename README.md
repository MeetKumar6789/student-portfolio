# Student Portfolio & Task Management System

**Practical 1–11 | Full-Stack Development, Asynchronous Processing, Caching & Docker**

A full-stack student portfolio developed using React, Vite, Node.js, Express, and MongoDB. The project progressively integrates frontend development, REST API design, database operations, authentication, task management, caching, asynchronous event-driven processing, and containerization using Docker Compose.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-objectives)
3. [Technology Stack](#3-technology-stack)
4. [Practical 1–11 Overview](#4-practical-111-overview)
5. [System Architecture](#5-system-architecture)
6. [Project Structure](#6-project-structure)
7. [Features](#7-features)
8. [Installation and Execution](#8-installation-and-execution)
9. [Docker Setup](#9-docker-setup)
10. [API Documentation](#10-api-documentation)
11. [Caching Implementation](#11-caching-implementation)
12. [Asynchronous Processing and Event-Driven Architecture](#12-asynchronous-processing-and-event-driven-architecture)
13. [Testing and Verification](#13-testing-and-verification)
14. [Environment Configuration](#14-environment-configuration)
15. [Expected Results](#15-expected-results)
16. [Learning Outcomes](#16-learning-outcomes)
17. [Conclusion](#17-conclusion)

---

## 1. Project Overview

The Student Portfolio & Task Management System combines a personal portfolio website with a task management backend.

The frontend provides the portfolio interface, project information, contact form, and event monitoring features. The backend exposes REST APIs for authentication and task management. MongoDB stores application data, while NodeCache improves the performance of frequently accessed task endpoints.

The application also demonstrates asynchronous processing, event-based communication within the frontend, and Docker-based deployment of the frontend, backend, and database.

## 2. Objectives

- Develop a responsive portfolio using React and Vite.
- Build RESTful APIs using Node.js and Express.
- Connect the backend to MongoDB using Mongoose.
- Implement user registration, login, and JWT-based authentication.
- Perform task creation, retrieval, updating, and deletion.
- Validate user input and protect API routes.
- Improve API response performance through in-memory caching.
- Demonstrate asynchronous operations using Promises and async/await.
- Implement a custom event bus and live event monitoring.
- Fetch GitHub repository information asynchronously.
- Containerize the application using Docker and Docker Compose.
- Maintain persistent database storage using a Docker volume.

## 3. Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, JavaScript, HTML, CSS |
| Frontend tooling | Vite, npm |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| Validation | Server-side input validation and middleware |
| Caching | NodeCache, 60-second TTL |
| Asynchronous processing | Promises, async/await, Fetch API |
| Event-driven design | Custom JavaScript event bus |
| External API | GitHub REST API |
| Containerization | Docker, Docker Compose |
| Web server | Nginx |
| Version control | Git, GitHub |

## 4. Practical 1–11 Overview

The project evolves through the following development stages.

| Practical | Area | Implementation |
|---|---|---|
| 1–4 | Portfolio foundation | Frontend development, portfolio components, styling, navigation, and application structure |
| 5 | Task management and database | Task model, MongoDB integration, and CRUD operations |
| 6–8 | Backend and application integration | Progressive development of API functionality, authentication, validation, and frontend/backend integration |
| 9 | API performance | NodeCache integration, 60-second TTL, cache hits and misses, cache invalidation, and performance testing |
| 10 | Asynchronous and event-driven architecture | Async contact processing, GitHub repository fetching, custom event bus, and event monitor |
| 11 | Docker containerization | Docker images, Compose services, inter-container networking, MongoDB persistence, and application startup |

*Note: Practicals 1–4 and 6–8 are grouped by development phase. Refer to the individual practical reports for their exact prescribed titles and marking criteria.*

### Practical 9 — Caching

The backend uses NodeCache to cache frequently accessed task data.

- Cache time-to-live: 60 seconds.
- Cached endpoints include task-list and individual-task reads.
- Create, update, and delete operations invalidate affected cache entries.
- Cache statistics and cache clearing support verification.
- Repeated reads can be compared to observe cache hits and misses.

### Practical 10 — Asynchronous Processing and Event-Driven Architecture

The portfolio demonstrates asynchronous operations without blocking the user interface.

- Promise-based contact processing.
- Async/await for asynchronous workflows.
- Loading, success, empty, and error states.
- GitHub repository fetching.
- Custom event bus for event dispatching.
- Event monitor for recent application events.
- Error handling using try/catch/finally.
- Optional failure simulation for testing error flows.

Events include:

- `CONTACT_FORM_SUBMITTED`
- `MESSAGE_PROCESSING_STARTED`
- `MESSAGE_PROCESSING_COMPLETED`
- `MESSAGE_PROCESSING_FAILED`
- `REPOSITORIES_FETCH_STARTED`
- `REPOSITORIES_FETCH_COMPLETED`
- `REPOSITORIES_FETCH_FAILED`

Contact processing is simulated; it does not send real emails or use a production message broker.

### Practical 11 — Dockerized Application

Docker Compose runs the frontend, backend, and MongoDB as separate services.

- Frontend served through Nginx.
- Express backend exposed on port 5000.
- MongoDB exposed on port 27017.
- Frontend exposed on port 5173.
- Internal communication through a Docker network.
- Backend connects to MongoDB using the service hostname `mongodb`.
- MongoDB uses a named volume for persistent data.
- Backend startup depends on MongoDB's health check.

## 5. System Architecture

```text
                  User / Browser
                        |
                        v
              React + Vite Frontend
                  Port 5173
                        |
                        v
                Express REST API
                  Port 5000
                        |
              +---------+---------+
              |                   |
              v                   v
        JWT Authentication   NodeCache
              |              TTL: 60 sec
              +---------+---------+
                        |
                        v
                    MongoDB
                  Port 27017
                        |
                        v
               Persistent Data Volume
```

The frontend communicates with the backend through HTTP requests. The backend validates requests, authenticates protected operations, uses the cache where applicable, and accesses MongoDB for persistent data.

In Docker Compose, the backend connects to MongoDB using:

`mongodb://mongodb:27017/taskdb`

The hostname `mongodb` refers to the MongoDB service on the internal Docker network.

## 6. Project Structure

```text
student-portfolio/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── api.js
│   ├── index.css
│   ├── components/
│   │   ├── Contact.jsx
│   │   ├── EventMonitor.jsx
│   │   ├── Projects.jsx
│   │   └── NavBar.jsx
│   ├── hooks/
│   │   └── useEventMonitor.js
│   └── services/
│       ├── eventBus.js
│       ├── contactService.js
│       └── githubService.js
├── task-manager-api/
│   ├── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
├── reports/
├── public/
├── package.json
├── package-lock.json
├── vite.config.js
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── README.md
└── README-DOCKER.md
```

The tree shows the principal files and directories; the exact contents depend on the current implementation.

## 7. Features

### Portfolio Frontend

- Portfolio pages and reusable React components.
- Project information and GitHub repository integration.
- Contact form with validation and asynchronous feedback.
- Event monitoring for recent application events.

### Task Management Backend

- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected task endpoints.
- Create, read, update, and delete operations.
- MongoDB persistence.
- Input validation and error handling.
- In-memory response caching.

### Docker Deployment

- Separate frontend, backend, and database containers.
- Automated image builds.
- Docker network for service communication.
- MongoDB health checks.
- Persistent database volume.
- Restartable application services.

## 8. Installation and Execution

### Prerequisites

For local development:

- Node.js and npm.
- MongoDB.
- Git.

For containerized execution:

- Docker Desktop.
- Docker Compose.

### Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd student-portfolio
```

Replace the placeholder with your actual GitHub repository URL.

### Install frontend dependencies

Run from the project root:

```bash
npm install
```

### Start the frontend

```bash
npm run dev
```

Open:

http://localhost:5173

### Start the backend locally

Open another terminal:

```bash
cd task-manager-api
npm install
node server.js
```

The backend should connect to MongoDB and listen on port 5000, provided its environment variables and database configuration are correct.

For local execution, configure the MongoDB URI and JWT secret according to your backend configuration.

### Build the frontend

From the project root:

```bash
npm run build
```

The production build is generated in the `dist/` directory.

## 9. Docker Setup

Docker Compose is the recommended way to run the complete application.

Run the following commands from the directory containing `docker-compose.yml`.

### Build the images

```bash
docker compose build
```

### Start the services

```bash
docker compose up -d
```

### Verify container status

```bash
docker compose ps
```

Expected services:

| Service | Host port | Purpose |
|---|---:|---|
| `frontend` | 5173 | Portfolio interface |
| `backend` | 5000 | REST API |
| `mongodb` | 27017 | Database |

MongoDB should report a healthy status, and the frontend and backend should be running.

### View logs

```bash
docker compose logs --tail=100
```

For a specific service:

```bash
docker compose logs --tail=50 backend
docker compose logs --tail=50 frontend
docker compose logs --tail=50 mongodb
```

### Stop the application

```bash
docker compose down
```

This stops and removes the Compose containers and network while preserving the named MongoDB volume by default.

**Important:** Do not use `docker compose down -v` when you need to preserve your database. The `-v` option removes Compose-managed named volumes.

## 10. API Documentation

The backend uses Express and exposes authentication and task-management routes.

Base URL:

`http://localhost:5000`

### Authentication endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register a user |
| POST | `/login` | Authenticate a user |
| GET | `/me` | Retrieve the authenticated user's information |

### Task endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/tasks` | Retrieve tasks |
| POST | `/tasks` | Create a task |
| GET | `/tasks/:id` | Retrieve a specific task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

Task endpoints require authentication where configured by the backend middleware.

### Cache endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/tasks/cache/stats` | Retrieve cache statistics |
| DELETE | `/tasks/cache/clear` | Clear the task cache |

Use the actual request body and authentication format defined by your backend when testing these endpoints.

A `404 Route not found` response at `/` is possible when the root endpoint is not defined. Test the routes listed above instead.

## 11. Caching Implementation

NodeCache provides an in-memory cache for frequently accessed task data.

### Cache workflow

1. A client requests a task or task list.
2. The backend checks the cache.
3. If a valid entry exists, the cached result is returned.
4. Otherwise, the backend retrieves the data from MongoDB and caches it.
5. Entries expire after 60 seconds.
6. Task mutations invalidate affected cached data to prevent stale responses.

### Benefits

- Reduces repeated database reads.
- Improves response times for repeated requests.
- Demonstrates cache hits and misses.
- Provides a practical example of cache invalidation.

NodeCache is in-memory storage. Its contents are not persistent and are separate from the MongoDB data volume.

## 12. Asynchronous Processing and Event-Driven Architecture

The frontend uses a custom JavaScript event bus to separate event producers from consumers.

### Contact workflow

```text
User submits form
       |
       v
CONTACT_FORM_SUBMITTED
       |
       v
MESSAGE_PROCESSING_STARTED
       |
       v
Asynchronous processing
       |
       +------ Success ------> MESSAGE_PROCESSING_COMPLETED
       |
       +------ Failure ------> MESSAGE_PROCESSING_FAILED
```

### Repository workflow

```text
Projects page requests repositories
                 |
                 v
       REPOSITORIES_FETCH_STARTED
                 |
                 v
          GitHub REST API
                 |
          +------+------+
          |             |
          v             v
        Success       Failure
          |             |
          v             v
REPOSITORIES_FETCH_  REPOSITORIES_FETCH_
     COMPLETED             FAILED
```

The event monitor subscribes to events and displays recent activity. Async operations use loading states and error handling so that the interface remains responsive.

GitHub API requests can be inspected through the browser's Developer Tools under the Network tab.

## 13. Testing and Verification

Use the following checklist when demonstrating the project.

### Frontend

- [ ] The portfolio opens at `http://localhost:5173`.
- [ ] Navigation and project pages load correctly.
- [ ] Contact form validation works.
- [ ] Successful and simulated failure flows display appropriate messages.
- [ ] The event monitor displays recent events.
- [ ] GitHub repository fetching handles loading, empty, and error states.

### Backend

- [ ] The backend starts on port 5000.
- [ ] MongoDB connection succeeds.
- [ ] Registration and login work.
- [ ] Protected endpoints reject unauthenticated requests.
- [ ] Task creation, retrieval, updating, and deletion work.
- [ ] Cache statistics and invalidation can be tested.

### Docker

- [ ] All three containers are running.
- [ ] MongoDB reports healthy.
- [ ] The backend connects to MongoDB through the Docker network.
- [ ] The frontend is accessible through port 5173.
- [ ] The backend is accessible through port 5000.
- [ ] Task data persists after containers are stopped and restarted.
- [ ] The frontend production build succeeds.

## 14. Environment Configuration

Configure the environment variables required by the backend. For example:

```env
MONGO_URI=mongodb://mongodb:27017/taskdb
JWT_SECRET=replace-with-a-secure-secret
```

This example is for containerized execution. For local execution, use the MongoDB URI appropriate to your local MongoDB instance.

The Compose configuration may provide a development fallback for `JWT_SECRET`. Replace it with a secure value for your own deployment.

**Security guidelines:**

- Never commit `.env` files containing secrets.
- Never commit database credentials, access tokens, or private keys.
- Keep `.venv/` and `node_modules/` out of version control.
- Do not publish production secrets in README examples.
- Use a strong, unique JWT secret outside local demonstrations.

## 15. Expected Results

The completed project demonstrates:

- A functional React-based portfolio.
- A Node.js/Express backend connected to MongoDB.
- Authentication and protected task operations.
- CRUD functionality for task data.
- Improved repeated-read performance through caching.
- Asynchronous contact and repository workflows.
- Event-driven communication within the frontend.
- A live event monitor for recent application activity.
- Docker-based execution of the frontend, backend, and database.
- Persistent MongoDB storage across container restarts.

## 16. Learning Outcomes

After completing the project, the student gains practical experience in:

- Component-based frontend development.
- REST API development and integration.
- NoSQL database design and operations.
- Authentication, authorization, and input validation.
- Asynchronous JavaScript programming.
- Event-driven application design.
- In-memory caching and cache invalidation.
- Containerization and service networking.
- Persistent volumes and health checks.
- Git-based version control and project documentation.

## 17. Conclusion

The Student Portfolio & Task Management System brings together frontend development, backend APIs, database operations, authentication, caching, asynchronous processing, event-driven architecture, and Docker deployment in one progressive project.

Across Practicals 1–11, the application develops from a portfolio foundation into a more complete full-stack system. The final architecture demonstrates how React, Express, MongoDB, NodeCache, and Docker Compose can work together while keeping the frontend, backend, and database responsibilities separate.

The project provides a practical foundation for understanding full-stack application development, performance optimization, event handling, and containerized deployment.
