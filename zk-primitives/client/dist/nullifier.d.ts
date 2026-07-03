/**
 * Nullifier computation.
 *
 * A nullifier is a deterministic 32-byte hash that proves an action was
 * taken exactly once. We compute it as:
 *
 *     nullifier = Poseidon(secret, context)
 *
 * using the BN254 field. The `secret` is the attester's signing key
 * (or a domain-separated sub-key derived from it). The `context` is
 * a domain tag that prevents cross-action collisions (e.g.
 * "model-attestation-2026-06-15").
 *
 * For environments where Poseidon is not available (e.g. browser
 * without WASM), we fall back to a SHA-256-based construction that
 * is still collision-resistant per (secret, context) pair.
 */
import type { PublicKey } from "@solana/web3.js";
import type { Bytes32 } from "./types.js";
/** Inputs to `computeNullifier`. */
export interface NullifierInputs {
    /** 32+ bytes of secret material (e.g. derived signing subkey). */
    secret: Uint8Array;
    /** Arbitrary context tag (e.g. "model-attest:v1:<model_hash>"). */
    context: Uint8Array | string;
    /** Optional nonce to allow multiple nullifiers per (secret, context). */
    nonce?: Uint8Array | number;
}
/**
 * Compute a deterministic 32-byte nullifier.
 *
 * Uses SHA-256(secret || context || nonce) for portability. In
 * production circuits, replace the inner hash with Poseidon for
 * SNARK-friendliness.
 */
export declare function computeNullifier(inputs: NullifierInputs): Promise<Bytes32>;
/** Compute N nullifiers in one go, each with a unique nonce. */
export declare function computeNullifierBatch(baseInputs: Omit<NullifierInputs, "nonce">, count: number): Promise<Bytes32[]>;
/** Re-export the on-chain address derivation so the client and program agree. */
export declare const NULLIFIER_PREFIX: Uint8Array<ArrayBufferLike>;
/**
 * Derive the compressed-account address for a given nullifier and
 * address tree. The address is what the Light Protocol address tree
 * uses for uniqueness proofs.
 */
export declare function deriveNullifierAddress(programId: PublicKey, addressTree: PublicKey, nullifier: Bytes32): Promise<{
    address: PublicKey;
    seed: Uint8Array;
}>;
//# sourceMappingURL=nullifier.d.ts.map