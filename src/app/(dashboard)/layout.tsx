import LoadingSpinner from "@/components/LoadingSpinner";
import DashboardLayout from "@/layouts/DashboardLayout";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import "../globals.scss";
import { Providers } from "../providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
            <DashboardLayout>{children}</DashboardLayout>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
