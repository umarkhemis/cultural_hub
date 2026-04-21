
"use client";

import { useEffect, useRef } from "react";

/**
 * Drop-in replacement for FetchMoreSentinel.
 *
 * Props
 * ─────
 * onVisible   – called when the sentinel enters the viewport (trigger fetchNextPage)
 * isFetching  – show the logo loading animation
 * hasMore     – when false, show the "all caught up" end-cap
 */
export function FetchMoreSentinel({
  onVisible,
  isFetching,
  hasMore = true,
}: {
  onVisible: () => void;
  isFetching?: boolean;
  hasMore?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible, hasMore]);

  /* ── End of feed ─────────────────────────────────────────────────── */
  if (!hasMore) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 select-none">
        {/* Three amber dashes */}
        <div className="flex gap-1.5">
          {(["opacity-40", "opacity-60", "opacity-80"] as const).map((op, i) => (
            <span
              key={i}
              className={`h-1 w-8 rounded-full bg-amber-400 ${op}`}
            />
          ))}
        </div>
        <p className="text-[11px] font-semibold tracking-[3px] uppercase text-stone-400">
          You&apos;re all caught up
        </p>
      </div>
    );
  }

  /* ── Loading state – mirrors the full-screen LoadingState but inline ─ */
  return (
    <div ref={ref} className="flex items-center justify-center py-10">
      {isFetching && <InlineLoader />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   InlineLoader
   Mirrors the aesthetic of <LoadingState /> but compact for the feed.
   ───────────────────────────────────────────────────────────────────── */
function InlineLoader() {
  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Logo + halo rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer ping ring */}
        <span className="absolute h-20 w-20 rounded-full bg-amber-400/10 animate-ping [animation-duration:1.8s]" />
        {/* Mid pulse ring */}
        <span className="absolute h-14 w-14 rounded-full bg-amber-400/15 animate-ping [animation-duration:1.4s] [animation-delay:200ms]" />

        {/* Spinning logo – same speed as LoadingState */}
        <div
          className="relative z-10 animate-spin"
          style={{
            animationDuration: "2s",
            animationTimingFunction: "linear",
          }}
        >
          <img
            src="/mock/logo_cultural_hub-bg.png"
            alt="Loading CulturalHub"
            className="h-12 w-12 object-contain drop-shadow-sm"
          />
        </div>
      </div>

      {/* Sub-label */}
      <p className="text-[10px] font-semibold tracking-[4px] uppercase text-stone-400 animate-pulse">
        Loading more
      </p>

      {/* Sliding progress bar – identical keyframes to LoadingState */}
      <div className="relative h-0.5 w-20 overflow-hidden rounded-full bg-stone-200">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: "40%",
            background: "linear-gradient(90deg, #f97316, #14b8a6)",
            animation: "ch-loading-slide 1.6s ease-in-out infinite",
          }}
        />
      </div>

      {/* Keyframe – only injected once when this component mounts */}
      <style>{`
        @keyframes ch-loading-slide {
          0%   { transform: translateX(-250%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(350%);  opacity: 0; }
        }
      `}</style>
    </div>
  );
}




