"use client";
import React, { useState, useEffect } from "react";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import { useSession } from "@/context/SessionContext";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartSheet from "@/app/(ecommerce)/components/shop/CartSheet";
import { ThemeSwitcher } from "./ThemeSwitcher";
import SearchModal from "./SearchModal";

const EcommerceNavbar = () => {
  const { isAuthenticated, user, logout } = useSession();
  const pathname = usePathname();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcut (⌘K / Ctrl+K) to open Search Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sublinks = [
    { label: "All Products", href: "/shop" },
    { label: "Solar Panels", href: "/solar-panels/products" },
    { label: "Batteries", href: "/solar-batteries/products" },
    { label: "Inverters", href: "/solar-inverters/products" },
    { label: "Solar Kits", href: "/solar-kits/products" },
  ];

  return (
    <>
      <SearchModal
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
      />

      <header className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-900 sticky top-0 z-50 font-inter">
        {/* Top Utility Header Bar */}
        <div className="container mx-auto px-4 lg:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Mobile menu trigger & Brand Logo */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full h-9 w-9 bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src={LogoIcon}
                alt="logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white">
                Go<span className="text-primary">Solar</span>
              </span>
            </Link>
          </div>

          {/* Center / Right: Search button & Shopping Utilities */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Icon Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            </Button>

            {/* Theme Toggle */}
            <ThemeSwitcher />

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
            >
              <Heart className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            </Button>

            {/* Shopping Cart count (Opens Sheet) */}
            <CartSheet />

            {/* Account Profile / Login Button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
                  >
                    <User className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-semibold truncate text-zinc-850 dark:text-zinc-200">
                      {user ? `${user.firstname} ${user.lastname}` : ""}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  {(user?.isAdmin || user?.isSuperAdmin) && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile" className="cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="cursor-pointer">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-rose-600 focus:text-rose-600 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-xl px-4 py-2 text-xs font-semibold">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Sub-navigation list */}
        <div className="w-full bg-zinc-50/50 dark:bg-zinc-900/10 border-t border-zinc-100 dark:border-zinc-900 py-2.5">
          <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">
            {/* Categories/Types filters */}
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
              {sublinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold whitespace-nowrap transition-colors ${
                    pathname === link.href ||
                    (link.href !== "/shop" && pathname.startsWith(link.href))
                      ? "text-[#08AA08]"
                      : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Quick toggle selectors (Packages / Products) */}
            <div className="hidden sm:flex items-center gap-2 font-inter font-bold">
              <Link href="/packages">
                <Button
                  size={"sm"}
                  className={`text-[11px] border ${
                    pathname === "/packages" || pathname.startsWith("/packages")
                      ? "bg-[#08AA08] border-[#08AA08] text-white shadow-xs"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900"
                  }`}
                >
                  Packages
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size={"sm"}
                  className={`text-[11px] border ${
                    pathname === "/products" || pathname.startsWith("/products")
                      ? "bg-[#08AA08] border-[#08AA08] text-white shadow-xs"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900"
                  }`}
                >
                  Products
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Drawer panel */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              onClick={() => setShowMobileMenu(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <div className="relative w-4/5 max-w-xs bg-white dark:bg-zinc-950 h-full p-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Image src={LogoIcon} alt="logo" width={28} height={28} />
                    <span className="font-bold text-lg dark:text-white">
                      Go<span className="text-primary">Solar</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Search Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-500"
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-zinc-400" />
                    Search store...
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Tap to search</span>
                </button>

                {/* Links */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Shop Menu
                  </p>
                  {sublinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setShowMobileMenu(false)}
                      className="block text-sm font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                {isAuthenticated && (
                  <Link
                    href="/account/orders"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Orders
                  </Link>
                )}
                <Link
                  href="/energy-calculator"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#08AA08]"
                >
                  <Sparkles className="h-4 w-4" />
                  Solar Calculator
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default EcommerceNavbar;
