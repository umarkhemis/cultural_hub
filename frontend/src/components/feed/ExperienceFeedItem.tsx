
// src/components/feed/ExperienceFeedItem.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, MapPin, Users, Bell, BellOff, Eye } from "lucide-react";

import { cn } from "@/src/utils/cn";
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";
import {
  useLikeExperienceMutation,
  useUnlikeExperienceMutation,
  useExperienceComments,
} from "@/src/features/experiences/tourist-hooks";
import { useFollowSiteMutation, useUnfollowSiteMutation } from "@/src/features/sites/hooks";
import { useTrackExperienceView } from "@/src/features/experiences/use-track-view";
import { formatDate } from "@/src/utils/formatDate";
import { shareUrl } from "@/src/utils/share";
import { ExpandableCaption } from "./ExpandableCaption";
import { CommentForm } from "@/src/features/experiences/comment-form";
import { CommentList } from "@/src/features/experiences/comment-list";
import { AutoPlayVideo } from "./AutoPlayVideo";
import type { Experience } from "@/src/types/experience";

export function ExperienceFeedItem({ experience }: { experience: Experience }) {
  const [showComments, setShowComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(experience.provider.following ?? false);
  const [isVisible, setIsVisible] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  const { user } = useAuth();
  const { addToast } = useToastStore();
  const { runProtectedAction } = useProtectedAction();
  const isTourist = user?.role === "tourist";

  const likeMutation = useLikeExperienceMutation(experience.id);
  const unlikeMutation = useUnlikeExperienceMutation(experience.id);
  const followMutation = useFollowSiteMutation(experience.provider.id);
  const unfollowMutation = useUnfollowSiteMutation(experience.provider.id);
  const { data: comments = [] } = useExperienceComments(experience.id, 20);

  // ── TikTok-style view tracking via IntersectionObserver ──
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 } // 50% of card must be visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useTrackExperienceView(experience.id, isVisible);

  const firstMedia = experience.media_items?.[0];
  const mediaSrc = firstMedia?.media_url;
  const isVideo = firstMedia?.media_type === "video";

  const handleLike = () => {
    runProtectedAction(async () => {
      if (!isTourist) {
        addToast({ type: "error", title: "Only tourists can like." });
        return;
      }
      try {
        if (experience.liked_by_current_user) await unlikeMutation.mutateAsync();
        else await likeMutation.mutateAsync();
      } catch {
        addToast({ type: "error", title: "Something went wrong" });
      }
    }, "Login as a tourist to like experiences.");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/experiences/${experience.id}`;
    try {
      const result = await shareUrl({ title: "Cultural Experience", text: "Check this out!", url });
      addToast({
        type: "success",
        title: result === "shared" ? "Shared!" : "Link copied",
      });
    } catch {
      addToast({ type: "error", title: "Could not share" });
    }
  };

  const handleFollowToggle = () => {
    runProtectedAction(async () => {
      if (!isTourist) {
        addToast({ type: "error", title: "Only tourists can follow sites." });
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
    <article
      ref={articleRef}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* ── Card header: provider info ── */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5">
        <Link
          href={`/sites/${experience.provider.id}`}
          className="flex items-center gap-2 sm:gap-2.5 min-w-0"
        >
          {experience.provider.logo_url ? (
            <img
              src={experience.provider.logo_url}
              alt={experience.provider.site_name}
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full object-cover border border-stone-100"
            />
          ) : (
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
              {experience.provider.site_name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-stone-900 leading-tight truncate">
                {experience.provider.site_name}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {experience.provider.location && (
                <p className="flex items-center gap-1 text-xs text-stone-400 truncate">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{experience.provider.location}</span>
                </p>
              )}
              {experience.provider.followers_count != null && (
                <p className="flex items-center gap-1 text-xs text-stone-400 shrink-0">
                  <Users className="h-3 w-3" />
                  {experience.provider.followers_count.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </Link>

        <button
          onClick={handleFollowToggle}
          disabled={isFollowProcessing}
          className={cn(
            "flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 disabled:opacity-50 ml-2",
            isFollowing
              ? "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
              : "bg-amber-400 text-stone-900 hover:bg-amber-300"
          )}
        >
          {isFollowing
            ? <><BellOff className="h-3 w-3" /><span className="hidden sm:inline"> Following</span></>
            : <><Bell className="h-3 w-3" /><span className="hidden sm:inline"> Follow</span></>
          }
        </button>
      </div>

      {/* ── Caption ── */}
      <div className="px-3 sm:px-4 pb-3">
        <ExpandableCaption text={experience.caption} />
        <p className="mt-1.5 text-xs text-stone-400">{formatDate(experience.created_at)}</p>
      </div>

      {/* ── Media ── */}
      {mediaSrc && (
        <div className="relative bg-stone-100 aspect-[4/3] overflow-hidden">
          {isVideo ? (
            <AutoPlayVideo
              src={mediaSrc}
              poster={firstMedia?.thumbnail_url ?? undefined}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={mediaSrc}
              alt={experience.caption}
              className="w-full h-full object-cover"
            />
          )}
          {experience.media_items?.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {experience.media_items.map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/70" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Actions row ── */}
      <div className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 sm:py-2.5 border-t border-stone-100">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1 sm:gap-1.5 rounded-xl px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all",
            experience.liked_by_current_user
              ? "text-rose-500 bg-rose-50"
              : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
          )}
        >
          <Heart className={cn("h-4 w-4 shrink-0", experience.liked_by_current_user && "fill-rose-500")} />
          <span>{experience.likes_count > 0 ? experience.likes_count : ""} Like</span>
        </button>

        <button
          onClick={() => {
            runProtectedAction(() => {
              if (!isTourist) {
                addToast({ type: "error", title: "Only tourists can comment." });
                return;
              }
              setShowComments((p) => !p);
            }, "Login as a tourist to comment.");
          }}
          className={cn(
            "flex items-center gap-1 sm:gap-1.5 rounded-xl px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all",
            showComments
              ? "text-amber-600 bg-amber-50"
              : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
          )}
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span>{experience.comments_count > 0 ? experience.comments_count : ""} Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 sm:gap-1.5 rounded-xl px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-all"
        >
          <Share2 className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* ── View count — visible to everyone ── */}
        {experience.views_count != null && experience.views_count > 0 && (
          <div className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs text-stone-400">
            <Eye className="h-3.5 w-3.5 shrink-0" />
            <span>{experience.views_count.toLocaleString()}</span>
          </div>
        )}

        <Link
          href={`/experiences/${experience.id}`}
          className="ml-auto flex items-center gap-1 sm:gap-1.5 rounded-xl px-2 sm:px-3 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 transition-all"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          Visit
        </Link>
      </div>

      {/* ── Comments section ── */}
      {showComments && (
        <div className="border-t border-stone-100 px-3 sm:px-4 py-4 space-y-4 bg-stone-50">
          <CommentForm experienceId={experience.id} />
          {comments.length > 0 ? (
            <CommentList comments={comments} />
          ) : (
            <p className="text-xs text-stone-400 text-center py-2">No comments yet.</p>
          )}
        </div>
      )}
    </article>
  );
}

