import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const storybookConfigDir = path.join(dirname, ".storybook");
const chromeCanaryExecutable =
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary";

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: storybookConfigDir,
            storybookScript: "corepack pnpm --filter @turbo/storybook storybook --ci"
          })
        ],
        test: {
          name: `storybook:${storybookConfigDir}`,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              launchOptions: {
                executablePath: chromeCanaryExecutable
              }
            }),
            instances: [{ browser: "chromium" }]
          },
          setupFiles: ["./.storybook/vitest.setup.ts"]
        }
      }
    ]
  }
});
