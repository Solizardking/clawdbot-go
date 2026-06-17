/**
 * Light Protocol state tree helpers.
 *
 * Wraps the Photon indexer queries (via `@lightprotocol/stateless.js`)
 * and the address derivation / proof-fetching boilerplate for our
 * compressed accounts.
 */
/** Fetch a non-inclusion proof for a list of nullifier addresses. */
export async function fetchValidityProofV2(args) {
    const rpc = args.rpc;
    if (!rpc.getValidityProofV0) {
        throw new Error("RPC client does not expose getValidityProofV0; use a Light-compatible RPC wrapper.");
    }
    const result = await rpc.getValidityProofV0(args.hashes ?? [], args.addressesWithTrees ?? []);
    return {
        compressedProof: result.compressedProof,
        rootIndices: result.rootIndices,
        addresses: result.addresses,
    };
}
/** Fetch the current v2 address tree info. */
export async function fetchAddressTreeV2(rpc) {
    if (typeof rpc.getAddressTreeV2 !== "function") {
        throw new Error("RPC client does not expose getAddressTreeV2; use a Light-compatible RPC wrapper.");
    }
    return rpc.getAddressTreeV2();
}
/** Fetch a random v2 state tree for new outputs. */
export async function fetchRandomStateTreeV2(rpc) {
    if (typeof rpc.getRandomStateTreeInfo !== "function") {
        throw new Error("RPC client does not expose getRandomStateTreeInfo; use a Light-compatible RPC wrapper.");
    }
    const info = await rpc.getRandomStateTreeInfo();
    return { tree: info.tree, queue: info.queue };
}
/** Pack tree info into a `PackedAccounts` struct for the on-chain CPI. */
export async function packAccounts(args) {
    const sdk = await import("@lightprotocol/stateless.js");
    const { PackedAccounts, SystemAccountMetaConfig } = sdk;
    const packed = new PackedAccounts();
    packed.addSystemAccountsV2(SystemAccountMetaConfig.new(args.programId));
    const addressMerkleTreeIndex = packed.insertOrGet(args.treeInfo.addressTree);
    const outputStateTreeIndex = packed.insertOrGet(args.treeInfo.stateTree);
    return {
        packed,
        addressMerkleTreeIndex,
        outputStateTreeIndex,
    };
}
//# sourceMappingURL=state.js.map