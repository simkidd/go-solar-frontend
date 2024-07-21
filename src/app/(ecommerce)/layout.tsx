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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `Shop | ${config.SITE_NAME}`,
    template: "%s | Go Solar",
  },
  metadataBase: new URL(config.SITE_URL),
  description: config.SITE_DESCRIPTION,
  keywords: [],
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
      </body>
    </html>
  );
}
