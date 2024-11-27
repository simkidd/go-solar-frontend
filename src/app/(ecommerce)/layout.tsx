import Footer from "@/components/Footer";
import HeaderShop from "@/app/(ecommerce)/components/HeaderShop";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import "../globals.scss";
import { Providers } from "../providers";
import LoadingSpinner from "@/components/LoadingSpinner";
import { config } from "@/utils/config";
import Hotjar from "@/utils/Hotjar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `Shop | ${config.SITE_NAME}`,
    template: "%s | Go Solar",
  },
  metadataBase: new URL(config.SITE_URL),
  description: config.SITE_DESCRIPTION,
  keywords: [
    "solar energy",
    "renewable energy",
    "green energy",
    "solar panels",
    "solar power",
    "sustainable energy",
    "solar installation",
    "solar technology",
    "clean energy",
    "solar solutions",
    "solar energy systems",
    "solar energy company",
    "solar energy benefits",
    "solar energy cost",
    "solar energy advantages",
    "solar batteries",
    "solar inverters",
    "solar panel installation",
    "solar power systems",
    "solar energy storage",
    "solar panel efficiency",
    "residential solar energy",
    "commercial solar energy",
    "off-grid solar systems",
    "grid-tied solar systems",
    "solar panel maintenance",
    "solar panel lifespan",
    "solar energy incentives",
    "solar energy tax credits",
    "solar energy financing",
    "solar energy rebates",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.SITE_URL,
    title: config.SITE_TITLE,
    description: config.SITE_DESCRIPTION,
    siteName: config.SITE_NAME,
    images: [
      {
        url: config.OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: config.SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.SITE_TITLE,
    description: config.SITE_DESCRIPTION,
    images: [config.OG_IMAGE_URL],
    creator: "@onidev",
  },
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

        <Hotjar />
      </body>
    </html>
  );
}
