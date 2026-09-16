# AgriTrack AI System Documentation

AgriTrack AI is a livestock and farm-management system. It provides a web dashboard for managing animals, health records, breeding, feed, finance, RFID/QR scanning, notifications, and farm analytics.

This document describes the current implementation in this repository. It is intended for developers, operators, and project reviewers.

## 1. System Overview

The system has three main parts:

- **Frontend:** React 19, TypeScript, Vite, React Router, Tailwind CSS, Axios, Recharts, and Lucide icons.
- **Backend:** Go, Gin, GORM, JWT authentication, and layered handler/service/repository packages.
- **Database:** PostgreSQL when configured and reachable; SQLite fallback for local development and single-instance deployments.

In development, the frontend runs on port `5173` and proxies `/api` requests to the backend on port `8080`.

```text
Browser
  |
  | React/Vite application
  | Axios requests to /api/v1
  v
Go/Gin API :8080
  |
  | handlers -> services -> repositories
  v
GORM
  |
  +--> PostgreSQL
  |
  +--> SQLite fallback: agritrack.db
```

## 2. Main User Features

### Authentication

- Login with email and password.
- User registration through the API.
- Login returns a JWT and user summary.
- The frontend stores the JWT in `localStorage` and sends it as a Bearer token on later Axios requests.
- The frontend redirects users without a stored token to `/login`.

The backend seeds a development account when the database starts and the account does not already exist:

```text
Email:    farmer@agritrack.ai
Password: Password123
```

Change or remove this account before using the system with real data.

### Dashboard and Analytics

The dashboard displays:

- Total livestock
- Total health/vaccination records
- Active pregnancies
- Total feed cost
- Total expenses
- Expense breakdown
- Health-status breakdown
- Species breakdown

The dashboard can also be exported as a PDF in the browser.

### Livestock Management

Users can:

- Create animal records.
- View all animals.
- Open an individual animal profile.
- Update animal information.
- Delete animal records.
- Search livestock by animal code or RFID from the API.
- Export the displayed livestock list to CSV.

Animal profiles include general information, weight records, activity history, and generated QR tags.

### Health and Vaccination Records

The Medical & Health page records vaccines, medicines, vitamins, dates, animal IDs, and costs.

### Breeding

The Breeding page manages breeding records and pregnancy information. Dashboard analytics count records whose pregnancy status is `Pending` or `Confirmed` as active pregnancies.

### Feed and Finance

Feed records track feed-related activity and cost. Finance records track income and expenses. Dashboard analytics aggregate feed costs and expense totals.

### RFID and QR Scanner

The Scanner page supports:

- RFID input.
- QR/barcode camera scanning through the frontend scanner libraries.
- Viewing an animal profile after a scan.
- Logging activities such as feeding, vaccination, health checkup, barn entry, and barn exit.
- Selecting a location such as Main Gate, Barn A, Barn B, Feeding Area, or Clinic.

### Notifications and Settings

The dashboard layout periodically requests unread notifications and refreshes them every 30 seconds. Users can mark notifications as read, switch between light and dark mode, and sign out.

## 3. Repository Structure

```text
.
├── Dockerfile                 # Multi-stage production image
├── fly.toml                   # Fly.io deployment configuration
├── backend/
│   ├── cmd/main.go            # API startup and route registration
│   ├── configs/database.go    # Database connection, migration, and seed
│   ├── internal/domain/       # GORM data models
│   ├── internal/handler/      # HTTP request handlers
│   ├── internal/service/      # Application/business services
│   ├── internal/repository/   # Database access
│   ├── internal/middleware/   # JWT and role middleware
│   └── pkg/utils/             # Password and JWT helpers
└── frontend/
    ├── src/App.tsx            # Client routes and protected layout
    ├── src/pages/             # Application screens
    ├── src/components/        # Shared UI and AI chat widget
    ├── src/layouts/           # Dashboard shell and navigation
    └── src/services/api.ts    # Axios client and token interceptor
```

## 4. Frontend Architecture

`frontend/src/App.tsx` defines the client routes. The root route redirects to `/login`. Dashboard routes are wrapped by `PrivateRoute`, which checks whether a token exists in `localStorage`.

`DashboardLayout` provides the shared sidebar, navigation, notification polling, theme toggle, sign-out action, and AI assistant widget.

The Axios client in `frontend/src/services/api.ts` uses:

- `VITE_API_URL` when it is set.
- Otherwise `/api/v1`, which is proxied by Vite to `http://localhost:8080` during development.

The main page routes are:

| Route | Purpose |
| --- | --- |
| `/login` | Login form |
| `/dashboard` | Analytics dashboard |
| `/livestock` | Livestock list and creation |
| `/livestock/:id` | Animal profile, weights, activity, and QR tag |
| `/vaccinations` | Medical and vaccination records |
| `/breeding` | Breeding records |
| `/feed` | Feed records |
| `/finance` | Financial records |
| `/scanner` | RFID and QR/barcode workflows |
| `/settings` | User-facing settings form |

## 5. Backend Architecture

The Go backend follows a layered structure:

1. **Handlers** bind JSON requests, validate basic input, call a service, and return HTTP responses.
2. **Services** implement application operations such as login, registration, livestock operations, and analytics.
3. **Repositories** use GORM to read and write domain models.
4. **Domain models** define the database entities and relationships.

At startup, `backend/cmd/main.go`:

1. Loads `.env` values using `godotenv`.
2. Connects to PostgreSQL or falls back to SQLite.
3. Runs GORM `AutoMigrate` for the domain models.
4. Seeds the default demo user.
5. Creates the Gin router and CORS middleware.
6. Registers API routes.
7. Starts the server on `PORT`, defaulting to `8080`.

## 6. API Endpoints

All application endpoints are under `/api/v1`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Authenticate and return a JWT |
| `GET` | `/health` | Health check at `/api/v1/health` |
| `GET` | `/analytics/dashboard` | Return dashboard aggregates |
| `POST` | `/livestock/` | Create livestock |
| `GET` | `/livestock/` | List livestock |
| `GET` | `/livestock/:id` | Get one animal |
| `GET` | `/livestock/rfid/:rfid` | Find an animal by RFID or animal code |
| `PUT` | `/livestock/:id` | Update an animal |
| `DELETE` | `/livestock/:id` | Delete an animal |
| `POST` | `/livestock/:id/weight` | Add a weight record |
| `GET` | `/livestock/:id/weight` | List animal weight records |
| `POST` | `/vaccinations/` | Create a health record |
| `GET` | `/vaccinations/` | List health records |
| `POST` | `/breeding/` | Create a breeding record |
| `GET` | `/breeding/` | List breeding records |
| `POST` | `/feed/` | Create a feed record |
| `GET` | `/feed/` | List feed records |
| `POST` | `/finance/` | Create a finance record |
| `GET` | `/finance/` | List finance records |
| `GET` | `/notifications/` | List unread notifications |
| `PUT` | `/notifications/:id/read` | Mark a notification as read |
| `POST` | `/activities/` | Create an RFID/activity record |
| `GET` | `/activities/` | List activities |
| `GET` | `/activities/livestock/:id` | List activities for one animal |

A successful login request has the following general shape:

```json
{
  "email": "farmer@agritrack.ai",
  "password": "Password123"
}
```

The response contains a `token` and a user object. Do not log or share the token.

## 7. Database

The application runs GORM migrations for these model groups:

- Roles and permissions
- Users
- Livestock and RFID tags
- Health records and vaccinations
- Breeding records
- Feed records
- Finance records
- Weight records
- Notifications
- RFID activities

### PostgreSQL

The backend reads these environment variables:

```text
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
JWT_SECRET
PORT
```

The repository includes `backend/docker-compose.yml` with a PostgreSQL 16 service for local database development:

```powershell
docker compose -f backend/docker-compose.yml up -d
```

Set the backend environment to match that service, then start the API from the `backend` directory.

### SQLite fallback

If PostgreSQL cannot be opened, the backend falls back to SQLite. The database path is controlled by `DB_PATH`; if it is not set, the backend uses `agritrack.db` in its working directory.

The SQLite fallback is convenient for development and a single-instance deployment, but it is not a substitute for a highly available multi-instance database.

## 8. Local Development

### Requirements

- Node.js 20 or newer
- npm
- Go compatible with `backend/go.mod`
- PostgreSQL, or permission to use the SQLite fallback

### Start the backend

From the repository root:

```powershell
Set-Location backend
go run ./cmd
```

The API starts at `http://localhost:8080`.

Check it with:

```powershell
Invoke-RestMethod http://localhost:8080/api/v1/health
```

### Start the frontend

Open another terminal from the repository root:

```powershell
Set-Location frontend
npm install
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/` in a browser.

### Frontend checks

```powershell
Set-Location frontend
npm run lint
npm run build
```

### Backend checks

```powershell
Set-Location backend
go test ./...
```

## 9. Production Build and Deployment

The root `Dockerfile` uses three stages:

1. Builds the frontend with Node.
2. Builds the Go API binary.
3. Copies the frontend output into `/app/static` and runs the API from an Alpine image.

Build and run locally:

```powershell
docker build -t agritrack-ai .
docker run --rm -p 8080:8080 agritrack-ai
```

The Go server serves the built frontend from `/app/static` for non-API routes. The container exposes port `8080`.

`fly.toml` configures Fly.io with:

- Application name `agritrack-ai`.
- Region `sin`.
- Port `8080`.
- A persistent volume mounted at `/data`.
- SQLite database path `/data/agritrack.db`.

Before deploying, configure the production environment and secrets, especially `JWT_SECRET`. Do not use development passwords or fallback secrets in production.

## 10. Security and Operational Notes

The current implementation is suitable for development and demonstration, but the following items should be addressed before production:

1. **Protect resource routes.** JWT middleware exists in `backend/internal/middleware/jwt_middleware.go`, but `backend/cmd/main.go` does not currently attach it to the livestock, health, breeding, feed, finance, notification, activity, or analytics route groups.
2. **Replace fallback secrets.** `JWT_SECRET` has a code fallback of `supersecretkey`. Always set a long, random production secret and remove the fallback for production builds.
3. **Remove the seeded demo account.** The default `farmer@agritrack.ai` account is useful for local testing but should not be deployed with a known password.
4. **Protect AI credentials.** The AI chat widget currently calls the Groq API directly from the browser. API keys must be kept on a backend service or serverless function, not shipped in frontend JavaScript.
5. **Restrict CORS.** The current API allows `*`. Production deployments should allow only trusted frontend origins.
6. **Validate authorization.** Role middleware exists, but role-based access must be applied to route groups and tested for each role.
7. **Improve frontend session handling.** A token existing in `localStorage` is treated as authenticated by the client. The API remains the authority and should validate expiry and authorization on every protected request.
8. **Use secure transport.** Production traffic should use HTTPS, secure secret storage, and controlled database access.

## 11. Typical Request Flow

A normal login and dashboard request works as follows:

1. A user opens the React frontend and is sent to `/login`.
2. The login form sends `POST /api/v1/auth/login` through Axios.
3. Vite proxies that request to `http://localhost:8080` during development.
4. Gin binds the request and calls the auth service.
5. The user repository looks up the email in the database.
6. The password hash is checked with the password utility.
7. The API creates a JWT containing the user ID, role ID, and a 72-hour expiry.
8. The frontend stores the token and user summary in `localStorage` and navigates to `/dashboard`.
9. Axios adds `Authorization: Bearer <token>` to subsequent requests.
10. The dashboard requests `/api/v1/analytics/dashboard` and renders the returned aggregates and charts.

## 12. Troubleshooting

### Login returns "Invalid email or password"

- Confirm the backend is running on port `8080`.
- Confirm the request reaches the expected database.
- Start the backend from `backend` so migrations and the seed function run.
- Try the development account listed in the Authentication section.
- If the account already exists with a different password, update it in the database or remove the local SQLite database and restart for a clean development database.

### Frontend API requests fail

- Check that the frontend is using `/api/v1` or a correct `VITE_API_URL`.
- Check that the backend is reachable at `http://localhost:8080/api/v1/health`.
- Review the Vite terminal and backend terminal for proxy or database errors.

### Dashboard has no data

The dashboard calculates aggregates from the database. Register livestock and add health, breeding, feed, finance, and activity records before expecting non-zero totals.

### PostgreSQL connection fails

The backend logs a PostgreSQL failure and attempts SQLite fallback. Check the PostgreSQL container, credentials, port `5432`, and environment variables if PostgreSQL is required.
