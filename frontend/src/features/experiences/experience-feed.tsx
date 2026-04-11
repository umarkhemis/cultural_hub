"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Experience } from "@/src/types/experience";
import { useInfinitePublicFeed } from "./tourist-hooks";

import { FeedNavbar } from "@/src/components/feed/FeedNavbar";
import { SearchOverlay } from "@/src/components/feed/SearchOverlay";
import { FetchMoreSentinel } from "@/src/components/feed/FetchMoreSentinel";

import { LeftSidebar } from "@/src/components/layout/LeftSidebar";
import { RightPanel } from "@/src/components/layout/RightPanel";

import { ExperienceCard } from "./experience-card";

export function ExperienceFeed() {
  // Active index controls which card is "in focus" (important for mobile autoplay).
  const [activeIndex, setActiveIndex] = useState(0);

  // UI states.
  const [showSplash, setShowSplash] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // One shared mute state so the whole feed behaves consistently.
  const [globalMuted, setGlobalMuted] = useState(true);

  // Mobile feed scroll container.
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent observer/scroll handlers from fighting while smooth scrolling programmatically.
  const isProgrammaticScroll = useRef(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePublicFeed();

  // Flatten paginated backend response into one list.
  const experiences: Experience[] =
    data?.pages.flatMap((page) => page.data.items ?? []).filter(Boolean) ?? [];

  /**
   * Splash screen:
   * shows briefly after first load for a polished transition.
   */
  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(timer);
  }, [isLoading]);

  /**
   * Optional UX:
   * after first item interaction, unmute automatically (you can keep muted forever if preferred).
   */
  useEffect(() => {
    if (activeIndex > 0 && globalMuted) {
      setGlobalMuted(false);
    }
  }, [activeIndex, globalMuted]);

  /**
   * Pause all videos while search overlay is open.
   * This avoids hidden playback + audio confusion.
   */
  useEffect(() => {
    if (!showSearch) return;
    document.querySelectorAll("video").forEach((v) => v.pause());
  }, [showSearch]);

  /**
   * Mobile helper: scroll to a specific feed item.
   */
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    isProgrammaticScroll.current = true;
    setActiveIndex(index);

    container.scrollTo({
      top: index * container.clientHeight,
      behavior: "smooth",
    });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 450);
  }, []);

  // Keyboard support (works nicely on desktop + testing environments).
  const goNext = useCallback(() => {
    scrollToIndex(Math.min(activeIndex + 1, experiences.length - 1));
  }, [activeIndex, experiences.length, scrollToIndex]);

  const goPrev = useCallback(() => {
    scrollToIndex(Math.max(activeIndex - 1, 0));
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  /**
   * Active card detection for mobile:
   * whichever snap item is >= 60% visible becomes active.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) {
            setActiveIndex((prev) => (prev !== index ? index : prev));
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    const children = Array.from(container.children);
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [experiences.length]);

  /**
   * Scroll fallback:
   * keeps active index accurate in browsers/devices where observer behavior is imperfect.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;
      const index = Math.round(container.scrollTop / container.clientHeight);
      setActiveIndex((prev) => (prev !== index ? index : prev));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Prefetch next page when user nears end of current loaded data.
   */
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (activeIndex >= experiences.length - 3) {
      fetchNextPage();
    }
  }, [
    activeIndex,
    experiences.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  if (isLoading || showSplash) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        CulturalHub
      </div>
    );
  }

  if (!experiences.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F4F4] text-slate-600">
        No experiences yet.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#EFE7DB]">
      {/* LEFT SIDEBAR (desktop only) */}
      <aside className="hidden lg:flex w-64 xl:w-72 border-r border-[#e5ddd1] bg-[#f7f3ed]">
        <LeftSidebar />
      </aside>

      {/* CENTER COLUMN */}
      <main className="flex-1 flex justify-center">
        {/* MOBILE FEED (full-screen snapping experience) */}
        <div className="w-full max-w-[460px] lg:hidden bg-[#f6f0e8] relative">
          <FeedNavbar onSearchOpen={() => setShowSearch(true)} />

          {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}

          <div
            ref={containerRef}
            className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar"
          >
            {experiences.map((experience, index) => (
              <section
                key={experience.id}
                data-index={index}
                className="snap-start min-h-screen px-3 py-3"
              >
                <ExperienceCard
                  experience={experience}
                  mode="mobile"
                  isActive={index === activeIndex && !showSearch}
                  globalMuted={globalMuted}
                  onToggleMute={() => setGlobalMuted((v) => !v)}
                />
              </section>
            ))}

            {hasNextPage && <FetchMoreSentinel onVisible={fetchNextPage} />}
          </div>
        </div>

        {/* DESKTOP FEED (card stream with side panels) */}
        <div className="hidden lg:block w-full max-w-3xl px-6 py-8">
          <div className="flex flex-col gap-6">
            {experiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                mode="desktop"
                // Desktop can autoplay too, but keeping false is simpler/safer for performance.
                isActive={false}
                globalMuted={true}
              />
            ))}

            {hasNextPage && <FetchMoreSentinel onVisible={fetchNextPage} />}
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR (desktop only) */}
      <aside className="hidden lg:block w-80 xl:w-96 px-4 py-8">
        <RightPanel />
      </aside>
    </div>
  );
}