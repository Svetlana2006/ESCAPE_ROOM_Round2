import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        signal: resolve(__dirname, "signal.html"),
        unlocked: resolve(__dirname, "unlocked.html"),
      },
    },
  },
});
