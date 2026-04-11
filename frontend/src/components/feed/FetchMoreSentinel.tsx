// cultural_hub\frontend\src\components\feed\FetchMoreSentinel.tsx

"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  onVisible: () => void;
  enabled?: boolean; // prevents repeated calls when already fetching / no next page
};

export function FetchMoreSentinel({ onVisible, enabled = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset trigger when enabled becomes true again (e.g., after fetch completes).
    if (enabled) hasTriggeredRef.current = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!enabled) return;
        if (!entry.isIntersecting) return;

        // Prevent spamming fetchNextPage while sentinel remains visible.
        if (hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;

        onVisible();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible, enabled]);

  return (
    <div ref={ref} className="w-full py-10 flex items-center justify-center">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
        <p className="text-xs text-slate-600">Loading more…</p>
      </div>
    </div>
  );
}