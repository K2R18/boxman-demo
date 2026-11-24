import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dark-ink.com"),
  title: "DARK-INK — Maison Paris & Logistique ERP",
  description: "Boutique officielle, Vestiaire Fétiche & Plateforme Logistique Multi-Sites",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="antialiased">
      <body className="min-h-screen flex flex-col bg-[#0B0D10] text-[#E2E4E9] overflow-x-clip w-full max-w-full">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
