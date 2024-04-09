import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.scss";
import { Providers } from "../providers";
import Navbar from "@/components/Navbar";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/Footer";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default:
      "Go Solar | Affordable Solar Panels and Renewable Energy Solutions",
    template: "%s | Go Solar",
  },
  description:
    "Discover affordable solar panels, installation services, and renewable energy solutions tailored to your needs. Go solar today for sustainable energy and savings",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader
          color="#9dc900"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
