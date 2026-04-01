// src\features\home\cultural-hero-slider.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ROUTES } from "@/src/constants/routes";
import { mockCulturalSlides } from "./mock-cultural-slides";

const AUTO_INTERVAL = 6000;

export function CulturalHeroSlider() {
  const slides = useMemo(() => mockCulturalSlides, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_INTERVAL);

    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Background Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: isActive ? 1 : 0 }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] ${
                  isActive ? "scale-110" : "scale-105"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

      {/* Text Content */}
      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16 text-white">

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl leading-tight">
            {currentSlide.title}
          </h1>

          <p className="mt-5 max-w-xl text-white/75">
            {currentSlide.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={ROUTES.feed}>
              <Button className="gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold">
                Explore Experiences
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href={ROUTES.register}>
              <Button
                variant="secondary"
                className="border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Get Started
              </Button>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}