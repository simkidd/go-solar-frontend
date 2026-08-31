"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Package } from "lucide-react";

export default function ShopNavigationSwitch() {
  const pathname = usePathname();

  const isPackages = pathname.startsWith("/packages");
  const isProducts =
    pathname === "/products" || pathname.startsWith("/products");

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900/40 p-0.5 rounded-full flex gap-0.5 items-center border border-border/60 h-9 shrink-0">
      <Link
        href="/products"
        className={`flex items-center justify-center gap-1.5 h-full px-3 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 select-none ${
          isProducts
            ? "bg-[#08AA08] text-white shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ShoppingBag className="h-3 w-3" />
        <span>Products</span>
      </Link>
      <Link
        href="/packages"
        className={`flex items-center justify-center gap-1.5 h-full px-3 text-[9px] font-black uppercase tracking-wider rounded-full transition-all duration-300 select-none ${
          isPackages
            ? "bg-[#08AA08] text-white shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Package className="h-3 w-3" />
        <span>Packages</span>
      </Link>
    </div>
  );
}
