// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TenantProvider } from "@/context/TenantContext";
import { QuoteCartProvider } from "@/context/QuoteCartContext";
import { CompareProvider } from "@/context/CompareContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QuoteCartDrawer from "@/components/common/QuoteCartDrawer";
import FloatingActionDock from "@/components/common/FloatingActionDock";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "FrostFlow Commercial Refrigeration | Built for Business",
  description:
    "Commercial display refrigerators, deep freezers, gourmet ice makers, and walk-in cold storage rooms. Fast B2B quotation and pan-India dealer support.",
  keywords: [
    "Commercial Refrigeration",
    "Display Visi Cooler",
    "Commercial Deep Freezer",
    "Ice Cube Machine",
    "Walk-in Cold Room",
    "Bakery Display Showcase",
    "Undercounter Chiller",
    "FrostFlow Systems",
  ],
  openGraph: {
    title: "FrostFlow Commercial Refrigeration | Built for Business",
    description:
      "Commercial cooling appliances, visi-coolers, deep freezers, and cold rooms for supermarkets, restaurants, and cold chain logistics.",
    url: "https://frostflow.com",
    siteName: "FrostFlow Commercial Refrigeration",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "FrostFlow Commercial Refrigeration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F4F5F7] text-[#080B10] selection:bg-[#27C7D9] selection:text-black"
      >
        <TenantProvider>
          <QuoteCartProvider>
            <CompareProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <QuoteCartDrawer />
                <FloatingActionDock />
              </div>
            </CompareProvider>
          </QuoteCartProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
