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
  // Used mainly for mobile navigation helpers (snap scrolling / keyboard testing).
  const [activeIndex, setActiveIndex] = useState(0);

  // Unified: the ONE experience considered active for playback purposes.
  const [activeExperienceId, setActiveExperienceId] = useState<string | null>(null);

  // UI states.
  const [showSplash, setShowSplash] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // Global audio preference. Default muted until user initiates playback.
  const [globalMuted, setGlobalMuted] = useState(true);

  // Autoplay permission: false on first load, becomes true once user presses play once.
  const [hasUserStartedPlayback, setHasUserStartedPlayback] = useState(false);

  // Mobile feed scroll container.
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop scroll container.
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  // Desktop list ref.
  const desktopListRef = useRef<HTMLDivElement>(null);

  // Prevent observer/scroll handlers from fighting while smooth scrolling programmatically.
  const isProgrammaticScroll = useRef(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePublicFeed();

  const experiences: Experience[] =
    data?.pages.flatMap((page) => page.data.items ?? []).filter(Boolean) ?? [];

  /**
   * Pause all videos except the one in the active card.
   * Guarantees no sound collisions.
   */
  const pauseAllExcept = useCallback((id?: string | null) => {
    const all = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));

    if (!id) {
      all.forEach((v) => v.pause());
      return;
    }

    const activeWrapper = document.querySelector<HTMLElement>(
      `[data-experience-id="${id}"]`
    );
    const activeVideo =
      activeWrapper?.querySelector<HTMLVideoElement>("video") ?? null;

    all.forEach((v) => {
      if (activeVideo && v === activeVideo) return;
      v.pause();
    });
  }, []);

  /**
   * Splash screen.
   */
  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(timer);
  }, [isLoading]);

  /**
   * Pause all videos while search overlay is open.
   */
  useEffect(() => {
    if (!showSearch) return;
    document.querySelectorAll("video").forEach((v) => v.pause());
  }, [showSearch]);

  /**
   * When activeExperienceId changes, enforce only-one-playing.
   */
  useEffect(() => {
    if (showSearch) return;
    pauseAllExcept(activeExperienceId);
  }, [activeExperienceId, pauseAllExcept, showSearch]);

  /**
   * CRITICAL: Enforce pausing during scroll too.
   * IntersectionObserver can lag, so without this a manually played video can keep playing off-screen.
   */
  useEffect(() => {
    if (showSearch) return;

    const mobileRoot = containerRef.current;
    const desktopRoot = desktopScrollRef.current;

    const handler = () => pauseAllExcept(activeExperienceId);

    mobileRoot?.addEventListener("scroll", handler, { passive: true });
    desktopRoot?.addEventListener("scroll", handler, { passive: true });

    return () => {
      mobileRoot?.removeEventListener("scroll", handler);
      desktopRoot?.removeEventListener("scroll", handler);
    };
  }, [activeExperienceId, pauseAllExcept, showSearch]);

  /**
   * Optional: set an initial active id once data arrives (helps consistent enforcement).
   */
  useEffect(() => {
    if (!experiences.length) return;
    setActiveExperienceId((prev) => prev ?? experiences[0].id);
  }, [experiences]);

  /**
   * Mobile helper: scroll to index (keyboard support/testing).
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
   * Prefetch next page when user nears end (mobile).
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

  const THRESHOLDS = [0, 0.1, 0.2, 0.3, 0.35, 0.5, 0.75, 1];
  const MIN_RATIO = 0.35;

  /**
   * Most-visible-wins observer (Mobile).
   * Root = mobile scroll container.
   */
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.experienceId;
          if (!id) continue;

          if (!entry.isIntersecting) ratios.delete(id);
          else ratios.set(id, entry.intersectionRatio);
        }

        let bestId: string | null = null;
        let bestRatio = 0;

        for (const [id, ratio] of ratios.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        // Keep previous unless nothing is intersecting (prevents flicker to null)
        setActiveExperienceId((prev) => {
          if (bestRatio >= MIN_RATIO) return bestId;
          if (ratios.size === 0) return null;
          return prev;
        });
      },
      { root, threshold: THRESHOLDS }
    );

    const els = Array.from(
      root.querySelectorAll<HTMLElement>("[data-experience-id]")
    );
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [experiences.length]);

  /**
   * Most-visible-wins observer (Desktop).
   * Root = desktop scroll container.
   */
  useEffect(() => {
    const rootEl = desktopListRef.current;
    const scrollRoot = desktopScrollRef.current;
    if (!rootEl || !scrollRoot) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.experienceId;
          if (!id) continue;

          if (!entry.isIntersecting) ratios.delete(id);
          else ratios.set(id, entry.intersectionRatio);
        }

        let bestId: string | null = null;
        let bestRatio = 0;

        for (const [id, ratio] of ratios.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        setActiveExperienceId((prev) => {
          if (bestRatio >= MIN_RATIO) return bestId;
          if (ratios.size === 0) return null; // truly nothing visible
          return prev; // keep current to avoid flicker
        });
      },
      {
        root: scrollRoot,
        threshold: THRESHOLDS,
      }
    );

    const els = Array.from(
      rootEl.querySelectorAll<HTMLElement>("[data-experience-id]")
    );
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [experiences.length]);

  /**
   * Handler called when user presses Play on any video.
   * - enables autoplay for subsequent active videos
   * - turns sound on
   */
  const handleUserPlay = useCallback(() => {
    setHasUserStartedPlayback(true);
    setGlobalMuted(false);
  }, []);

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
        No experiences yet
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
        {/* MOBILE FEED */}
        <div className="w-full max-w-[460px] lg:hidden bg-[#f6f0e8] relative">
          <FeedNavbar onSearchOpen={() => setShowSearch(true)} />
          {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}

          <div
            ref={containerRef}
            className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar"
          >
            {experiences.map((experience, index) => {
              const isActive = experience.id === activeExperienceId && !showSearch;
              const shouldAutoplay = hasUserStartedPlayback && isActive;

              return (
                <section
                  key={experience.id}
                  data-index={index}
                  data-experience-id={experience.id}
                  className="snap-start min-h-screen px-3 py-3"
                >
                  <ExperienceCard
                    experience={experience}
                    mode="mobile"
                    isActive={isActive}
                    globalMuted={globalMuted}
                    onToggleMute={() => setGlobalMuted((v) => !v)}
                    shouldAutoplay={shouldAutoplay}
                    onUserPlay={handleUserPlay}
                  />
                </section>
              );
            })}

            {hasNextPage ? (
              <FetchMoreSentinel
                onVisible={fetchNextPage}
                enabled={hasNextPage && !isFetchingNextPage}
              />
            ) : null}
          </div>
        </div>

        {/* DESKTOP FEED */}
        <div className="hidden lg:block w-full max-w-3xl">
          <div ref={desktopScrollRef} className="h-screen overflow-y-auto px-6 py-8">
            <div ref={desktopListRef} className="flex flex-col gap-6">
              {experiences.map((experience) => {
                const isActive = experience.id === activeExperienceId && !showSearch;
                const shouldAutoplay = hasUserStartedPlayback && isActive;

                return (
                  <div key={experience.id} data-experience-id={experience.id}>
                    <ExperienceCard
                      experience={experience}
                      mode="desktop"
                      isActive={isActive}
                      globalMuted={globalMuted}
                      onToggleMute={() => setGlobalMuted((v) => !v)}
                      shouldAutoplay={shouldAutoplay}
                      onUserPlay={handleUserPlay}
                    />
                  </div>
                );
              })}

              {hasNextPage ? (
                <FetchMoreSentinel
                  onVisible={fetchNextPage}
                  enabled={hasNextPage && !isFetchingNextPage}
                />
              ) : null}
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR (desktop only) */}
      <aside className="hidden lg:block w-80 xl:w-96 border-l border-[#e5ddd1] bg-[#f7f3ed]">
        <div className="h-screen overflow-y-auto px-4 py-8">
          <RightPanel />
        </div>
      </aside>
    </div>
  );
}