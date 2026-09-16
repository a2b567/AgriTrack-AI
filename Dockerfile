# ========================
# Stage 1: Build Frontend
# ========================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ========================
# Stage 2: Build Backend
# ========================
FROM golang:1.23-alpine AS backend-builder

RUN apk add --no-cache gcc musl-dev

WORKDIR /app/backend

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o agritrack ./cmd/main.go

# ========================
# Stage 3: Final Image
# ========================
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy backend binary
COPY --from=backend-builder /app/backend/agritrack .

# Copy built frontend into a static folder
COPY --from=frontend-builder /app/frontend/dist ./static

EXPOSE 8080

CMD ["./agritrack"]
