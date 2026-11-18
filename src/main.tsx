import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastProvider } from "./hooks/useToast";
import ErrorBoundary from "./components/ErrorBoundary";
import { I18nProvider } from "./lib/i18n";
import { AuthProvider } from "./lib/auth";

/**
 * Marks the document as scriptable before first paint. The scroll-reveal
 * hidden state is scoped behind `.js`, so without scripting every section
 * renders at full opacity instead of staying invisible.
 */
document.documentElement.classList.add("js");

const container = document.getElementById("root")!;

const tree = (
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>
);

/*
 * Two entry conditions, one tree.
 *
 * When the document was prerendered (scripts/prerender.mjs replaced the empty
 * mount node with server markup) we hydrate, so the first paint is the real page
 * rather than a blank node. In `vite dev` the node is empty, so we create.
 *
 * Guarding on the node's contents rather than on an env flag is deliberate: an
 * empty root cannot be hydrated (React would throw), and a prerendered root that
 * were created instead of hydrated would flash and discard the server markup.
 */
/*
 * Hydrate only when this document was prerendered for *this* URL.
 *
 * scripts/prerender.mjs stamps <html data-prerendered="/services/web">. Comparing
 * that stamp with the current path is what stops a mismatch in the one case a
 * static host always has: an unknown URL (or a 404) is served the fallback
 * document, whose markup describes a different page. Hydrating that would throw,
 * so we create instead and let the router render the 404.
 */
function normalizePath(p: string) {
  const trimmed = p.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

const stamped = document.documentElement.getAttribute("data-prerendered");
const matches = stamped !== null && normalizePath(stamped) === normalizePath(window.location.pathname);

if (container.childElementCount > 0 && matches) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
