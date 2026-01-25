import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,

    // ⛔ AUCUN setupFiles
    // ⛔ AUCUN setup.ts
    // ⛔ AUCUN frontend/

    include: [
      "src/**/*.{test,spec}.{ts,tsx,js,jsx}"
    ],
  },
});