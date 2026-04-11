
// cultural_hub\frontend\src\components\feed\ExpandableCaption.tsx

"use client";

import { useState } from "react";

const CHAR_LIMIT = 120;

export function ExpandableCaption({
  text,
  dark = false,
}: {
  text: string;
  dark?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const isLong = text.length > CHAR_LIMIT;

  const baseText = dark ? "text-white/90" : "text-stone-700";
  const mutedText = dark ? "text-white/40" : "text-stone-400";
  const btnText = dark ? "text-white/80 hover:text-white" : "text-amber-600 hover:text-amber-700";

  return (
    <div className={`text-sm leading-relaxed ${baseText}`}>
      {!expanded && isLong ? (
        <>
          <span>{text.slice(0, CHAR_LIMIT)}</span>
          <span className={mutedText}>... </span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
            className={`font-semibold transition-colors ${btnText}`}
          >
            See more
          </button>
        </>
      ) : (
        <>
          <span>{text}</span>
          {isLong && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
              className={`ml-1 font-semibold transition-colors ${btnText}`}
            >
              See less
            </button>
          )}
        </>
      )}
    </div>
  );
}