
"use client";

import { TopNavbar } from "@/src/components/layout/top-navbar";
import { PublicFooter } from "@/src/components/layout/public-footer";

export function TouristShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TopNavbar />
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
      <PublicFooter />
    </div>
  );
}
























// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { touristNavItems } from "@/src/constants/navigation";
// import { cn } from "@/src/utils/cn";

// export function TouristShell({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       <div className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 lg:px-8">
//         {children}
//       </div>

//       <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
//         <div className="mx-auto grid max-w-3xl grid-cols-4">
//           {touristNavItems.map((item) => {
//             const active = pathname === item.href;
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={cn(
//                   "flex items-center justify-center px-2 py-4 text-sm font-medium",
//                   active ? "text-slate-900" : "text-slate-500"
//                 )}
//               >
//                 {item.label}
//               </Link>
//             );
//           })}
//         </div>
//       </nav>
//     </div>
//   );
// }