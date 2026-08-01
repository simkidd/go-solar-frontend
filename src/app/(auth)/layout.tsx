import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import NextTopLoader from "nextjs-toploader";
import "../globals.css";
import { Providers } from "../providers";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ArrowLeft } from "lucide-react";

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
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950`}>
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
            <div className="w-full min-h-dvh grid grid-cols-1 lg:grid-cols-12 overflow-hidden font-inter">
              
              {/* Left Pane - Interactive Form Container */}
              <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-between bg-white dark:bg-zinc-950 p-8 sm:p-12 md:p-16 lg:p-12 xl:p-16 relative">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between w-full mb-10">
                  <Link 
                    href="/" 
                    className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Link>

                  <Link href="/" className="flex items-center gap-2 lg:hidden">
                    <Image src={LogoIcon} alt="logo" width={32} height={32} />
                    <span className="font-bold text-lg text-zinc-900 dark:text-white">Go<span className="text-primary">Solar</span></span>
                  </Link>
                </div>

                {/* Form wrapper */}
                <div className="w-full max-w-md mx-auto my-auto py-8">
                  {children}
                </div>

                {/* Footer disclaimer */}
                <div className="text-center text-xs text-zinc-400 mt-10">
                  &copy; {new Date().getFullYear()} GoSolar. All rights reserved.
                </div>
              </div>

              {/* Right Pane - Environmental Fact / Brand Gradient Banner */}
              <div className="hidden lg:flex col-span-6 xl:col-span-7 bg-gradient-to-tr from-[#065f46] via-[#08AA08] to-[#10b981] p-16 flex-col justify-between text-white relative overflow-hidden">
                {/* Decorative glowing grid circles */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-40" />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-900/40 rounded-full blur-3xl pointer-events-none" />

                {/* Brand Identifier */}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <Image src={LogoIcon} alt="logo" width={28} height={28} />
                  </div>
                  <span className="font-bold text-2xl tracking-tight">
                    Go<span className="text-emerald-100">Solar</span>
                  </span>
                </div>

                {/* Middle - Major Brand Message */}
                <div className="relative z-10 max-w-lg space-y-4">
                  <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Clean Energy Initiative
                  </span>
                  <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight text-white tracking-tight drop-shadow-sm">
                    Powering Nigeria with Reliable, Affordable Solar
                  </h1>
                  <p className="text-emerald-50 text-base leading-relaxed">
                    Join thousands of homeowners and commercial businesses switching to modern solar power, saving up to 75% on electricity costs every single month.
                  </p>
                </div>

                {/* Bottom - Solar Fact Card */}
                <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-md">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-2">Solar Fact</h4>
                  <p className="text-sm font-medium leading-relaxed">
                    Did you know? Nigeria receives an average of 6 hours of peak sunlight daily. Harnessing just a fraction of this potential can completely offset your dependence on diesel and grid outages!
                  </p>
                </div>

              </div>

            </div>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
