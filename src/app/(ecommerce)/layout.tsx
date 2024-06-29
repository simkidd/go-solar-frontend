import Footer from "@/components/Footer";
import HeaderShop from "@/app/(ecommerce)/components/HeaderShop";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import "../globals.scss";
import { Providers } from "../providers";
import LoadingSpinner from "@/components/LoadingSpinner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shop | GoSolar",
  description: "Affordable Solar products and services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader
          color="#08AA08"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <Providers>
          <Suspense fallback={<LoadingSpinner />}>
            <HeaderShop />
            <main className="min-h-[70dvh]">{children}</main>
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
