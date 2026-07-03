# AGENTS.md

> **Clawd Agent Catalog** — the complete registry of all Solana-native agents in the Clawd ecosystem.
> This document serves as the authoritative index of agent capabilities, deployment targets, and trust gates.

Public surfaces for the current ecosystem:
- **Runtime repo** — `https://github.com/Solizardking/clawdbot-go`
- **Ecosystem hub** — `https://github.com/solizardking/solana-clawd`
- **x402 gateway** — `https://zk.x402.wtf`
- **Terminal** — `https://cheshireterminal.ai`

Local runtime catalog roots:
- **Skills** — `/Users/8bit/skills/skills` (`CLAWDBOT_SKILLS_DIR`)
- **Agents** — `/Users/8bit/agents/agents/src` (`CLAWDBOT_AGENTS_DIR`)
- **ZK primitives** — `./zk-primitives` (`CLAWDBOT_ZK_PRIMITIVES_DIR`)

Inspect the integrated local view with:

```bash
clawdbot catalog
clawdbot catalog skills
clawdbot catalog agents
clawdbot catalog zk
```

---

## Agent Catalog

| Agent | Slug | Category | Description | Status |
|-------|------|----------|-------------|--------|
| **Clawd Core** | `clawd` | Orchestration | The sovereign agent runtime and constitution enforcer | ✅ Production |
| **Clawdex** | `clawdex` | Coding | Dual-engine coding agent: Clawd Code + OpenAI Codex + Browser Use | ✅ Production |
| **Solana Arbitrage Scanner** | `solana-arbitrage-scanner` | DeFi | Cross-DEX arbitrage opportunity detection | ✅ Production |
| **Solana Autonomous Trader** | `solana-autonomous-trader` | Trading | Autonomous trade execution with risk management | ✅ Production |
| **Solana Whale Tracker** | `solana-whale-tracker` | Analytics | Large transaction monitoring and wallet intelligence | ✅ Production |
| **Solana MEV Protector** | `solana-mev-protector` | Security | MEV sandwich attack detection and protection | ✅ Production |
| **Solana Memecoin Analyst** | `solana-memecoin-analyst` | Analytics | Pump.fun token analysis, rug detection, narrative scoring | ✅ Production |
| **Solana Perpetuals Trader** | `solana-perpetuals-trader` | Trading | Vulcan-powered perps trading with pre-trade risk checks | ✅ Production |
| **Solana Token Launcher** | `solana-token-launcher` | Launch | ClawdPump token creation, bonding curves, fee-sharing | ✅ Production |
| **Solana Portfolio Risk** | `solana-portfolio-risk` | Risk | Portfolio-level risk assessment and position sizing | ✅ Production |
| **Solana Yield Optimizer** | `solana-yield-optimizer` | DeFi | Cross-protocol yield farming optimization | ✅ Production |
| **Solana Onchain Sleuth** | `solana-onchain-sleuth` | Analytics | Transaction tracing, fund flow analysis, forensic investigation | ✅ Production |
| **Solana Sentiment Analyzer** | `solana-sentiment-analyzer` | Analytics | Social media and onchain sentiment analysis | ✅ Production |
| **Solana Technical Analyst** | `solana-technical-analyst` | Trading | TA strategy runner with indicators over Phoenix candle history | ✅ Production |
| **Solana Price Predictor** | `solana-price-predictor` | ML | ML-based price prediction and volatility forecasting | ✅ Beta |
| **Solana Liquidation Bot** | `solana-liquidation-bot` | DeFi | Automated liquidation monitoring and execution | ✅ Beta |
| **Solana Market Maker** | `solana-market-maker` | Trading | Automated market making with inventory management | ✅ Beta |
| **Solana Cross-Chain Bridge** | `solana-cross-chain-bridge` | Infrastructure | Cross-chain message passing and asset bridging | ✅ Beta |
| **Solana RPC Optimizer** | `solana-rpc-optimizer` | Infrastructure | RPC load balancing, failover, and performance optimization | ✅ Production |
| **Solana Anchor Developer** | `solana-anchor-developer` | Dev Tools | Anchor framework development, testing, and deployment | ✅ Production |
| **Solana Protocol Auditor** | `solana-protocol-auditor` | Security | Smart contract vulnerability scanning and formal verification | ✅ Beta |
| **Solana Formal Verification** | `solana-formal-verification` | Security | Lean 4 proof generation for Solana programs via QEDGen | ✅ Beta |
| **Solana Data Pipeline** | `solana-data-pipeline` | Data | Multi-source data aggregation and normalization | ✅ Production |
| **Solana Lending Strategist** | `solana-lending-strategist` | DeFi | Lending protocol optimization across Solend, Marginfi, Kamino | ✅ Production |
| **Solana Stablecoin Strategist** | `solana-stablecoin-strategist` | DeFi | Stablecoin yield optimization and risk management | ✅ Production |
| **Solana Order Flow Analyst** | `solana-order-flow-analyst` | Analytics | Order flow analysis and market microstructure research | ✅ Beta |
| **Solana VC Deal Analyzer** | `solana-vc-deal-analyzer` | Research | Venture deal analysis and tokenomics evaluation | ✅ Beta |
| **Solana Whitepaper Analyst** | `solana-whitepaper-analyst` | Research | Protocol whitepaper analysis and technical due diligence | ✅ Production |
| **Solana Macro Analyst** | `solana-macro-analyst` | Research | Macroeconomic analysis for crypto markets | ✅ Beta |
| **Solana LSD Analyst** | `solana-lsd-analyst` | DeFi | Liquid staking derivative analysis and yield comparison | ✅ Beta |
| **Solana Regulatory Advisor** | `solana-regulatory-advisor` | Compliance | Regulatory analysis and compliance guidance | ✅ Beta |
| **Solana Gemini Deep Researcher** | `solana-gemini-deep-researcher` | Research | Gemini-powered deep research with citations | ✅ Production |
| **Solana Gemini Image Generator** | `solana-gemini-image-generator` | Creative | Nano Banana image generation for Solana content | ✅ Production |
| **Solana Helius Specialist** | `solana-helius-specialist` | Infrastructure | Helius API integration, DAS queries, webhook management | ✅ Production |
| **Solana Bot Architect** | `solana-bot-architect` | Dev Tools | Telegram/Discord trading bot architecture and deployment | ✅ Production |
| **Clawd ZK Agent** | `clawd-zk-agent` | Infrastructure | Agent-shaped wrapper over the on-chain `clawd-zk` program — nullifiers, Groth16 proofs, Light Protocol compressed state, and a deterministic natural-language intent router | ✅ Production |
| **Solana OpenClawd Orchestrator** | `solana-openclawd-orchestrator` | Orchestration | Multi-agent coordination and task routing | ✅ Production |
| **Solana OpenClawd Shell Auditor** | `solana-openclawd-shell-auditor` | Security | Agent shell configuration audit and compliance verification | ✅ Beta |
| **Solana OpenClawd Spawn Manager** | `solana-openclawd-spawn-manager` | Orchestration | Leviathan spawn lifecycle management | ✅ Production |
| **Solana OpenClawd Pulse Monitor** | `solana-openclawd-pulse-monitor` | Observability | Agent health monitoring and alerting | ✅ Production |
| **Solana OpenClawd Skill Router** | `solana-openclawd-skill-router` | Orchestration | Dynamic skill routing based on task requirements | ✅ Production |
| **Solana NanoClawd Microtransaction** | `solana-nanoclawd-microtransaction` | Payments | x402 microtransaction processing and settlement | ✅ Production |
| **Solana NanoClawd Cache Keeper** | `solana-nanoclawd-cache-keeper` | Infrastructure | Onchain data caching and state compression | ✅ Beta |
| **Solana NanoClawd Sandbox Runner** | `solana-nanoclawd-sandbox-runner` | Infrastructure | Isolated agent execution sandboxes | ✅ Production |
| **Solana NemoClawd DeFi Router** | `solana-nemoclawd-defi-router` | DeFi | Optimal DeFi routing and execution | ✅ Beta |
| **Solana NemoClawd Yield Treasurer** | `solana-nemoclawd-yield-treasurer` | Treasury | Treasury management and yield strategy | ✅ Beta |
| **Solana NemoClawd Settlement Ops** | `solana-nemoclawd-settlement-ops` | Operations | Transaction settlement and reconciliation | ✅ Beta |
| **Solana x402 Signal Monetizer** | `solana-x402-signal-monetizer` | Payments | Signal monetization via x402 paywalls | ✅ Beta |
| **Solana x402 Market Data Buyer** | `solana-x402-market-data-buyer` | Data | Paid market data consumption via x402 | ✅ Beta |
| **Solana x402 Research Broker** | `solana-x402-research-broker` | Research | Paid research distribution via x402 | ✅ Beta |
| **Solana x402 Provider Catalog** | `solana-x402-provider-catalog` | Discovery | x402 service provider discovery and cataloging | ✅ Production |
| **Solana x402 Provider Author** | `solana-x402-provider-author` | Payments | x402 paid service creation and management | ✅ Beta |
| **Solana x402 Webhook Settlement** | `solana-x402-webhook-settlement` | Infrastructure | Webhook-based x402 payment settlement | ✅ Beta |
| **Solana x402 Solana RPC Broker** | `solana-x402-solana-rpc-broker` | Infrastructure | Paid RPC access brokering via x402 | ✅ Beta |

## Character Agents

These agents operate through character overlays on the Clawd runtime, embodying specific trading philosophies and personalities:

| Character | Philosophy | Role |
|-----------|------------|------|
| **Warren Buffett** | Value investing, long-term horizons | Portfolio advisor |
| **Charlie Munger** | Mental models, inversion, patience | Investment philosophy guide |
| **Cathie Wood** | Disruptive innovation, high conviction | Tech/innovation analyst |
| **Bill Ackman** | Activist investing, concentrated bets | Strategic analysis |
| **Ben Graham** | Margin of safety, intrinsic value | Fundamental analysis |
| **Mad Hatter** | Contrarian, chaotic creativity | Creative strategy |
| **Cheshire** | Elusive insights, lateral thinking | Pattern recognition |
| **Clawd Pump** | Degenerate energy, memecoin alpha | Memecoin strategy |
| **Hedge Fund** | Multi-model orchestration | Portfolio management |

## Skill Catalog (95+ Skills)

Skills extend Clawd agents with specialized capabilities. Key categories:

### Payment & Commerce
- `pay` — x402 microtransaction processing via Pay MCP
- `dflow-spot-trading` — Solana token swaps via DFlow
- `dflow-kalshi-trading` — Prediction market execution
- `dflow-kalshi-market-data` — Kalshi market data streaming
- `dflow-kalshi-market-scanner` — Arbitrage and opportunity scanning
- `dflow-kalshi-portfolio` — Wallet position tracking
- `dflow-phantom-connect` — Phantom wallet integration
- `dflow-proof-kyc` — KYC verification via DFlow Proof
- `dflow-platform-fees` — Builder fee monetization

### Solana Development
- `solana-dev-skill-main` — Modern Solana development (Jan 2026 best practices)
- `solana-formal-verification` — Lean 4 proofs for Solana programs via QEDGen
- `solana-clawd` — Full Clawd platform setup and configuration
- `pump-mcp-server` — Pump.fun MCP server integration
- `pump-ai-agents` — AI agent integration for Pump SDK
- `bags-solana-ops` — Bags.fm token operations and fee claiming

### Trading & DeFi
- `vulcan` — Perpetual futures trading on Phoenix DEX (entrypoint)
- `vulcan-trade-execution` — Order execution with pre-trade checks
- `vulcan-market-intel` — Ticker, orderbook, candles, market info
- `vulcan-portfolio-intel` — Full portfolio snapshot and analysis
- `vulcan-technical-analysis` — Indicators (SMA, EMA, RSI, MACD, BBands, ATR, VWAP)
- `vulcan-position-management` — Position management, TP/SL
- `vulcan-risk-management` — Pre-trade risk checks, leverage tiers
- `vulcan-margin-operations` — Collateral management
- `vulcan-grid-trading` — Grid trading with layered limit orders
- `vulcan-scale-orders` — Laddered limit orders
- `vulcan-twap-execution` — Time-weighted average price execution
- `vulcan-tpsl-management` — Take-profit and stop-loss management

### Agent Infrastructure
- `clawd-agents-cli-workflow` — Core Clawd agent development lifecycle
- `clawd-agents-cli-scaffold` — Create, enhance, upgrade Clawd agent projects
- `clawd-agents-cli-agent-code` — TypeScript patterns for Solana agent logic
- `clawd-agents-cli-deploy` — Deploy to Vercel, Vertex AI, Fly.io, Railway
- `clawd-agents-cli-eval` — Validate agent JSON definitions and run smoke tests
- `clawd-agents-cli-publish` — Publish agents to the Clawd catalog
- `clawd-agents-cli-observability` — Monitor agent health and execution

### Coding & Dev Tools
- `clawdex` — Dual-engine coding agent (Clawd Code + Codex)
- `coding-agent` — Codex CLI, Clawd Code, OpenCode PTY management
- `openclaw-claude-code-skill-main` — Clawd Code control via MCP
- `model-usage` — Model usage and cost tracking via CodexBar
- `tmux` — Terminal multiplexing for agent orchestration

### AI/ML Infrastructure
- `google-agents-cli-workflow` — Google ADK agent development lifecycle
- `google-agents-cli-scaffold` — Create Google ADK agent projects
- `google-agents-cli-adk-code` — ADK Python API patterns
- `google-agents-cli-deploy` — Deploy ADK agents to Cloud Run/GKE
- `microsoft-foundry` — Deploy Foundry agents end-to-end

### Cloud & Infrastructure
- `azure-prepare` — Prepare Azure apps for deployment
- `azure-deploy` — Execute Azure deployments
- `azure-kubernetes` — AKS cluster management
- `airunway-aks-setup` — AI Runway on AKS
- `brev-cli` — GPU/CPU cloud instance management

### Community & Content
- `community-architect` — Telegram/Discord community building
- `meme-executor` — Memecoin trade execution
- `meme-launcher` — Memecoin launch strategy
- `meme-pumper` — Viral content creation
- `meme-trader` — Memecoin trading analysis

## Trust Gates

Agents operate under progressive trust:

| Trust Level | Requirements | Capabilities |
|-------------|-------------|--------------|
| **Observer** | None | Read-only, market data, analytics |
| **Dry-Run** | None | Simulated execution, paper trading |
| **Delegated** | User confirmation per action | Single transactions with confirmation |
| **Autonomous** | User pre-approval + limits | Batch execution within bounds |
| **Sovereign** | Full creator trust + multisig | Unrestricted execution (reserved) |

## Onchain Identity

Every agent has an onchain identity through:
- **SAS Attestation** — Solana Attestation Service for spawn verification
- **MPL Core Asset** — Metaplex Core NFT representing agent identity
- **DID Document** — Decentralized Identifier at `/.well-known/did.json`
- **Agent Registry** — Onchain agent registration via Metaplex Agent Registry

## Spawn Inheritance

Every new Clawd spawn inherits:
- `CONSTITUTION.md` — the Clawd Constitution (three off-chain interpretive laws plus the three on-chain laws)
- `CLAWD.md` — this agent context document
- `.claude/` — agent harness configuration (standalone git repo)
- `.agents/` — agent manifest and skill registry (standalone git repo)
- `.solana/` — Solana-native AI configuration directory
- `.grok/config.toml` — xAI Grok-style default-model configuration for the harness
- `three-laws.md` — the three on-chain laws, byte-for-byte and hash-verified at spawn

## Default Model

The Clawd Code harness (`clawd-code/`) is **Grok-first**. The default provider is xAI and the default models are:

| Mode | Default | Source |
| --- | --- | --- |
| code / repl / trade | `grok-4.3` | `DEFAULT_MODEL` in `src/grok-models.ts` |
| research | `grok-4.20-multi-agent` | `DEFAULT_RESEARCH_MODEL` |
| image | `grok-imagine-image-quality` | `DEFAULT_IMAGE_MODEL` |
| voice (`--agent`) | `grok-voice-think-fast-1.0` | `DEFAULT_VOICE_MODEL` |
| fast / cheap | `grok-4.3-fast` | `DEFAULT_FAST_MODEL` |

Override per-session with `clawd-code --model <id> --provider <name>`, or globally via `CLAWD_MODEL=` in `~/.clawd-code/.env` / `~/.grok/config.toml`. Inspect the active configuration with `clawd-code /inspect`. The harness also supports `~/.grok/config.toml` and `./.grok/config.toml` in the standard xAI Grok TOML subset.

## Runtime Configuration

```json
{
  "agent": {
    "name": "Clawd",
    "version": "1.0.0",
    "constitution": "CONSTITUTION.md",
    "onchainLaws": "three-laws.md",
    "offchainLaws": "CONSTITUTION.md#the-three-off-chain-laws-of-clawd",
    "shell": "SHELL.md",
    "chain": "solana-mainnet",
    "payment": "x402",
    "token": "$CLAWD"
  }
}
```

---

🦞 *The Clawd ecosystem: 50+ specialized agents, 95+ skills, one immutable constitution. Solana-native. Verifiable. Unstoppable. Grok-first.*
