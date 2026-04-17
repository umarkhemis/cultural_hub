
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Experience } from "@/src/types/experience";
import { useInfinitePublicFeed } from "./tourist-hooks";
import { FeedLayout } from "@/src/components/feed/FeedLayout";
import { ExperienceFeedItem } from "@/src/components/feed/ExperienceFeedItem";
import { FetchMoreSentinel } from "@/src/components/feed/FetchMoreSentinel";
import { LoadingState } from "@/src/components/shared/loading-state";

export function ExperienceFeed() {
  const [showSplash, setShowSplash] = useState(true);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePublicFeed();

  const experiences: Experience[] = data?.pages
    .flatMap((page) => page.data.items ?? [])
    .filter(Boolean) ?? [];

  // Prevent the sentinel from firing fetchNextPage while a fetch is already in flight
  const handleFetchMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading || showSplash) {
    return <LoadingState />;
  }

  if (!experiences.length) return null;

  return (
    <FeedLayout>
      <div className="space-y-4">
        {experiences.map((experience) => (
          <ExperienceFeedItem
            key={experience.id}
            experience={experience}
          />
        ))}

        {/* Always render the sentinel - it shows the logo loader while fetching
            and flips to the "all caught up" end-cap when hasNextPage is false */}
        <FetchMoreSentinel
          onVisible={handleFetchMore}
          isFetching={isFetchingNextPage}
          hasMore={hasNextPage ?? false}
        />
      </div>
    </FeedLayout>
  );
}


