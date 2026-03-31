
import { cn } from "@/src/utils/cn";

export function BookingStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize",
        status === "confirmed" && "bg-emerald-100 text-emerald-700",
        status === "awaiting_payment" && "bg-amber-100 text-amber-700",
        status === "cancelled" && "bg-red-100 text-red-700",
        status === "expired" && "bg-slate-200 text-slate-700",
        status === "completed" && "bg-blue-100 text-blue-700"
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize",
        status === "paid" && "bg-emerald-100 text-emerald-700",
        status === "pending" && "bg-amber-100 text-amber-700",
        status === "unpaid" && "bg-slate-200 text-slate-700",
        status === "failed" && "bg-red-100 text-red-700",
        status === "refunded" && "bg-purple-100 text-purple-700"
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}