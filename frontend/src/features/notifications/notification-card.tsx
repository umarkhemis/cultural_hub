
"use client";

import { Button } from "@/src/components/ui/button";
import type { NotificationItem } from "@/src/types/notification";
import { formatDate } from "@/src/utils/formatDate";

type NotificationCardProps = {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
  isPending?: boolean;
};

export function NotificationCard({
  item,
  onMarkRead,
  isPending = false,
}: NotificationCardProps) {
  return (
    <div
      className={`rounded-[28px] border p-5 shadow-sm ${
        item.is_read
          ? "border-slate-200 bg-white"
          : "border-slate-300 bg-slate-50"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
          <p className="text-sm leading-6 text-slate-600">{item.message}</p>
          <p className="text-xs text-slate-500">{formatDate(item.created_at)}</p>
        </div>

        {!item.is_read ? (
          <Button
            variant="secondary"
            onClick={() => onMarkRead(item.id)}
            disabled={isPending}
          >
            Mark as read
          </Button>
        ) : null}
      </div>
    </div>
  );
}