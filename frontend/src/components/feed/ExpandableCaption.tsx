// cultural_hub\frontend\src\components\feed\ExpandableCaption.tsx

"use client";

import { useState } from "react";

// ── Caption with expand/collapse (TikTok-style) ──
export function ExpandableCaption({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = text.length > 80;

  return (
    <div className="text-sm leading-6 text-white/90">
      {!expanded && isLong ? (
        <>
          <span>{text.slice(0, 80)}</span>
          <span className="text-white/40">... </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            className="text-white/70 font-semibold hover:text-white transition-colors"
          >
            more
          </button>
        </>
      ) : (
        <>
          <span>{text}</span>
          {isLong && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
              className="ml-1 text-white/70 font-semibold hover:text-white transition-colors"
            >
              less
            </button>
          )}
        </>
      )}
    </div>
  );
}