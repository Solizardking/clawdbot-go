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
export declare const DEFAULT_PROGRAM_ID: PublicKey;
export interface ZkSharkAgentConfig {
    /** Helius or other Solana RPC URL (api-key may be embedded). */
    rpcUrl: string;
    /** Address of the deployed ZK Shark program. */
    programId: PublicKey;
    /** Photon indexer URL. Defaults to `rpcUrl`. */
    photonUrl: string;
    /** Separate API key for the RPC. */
    apiKey?: string;
    /** Commitment level for RPC calls. */
    commitment: "processed" | "confirmed" | "finalized";
    /** Optional path to a Solana keypair JSON for signing. */
    keypairPath?: string;
    /** Network hint for intent routing. */
    network: "mainnet" | "devnet" | "localnet";
}
export type ZkAgentConfig = ZkSharkAgentConfig;
/**
 * Load ZK Shark agent config from the current `process.env`.
 *
 * Throws if neither `ZK_SHARK_RPC_URL` nor legacy `GOBOT_ZK_RPC_URL` is set.
 */
export declare function loadAgentConfig(env?: Record<string, string | undefined>): ZkSharkAgentConfig;
//# sourceMappingURL=config.d.ts.map