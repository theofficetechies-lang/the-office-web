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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
