


"use client";

import { useParams } from "next/navigation";

import { PageContainer } from "@/src/components/layout/page-container";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { PackageDetailActions } from "@/src/features/packages/package-detail-actions";
import { usePackageDetail } from "@/src/features/packages/hooks";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";
import { PackageBookingForm } from "@/src/features/bookings/package-booking-form";

export default function PackageDetailPage() {
  const params = useParams<{ packageId: string }>();
  const packageId = params.packageId;

  const { data, isLoading, isError } = usePackageDetail(packageId);

  if (isLoading) {
    return (
      <main className="bg-slate-50 py-8">
        <PageContainer className="max-w-4xl">
          <LoadingState label="Loading package..." />
        </PageContainer>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="bg-slate-50 py-8">
        <PageContainer className="max-w-4xl">
          <ErrorState description="We could not load this package." />
        </PageContainer>
      </main>
    );
  }

  const firstMedia = data.media_items[0];

  return (
    <main className="bg-slate-50 py-8 sm:py-10">
      <PageContainer className="max-w-4xl">
        <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          {firstMedia ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={firstMedia.media_url}
              alt={data.package_name}
              className="aspect-[16/9] w-full object-cover"
            />
          ) : (
            <div className="aspect-[16/9] w-full bg-slate-100" />
          )}

          <div className="space-y-6 p-5 sm:p-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-500">{data.provider.site_name}</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {data.package_name}
              </h1>
            </div>

            <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Price</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatCurrency(data.price)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Duration</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {data.duration || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Schedule</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {data.event_date ? formatDate(data.event_date) : "Not specified"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">About this package</h2>
              <p className="text-sm leading-7 text-slate-700 sm:text-base">
                {data.description}
              </p>
            </div>

            {data.includes_text ? (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">What is included</h2>
                <p className="text-sm leading-7 text-slate-700 sm:text-base">
                  {data.includes_text}
                </p>
              </div>
            ) : null}


            <PackageBookingForm
              packageId={data.id}
              packageName={data.package_name}
              packagePrice={data.price}
            />

            
          </div>
        </article>
      </PageContainer>
    </main>
  );
}