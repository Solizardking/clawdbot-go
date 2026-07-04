/**
 * ZK Shark Agent configuration.
 *
 * Loaded from environment variables so the same Shark of All Streets
 * binary works locally, in CI, and in production without code changes.
 *
 * Required:
 *   ZK_SHARK_RPC_URL        - Solana RPC endpoint (Helius recommended)
 *   ZK_SHARK_PROGRAM_ID     - Address of the deployed ZK program
 *
 * Optional:
 *   ZK_SHARK_PHOTON_URL     - Photon indexer URL (defaults to the RPC URL)
 *   ZK_SHARK_API_KEY        - Separate API key for the RPC (some providers)
 *   ZK_SHARK_COMMITMENT     - "processed" | "confirmed" | "finalized" (default "confirmed")
 *   ZK_SHARK_KEYPAIR        - Path to a Solana CLI keypair JSON for signing
 *   ZK_SHARK_NETWORK        - "mainnet" | "devnet" | "localnet" (for intent hints)
 *
 * Legacy GOBOT_ZK_* variables are still accepted as fallbacks.
 */
import { PublicKey } from "@solana/web3.js";
/**
 * Default program id used by the deployed ZK Shark program on mainnet.
 *
 * This is a deterministic valid placeholder public key; replace it
 * with the deployed Anchor program id before sending transactions.
 */
export const DEFAULT_PROGRAM_ID = new PublicKey("4vJ9JU1bJJE96FWSVKmnrL3xFU5jSBSVdk9x4La2vzhn");
const KNOWN_PROGRAM_IDS = {
    ZK_SHARK_MAINNET: "4vJ9JU1bJJE96FWSVKmnrL3xFU5jSBSVdk9x4La2vzhn",
    ZK_SHARK_DEVNET: "8qbHbw2BbbNa7jTcimsDVjps5M5hc7bdwA2ZJ47wUGEa",
    ZK_SHARK_LOCALNET: "CktRuQ2mN7N5fRTniY5wW84HH6NpisxEZY6e9ckM3XfX",
    ZKSHARK_MAINNET: "4vJ9JU1bJJE96FWSVKmnrL3xFU5jSBSVdk9x4La2vzhn",
    ZKSHARK_DEVNET: "8qbHbw2BbbNa7jTcimsDVjps5M5hc7bdwA2ZJ47wUGEa",
    ZKSHARK_LOCALNET: "CktRuQ2mN7N5fRTniY5wW84HH6NpisxEZY6e9ckM3XfX",
    GOBOTZK_MAINNET: "4vJ9JU1bJJE96FWSVKmnrL3xFU5jSBSVdk9x4La2vzhn",
    GOBOTZK_DEVNET: "8qbHbw2BbbNa7jTcimsDVjps5M5hc7bdwA2ZJ47wUGEa",
    GOBOTZK_LOCALNET: "CktRuQ2mN7N5fRTniY5wW84HH6NpisxEZY6e9ckM3XfX",
};
function asString(v, fallback) {
    if (v == null)
        return fallback;
    const trimmed = v.trim();
    return trimmed.length === 0 ? fallback : trimmed;
}
function asCommitment(v) {
    const value = (v ?? "confirmed").toLowerCase();
    if (value === "processed" || value === "finalized")
        return value;
    return "confirmed";
}
function asNetwork(v) {
    const value = (v ?? "mainnet").toLowerCase();
    if (value === "devnet" || value === "localnet")
        return value;
    return "mainnet";
}
function firstEnv(env, names) {
    for (const name of names) {
        const value = env[name];
        if (value?.trim())
            return value;
    }
    return undefined;
}
function resolveProgramId(raw) {
    if (!raw)
        return DEFAULT_PROGRAM_ID;
    const named = KNOWN_PROGRAM_IDS[raw.toUpperCase()];
    if (named)
        return new PublicKey(named);
    try {
        return new PublicKey(raw);
    }
    catch {
        throw new Error(`Invalid ZK_SHARK_PROGRAM_ID/GOBOT_ZK_PROGRAM_ID: ${raw}. Expected a base58 pubkey or one of: ${Object.keys(KNOWN_PROGRAM_IDS).join(", ")}.`);
    }
}
/**
 * Load ZK Shark agent config from the current `process.env`.
 *
 * Throws if neither `ZK_SHARK_RPC_URL` nor legacy `GOBOT_ZK_RPC_URL` is set.
 */
export function loadAgentConfig(env = process.env) {
    const rpcUrl = asString(firstEnv(env, ["ZK_SHARK_RPC_URL", "GOBOT_ZK_RPC_URL"]), "");
    if (!rpcUrl) {
        throw new Error("ZK_SHARK_RPC_URL is not set. Add it to your environment, or keep using legacy GOBOT_ZK_RPC_URL.");
    }
    const programId = resolveProgramId(firstEnv(env, ["ZK_SHARK_PROGRAM_ID", "GOBOT_ZK_PROGRAM_ID"]));
    const photonUrl = asString(firstEnv(env, ["ZK_SHARK_PHOTON_URL", "GOBOT_ZK_PHOTON_URL"]), rpcUrl);
    return {
        rpcUrl,
        programId,
        photonUrl,
        apiKey: firstEnv(env, ["ZK_SHARK_API_KEY", "GOBOT_ZK_API_KEY"]),
        commitment: asCommitment(firstEnv(env, ["ZK_SHARK_COMMITMENT", "GOBOT_ZK_COMMITMENT"])),
        keypairPath: firstEnv(env, ["ZK_SHARK_KEYPAIR", "GOBOT_ZK_KEYPAIR"]),
        network: asNetwork(firstEnv(env, ["ZK_SHARK_NETWORK", "GOBOT_ZK_NETWORK"])),
    };
}
//# sourceMappingURL=config.js.map