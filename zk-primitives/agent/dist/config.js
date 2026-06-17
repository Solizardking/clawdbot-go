/**
 * ZK Agent configuration.
 *
 * Loaded from environment variables so the same agent binary works
 * locally, in CI, and in production without code changes.
 *
 * Required:
 *   CLAWD_ZK_RPC_URL        — Solana RPC endpoint (Helius recommended)
 *   CLAWD_ZK_PROGRAM_ID     — Address of the deployed `clawd-zk` program
 *
 * Optional:
 *   CLAWD_ZK_PHOTON_URL     — Photon indexer URL (defaults to the RPC URL)
 *   CLAWD_ZK_API_KEY        — Separate API key for the RPC (some providers)
 *   CLAWD_ZK_COMMITMENT     — "processed" | "confirmed" | "finalized" (default "confirmed")
 *   CLAWD_ZK_KEYPAIR        — Path to a Solana CLI keypair JSON for signing
 *   CLAWD_ZK_NETWORK        — "mainnet" | "devnet" | "localnet" (for intent hints)
 */
import { PublicKey } from "@solana/web3.js";
function publicKeyFromByte(byte) {
    return new PublicKey(new Uint8Array(32).fill(byte));
}
/**
 * Default program id used by the deployed `clawd-zk` program on mainnet.
 *
 * 32 base-58 chars; corresponds to the placeholder 32-byte buffer
 * 0xCL CLAWDzk11111111111111111111111111111111 (visible as a base58
 * string only at the config layer — the actual program address is
 * set when the Anchor IDL is built and deployed).
 */
export const DEFAULT_PROGRAM_ID = publicKeyFromByte(1);
const KNOWN_PROGRAM_IDS = {
    CLAWDZK_MAINNET: DEFAULT_PROGRAM_ID,
    CLAWDZK_DEVNET: publicKeyFromByte(2),
    CLAWDZK_LOCALNET: publicKeyFromByte(3),
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
function resolveProgramId(raw) {
    if (!raw)
        return DEFAULT_PROGRAM_ID;
    const named = KNOWN_PROGRAM_IDS[raw.toUpperCase()];
    if (named)
        return named;
    try {
        return new PublicKey(raw);
    }
    catch {
        throw new Error(`Invalid CLAWD_ZK_PROGRAM_ID: ${raw}. Expected a base58 pubkey or one of: ${Object.keys(KNOWN_PROGRAM_IDS).join(", ")}.`);
    }
}
export function loadAgentConfig(env = process.env, options = {}) {
    const requireRpcUrl = options.requireRpcUrl ?? true;
    const fallbackRpcUrl = options.defaultRpcUrl ?? "http://127.0.0.1:8899";
    const rpcUrl = asString(env.CLAWD_ZK_RPC_URL, requireRpcUrl ? "" : fallbackRpcUrl);
    if (!rpcUrl && requireRpcUrl) {
        throw new Error("CLAWD_ZK_RPC_URL is not set. Add it to ~/.clawd-code/.env (or pass `rpcUrl` directly to the agent).");
    }
    const programId = resolveProgramId(env.CLAWD_ZK_PROGRAM_ID);
    const photonUrl = asString(env.CLAWD_ZK_PHOTON_URL, rpcUrl);
    return {
        rpcUrl,
        programId,
        photonUrl,
        apiKey: env.CLAWD_ZK_API_KEY || undefined,
        commitment: asCommitment(env.CLAWD_ZK_COMMITMENT),
        keypairPath: env.CLAWD_ZK_KEYPAIR || undefined,
        network: asNetwork(env.CLAWD_ZK_NETWORK),
    };
}
//# sourceMappingURL=config.js.map