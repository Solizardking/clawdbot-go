/**
 * Natural-language intent router for the Clawd ZK Agent.
 *
 * Maps a free-form text input (e.g. "attest this model with hash 0xab12…")
 * to one of the agent's typed methods. Used by:
 *   - the `clawd-zk-agent` CLI (`clawd-zk-agent ask "…"`)
 *   - the Clawd REPL bridge (`clawd-code code "use the zk agent to attest…"`)
 *   - any external LLM that wants to drive the agent
 *
 * The router is deliberately deterministic and rule-based — no model
 * calls — so it is fast, predictable, and CI-testable.
 */
import { ClawdZkAgent } from "./agent.js";
/** Intents the agent knows how to handle. */
export declare const KNOWN_INTENTS: readonly ["attest-model", "commit-state", "verify-proof", "compute-nullifier", "inspect", "help"];
export type KnownIntent = (typeof KNOWN_INTENTS)[number];
/** A concrete, executable plan — the agent method + its arguments. */
export interface IntentRoute {
    intent: KnownIntent;
    /** The agent method to invoke (or a synthetic action for `help` / `inspect`). */
    action: "attestModel" | "commitEncryptedState" | "verifyProof" | "computeNullifier" | "describe" | "help";
    /** Args the caller should pass to the agent method. */
    args: Record<string, unknown>;
    /** Confidence score 0..1. Useful for LLM-driven callers. */
    confidence: number;
    /** Human-readable one-liner explaining the match. */
    rationale: string;
}
/** Extra context the caller can supply (e.g. the current model hash). */
export interface IntentContext {
    modelHash?: string;
    payloadCommitment?: string;
    ciphertextCommitment?: string;
    stateVersion?: number | bigint;
    context?: string;
    proofPath?: string;
    nullifier?: string;
}
/**
 * Route a free-form text input to a typed intent + args.
 *
 * Pure function — does NOT call any agent methods. The caller invokes
 * the returned `action` on the agent.
 */
export declare function routeIntent(text: string, _agent: ClawdZkAgent, ctx?: IntentContext): IntentRoute;
/**
 * Execute a route against an agent. Convenience wrapper for the
 * CLI / REPL — single call that does the route + dispatch.
 */
export declare function dispatchRoute(route: IntentRoute, agent: ClawdZkAgent): Promise<unknown>;
//# sourceMappingURL=intents.d.ts.map