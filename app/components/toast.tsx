"use client";

import { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from "react";

/* ── Types ─────────────────────────────────────────────────────────── */

type ToastType = "success" | "error" | "info";

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

/* ── Context ───────────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>");
  return ctx;
}

/* ── Single toast ──────────────────────────────────────────────────── */

const TYPE_STYLES: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`${TYPE_STYLES[type]} px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 min-w-[260px] max-w-sm transition-all duration-300 ${
        exiting ? "translate-x-full opacity-0" : "animate-[slideInRight_0.3s_ease-out]"
      }`}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(onClose, 300);
        }}
        aria-label="Dismiss notification"
        className="flex-shrink-0 p-0.5 hover:opacity-80 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ── Provider ──────────────────────────────────────────────────────── */

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — top-right, fixed */}
      <div
        aria-label="Notifications"
        className="fixed top-4 right-4 z-[9998] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
