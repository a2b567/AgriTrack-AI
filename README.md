# AgriTrack AI - Livestock & Farm Management System

AgriTrack AI is a modern, full-stack livestock and farm management web application designed for tracking animal records, health & vaccinations, breeding, feeding schedules, financial records, RFID/QR barcode scanning, real-time activity logging, and interactive farm analytics.

---

## Table of Contents

- [1. Tech Stack (What Was Used to Build This)](#1-tech-stack-what-was-used-to-build-this)
- [2. System Architecture & How It Works](#2-system-architecture--how-it-works)
- [3. Key Features](#3-key-features)
- [4. Environment Variables](#4-environment-variables)
- [5. How to Build & Run locally](#5-how-to-build--run-locally)
- [6. Docker & Production Deployment](#6-docker--production-deployment)
- [7. API Endpoints Reference](#7-api-endpoints-reference)
- [8. Security & Production Checklist](#8-security--production-checklist)

---

## 1. Tech Stack (What Was Used to Build This)

### **Backend Technologies**
- **Language**: Go (v1.23+)
- **Web Framework**: [Gin Web Framework](https://github.com/gin-gonic/gin) (`v1.12.0`) - High-performance HTTP web framework.
- **ORM**: [GORM](https://gorm.io/) (`v1.31.1`) - Developer-friendly ORM for database mapping and migrations.
- **Database Support**:
  - **PostgreSQL**: Primary production database driver (`gorm.io/driver/postgres`).
  - **SQLite**: Zero-CGO pure Go SQLite driver (`github.com/glebarez/sqlite`) used as an automatic local development and single-instance fallback (`agritrack.db`).
- **Authentication & Security**:
  - **JWT Tokens**: `github.com/golang-jwt/jwt/v5` for stateless user sessions.
  - **Password Hashing**: `golang.org/x/crypto/bcrypt` for secure password storage.
- **Environment Management**: `github.com/joho/godotenv` to load `.env` configurations.

### **Frontend Technologies**
- **Framework**: React 19 + TypeScript (`vite` build engine).
- **Routing**: `react-router-dom` (v7) with protected route guards.
- **Styling & Components**:
  - Tailwind CSS (`v3.4`) for utility-first responsive layout design.
  - `@base-ui/react`, `clsx`, `tailwind-merge`, and `class-variance-authority` (cva).
  - `lucide-react` for modern icon set.
- **State & Data Fetching**:
  - Axios HTTP client with request/response interceptors for automatic JWT Bearer header injection.
  - `@tanstack/react-query` for query caching.
- **Data Visualization & Export**:
  - `recharts` for dynamic financial, health, and species chart visualizers.
  - `jspdf` & `html2canvas` for client-side PDF export of dashboard reports.
- **RFID, QR & Barcode Tools**:
  - `html5-qrcode` & `@zxing/library` for real-time camera QR/barcode scanning.
  - `qrcode.react` for generating animal tag QR codes.

### **DevOps & Infrastructure**
- **Docker**: Multi-stage `Dockerfile` (Node builder + Go builder + Alpine runner).
- **Docker Compose**: Pre-configured PostgreSQL database service for local dev.
- **Cloud Deployment**: `fly.toml` for deployment to Fly.io with persistent disk volumes.

---

## 2. System Architecture & How It Works

### High-Level Architecture Diagram

```text
               +----------------------------------+
               |        Browser / Client          |
               | React 19 + Vite + Tailwind CSS   |
               +----------------------------------+
                                |
                                | HTTP / REST API (Axios)
                                v
               +----------------------------------+
               |        Go / Gin Web API          |
               |         (Port :8080)             |
               +----------------------------------+
                                |
             +------------------+------------------+
             |                  |                  |
             v                  v                  v
     [ HTTP Handlers ] --> [ Services ] --> [ Repositories ]
                                                   |
                                                   v
                                           +---------------+
                                           |   GORM ORM    |
                                           +---------------+
                                                   |
                             +---------------------+---------------------+
                             | (Primary)                                 | (Fallback)
                             v                                           v
                   +------------------+                        +-------------------+
                   |  PostgreSQL DB   |                        | SQLite Database   |
                   |   (Port 5432)    |                        |  (agritrack.db)   |
                   +------------------+                        +-------------------+
```

### Request & Data Flow
1. **Authentication Layer**: Users log in at `/login`. The Gin API validates credentials against hashed passwords in the DB using `bcrypt`. Upon success, it returns a 72-hour signed JWT.
2. **Client-side Storage**: The frontend saves the JWT token in `localStorage`. Axios interceptors attach `Authorization: Bearer <token>` to all downstream backend requests.
3. **Database Dual-Mode**:
   - At startup, the API attempts to connect to PostgreSQL using `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT`.
   - If PostgreSQL is unreachable, the system automatically falls back to SQLite (`agritrack.db`), running GORM `AutoMigrate` for schema updates and seeding a development administrator (`farmer@agritrack.ai` / `Password123`).
4. **Layered Backend Pattern**:
   - **Handlers** (`backend/internal/handler`): Handle HTTP request binding, validation, and JSON responses.
   - **Services** (`backend/internal/service`): Execute business logic and analytics computations.
   - **Repositories** (`backend/internal/repository`): Execute GORM database queries.

---

## 3. Key Features

- **Dashboard Analytics**: Real-time aggregation of total livestock, active pregnancies, feed costs, expense breakdowns, health metrics, and species distributions. PDF export supported.
- **Livestock Management**: Comprehensive animal registry tracking animal code, species, breed, gender, birth date, weight history, activity status, and printable QR tags.
- **Medical & Vaccination Records**: Log vaccines, treatments, dosage, costs, and veterinarian details.
- **Breeding Management**: Track artificial insemination/mating dates, pregnancy status, expected delivery dates, and offspring records.
- **Feed & Financial Tracking**: Log feed inventory/usage and income/expense records with category breakdowns.
- **RFID & QR Code Scanner**: Scan animal tags directly via webcam or hardware RFID reader to display profiles or log barn activities (feeding, checkup, entry/exit).
- **Notifications**: Automated polling for system alerts (e.g. upcoming vaccinations, low feed warnings).

---

## 4. Environment Variables

Configure environment variables in `backend/.env` or inside your deployment environment:

| Variable | Description | Default / Example |
| --- | --- | --- |
| `PORT` | API server port | `8080` |
| `JWT_SECRET` | Secret key used to sign JWTs | `supersecretkey` *(change in prod!)* |
| `DB_HOST` | PostgreSQL hostname | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |
| `DB_NAME` | PostgreSQL database name | `agritrack` |
| `DB_PATH` | Path for SQLite fallback file | `agritrack.db` |

---

## 5. How to Build & Run Locally

### Prerequisites
- **Node.js**: v20 or newer
- **Go**: v1.23 or newer
- **Docker & Docker Compose** (Optional, for running PostgreSQL locally)

---

### Step 1: Start Database (Optional PostgreSQL)

To run with PostgreSQL, start the database container:
```powershell
# From root directory
docker compose -f backend/docker-compose.yml up -d
```
*(If omitted, AgriTrack AI will automatically start using the SQLite fallback database `backend/agritrack.db`.)*

---

### Step 2: Build & Start the Backend

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
2. Download Go dependencies:
   ```powershell
   go mod download
   ```
3. Run the Go backend server:
   ```powershell
   go run ./cmd
   ```
4. Verify the API is running by testing the health check endpoint:
   ```powershell
   Invoke-RestMethod http://localhost:8080/api/v1/health
   ```
   *Expected Response:* `{"status": "ok"}`

---

### Step 3: Build & Start the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev -- --host 127.0.0.1
   ```
4. Open your browser at `http://127.0.0.1:5173`.

#### Default Credentials (Seeded Demo Account):
- **Email**: `farmer@agritrack.ai`
- **Password**: `Password123`

---

### Step 4: Verification & Linting

Run automated checks across the codebase:
```powershell
# Run frontend linter and build test
cd frontend
npm run lint
npm run build

# Run backend unit tests
cd ../backend
go test ./...
```

---

## 6. Docker & Production Deployment

### Building & Running via Docker

The repository features a 3-stage `Dockerfile` that packages both frontend static assets and the compiled Go binary into a minimal Alpine Linux image.

1. Build the production Docker image from the repository root:
   ```powershell
   docker build -t agritrack-ai .
   ```
2. Run the production container:
   ```powershell
   docker run --rm -p 8080:8080 -e JWT_SECRET="your_production_secret_key" agritrack-ai
   ```
3. Access the complete production app at `http://localhost:8080`.

---

### Deploying Frontend to Firebase Hosting

The React frontend is configured for Firebase Hosting under project `agritrack-ai-app`:

1. Build the production frontend:
   ```powershell
   cd frontend
   npm run build
   ```
2. Deploy to Firebase:
   ```powershell
   firebase deploy --only hosting --project agritrack-ai-app
   ```
3. Live URL: **[https://agritrack-ai-app.web.app](https://agritrack-ai-app.web.app)**

---

### Connecting & Deploying Database to Supabase

AgriTrack AI's Go backend seamlessly connects to **Supabase PostgreSQL** with automated table migration and default data seeding:

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a new project.
   - Under **Project Settings > Database**, find your connection string.
2. **Configure Backend Environment**:
   - Option A (Direct Connection URL):
     ```env
     DATABASE_URL=postgresql://postgres.[your-project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
     ```
   - Option B (Individual Parameters):
     ```env
     DB_HOST=db.[your-project-ref].supabase.co
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=[your-password]
     DB_NAME=postgres
     DB_SSLMODE=require
     ```
3. **Run the Backend**:
   - When the Go backend starts, GORM `AutoMigrate` automatically provisions all tables and seeds the demo account (`farmer@agritrack.ai` / `Password123`) directly onto Supabase PostgreSQL.

---

### Deploying to Fly.io

The project includes a ready-to-use `fly.toml` deployment config:

1. Install the Fly CLI and log in:
   ```powershell
   flyctl auth login
   ```
2. Deploy the app:
   ```powershell
   flyctl deploy
   ```
3. Set your production secrets (including Supabase `DATABASE_URL` and `JWT_SECRET`):
   ```powershell
   flyctl secrets set JWT_SECRET="your_secure_random_key" DATABASE_URL="postgresql://postgres.[ref]:[pwd]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require"
   ```

---

## 7. API Endpoints Reference

All endpoints are hosted under `/api/v1`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Service health status |
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Authenticate user & return JWT |
| `GET` | `/api/v1/analytics/dashboard` | Fetch aggregated dashboard metrics |
| `GET` | `/api/v1/livestock/` | List all registered animals |
| `POST` | `/api/v1/livestock/` | Create a new livestock record |
| `GET` | `/api/v1/livestock/:id` | Get individual animal details |
| `GET` | `/api/v1/livestock/rfid/:rfid` | Lookup animal by RFID or tag code |
| `PUT` | `/api/v1/livestock/:id` | Update animal record |
| `DELETE` | `/api/v1/livestock/:id` | Delete animal record |
| `POST` | `/api/v1/livestock/:id/weight` | Log a weight measurement |
| `GET` | `/api/v1/vaccinations/` | List health & vaccination records |
| `POST` | `/api/v1/vaccinations/` | Create health/vaccination record |
| `GET` | `/api/v1/breeding/` | List breeding & pregnancy records |
| `POST` | `/api/v1/breeding/` | Create breeding record |
| `GET` | `/api/v1/feed/` | List feed logs |
| `POST` | `/api/v1/feed/` | Create feed log |
| `GET` | `/api/v1/finance/` | List financial logs |
| `POST` | `/api/v1/finance/` | Create income/expense log |
| `GET` | `/api/v1/notifications/` | List unread user notifications |
| `PUT` | `/api/v1/notifications/:id/read` | Mark notification as read |
| `GET` | `/api/v1/activities/` | List RFID activity logs |
| `POST` | `/api/v1/activities/` | Log RFID/barcode activity event |

---

## 8. Security & Production Checklist

1. **JWT Secret**: Change the default `JWT_SECRET` in production.
2. **CORS Configuration**: Restrict allowed origins in `backend/cmd/main.go` from `*` to your production domain name.
3. **Demo User Account**: Remove or change the password for `farmer@agritrack.ai` before hosting live production data.
4. **HTTPS Enforcement**: Ensure TLS/SSL encryption is active for all web & API traffic.