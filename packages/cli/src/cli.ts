#!/usr/bin/env node

import http from "node:http";

import { getComponentByIdOrName, getRegistry, getRegistrySummary, searchComponents } from "./index.js";

function printHelp(): void {
  console.log(`Turbo Design System CLI

Usage:
  turbo-ds registry [--pretty]
  turbo-ds components [query]
  turbo-ds component <canonical-id-or-name>
  turbo-ds serve [--port 3210]
  turbo-ds help
`);
}

function printJson(value: unknown, pretty = true): void {
  console.log(JSON.stringify(value, null, pretty ? 2 : 0));
}

function sendJson(response: http.ServerResponse, statusCode: number, payload: unknown): void {
  response.writeHead(statusCode, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function parsePort(args: string[]): number {
  const portFlagIndex = args.findIndex((arg) => arg === "--port");
  const candidate = portFlagIndex >= 0 ? Number(args[portFlagIndex + 1]) : 3210;

  if (!Number.isInteger(candidate) || candidate <= 0) {
    throw new Error("Invalid port. Use a positive integer, for example --port 3210.");
  }

  return candidate;
}

function startServer(args: string[]): void {
  const port = parsePort(args);
  const server = http.createServer((request, response) => {
    if (!request.url) {
      sendJson(response, 400, { error: "Missing request URL." });
      return;
    }

    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, OPTIONS",
        "access-control-allow-headers": "content-type"
      });
      response.end();
      return;
    }

    if (request.method !== "GET") {
      sendJson(response, 405, { error: "Method not allowed. Use GET." });
      return;
    }

    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    const pathName = url.pathname;

    if (pathName === "/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (pathName === "/manifest") {
      sendJson(response, 200, {
        name: "Turbo Design System API",
        version: "0.1.0",
        endpoints: ["/health", "/manifest", "/registry", "/components", "/components/:id"]
      });
      return;
    }

    if (pathName === "/registry") {
      sendJson(response, 200, {
        summary: getRegistrySummary(),
        registry: getRegistry()
      });
      return;
    }

    if (pathName === "/components") {
      const query = url.searchParams.get("q") ?? undefined;
      sendJson(response, 200, {
        total: searchComponents(query).length,
        items: searchComponents(query)
      });
      return;
    }

    if (pathName.startsWith("/components/")) {
      const idOrName = decodeURIComponent(pathName.replace("/components/", ""));
      const component = getComponentByIdOrName(idOrName);

      if (!component) {
        sendJson(response, 404, { error: `Component '${idOrName}' was not found.` });
        return;
      }

      sendJson(response, 200, component);
      return;
    }

    sendJson(response, 404, { error: `Unknown endpoint '${pathName}'.` });
  });

  server.listen(port, () => {
    console.log(`Turbo Design System API running on http://127.0.0.1:${port}`);
    console.log("Endpoints: /health, /manifest, /registry, /components, /components/:id");
  });
}

function main(): void {
  const [, , command = "help", ...args] = process.argv;

  switch (command) {
    case "registry":
      printJson({
        summary: getRegistrySummary(),
        registry: getRegistry()
      });
      return;
    case "components": {
      const query = args.find((arg) => !arg.startsWith("--"));
      printJson(searchComponents(query));
      return;
    }
    case "component": {
      const target = args.find((arg) => !arg.startsWith("--"));

      if (!target) {
        throw new Error("Please provide a canonical id or component name.");
      }

      const component = getComponentByIdOrName(target);

      if (!component) {
        throw new Error(`Component '${target}' was not found.`);
      }

      printJson(component);
      return;
    }
    case "serve":
      startServer(args);
      return;
    case "help":
    case "--help":
    case "-h":
      printHelp();
      return;
    default:
      throw new Error(`Unknown command '${command}'. Run 'turbo-ds help' for usage.`);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown CLI error.";
  console.error(message);
  process.exitCode = 1;
}
