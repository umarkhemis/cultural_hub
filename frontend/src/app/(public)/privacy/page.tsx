
import { PageContainer } from "@/src/components/layout/page-container";
import {
  Lock,
  Database,
  Share2,
  UserCheck,
  Cookie,
  Globe,
  ShieldAlert,
  Mail,
} from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: [
      "When you create an account, we collect personal information such as your full name, email address, phone number, and profile photo. For providers, we additionally collect business details including your organisation name, location, service descriptions, and banking information required for payouts.",
      "As you use the platform, we automatically collect usage data such as pages visited, experiences viewed, bookings made, search queries, device type, browser, IP address, and approximate geographic location. This helps us understand how our platform is used and where improvements can be made.",
      "When you complete a booking or transaction, we collect payment-related data through our third-party payment processor. We do not store full card numbers or sensitive payment credentials on our servers — these are handled securely by our payment partners.",
      "We may also collect content you voluntarily submit, including reviews, photos, messages to providers, and support communications. This content may be visible to other platform users depending on the context in which it is submitted.",
    ],
  },
  {
    icon: Lock,
    title: "2. How We Use Your Information",
    content: [
      "We use your personal information primarily to operate and deliver the platform's services — including account management, booking processing, provider dashboard functionality, and communication between tourists and providers.",
      "Your data helps us personalise your experience on the platform, such as recommending relevant cultural sites and experiences based on your browsing history and saved preferences.",
      "We use aggregated and anonymised usage data to analyse platform performance, identify technical issues, improve search and discovery features, and inform decisions about new functionality.",
      "We may use your email address to send transactional communications such as booking confirmations, payment receipts, cancellation notices, and important service updates. With your consent, we may also send promotional content about new features or curated experiences.",
    ],
  },
  {
    icon: Share2,
    title: "3. Sharing Your Information",
    content: [
      "We do not sell your personal information to third parties. We share data only where necessary to operate the platform or comply with legal obligations.",
      "When you book an experience or package, relevant booking details — such as your name, contact information, and booking specifics — are shared with the relevant provider to facilitate your visit. Providers are required to handle this data in accordance with applicable privacy laws.",
      "We work with trusted third-party service providers including cloud hosting platforms, payment processors, media storage services, and analytics tools. These partners access only the data necessary to perform their specific function and are contractually bound to protect it.",
      "We may disclose personal information if required by law, court order, or government authority, or where we believe in good faith that disclosure is necessary to protect the rights, safety, or property of CulturalHub, its users, or the public.",
    ],
  },
  {
    icon: Cookie,
    title: "4. Cookies & Tracking",
    content: [
      "We use cookies and similar tracking technologies to maintain your session, remember your preferences, and ensure the platform functions correctly. Essential cookies are required for the platform to operate and cannot be disabled.",
      "We may use analytics cookies to understand how visitors interact with the platform. These cookies collect anonymised data such as page views, session duration, and navigation patterns. You can opt out of analytics tracking through your browser settings or our cookie preferences panel.",
      "Third-party services embedded in the platform — such as payment widgets or map integrations — may set their own cookies. We recommend reviewing the privacy policies of those third parties for full details on their tracking practices.",
    ],
  },
  {
    icon: ShieldAlert,
    title: "5. Data Security",
    content: [
      "We take the security of your personal information seriously. We implement industry-standard technical and organisational measures including encrypted data transmission (TLS), hashed password storage, role-based access controls, and regular security audits.",
      "While we make every effort to protect your data, no online platform can guarantee absolute security. In the event of a data breach that affects your personal information, we will notify you as required by applicable law and take immediate remedial steps.",
      "You are responsible for maintaining the confidentiality of your account password. We strongly recommend using a unique, strong password and enabling any available two-factor authentication options. Do not share your credentials with anyone.",
    ],
  },
  {
    icon: Globe,
    title: "6. International Data Transfers",
    content: [
      "CulturalHub operates globally, and your personal information may be transferred to and processed in countries other than the one in which you reside. These countries may have different data protection laws than your own.",
      "Where such transfers occur, we take appropriate safeguards to ensure your data is protected in accordance with this Privacy Policy, including using standard contractual clauses approved by relevant data protection authorities where applicable.",
      "By using our platform, you consent to the transfer of your information to our servers and processing locations, which may be outside your country of residence.",
    ],
  },
  {
    icon: UserCheck,
    title: "7. Your Rights & Choices",
    content: [
      "Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete information we hold about you. You may also have the right to restrict or object to certain types of processing, or to request a portable copy of your data.",
      "To exercise any of these rights, contact us at the email address listed at the bottom of this page. We will respond to verified requests within 30 days. Some requests may be subject to legal, contractual, or operational limitations.",
      "You may deactivate your account at any time from your profile settings. Upon deactivation, we will anonymise or delete your personal data within a reasonable timeframe, except where retention is required for legal, accounting, or dispute resolution purposes.",
      "If you believe we have not handled your data in accordance with applicable law, you have the right to lodge a complaint with your local data protection authority.",
    ],
  },
  {
    icon: Mail,
    title: "8. Updates to This Policy",
    content: [
      "We may update this Privacy Policy periodically to reflect changes in our data practices, legal requirements, or platform features. When we make significant changes, we will notify you via email or a prominent notice displayed on the platform.",
      "The 'Last updated' date at the top of this page reflects when the policy was most recently revised. We encourage you to review this policy from time to time to stay informed about how we handle your information.",
      "Your continued use of the platform after any changes to this policy constitutes your acceptance of the updated terms. If you do not agree with the revised policy, you should discontinue use and contact us to request account deletion.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-slate-50 py-10">
      <PageContainer className="max-w-4xl">

        {/* Header */}
        <div className="mb-8 rounded-[28px] bg-slate-900 px-8 py-10 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400">
              <Lock className="h-5 w-5 text-slate-900" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Legal
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400 max-w-xl">
            Your privacy matters to us. This policy explains what data we collect,
            how we use it, and the rights you have over your personal information
            when using the CulturalHub platform.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>Last updated: March 2026</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Applies to all CulturalHub users worldwide</span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-6 rounded-[24px] border border-slate-200 bg-white p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Contents
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {sections.map((section) => (
              
              <a
                key={section.title}
                href={`#${section.title.replace(/\s+/g, "-").toLowerCase()}`}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <section.icon className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.title}
              id={section.title.replace(/\s+/g, "-").toLowerCase()}
              className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 shrink-0">
                  <section.icon className="h-4 w-4 text-amber-500" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-4">
                {section.content.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-7 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-6 rounded-[20px] border border-amber-200 bg-amber-50 px-6 py-5">
          <p className="text-sm leading-6 text-amber-800">
            <span className="font-semibold">Questions about your privacy?</span>{" "}
            Contact our data team at{" "}
            <a
              href="mailto:privacy@culturalhub.com"
              className="underline underline-offset-2 hover:text-amber-900"
            >         
              privacy@culturalhub.com
            </a>{" "}
            and we'll respond within 30 days.
          </p>
        </div>

      </PageContainer>
    </main>
  );
}