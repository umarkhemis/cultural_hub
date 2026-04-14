"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX, Plus } from "lucide-react";

import type { ExperienceMedia } from "@/src/types/experience";
import { cn } from "@/src/utils/cn";
import { ImageCarouselModal } from "@/src/components/ui/ImageCarouselModal";

type Props = {
  media: ExperienceMedia[];
  isActive?: boolean;

  // global sound preference (persists across cards)
  globalMuted?: boolean;
  onToggleMute?: () => void;

  // local behavior
  allowManualPlayback?: boolean;

  // feed-controlled autoplay permission:
  // - false on first visit
  // - true after user initiates playback once
  shouldAutoplay?: boolean;

  // called when user manually starts playback (presses play)
  onUserPlay?: () => void;
};

export function ExperienceMediaGallery({
  media,
  isActive = false,
  globalMuted = true,
  onToggleMute,
  allowManualPlayback = true,
  shouldAutoplay = false,
  onUserPlay,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Video UI state (per card)
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Carousel modal state (images)
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const items = useMemo(() => {
    return [...(media ?? [])].sort((a, b) => a.media_order - b.media_order);
  }, [media]);

  const videos = items.filter((m) => m.media_type === "video");
  const images = items.filter((m) => m.media_type === "image");

  // For now: not mixed. If video exists, it's primary.
  const primaryVideo = videos[0] ?? null;

  // If no usable media at all
  if (!primaryVideo && images.length === 0) {
    return <div className="h-[340px] w-full rounded-3xl bg-slate-200" />;
  }

  // Reset video states when source changes
  useEffect(() => {
    if (!primaryVideo) return;
    setIsPausedByUser(false);
    setIsVideoLoading(true);
    setVideoError(false);
    setIsPlaying(false);
  }, [primaryVideo?.media_url]);

  // Keep video muted synced with globalMuted (also set volume)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = globalMuted;
    v.volume = globalMuted ? 0 : 1;
  }, [globalMuted]);

  // Autoplay only if:
  // - card is active
  // - feed allows autoplay (shouldAutoplay)
  // - user hasn't paused this card manually
  // - video isn't in error state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (primaryVideo && isActive && shouldAutoplay && !isPausedByUser && !videoError) {
      v.play()
        .then(() => {
          // ok
        })
        .catch(() => {
          // Autoplay can fail due to browser policy.
          // Not treated as error; user can press play.
          setIsPlaying(false);
        });
    } else {
      v.pause();
    }
  }, [primaryVideo, isActive, shouldAutoplay, isPausedByUser, videoError]);

  // If card becomes inactive, clear user pause so it can autoplay again when active later
  useEffect(() => {
    if (!isActive) setIsPausedByUser(false);
  }, [isActive]);

  // -------------------------
  // VIDEO
  // -------------------------
  if (primaryVideo) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-3xl bg-black"
        data-media-type="video"
      >
        <video
          ref={videoRef}
          src={primaryVideo.media_url}
          poster={primaryVideo.thumbnail_url ?? undefined}
          playsInline
          loop
          preload="metadata"
          controls={false}
          muted={globalMuted}
          className="w-full max-h-[75vh] object-contain bg-black"
          onLoadStart={() => {
            setIsVideoLoading(true);
            setVideoError(false);
          }}
          onWaiting={() => setIsVideoLoading(true)}
          onCanPlay={() => setIsVideoLoading(false)}
          onPlaying={() => {
            setIsVideoLoading(false);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsVideoLoading(false);
            setVideoError(true);
            setIsPlaying(false);
          }}
        />

        {/* Loading overlay */}
        {isVideoLoading && !videoError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl bg-black/55 px-4 py-2 text-xs text-white backdrop-blur-sm">
              Loading video…
            </div>
          </div>
        ) : null}

        {/* Error overlay */}
        {videoError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl bg-black/60 px-4 py-3 text-sm text-white backdrop-blur-sm">
              Video unavailable
            </div>
          </div>
        ) : null}

        {/* Overlay controls (video only) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-3 right-3 flex gap-2 pointer-events-auto">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const v = videoRef.current;
                if (!v) return;

                if (v.paused) {
                  setIsPausedByUser(false);

                  // user initiated playback -> allow feed autoplay & auto-unmute (handled in feed)
                  onUserPlay?.();

                  v.play().catch(() => {});
                } else {
                  setIsPausedByUser(true);
                  v.pause();
                }
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-2xl px-3 py-2",
                "bg-black/50 text-white backdrop-blur-sm hover:bg-black/60 transition"
              )}
              aria-label="Play/Pause video"
              disabled={!allowManualPlayback || videoError}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>

            {/* Mute/Unmute */}
            {onToggleMute ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleMute();
                }}
                className={cn(
                  "inline-flex items-center justify-center rounded-2xl px-3 py-2",
                  "bg-black/50 text-white backdrop-blur-sm hover:bg-black/60 transition"
                )}
                aria-label={globalMuted ? "Unmute video" : "Mute video"}
                disabled={videoError}
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
      </div>
    );
  }

  // -------------------------
  // IMAGES
  //   - 1 image: full cover
  //   - 2+ images: 2x2 grid of 4 + +N, opens carousel
  // -------------------------
  const carouselImages = images.map((img) => ({
    id: img.id,
    url: img.media_url,
  }));

  const closeCarousel = () => {
    setCarouselOpen(false);
    setCarouselIndex(0);
  };

  // 1 image -> full cover
  if (images.length === 1) {
    const img = images[0];

    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCarouselIndex(0);
            setCarouselOpen(true);
          }}
          className="relative w-full overflow-hidden rounded-3xl bg-slate-100"
          aria-label="Open image"
          data-media-type="image-single"
        >
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={img.media_url}
              alt="Experience image"
              fill
              sizes="(max-width: 768px) 92vw, 700px"
              className="object-cover"
              priority={isActive}
            />
          </div>
        </button>

        <ImageCarouselModal
          open={carouselOpen}
          onClose={closeCarousel}
          images={carouselImages}
          initialIndex={carouselIndex}
          title="Gallery"
        />
      </>
    );
  }

  // 2+ images -> grid of 4
  const grid = images.slice(0, 4);
  const remaining = Math.max(images.length - 4, 0);

  return (
    <>
      <div
        className="relative w-full overflow-hidden rounded-3xl bg-slate-100"
        data-media-type="image-grid"
      >
        <div className="grid grid-cols-2 grid-rows-2 gap-1">
          {grid.map((img, idx) => {
            const isLastTile = idx === 3 && remaining > 0;

            return (
              <button
                key={img.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCarouselIndex(idx);
                  setCarouselOpen(true);
                }}
                className="relative aspect-square w-full overflow-hidden bg-slate-200"
                aria-label="Open image gallery"
              >
                <Image
                  src={img.media_url}
                  alt="Experience image"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />

                {isLastTile ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white">
                    <div className="flex items-center gap-2 rounded-2xl bg-black/40 px-4 py-2 backdrop-blur-sm">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-semibold">+{remaining}</span>
                    </div>
                  </div>
                ) : null}
              </button>
            );
          })}

          {grid.length < 4
            ? Array.from({ length: 4 - grid.length }).map((_, i) => (
                <div key={`ph-${i}`} className="aspect-square w-full bg-slate-200" />
              ))
            : null}
        </div>
      </div>

      <ImageCarouselModal
        open={carouselOpen}
        onClose={closeCarousel}
        images={carouselImages}
        initialIndex={carouselIndex}
        title="Gallery"
      />
    </>
  );
}