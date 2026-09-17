# ========================
# Stage 1: Build Backend
# ========================
FROM golang:alpine AS backend-builder

ENV GOWORK=off
ENV CGO_ENABLED=0
ENV GOOS=linux

WORKDIR /app/backend

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./
RUN go build -ldflags="-w -s" -o agritrack ./cmd/main.go

# ========================
# Stage 2: Final Image
# ========================
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

COPY --from=backend-builder /app/backend/agritrack .

EXPOSE 8080

CMD ["./agritrack"]
