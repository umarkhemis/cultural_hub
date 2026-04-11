
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Mountains,
} from "phosphor-react";

import { Button } from "@/src/components/ui/button";
import { PageContainer } from "@/src/components/layout/page-container";
import { FullWidthSection } from "@/src/components/layout/full-width-section";
import { ROUTES } from "@/src/constants/routes";
import { CulturalHeroSlider } from "@/src/features/home/cultural-hero-slider";

/* ===================== COUNTER HOOK ===================== */

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}

/* ===================== STAT CARD ===================== */

// Extracted to a proper component so hooks are called at the top level
// of a React function component — not inside a .map() callback.
type StatCardProps = {
  value: number;
  label: string;
  suffix?: string;
  decimal?: boolean;
  description: string;
};

function StatCard({ value, label, suffix, decimal, description }: StatCardProps) {
  const count = useCountUp(value);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
      <div className="text-3xl sm:text-4xl font-bold text-orange-500">
        {decimal ? count.toFixed(1) : Math.floor(count)}
        {suffix || ""}
      </div>
      <div className="mt-2 text-sm sm:text-base font-semibold text-slate-800">
        {label}
      </div>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
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
    },
    {
      value: 40,
      label: "Local Providers",
      suffix: "+",
      description: "People sharing authentic cultural knowledge and services.",
    },
    {
      value: 120,
      label: "Experiences",
      suffix: "+",
      description: "Recorded and live cultural moments you can watch anytime.",
    },
    {
      value: 4.9,
      label: "Community Rating",
      decimal: true,
      description: "Feedback reflecting trust and quality of experiences.",
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
              <Mountains size={140} className="sm:size-[180px] text-green-500 opacity-80" />
            </div>
          </div>
        </PageContainer>
      </FullWidthSection>

      {/* STATS + MESSAGE */}
      <FullWidthSection className="py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
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

            {/* STATS — each card is its own component so useCountUp is called at top level */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </PageContainer>
      </FullWidthSection>

      {/* VIDEO SECTION */}
      <FullWidthSection className="py-16 sm:py-24 bg-white">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                See what cultural experiences look like
              </h2>

              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
                This video represents the kind of content you&apos;ll find on the platform —
                cultural events, traditions, and real-life moments captured by providers.
              </p>

              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                It&apos;s not just about watching - it&apos;s about discovering, connecting, and
                preparing for real-world experiences.
              </p>
            </div>

            {/* VIDEO */}
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





























// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// import {
//   MapPin,
//   VideoCamera,
//   Backpack,
//   UsersThree,
//   GlobeHemisphereWest,
//   Mountains,
// } from "phosphor-react";

// import { Button } from "@/src/components/ui/button";
// import { PageContainer } from "@/src/components/layout/page-container";
// import { FullWidthSection } from "@/src/components/layout/full-width-section";
// import { ROUTES } from "@/src/constants/routes";
// import { CulturalHeroSlider } from "@/src/features/home/cultural-hero-slider";

// /* ===================== COUNTER HOOK ===================== */

// function useCountUp(target: number, duration = 1500) {
//   const [value, setValue] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const increment = target / (duration / 16);

//     const timer = setInterval(() => {
//       start += increment;

//       if (start >= target) {
//         setValue(target);
//         clearInterval(timer);
//       } else {
//         setValue(start);
//       }
//     }, 16);

//     return () => clearInterval(timer);
//   }, [target, duration]);

//   return value;
// }

// /* ===================== PAGE ===================== */

// export default function WelcomePage() {
//   const stats = [
//     { value: 15, label: "Cultural Sites", suffix: "+" },
//     { value: 40, label: "Local Providers", suffix: "+" },
//     { value: 120, label: "Experiences", suffix: "+" },
//     { value: 4.9, label: "Community Rating", decimal: true },
//   ];

//   return (
//     <main className="bg-white">
//       {/* HERO */}
//       <CulturalHeroSlider />

//       {/* INTRO */}
//       <FullWidthSection className="py-16 sm:py-24 bg-white">
//         <PageContainer>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//             <div>
//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
//                 Discover culture through real experiences, not just stories
//               </h1>

//               <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
//                 Explore cultural destinations, watch real experiences, and connect with
//                 local providers. Everything is designed to help you understand a place
//                 before you visit it - or even from wherever you are.
//               </p>

//               <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
//                 <Link href={ROUTES.feed}>
//                   <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
//                     Explore Experiences
//                   </Button>
//                 </Link>

//                 <Link href={ROUTES.register}>
//                   <Button className="w-full sm:w-auto bg-white text-green-600 border border-green-200 hover:bg-green-50 shadow-sm">
//                     Become a Provider
//                   </Button>
//                 </Link>
//               </div>
//             </div>

//             <div className="flex justify-center">
//               <Mountains size={140} className="sm:size-[180px] text-green-500 opacity-80" />
//             </div>
//           </div>
//         </PageContainer>
//       </FullWidthSection>

//       {/* STATS + MESSAGE */}
//       <FullWidthSection className="py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
//         <PageContainer>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//             {/* TEXT */}
//             <div className="space-y-6">
//               <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
//                 Listen, explore, and connect with culture in a new way
//               </h2>

//               <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
//                 From live experiences to recorded cultural moments, the platform brings
//                 together travelers and local communities in one place. You can browse,
//                 watch, and decide what to experience before you even arrive.
//               </p>

//               <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
//                 Whether you&apos;re planning a trip or just curious, everything here is built
//                 to help you discover authentic experiences and meaningful connections.
//               </p>
//             </div>

//             {/* STATS */}
//             <div className="grid grid-cols-2 gap-6">
//               {stats.map((stat) => {
//                 const count = useCountUp(stat.value);

//                 return (
//                   <div
//                     key={stat.label}
//                     className="p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-slate-100"
//                   >
//                     <div className="text-3xl sm:text-4xl font-bold text-orange-500">
//                       {stat.decimal
//                         ? count.toFixed(1)
//                         : Math.floor(count)}
//                       {stat.suffix || ""}
//                     </div>

//                     <div className="mt-2 text-sm sm:text-base font-semibold text-slate-800">
//                       {stat.label}
//                     </div>

//                     <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
//                       {stat.label === "Cultural Sites" &&
//                         "Places available to explore physically or digitally."}
//                       {stat.label === "Local Providers" &&
//                         "People sharing authentic cultural knowledge and services."}
//                       {stat.label === "Experiences" &&
//                         "Recorded and live cultural moments you can watch anytime."}
//                       {stat.label === "Community Rating" &&
//                         "Feedback reflecting trust and quality of experiences."}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </PageContainer>
//       </FullWidthSection>

//       {/* VIDEO SECTION */}
//       <FullWidthSection className="py-16 sm:py-24 bg-white">
//         <PageContainer>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//             {/* TEXT */}
//             <div>
//               <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
//                 See what cultural experiences look like
//               </h2>

//               <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
//                 This video represents the kind of content you’ll find on the platform
//                 Cultural events, traditions, and real-life moments captured by providers
                
//               </p>

//               <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
//                 It’s not just about watching - it’s about discovering, connecting, and
//                 preparing for real-world experiences
//               </p>
//             </div>

//             {/* VIDEO */}
//             <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-100">
//               <iframe
//                 className="w-full h-full"
//                 src="https://www.youtube.com/embed/hjqu8P7XvGQ"
//                 title="Cultural Experience"
//                 allowFullScreen
//               />
//             </div>
//           </div>
//         </PageContainer>
//       </FullWidthSection>

//       {/* FINAL CTA */}
//       <FullWidthSection className="py-16 sm:py-24 bg-slate-50">
//         <PageContainer>
//           <div className="max-w-2xl mx-auto text-center">
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
//               Ready to explore culture in a more meaningful way?
//             </h2>

//             <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
//               Whether you&apos;re discovering experiences or sharing them, this platform
//               connects people through culture, stories, and real moments
//             </p>

//             <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
//               <Link href={ROUTES.feed}>
//                 <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
//                   Start Exploring
//                 </Button>
//               </Link>

//               <Link href={ROUTES.register}>
//                 <Button className="w-full sm:w-auto bg-white text-green-600 border border-green-200 hover:bg-green-50 shadow-sm">
//                   Join as Provider
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </PageContainer>
//       </FullWidthSection>
//     </main>
//   );
// }