import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function devApiPlugin(): Plugin {
  return {
    name: "dev-api-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/api/health" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "ok",
              timestamp: new Date().toISOString(),
              checks: { dev: true },
            })
          );
          return;
        }

        if (req.url === "/api/checkout" && req.method === "POST") {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 503;
          res.end(JSON.stringify({ configured: false, error: "Payments are not configured in dev." }));
          return;
        }

        if (req.url === "/api/brief" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const data = JSON.parse(body || "{}");
              console.log("[Dev Server] Brief received:", data);
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: true,
                  message: "Brief received. We reply within two working days.",
                })
              );
            } catch {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: false,
                  error: "Invalid request payload",
                })
              );
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  build: {
    // Production sourcemaps expose the full source tree and add ~1 MB to every
    // deploy. Dev keeps its own sourcemaps automatically.
    sourcemap: false,
    rollupOptions: {
      output: {
        /**
         * Keep every dependency out of the app chunk. The previous
         * `manualChunks: { vendor: ["react", "react-dom"] }` form only caught
         * `react` itself — react-dom and scheduler stayed in the 274 kB entry
         * chunk, which defeats the point of splitting.
         */
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
          return undefined;
        },
      },
    },
  },
});
