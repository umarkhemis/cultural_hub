
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

interface AutoPlayVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

export function AutoPlayVideo({ src, poster, className }: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseHint, setShowPauseHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── flashHint must be declared BEFORE handleVideoTap uses it ──
  const flashHint = useCallback(() => {
    setShowPauseHint(true);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setShowPauseHint(false), 800);
  }, []);

  // ── Tap to pause / resume ──
  const handleVideoTap = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setIsPaused(true);
      flashHint();
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
      setIsPaused(false);
      flashHint();
    }
  }, [isPlaying, flashHint]);

  // ── IntersectionObserver: autoplay / pause on scroll ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isPaused) {
            video.play().catch(() => {});
            setIsPlaying(true);
          }
        } else {
          video.pause();
          setIsPlaying(false);
          setIsPaused(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isPaused]);

  // ── Cleanup timer on unmount ──
  useEffect(() => {
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  // ── Mute toggle ──
  const toggleMute = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload="metadata"
        onClick={handleVideoTap}
        className={`${className} cursor-pointer`}
      />

      {/* Mute/unmute — always visible on mobile, hover-only on desktop */}
      <button
        onClick={toggleMute}
        onTouchEnd={toggleMute}
        className="absolute bottom-3 right-3 flex items-center justify-center h-9 w-9 rounded-full bg-black/60 text-white backdrop-blur-sm transition-opacity duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-black/80 z-10"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Tap hint flash */}
      {showPauseHint && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-black/50 backdrop-blur-sm animate-ping-once">
            {isPlaying ? (
              <Play className="h-6 w-6 text-white fill-white" />
            ) : (
              <div className="flex gap-1">
                <span className="h-6 w-1.5 rounded-full bg-white" />
                <span className="h-6 w-1.5 rounded-full bg-white" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm pointer-events-none">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-white uppercase tracking-wide">Live</span>
        </div>
      )}

      {/* Paused badge */}
      {!isPlaying && isPaused && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm pointer-events-none">
          <Play className="h-3 w-3 text-white" />
          <span className="text-[10px] font-semibold text-white uppercase tracking-wide">Paused</span>
        </div>
      )}
    </div>
  );
}