
"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { ROUTES } from "@/src/constants/routes";
import { Button } from "@/src/components/ui/button";
import { useUIStore } from "@/src/store/ui-store";

export function AuthRequiredModal() {
  const { authPromptOpen, authPromptMessage, closeAuthPrompt } = useUIStore();

  if (!authPromptOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Authentication required
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {authPromptMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={closeAuthPrompt}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={ROUTES.login} className="flex-1" onClick={closeAuthPrompt}>
            <Button fullWidth>Login</Button>
          </Link>

          <Link href={ROUTES.register} className="flex-1" onClick={closeAuthPrompt}>
            <Button variant="secondary" fullWidth>
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}