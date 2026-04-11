
// cultural_hub\frontend\src\components\feed\ExperienceFeedItem.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Users,
  Bell,
  BellOff,
  MapPin,
} from "lucide-react";

import { cn } from "@/src/utils/cn";

// hooks / stores
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";

// api hooks
import {
  useLikeExperienceMutation,
  useUnlikeExperienceMutation,
  useExperienceComments,
} from "@/src/features/experiences/tourist-hooks";

import { useFollowSiteMutation, useUnfollowSiteMutation } from "@/src/features/sites/hooks";

// utils
import { formatDate } from "@/src/utils/formatDate";
import { shareUrl } from "@/src/utils/share";

// components
import { ExpandableCaption } from "./ExpandableCaption";
import { CommentForm } from "@/src/features/experiences/comment-form";
import { CommentList } from "@/src/features/experiences/comment-list";

// types
import type { Experience } from "@/src/types/experience";

// ── Feed Item ─────────────────────────────────
type ExperienceFeedItemProps = {
  experience: Experience;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  globalMuted: boolean;
  onMuteToggle: () => void;
};

export function ExperienceFeedItem({
  experience,
  isActive,
  onNext,
  onPrev,
  isFirst,
  isLast,
  globalMuted,
  onMuteToggle,
}: ExperienceFeedItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);

  const { user } = useAuth();
  const { addToast } = useToastStore();
  const { runProtectedAction } = useProtectedAction();
  const isTourist = user?.role === "tourist";

  const likeMutation = useLikeExperienceMutation(experience.id);
  const unlikeMutation = useUnlikeExperienceMutation(experience.id);
  const [isFollowing, setIsFollowing] = useState(experience.provider.following ?? false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFollowing(experience.provider.following ?? false);
  }, [experience.provider.following]);

  const followMutation = useFollowSiteMutation(experience.provider.id);
  const unfollowMutation = useUnfollowSiteMutation(experience.provider.id);

  const { data: comments = [] } = useExperienceComments(experience.id, 20);

  const firstMedia = experience.media_items?.[0];
  const isVideo = firstMedia?.media_type === "video";
  const mediaSrc = firstMedia?.media_url;

  // Drive play/pause purely from isActive
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    if (isActive) {
      document.querySelectorAll("video").forEach((v) => {
        if (v !== video) {
          v.pause();
          v.currentTime = 0;
        }
      });

      const t = setTimeout(() => {
        video.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }, 80);
      return () => clearTimeout(t);
    } else {
      video.pause();
      video.currentTime = 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
    }
  }, [isActive, isVideo]);

  // Sync mute state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = globalMuted;
  }, [globalMuted]);

  // Progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    const update = () => setProgress((video.currentTime / video.duration) * 100 || 0);
    video.addEventListener("timeupdate", update);
    return () => video.removeEventListener("timeupdate", update);
  }, [isVideo]);

  // Close comments when scrolled away
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isActive) setShowComments(false);
  }, [isActive]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setIsPlaying(true); }
    else { video.pause(); setIsPlaying(false); }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    runProtectedAction(async () => {
      if (!isTourist) {
        addToast({ type: "error", title: "Not available", description: "Only tourists can like." });
        return;
      }
      try {
        if (experience.liked_by_current_user) {
          await unlikeMutation.mutateAsync();
        } else {
          await likeMutation.mutateAsync();
        }
      } catch {
        addToast({ type: "error", title: "Something went wrong" });
      }
    }, "Login as a tourist to like experiences.");
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    runProtectedAction(() => {
      if (!isTourist) {
        addToast({ type: "error", title: "Not available", description: "Only tourists can comment." });
        return;
      }
      setShowComments((prev) => !prev);
    }, "Login as a tourist to comment on experiences.");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/experiences/${experience.id}`;
    try {
      const result = await shareUrl({ title: "Cultural Experience", text: "Check this out!", url });
      addToast({
        type: "success",
        title: result === "shared" ? "Shared!" : "Link copied",
        description: result === "shared" ? "Experience shared." : "Link copied to clipboard.",
      });
    } catch {
      addToast({ type: "error", title: "Could not share" });
    }
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    runProtectedAction(async () => {
      if (!isTourist) {
        addToast({ type: "error", title: "Not available", description: "Only tourists can follow sites." });
        return;
      }
      const wasFollowing = isFollowing;
      setIsFollowing(!wasFollowing);
      try {
        if (wasFollowing) {
          await unfollowMutation.mutateAsync();
          addToast({ type: "success", title: "Unfollowed" });
        } else {
          await followMutation.mutateAsync();
          addToast({ type: "success", title: "Following!" });
        }
      } catch {
        setIsFollowing(wasFollowing);
        addToast({ type: "error", title: "Something went wrong" });
      }
    }, "Login as a tourist to follow cultural sites.");
  };

  const isFollowProcessing = followMutation.isPending || unfollowMutation.isPending;

  return (
    <div className="relative h-[92vh] w-full max-w-[520px] mx-auto snap-start snap-always overflow-hidden rounded-2xl bg-black">

      {/* Media */}
      {isVideo && mediaSrc ? (
        <video
          ref={videoRef}
          src={mediaSrc}
          poster={firstMedia?.thumbnail_url ?? undefined}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted={globalMuted}
          playsInline
          onClick={togglePlay}
        />
      ) : mediaSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaSrc}
          alt={experience.caption}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900" />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/50 pointer-events-none" />

      {/* Video progress bar */}
      {isVideo && (
        <div className="absolute top-0 left-0 right-0 z-20 h-0.5 bg-white/10">
          <div
            className="h-full bg-amber-400 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Play/pause indicator */}
      {isVideo && !isPlaying && isActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Play className="h-8 w-8 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* Provider info bar */}
      <div className="absolute top-14 left-0 right-0 z-20 flex items-center justify-between px-4 gap-3">
        <Link
          href={`/sites/${experience.provider.id}`}
          className="flex items-center gap-2.5 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          {experience.provider.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={experience.provider.logo_url}
              alt={experience.provider.site_name}
              className="h-10 w-10 shrink-0 rounded-2xl object-cover border border-white/20"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm text-xs font-bold text-white border border-white/20">
              {experience.provider.site_name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">
              {experience.provider.site_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {experience.provider.location && (
                <p className="flex items-center gap-1 text-xs text-white/60 truncate">
                  <MapPin className="h-2.5 w-2.5 shrink-0" />
                  {experience.provider.location}
                </p>
              )}
              {experience.provider.followers_count != null && (
                <p className="flex items-center gap-1 text-xs text-white/60 shrink-0">
                  <Users className="h-2.5 w-2.5" />
                  {experience.provider.followers_count.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          {isVideo && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMuteToggle(); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
            >
              {globalMuted
                ? <VolumeX className="h-4 w-4" />
                : <Volume2 className="h-4 w-4" />
              }
            </button>
          )}

          <button
            type="button"
            onClick={handleFollowToggle}
            disabled={isFollowProcessing}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-50",
              isFollowing
                ? "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                : "bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-lg shadow-amber-400/25"
            )}
          >
            {isFollowing
              ? <><BellOff className="h-3 w-3" /> Following</>
              : <><Bell className="h-3 w-3" /> Follow</>
            }
          </button>
        </div>
      </div>

      {/* Right sidebar actions */}
      <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-6">

        <button type="button" onClick={handleLike} className="flex flex-col items-center gap-1.5">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
            experience.liked_by_current_user
              ? "bg-rose-500 scale-110 shadow-lg shadow-rose-500/40"
              : "bg-black/30 backdrop-blur-sm hover:bg-black/50"
          )}>
            <Heart className={cn(
              "h-6 w-6 transition-all",
              experience.liked_by_current_user ? "fill-white text-white" : "text-white"
            )} />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">{experience.likes_count}</span>
        </button>

        <button type="button" onClick={handleComment} className="flex flex-col items-center gap-1.5">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
            showComments
              ? "bg-amber-500 shadow-lg shadow-amber-500/40"
              : "bg-black/30 backdrop-blur-sm hover:bg-black/50"
          )}>
            <MessageCircle className={cn(
              "h-6 w-6 transition-all",
              showComments ? "fill-white text-white" : "text-white"
            )} />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">{experience.comments_count}</span>
        </button>

        <button type="button" onClick={handleShare} className="flex flex-col items-center gap-1.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">Share</span>
        </button>
      </div>

      {/* Up/Down arrows — left side */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {!isFirst && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Bottom info: date + caption */}
      <div className="absolute bottom-24 left-4 right-4 z-20">
        <p className="mb-1.5 text-xs text-white/40">{formatDate(experience.created_at)}</p>
        <ExpandableCaption text={experience.caption} />
        {experience.media_items?.length > 1 && (
          <div className="mt-2.5 flex gap-1">
            {experience.media_items.map((_, i) => (
              <span key={i} className="h-1 w-4 rounded-full bg-white/30" />
            ))}
          </div>
        )}
      </div>

      {/* Visit CTA */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <Link
          href={`/experiences/${experience.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition-all"
        >
          <MapPin className="h-4 w-4" />
          Visit this place
        </Link>
      </div>

      {/* Comments drawer */}
      {showComments && (
        <div
          className="absolute inset-x-0 bottom-0 z-30 rounded-t-[28px] bg-white"
          style={{ maxHeight: "65vh", overflowY: "auto" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-10 rounded-full bg-slate-300" />
          </div>
          <div className="px-4 pb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Comments
                {comments.length > 0 && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {comments.length}
                  </span>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setShowComments(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <CommentForm experienceId={experience.id} />
            {comments.length > 0 ? (
              <CommentList comments={comments} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">No comments yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}





































// // cultural_hub\frontend\src\components\feed\ExperienceFeedItem.tsx

// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";

// import {
//   Heart,
//   MessageCircle,
//   Share2,
//   Play,
//   ChevronUp,
//   ChevronDown,
//   Volume2,
//   VolumeX,
//   Users,
//   Bell,
//   BellOff,
//   MapPin,
// } from "lucide-react";

// import { cn } from "@/src/utils/cn";

// // hooks / stores
// import { useAuth } from "@/src/hooks/useAuth";
// import { useToastStore } from "@/src/store/toast-store";
// import { useProtectedAction } from "@/src/features/auth/useProtectedAction";

// // api hooks
// import {
//   useLikeExperienceMutation,
//   useUnlikeExperienceMutation,
//   useExperienceComments,
//   } from "@/src/features/experiences/tourist-hooks";

// import { useFollowSiteMutation, useUnfollowSiteMutation } from "@/src/features/sites/hooks";


// // utils
// import { formatDate } from "@/src/utils/formatDate";
// import { shareUrl } from "@/src/utils/share";

// // components
// import { ExpandableCaption } from "./ExpandableCaption";
// import { CommentForm } from "@/src/features/experiences/comment-form";
// import { CommentList } from "@/src/features/experiences/comment-list";

// // types
// import type { Experience } from "@/src/types/experience";

// // ── Feed Item ─────────────────────────────────
// type ExperienceFeedItemProps = {
//   experience: Experience;
//   isActive: boolean;
//   onNext: () => void;
//   onPrev: () => void;
//   isFirst: boolean;
//   isLast: boolean;
//   globalMuted: boolean;
//   onMuteToggle: () => void;
// };

// export function ExperienceFeedItem({
//   experience,
//   isActive,
//   onNext,
//   onPrev,
//   isFirst,
//   isLast,
//   globalMuted,
//   onMuteToggle,
// }: ExperienceFeedItemProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const { user } = useAuth();
//   const { addToast } = useToastStore();
//   const { runProtectedAction } = useProtectedAction();
//   const isTourist = user?.role === "tourist";

//   const likeMutation = useLikeExperienceMutation(experience.id);
//   const unlikeMutation = useUnlikeExperienceMutation(experience.id);
//   const [isFollowing, setIsFollowing] = useState(experience.provider.following ?? false);

//   useEffect(() => {
//     setIsFollowing(experience.provider.following ?? false);
//   }, [experience.provider.following]);

//   const followMutation = useFollowSiteMutation(experience.provider.id);
//   const unfollowMutation = useUnfollowSiteMutation(experience.provider.id);

//   const { data: comments = [] } = useExperienceComments(experience.id, 20);

//   const firstMedia = experience.media_items?.[0];
//   const isVideo = firstMedia?.media_type === "video";
//   const mediaSrc = firstMedia?.media_url;

//   // ── Core fix: drive play/pause purely from isActive ──
//   // This handles both arrow-button navigation AND free scroll/swipe.
//   // When isActive flips to false (any cause), we immediately pause + reset.
//   // When isActive flips to true, we play after a short settle delay.
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !isVideo) return;

//     if (isActive) {
//       // Pause ALL other videos first
//       document.querySelectorAll("video").forEach((v) => {
//         if (v !== video) {
//           v.pause();
//           v.currentTime = 0;
//           }
//       });

//       const t = setTimeout(() => {
//         video.play()
//           .then(() => setIsPlaying(true))
//           .catch(() => setIsPlaying(false));
//       }, 80);
//       return () => clearTimeout(t);
//     } else {
//       // Immediate stop — no delay, no matter how the scroll happened
//       video.pause();
//       video.currentTime = 0;
//       setIsPlaying(false);
//     }
//   }, [isActive, isVideo]);

//   // Sync mute state
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;
//     video.muted = globalMuted;
//   }, [globalMuted]);

//   // Progress bar
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !isVideo) return;
//     const update = () => setProgress((video.currentTime / video.duration) * 100 || 0);
//     video.addEventListener("timeupdate", update);
//     return () => video.removeEventListener("timeupdate", update);
//   }, [isVideo]);

//   // Close comments when scrolled away
//   useEffect(() => {
//     if (!isActive) setShowComments(false);
//   }, [isActive]);

//   const togglePlay = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const video = videoRef.current;
//     if (!video) return;
//     if (video.paused) { video.play(); setIsPlaying(true); }
//     else { video.pause(); setIsPlaying(false); }
//   };

//   const handleLike = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     runProtectedAction(async () => {
//       if (!isTourist) {
//         addToast({ type: "error", title: "Not available", description: "Only tourists can like." });
//         return;
//       }
//       try {
//         if (experience.liked_by_current_user) {
//           await unlikeMutation.mutateAsync();
//         } else {
//           await likeMutation.mutateAsync();
//         }
//       } catch {
//         addToast({ type: "error", title: "Something went wrong" });
//       }
//     }, "Login as a tourist to like experiences.");
//   };

//   const handleComment = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     runProtectedAction(() => {
//       if (!isTourist) {
//         addToast({ type: "error", title: "Not available", description: "Only tourists can comment." });
//         return;
//       }
//       setShowComments((prev) => !prev);
//     }, "Login as a tourist to comment on experiences.");
//   };

//   const handleShare = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const url = `${window.location.origin}/experiences/${experience.id}`;
//     try {
//       const result = await shareUrl({ title: "Cultural Experience", text: "Check this out!", url });
//       addToast({
//         type: "success",
//         title: result === "shared" ? "Shared!" : "Link copied",
//         description: result === "shared" ? "Experience shared." : "Link copied to clipboard.",
//       });
//     } catch {
//       addToast({ type: "error", title: "Could not share" });
//     }
//   };

//   const handleFollowToggle = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     runProtectedAction(async () => {
//       if (!isTourist) {
//         addToast({ type: "error", title: "Not available", description: "Only tourists can follow sites." });
//         return;
//       }
//       const wasFollowing = isFollowing;
//       setIsFollowing(!wasFollowing);
//       try {
//         if (wasFollowing) {
//           await unfollowMutation.mutateAsync();
//           addToast({ type: "success", title: "Unfollowed" });
//         } else {
//           await followMutation.mutateAsync();
//           addToast({ type: "success", title: "Following!" });
//         }
//       } catch {
//         setIsFollowing(wasFollowing);
//         addToast({ type: "error", title: "Something went wrong" });
//       }
//     }, "Login as a tourist to follow cultural sites.");
//   };

//   const isFollowProcessing = followMutation.isPending || unfollowMutation.isPending;

//   return (
//     <div className="relative h-[92vh] w-full max-w-[520px] mx-auto snap-start snap-always overflow-hidden rounded-2xl bg-black">

//       {/* Media */}
//       {isVideo && mediaSrc ? (
//         <video
//           ref={videoRef}
//           src={mediaSrc}
//           poster={firstMedia?.thumbnail_url ?? undefined}
//           className="absolute inset-0 h-full w-full object-cover"
//           loop
//           muted={globalMuted}
//           playsInline
//           onClick={togglePlay}
//         />
//       ) : mediaSrc ? (
//         <img
//           src={mediaSrc}
//           alt={experience.caption}
//           className="absolute inset-0 h-full w-full object-cover"
//         />
//       ) : (
//         <div className="absolute inset-0 bg-slate-900" />
//       )}

//       {/* Gradients */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/50 pointer-events-none" />

//       {/* Video progress bar */}
//       {isVideo && (
//         <div className="absolute top-0 left-0 right-0 z-20 h-0.5 bg-white/10">
//           <div
//             className="h-full bg-amber-400 transition-all duration-100"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       )}

//       {/* Play/pause indicator */}
//       {isVideo && !isPlaying && isActive && (
//         <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
//           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
//             <Play className="h-8 w-8 fill-white text-white ml-1" />
//           </div>
//         </div>
//       )}

//       {/* Provider info bar */}
//       <div className="absolute top-14 left-0 right-0 z-20 flex items-center justify-between px-4 gap-3">
//         <Link
//           href={`/sites/${experience.provider.id}`}
//           className="flex items-center gap-2.5 min-w-0"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {experience.provider.logo_url ? (
//             <img
//               src={experience.provider.logo_url}
//               alt={experience.provider.site_name}
//               className="h-10 w-10 shrink-0 rounded-2xl object-cover border border-white/20"
//             />
//           ) : (
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm text-xs font-bold text-white border border-white/20">
//               {experience.provider.site_name.slice(0, 2).toUpperCase()}
//             </div>
//           )}
//           <div className="min-w-0">
//             <p className="text-sm font-semibold text-white leading-tight truncate">
//               {experience.provider.site_name}
//             </p>
//             <div className="flex items-center gap-2 mt-0.5">
//               {experience.provider.location && (
//                 <p className="flex items-center gap-1 text-xs text-white/60 truncate">
//                   <MapPin className="h-2.5 w-2.5 shrink-0" />
//                   {experience.provider.location}
//                 </p>
//               )}
//               {experience.provider.followers_count != null && (
//                 <p className="flex items-center gap-1 text-xs text-white/60 shrink-0">
//                   <Users className="h-2.5 w-2.5" />
//                   {experience.provider.followers_count.toLocaleString()}
//                 </p>
//               )}
//             </div>
//           </div>
//         </Link>

//         <div className="flex items-center gap-2 shrink-0">
//           {isVideo && (
//             <button
//               type="button"
//               onClick={(e) => { e.stopPropagation(); onMuteToggle(); }}
//               className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
//             >
//               {globalMuted
//                 ? <VolumeX className="h-4 w-4" />
//                 : <Volume2 className="h-4 w-4" />
//               }
//             </button>
//           )}

//           <button
//             type="button"
//             onClick={handleFollowToggle}
//             disabled={isFollowProcessing}
//             className={cn(
//               "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-50",
//               isFollowing
//                 ? "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
//                 : "bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-lg shadow-amber-400/25"
//             )}
//           >
//             {isFollowing
//               ? <><BellOff className="h-3 w-3" /> Following</>
//               : <><Bell className="h-3 w-3" /> Follow</>
//             }
//           </button>
//         </div>
//       </div>

//       {/* Right sidebar actions */}
//       <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-6">

//         <button type="button" onClick={handleLike} className="flex flex-col items-center gap-1.5">
//           <div className={cn(
//             "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
//             experience.liked_by_current_user
//               ? "bg-rose-500 scale-110 shadow-lg shadow-rose-500/40"
//               : "bg-black/30 backdrop-blur-sm hover:bg-black/50"
//           )}>
//             <Heart className={cn(
//               "h-6 w-6 transition-all",
//               experience.liked_by_current_user ? "fill-white text-white" : "text-white"
//             )} />
//           </div>
//           <span className="text-xs font-bold text-white drop-shadow-md">{experience.likes_count}</span>
//         </button>

//         <button type="button" onClick={handleComment} className="flex flex-col items-center gap-1.5">
//           <div className={cn(
//             "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
//             showComments
//               ? "bg-amber-500 shadow-lg shadow-amber-500/40"
//               : "bg-black/30 backdrop-blur-sm hover:bg-black/50"
//           )}>
//             <MessageCircle className={cn(
//               "h-6 w-6 transition-all",
//               showComments ? "fill-white text-white" : "text-white"
//             )} />
//           </div>
//           <span className="text-xs font-bold text-white drop-shadow-md">{experience.comments_count}</span>
//         </button>

//         <button type="button" onClick={handleShare} className="flex flex-col items-center gap-1.5">
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all">
//             <Share2 className="h-6 w-6 text-white" />
//           </div>
//           <span className="text-xs font-bold text-white drop-shadow-md">Share</span>
//         </button>
            
//             {/* view icon */}
//         {/* <Link
//           href={`/experiences/${experience.id}`}
//           onClick={(e) => e.stopPropagation()}
//           className="flex flex-col items-center gap-1.5"
//         >
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 transition-all">
//             <span className="text-base text-white">→</span>
//           </div>
//           <span className="text-xs font-bold text-white drop-shadow-md">View</span>
//         </Link> */}
//       </div>

//       {/* Up/Down arrows — left side */}
//       <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
//         {!isFirst && (
//           <button
//             type="button"
//             onClick={(e) => { e.stopPropagation(); onPrev(); }}
//             className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
//           >
//             <ChevronUp className="h-5 w-5" />
//           </button>
//         )}
//         {!isLast && (
//           <button
//             type="button"
//             onClick={(e) => { e.stopPropagation(); onNext(); }}
//             className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
//           >
//             <ChevronDown className="h-5 w-5" />
//           </button>
//         )}
//       </div>

//       {/* ── Bottom info: date + caption, aligned with "View" button ── */}
//       {/* bottom-32 matches the top of the right sidebar so they sit on the same line */}
//       {/* text issues */}
//       <div className="absolute bottom-24 left-4 right-4 z-20">
//         <p className="mb-1.5 text-xs text-white/40">{formatDate(experience.created_at)}</p>
//         <ExpandableCaption text={experience.caption} />
//         {experience.media_items?.length > 1 && (
//           <div className="mt-2.5 flex gap-1">
//             {experience.media_items.map((_, i) => (
//               <span key={i} className="h-1 w-4 rounded-full bg-white/30" />
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
//         <Link
//           href={`/experiences/${experience.id}`}
//           onClick={(e) => e.stopPropagation()}
//           className="flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition-all"
//         >
//           <MapPin className="h-4 w-4" />
//           Visit this place
//         </Link>
//       </div>

//       {/* Comments drawer */}
//       {showComments && (
//         <div
//           className="absolute inset-x-0 bottom-0 z-30 rounded-t-[28px] bg-white"
//           style={{ maxHeight: "65vh", overflowY: "auto" }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="flex justify-center pt-3 pb-2">
//             <div className="h-1 w-10 rounded-full bg-slate-300" />
//           </div>
//           <div className="px-4 pb-6 space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-sm font-semibold text-slate-900">
//                 Comments
//                 {comments.length > 0 && (
//                   <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
//                     {comments.length}
//                   </span>
//                 )}
//               </h3>
//               <button
//                 type="button"
//                 onClick={() => setShowComments(false)}
//                 className="text-xs text-slate-500 hover:text-slate-700"
//               >
//                 Close
//               </button>
//             </div>
//             <CommentForm experienceId={experience.id} />
//             {comments.length > 0 ? (
//               <CommentList comments={comments} />
//             ) : (
//               <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
//                 <p className="text-sm text-slate-500">No comments yet.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }