
import { PageContainer } from "@/src/components/layout/page-container";

export default function TermsPage() {
  return (
    <main className="bg-slate-50 py-10">
      <PageContainer className="max-w-4xl">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Terms of Service</h1>
          <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
            <p>
              By using this platform, you agree to use it lawfully and respectfully, whether you are
              browsing as a visitor, booking as a tourist, or publishing content as a provider.
            </p>
            <p>
              Providers are responsible for the accuracy of their site information, experiences,
              packages, pricing, media, and booking-related details published through the platform.
            </p>
            <p>
              The platform may remove, restrict, or moderate content that is misleading, abusive,
              unlawful, unsafe, or inconsistent with the intended purpose of the service.
            </p>
            <p>
              Booking and payment flows may involve third-party providers. While the platform aims to
              offer reliable service, it does not guarantee uninterrupted access, third-party uptime,
              or error-free transactions at all times.
            </p>
            <p>
              Users must not misuse the platform, interfere with normal operation, attempt unauthorized
              access, or submit fraudulent bookings, false provider details, or harmful content.
            </p>
            <p>
              These terms may be updated as the platform evolves. Continued use of the service after
              updates may be treated as acceptance of the revised terms.
            </p>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}