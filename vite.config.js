import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
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
