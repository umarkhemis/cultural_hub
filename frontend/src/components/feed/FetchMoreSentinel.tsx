
// frontend\src\components\feed\FetchMoreSentinel.tsx

"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export function FetchMoreSentinel({
  onVisible,
  isFetching,
}: {
  onVisible: () => void;
  isFetching?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div ref={ref} className="flex items-center justify-center py-8">
      {isFetching && (
        <div className="flex items-center gap-2 text-stone-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs">Loading more...</span>
        </div>
      )}
    </div>
  );
}


