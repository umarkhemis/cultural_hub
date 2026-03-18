
"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import {
  useLikeExperienceMutation,
  useUnlikeExperienceMutation,
} from "./tourist-hooks";
import { shareUrl } from "@/src/utils/share";
import { useToastStore } from "@/src/store/toast-store";
import { cn } from "@/src/utils/cn";

type ExperienceActionsProps = {
  experienceId: string;
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser?: boolean;
  onCommentClick?: () => void;
  commentsOpen?: boolean;
};

export function ExperienceActions({
  experienceId,
  likesCount,
  commentsCount,
  likedByCurrentUser = false,
  onCommentClick,
  commentsOpen = false,
}: ExperienceActionsProps) {
  const { user } = useAuth();
  const { addToast } = useToastStore();

  const likeMutation = useLikeExperienceMutation(experienceId);
  const unlikeMutation = useUnlikeExperienceMutation(experienceId);

  const isTourist = user?.role === "tourist";
  const isProcessing = likeMutation.isPending || unlikeMutation.isPending;

  const handleLikeToggle = async () => {
    if (!user) {
      addToast({
        type: "error",
        title: "Login required",
        description: "Please log in as a tourist to like experiences.",
      });
      return;
    }

    if (!isTourist) {
      addToast({
        type: "error",
        title: "Not available",
        description: "Only tourists can like experiences.",
      });
      return;
    }

    try {
      if (likedByCurrentUser) {
        await unlikeMutation.mutateAsync();
        addToast({ type: "success", title: "Like removed" });
      } else {
        await likeMutation.mutateAsync();
        addToast({ type: "success", title: "Experience liked" });
      }
    } catch {
      addToast({
        type: "error",
        title: "Something went wrong",
        description: "Could not update your like. Please try again.",
      });
    }
  };

  const handleCommentClick = () => {
    if (!user) {
      addToast({
        type: "error",
        title: "Login required",
        description: "Please log in as a tourist to comment.",
      });
      return;
    }

    if (!isTourist) {
      addToast({
        type: "error",
        title: "Not available",
        description: "Only tourists can comment on experiences.",
      });
      return;
    }

    // Auth passed — scroll and focus the comment form
    onCommentClick?.();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/experiences/${experienceId}`;
    try {
      const result = await shareUrl({
        title: "Cultural Experience",
        text: "Check out this cultural experience.",
        url,
      });

      addToast({
        type: "success",
        title: result === "shared" ? "Shared successfully" : "Link copied",
        description:
          result === "shared"
            ? "The experience was shared."
            : "Paste the link anywhere to share this experience.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Could not share",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center gap-1">

      {/* Like */}
      <button
        type="button"
        onClick={handleLikeToggle}
        disabled={isProcessing}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all disabled:opacity-50",
          likedByCurrentUser
            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-transform active:scale-125",
            likedByCurrentUser && "fill-rose-500"
          )}
        />
        <span>{likesCount}</span>
      </button>

      {/* Comment */}
      <button
        type="button"
        onClick={handleCommentClick}
        // className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
        className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all",
        commentsOpen
          ? "bg-slate-100 text-slate-900"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        )}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{commentsCount}</span>
      </button>

      {/* Share */}
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

    </div>
  );
}

