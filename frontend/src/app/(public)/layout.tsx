
import { PublicFooter } from "@/src/components/layout/public-footer";
import { TopNavbar } from "@/src/components/layout/top-navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <TopNavbar />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </div>
  );
}

























// import { PublicFooter } from "@/src/components/layout/public-footer";
// import { PublicNavbar } from "@/src/components/layout/public-navbar";

// export default function PublicLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex min-h-screen flex-col bg-white text-slate-900">
//       <PublicNavbar />
//       <div className="flex-1">{children}</div>
//       <PublicFooter />
//     </div>
//   );
// }






