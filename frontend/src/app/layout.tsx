
// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { AppQueryProvider } from "@/src/lib/query/provider";
import { AuthRequiredModal } from "@/src/components/shared/auth-required-modal";
import { ToastContainer } from "@/src/components/shared/toast-container";
import { LanguageProvider } from "@/src/components/providers/language-provider";

export const metadata: Metadata = {
  title: "CulturalHub",
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
          <LanguageProvider>
            {children}
            <AuthRequiredModal />
            <ToastContainer />
          </LanguageProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}



