
"use client";

import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { NotificationCard } from "@/src/features/notifications/notification-card";
import {
  useMarkNotificationReadMutation,
} from "@/src/features/notifications/hooks";
import { useProviderNotifications } from "@/src/features/provider/hooks";

export default function ProviderNotificationsPage() {
  const { data, isLoading, isError } = useProviderNotifications(20);
  const markReadMutation = useMarkNotificationReadMutation();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Notifications
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Stay updated on new bookings, confirmations, and platform activity.
        </p>
      </div>

      {isLoading ? <LoadingState label="Loading notifications..." /> : null}
      {isError ? (
        <ErrorState description="We could not load your notifications right now." />
      ) : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="Provider notifications will appear here as activity happens."
        />
      ) : null}

      {!isLoading && !isError && data?.length ? (
        <div className="grid gap-5">
          {data.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              isPending={markReadMutation.isPending}
              onMarkRead={(id) => markReadMutation.mutate(id)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}