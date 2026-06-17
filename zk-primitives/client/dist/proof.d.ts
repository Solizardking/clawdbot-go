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
import type { Groth16Proof, Bytes32 } from "./types.js";
/** Public input shape for a publish-attestation. */
export interface PublishAttestationPublicInputs {
    attester: Uint8Array;
    modelHash: Bytes32;
    payloadCommitment: Bytes32;
    nullifier: Bytes32;
}
/** Public input shape for a consume-attestation. */
export interface ConsumeAttestationPublicInputs {
    consumer: Uint8Array;
    attestationAddress: Bytes32;
    consumeNonce: Bytes32;
}
/** Public input shape for a commit-encrypted-state. */
export interface CommitStatePublicInputs {
    committer: Uint8Array;
    modelHash: Bytes32;
    ciphertextCommitment: Bytes32;
    stateVersion: bigint | number;
}
/** Pack a public input vector into the canonical 32-byte-per-field form. */
export declare function packPublicInputs(inputs: (Bytes32 | Uint8Array)[]): Uint8Array;
/** Build the public input vector for a publish-attestation call. */
export declare function buildPublishPublicInputs(p: PublishAttestationPublicInputs): Bytes32[];
/** Build the public input vector for a consume-attestation call. */
export declare function buildConsumePublicInputs(p: ConsumeAttestationPublicInputs): Bytes32[];
/** Build the public input vector for a commit-encrypted-state call. */
export declare function buildCommitPublicInputs(p: CommitStatePublicInputs): Bytes32[];
/** Serialize a proof to the on-chain wire format expected by light-verifier. */
export declare function serializeProof(p: Groth16Proof): {
    proofA: Uint8Array;
    proofB: Uint8Array;
    proofC: Uint8Array;
    verifyingKey: Uint8Array;
};
/**
 * Off-chain sanity check: re-derive the public input vector and verify
 * the structure of the proof. We don't run the pairing here (that's
 * the verifier's job on-chain) — we just make sure everything is
 * well-formed.
 */
export declare function verifyGroth16Offchain(args: {
    proof: Groth16Proof;
    publicInputs: Bytes32[];
}): {
    ok: boolean;
    reason?: string;
};
//# sourceMappingURL=proof.d.ts.map