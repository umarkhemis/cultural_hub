"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

import { Button } from "@/src/components/ui/button";
import { PageContainer } from "@/src/components/layout/page-container";
import { FullWidthSection } from "@/src/components/layout/full-width-section";
import { ROUTES } from "@/src/constants/routes";
import { cn } from "@/src/utils/cn";

type Item = {
  title: string;
  body: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

function Row({ item, side }: { item: Item; side: "left" | "right" }) {
  const isLeft = side === "left";
  const rowRef = useRef<HTMLDivElement | null>(null);

  // Scroll progress-based animation (reverses automatically when scrolling back up)
  const { scrollYProgress } = useScroll({
    target: rowRef,
    // Tune these two numbers to change when the "pull" starts/ends
    offset: ["start 0.9", "start 0.3"],
  });

  // Stronger "pull up"
  const yText = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scaleText = useTransform(scrollYProgress, [0, 1], [0.98, 1]);
  const blurText = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const filterText = useMotionTemplate`blur(${blurText}px)`;

  // Image follows with a bit more movement (feels layered)
  const yImg = useTransform(scrollYProgress, [0, 1], [160, 0]);
  const opacityImg = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [0.98, 1]);
  const blurImg = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const filterImg = useMotionTemplate`blur(${blurImg}px)`;

  return (
    <div
      ref={rowRef}
      className={cn(
        "grid items-center gap-8 lg:gap-12",
        "lg:grid-cols-12",
        "py-12 sm:py-16"
      )}
    >
      {/* TEXT */}
      <motion.div
        style={{
          y: yText,
          opacity: opacityText,
          scale: scaleText,
          filter: filterText,
        }}
        className={cn(
          "lg:col-span-5",
          isLeft ? "lg:col-start-1" : "lg:col-start-8",
          "will-change-transform"
        )}
      >
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          {item.title}
        </h3>

        <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
          {item.body}
        </p>

        <div className="mt-6">
          <Link href={item.href}>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6">
              {item.cta}
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* IMAGE */}
      <motion.div
        style={{
          y: yImg,
          opacity: opacityImg,
          scale: scaleImg,
          filter: filterImg,
        }}
        className={cn(
          "lg:col-span-6",
          isLeft ? "lg:col-start-7" : "lg:col-start-1",
          "flex justify-center",
          "will-change-transform"
        )}
      >
        <div className="w-full max-w-[340px] sm:max-w-[420px] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            width={900}
            height={900}
            className="w-full h-auto object-cover"
            priority={false}
          />
        </div>
      </motion.div>
    </div>
  );
}

export function WhatYouCanDoScroll() {
  const items: Item[] = [
    {
      title: "Explore the feed",
      body:
        "Watch real cultural moments shared by communities—discover stories, events, and places worth visiting.",
      cta: "Explore Feed",
      href: ROUTES.feed,
      imageSrc: "/home/feed-scroll.png",
      imageAlt: "CulturalHub feed preview",
    },
    {
      title: "Book real experiences",
      body:
        "Browse packages and cultural sites, then book what you love. Plan with confidence before you arrive.",
      cta: "Browse Packages",
      href: ROUTES.packages,
      imageSrc: "/home/book_1.png",
      imageAlt: "Booking confirmation preview",
    },
    {
      title: "Providers can manage events digitally",
      body:
        "Create experiences, manage bookings, and share updates—all from one place built for cultural providers.",
      cta: "Become a Provider",
      href: ROUTES.register,
      imageSrc: "/home/story_3.png",
      imageAlt: "Provider tools preview",
    },
  ];

  return (
    <FullWidthSection className="py-16 sm:py-24 bg-white">
      <PageContainer>
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            What you can do on CulturalHub
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
            Explore stories, book experiences, and empower providers to host culture
            digitally.
          </p>
        </div>

        <div className="mt-6">
          <Row item={items[0]} side="left" />
          <Row item={items[1]} side="right" />
          <Row item={items[2]} side="left" />
        </div>
      </PageContainer>
    </FullWidthSection>
  );
}