// src/app/(public)/welcome/page.tsx

"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import {
  MapPin,
  VideoCamera,
  Backpack,
  UsersThree,
  GlobeHemisphereWest,
  Storefront,
  Mountains,
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

/* ===================== TYPEWRITER CARD ===================== */

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
  const { displayed, activeIndex, done } = useTypewriter(
    lines,
    28,
    180,
    startDelay
  );

  return (
    <div
      className={`relative overflow-hidden rounded-3xl 
      p-4 sm:p-5 lg:p-6
      min-h-[260px] sm:min-h-[300px] lg:min-h-[320px]
      shadow-sm transition-all duration-500 flex flex-col gap-4
      hover:shadow-xl hover:-translate-y-1 group border border-slate-100 ${cardClass}`}
    >
      <div className="relative z-10 text-center">
        <h3 className="text-lg font-semibold mb-4 group-hover:text-slate-900">
          {title}
        </h3>

        <div className="space-y-3">
          {lines.map((_, i) => {
            const Icon = Icons?.[i] ?? Icons?.[0];

            const hasStarted = i < activeIndex || done || i === activeIndex;
            const isTyping = activeIndex === i && !done;

            return (
              <div
                key={i}
                className={`flex items-center justify-center gap-3 transition-opacity duration-300 ${
                  hasStarted ? "opacity-100" : "opacity-0"
                }`}
              >
                {Icon && (
                  <Icon
                    size={20}
                    weight="duotone"
                    className={`${iconColor} transition-transform duration-300 group-hover:scale-110`}
                  />
                )}

                <p className="min-h-[1.3em] text-center text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {displayed[i]}
                  {isTyping && (
                    <span className="inline-block w-0.5 h-4 ml-0.5 bg-current animate-pulse" />
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className={`mt-5 transition-all duration-500 ${
            done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {button}
        </div>
      </div>
    </div>
  );
}

/* ===================== PAGE ===================== */

export default function WelcomePage() {
  return (
    <main className="bg-gradient-to-b from-white via-slate-50 to-white">

      <CulturalHeroSlider />

      <FullWidthSection className="border-y border-slate-100 bg-slate-50">
        <PageContainer>
          <StatsSection />
        </PageContainer>
      </FullWidthSection>

      <FullWidthSection className="py-20 bg-slate-50">
        <PageContainer>

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
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

          <div className="grid gap-10 lg:grid-cols-3 items-center">

            {/* ORBIT FIXED */}
            <div className="flex justify-center lg:justify-end items-center lg:pr-6">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">

                {/* glow */}
                <div className="absolute w-32 h-32 rounded-full bg-amber-200 blur-3xl opacity-30" />

                {/* center */}
                <div className="absolute text-center z-10 px-4">
                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    Visit Kigezi
                  </p>
                  <p className="text-xs text-slate-500">
                    Cultural Sites
                  </p>
                </div>

                {/* OUTER RING */}
                {travelerIcons.map((Icon, i) => {
                  const angle = (i / travelerIcons.length) * 360;

                  return (
                    <div
                      key={`outer-${i}`}
                      className="absolute animate-orbit"
                      style={{
                        transform: `rotate(${angle}deg) translateX(120px)`,
                        ["--radius" as any]: "120px",
                        animationDuration: "14s",
                      }}
                    >
                      <div className="animate-breathe text-blue-500">
                        <Icon size={20} />
                      </div>
                    </div>
                  );
                })}

                {/* MIDDLE RING */}
                {providerIcons.map((Icon, i) => {
                  const angle = (i / providerIcons.length) * 360;

                  return (
                    <div
                      key={`mid-${i}`}
                      className="absolute animate-orbit"
                      style={{
                        transform: `rotate(${angle}deg) translateX(85px)`,
                        ["--radius" as any]: "85px",
                        animationDuration: "10s",
                      }}
                    >
                      <div className="animate-breathe text-slate-600">
                        <Icon size={18} />
                      </div>
                    </div>
                  );
                })}

                {/* INNER RING */}
                {[MapPin, UsersThree, Backpack].map((Icon, i) => {
                  const angle = (i / 3) * 360;

                  return (
                    <div
                      key={`inner-${i}`}
                      className="absolute animate-orbit"
                      style={{
                        transform: `rotate(${angle}deg) translateX(55px)`,
                        ["--radius" as any]: "55px",
                        animationDuration: "8s",
                      }}
                    >
                      <div className="animate-breathe text-amber-500">
                        <Icon size={16} />
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* RIGHT CARDS */}
            <div className="lg:col-span-2 grid gap-6">

              <TypewriterCard
                title="For Travelers"
                lines={travelerLines}
                Icons={travelerIcons}
                iconColor="text-amber-500"
                startDelay={300}
                button={
                  <Link href={ROUTES.feed}>
                    <Button className="bg-amber-500 text-slate-900">
                      Start Exploring
                    </Button>
                  </Link>
                }
              />

              <TypewriterCard
                title="For Cultural Providers"
                lines={providerLines}
                Icons={providerIcons}
                iconColor="text-slate-500"
                startDelay={500}
                cardClass="bg-white"
                button={
                  <Link href={ROUTES.register}>
                    <Button className="bg-slate-900 text-white">
                      Become a Provider
                    </Button>
                  </Link>
                }
              />

            </div>
          </div>

        </PageContainer>
      </FullWidthSection>

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
                <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400 px-6 py-3 font-semibold shadow-md">
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
            ) : (
              0
            )}
          </div>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}