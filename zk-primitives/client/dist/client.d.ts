/**
 * GoBotZkClient — high-level orchestrator.
 *
 * Glues together nullifier computation, Groth16 proof assembly, and
 * Light Protocol validity-proof fetching into single-method calls
 * that produce ready-to-sign Solana instructions.
 */
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { GoBotZkClientConfig, CommitStateArgs, PublishAttestationArgs } from "./types.js";
export declare class GoBotZkClient {
    readonly rpc: any;
    readonly programId: PublicKey;
    readonly photonUrl: string;
    readonly apiKey?: string;
    readonly commitment: "processed" | "confirmed" | "finalized";
    constructor(config: GoBotZkClientConfig);
    /**
     * Build a `publish_attestation` instruction. The caller must supply
     * the Groth16 proof (already generated off-chain). This method does
     * the rest: derives the nullifier address, fetches the validity
     * proof, packs the system accounts.
     */
    publishAttestation(args: PublishAttestationArgs): Promise<TransactionInstruction>;
    /**
     * Build a `commit_encrypted_state` instruction. The off-chain
     * committer must supply a Groth16 proof that they know the
     * plaintext (or have a valid license).
     */
    commitEncryptedState(args: CommitStateArgs): Promise<TransactionInstruction>;
}
//# sourceMappingURL=client.d.ts.map