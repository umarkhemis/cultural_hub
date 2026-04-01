// src\app\(public)\welcome\page.tsx

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Star
} from "lucide-react";

import {
  MapPin,
  VideoCamera,
  Backpack,
  UsersThree,
  GlobeHemisphereWest,
  Storefront,
  Mountains
} from "phosphor-react";

import { useEffect, useRef, useState } from "react";
import type { ElementType } from "react";

import { Button } from "@/src/components/ui/button";
import { AnimatedCounter } from "@/src/components/ui/animated-counter";
import { PageContainer } from "@/src/components/layout/page-container";
import { FullWidthSection } from "@/src/components/layout/full-width-section";
import { ROUTES } from "@/src/constants/routes";
import { CulturalHeroSlider } from "@/src/features/home/cultural-hero-slider";
import { useTypewriter } from "@/src/hooks/use-typewriter";

/* ===================== DATA ===================== */

const stats = [
  { value: 15, label: "Cultural Sites" },
  { value: 40, label: "Active Providers" },
  { value: 120, label: "Experiences Shared" },
  { value: 4.9, label: "Community Rating", icon: Star, decimal: true },
];

const travelerLines = [
  "Discover cultural sites and hidden gems",
  "Watch real cultural experiences",
  "Book curated tourism packages",
  "Engage with communities",
];

const providerLines = [
  "Showcase your cultural experiences",
  "Create tourism packages",
  "Connect with travelers",
  "Reach a wider audience",
];

const travelerIcons = [MapPin, VideoCamera, Backpack, UsersThree];
const providerIcons = [Storefront, Backpack, UsersThree, GlobeHemisphereWest];

/* ===================== COMPONENTS ===================== */

function TypewriterCard({
  title,
  lines,
  Icons,
  iconColor = "text-slate-500",
  startDelay = 0,
  button,
  cardClass = "",
}: {
  title: string;
  lines: string[];
  Icons: ElementType[];
  iconColor?: string;
  startDelay?: number;
  button: React.ReactNode;
  cardClass?: string;
}) {
  const { displayed, activeIndex, done } = useTypewriter(lines, 28, 180, startDelay);

  return (
    <div className={`rounded-3xl border p-8 shadow-sm hover:shadow-md transition flex flex-col items-center text-center ${cardClass}`}>

      <h3 className="text-xl font-semibold mb-6">{title}</h3>

      <div className="space-y-5">
        {lines.map((_, i) => {
          const Icon = Icons[i] ?? Icons[0];
          const hasStarted = i < activeIndex || done || i === activeIndex;
          const isTyping = activeIndex === i && !done;

          return (
            <div
              key={i}
              className={`flex items-center justify-center gap-4 transition-opacity duration-300 ${
                hasStarted ? "opacity-100" : "opacity-0"
              }`}
            >
              <Icon
                size={22}
                weight="duotone"
                className={`${iconColor} shrink-0 mt-0.5`}
              />
              <p className="min-h-[1.5em] text-center">
                {displayed[i]}
                {isTyping && (
                  <span className="inline-block w-0.5 h-4 ml-0.5 align-middle bg-current animate-pulse rounded-sm" />
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Button fades in after all lines finish typing */}
      <div
        className={`mt-6 transition-opacity duration-500 ${
          done ? "opacity-100" : "opacity-0"
        }`}
      >
        {button}
      </div>

    </div>
  );
}

/* ===================== PAGE ===================== */

export default function WelcomePage() {
  return (
    <main className="bg-white">

      {/* HERO */}
      <CulturalHeroSlider />

      {/* STATS */}
      <FullWidthSection className="border-y border-slate-100 bg-slate-50">
        <PageContainer>
          <StatsSection />
        </PageContainer>
      </FullWidthSection>

      {/* VIDEO */}
      <FullWidthSection className="py-20 lg:py-28 bg-black text-white">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-2 items-center">

            <div>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Experience culture before you travel
              </h2>

              <p className="mt-5 text-white/70 max-w-lg">
                Watch real experiences from cultural sites and communities.
              </p>

              <div className="mt-6">
                <Link href={ROUTES.feed}>
                  <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                    Explore Experiences
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/MeePfYXA28A"
                  allowFullScreen
                />
              </div>
            </div>

          </div>
        </PageContainer>
      </FullWidthSection>

      {/* ROLE SECTION */}
      <FullWidthSection className="py-24 bg-white">
        <PageContainer>

          {/* HEADER */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-base font-medium animate-float">
              <Mountains size={16} weight="duotone" />
              Visit Kigezi
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
              Discover culture through people and stories
            </h2>

            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Explore authentic experiences and connect with local communities.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">

            {/* TRAVELERS */}
            <TypewriterCard
              title="For Travelers"
              lines={travelerLines}
              Icons={travelerIcons}
              iconColor="text-amber-500"
              startDelay={300}
              cardClass=""
              button={
                <Link href={ROUTES.feed}>
                  <Button className="bg-amber-500 text-slate-900">
                    Start Exploring
                  </Button>
                </Link>
              }
            />

            {/* PROVIDERS */}
            <TypewriterCard
              title="For Cultural Providers"
              lines={providerLines}
              Icons={providerIcons}
              iconColor="text-slate-500"
              startDelay={500}
              cardClass="bg-slate-50"
              button={
                <Link href={ROUTES.register}>
                  <Button className="bg-slate-900 text-white">
                    Become a Provider
                  </Button>
                </Link>
              }
            />

          </div>

        </PageContainer>
      </FullWidthSection>

      {/* =================== CTA ================ */}
      <FullWidthSection className="bg-slate-900 py-14 text-white">
        <PageContainer>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

            <div>
              <h3 className="text-xl font-bold">
                Are you a cultural provider?
              </h3>
              <p className="text-slate-400">
                Share your culture and grow your audience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href={ROUTES.register}>
                <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400 transition px-6 py-3 text-base font-semibold shadow-md">
                  Join Now
                </Button>
              </Link>

              <Link href={ROUTES.feed}>
                <Button variant="secondary" className="opacity-80 hover:opacity-100">
                  Explore
                </Button>
              </Link>
            </div>

          </div>
        </PageContainer>
      </FullWidthSection>

    </main>
  );
}

/* ===================== STATS ===================== */

function StatsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center py-6">
          <div className="text-2xl font-bold">
            {visible ? (
              <AnimatedCounter
                value={stat.value}
                duration={1500}
                decimals={stat.decimal ? 1 : 0}
              />
            ) : 0}
          </div>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}