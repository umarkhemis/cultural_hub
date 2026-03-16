
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// import { Button } from "@/src/components/ui/button";
// import { ROUTES } from "@/src/constants/routes";
// import { cn } from "@/src/utils/cn";
// import { mockCulturalSlides } from "./mock-cultural-slides";

// const AUTO_SLIDE_INTERVAL = 5000;

// export function CulturalHeroSplit() {
//   const slides = useMemo(() => mockCulturalSlides, []);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (!slides.length) return;

//     const timer = window.setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % slides.length);
//     }, AUTO_SLIDE_INTERVAL);

//     return () => window.clearInterval(timer);
//   }, [slides]);

//   const currentSlide = slides[currentIndex];

//   return (
//     <section className="min-h-[100svh] bg-white">
//       <div className="grid min-h-[100svh] lg:grid-cols-2">
//         <div className="flex items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
//           <div className="max-w-xl">
//             <div className="mb-5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 sm:text-sm">
//               Cultural Tourism Experience Platform
//             </div>

//             <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
//               Discover the spirit of Kigezi through culture, stories, and experiences
//             </h1>

//             <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
//               Explore authentic cultural experiences, connect with local providers,
//               and move from inspiration to real bookings in one place.
//             </p>

//             <div className="mt-8 flex flex-col gap-3 sm:flex-row">
//               <Link href={ROUTES.feed}>
//                 <Button className="gap-2">
//                   Explore Experiences
//                   <ArrowRight className="h-4 w-4" />
//                 </Button>
//               </Link>

//               <Link href={ROUTES.register}>
//                 <Button variant="secondary">Create Account</Button>
//               </Link>
//             </div>

//             <div className="mt-10 flex items-center gap-2">
//               {slides.map((slide, index) => (
//                 <button
//                   key={slide.id}
//                   type="button"
//                   aria-label={`Go to slide ${index + 1}`}
//                   onClick={() => setCurrentIndex(index)}
//                   className={cn(
//                     "h-2.5 rounded-full transition-all duration-300",
//                     index === currentIndex
//                       ? "w-10 bg-slate-900"
//                       : "w-2.5 bg-slate-300 hover:bg-slate-400"
//                   )}
//                 />
//               ))}
//             </div>

//             <div className="mt-6">
//               <p className="text-sm font-medium text-slate-900">
//                 {currentSlide.title}
//               </p>
//               <p className="mt-2 text-sm leading-6 text-slate-600">
//                 {currentSlide.subtitle}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="relative min-h-[50svh] lg:min-h-[100svh]">
//           {slides.map((slide, index) => (
//             <div
//               key={slide.id}
//               className={cn(
//                 "absolute inset-0 transition-opacity duration-1000 ease-out",
//                 index === currentIndex ? "opacity-100" : "opacity-0"
//               )}
//             >
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={slide.image}
//                 alt={slide.title}
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/10" />
//             </div>
//           ))}

//           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-6 sm:p-8 lg:hidden">
//             <p className="text-lg font-semibold text-white">{currentSlide.title}</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }





































"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ROUTES } from "@/src/constants/routes";
import { cn } from "@/src/utils/cn";
import { mockCulturalSlides } from "./mock-cultural-slides";

const AUTO_SLIDE_INTERVAL = 5000;

export function CulturalHeroSlider() {
  const slides = useMemo(() => mockCulturalSlides, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [slides]);

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-900 shadow-sm">
      <div className="relative min-h-[540px] sm:min-h-[620px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </div>
        ))}

        <div className="relative z-10 flex min-h-[540px] items-end sm:min-h-[620px]">
          <div className="w-full p-6 sm:p-8 lg:p-12">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm sm:text-sm">
                Cultural Tourism Experience Platform
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {currentSlide.title}
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
                {currentSlide.subtitle}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={ROUTES.feed}>
                  <Button className="gap-2">
                    Explore Experiences
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href={ROUTES.register}>
                  <Button variant="secondary">Create Account</Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2.5 rounded-full transition-all",
                    index === currentIndex
                      ? "w-10 bg-white"
                      : "w-2.5 bg-white/40 hover:bg-white/60"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}