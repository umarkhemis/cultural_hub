
"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { useCreateCommentMutation } from "./tourist-hooks";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";
import { useAuth } from "@/src/hooks/useAuth";

type CommentFormProps = {
  experienceId: string;
};

export function CommentForm({ experienceId }: CommentFormProps) {
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const { runProtectedAction } = useProtectedAction();
  const mutation = useCreateCommentMutation(experienceId);

  const handleSubmit = async () => {
    runProtectedAction(
      async () => {
        if (user?.role !== "tourist") return;
        if (!commentText.trim()) return;

        await mutation.mutateAsync({
          comment_text: commentText.trim(),
        });

        setCommentText("");
      },
      "Login as a tourist to comment on experiences."
    );
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">Join the conversation</h3>

      <Textarea
        placeholder="Write your comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </div>
  );
}