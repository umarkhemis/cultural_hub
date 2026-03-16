
import { PublicFooter } from "@/src/components/layout/public-footer";
import { PublicNavbar } from "@/src/components/layout/public-navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNavbar />
      {children}
      <PublicFooter />
    </div>
  );
}