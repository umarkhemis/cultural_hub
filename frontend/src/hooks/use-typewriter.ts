// src\hooks\use-typewriter.ts

import { useEffect, useState } from "react";

export function useTypewriter(
  lines: string[],
  speed = 28,
  gap = 180,
  startDelay = 0
) {
  const [displayed, setDisplayed] = useState<string[]>(
    lines.map(() => "")
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setActiveIndex(0), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (activeIndex < 0 || activeIndex >= lines.length) return;
    const full = lines[activeIndex];
    const i = displayed[activeIndex].length;

    if (i >= full.length) {
      const t = setTimeout(() => {
        if (activeIndex + 1 < lines.length) setActiveIndex((p) => p + 1);
        else setDone(true);
      }, gap);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setDisplayed((prev) => {
        const next = [...prev];
        next[activeIndex] = full.slice(0, i + 1);
        return next;
      });
    }, speed);
    return () => clearTimeout(t);
  }, [activeIndex, displayed, lines, speed, gap]);

  return { displayed, activeIndex, done };
}