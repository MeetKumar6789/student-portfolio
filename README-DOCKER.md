# Docker Compose

The React/Vite frontend is in the repository root, and the Express API is in `task-manager-api/`. The frontend Dockerfile is under `frontend/`; Compose uses the repository root as its build context so the existing Vite source and package files can be built without moving them. The frontend build uses Node 20, while the backend uses Node 22.

## Start

From the repository root:

```bash
docker --version
docker compose version
docker compose up --build -d
docker compose ps
```

For AI description generation, provide `GROQ_API_KEY` through the shell before starting Compose. In PowerShell, set `$env:GROQ_API_KEY = "your-key"` locally; Compose passes it only to the backend container. Do not commit the key or put it in frontend variables. Groq API access, model availability, rate limits, and any charges depend on the current provider terms and your account eligibility.

Open the frontend at <http://localhost:5173> and the API at <http://localhost:5000>. Sign in and open **Task Manager** at `/projects` to use task CRUD and the AI description suggestion. The compose file sets a lab-only JWT secret for convenience; replace it with a private value for anything beyond local coursework.

To stop and remove containers while preserving MongoDB data:

```bash
docker compose down
docker compose up -d
```

To remove the persisted database too, run `docker compose down -v`.

`docker-compose` (with a hyphen) is the equivalent command for older Compose installations.

## Key questions

### Q1. Why must the backend use the service name `mongodb` instead of localhost?

Inside a container, `localhost` refers to that same container, not another service. Compose provides DNS on the shared network, so `mongodb` resolves to the MongoDB container and the backend connects to `mongodb:27017`.

### Q2. EXPOSE in a Dockerfile vs `ports` in docker-compose.yml?

`EXPOSE` documents the port an image's process listens on; it does not publish that port to the host. Compose `ports` publishes and maps a host port to a container port, for example `5173:80` for the frontend.

### Q3. Why run npm install in the image instead of copying node_modules?

Dependencies should be installed for the image's own operating system and architecture. Copying host `node_modules` can bring incompatible binaries, platform-specific packages, and unnecessary files into the container; the `.dockerignore` files keep those host dependencies out.
