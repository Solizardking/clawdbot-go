/**
 * ZkSharkAgent - the Shark of All Streets wrapper around the ZK primitive SDK.
 *
 * Exposes the four core operations a ZK Shark agent would want to do with
 * the ZK program as named methods, and wires in the
 * nullifier / proof / Light Protocol plumbing automatically:
 *
 *   agent.attestModel(...)        — publish an attestation for a model
 *   agent.commitEncryptedState(...) — commit an encrypted state blob
 *   agent.verifyProof(...)        — off-chain Groth16 sanity check
 *   agent.computeNullifier(...)    — derive a deterministic nullifier
 *
 * The class also exposes `runIntent(text, ctx)` for natural-language
 * routing (see `./intents.ts`).
 *
 * ```ts
 * const agent = await ZkSharkAgent.fromEnv();
 * const { signature, nullifier } = await agent.attestModel({
 *   modelHash: ...,
 *   payloadCommitment: ...,
 *   proof: { a, b, c, verifyingKey },
 *   context: "model-attest:v1:my-model",
 * });
 * ```
 */
import { TransactionInstruction, Keypair } from "@solana/web3.js";
import { ClawdZkClient, type Groth16Proof, type Bytes32 } from "@clawd/zk-client";
import { type ZkSharkAgentConfig, DEFAULT_PROGRAM_ID } from "./config.js";
import { type IntentContext, type IntentRoute } from "./intents.js";
export interface ZkSharkAgentOptions {
    /** Pre-built config. If omitted, the agent reads from `process.env`. */
    config?: ZkSharkAgentConfig;
    /** Pre-built ClawdZkClient. If omitted, the agent constructs one. */
    client?: ClawdZkClient;
    /** Optional keypair for signing. */
    signer?: Keypair;
}
export type ClawdZkAgentOptions = ZkSharkAgentOptions;
export interface AttestModelArgs {
    /** 32-byte hash identifying the model being attested to. */
    modelHash: Bytes32;
    /** 32-byte commitment to the encrypted payload. */
    payloadCommitment: Bytes32;
    /** Groth16 proof over (attester, model_hash, payload_commitment, nullifier). */
    proof: Groth16Proof;
    /** Domain-separated context tag (e.g. "model-attest:v1:<model_hash_hex>"). */
    context: string;
    /** Override the auto-derived nullifier (rare). */
    nullifier?: Bytes32;
}
export interface AttestModelResult {
    /** The derived nullifier, hex-encoded. */
    nullifierHex: string;
    /** The public input vector that was used for verification. */
    publicInputsPackedHex: string;
    /** Built instruction (handy for the caller if they want to send it themselves). */
    instruction: TransactionInstruction;
    /** The transaction signature, if `sendAndConfirm` was wired in. */
    signature?: string;
    /** Human-readable summary. */
    summary: string;
}
export interface CommitStateModelArgs {
    modelHash: Bytes32;
    ciphertextCommitment: Bytes32;
    stateVersion: number | bigint;
    proof: Groth16Proof;
    context: string;
}
export interface CommitStateResult {
    instruction: TransactionInstruction;
    publicInputsPackedHex: string;
    summary: string;
}
export interface VerifyProofArgs {
    proof: Groth16Proof;
    /** Optional public input vector. If absent, the agent builds one from the args. */
    publicInputs?: Bytes32[];
    /** Required for `publish-attestation` proof structure. */
    modelHash?: Bytes32;
    payloadCommitment?: Bytes32;
    nullifier?: Bytes32;
    attester?: Uint8Array;
}
export interface VerifyProofResult {
    ok: boolean;
    reason?: string;
    /** Computed public inputs (if the agent derived them). */
    publicInputsPackedHex?: string;
}
export declare class ZkSharkAgent {
    readonly config: ZkSharkAgentConfig;
    readonly client: ClawdZkClient;
    /** Optional signer; the agent can attest / commit without one (instruction-only). */
    signer?: Keypair;
    private constructor();
    /** Construct from an explicit config + optional client + optional signer. */
    static create(opts: ZkSharkAgentOptions): ZkSharkAgent;
    /** Construct from environment variables. */
    static fromEnv(): Promise<ZkSharkAgent>;
    /**
     * Convenience: load a proof JSON file from disk and return it as a
     * `Groth16Proof` with hex → bytes conversion.
     *
     * Expected shape: `{ a: "0x...", b: "0x...", c: "0x...", verifyingKey: "0x..." }`.
     */
    static loadProof(path: string): Promise<Groth16Proof>;
    /**
     * Compute a deterministic 32-byte nullifier from a (secret, context)
     * pair. Wraps the SDK and pins the secret-length check.
     */
    computeNullifierFor(secret: Uint8Array, context: string): Promise<Bytes32>;
    /**
     * Off-chain Groth16 sanity check. Does NOT re-run the pairing
     * (that's the on-chain verifier's job) — it just confirms the
     * proof is well-formed and the public inputs match the expected
     * shape.
     */
    verifyProof(args: VerifyProofArgs): VerifyProofResult;
    /**
     * Attest a model on-chain. Derives the nullifier from the
     * (signer secret, context) pair, builds the `publish_attestation`
     * instruction, and (if a signer is attached) submits it.
     */
    attestModel(args: AttestModelArgs): Promise<AttestModelResult>;
    /**
     * Commit an encrypted state blob (model weights, training data, etc.)
     * on-chain. Mirrors `attestModel` for the `commit_encrypted_state` ix.
     */
    commitEncryptedState(args: CommitStateModelArgs): Promise<CommitStateResult>;
    /**
     * Natural-language intent router. Recognises the same phrases that
     * the `zk-shark-agent` CLI exposes as subcommands and dispatches to
     * the matching method.
     */
    runIntent(text: string, ctx?: IntentContext): Promise<IntentRoute>;
    /** Pretty-print the active configuration (handy for `zk-shark-agent inspect`). */
    describe(): string;
    private trySend;
}
export { ZkSharkAgent as ClawdZkAgent };
export { DEFAULT_PROGRAM_ID };
export type { Groth16Proof, Bytes32 };
export type { Keypair as SolanaKeypair } from "@solana/web3.js";
export type { createKeyPairSignerFromBytes } from "@solana/kit";
//# sourceMappingURL=agent.d.ts.map