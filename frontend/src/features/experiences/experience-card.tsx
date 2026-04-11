"use client";

import Link from "next/link";
import { MapPin, Volume2, VolumeX } from "lucide-react";
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
};

export function ExperienceCard({
  experience,
  mode = "desktop",
  isActive = false,
  globalMuted = true,
  onToggleMute,
}: ExperienceCardProps) {
  const router = useRouter();
  if (!experience) return null;

  const initials = (experience.provider?.site_name ?? "EX")
    .slice(0, 2)
    .toUpperCase();

  const isMobile = mode === "mobile";

  return (
    <article
      className={cn(
        "overflow-hidden border shadow-sm",
        // Softer cultural palette and rounded cards.
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

        {/* Media */}
        <Link href={`/experiences/${experience.id}`} className="block">
          <ExperienceMediaGallery
            media={experience.media_items}
            isActive={isActive}
            globalMuted={globalMuted}
          />
        </Link>

        {/* Controls */}
        <div className="mt-3 flex items-center justify-between">
          <ExperienceActions
            experienceId={experience.id}
            likesCount={experience.likes_count}
            commentsCount={experience.comments_count}
            likedByCurrentUser={experience.liked_by_current_user}
            onCommentClick={() => router.push(`/experiences/${experience.id}#comments`)}
          />

          {/* Mute toggle mainly useful on mobile autoplay feed */}
          {onToggleMute ? (
            <button
              type="button"
              onClick={onToggleMute}
              className="inline-flex items-center gap-1 rounded-xl px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              aria-label={globalMuted ? "Unmute videos" : "Mute videos"}
              title={globalMuted ? "Unmute videos" : "Mute videos"}
            >
              {globalMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}