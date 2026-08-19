import { useToast } from "@/hooks/useToast";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={[
            "flex items-start gap-3 px-4 py-3 border shadow-lg max-w-sm",
            "transform transition-all duration-300",
            toast.type === "error"
              ? "bg-white text-black border-black"
              : toast.type === "success"
                ? "bg-black text-white border-white"
                : "bg-white text-black border-black",
          ].join(" ")}
          style={{ animation: "toast-in 300ms ease-out" }}
        >
          <span className="font-mono text-[11px] tracking-mono mt-0.5">
            {toast.type === "error" ? "ERR" : toast.type === "success" ? "OK" : "INFO"}
          </span>
          <p className="text-[13.5px] leading-[1.5] flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="font-mono text-[11px] tracking-mono opacity-60 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
