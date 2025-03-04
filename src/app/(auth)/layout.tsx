import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import NextTopLoader from "nextjs-toploader";
import "../globals.scss";
import { Providers } from "../providers";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

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
          <div className="w-full min-h-dvh light bg-[#f2f2f2] dark:bg-[#2a2b2f] relative flex items-center justify-center flex-col font-dmsans py-10">
            <Link href="/" className="flex items-center gap-1">
              <Image src={LogoIcon} alt="logo" width={80} height={80} />
              {/* <span className="font-medium text-xl font-dmsans mt-2">
                GoSolar
              </span> */}
            </Link>
            <div className="w-full max-w-lg p-4 mx-auto">
              <div className="w-full light bg-white dark:bg-[#222327] shadow-lg rounded-lg">
                <div className="flex flex-col items-center py-8 px-6">
                  <div className="w-full ">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>
        </Providers>
      </body>
    </html>
  );
}
