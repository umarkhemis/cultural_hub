
"use client";

import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ROUTES } from "@/src/constants/routes";
import { PublicFeedList } from "@/src/features/experiences/public-feed-list";
import { useProviderExperiences } from "@/src/features/provider/hooks";

export default function ProviderExperiencesPage() {
  const { data, isLoading, isError } = useProviderExperiences();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Experiences
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage the experiences you publish to the public discovery feed.
          </p>
        </div>

        <Link href={ROUTES.providerNewExperience}>
          <Button>Create Experience</Button>
        </Link>
      </div>

      {isLoading ? <LoadingState label="Loading experiences..." /> : null}
      {isError ? (
        <ErrorState description="We could not load your experiences right now." />
      ) : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <EmptyState
          title="No experiences yet"
          description="Create your first experience to start appearing in public discovery."
        />
      ) : null}

      {!isLoading && !isError && data?.length ? (
        <PublicFeedList items={data} />
      ) : null}
    </div>
  );
}