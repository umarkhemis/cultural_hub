
import Link from "next/link";
import { Compass, Mountain, Sparkles, Users, ArrowRight, Globe, Star } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { PageContainer } from "@/src/components/layout/page-container";
import { ROUTES } from "@/src/constants/routes";
import { CulturalHeroSlider } from "@/src/features/home/cultural-hero-slider";

const features = [
  {
    icon: Compass,
    label: "Explore",
    title: "Public Discovery",
    description:
      "Let visitors explore authentic cultural experiences, sites, and stories before ever creating an account.",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    icon: Users,
    label: "Connect",
    title: "Cultural Connection",
    description:
      "Bring local traditions, communities, and stories closer to modern travelers seeking meaningful experiences.",
    accent: "bg-sky-50 text-sky-600 border-sky-100",
    iconBg: "bg-sky-100",
  },
  {
    icon: Mountain,
    label: "Book",
    title: "Tourism Packages",
    description:
      "Move from curiosity to confirmed booking through curated packages offered directly by verified providers.",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Sparkles,
    label: "Showcase",
    title: "Cultural Storytelling",
    description:
      "Empower providers to showcase cultural value through rich visual content and immersive digital narratives.",
    accent: "bg-violet-50 text-violet-600 border-violet-100",
    iconBg: "bg-violet-100",
  },
];

const stats = [
  { value: "500+", label: "Cultural Sites" },
  { value: "120+", label: "Providers" },
  { value: "3,000+", label: "Experiences" },
  { value: "4.9", label: "Avg. Rating", icon: Star },
];

export default function WelcomePage() {
  return (
    <main className="bg-white">

      {/* Hero Slider Section */}
      <section className="bg-slate-950 py-5 sm:py-6">
        <PageContainer>
          <CulturalHeroSlider />
        </PageContainer>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-100 bg-slate-50">
        <PageContainer>
          <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-1 py-5 px-4 text-center"
              >
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </span>
                  {stat.icon && (
                    <stat.icon className="h-4 w-4 fill-amber-400 text-amber-400" />
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <PageContainer>

          {/* Section header */}
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              <Globe className="h-4 w-4 text-amber-500" />
              Built for discovery, connection, and booking
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to explore{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-amber-500">cultural tourism</span>
                <span className="absolute bottom-1 left-0 z-0 h-3 w-full rounded-sm bg-amber-100" />
              </span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
              Discover authentic experiences before login, then dive deeper through bookings,
              provider profiles, and curated tourism packages crafted for meaningful travel.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-[24px] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${feature.accent}`}
              >
                {/* Background decoration */}
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150"
                  style={{ background: "currentColor" }}
                />

                <div className={`relative inline-flex h-11 w-11 items-center justify-center rounded-2xl ${feature.iconBg}`}>
                  <feature.icon className="h-5 w-5" />
                </div>

                <div className="mt-1 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    {feature.label}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500">
              Join thousands of travelers discovering the world's cultural heritage
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link href={ROUTES.feed}>
                <Button className="gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-400/30 hover:scale-[1.02] px-6">
                  Start Exploring
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.register}>
                <Button
                  variant="secondary"
                  className="gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-6 shadow-sm"
                >
                  Join the Platform
                </Button>
              </Link>
            </div>
          </div>

        </PageContainer>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-slate-100 bg-slate-900 py-14">
        <PageContainer>
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                Are you a cultural experience provider?
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-6">
                List your cultural sites, experiences, and packages. Reach thousands
                of travelers looking for authentic, meaningful tourism.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row shrink-0">
              <Link href={ROUTES.register}>
                <Button className="gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold whitespace-nowrap">
                  Become a Provider
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.feed}>
                <Button
                  variant="secondary"
                  className="border border-white/15 bg-white/10 text-white hover:bg-white/20 whitespace-nowrap"
                >
                  Browse First
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

    </main>
  );
}



