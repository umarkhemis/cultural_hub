
import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { PageContainer } from "@/src/components/layout/page-container";

export default function SiteProfilePlaceholderPage() {
  return (
    <main className="bg-slate-50 py-8 sm:py-10">
      <PageContainer className="max-w-4xl">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="h-40 bg-gradient-to-r from-slate-100 to-slate-50" />

          <div className="p-6 sm:p-8">
            <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-slate-200 bg-white text-xl font-semibold text-slate-700 shadow-sm">
                  CS
                </div>
                <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Cultural Site Profile
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  This screen is ready for backend connection and will display provider
                  identity, site description, location, gallery experiences, and packages.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary">Follow Site</Button>
                <Link href="/packages">
                  <Button>View Packages</Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Location</p>
                <p className="mt-2 text-sm font-medium text-slate-900">To be connected</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Contact</p>
                <p className="mt-2 text-sm font-medium text-slate-900">To be connected</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Verification</p>
                <p className="mt-2 text-sm font-medium text-slate-900">Pending backend link</p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}