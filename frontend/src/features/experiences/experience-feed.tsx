
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Heart, MessageCircle, Share2, MapPin,
  VolumeX, Volume2, Play, ChevronUp, ChevronDown,
  Bell, BellOff, Users, Loader2,
} from "lucide-react";
import { cn } from "@/src/utils/cn";
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";
import { shareUrl } from "@/src/utils/share";
import { formatDate } from "@/src/utils/formatDate";
import type { Experience } from "@/src/types/experience";
import {
  useLikeExperienceMutation,
  useUnlikeExperienceMutation,
  useExperienceComments,
  useInfinitePublicFeed,
} from "./tourist-hooks";
import { useFollowSiteMutation, useUnfollowSiteMutation } from "@/src/features/sites/hooks";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";
import { LoadingState } from "@/src/components/shared/loading-state";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";

// ── Feed Item ─────────────────────────────────
type ExperienceFeedItemProps = {
  experience: Experience;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
};

function ExperienceFeedItem({
  experience,
  isActive,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: ExperienceFeedItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
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

  // Sync if provider data changes (e.g. after query invalidation)
  useEffect(() => {
    setIsFollowing(experience.provider.following ?? false);
  }, [experience.provider.following]);

  const followMutation = useFollowSiteMutation(experience.provider.id);
  const unfollowMutation = useUnfollowSiteMutation(experience.provider.id);

  const { data: comments = [] } = useExperienceComments(experience.id, 20);

  const firstMedia = experience.media_items?.[0];
  const isVideo = firstMedia?.media_type === "video";
  const mediaSrc = firstMedia?.media_url;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    if (isActive) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive, isVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    const update = () => setProgress((video.currentTime / video.duration) * 100 || 0);
    video.addEventListener("timeupdate", update);
    return () => video.removeEventListener("timeupdate", update);
  }, [isVideo]);

  useEffect(() => {
    if (!isActive) setShowComments(false);
  }, [isActive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setIsPlaying(true); }
    else { video.pause(); setIsPlaying(false); }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
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
      // Optimistic update — flip instantly
      const wasFollowing = isFollowing;
      setIsFollowing(!wasFollowing);
      try {
        if (wasFollowing) {
          await unfollowMutation.mutateAsync();
          addToast({ type: "success", title: "Unfollowed", description: "You will no longer receive updates from this site." });
        } else {
          await followMutation.mutateAsync();
          addToast({ type: "success", title: "Following!", description: "You are now following this cultural site." });
        }
      } catch {
        // Revert on failure
        setIsFollowing(wasFollowing);
        addToast({ type: "error", title: "Something went wrong" });
      }
    }, "Login as a tourist to follow cultural sites.");
  };

  const isFollowProcessing = followMutation.isPending || unfollowMutation.isPending;

  return (
    <div className="relative h-screen w-full snap-start snap-always overflow-hidden bg-black">

      {/* Media */}
      {isVideo && mediaSrc ? (
        <video
          ref={videoRef}
          src={mediaSrc}
          poster={firstMedia?.thumbnail_url ?? undefined}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
        />
      ) : mediaSrc ? (
        <img
          src={mediaSrc}
          alt={experience.caption}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900" />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

      {/* Video progress bar */}
      {isVideo && (
        <div className="absolute top-0 left-0 right-0 z-20 h-0.5 bg-white/20">
          <div className="h-full bg-amber-400 transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Top bar */}
      <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 gap-3">
        <Link
          href={`/sites/${experience.provider.id}`}
          className="flex items-center gap-2.5 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          {experience.provider.logo_url ? (
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
          <span className="text-xs text-white/50 hidden sm:block">{formatDate(experience.created_at)}</span>

          {isVideo && (
            <button
              type="button"
              onClick={toggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
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
            {isFollowing ? (
              <><BellOff className="h-3 w-3" /> Following</>
            ) : (
              <><Bell className="h-3 w-3" /> Follow</>
            )}
          </button>
        </div>
      </div>

      {/* Play indicator */}
      {isVideo && !isPlaying && isActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Play className="h-8 w-8 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* Right sidebar actions */}
      <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-6">
        <button type="button" onClick={handleLike} className="flex flex-col items-center gap-1.5">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200",
            experience.liked_by_current_user
              ? "bg-rose-500 scale-110 shadow-lg shadow-rose-500/40"
              : "bg-black/30 backdrop-blur-sm hover:bg-black/50"
          )}>
            <Heart className={cn(
              "h-6 w-6 transition-all",
              experience.liked_by_current_user ? "fill-white text-white scale-110" : "text-white"
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

        <Link
          href={`/experiences/${experience.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/50 transition-all">
            <span className="text-base text-white">→</span>
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">View</span>
        </Link>
      </div>

      {/* Up/Down arrows */}
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

      {/* Bottom caption */}
      <div className="absolute bottom-0 left-0 right-16 z-20 px-4 pb-5">
        <p className="text-sm leading-6 text-white/90 line-clamp-3">{experience.caption}</p>
        {experience.media_items?.length > 1 && (
          <div className="mt-2 flex gap-1">
            {experience.media_items.map((_, i) => (
              <span key={i} className="h-1 w-4 rounded-full bg-white/40" />
            ))}
          </div>
        )}
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
              <button type="button" onClick={() => setShowComments(false)} className="text-xs text-slate-500 hover:text-slate-700">
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

// ── Fetch-more sentinel ────────────────────────
// Invisible full-screen slide that triggers the next page load
// when the user scrolls close to the end of the list.
function FetchMoreSentinel({ onVisible }: { onVisible: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div
      ref={ref}
      className="h-screen w-full snap-start snap-always bg-black flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
        <p className="text-xs text-white/30 uppercase tracking-widest">Loading more</p>
      </div>
    </div>
  );
}

// ── Main Feed ─────────────────────────────────
export function ExperienceFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  // Guard: prevents the IntersectionObserver from overwriting activeIndex
  // while a programmatic scroll (arrow/keyboard) is in progress.
  const isProgrammaticScroll = useRef(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePublicFeed();

  const experiences: Experience[] = data?.pages.flatMap((page) => page.data.items ?? []).filter(Boolean) ?? [];

  // Keep splash up until data is ready + 1.8s minimum
  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // ── Programmatic navigation (arrows + keyboard) ──────────────
  // Scrolls the container directly; guards against observer feedback loop.
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    isProgrammaticScroll.current = true;
    setActiveIndex(index);
    container.scrollTo({ top: index * container.clientHeight, behavior: "smooth" });
    // Release guard after scroll animation (~400ms)
    setTimeout(() => { isProgrammaticScroll.current = false; }, 450);
  }, []);

  const goNext = useCallback(() => {
    const next = Math.min(activeIndex + 1, experiences.length - 1);
    scrollToIndex(next);
  }, [activeIndex, experiences.length, scrollToIndex]);

  const goPrev = useCallback(() => {
    const next = Math.max(activeIndex - 1, 0);
    scrollToIndex(next);
  }, [activeIndex, scrollToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // ── Native scroll sync (user swipes/scrolls manually) ────────
  // Uses a stable IntersectionObserver on the container element;
  // only re-registers when the container mounts, not on every data change.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target as HTMLElement);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    // Observe all current + future children via a MutationObserver
    const observeChildren = () => {
      Array.from(container.children).forEach((child) => observer.observe(child));
    };
    observeChildren();

    const mutation = new MutationObserver(observeChildren);
    mutation.observe(container, { childList: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []); // ← intentionally empty: container never changes after mount

  // ── Pre-fetch: load next page 3 slides before the end ────────
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (activeIndex >= experiences.length - 3) {
      fetchNextPage();
    }
  }, [activeIndex, experiences.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || showSplash) {
    return <LoadingState />;
  }

  if (!experiences.length) return null;

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {experiences.map((experience, index) => (
        <ExperienceFeedItem
          key={experience.id}
          experience={experience}
          isActive={index === activeIndex}
          onNext={goNext}
          onPrev={goPrev}
          isFirst={index === 0}
          isLast={index === experiences.length - 1 && !hasNextPage}
        />
      ))}

      {hasNextPage && (
        <FetchMoreSentinel onVisible={fetchNextPage} />
      )}
    </div>
  );
}

