import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,

    // 🔑 CLÉ ABSOLUE
    failOnNoTests: false,

    include: ["src/**/*.{test,spec}.{ts,tsx,js,jsx}"],
    exclude: ["frontend/**"],
  },
});