
"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AutoPlayVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

/**
 * Plays when ≥50% of the video is visible, pauses when it scrolls out.
 * Starts muted (required by browsers). User can toggle audio.
 */
export function AutoPlayVideo({ src, poster, className }: AutoPlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 } // 50% visible triggers play
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="relative w-full h-full group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload="metadata"
        className={className}
      />

      {/* Mute/unmute button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Playing indicator — subtle pulse dot */}
      {isPlaying && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-white uppercase tracking-wide">Live</span>
        </div>
      )}
    </div>
  );
}