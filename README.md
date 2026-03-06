# GhostWrite Full-Stack Project (Spring Boot + React/Vite)

This repo contains:

- Backend: Spring Boot (Java 17) in [backend/](backend/)
- Frontend: React + TypeScript + Vite in [fsd_frontend/](fsd_frontend/)

## Run Locally

### Backend

```bash
cd backend

# Option A: H2 (quick demo)
./run-h2.sh

# Option B: MySQL
# cp .env.example .env   # then set DB_PASSWORD
./run-mysql.sh
```

Backend runs on `http://localhost:8080`.

### Frontend

```bash
cd fsd_frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Deploy on Render (Recommended: 2 services)

You’ll deploy:

1) Backend as a **Web Service** (Java)
2) Frontend as a **Static Site** (Vite build)

### 1) Backend (Render Web Service)

If your Render “Language” dropdown does not show Java, choose **Docker** (this repo includes a backend Dockerfile).

- Root directory: `backend`
- If using **Docker**: no build/start commands are needed (Render will build from `backend/Dockerfile`).
- If using a **Java** runtime: Build `sh mvnw -DskipTests package`, Start `java -jar target/fedf-backend-0.0.1-SNAPSHOT.jar`

Environment variables to set in Render:

- `SPRING_PROFILES_ACTIVE`
	- For a quick demo: `h2`
	- For MySQL: `mysql` and set DB vars below
	- For Render Postgres (persistent on Render): `postgres` and set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET` (required for real deployments; use a long random Base64 string)
- `CORS_ALLOWED_ORIGINS` (comma-separated)
	- Example: `https://YOUR-FRONTEND.onrender.com`

If using MySQL, also set:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

If using Postgres (Render database), set:

- `SPRING_DATASOURCE_URL` (JDBC)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Notes:

- Render sets `PORT` automatically; the backend is configured to bind to it.
- If you deploy with `h2`, data may be reset on redeploy/restart depending on your Render plan.

### 2) Frontend (Render Static Site)

- Root directory: `fsd_frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`

Environment variables to set in Render (these are baked into the build):

- `VITE_API_BASE_URL`
	- Example: `https://YOUR-BACKEND.onrender.com/api`
- `VITE_WS_URL`
	- Example: `https://YOUR-BACKEND.onrender.com/ws`

After both are deployed:

- Update backend `CORS_ALLOWED_ORIGINS` to the exact frontend URL.
- Confirm the frontend can call `/api/auth/...` and WebSockets connect.

## Is this project eligible for deployment?

Yes. It’s a standard deployable stack (Spring Boot + static React build). For a smooth deployment you must provide:

- A reachable database configuration (H2 for demo, or MySQL for persistence)
- Correct CORS origins (frontend URL) and a strong `JWT_SECRET`
- Correct frontend API/WS URLs via `VITE_API_BASE_URL` and `VITE_WS_URL`
