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
        const url = (req.url ?? "").split("?")[0];

        if (url === "/api/health" && req.method === "GET") {
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

        if ((url === "/api/checkout" || url === "/api/paystack") && req.method === "POST") {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 503;
          res.end(JSON.stringify({ configured: false, error: "Payments are not configured in dev." }));
          return;
        }

        if (url === "/api/brief" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const data = JSON.parse(body || "{}");
              // Log shape, never contents: a brief carries a name, an email and
              // whatever the sender chose to disclose. Terminal scrollback and
              // captured CI logs are not a safe place for that.
              console.log(
                "[Dev Server] Brief received:",
                JSON.stringify({
                  name: data?.name ? "***" : undefined,
                  email: data?.email ? "***" : undefined,
                  service: data?.service,
                  briefChars: typeof data?.brief === "string" ? data.brief.length : 0,
                })
              );
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
    /**
     * Pin the port. Without `strictPort`, a second `npm run dev` silently takes
     * 5174 and the preview URL — which is built from 5173 — keeps showing
     * whichever server grabbed it first. That is how a stale dev server (started
     * before the codebase was swapped) ended up serving the preview while a
     * correct one ran one port over. Failing loudly is better than drifting.
     */
    port: 5173,
    strictPort: true,
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
