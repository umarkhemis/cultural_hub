// frontend\src\components\feed\ExperienceFeedItem.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
} from "lucide-react";

import { cn } from "@/src/utils/cn";
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";

import {
  useLikeExperienceMutation,
  useUnlikeExperienceMutation,
  useExperienceComments,
} from "@/src/features/experiences/tourist-hooks";

import { formatDate } from "@/src/utils/formatDate";
import { shareUrl } from "@/src/utils/share";

import { ExpandableCaption } from "./ExpandableCaption";
import { CommentForm } from "@/src/features/experiences/comment-form";
import { CommentList } from "@/src/features/experiences/comment-list";

import type { Experience } from "@/src/types/experience";

type Props = {
  experience: Experience;
  isActive?: boolean;
  globalMuted?: boolean;
  onMuteToggle?: () => void;
};

export function ExperienceFeedItem({
  experience,
  isActive = false,
  globalMuted = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [showComments, setShowComments] = useState(false);

  const { user } = useAuth();
  const { addToast } = useToastStore();
  const { runProtectedAction } = useProtectedAction();

  const isTourist = user?.role === "tourist";

  const likeMutation = useLikeExperienceMutation(experience.id);
  const unlikeMutation = useUnlikeExperienceMutation(experience.id);

  const { data: comments = [] } = useExperienceComments(
    experience.id,
    20
  );

  const firstMedia = experience.media_items?.[0];
  const isVideo = firstMedia?.media_type === "video";
  const mediaSrc = firstMedia?.media_url;

  // ✅ AUTO PLAY FIX (VERY IMPORTANT)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive, isVideo]);

  // Like
  const handleLike = () => {
    runProtectedAction(async () => {
      try {
        if (experience.liked_by_current_user) {
          await unlikeMutation.mutateAsync();
        } else {
          await likeMutation.mutateAsync();
        }
      } catch {
        addToast({ type: "error", title: "Error liking post" });
      }
    });
  };

  // Share
  const handleShare = async () => {
    const url = `${window.location.origin}/experiences/${experience.id}`;
    await shareUrl({ title: "Experience", url });
  };

  return (
    <div className="w-full max-w-[720px] mx-auto bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* ───────── PROVIDER INFO ───────── */}
      <div className="flex items-center gap-3 p-4">
        {experience.provider.logo_url ? (
          <img
            src={experience.provider.logo_url}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center font-bold text-white">
            {experience.provider.site_name.slice(0, 2)}
          </div>
        )}

        <div>
          <p className="font-semibold text-sm">
            {experience.provider.site_name}
          </p>

          {experience.provider.location && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {experience.provider.location}
            </div>
          )}
        </div>
      </div>

      {/* ───────── DESCRIPTION ───────── */}
      <div className="px-4 pb-2">
        <ExpandableCaption text={experience.caption} />
      </div>

      {/* ───────── MEDIA ───────── */}
      <div className="bg-black">
        {isVideo && mediaSrc ? (
          <video
            ref={videoRef}
            src={mediaSrc}
            className="w-full max-h-[70vh] object-contain"
            loop
            muted
            playsInline
          />
        ) : mediaSrc ? (
          <img
            src={mediaSrc}
            className="w-full max-h-[70vh] object-contain"
          />
        ) : null}
      </div>

      {/* ───────── ACTIONS ───────── */}
      <div className="flex items-center justify-between px-4 py-3">

        <div className="flex items-center gap-6">

          {/* LIKE */}
          <button onClick={handleLike} className="flex items-center gap-1">
            <Heart
              className={cn(
                "w-5 h-5",
                experience.liked_by_current_user
                  ? "text-red-500 fill-red-500"
                  : "text-gray-700"
              )}
            />
            <span className="text-sm">
              {experience.likes_count}
            </span>
          </button>

          {/* COMMENT */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1"
          >
            <MessageCircle className="w-5 h-5 text-gray-700" />
            <span className="text-sm">
              {experience.comments_count}
            </span>
          </button>

          {/* SHARE */}
          <button onClick={handleShare}>
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>

        </div>

        <span className="text-xs text-gray-400">
          {formatDate(experience.created_at)}
        </span>
      </div>

      {/* ───────── COMMENTS ───────── */}
      {showComments && (
        <div className="border-t p-4">
          <CommentForm experienceId={experience.id} />

          {comments.length > 0 ? (
            <CommentList comments={comments} />
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              No comments yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}