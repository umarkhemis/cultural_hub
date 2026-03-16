
import Link from "next/link";
import { MapPin } from "lucide-react";

import { ExperienceActions } from "./experience-actions";
import { ExperienceMediaGallery } from "./experience-media";
import type { Experience } from "@/src/types/experience";
import { formatDate } from "@/src/utils/formatDate";

type ExperienceCardProps = {
  experience: Experience;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
            {experience.provider.site_name.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <Link
              href={`/sites/${experience.provider.id}`}
              className="block truncate text-sm font-semibold text-slate-900 hover:underline"
            >
              {experience.provider.site_name}
            </Link>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {experience.provider.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {experience.provider.location}
                </span>
              ) : null}
              <span>•</span>
              <span>{formatDate(experience.created_at)}</span>
            </div>
          </div>
        </div>

        <Link href={`/experiences/${experience.id}`} className="block">
          <ExperienceMediaGallery media={experience.media_items} />
        </Link>

        <div className="mt-4 space-y-3">
          <p className="text-sm leading-6 text-slate-700">{experience.caption}</p>

          <ExperienceActions
                experienceId={experience.id}
                likesCount={experience.likes_count}
                commentsCount={experience.comments_count}
                likedByCurrentUser={experience.liked_by_current_user}
            />
        </div>
      </div>
    </article>
  );
}