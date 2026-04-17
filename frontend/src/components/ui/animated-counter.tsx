// src/components/ui/animated-counter.tsx

"use client";

import { useEffect, useState } from "react";

export function AnimatedCounter({
  value,
  duration = 1500,
  decimals = 0,
}: {
  value: number;
  duration?: number;
  decimals?: number; 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const frames = duration / 16;
    const increment = value / frames;

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}