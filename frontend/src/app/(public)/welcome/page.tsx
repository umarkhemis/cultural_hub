"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mountains } from "phosphor-react";

import { Button } from "@/src/components/ui/button";
import { WhatYouCanDoScroll } from "@/src/features/home/what-you-can-do-scroll";
import { PageContainer } from "@/src/components/layout/page-container";
import { FullWidthSection } from "@/src/components/layout/full-width-section";
import { ROUTES } from "@/src/constants/routes";
import { CulturalHeroSlider } from "@/src/features/home/cultural-hero-slider";

/* ===================== COUNT-UP (EASED) ===================== */

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);

      setValue(target * eased);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* ===================== STAT CARD ===================== */

type StatCardProps = {
  value: number;
  label: string;
  suffix?: string;
  decimal?: boolean;
  description: string;
  accent?: "orange" | "green" | "slate";
};

function StatCard({
  value,
  label,
  suffix,
  decimal,
  description,
  accent = "orange",
}: StatCardProps) {
  const count = useCountUp(value);

  const display = useMemo(() => {
    if (decimal) return Number(count).toFixed(1);
    return String(Math.floor(count));
  }, [count, decimal]);

  const accentClasses =
    accent === "green"
      ? {
          glow: "shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_10px_40px_rgba(34,197,94,0.10)]",
          border: "border-emerald-500/15",
          dot: "bg-emerald-400",
          text: "text-emerald-300",
        }
      : accent === "slate"
      ? {
          glow: "shadow-[0_0_0_1px_rgba(148,163,184,0.20),0_10px_40px_rgba(15,23,42,0.10)]",
          border: "border-slate-400/15",
          dot: "bg-slate-300",
          text: "text-slate-200",
        }
      : {
          glow: "shadow-[0_0_0_1px_rgba(249,115,22,0.25),0_10px_40px_rgba(249,115,22,0.10)]",
          border: "border-orange-500/15",
          dot: "bg-orange-400",
          text: "text-orange-300",
        };

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl",
        "bg-[#0B1220]/95 text-white",
        "border",
        accentClasses.border,
        "p-5 sm:p-6",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        accentClasses.glow,
      ].join(" ")}
    >
      {/* subtle grid/scanline feel */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background:linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_60%),linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:100%_100%,22px_22px]" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative">
        {/* label row */}
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200/90">
            {label}
          </div>
          <span className={["h-2 w-2 rounded-full", accentClasses.dot].join(" ")} />
        </div>

        {/* digital number pill */}
        <div className="mt-4 flex items-end gap-2">
          <div
            className={[
              "inline-flex items-center justify-center",
              "rounded-xl px-3 py-1.5",
              "bg-black/35 border border-white/10",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
              "backdrop-blur",
              "text-3xl sm:text-4xl font-extrabold tracking-tight",
              accentClasses.text,
              "[font-variant-numeric:tabular-nums]",
            ].join(" ")}
          >
            {display}
          </div>

          {suffix ? (
            <div className="pb-1 text-xl sm:text-2xl font-bold text-white/80">
              {suffix}
            </div>
          ) : null}
        </div>

        <p className="mt-3 text-xs sm:text-sm text-slate-200/80 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ===================== PAGE ===================== */

export default function WelcomePage() {
  const stats: StatCardProps[] = [
    {
      value: 15,
      label: "Cultural Sites",
      suffix: "+",
      description: "Places available to explore physically or digitally.",
      accent: "orange",
    },
    {
      value: 40,
      label: "Local Providers",
      suffix: "+",
      description: "People sharing authentic cultural knowledge and services.",
      accent: "green",
    },
    {
      value: 120,
      label: "Experiences",
      suffix: "+",
      description: "Recorded and live cultural moments you can watch anytime.",
      accent: "slate",
    },
    {
      value: 4.9,
      label: "Community Rating",
      decimal: true,
      description: "Feedback reflecting trust and quality of experiences.",
      accent: "orange",
    },
  ];

  return (
    <main className="bg-white">
      {/* HERO */}
      <CulturalHeroSlider />

      {/* INTRO */}
      <FullWidthSection className="py-16 sm:py-24 bg-white">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Discover culture through real experiences, not just stories
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
                Explore cultural destinations, watch real experiences, and connect with
                local providers. Everything is designed to help you understand a place
                before you visit it - or even from wherever you are.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href={ROUTES.feed}>
                  <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
                    Explore Experiences
                  </Button>
                </Link>

                <Link href={ROUTES.register}>
                  <Button className="w-full sm:w-auto bg-white text-green-600 border border-green-200 hover:bg-green-50 shadow-sm">
                    Become a Provider
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <Mountains
                size={140}
                className="sm:size-[180px] text-green-500 opacity-80"
              />
            </div>
          </div>
        </PageContainer>
      </FullWidthSection>

      {/* STATS + MESSAGE */}
      <FullWidthSection className="relative py-16 sm:py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
        {/* subtle background accents */}
        <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-green-200/40 blur-3xl" />

        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* TEXT */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Listen, explore, and connect with culture in a new way
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                From live experiences to recorded cultural moments, the platform brings
                together travelers and local communities in one place. You can browse,
                watch, and decide what to experience before you even arrive.
              </p>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Whether you&apos;re planning a trip or just curious, everything here is built
                to help you discover authentic experiences and meaningful connections.
              </p>
            </div>

            {/* STATS (pull-in both directions) */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 26, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.35 }}
                  transition={{
                    duration: 0.55,
                    ease: "easeOut",
                    delay: idx * 0.06,
                  }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>
          </div>
        </PageContainer>
      </FullWidthSection>

      {/* WHAT YOU CAN DO */}
      <WhatYouCanDoScroll />

      {/* VIDEO SECTION */}
      <FullWidthSection className="py-16 sm:py-24 bg-white">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                See what cultural experiences look like
              </h2>

              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
                This video represents the kind of content you&apos;ll find on the platform -
                cultural events, traditions, and real-life moments captured by providers.
              </p>

              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                It&apos;s not just about watching - it&apos;s about discovering, connecting, and
                preparing for real-world experiences.
              </p>
            </div>

            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-100">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/hjqu8P7XvGQ"
                title="Cultural Experience"
                allowFullScreen
              />
            </div>
          </div>
        </PageContainer>
      </FullWidthSection>

      {/* FINAL CTA */}
      <FullWidthSection className="py-16 sm:py-24 bg-slate-50">
        <PageContainer>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Ready to explore culture in a more meaningful way?
            </h2>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
              Whether you&apos;re discovering experiences or sharing them, this platform
              connects people through culture, stories, and real moments.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link href={ROUTES.feed}>
                <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
                  Start Exploring
                </Button>
              </Link>

              <Link href={ROUTES.register}>
                <Button className="w-full sm:w-auto bg-white text-green-600 border border-green-200 hover:bg-green-50 shadow-sm">
                  Join as Provider
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </FullWidthSection>
    </main>
  );
}