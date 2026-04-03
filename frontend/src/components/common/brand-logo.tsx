"use client";

import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";

type Props = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
};

export function BrandLogo({
  size = "md",
  showTagline = true,
}: Props) {
  const sizes = {
    sm: {
      logo: "h-8 w-8",
      title: "text-sm",
      tagline: "text-[10px]",
    },
    md: {
      logo: "h-10 w-10",
      title: "text-base",
      tagline: "text-xs",
    },
    lg: {
      logo: "h-12 w-12",
      title: "text-lg",
      tagline: "text-sm",
    },
  };

  const s = sizes[size];

  return (
    <Link href={ROUTES.welcome} className="flex items-center gap-2">
      <img
        src="/mock/logo_cultural_hub-bg.png"
        alt="CulturalHub"
        className={`${s.logo} object-contain shrink-0`}
        style={{ imageRendering: "crisp-edges" }}
      />

      <div className="flex flex-col leading-none gap-0.5">
        <span
          className={`${s.title} font-bold tracking-wide`}
          style={{ color: "#f97316" }} // orange
        >
          CulturalHub
        </span>

        {showTagline && (
          <span
            className={`${s.tagline} font-semibold tracking-widest uppercase`}
            style={{ color: "#22c55e" }} // FIXED light green
          >
            Explore Culture
          </span>
        )}
      </div>
    </Link>
  );
}