
import { PageContainer } from "@/src/components/layout/page-container";
import { Scale, Shield, Users, AlertTriangle, RefreshCw, BookOpen, CreditCard, Eye } from "lucide-react";

const sections = [
  {
    icon: BookOpen,
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the CulturalHub platform - including browsing cultural sites, booking experiences, publishing provider content, or engaging with any part of the service - you confirm that you have read, understood, and agree to be bound by these Terms of Service.",
      "If you are using the platform on behalf of an organisation, company, or other legal entity, you represent that you have the authority to bind that entity to these terms. In such cases, 'you' refers to both you as an individual and the entity you represent.",
      "If you do not agree with any part of these terms, you must discontinue use of the platform immediately. We reserve the right to refuse access to anyone who violates these terms or applicable laws.",
    ],
  },
  {
    icon: Users,
    title: "2. User Accounts & Roles",
    content: [
      "The platform supports two primary account types: Tourists and Providers. Tourists may browse, save, and book cultural experiences and packages. Providers may publish, manage, and monetise cultural sites, experiences, and packages through their dedicated dashboard.",
      "You are responsible for maintaining the confidentiality of your login credentials. Any activity that occurs under your account is your responsibility. You must notify us immediately if you suspect unauthorised access to your account.",
      "Accounts must be registered with accurate, current, and complete information. Impersonation of another person, provider, or organisation is strictly prohibited and may result in immediate account suspension.",
      "We reserve the right to suspend, restrict, or permanently delete accounts that are found to be in violation of these terms, engaged in fraudulent activity, or inactive for extended periods without prior notice.",
    ],
  },
  {
    icon: Shield,
    title: "3. Provider Responsibilities",
    content: [
      "Providers are solely responsible for the accuracy, legality, and completeness of all content they publish. This includes cultural site descriptions, experience details, package pricing, media assets, availability calendars, and any associated booking terms.",
      "Providers must hold all necessary licences, permits, and authorisations required to offer the services listed on the platform. The platform does not verify provider credentials on behalf of tourists and accepts no liability for unlicensed or misrepresented services.",
      "Pricing displayed must be honest and inclusive of applicable taxes unless otherwise clearly stated. Providers must not engage in bait-and-switch tactics, hidden fees, or misleading promotional offers.",
      "Providers agree not to solicit tourists to conduct transactions outside the platform in order to circumvent fees or the platform's booking system. Violations may result in permanent removal from the platform.",
    ],
  },
  {
    icon: CreditCard,
    title: "4. Bookings & Payments",
    content: [
      "All bookings made through the platform are subject to the availability and cancellation policies set by individual providers. Tourists are encouraged to review these policies carefully before confirming a booking.",
      "Payment processing is facilitated through third-party payment providers. By completing a booking, you authorise the charge of the stated amount to your chosen payment method. The platform does not store full card details.",
      "Refunds, where applicable, are governed by the provider's stated cancellation policy. The platform may, at its discretion, mediate disputes between tourists and providers in cases of clear policy violations or fraudulent misrepresentation.",
      "In the event of a technical error resulting in a duplicate or incorrect charge, please contact support within 14 days. The platform will investigate and process corrections where verified.",
    ],
  },
  {
    icon: Eye,
    title: "5. Content & Intellectual Property",
    content: [
      "All content you upload - including photos, descriptions, logos, and media - remains your property. However, by uploading content to the platform, you grant CulturalHub a non-exclusive, royalty-free, worldwide licence to display, distribute, and promote that content in connection with the platform's services.",
      "You must not upload content that infringes on the intellectual property rights of others, including copyrighted images, trademarked materials, or proprietary information obtained without permission.",
      "The platform's own brand assets, interface design, codebase, and original written content are protected by copyright and may not be reproduced, modified, or distributed without explicit written permission from CulturalHub.",
      "User-generated content is not endorsed by CulturalHub. We are not liable for the accuracy or legality of content submitted by users, though we reserve the right to remove content that violates these terms or applicable laws.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "6. Prohibited Conduct",
    content: [
      "You agree not to use the platform for any unlawful purpose or in a way that could damage, disable, or impair the platform's functionality. This includes but is not limited to: attempting to gain unauthorised access to systems, scraping data without permission, or introducing malicious code.",
      "Harassment, hate speech, discriminatory content, or threatening behaviour directed at other users, providers, or platform staff is strictly prohibited and will result in immediate account termination.",
      "Submitting fraudulent bookings, fake reviews, false provider credentials, or deliberately misleading information is a violation of these terms and may be reported to relevant authorities.",
      "Using the platform to advertise or promote services that are unrelated to cultural tourism, or that compete directly with the platform's core offering, is not permitted without prior written consent.",
    ],
  },
  {
    icon: Scale,
    title: "7. Limitation of Liability",
    content: [
      "The platform is provided on an 'as is' and 'as available' basis. While we strive for reliability and uptime, we do not warrant that the service will be uninterrupted, error-free, or free from security vulnerabilities at all times.",
      "CulturalHub is not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including loss of data, loss of revenue, or reputational harm, even if we have been advised of the possibility of such damages.",
      "Our total liability to you for any claim arising from use of the platform shall not exceed the amount you paid to us in the 12 months preceding the claim, or the equivalent of USD $100, whichever is greater.",
      "Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other matter that cannot be excluded by law.",
    ],
  },
  {
    icon: RefreshCw,
    title: "8. Changes to These Terms",
    content: [
      "We may revise these Terms of Service from time to time to reflect changes in our services, legal requirements, or platform policies. When we make material changes, we will notify registered users via email or a prominent notice on the platform.",
      "The date at the top of this page will always reflect when the terms were last updated. Continued use of the platform after the effective date of any revision constitutes your acceptance of the updated terms.",
      "If you disagree with a revised version of the terms, you must stop using the platform and may request deletion of your account by contacting our support team.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-slate-50 py-10">
      <PageContainer className="max-w-4xl">

        {/* Header */}
        <div className="mb-8 rounded-[28px] bg-slate-900 px-8 py-10 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400">
              <Scale className="h-5 w-5 text-slate-900" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Legal
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400 max-w-xl">
            Please read these terms carefully before using the CulturalHub platform.
            They govern your access to and use of our services as a tourist, provider, or visitor.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>Last updated: March 2026</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Effective immediately upon account creation</span>
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
            <span className="font-semibold">Questions about these terms?</span>{" "}
            Reach out to our support team at{" "}
            <a href="mailto:legal@culturalhub.com" className="underline underline-offset-2 hover:text-amber-900">
              legal@culturalhub.com
            </a>{" "}
            and we'll be happy to clarify anything.
          </p>
        </div>

      </PageContainer>
    </main>
  );
}