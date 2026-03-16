

// import { CulturalHeroSplit } from "@/src/features/home/cultural-hero-slider";
// import { CulturalHeroSplit } from "@/src/features/home/cultural-hero-slider";

// export default function WelcomePage() {
//   return <CulturalHeroSplit />;
// }


















import Link from "next/link";
import { Compass, Mountain, Sparkles, Users } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { PageContainer } from "@/src/components/layout/page-container";
import { ROUTES } from "@/src/constants/routes";
import { CulturalHeroSlider } from "@/src/features/home/cultural-hero-slider";
// import { CulturalHeroSplit } from "@/src/features/home/cultural-hero-slider";


export default function WelcomePage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50/70 py-6 sm:py-8">
        <PageContainer>
          <CulturalHeroSlider />
          {/* <CulturalHeroSplit /> */}
        </PageContainer>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <PageContainer>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <Sparkles className="h-4 w-4" />
              Built for discovery, connection, and booking
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Explore culture through stories, destinations, and bookable experiences
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Discover authentic cultural experiences before login, then continue into
              deeper engagement through bookings, provider profiles, and curated tourism packages.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <Compass className="h-6 w-6 text-slate-900" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Public discovery
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Let visitors explore experiences before creating an account.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <Users className="h-6 w-6 text-slate-900" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Cultural connection
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Bring local stories, traditions, and communities closer to travelers.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <Mountain className="h-6 w-6 text-slate-900" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Rich tourism packages
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Move from interest to real booking through curated package offerings.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <Sparkles className="h-6 w-6 text-slate-900" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Digital cultural storytelling
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Help providers showcase cultural value through beautiful visual content.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={ROUTES.feed}>
              <Button>Start Exploring</Button>
            </Link>

            <Link href={ROUTES.register}>
              <Button variant="secondary">Join the Platform</Button>
            </Link>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}







































































































// // import Link from "next/link";
// // import { ArrowRight, Compass, Mountain, Sparkles } from "lucide-react";

// // import { Button } from "@/src/components/ui/button";
// // import { PageContainer } from "@/src/components/layout/page-container";
// // import { ROUTES } from "@/src/constants/routes";

// // export default function WelcomePage() {
// //   return (
// //     <main className="bg-white">
// //       <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
// //         <PageContainer className="py-16 sm:py-20 lg:py-28">
// //           <div className="mx-auto max-w-4xl text-center">
// //             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
// //               <Sparkles className="h-4 w-4" />
// //               Discover authentic cultural tourism experiences
// //             </div>

// //             <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
// //               Explore culture through real stories, destinations, and experiences
// //             </h1>

// //             <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
// //               Browse cultural experiences, discover heritage destinations, and connect
// //               with providers offering memorable tourism packages.
// //             </p>

// //             <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
// //               <Link href={ROUTES.feed}>
// //                 <Button className="gap-2">
// //                   Explore Feed
// //                   <ArrowRight className="h-4 w-4" />
// //                 </Button>
// //               </Link>

// //               <Link href={ROUTES.register}>
// //                 <Button variant="secondary">Create Account</Button>
// //               </Link>
// //             </div>
// //           </div>
// //         </PageContainer>
// //       </section>

// //       <section className="py-12 sm:py-16">
// //         <PageContainer>
// //           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
// //             <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //               <Compass className="h-6 w-6 text-slate-900" />
// //               <h2 className="mt-4 text-lg font-semibold text-slate-900">
// //                 Discover experiences
// //               </h2>
// //               <p className="mt-2 text-sm leading-6 text-slate-600">
// //                 Explore visual cultural stories and public experiences before creating an account.
// //               </p>
// //             </div>

// //             <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //               <Mountain className="h-6 w-6 text-slate-900" />
// //               <h2 className="mt-4 text-lg font-semibold text-slate-900">
// //                 Book curated packages
// //               </h2>
// //               <p className="mt-2 text-sm leading-6 text-slate-600">
// //                 Move from discovery to real tourism packages created by cultural service providers.
// //               </p>
// //             </div>

// //             <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
// //               <Sparkles className="h-6 w-6 text-slate-900" />
// //               <h2 className="mt-4 text-lg font-semibold text-slate-900">
// //                 Share culture digitally
// //               </h2>
// //               <p className="mt-2 text-sm leading-6 text-slate-600">
// //                 Providers can showcase authentic cultural destinations and experiences through rich content.
// //               </p>
// //             </div>
// //           </div>
// //         </PageContainer>
// //       </section>
// //     </main>
// //   );
// // }