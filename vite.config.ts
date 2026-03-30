import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: { port: 3000 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["@tanstack/react-router"],
          state: ["zustand", "immer"],
          utils: ["remeda", "ts-pattern", "zod"],
          i18n: ["@lingui/core", "@lingui/react"],
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
      onwarn(warning, warn) {
        if (
          warning.plugin === "vite:dynamic-import-vars" ||
          warning.code === "DYNAMIC_IMPORT_VARIABLE"
        ) {
          throw new Error(`Invalid dynamic import path: ${warning.message}`);
        }
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    tsconfigPaths(),
    tanstackRouter(),
    react({
      plugins: [
        [
          "@lingui/swc-plugin",
          {
            runtimeModules: {
              i18n: ["@lingui/core", "i18n"],
              trans: ["@lingui/react", "Trans"],
            },
          },
        ],
      ],
    }),
    lingui(),
    tailwindcss(),
  ],
});
