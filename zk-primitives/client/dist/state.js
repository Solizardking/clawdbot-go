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
    const hashes = (args.hashes ?? []).map((item) => ({
        hash: sdk.createBN254(item.hash),
        tree: item.tree,
        queue: item.queue ?? item.tree,
    }));
    const addresses = (args.addressesWithTrees ?? []).map((item) => ({
        address: sdk.createBN254(item.address instanceof Uint8Array ? item.address : item.address.toBytes()),
        tree: item.tree,
        queue: item.queue ?? item.tree,
    }));
    if (typeof args.rpc?.getValidityProofV0 !== "function") {
        throw new Error("RPC client does not implement getValidityProofV0");
    }
    const result = await args.rpc.getValidityProofV0(hashes, addresses);
    if (!result.compressedProof) {
        throw new Error("validity proof response missing compressed proof");
    }
    return {
        compressedProof: result.compressedProof,
        rootIndices: result.rootIndices,
    };
}
/** Fetch the current v2 address tree info. */
export async function fetchAddressTreeV2(rpc) {
    return rpc.getAddressTreeV2();
}
/** Fetch a random v2 state tree for new outputs. */
export async function fetchRandomStateTreeV2(rpc) {
    const info = await rpc.getRandomStateTreeInfo();
    return { tree: info.tree, queue: info.queue };
}
/** Pack tree info into a `PackedAccounts` struct for the on-chain CPI. */
export async function packAccounts(args) {
    const sdk = await import("@lightprotocol/stateless.js");
    const { PackedAccounts, SystemAccountMetaConfig } = sdk;
    const packed = PackedAccounts.newWithSystemAccounts(SystemAccountMetaConfig.new(args.programId));
    const addressMerkleTreeIndex = packed.insertOrGet(args.treeInfo.addressTree);
    const outputStateTreeIndex = packed.insertOrGet(args.treeInfo.stateTree);
    return {
        packed,
        addressMerkleTreeIndex,
        outputStateTreeIndex,
    };
}
//# sourceMappingURL=state.js.map