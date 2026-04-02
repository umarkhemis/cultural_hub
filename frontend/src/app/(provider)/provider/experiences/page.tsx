
"use client";

import Link from "next/link";
import { Plus, VideoIcon, LayoutGrid } from "lucide-react";

import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ROUTES } from "@/src/constants/routes";
import { useProviderExperiences } from "@/src/features/provider/hooks";
import { ProviderExperienceCard } from "@/src/features/provider/provider-experience-card";

export default function ProviderExperiencesPage() {
  const { data, isLoading, isError } = useProviderExperiences();

  const totalExperiences = data?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 mb-4">
            <VideoIcon className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-semibold text-blue-700">Discovery Feed</span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your Experiences
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-lg">
                Manage the experiences you publish to the public discovery feed.
              </p>
            </div>

            <Link href={ROUTES.providerNewExperience}>
              <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-all shrink-0">
                <Plus className="h-4 w-4" />
                Create Experience
              </button>
            </Link>
          </div>

          {/* Count pill */}
          {!isLoading && !isError && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 shadow-sm">
              <LayoutGrid className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">
                {totalExperiences} {totalExperiences === 1 ? "experience" : "experiences"} published
              </span>
            </div>
          )}
        </div>

        {/* ── States ── */}
        {isLoading && <LoadingState label="Loading experiences..." />}
        {isError && (
          <ErrorState description="We could not load your experiences right now." />
        )}

        {!isLoading && !isError && totalExperiences === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <VideoIcon className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No experiences yet</h3>
            <p className="mt-1.5 text-sm text-slate-400 max-w-xs mx-auto">
              Create your first experience to start appearing in the public discovery feed.
            </p>
            <Link href={ROUTES.providerNewExperience}>
              <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all">
                <Plus className="h-4 w-4" />
                Create your first experience
              </button>
            </Link>
          </div>
        )}

        {/* ── Grid ── */}
        {/* {!isLoading && !isError && totalExperiences > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {data!.map((item) => (
              <ProviderExperienceCard key={item.id} item={item}/>
            ))}
          </div>
        )} */}

        {!isLoading && !isError && totalExperiences > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {data!.map((item) => (
              <ProviderExperienceCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}


