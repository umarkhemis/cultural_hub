
"use client";

import { PageContainer } from "@/src/components/layout/page-container";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { NotificationCard } from "@/src/features/notifications/notification-card";
import {
  useMarkNotificationReadMutation,
  useNotifications,
} from "@/src/features/notifications/hooks";

export default function TouristNotificationsPage() {
  const { data, isLoading, isError } = useNotifications(20);
  const markReadMutation = useMarkNotificationReadMutation();

  return (
    <main className="py-2">
      <PageContainer className="max-w-4xl px-0 sm:px-0">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Stay updated on bookings, payments, and experience activity.
          </p>
        </div>

        {isLoading ? <LoadingState label="Loading notifications..." /> : null}
        {isError ? (
          <ErrorState description="We could not load your notifications right now." />
        ) : null}

        {!isLoading && !isError && data?.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            description="Your booking and activity notifications will appear here."
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
      </PageContainer>
    </main>
  );
}