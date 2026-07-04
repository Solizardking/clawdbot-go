# ZK Configs

Configuration files for Go Bot ZK network and tree metadata.

## Files

| File | Purpose |
|---|---|
| `light-trees.yaml` | Canonical Light Protocol tree, queue, CPI context, and lookup-table addresses |
| `gobot-zk.example.json` | Runtime-facing example config for catalog and agent wiring |

## Operational Rules

- Treat tree addresses as network-specific deployment data.
- Re-verify addresses before production releases.
- Keep wallet keypairs and API keys out of this directory.
- Use environment variables for operator-specific values.

Relevant environment variables:

```bash
GOBOT_ZK_RPC_URL=
GOBOT_ZK_PROGRAM_ID=
GOBOT_ZK_PHOTON_URL=
GOBOT_ZK_API_KEY=
GOBOT_ZK_COMMITMENT=confirmed
GOBOT_ZK_KEYPAIR=
GOBOT_ZK_NETWORK=mainnet
```
