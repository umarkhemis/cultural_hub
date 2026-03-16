
"use client";

import { useParams } from "next/navigation";

import { PageContainer } from "@/src/components/layout/page-container";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { PublicFeedList } from "@/src/features/experiences/public-feed-list";
import { PackageCard } from "@/src/features/packages/package-card";
import { useSiteDetail } from "@/src/features/sites/hooks";
import { Button } from "@/src/components/ui/button";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";
import { useAuth } from "@/src/hooks/useAuth";
import { useFollowSiteMutation, useUnfollowSiteMutation } from "@/src/features/sites/hooks";
import { useToastStore } from "@/src/store/toast-store";

export default function SiteDetailPage() {
  const params = useParams<{ siteId: string }>();
  const siteId = params.siteId;


  const { user } = useAuth();
  const { runProtectedAction } = useProtectedAction();
  const { addToast } = useToastStore();
  const followMutation = useFollowSiteMutation(siteId);
  const unfollowMutation = useUnfollowSiteMutation(siteId);


  const { data, isLoading, isError } = useSiteDetail(siteId);

  if (isLoading) {
    return (
      <main className="bg-slate-50 py-8">
        <PageContainer className="max-w-5xl">
          <LoadingState label="Loading cultural site..." />
        </PageContainer>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="bg-slate-50 py-8">
        <PageContainer className="max-w-5xl">
          <ErrorState description="We could not load this cultural site." />
        </PageContainer>
      </main>
    );
  }


  const handleFollowToggle = () => {
    runProtectedAction(
      async () => {
        if (user?.role !== "tourist") return;

        if (data.following) {
          await unfollowMutation.mutateAsync();
          addToast({
            type: "success",
            title: "Site unfollowed",
            description: "You will no longer receive updates from this site.",
          });
        } else {
          await followMutation.mutateAsync();
          addToast({
            type: "success",
            title: "Site followed",
            description: "You are now following this cultural site.",
          });
        }
      },
      "Login as a tourist to follow cultural sites."
    );
  };





  return (
    <main className="bg-slate-50 py-8 sm:py-10">
      <PageContainer className="max-w-5xl">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-100 text-xl font-semibold text-slate-700">
              {data.site_name.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {data.site_name}
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                {data.description || "No description available yet."}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>{data.location || "Location not set"}</span>
                <span>{data.verification_status}</span>
                {data.contact_email ? <span>{data.contact_email}</span> : null}
                {data.contact_phone ? <span>{data.contact_phone}</span> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant={data.following ? "secondary" : "primary"}
            onClick={handleFollowToggle}
            disabled={followMutation.isPending || unfollowMutation.isPending}
          >
            {data.following ? "Following" : "Follow Site"}
          </Button>
        </div>

        <span>{data.followers_count ?? 0} followers</span>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Packages</h2>
          {data.packages.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.packages.map((item) => (
                <PackageCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No packages yet"
              description="This cultural site has not published any packages yet."
            />
          )}
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Experiences</h2>
          {data.experiences.length ? (
            <PublicFeedList items={data.experiences} />
          ) : (
            <EmptyState
              title="No experiences yet"
              description="This cultural site has not published any public experiences yet."
            />
          )}
        </section>
      </PageContainer>
    </main>
  );
}





























