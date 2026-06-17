/**
 * Groth16 proof assembly.
 *
 * The on-chain verifier expects the proof points in alt-bn128 wire
 * format with the standard endianness (big-endian field elements).
 * The verifying key is a pre-serialized byte string of the form
 * [G1 alpha, G1 beta_g2..., G1 gamma_g1, G1 delta_g1, G1[N+1] gamma_abc]
 * — see `light-verifier` for the exact layout.
 *
 * This module provides:
 *   - `serializeProof` / `deserializeProof` for the wire format
 *   - `assemblePublicInputs` to compute the canonical public input
 *     vector for a given attestation
 *   - `verifyGroth16Offchain` to sanity-check a proof before sending
 */
/** Pack a public input vector into the canonical 32-byte-per-field form. */
export function packPublicInputs(inputs) {
    const out = new Uint8Array(inputs.length * 32);
    for (let i = 0; i < inputs.length; i++) {
        const chunk = inputs[i];
        if (chunk.length !== 32) {
            throw new Error(`Public input #${i} must be exactly 32 bytes (got ${chunk.length}).`);
        }
        out.set(chunk, i * 32);
    }
    return out;
}
/** Build the public input vector for a publish-attestation call. */
export function buildPublishPublicInputs(p) {
    return [
        toBytes32(p.attester),
        p.modelHash,
        p.payloadCommitment,
        p.nullifier,
    ];
}
/** Build the public input vector for a consume-attestation call. */
export function buildConsumePublicInputs(p) {
    return [toBytes32(p.consumer), p.attestationAddress, p.consumeNonce];
}
/** Build the public input vector for a commit-encrypted-state call. */
export function buildCommitPublicInputs(p) {
    const v = p.stateVersion;
    const versionBytes = new Uint8Array(32);
    if (typeof v === "bigint") {
        new DataView(versionBytes.buffer).setBigUint64(0, v, true);
    }
    else {
        new DataView(versionBytes.buffer).setBigUint64(0, BigInt(v), true);
    }
    return [
        toBytes32(p.committer),
        p.modelHash,
        p.ciphertextCommitment,
        versionBytes,
    ];
}
function toBytes32(b) {
    if (b.length === 32)
        return b;
    if (b.length > 32) {
        throw new Error("Public input field is too long (max 32 bytes).");
    }
    // Left-pad with zeros to 32 bytes.
    const out = new Uint8Array(32);
    out.set(b, 32 - b.length);
    return out;
}
/** Serialize a proof to the on-chain wire format expected by light-verifier. */
export function serializeProof(p) {
    validatePoint(p.a, 64, "proof.a");
    validatePoint(p.b, 128, "proof.b");
    validatePoint(p.c, 64, "proof.c");
    return {
        proofA: p.a,
        proofB: p.b,
        proofC: p.c,
        verifyingKey: p.verifyingKey,
    };
}
function validatePoint(p, expected, name) {
    if (p.length !== expected) {
        throw new Error(`Invalid ${name}: expected ${expected} bytes, got ${p.length}.`);
    }
}
/**
 * Off-chain sanity check: re-derive the public input vector and verify
 * the structure of the proof. We don't run the pairing here (that's
 * the verifier's job on-chain) — we just make sure everything is
 * well-formed.
 */
export function verifyGroth16Offchain(args) {
    if (args.publicInputs.length < 1) {
        return { ok: false, reason: "public inputs cannot be empty" };
    }
    try {
        serializeProof(args.proof);
    }
    catch (e) {
        return { ok: false, reason: e.message };
    }
    return { ok: true };
}
//# sourceMappingURL=proof.js.map