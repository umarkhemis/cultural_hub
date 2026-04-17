"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PageContainer } from "@/src/components/layout/page-container";
import { FullWidthSection } from "@/src/components/layout/full-width-section";
import { cn } from "@/src/utils/cn";

type StoryItem = {
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function StoryRow({
  item,
  side,
}: {
  item: StoryItem;
  side: "left" | "right";
}) {
  const { ref, inView } = useInView(0.25);
  const isLeft = side === "left";

  return (
    <div
      ref={ref}
      className={cn(
        "grid items-center gap-6 md:gap-10",
        "md:grid-cols-12",
        "py-10 md:py-14"
      )}
    >
      {/* IMAGE */}
      <div
        className={cn(
          "md:col-span-6",
          isLeft ? "md:col-start-1" : "md:col-start-7",
          "transition-all duration-700 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="rounded-3xl overflow-hidden border border-black/10 bg-white shadow-sm">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            width={1600}
            height={1000}
            className="h-[260px] w-full object-cover md:h-[360px]"
          />
        </div>
      </div>

      {/* TEXT */}
      <div
        className={cn(
          "md:col-span-5",
          isLeft ? "md:col-start-8" : "md:col-start-2",
          "transition-all duration-700 ease-out delay-100",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="rounded-3xl bg-white/80 backdrop-blur border border-black/10 p-5 md:p-6 shadow-sm">
          <h3 className="text-lg md:text-xl font-semibold text-slate-900">
            {item.title}
          </h3>
          <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
            {item.body}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StoryScrollSection() {
  // Use your 3 images (put them in /public/home/)
  const items: StoryItem[] = [
    {
      title: "From the table, the story begins",
      body:
        "Food is memory. It carries the way people gather, celebrate, and welcome you into their world.",
      imageSrc: "/home/story_1.jpg",
      imageAlt: "Traditional meal setting",
    },
    {
      title: "Made by hands, shared with heart",
      body:
        "Behind every taste is a person, a place, and a tradition passed from generation to generation.",
      imageSrc: "/home/story_2.jpg",
      imageAlt: "Local food and cultural craft",
    },
    {
      title: "A moment you don’t forget",
      body:
        "Culture isn’t something you only read about—it’s something you feel, experience, and carry home.",
      imageSrc: "/home/story_3.jpg",
      imageAlt: "Cultural drink and traditional serving",
    },
  ];

  return (
    <FullWidthSection className="py-16 sm:py-24 bg-[#EFE7DB]">
      <PageContainer>
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Feel the story as you scroll
          </h2>
          <p className="mt-2 text-slate-600 text-base sm:text-lg leading-relaxed">
            A simple journey—taste, people, and place—told in three moments.
          </p>
        </div>

        <div className="mt-8">
          <StoryRow item={items[0]} side="left" />
          <StoryRow item={items[1]} side="right" />
          <StoryRow item={items[2]} side="left" />
        </div>
      </PageContainer>
    </FullWidthSection>
  );
}