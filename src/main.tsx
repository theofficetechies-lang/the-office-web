import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastProvider } from "./hooks/useToast";
import ErrorBoundary from "./components/ErrorBoundary";
import { I18nProvider } from "./lib/i18n";

/**
 * Marks the document as scriptable before first paint. The scroll-reveal
 * hidden state is scoped behind `.js`, so without scripting every section
 * renders at full opacity instead of staying invisible.
 */
document.documentElement.classList.add("js");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>
);
