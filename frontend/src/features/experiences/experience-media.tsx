"use client";

import { useEffect, useRef } from "react";
import type { ExperienceMedia } from "@/src/types/experience";

type ExperienceMediaProps = {
  media: ExperienceMedia[];
  isActive?: boolean;
  globalMuted?: boolean;
};

export function ExperienceMediaGallery({
  media,
  isActive = false,
  globalMuted = true,
}: ExperienceMediaProps) {
  const firstMedia = media?.[0];
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Keep mute state synchronized with feed-level mute setting.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = globalMuted;
  }, [globalMuted]);

  // Play only when current card is active; pause otherwise.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {
        // Some browsers block autoplay under certain conditions.
        // Failing silently here is expected behavior.
      });
    } else {
      video.pause();
    }
  }, [isActive]);

  if (!firstMedia) {
    return <div className="h-[300px] w-full rounded-3xl bg-[#ddd6e3]" />;
  }

  if (firstMedia.media_type === "video") {
    return (
      <div className="relative w-full overflow-hidden rounded-3xl bg-black">
        <video
          ref={videoRef}
          src={firstMedia.media_url}
          poster={firstMedia.thumbnail_url ?? undefined}
          playsInline
          loop
          preload="metadata"
          controls={false}
          className="w-full max-h-[75vh] object-contain bg-black"
        />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl bg-[#e8e1ee]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={firstMedia.media_url}
        alt="Cultural experience"
        loading="lazy"
        className="w-full max-h-[75vh] object-contain"
      />
    </div>
  );
}