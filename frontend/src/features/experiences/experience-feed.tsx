
// frontend\src\features\experiences\experience-feed.tsx

"use client";

import { useEffect, useState } from "react";
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

        {hasNextPage && (
          <FetchMoreSentinel onVisible={fetchNextPage} isFetching={isFetchingNextPage} />
        )}
      </div>
    </FeedLayout>
  );
}


























// // frontend\src\features\experiences\experience-feed.tsx

// "use client";

// import { useEffect, useState } from "react";
// import type { Experience } from "@/src/types/experience";
// import { useInfinitePublicFeed } from "./tourist-hooks";
// import { FeedLayout } from "@/src/components/feed/FeedLayout";
// import { ExperienceFeedItem } from "@/src/components/feed/ExperienceFeedItem";
// import { FetchMoreSentinel } from "@/src/components/feed/FetchMoreSentinel";

// export function ExperienceFeed() {
//   const [showSplash, setShowSplash] = useState(true);

//   const {
//     data,
//     isLoading,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfinitePublicFeed();

//   const experiences: Experience[] = data?.pages
//     .flatMap((page) => page.data.items ?? [])
//     .filter(Boolean) ?? [];

//   useEffect(() => {
//     if (isLoading) return;
//     const timer = setTimeout(() => setShowSplash(false), 1500);
//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   if (isLoading || showSplash) {
//     return (
//       <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950">
//         <div className="flex flex-col items-center gap-3 animate-pulse">
//           <img
//             src="/mock/logo_cultural_hub-bg.png"
//             alt="CulturalHub"
//             className="h-16 w-16 object-contain"
//           />
//           <span className="text-sm font-bold text-amber-500 tracking-widest uppercase">
//             CulturalHub
//           </span>
//         </div>
//       </div>
//     );
//   }

//   if (!experiences.length) return null;

//   return (
//     <FeedLayout>
//       <div className="space-y-4">
//         {experiences.map((experience) => (
//           <ExperienceFeedItem
//             key={experience.id}
//             experience={experience}
//           />
//         ))}

//         {hasNextPage && (
//           <FetchMoreSentinel onVisible={fetchNextPage} isFetching={isFetchingNextPage} />
//         )}
//       </div>
//     </FeedLayout>
//   );
// }


