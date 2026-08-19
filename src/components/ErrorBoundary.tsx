import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, send to an error tracking service (Sentry, etc.)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center px-6">
          <div className="max-w-md">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
              ERR / RENDER
            </div>
            <h1 className="font-display text-3xl tracking-display leading-tight mb-4">
              Something went wrong.
            </h1>
            <p className="text-[15px] leading-[1.6] opacity-80 mb-6">
              The page encountered an unexpected error. Try refreshing, or reach
              us directly at{" "}
              <a
                href="mailto:hello@theoffice.studio"
                className="border-b border-black"
              >
                hello@theoffice.studio
              </a>
              .
            </p>
            <button
              onClick={() => window.location.reload()}
              className="border border-black px-4 py-2.5 font-mono text-[12px] tracking-mono font-semibold hover:bg-black hover:text-white transition-colors"
            >
              RELOAD PAGE
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
