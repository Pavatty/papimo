import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportsDirectory: "./coverage",
      include: [
        "src/lib/auth/**/*.ts",
        "src/lib/moderation/**/*.ts",
        "src/lib/messages/**/*.ts",
        "src/lib/payments/konnect.ts",
        "src/lib/payments/stripe.ts",
        "src/lib/payments/pricing.ts",
        "src/lib/search/**/*.ts",
        "src/lib/listing/format.ts",
        "src/lib/listing/property-format.ts",
        "src/hooks/usePublishDraft.ts",
      ],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/**/*.d.ts",
        "src/types/**",
      ],
      thresholds: {
        lines: 60,
        statements: 60,
        functions: 60,
        branches: 50,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
