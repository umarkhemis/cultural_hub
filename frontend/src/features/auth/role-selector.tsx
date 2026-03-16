
"use client";

import { cn } from "@/src/utils/cn";

type AuthRole = "tourist" | "provider";

type RoleSelectorProps = {
  value: AuthRole;
  onChange: (value: AuthRole) => void;
};

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onChange("tourist")}
        className={cn(
          "rounded-xl px-4 py-3 text-sm font-medium transition",
          value === "tourist"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        Tourist
      </button>

      <button
        type="button"
        onClick={() => onChange("provider")}
        className={cn(
          "rounded-xl px-4 py-3 text-sm font-medium transition",
          value === "provider"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        Cultural Service Provider
      </button>
    </div>
  );
}