import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so the built app works from a sub-path on any static host,
  // the same way ipe-portugues does.
  base: "./",
  // Built into docs/ because GitHub Pages serves this repo from that folder.
  // Keeping the build out of the repo root is what lets the source live here
  // too, instead of the two being shuffled together.
  build: { outDir: "docs", emptyOutDir: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
