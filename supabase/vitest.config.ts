import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    globalSetup: ["tests/support/global-setup.ts"],
    // Tests share one database; run files one at a time.
    fileParallelism: false,
    testTimeout: 20_000,
  },
});
