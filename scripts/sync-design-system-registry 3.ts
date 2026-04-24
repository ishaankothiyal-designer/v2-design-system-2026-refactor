import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { designSystemRegistry } from "../packages/contracts/src/registry";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const storybookOutputPath = path.join(repoRoot, "apps/storybook/public/design-system-registry.json");
const cliGeneratedDir = path.join(repoRoot, "packages/cli/src/generated");
const cliGeneratedModulePath = path.join(cliGeneratedDir, "design-system-registry.ts");

const registryJson = `${JSON.stringify(designSystemRegistry, null, 2)}\n`;
const registryModule = `import type { DesignSystemRegistry } from "@geist/contracts";

export const designSystemRegistry: DesignSystemRegistry = ${registryJson.trim()} as const;
`;

async function main(): Promise<void> {
  await mkdir(path.dirname(storybookOutputPath), { recursive: true });
  await mkdir(cliGeneratedDir, { recursive: true });

  await Promise.all([
    writeFile(storybookOutputPath, registryJson, "utf8"),
    writeFile(cliGeneratedModulePath, registryModule, "utf8")
  ]);

  console.log(`Synced design system registry to:
- ${storybookOutputPath}
- ${cliGeneratedModulePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
