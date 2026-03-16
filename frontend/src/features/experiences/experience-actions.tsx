
"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";
import { useAuth } from "@/src/hooks/useAuth";
import {
  useLikeExperienceMutation,
  useUnlikeExperienceMutation,
} from "./tourist-hooks";

type ExperienceActionsProps = {
  experienceId: string;
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser?: boolean;
  onCommentClick?: () => void;
};

export function ExperienceActions({
  experienceId,
  likesCount,
  commentsCount,
  likedByCurrentUser = false,
  onCommentClick,
}: ExperienceActionsProps) {
  const { user } = useAuth();
  const { runProtectedAction } = useProtectedAction();

  const likeMutation = useLikeExperienceMutation(experienceId);
  const unlikeMutation = useUnlikeExperienceMutation(experienceId);

  const isTourist = user?.role === "tourist";
  const isProcessing = likeMutation.isPending || unlikeMutation.isPending;

  const handleLikeToggle = () => {
    runProtectedAction(
      async () => {
        if (!isTourist) return;

        if (likedByCurrentUser) {
          await unlikeMutation.mutateAsync();
        } else {
          await likeMutation.mutateAsync();
        }
      },
      "Login as a tourist to like experiences."
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={likedByCurrentUser ? "secondary" : "ghost"}
        className="gap-2"
        onClick={handleLikeToggle}
        disabled={isProcessing}
      >
        <Heart className="h-4 w-4" />
        <span>{likesCount}</span>
      </Button>

      <Button
        variant="ghost"
        className="gap-2"
        onClick={() =>
          runProtectedAction(
            onCommentClick,
            "Login as a tourist to comment on experiences."
          )
        }
      >
        <MessageCircle className="h-4 w-4" />
        <span>{commentsCount}</span>
      </Button>

      <Button
        variant="ghost"
        className="gap-2"
        onClick={() =>
          runProtectedAction(undefined, "Login to share and engage with experiences.")
        }
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>
    </div>
  );
}