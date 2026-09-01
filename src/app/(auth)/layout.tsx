import Logo from "@/components/Logo";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import NextTopLoader from "nextjs-toploader";
import "../globals.css";
import { Providers } from "../providers";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowLeft } from "lucide-react";
import AuthHeroPanel from "@/app/(auth)/components/AuthHeroPanel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Go Solar",
    default: "Go Solar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 antialiased`}
      >
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
            <div className="w-full min-h-dvh grid grid-cols-1 lg:grid-cols-12 overflow-x-hidden font-inter bg-zinc-50 dark:bg-zinc-950">
              {/* Left Pane - Interactive Form Container */}
              <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-12 md:p-16 lg:p-10 xl:p-16 relative overflow-y-auto min-h-dvh">
                {/* Background soft glowing accent */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/5 to-transparent pointer-events-none z-0" />

                {/* Header Actions */}
                <div className="flex items-center justify-between w-full mb-8 relative z-10">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Home
                  </Link>

                  <div className="lg:hidden">
                    <Logo size="sm" />
                  </div>
                </div>

                {/* Form wrapper with premium card container */}
                <div className="w-full max-w-md mx-auto my-auto py-6 relative z-10">
                  <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/60 rounded-2xl p-6 sm:p-8 shadow-xl shadow-zinc-200/5 dark:shadow-none">
                    {children}
                  </div>
                </div>

                {/* Footer disclaimer */}
                <div className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-8 relative z-10">
                  &copy; {new Date().getFullYear()} GoSolar. All rights
                  reserved.
                </div>
              </div>

              {/* Right Pane - Environmental Fact / Interactive Sliding Panel */}
              <AuthHeroPanel />
            </div>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
