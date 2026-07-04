const DEFAULT_UPSTREAM =
  "https://raw.githubusercontent.com/Solizardking/clawdbot-go/main/install.sh";

const BASE_PREFIXES = ["/gobot"];

function stripBasePath(pathname) {
  for (const prefix of BASE_PREFIXES) {
    if (pathname === prefix || pathname === `${prefix}/`) {
      return "/";
    }
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length);
    }
  }
  return pathname;
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

function scriptHeaders(upstream) {
  return {
    "content-type": "text/x-shellscript; charset=utf-8",
    "cache-control": "public, max-age=60",
    "x-gobot-upstream": upstream,
  };
}

function metadata(url, env) {
  const origin = `${url.protocol}//${url.host}`;
  return {
    name: "gobot",
    repo: env.PROJECT_REPO || "https://github.com/Solizardking/clawdbot-go",
    ecosystemHub:
      env.ECOSYSTEM_HUB || "https://github.com/solizardking/solana-clawd",
    upstreamInstall: env.UPSTREAM_INSTALL_URL || DEFAULT_UPSTREAM,
    commands: {
      complete: `curl -fsSL ${origin}${url.pathname.includes("/gobot") ? "/gobot" : ""} | bash`,
      raw: `curl -fsSL ${origin}${url.pathname.includes("/gobot") ? "/gobot" : ""}/install.sh | bash`,
      coreAI: `curl -fsSL ${origin}${url.pathname.includes("/gobot") ? "/gobot" : ""}/core-ai | bash`,
    },
  };
}

function wrapperScript(env, options = {}) {
  const upstream = env.UPSTREAM_INSTALL_URL || DEFAULT_UPSTREAM;
  const complete = options.complete ?? env.DEFAULT_COMPLETE ?? "1";
  const coreAI = options.coreAI ? "1" : "";
  const exports = [
    complete
      ? `: "\${GOBOT_INSTALL_COMPLETE:=${complete}}"\nexport GOBOT_INSTALL_COMPLETE`
      : "",
    coreAI
      ? `: "\${GOBOT_INSTALL_CORE_AI:=${coreAI}}"\nexport GOBOT_INSTALL_CORE_AI`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `#!/usr/bin/env bash
set -euo pipefail

${exports}

curl -fsSL ${shellQuote(upstream)} | bash
`;
}

async function proxyInstall(env) {
  const upstream = env.UPSTREAM_INSTALL_URL || DEFAULT_UPSTREAM;
  const response = await fetch(upstream, {
    cf: { cacheEverything: true, cacheTtl: 60 },
  });

  if (!response.ok) {
    return new Response(`upstream installer fetch failed: ${response.status}\n`, {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(response.body, {
    status: 200,
    headers: scriptHeaders(upstream),
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = stripBasePath(url.pathname);

    if (path === "/healthz") {
      return new Response("ok\n", {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    if (path === "/.well-known/gobot-install.json") {
      return Response.json(metadata(url, env), {
        headers: { "cache-control": "public, max-age=60" },
      });
    }

    if (path === "/" || path === "/complete" || path === "/full") {
      const upstream = env.UPSTREAM_INSTALL_URL || DEFAULT_UPSTREAM;
      return new Response(wrapperScript(env, { complete: "1" }), {
        headers: scriptHeaders(upstream),
      });
    }

    if (path === "/core-ai") {
      const upstream = env.UPSTREAM_INSTALL_URL || DEFAULT_UPSTREAM;
      return new Response(wrapperScript(env, { complete: "", coreAI: true }), {
        headers: scriptHeaders(upstream),
      });
    }

    if (path === "/install.sh" || path === "/raw" || path === "/lite") {
      return proxyInstall(env);
    }

    return new Response("not found\n", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};
