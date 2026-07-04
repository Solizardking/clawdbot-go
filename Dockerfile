# syntax=docker/dockerfile:1

# ── Stage 1: Build ────────────────────────────────────────────────────
FROM golang:1.26.4-alpine AS builder

RUN apk add --no-cache git make

WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN make build

# ── Stage 2: Runtime ──────────────────────────────────────────────────
FROM alpine:3.22

LABEL org.opencontainers.image.title="gobot-go" \
      org.opencontainers.image.description="GoBot Go runtime for the Solana GoBot ecosystem" \
      org.opencontainers.image.source="https://github.com/Solizardking/clawdbot-go" \
      org.opencontainers.image.documentation="https://github.com/solizardking/solana-clawd" \
      org.opencontainers.image.licenses="MIT"

RUN apk add --no-cache ca-certificates tzdata i2c-tools

WORKDIR /app

COPY --from=builder /src/build/gobot /app/gobot

# Create workspace
RUN mkdir -p /root/.gobot/workspace/vault/decisions \
             /root/.gobot/workspace/vault/lessons \
             /root/.gobot/workspace/vault/trades \
             /root/.gobot/workspace/vault/research \
             /root/.gobot/workspace/vault/inbox

EXPOSE 18790

ENTRYPOINT ["/app/gobot"]
CMD ["agent"]
