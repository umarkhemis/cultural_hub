
import { PageContainer } from "@/src/components/layout/page-container";

export default function PrivacyPage() {
  return (
    <main className="bg-slate-50 py-10">
      <PageContainer className="max-w-4xl">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Privacy Policy</h1>
          <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
            <p>
              We collect information you provide when creating an account, publishing cultural
              experiences, booking packages, and contacting providers through the platform.
            </p>
            <p>
              This may include your name, email address, phone number, booking details, provider
              profile information, uploaded media, and activity performed within the platform.
            </p>
            <p>
              We use this information to operate the service, improve discovery and booking flows,
              support providers, process transactions, maintain security, and communicate important updates.
            </p>
            <p>
              We may rely on third-party services such as hosting providers, media storage providers,
              analytics tools, and payment processors. Those services may process limited data necessary
              to support platform functionality.
            </p>
            <p>
              We take reasonable steps to protect personal information, but no online platform can
              guarantee absolute security. Users are responsible for keeping account credentials safe.
            </p>
            <p>
              You may contact the platform operator to request account updates, corrections, or deletion
              of certain data, subject to operational, legal, and booking-record requirements.
            </p>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}