#!/usr/bin/env node
/**
 * zk-shark-agent - CLI entry point for ZK Shark, the Shark of All Streets.
 *
 * Subcommands:
 *
 *   zk-shark-agent inspect
 *     Print the active configuration (RPC, program, network, signer).
 *
 *   zk-shark-agent attest <modelHash> <payloadCommitment> <proof.json> [--context <ctx>]
 *     Build and (when a signer is attached) submit a publish_attestation
 *     instruction. The proof is read from <proof.json> as
 *     `{ a, b, c, verifyingKey }` (hex strings).
 *
 *   zk-shark-agent commit <ciphertextCommitment> <stateVersion> <proof.json> [--model <modelHash>]
 *     Build a commit_encrypted_state instruction.
 *
 *   zk-shark-agent verify <proof.json>
 *     Off-chain Groth16 sanity check (point sizes + public input packing).
 *
 *   zk-shark-agent nullifier <context>
 *     Derive a deterministic 32-byte nullifier for the given context.
 *
 *   zk-shark-agent ask "<natural language>"
 *     Use the deterministic intent router to map the text to an action,
 *     then dispatch it.
 *
 *   zk-shark-agent help
 *     Print this help.
 */
/** Exported for testing — wraps the CLI body in a try/catch and exits with the right code. */
export declare function runCli(argv?: string[]): Promise<number>;
//# sourceMappingURL=cli.d.ts.map