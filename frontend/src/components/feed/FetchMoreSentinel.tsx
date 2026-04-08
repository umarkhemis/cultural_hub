"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

// ── Fetch-more sentinel ───────────────────────
export function FetchMoreSentinel({
  onVisible,
}: {
  onVisible: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      ref={ref}
      className="h-screen w-full snap-start snap-always bg-black flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
        <p className="text-xs text-white/30 uppercase tracking-widest">
          Loading more
        </p>
      </div>
    </div>
  );
}