
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Play } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ROUTES } from "@/src/constants/routes";
import { cn } from "@/src/utils/cn";
import { mockCulturalSlides } from "./mock-cultural-slides";


const AUTO_SLIDE_INTERVAL = 6000;

export function CulturalHeroSlider() {
  const slides = useMemo(() => mockCulturalSlides, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" = "next") => {
      if (isAnimating || index === currentIndex) return;
      setDirection(dir);
      setPrevIndex(currentIndex);
      setCurrentIndex(index);
      setIsAnimating(true);
      setProgress(0);
      setTimeout(() => setIsAnimating(false), 800);
    },
    [isAnimating, currentIndex]
  );

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % slides.length, "next");
  }, [currentIndex, slides.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + slides.length) % slides.length, "prev");
  }, [currentIndex, slides.length, goTo]);

  // Auto-advance with progress bar
  useEffect(() => {
    if (isPaused) return;
    const interval = 50;
    const steps = AUTO_SLIDE_INTERVAL / interval;
    let step = 0;

    const timer = window.setInterval(() => {
      step++;
      setProgress((step / steps) * 100);
      if (step >= steps) {
        step = 0;
        goNext();
      }
    }, interval);

    return () => window.clearInterval(timer);
  }, [isPaused, goNext]);

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative overflow-hidden rounded-[28px] shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[700px]">

        {/* Slides */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === prevIndex;

          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-all duration-[800ms] ease-in-out",
                isActive && direction === "next" && isAnimating
                  ? "opacity-100 translate-x-0 scale-100"
                  : isActive && !isAnimating
                  ? "opacity-100 translate-x-0 scale-100"
                  : isPrev && direction === "next"
                  ? "opacity-0 -translate-x-8 scale-[1.02]"
                  : isPrev && direction === "prev"
                  ? "opacity-0 translate-x-8 scale-[1.02]"
                  : isActive && direction === "prev" && isAnimating
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 translate-x-8 scale-[1.02]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.title}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-[8000ms] ease-out",
                  isActive ? "scale-110" : "scale-100"
                )}
              />

              {/* Layered gradients for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-transparent to-transparent" />
            </div>
          );
        })}

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Slide number indicator — top right */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <span className="text-4xl font-bold text-white/10 tabular-nums select-none">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-white/20 text-lg">/</span>
          <span className="text-sm text-white/30 tabular-nums select-none">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* Location badge — top left */}
        {/* {currentSlide.location && (
          <div className="absolute top-6 left-6 z-20">
            <div
              key={currentIndex}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md animate-fade-in"
            >
              <MapPin className="h-3 w-3 text-amber-400" />
              <span className="text-xs font-medium text-white/90 tracking-wide">
                {currentSlide.location}
              </span>
            </div>
          </div>
        )} */}

        {/* Main content */}
        <div className="relative z-20 flex min-h-[560px] items-end sm:min-h-[640px] lg:min-h-[700px]">
          <div className="w-full p-6 sm:p-10 lg:p-14">
            <div className="max-w-2xl">

              {/* Category tag */}
              <div
                key={`tag-${currentIndex}`}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 backdrop-blur-sm"
                style={{ animation: "slideUpFade 0.6s ease forwards" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Cultural Tourism Experience
                </span>
              </div>

              {/* Title */}
              <h1
                key={`title-${currentIndex}`}
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
                style={{ animation: "slideUpFade 0.6s ease 0.1s both" }}
              >
                {currentSlide.title}
              </h1>

              {/* Subtitle */}
              <p
                key={`sub-${currentIndex}`}
                className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8"
                style={{ animation: "slideUpFade 0.6s ease 0.2s both" }}
              >
                {currentSlide.subtitle}
              </p>

              {/* CTAs */}
              <div
                key={`cta-${currentIndex}`}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                style={{ animation: "slideUpFade 0.6s ease 0.3s both" }}
              >
                <Link href={ROUTES.feed}>
                  <Button className="gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-400/40 hover:scale-[1.02]">
                    Explore Experiences
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={ROUTES.register}>
                  <Button
                    variant="secondary"
                    className="gap-2 border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            {/* Bottom row — dots + arrows */}
            <div className="mt-10 flex items-center justify-between">

              {/* Dot indicators with progress */}
              <div className="flex items-center gap-3">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() =>
                      goTo(index, index > currentIndex ? "next" : "prev")
                    }
                    className="group relative flex items-center"
                  >
                    {index === currentIndex ? (
                      <span className="relative flex h-1.5 w-12 overflow-hidden rounded-full bg-white/20">
                        <span
                          className="absolute left-0 top-0 h-full rounded-full bg-amber-400 transition-none"
                          style={{ width: `${progress}%` }}
                        />
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "block h-1.5 rounded-full transition-all duration-300",
                          index < currentIndex
                            ? "w-4 bg-white/50"
                            : "w-1.5 bg-white/25 group-hover:bg-white/50"
                        )}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Arrow navigation */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease forwards;
        }
      `}</style>
    </section>
  );
}



