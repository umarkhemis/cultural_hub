
import "./globals.css";
import type { Metadata } from "next";
import { AppQueryProvider } from "@/src/lib/query/provider";
import { AuthRequiredModal } from "@/src/components/shared/auth-required-modal";
import { ToastContainer } from "@/src/components/shared/toast-container";

export const metadata: Metadata = {
  title: "Cultural Hub",
  description: "Discover and book cultural tourism experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppQueryProvider>
          {children}
          <AuthRequiredModal />
          <ToastContainer />
        </AppQueryProvider>
      </body>
    </html>
  );
}




























// import "./globals.css";
// import type { Metadata } from "next";
// import { AppQueryProvider } from "@/src/lib/query/provider";
// import { AuthRequiredModal } from "@/src/components/shared/auth-required-modal";

// export const metadata: Metadata = {
//   title: "Cultural Tourism Platform",
//   description: "Discover and book cultural tourism experiences.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>
//         <AppQueryProvider>
//           {children}
//           <AuthRequiredModal />
//         </AppQueryProvider>
//       </body>
//     </html>
//   );
// }