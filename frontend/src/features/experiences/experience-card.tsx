"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import { ExperienceActions } from "./experience-actions";
import { ExperienceMediaGallery } from "./experience-media";
import { ExpandableCaption } from "@/src/components/feed/ExpandableCaption";

import type { Experience } from "@/src/types/experience";
import { formatDate } from "@/src/utils/formatDate";
import { cn } from "@/src/utils/cn";

type ExperienceCardProps = {
  experience: Experience;
  mode?: "mobile" | "desktop";
  isActive?: boolean;

  globalMuted?: boolean;
  onToggleMute?: () => void;

  // Feed-controlled:
  // - false on first visit
  // - true after user presses play once
  shouldAutoplay?: boolean;

  // Called when user presses play on any video in this card
  onUserPlay?: () => void;
};

export function ExperienceCard({
  experience,
  mode = "desktop",
  isActive = false,
  globalMuted = true,
  onToggleMute,
  shouldAutoplay = false,
  onUserPlay,
}: ExperienceCardProps) {
  const router = useRouter();
  if (!experience) return null;

  const initials = (experience.provider?.site_name ?? "EX")
    .slice(0, 2)
    .toUpperCase();

  const isMobile = mode === "mobile";

  const hasVideo =
    experience.media_items?.some((m) => m.media_type === "video") ?? false;

  return (
    <article
      className={cn(
        "overflow-hidden border shadow-sm",
        "bg-[#f5f0f8] border-[#d9d0df]",
        isMobile ? "rounded-3xl" : "rounded-[28px]"
      )}
    >
      <div className={cn(isMobile ? "p-4" : "p-5")}>
        {/* Header: provider identity */}
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d8c6f2] text-sm font-semibold text-[#5b3e85]">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <Link
              href={`/sites/${experience.provider.id}`}
              className="block truncate text-[17px] font-semibold text-[#1f1f1f] hover:underline"
            >
              {experience.provider.site_name}
            </Link>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#665f6d]">
              {experience.provider.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {experience.provider.location}
                </span>
              ) : null}
              <span>•</span>
              <span>{formatDate(experience.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="mb-3">
          <ExpandableCaption text={experience.caption} />
        </div>

        {/* Media (NOT wrapped in a Link; keeps controls + image buttons behaving correctly) */}
        <div
          className="block"
          onClick={(e) => {
            // Desktop: clicking media opens the detail page.
            // Avoid hijacking clicks meant for buttons (carousel tiles / modal buttons / video controls).
            if (mode !== "desktop") return;

            const target = e.target as HTMLElement;
            if (target.closest("button")) return;

            router.push(`/experiences/${experience.id}`);
          }}
          onDoubleClick={(e) => {
            // Optional: keep double click as well
            e.preventDefault();
            if (mode !== "desktop") return;
            router.push(`/experiences/${experience.id}`);
          }}
        >
          <ExperienceMediaGallery
            media={experience.media_items}
            isActive={isActive}
            globalMuted={globalMuted}
            onToggleMute={hasVideo ? onToggleMute : undefined}
            shouldAutoplay={shouldAutoplay}
            onUserPlay={hasVideo ? onUserPlay : undefined}
          />
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center justify-between">
          <ExperienceActions
            experienceId={experience.id}
            likesCount={experience.likes_count}
            commentsCount={experience.comments_count}
            likedByCurrentUser={experience.liked_by_current_user}
            onCommentClick={() =>
              router.push(`/experiences/${experience.id}#comments`)
            }
          />

          {/* Desktop-only "View" button */}
          {mode === "desktop" ? (
            <button
              type="button"
              onClick={() => router.push(`/experiences/${experience.id}`)}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              View
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </article>
  );
}