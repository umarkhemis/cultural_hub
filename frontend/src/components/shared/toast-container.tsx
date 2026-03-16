
"use client";

import { X } from "lucide-react";
import { cn } from "@/src/utils/cn";
import { useToastStore } from "@/src/store/toast-store";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-[110] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-2xl border p-4 shadow-lg backdrop-blur",
            toast.type === "success" &&
              "border-emerald-200 bg-emerald-50 text-emerald-900",
            toast.type === "error" &&
              "border-red-200 bg-red-50 text-red-900",
            toast.type === "info" &&
              "border-slate-200 bg-white text-slate-900"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-sm opacity-90">{toast.description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded-lg p-1 hover:bg-black/5"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}