"use client";
import React from "react";
import { usePathname } from "next/navigation";
import HeaderShop from "@/app/(ecommerce)/components/shop/HeaderShop";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { ShieldCheck, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");

  if (isCheckout) {
    return (
      <>
        {/* Minimal Header */}
        <header className="w-full bg-white dark:bg-zinc-950 border-b border-border/80 sticky top-0 z-50 font-inter py-4 ">
          <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <Logo
                href="/cart"
                size="sm"
                iconClassName="group-hover:rotate-0"
              />
            </div>

            {/* Middle Title */}
            <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <ShieldCheck className="h-4 w-4 text-[#08AA08]" />
              <span className="text-xs font-black uppercase tracking-wider">
                Secure Checkout
              </span>
            </div>

            {/* Back to Cart Link */}
            <div>
              <Link
                href="/cart"
                className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors flex items-center gap-1 hover:underline"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Back to Cart
              </Link>
            </div>
          </div>
        </header>

        {/* Checkout Main Content */}
        <main className="min-h-[calc(100dvh-135px)] bg-zinc-50/10 dark:bg-zinc-950/5">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="w-full py-6 border-t border-border/85 bg-white dark:bg-zinc-950 text-center  text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold font-inter">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} GoSolar. All rights reserved.</p>
            <div className="flex items-center gap-4 text-zinc-450 dark:text-zinc-600">
              <span className="hover:underline cursor-pointer">
                Terms & Conditions
              </span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </div>
          </div>
        </footer>
      </>
    );
  }

  // Normal Layout
  return (
    <>
      <HeaderShop />
      <main className="min-h-[70dvh]">{children}</main>
      <Footer />
    </>
  );
}
