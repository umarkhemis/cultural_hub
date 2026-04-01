
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  meta?: string;
  children?: ReactNode;
};

export function AdminListCard({ title, subtitle, meta, children }: Props) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
          ) : null}
        </div>

        {meta ? (
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {meta}
          </div>
        ) : null}
      </div>

      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}