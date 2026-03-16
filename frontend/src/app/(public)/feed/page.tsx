
"use client";

import { PageContainer } from "@/src/components/layout/page-container";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { PublicFeedList } from "@/src/features/experiences/public-feed-list";
import { usePublicFeed } from "@/src/features/experiences/hooks";

export default function FeedPage() {
  const { data, isLoading, isError } = usePublicFeed(null, 12);

  return (
    <main className="bg-slate-50 py-8 sm:py-10">
      <PageContainer className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Experience Feed
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Discover public cultural experiences shared by verified and emerging providers.
          </p>
        </div>

        {isLoading ? <LoadingState label="Loading experiences..." /> : null}

        {isError ? (
          <ErrorState description="We could not load the experience feed right now." />
        ) : null}

        {!isLoading && !isError && data?.items?.length === 0 ? (
          <EmptyState
            title="No experiences yet"
            description="Once providers start publishing cultural experiences, they will appear here."
          />
        ) : null}

        {!isLoading && !isError && data?.items?.length ? (
          <PublicFeedList items={data.items} />
        ) : null}
      </PageContainer>
    </main>
  );
}