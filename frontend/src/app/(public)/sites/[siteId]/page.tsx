
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Mail, Phone, Shield, Users,
  ExternalLink, Bell, BellOff, ArrowRight
} from "lucide-react";

import { PageContainer } from "@/src/components/layout/page-container";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { PackageCard } from "@/src/features/packages/package-card";
import { useSiteDetail } from "@/src/features/sites/hooks";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";
import { useAuth } from "@/src/hooks/useAuth";
import { useFollowSiteMutation, useUnfollowSiteMutation } from "@/src/features/sites/hooks";
import { useToastStore } from "@/src/store/toast-store";
import { cn } from "@/src/utils/cn";
import { ExperienceCard } from "@/src/features/experiences/experience-card";

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
    runProtectedAction(async () => {
      if (user?.role !== "tourist") return;
      if (data.following) {
        await unfollowMutation.mutateAsync();
        addToast({
          type: "success",
          title: "Unfollowed",
          description: "You will no longer receive updates from this site.",
        });
      } else {
        await followMutation.mutateAsync();
        addToast({
          type: "success",
          title: "Following!",
          description: "You are now following this cultural site.",
        });
      }
    }, "Login as a tourist to follow cultural sites.");
  };

  const isProcessing = followMutation.isPending || unfollowMutation.isPending;
  const initials = data.site_name.slice(0, 2).toUpperCase();

  return (
    <main className="bg-slate-50 pb-16">

      {/* Hero header */}
      <div className="bg-slate-900 px-4 pb-0 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between pb-6">

            {/* Left — avatar + info */}
            <div className="flex items-end gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                {data.logo_url ? (
                  <img
                    src={data.logo_url}
                    alt={data.site_name}
                    className="h-24 w-24 rounded-[24px] border-4 border-white/10 object-cover shadow-xl sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-[24px] border-4 border-white/10 bg-amber-400 text-2xl font-black text-slate-900 shadow-xl sm:h-28 sm:w-28">
                    {initials}
                  </div>
                )}
                {/* Verified badge */}
                {data.verification_status === "verified" && (
                  <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 shadow-md">
                    <Shield className="h-3.5 w-3.5 text-slate-900" />
                  </div>
                )}
              </div>

              {/* Name + meta */}
              <div className="pb-1">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {data.site_name}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {data.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {data.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {data.followers_count ?? 0} followers
                  </span>
                  {data.verification_status && (
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      data.verification_status === "verified"
                        ? "bg-amber-400/20 text-amber-400"
                        : "bg-slate-700 text-slate-400"
                    )}>
                      {data.verification_status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right — follow button */}
            <div className="flex items-center gap-3 pb-1">
              <button
                type="button"
                onClick={handleFollowToggle}
                disabled={isProcessing}
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-50",
                  data.following
                    ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : "bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-lg shadow-amber-400/20"
                )}
              >
                {data.following ? (
                  <><BellOff className="h-4 w-4" /> Following</>
                ) : (
                  <><Bell className="h-4 w-4" /> Follow Site</>
                )}
              </button>
            </div>
          </div>

          {/* Tab-style bottom border decoration */}
          <div className="h-px bg-white/10" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* About card */}
        <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            About
          </h2>
          <p className="text-sm leading-7 text-slate-700">
            {data.description || "No description available yet."}
          </p>

          {/* Contact details */}
          {(data.contact_email || data.contact_phone) && (
            <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4">
              {data.contact_email && (
                <a
                  href={`mailto:${data.contact_email}`}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-amber-600 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {data.contact_email}
                </a>
              )}
              {data.contact_phone && (
                <a
                  href={`tel:${data.contact_phone}`}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-amber-600 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {data.contact_phone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Packages section */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Packages
              {data.packages.length > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500">
                  {data.packages.length}
                </span>
              )}
            </h2>
          </div>

          {data.packages.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.packages.map((item) => (
                <PackageCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">No packages published yet.</p>
            </div>
          )}
        </section>

        {/* Experiences section */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Experiences
              {data.experiences.length > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500">
                  {data.experiences.length}
                </span>
              )}
            </h2>
          </div>

          {data.experiences.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.experiences.map((experience) => (
                <div key={experience.id} className="relative group">
                  <ExperienceCard experience={experience} />
                  {/* View detail overlay link */}
                  <Link
                    href={`/experiences/${experience.id}`}
                    className="absolute top-3 right-3 flex items-center gap-1.5 rounded-xl bg-black/40 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">No experiences published yet.</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}


