#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Agent, Box } from "@upstash/box";

const here = dirname(fileURLToPath(import.meta.url));
const serverSource = readFileSync(join(here, "upstash-box-server.mjs"), "utf8");
const apiKey = validateBoxApiKey(
  process.env.UPSTASH_BOX_API_KEY || process.env.UPSTASH_BOX_KEY || "",
);

if (!apiKey) {
  console.error("Set UPSTASH_BOX_API_KEY or UPSTASH_BOX_KEY before running this bootstrap.");
  process.exit(1);
}

const model = process.env.UPSTASH_BOX_AGENT_MODEL || "anthropic/claude-opus-4-7";
const port = process.env.GOBOT_BOX_PORT || "3000";
const installGoBot = envBool("GOBOT_BOX_INSTALL", true);
const fundingEnabled = envBool("GOBOT_INSTALL_FUNDING_ENABLED", false);
const fundingSend = envBool("GOBOT_INSTALL_FUNDING_SEND", false);

console.log("Creating Upstash Box...");
const box = await Box.create({
  apiKey,
  runtime: "node",
  agent: {
    harness: Agent.ClaudeCode,
    model,
  },
});

await box.exec.code({
  lang: "js",
  code: `
    import { mkdirSync, writeFileSync } from "node:fs";
    mkdirSync("/tmp/gobot-box", { recursive: true });
    writeFileSync("/tmp/gobot-box/server.mjs", ${JSON.stringify(serverSource)});
  `,
});

if (installGoBot) {
  console.log("Installing GoBot inside the box...");
  const install = await box.exec.command(
    [
      "curl -fsSL https://raw.githubusercontent.com/Solizardking/clawdbot-go/main/install.sh",
      "|",
      "GOBOT_INSTALL_API=http://127.0.0.1:3000/api/install",
      "GOBOT_SKIP_SKILL_SEED=1",
      "GOBOT_INSTALL_VULCAN=0",
      "bash",
    ].join(" "),
  );
  writeRunOutput(install);
  requireSuccessfulRun(install, "GoBot install failed inside the box");
}

const env = {
  PORT: port,
  GOBOT_BOX_PORT: port,
  GOBOT_BOX_DATA_DIR: process.env.GOBOT_BOX_DATA_DIR || "/tmp/gobot-box",
  GOBOT_INSTALL_FUNDING_ENABLED: fundingEnabled ? "1" : "0",
  GOBOT_INSTALL_FUNDING_SEND: fundingSend ? "1" : "0",
  GOBOT_INSTALL_FUNDING_MAX_PER_IP_DAY:
    process.env.GOBOT_INSTALL_FUNDING_MAX_PER_IP_DAY || "3",
  GOBOT_INSTALL_FUNDING_MAX_PER_DAY:
    process.env.GOBOT_INSTALL_FUNDING_MAX_PER_DAY || "100",
  GOBOT_STARTUP_SOL_LAMPORTS:
    process.env.GOBOT_STARTUP_SOL_LAMPORTS || "69420000",
  GOBOT_STARTUP_TOKENS:
    process.env.GOBOT_STARTUP_TOKENS || "1000",
  GOBOT_TOKEN_MINT:
    process.env.GOBOT_TOKEN_MINT ||
    process.env.GOBOT_MINT ||
    "8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump",
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || process.env.HELIUS_RPC_URL || "",
  HELIUS_RPC_URL: process.env.HELIUS_RPC_URL || process.env.SOLANA_RPC_URL || "",
  ZKROUTER_API_KEY: process.env.ZKROUTER_API_KEY || "clawd-free",
  ZKROUTER_BASE_URL: process.env.ZKROUTER_BASE_URL || "https://clawdrouter-zk.fly.dev/v1",
  GOBOT_INSTALL_ADMIN_TOKEN:
    process.env.GOBOT_INSTALL_ADMIN_TOKEN || randomAdminToken(),
};

const treasurySecret =
  process.env.GOBOT_TREASURY_PRIVATE_KEY || process.env.PRIVATE_KEY || "";
if (treasurySecret) {
  env.GOBOT_TREASURY_PRIVATE_KEY = treasurySecret;
}

const startCommand = `
set -e
mkdir -p /tmp/gobot-box
pkill -f /tmp/gobot-box/server.mjs >/dev/null 2>&1 || true
${envPrefix(env)} nohup node /tmp/gobot-box/server.mjs > /tmp/gobot-box/server.log 2>&1 &
sleep 1
cat /tmp/gobot-box/server.log || true
`;

console.log("Starting GoBot Box install API...");
const started = await box.exec.command(startCommand);
writeRunOutput(started);
requireSuccessfulRun(started, "GoBot Box install API failed to start");

console.log("\nBox bootstrap complete.");
console.log("Use the preview URL on port 3000 as the install surface.");
console.log("Install command:");
console.log("  curl -fsSL <BOX_PREVIEW_URL>/install.sh | bash");
console.log("\nAdmin token for /api/installs is set in the box process environment.");
if (!treasurySecret) {
  console.log("\nFunding is tracking-only until GOBOT_TREASURY_PRIVATE_KEY is set locally before bootstrap.");
}
if (!fundingSend) {
  console.log("Funding send is disabled; set GOBOT_INSTALL_FUNDING_SEND=1 to send real SOL/$GOBOT.");
}

function envPrefix(env) {
  return Object.entries(env)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${shellQuote(value)}`)
    .join(" ");
}

function writeRunOutput(run) {
  process.stdout.write(run.result || "");
}

function requireSuccessfulRun(run, message) {
  if (run.exitCode === 0) return;
  console.error(`\n${message} (exit ${run.exitCode ?? "unknown"}).`);
  process.exit(run.exitCode || 1);
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", `'\"'\"'`)}'`;
}

function envBool(key, fallback) {
  const value = process.env[key];
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function randomAdminToken() {
  return `box_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

function validateBoxApiKey(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith(".")) {
    console.error(
      "UPSTASH_BOX_API_KEY starts with a dot. Remove the leading '.' so it starts with box_.",
    );
    process.exit(1);
  }
  if (trimmed.includes(" ")) {
    console.error("UPSTASH_BOX_API_KEY contains whitespace. Re-copy the key and export it again.");
    process.exit(1);
  }
  if (!trimmed.startsWith("box_")) {
    console.warn("UPSTASH_BOX_API_KEY does not start with box_; continuing in case Upstash changed the format.");
  }
  return trimmed;
}
