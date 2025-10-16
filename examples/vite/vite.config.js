import { defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      // Try to ignore the warning and proceed
      onwarn(warning, warn) {
        // Ignore warnings about external modules
        if (warning.code === "UNRESOLVED_IMPORT") {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    include: [
      "jspdf",
      "@babel/runtime/helpers/typeof",
      "@babel/runtime/helpers/slicedToArray",
      "fflate",
      "fast-png"
    ]
  }
});
