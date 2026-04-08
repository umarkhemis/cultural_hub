// frontend\src\features\experiences\experience-feed.tsx

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Experience } from "@/src/types/experience";
import {
  useInfinitePublicFeed,
} from "./tourist-hooks";

//new imports
import { FeedNavbar } from "@/src/components/feed/FeedNavbar";
import { SearchOverlay } from "@/src/components/feed/SearchOverlay";
import { ExperienceFeedItem } from "@/src/components/feed/ExperienceFeedItem";
import { FetchMoreSentinel } from "@/src/components/feed/FetchMoreSentinel";


// ── Main Feed ─────────────────────────────────
export function ExperienceFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [globalMuted, setGlobalMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

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

  // Splash
  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Auto-unmute after first scroll
  useEffect(() => {
    if (activeIndex > 0 && globalMuted) {
      setGlobalMuted(false);
    }
  }, [activeIndex]);

  // Pause ALL videos when search opens
  useEffect(() => {
    if (showSearch) {
      document.querySelectorAll("video").forEach((v) => {
        v.pause();
      });
    }
  }, [showSearch]);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    isProgrammaticScroll.current = true;
    setActiveIndex(index);
    container.scrollTo({ top: index * container.clientHeight, behavior: "smooth" });
    setTimeout(() => { isProgrammaticScroll.current = false; }, 450);
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

  // ── Core fix: use a high threshold (0.8) so activeIndex only updates
  // when a slide is almost fully in view. This ensures the outgoing slide's
  // isActive flips to false quickly, triggering its pause effect immediately.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target as HTMLElement);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: container, threshold: 0.6 } // reduced from 0.8 → 0.6
    );

  
    const observeChildren = () => {
      Array.from(container.children).forEach((child) => observer.observe(child));
    };
    observeChildren();

    const mutation = new MutationObserver(observeChildren);
    mutation.observe(container, { childList: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  //scroll fix
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      const index = Math.round(container.scrollTop / container.clientHeight);

      setActiveIndex((prev) => (prev !== index ? index : prev));
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);
  

  // Pre-fetch next page
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (activeIndex >= experiences.length - 3) {
      fetchNextPage();
    }
  }, [activeIndex, experiences.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          
          <img
            src="/mock/logo_cultural_hub-bg.png"
            alt="CulturalHub"
            className="h-25 w-25 object-contain shrink-0 mt-0.4"
            style={{ imageRendering: "crisp-edges" }}
          />         
            <div className="flex flex-col mb-0.9">
              <span
                className="text-sm font-bold  "
                style={{ color: "#f97316" }}  
              >
                CulturalHub
              </span>
              
            </div>
          
        </div>
      </div>
    );
  }

  if (!experiences.length) return null;

  return (
    // positioned the feed, Feed container
    <div className="flex justify-center bg-black">
      <div className="relative h-screen w-full max-w-[420px] overflow-hidden">
        <FeedNavbar onSearchOpen={() => setShowSearch(true)} />

        {showSearch && (
          <SearchOverlay onClose={() => setShowSearch(false)} />
        )}

        <div
          ref={containerRef}
          // Smooth scrolling feel
          className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {experiences.map((experience, index) => (
            <ExperienceFeedItem
              key={experience.id}
              experience={experience}
              isActive={index === activeIndex && !showSplash && !showSearch}
              onNext={goNext}
              onPrev={goPrev}
              isFirst={index === 0}
              isLast={index === experiences.length - 1 && !hasNextPage}
              globalMuted={globalMuted}
              onMuteToggle={() => setGlobalMuted((v) => !v)}
            />
          ))}

          {hasNextPage && (
            <FetchMoreSentinel onVisible={fetchNextPage} />
          )}
        </div>
      </div>
    </div>
  );
}