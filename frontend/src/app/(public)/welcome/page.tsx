// src/app/(public)/welcome/page.tsx

"use client";

import Link from "next/link";
import {
  Compass,
  Mountain,
  Sparkles,
  Users,
  ArrowRight,
  Globe,
  Star,
  Play
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { AnimatedCounter } from "@/src/components/ui/animated-counter";
import { PageContainer } from "@/src/components/layout/page-container";
import { FullWidthSection } from "@/src/components/layout/full-width-section";
import { ROUTES } from "@/src/constants/routes";
import { CulturalHeroSlider } from "@/src/features/home/cultural-hero-slider";

/* ===================== DATA ===================== */

const stats = [
  { value: 15, label: "Cultural Sites" },
  { value: 40, label: "Active Providers" },
  { value: 120, label: "Experiences Shared" },
  { value: 4.9, label: "Community Rating", icon: Star, decimal: true },
];

const features = [
  {
    icon: Compass,
    label: "Explore",
    title: "Discover Real Culture",
    description:
      "Browse authentic cultural experiences, stories, and destinations shared by local communities.",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    icon: Users,
    label: "Connect",
    title: "Meet Local Providers",
    description:
      "Engage directly with cultural hosts, creators, and communities behind each experience.",
    accent: "bg-sky-50 text-sky-600 border-sky-100",
    iconBg: "bg-sky-100",
  },
  {
    icon: Mountain,
    label: "Book",
    title: "Plan Your Visit",
    description:
      "Book curated tourism packages and explore cultural sites with confidence.",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
    iconBg: "bg-emerald-100",
  },
  {
    icon: Sparkles,
    label: "Share",
    title: "Tell Your Story",
    description:
      "Providers can showcase culture through videos, experiences, and storytelling.",
    accent: "bg-violet-50 text-violet-600 border-violet-100",
    iconBg: "bg-violet-100",
  },
];

/* ===================== PAGE ===================== */

export default function WelcomePage() {
  return (
    <main className="bg-white">

      {/* HERO */}
      <CulturalHeroSlider />

      {/* ===================== STATS ===================== */}
      <FullWidthSection className="border-y border-slate-100 bg-slate-50">
        <PageContainer>
          <StatsSection />
        </PageContainer>
      </FullWidthSection>

 {/* ===================== EXPERIENCE VIDEO ===================== */}
<FullWidthSection className="py-20 lg:py-28 bg-black text-white">
  <PageContainer>
    <div className="grid gap-10 lg:grid-cols-2 items-center">

      {/* TEXT */}
      <div>
        <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl leading-tight">
          Experience culture before you travel
        </h2>

        <p className="mt-5 text-white/70 text-base sm:text-lg max-w-lg">
          Watch real experiences from cultural sites and communities.
          Discover traditions, stories, and moments that go beyond tourism.
        </p>

        <div className="mt-6">
          <Link href={ROUTES.feed}>
            <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-lg shadow-amber-500/20">
              Explore More Experiences
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* VIDEO */}
      <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/MeePfYXA28A"
            title="Kabale Cultural Experience"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

    </div>
  </PageContainer>
</FullWidthSection>

{/* ===================== ROLE-BASED EXPERIENCE ===================== */}
<FullWidthSection className="py-20 bg-white">
  <PageContainer>

    {/* SECTION HEADER */}
    <div className="mx-auto max-w-2xl text-center mb-16">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
        <Globe className="h-4 w-4 text-amber-500" />
        Built for everyone in cultural tourism
      </div>

      <h2 className="text-3xl font-bold sm:text-4xl text-slate-900">
        A platform for both{" "}
        <span className="text-amber-500">explorers</span> and{" "}
        <span className="text-amber-500">storytellers</span>
      </h2>

      <p className="mt-4 text-slate-500">
        Whether you're discovering culture or sharing it, CulturalHub gives you the tools to connect, explore, and grow.
      </p>
    </div>

    {/* TWO COLUMNS */}
    <div className="grid gap-8 lg:grid-cols-2">

      {/* ================= TOURISTS ================= */}
      <div className="rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition">

        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          👤 For Tourists
        </h3>

        <ul className="space-y-4 text-slate-600 text-sm">
          <li className="flex gap-3">
            <Compass className="h-5 w-5 text-amber-500" />
            Discover authentic cultural experiences and hidden gems
          </li>

          <li className="flex gap-3">
            <Play className="h-5 w-5 text-amber-500" />
            Watch real videos from cultural sites and communities
          </li>

          <li className="flex gap-3">
            <Mountain className="h-5 w-5 text-amber-500" />
            Book curated tourism packages with trusted providers
          </li>

          <li className="flex gap-3">
            <Users className="h-5 w-5 text-amber-500" />
            Engage through comments, sharing, and interactions
          </li>
        </ul>

        <div className="mt-6">
          <Link href={ROUTES.feed}>
            <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400">
              Start Exploring
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>

      {/* ================= PROVIDERS ================= */}
      <div className="rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition bg-slate-50">

        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          For Cultural Providers
        </h3>

        <ul className="space-y-4 text-slate-600 text-sm">
          <li className="flex gap-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Showcase your culture through videos and storytelling
          </li>

          <li className="flex gap-3">
            <Mountain className="h-5 w-5 text-amber-500" />
            Create and manage tourism packages بسهولة
          </li>

          <li className="flex gap-3">
            <Users className="h-5 w-5 text-amber-500" />
            Connect directly with tourists and grow your audience
          </li>

          <li className="flex gap-3">
            <Globe className="h-5 w-5 text-amber-500" />
            Reach a wider audience beyond your physical location
          </li>
        </ul>

        <div className="mt-6">
          <Link href={ROUTES.register}>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              Become a Provider
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>

    </div>

  </PageContainer>
</FullWidthSection>

      {/* ===================== CTA ===================== */}
      <FullWidthSection className="border-t border-slate-100 bg-slate-900 py-14">
        <PageContainer>
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">

            <div className="max-w-xl">
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                Are you a cultural experience provider?
              </h3>

              <p className="mt-2 text-sm text-slate-400 leading-6">
                Share your culture, attract visitors, and grow your presence through our platform.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row shrink-0">
              <Link href={ROUTES.register}>
                <Button className="gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold">
                  Become a Provider
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href={ROUTES.feed}>
                <Button
                  variant="secondary"
                  className="border border-white/15 bg-white/10 text-white hover:bg-white/20"
                >
                  Browse First
                </Button>
              </Link>
            </div>

          </div>
        </PageContainer>
      </FullWidthSection>

    </main>
  );
}

/* ===================== STATS COMPONENT ===================== */

function StatsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center gap-1 py-6 px-4 text-center"
        >
          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {visible ? (
                <AnimatedCounter
                  value={stat.value}
                  duration={1.5}
                  decimals={stat.decimal ? 1 : 0}
                />
              ) : (
                0
              )}
            </span>

            {stat.icon && (
              <stat.icon className="h-4 w-4 fill-amber-400 text-amber-400" />
            )}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}