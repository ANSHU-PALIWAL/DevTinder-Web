import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "vendor-react";
            }
            if (id.includes("framer-motion")) {
              return "vendor-framer";
            }
            if (id.includes("mapbox-gl") || id.includes("maplibre-gl") || id.includes("react-map-gl")) {
              return "vendor-map";
            }
            return "vendor";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script-defer",
      // 🚀 ADD THIS BLOCK TO ENABLE TESTING IN DEV MODE
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.png", "Logo500.png"],
      manifest: {
        name: "ConnectNeighbour",
        short_name: "Connect",
        description: "The most trusted hyper-local network.",
        theme_color: "#10b981",
        background_color: "#f8fafc",
        display: "standalone",
        icons: [
          {
            src: "Logo500.png",
            sizes: "500x500",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
