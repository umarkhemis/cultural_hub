
"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/src/components/ui/textarea";
import { useCreateCommentMutation } from "./tourist-hooks";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";
import { cn } from "@/src/utils/cn";

type CommentFormProps = {
  experienceId: string;
};

export function CommentForm({ experienceId }: CommentFormProps) {
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const { runProtectedAction } = useProtectedAction();
  const mutation = useCreateCommentMutation(experienceId);
  const { addToast } = useToastStore();

  const handleSubmit = async () => {
    runProtectedAction(async () => {
      if (user?.role !== "tourist") return;
      if (!commentText.trim()) return;

      await mutation.mutateAsync({ comment_text: commentText.trim() });
      setCommentText("");
      addToast({
        type: "success",
        title: "Comment posted",
        description: "Your comment has been added.",
      });
    }, "Login as a tourist to comment on experiences.");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isEmpty = !commentText.trim();

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">Join the conversation</h3>

      <Textarea
        placeholder="Write your comment... (Ctrl+Enter to post)"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        className="resize-none bg-white text-sm"
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {commentText.length > 0 && `${commentText.length} characters`}
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending || isEmpty}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
            isEmpty || mutation.isPending
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-slate-900 text-white hover:bg-slate-700 active:scale-95"
          )}
        >
          <Send className="h-3.5 w-3.5" />
          {mutation.isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}


