

import { ReactNode } from "react";
import { cn } from "@/src/utils/cn";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-800"
      >
        {label}
      </label>

      {children}

      {hint && !error ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}

      {error ? (
        <p className={cn("text-xs font-medium text-red-600")}>{error}</p>
      ) : null}
    </div>
  );
}