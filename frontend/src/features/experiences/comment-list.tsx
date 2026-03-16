
import type { ExperienceComment } from "@/src/lib/api/experiences";
import { formatDate } from "@/src/utils/formatDate";

type CommentListProps = {
  comments: ExperienceComment[];
};

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">
              {comment.author.full_name}
            </p>
            <p className="text-xs text-slate-500">
              {formatDate(comment.created_at)}
            </p>
          </div>

          <p className="text-sm leading-6 text-slate-700">
            {comment.comment_text}
          </p>
        </div>
      ))}
    </div>
  );
}