/**
 * Light Protocol state tree helpers.
 *
 * Wraps the Photon indexer queries (via `@lightprotocol/stateless.js`)
 * and the address derivation / proof-fetching boilerplate for our
 * compressed accounts.
 */
import type { PublicKey } from "@solana/web3.js";
import type { Bytes32 } from "./types.js";
export interface CompressedValidityProof {
    a: number[];
    b: number[];
    c: number[];
}
export interface ValidityProof {
    /** Compressed proof over the Merkle proof. */
    compressedProof: CompressedValidityProof;
    /** Root indices for each leaf. */
    rootIndices: number[];
}
export interface HashWithTreeInput {
    hash: Bytes32;
    tree: PublicKey;
    queue?: PublicKey;
}
export interface AddressWithTreeInput {
    address: PublicKey | Bytes32;
    tree: PublicKey;
    queue?: PublicKey;
}
export interface PackedAddressTreeInfo {
    addressMerkleTreePubkeyIndex: number;
    addressQueuePubkeyIndex: number;
    rootIndex: number;
}
export interface PackedStateTreeInfo {
    stateTree: PublicKey;
    outputQueue: PublicKey;
    rootIndex: number;
}
/** Fetch a non-inclusion proof for a list of nullifier addresses. */
export declare function fetchValidityProofV2(args: {
    rpc: any;
    hashes?: HashWithTreeInput[];
    addressesWithTrees?: AddressWithTreeInput[];
}): Promise<ValidityProof>;
/** Fetch the current v2 address tree info. */
export declare function fetchAddressTreeV2(rpc: any): Promise<PublicKey>;
/** Fetch a random v2 state tree for new outputs. */
export declare function fetchRandomStateTreeV2(rpc: any): Promise<{
    tree: PublicKey;
    queue: PublicKey;
}>;
/** Pack tree info into a `PackedAccounts` struct for the on-chain CPI. */
export declare function packAccounts(args: {
    rpc: any;
    programId: PublicKey;
    treeInfo: {
        addressTree: PublicKey;
        stateTree: PublicKey;
        outputQueue: PublicKey;
    };
    proof: ValidityProof;
}): Promise<{
    packed: import("@lightprotocol/stateless.js").PackedAccounts;
    addressMerkleTreeIndex: number;
    outputStateTreeIndex: number;
}>;
//# sourceMappingURL=state.d.ts.map