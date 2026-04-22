
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
  const [isPaused, setIsPaused] = useState(false); // manually paused by user tap
  const [showPauseHint, setShowPauseHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          // reset manual pause when scrolled away so it autoplays again on return
          setIsPaused(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isPaused]);

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
  }, [isPlaying]);

  const flashHint = () => {
    setShowPauseHint(true);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setShowPauseHint(false), 800);
  };

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

      {/* ── Mute/unmute button
            - Always visible on mobile (no hover needed on touch devices)
            - On desktop: visible on hover via group
      ── */}
      <button
        onClick={toggleMute}
        onTouchEnd={toggleMute}
        className={`
          absolute bottom-3 right-3
          flex items-center justify-center
          h-9 w-9 rounded-full
          bg-black/60 text-white backdrop-blur-sm
          transition-opacity duration-200
          /* always visible on touch, hover-only on desktop */
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100
          hover:bg-black/80
          z-10
        `}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted
          ? <VolumeX className="h-4 w-4" />
          : <Volume2 className="h-4 w-4" />
        }
      </button>

      {/* ── Tap-to-pause hint (brief flash) ── */}
      {showPauseHint && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-black/50 backdrop-blur-sm animate-ping-once">
            {isPlaying
              ? <Play className="h-6 w-6 text-white fill-white" />
              : (
                <div className="flex gap-1">
                  <span className="h-6 w-1.5 rounded-full bg-white" />
                  <span className="h-6 w-1.5 rounded-full bg-white" />
                </div>
              )
            }
          </div>
        </div>
      )}

      {/* ── Live / playing indicator ── */}
      {isPlaying && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm pointer-events-none">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-white uppercase tracking-wide">Live</span>
        </div>
      )}

      {/* ── Paused badge ── */}
      {!isPlaying && isPaused && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm pointer-events-none">
          <Play className="h-3 w-3 text-white" />
          <span className="text-[10px] font-semibold text-white uppercase tracking-wide">Paused</span>
        </div>
      )}
    </div>
  );
}

































// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Volume2, VolumeX } from "lucide-react";

// interface AutoPlayVideoProps {
//   src: string;
//   poster?: string;
//   className?: string;
// }

// /**
//  * Plays when ≥50% of the video is visible, pauses when it scrolls out.
//  * Starts muted (required by browsers). User can toggle audio.
//  */
// export function AutoPlayVideo({ src, poster, className }: AutoPlayVideoProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [muted, setMuted] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(false);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           video.play().catch(() => {});
//           setIsPlaying(true);
//         } else {
//           video.pause();
//           setIsPlaying(false);
//         }
//       },
//       { threshold: 0.5 } // 50% visible triggers play
//     );

//     observer.observe(video);
//     return () => observer.disconnect();
//   }, []);

//   const toggleMute = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const video = videoRef.current;
//     if (!video) return;
//     video.muted = !video.muted;
//     setMuted(video.muted);
//   };

//   return (
//     <div className="relative w-full h-full group">
//       <video
//         ref={videoRef}
//         src={src}
//         poster={poster}
//         muted
//         playsInline
//         loop
//         preload="metadata"
//         className={className}
//       />

//       {/* Mute/unmute button */}
//       <button
//         onClick={toggleMute}
//         className="absolute bottom-3 right-3 flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
//         aria-label={muted ? "Unmute" : "Mute"}
//       >
//         {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
//       </button>

//       {/* Playing indicator — subtle pulse dot */}
//       {isPlaying && (
//         <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
//           <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
//           <span className="text-[10px] font-semibold text-white uppercase tracking-wide">Live</span>
//         </div>
//       )}
//     </div>
//   );
// }