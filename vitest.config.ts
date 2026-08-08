import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Resolve the "@/…" path alias (mirrors tsconfig `paths`) for the test runner.
const rootDir = resolve(dirname(fileURLToPath(import.meta.url))).replace(/\\/g, "/");

export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: `${rootDir}/` }],
  },
  test: {
    // Pure logic tests — no DOM/React needed.
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
