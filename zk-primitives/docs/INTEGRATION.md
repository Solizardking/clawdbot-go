# Go Bot ZK Integration

This directory is the ZK subsystem for `clawdbot-go`. It is designed to be
read by three surfaces:

- The Go runtime catalog command: `gobot catalog zk`
- The local skill library through `zk-primitives/agent/SKILL.md`
- The local agent catalog through Go Bot agents that call `@gobot/zk-agent`

## Local Catalog Roots

The runtime defaults to these local roots:

| Surface | Default | Override |
|---|---|---|
| Skills | `/Users/8bit/skills/skills` | `GOBOT_SKILLS_DIR` |
| Agents | `/Users/8bit/agents/agents/src` | `GOBOT_AGENTS_DIR` |
| ZK primitives | `./zk-primitives` | `GOBOT_ZK_PRIMITIVES_DIR` |

Use:

```bash
gobot catalog
gobot catalog skills zk
gobot catalog agents zk
gobot catalog zk
gobot catalog --json
```

The catalog command is read-only. It does not install packages, execute skills,
sign transactions, or send Solana instructions.

## Runtime Shape

```text
user / agent intent
  -> @gobot/zk-agent routeIntent()
  -> GoBotZkAgent method
  -> @gobot/zk-client instruction builder
  -> gobot-zk Anchor program
  -> Light Protocol compressed state
```

The agent package owns intent routing and operator-friendly commands. The client
package owns byte packing, public inputs, nullifiers, and instruction building.
The on-chain program owns Groth16 verification and compressed-state updates.

## Trust Gates

| Action | Trust level | Notes |
|---|---|---|
| Inspect config | Observer | Local only |
| Verify proof shape | Observer | Structural sanity check, no pairing |
| Compute nullifier | Observer | Local hash derivation |
| Build instruction | Dry-Run | Produces a transaction instruction |
| Sign and send | Delegated | Requires explicit signer/operator policy |

Live transaction submission should remain outside automatic catalog discovery.
The catalog can show that ZK capability exists; it should not silently arm it.

## Package Boundaries

| Path | Owner | Contract |
|---|---|---|
| `agent/` | Agent wrapper | Deterministic routing, CLI, config inspection |
| `client/` | SDK | Types, proof packing, nullifier derivation, instruction builders |
| `configs/` | Network metadata | Light tree addresses and runtime examples |
| `docs/` | Architecture | Design, trust model, integration guidance |
| `programs/` | On-chain program | Anchor instruction handlers and Light CPI boundary |
| `tests/` | Cross-package tests | Off-chain SDK tests and on-chain test notes |

## Production Checklist

1. Replace placeholder program IDs and Light signer values with deployed IDs.
2. Pin trusted verifying keys per circuit instead of accepting arbitrary VKs.
3. Replace JSON instruction encoding shims with canonical Anchor/Borsh encoding.
4. Run `npm test` for the TypeScript packages.
5. Run `cargo test-sbf -p gobot-zk` with a Light-compatible validator.
6. Publish the final `MANIFEST.json` alongside package versions and deployment IDs.
