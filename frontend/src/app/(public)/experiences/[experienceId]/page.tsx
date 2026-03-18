
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { useRef, useEffect, useState } from "react";

import { PageContainer } from "@/src/components/layout/page-container";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ExperienceActions } from "@/src/features/experiences/experience-actions";
import { ExperienceMediaGallery } from "@/src/features/experiences/experience-media";
import { useExperienceDetail } from "@/src/features/experiences/hooks";
import { formatDate } from "@/src/utils/formatDate";
import { CommentForm } from "@/src/features/experiences/comment-form";
import { CommentList } from "@/src/features/experiences/comment-list";
import { useExperienceComments } from "@/src/features/experiences/tourist-hooks";

export default function ExperienceDetailPage() {
  const params = useParams<{ experienceId: string }>();
  const experienceId = params.experienceId;
  const commentFormRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState(false);

  const { data, isLoading, isError } = useExperienceDetail(experienceId);
  const { data: comments = [], isLoading: commentsLoading } =
    useExperienceComments(experienceId, 20);

  useEffect(() => {
    if (window.location.hash === "#comments") {
      setShowComments(true);
      setTimeout(() => {
        commentFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        commentFormRef.current?.querySelector("textarea")?.focus();
      }, 500);
    }
  }, []);

  const handleCommentClick = () => {
    setShowComments((prev) => {
      const next = !prev;
      // Only scroll into view when opening
      if (next) {
        setTimeout(() => {
          commentFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          commentFormRef.current?.querySelector("textarea")?.focus();
        }, 100);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <main className="bg-slate-50 py-8">
        <PageContainer className="max-w-4xl">
          <LoadingState label="Loading experience..." />
        </PageContainer>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="bg-slate-50 py-8">
        <PageContainer className="max-w-4xl">
          <ErrorState description="We could not load this experience." />
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 py-8 sm:py-10">
      <PageContainer className="max-w-4xl">
        <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

          {/* Provider header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shrink-0">
              {data.provider.site_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/sites/${data.provider.id}`}
                className="block text-sm font-semibold text-slate-900 hover:text-amber-600 transition-colors"
              >
                {data.provider.site_name}
              </Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {data.provider.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {data.provider.location}
                  </span>
                )}
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(data.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Media */}
          <ExperienceMediaGallery media={data.media_items} />

          {/* Content */}
          <div className="px-5 py-5 sm:px-6">
            <p className="text-sm leading-7 text-slate-700 sm:text-base">
              {data.caption}
            </p>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 px-5 py-3 sm:px-6">
            <ExperienceActions
              experienceId={data.id}
              likesCount={data.likes_count}
              commentsCount={data.comments_count}
              likedByCurrentUser={data.liked_by_current_user}
              onCommentClick={handleCommentClick}
              commentsOpen={showComments} 
            />
          </div>

          {/* Comments — toggled */}
          {showComments && (
            <div
              id="comments"
              className="border-t border-slate-100 px-5 pb-6 pt-5 sm:px-6 space-y-5"
            >
              <div ref={commentFormRef} tabIndex={-1}>
                <CommentForm experienceId={data.id} />
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Comments
                  {comments.length > 0 && (
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {comments.length}
                    </span>
                  )}
                </h2>

                {commentsLoading ? (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500 animate-pulse">
                    Loading comments...
                  </div>
                ) : comments.length > 0 ? (
                  <CommentList comments={comments} />
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-sm text-slate-500">
                      No comments yet. Be the first to join the conversation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </article>
      </PageContainer>
    </main>
  );
}


