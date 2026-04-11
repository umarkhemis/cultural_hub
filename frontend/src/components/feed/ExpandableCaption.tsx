// frontend\src\components\feed\ExpandableCaption.tsx
"use client";

import { useState } from "react";

// Caption with expand/collapse.
// NOTE: Use dark text because cards use light backgrounds in the feed UI.
export function ExpandableCaption({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = (text?.length ?? 0) > 120;
  const preview = text?.slice(0, 120) ?? "";

  return (
    <div className="text-sm leading-6 text-slate-700">
      {!expanded && isLong ? (
        <>
          <span>{preview}</span>
          <span className="text-slate-400">… </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            className="font-semibold text-slate-900 hover:text-amber-700 transition-colors"
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
              className="ml-1 font-semibold text-slate-900 hover:text-amber-700 transition-colors"
            >
              less
            </button>
          )}
        </>
      )}
    </div>
  );
}