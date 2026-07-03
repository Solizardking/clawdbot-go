package main

import (
	"net/http"
	"testing"

	"github.com/8bitlabs/clawdbot/pkg/config"
)

func TestRedactedConfigMasksSecrets(t *testing.T) {
	cfg := config.DefaultConfig()
	cfg.ModelList[0].APIKey = "model-secret"
	cfg.Channels.Telegram.Token = "telegram-secret"
	cfg.Channels.Discord.Token = "discord-secret"
	cfg.Providers.OpenRouter.APIKey = "openrouter-secret"
	cfg.Providers.Anthropic.APIKey = "anthropic-secret"
	cfg.Providers.OpenAI.APIKey = "openai-secret"
	cfg.Providers.Groq.APIKey = "groq-secret"
	cfg.Providers.Ollama.APIKey = "ollama-secret"
	cfg.Providers.NVIDIA.APIKey = "nvidia-secret"
	cfg.Solana.HeliusAPIKey = "helius-secret"
	cfg.Solana.BirdeyeAPIKey = "birdeye-secret"
	cfg.Solana.JupiterAPIKey = "jupiter-secret"
	cfg.Solana.AsterAPIKey = "aster-key"
	cfg.Solana.AsterAPISecret = "aster-secret"
	cfg.Solana.WalletKeyPath = "/home/user/.config/solana/id.json"
	cfg.Supabase.ServiceKey = "supabase-secret"

	got := redactedConfig(cfg)

	secrets := []string{
		got.ModelList[0].APIKey,
		got.Channels.Telegram.Token,
		got.Channels.Discord.Token,
		got.Providers.OpenRouter.APIKey,
		got.Providers.Anthropic.APIKey,
		got.Providers.OpenAI.APIKey,
		got.Providers.Groq.APIKey,
		got.Providers.Ollama.APIKey,
		got.Providers.NVIDIA.APIKey,
		got.Solana.HeliusAPIKey,
		got.Solana.BirdeyeAPIKey,
		got.Solana.JupiterAPIKey,
		got.Solana.AsterAPIKey,
		got.Solana.AsterAPISecret,
		got.Solana.WalletKeyPath,
		got.Supabase.ServiceKey,
	}
	for _, value := range secrets {
		if value != "<redacted>" {
			t.Fatalf("secret was not redacted: %q", value)
		}
	}
	if cfg.ModelList[0].APIKey != "model-secret" {
		t.Fatal("redactedConfig mutated the input config")
	}
}

func TestCorsAllowedOrigin(t *testing.T) {
	req, err := http.NewRequest(http.MethodGet, "http://127.0.0.1:18800/api/status", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Host = "127.0.0.1:18800"

	if !corsAllowedOrigin(req, "http://127.0.0.1:18800") {
		t.Fatal("same-origin request was rejected")
	}
	if corsAllowedOrigin(req, "http://evil.example") {
		t.Fatal("cross-origin request was allowed without explicit config")
	}

	t.Setenv("CLAWDBOT_CORS_ORIGINS", "https://console.example")
	if !corsAllowedOrigin(req, "https://console.example") {
		t.Fatal("configured origin was rejected")
	}
}

func TestClientIPTrustsProxyHeadersOnlyWhenEnabled(t *testing.T) {
	req, err := http.NewRequest(http.MethodGet, "http://localhost/api/install", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.RemoteAddr = "192.0.2.1:3456"
	req.Header.Set("X-Forwarded-For", "203.0.113.7")

	if got := clientIP(req); got != "192.0.2.1" {
		t.Fatalf("clientIP trusted proxy header by default: %q", got)
	}

	t.Setenv("CLAWDBOT_TRUST_PROXY_HEADERS", "1")
	if got := clientIP(req); got != "203.0.113.7" {
		t.Fatalf("clientIP ignored trusted proxy header: %q", got)
	}
}
