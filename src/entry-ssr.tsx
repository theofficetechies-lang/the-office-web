/**
 * Server-render entry used only by the smoke test (`npm run smoke`).
 * It is never part of the client bundle — vite.config.ts builds main.tsx.
 *
 * The provider stack mirrors main.tsx exactly, so the smoke test renders the
 * same tree a browser would hydrate. Rendering the real App in Node catches
 * route-level crashes (a missing data record, a bad import, an undefined
 * access during render) that a typecheck alone cannot see.
 */
import { renderToString } from "react-dom/server";
import App from "./App";
import { ToastProvider } from "./hooks/useToast";
import { I18nProvider } from "./lib/i18n";
import ErrorBoundary from "./components/ErrorBoundary";

export function render(): string {
  return renderToString(
    <ErrorBoundary>
      <I18nProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
