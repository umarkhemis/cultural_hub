// src/components/ui/orbital-icons.tsx

"use client";

import { ElementType } from "react";

export function OrbitalIcons({ icons }: { icons: ElementType[] }) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      
      {/* center glow */}
      <div className="absolute w-24 h-24 rounded-full bg-amber-100 blur-2xl opacity-40" />

      {icons.map((Icon, i) => {
        const angle = (i / icons.length) * 360;

        return (
          <div
            key={i}
            className="absolute animate-orbit"
            style={{
              transform: `rotate(${angle}deg) translateX(90px)`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            <div className="animate-fadeScale">
              <Icon size={24} className="text-slate-500" />
            </div>
          </div>
        );
      })}
    </div>
  );
}