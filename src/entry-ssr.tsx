/**
 * Server-render entry used by the prerender step and the SSR smoke test.
 * It is never part of the client bundle — vite.config.ts builds main.tsx.
 *
 * The provider stack mirrors main.tsx exactly, so both the prerenderer and the
 * smoke test render the same tree a browser would hydrate. Rendering the real App
 * in Node catches route-level crashes (a missing data record, a bad import, an
 * undefined access during render) that a typecheck alone cannot see.
 */
/*
 * renderToPipeableStream, not renderToString.
 *
 * Route components are lazy-loaded (see App.tsx), and renderToString aborts the
 * whole tree the moment it meets a lazy boundary, emitting only the fallback — so
 * every page behind a code-split route prerendered as an empty shell. The streaming
 * API waits for the suspense boundary, which is exactly the difference that lets a
 * code-split site also be prerendered.
 */
import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "node:stream";
import App from "./App";
import { ToastProvider } from "./hooks/useToast";
import { I18nProvider } from "./lib/i18n";
import { AuthProvider } from "./lib/auth";
import ErrorBoundary from "./components/ErrorBoundary";

export function render(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let html = "";
    const writable = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
    });
    writable.on("finish", () => resolve(html));

    /*
     * renderToPipeableStream resolves lazily, so onAllReady fires before any bytes
     * are written. Pipe first, then resolve on the writer's own "finish" event —
     * that is the only signal that guarantees the string is complete.
     */
    const { pipe } = renderToPipeableStream(
      <ErrorBoundary>
        <I18nProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </ErrorBoundary>,
      {
        onAllReady() {
          pipe(writable);
        },
        onError(err) {
          /*
           * A suspense boundary that fails to resolve would otherwise hand back a
           * partial document; reject so the caller aborts the build loudly.
           */
          reject(err);
        },
      }
    );
  });
}
