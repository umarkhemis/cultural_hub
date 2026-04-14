"use client";

import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { cn } from "@/src/utils/cn";

type Props = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;

  // NEW:
  href?: string;
  logoShape?: "square" | "rounded" | "circle";
  className?: string;
};

export function BrandLogo({
  size = "md",
  showTagline = true,
  href = ROUTES.welcome,
  logoShape = "square",
  className,
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

  const shapeClass =
    logoShape === "circle"
      ? "rounded-full"
      : logoShape === "rounded"
        ? "rounded-2xl"
        : "";

  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <img
        src="/mock/logo_cultural_hub-bg.png"
        alt="CulturalHub"
        className={cn(
          s.logo,
          "object-contain shrink-0",
          shapeClass
        )}
        style={{ imageRendering: "crisp-edges" }}
      />

      <div className="flex flex-col leading-none gap-0.5">
        <span
          className={cn(s.title, "font-bold tracking-wide")}
          style={{ color: "#f97316" }} // orange
        >
          CulturalHub
        </span>

        {showTagline && (
          <span
            className={cn(
              s.tagline,
              "font-semibold tracking-widest uppercase"
            )}
            style={{ color: "#22c55e" }} // light green
          >
            Explore Culture
          </span>
        )}
      </div>
    </Link>
  );
}

