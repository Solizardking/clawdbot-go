import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@solana/web3.js", "@solana/spl-token"],
  turbopack: {
    // Tell Turbopack not to try to bundle Node-only builtins that Solana
    // wallet libs reference via optional requires.
    resolveAlias: {
      "pino-pretty": "@/lib/solana/noop-module",
      encoding: "@/lib/solana/noop-module",
    },
  },
};

export default nextConfig;
