/**
 * Light Protocol state tree helpers.
 *
 * Wraps the Photon indexer queries (via `@lightprotocol/stateless.js`)
 * and the address derivation / proof-fetching boilerplate for our
 * compressed accounts.
 */
/** Fetch a non-inclusion proof for a list of nullifier addresses. */
export async function fetchValidityProofV2(args) {
    const sdk = await import("@lightprotocol/stateless.js");
    const result = await sdk.getValidityProofV0(args.hashes ?? [], args.addressesWithTrees ?? [], []);
    return {
        compressedProof: result.compressedProof,
        rootIndices: result.rootIndices,
        addresses: result.addresses,
    };
}
/** Fetch the current v2 address tree info. */
export async function fetchAddressTreeV2(rpc) {
    const sdk = await import("@lightprotocol/stateless.js");
    return rpc.getAddressTreeV2();
}
/** Fetch a random v2 state tree for new outputs. */
export async function fetchRandomStateTreeV2(rpc) {
    const sdk = await import("@lightprotocol/stateless.js");
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