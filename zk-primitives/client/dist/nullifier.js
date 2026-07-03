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
import { createHash } from "node:crypto";
/**
 * Compute a deterministic 32-byte nullifier.
 *
 * Uses SHA-256(secret || context || nonce) for portability. In
 * production circuits, replace the inner hash with Poseidon for
 * SNARK-friendliness.
 */
export async function computeNullifier(inputs) {
    const { secret, context, nonce } = inputs;
    if (secret.length < 16) {
        throw new Error("Nullifier secret must be at least 16 bytes.");
    }
    const contextBytes = typeof context === "string" ? new TextEncoder().encode(context) : context;
    const nonceBytes = typeof nonce === "number"
        ? u64ToBytes(BigInt(nonce))
        : nonce ?? new Uint8Array(0);
    const hasher = createHash("sha256");
    hasher.update(secret);
    hasher.update(contextBytes);
    hasher.update(nonceBytes);
    const out = hasher.digest();
    return out;
}
/** Compute N nullifiers in one go, each with a unique nonce. */
export async function computeNullifierBatch(baseInputs, count) {
    const out = [];
    for (let i = 0; i < count; i++) {
        out.push(await computeNullifier({ ...baseInputs, nonce: u32ToBytes(i) }));
    }
    return out;
}
function u32ToBytes(n) {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, n, true);
    return b;
}
function u64ToBytes(n) {
    const b = new Uint8Array(8);
    new DataView(b.buffer).setBigUint64(0, n, true);
    return b;
}
/** Re-export the on-chain address derivation so the client and program agree. */
export const NULLIFIER_PREFIX = new TextEncoder().encode("clawd-zk-nullifier");
/**
 * Derive the compressed-account address for a given nullifier and
 * address tree. The address is what the Light Protocol address tree
 * uses for uniqueness proofs.
 */
export async function deriveNullifierAddress(programId, addressTree, nullifier) {
    // The actual derivation uses the Light SDK. We import dynamically
    // because the SDK ships both v1 and v2 entry points; production code
    // should pin to v2.
    const sdk = await import("@lightprotocol/stateless.js");
    if (sdk.deriveAddressV2) {
        const seed = sdk.deriveAddressSeedV2([NULLIFIER_PREFIX, nullifier]);
        const address = sdk.deriveAddressV2(seed, addressTree, programId);
        return { address, seed };
    }
    // Fallback for v1
    const seed = sdk.deriveAddressSeed([NULLIFIER_PREFIX, nullifier]);
    const address = sdk.deriveAddress(seed, addressTree, programId);
    return { address, seed };
}
//# sourceMappingURL=nullifier.js.map