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
  Sparkles,
  ChevronDown,
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
import SearchModal from "./SearchModal";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategoryTreeQuery } from "@/hooks/queries/useCategoriesQuery";

const EcommerceNavbar = () => {
  const { isAuthenticated, user, logout } = useSession();
  const pathname = usePathname();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch Categories Tree dynamically from Backend
  const { data: categoryTree = [] } = useCategoryTreeQuery();

  // Close mobile drawer on route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

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

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />

      <header className="w-full bg-white dark:bg-zinc-950 border-b border-border/80 sticky top-0 z-50 font-inter">
        {/* ── Top Announcement & Utility Bar ── */}
        <div className="w-full bg-primary/10 dark:bg-primary/20 border-b border-primary/10 py-2 text-[10px] font-bold text-primary select-none hidden md:block">
          <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">PROMO</span>
              <span>⚡ Free Shipping on Orders Over ₦2,500,000!</span>
            </div>
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-wider">
              <span className="cursor-pointer hover:text-primary transition-colors">English</span>
              <span className="cursor-pointer hover:text-primary transition-colors">NGN (₦)</span>
              <span className="opacity-30">|</span>
              <span className="cursor-pointer hover:text-primary transition-colors">Help Center</span>
              <span className="cursor-pointer hover:text-primary transition-colors">Support: +234-800-GOSOLAR</span>
            </div>
          </div>
        </div>

        {/* ── Top Utility Header Bar ── */}
        <div className="container mx-auto px-4 lg:px-6 py-4 grid grid-cols-3 items-center lg:flex lg:justify-between lg:gap-8">
          {/* Col 1 (Mobile Left): Animated Hamburger Toggle Button */}
          <div className="flex items-center justify-start lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground flex items-center justify-center h-10 w-10 z-50 cursor-pointer"
              aria-label="Toggle Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span
                  className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${
                    showMobileMenu
                      ? "rotate-45 translate-x-[3px] -translate-y-[1px]"
                      : ""
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    showMobileMenu ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${
                    showMobileMenu
                      ? "-rotate-45 translate-x-[3px] translate-y-[1px]"
                      : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Col 2 (Mobile Center / Desktop Left): Brand Logo */}
          <div className="flex items-center justify-center lg:justify-start lg:flex-none">
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 select-none group"
            >
              <Image
                src={LogoIcon}
                alt="logo"
                width={34}
                height={34}
                className="object-contain group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white">
                Go<span className="text-primary">Solar</span>
              </span>
            </Link>
          </div>

          {/* Col 3 (Mobile Right): Cart Icon Shortcut */}
          <div className="flex items-center justify-end lg:hidden">
            <CartSheet />
          </div>

          {/* Desktop Center: Redesigned SolarWest-Style Search Bar */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-xl mx-auto">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center bg-zinc-50 dark:bg-zinc-900/40 border border-border/80 hover:border-primary/30 rounded-full text-xs text-muted-foreground w-full cursor-pointer transition-all duration-200 select-none outline-none h-10 p-0 overflow-hidden shadow-xs"
            >
              <div className="px-4 py-2 border-r border-border/60 font-bold text-foreground/80 flex items-center gap-1 hover:text-primary transition-colors shrink-0 text-[10px] uppercase tracking-wider">
                <span>All Categories</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </div>
              <div className="flex items-center gap-2 px-4 flex-1 text-left">
                <Search className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <span className="text-muted-foreground/50 flex-1 truncate font-medium">Search solar panels, inverters, batteries...</span>
              </div>
              <div className="bg-primary text-white hover:bg-primary/90 h-full px-5 flex items-center justify-center font-black uppercase tracking-widest text-[9px] transition-colors shrink-0">
                Search
              </div>
            </button>
          </div>

          {/* Desktop Right: Utility Actions (Wishlist, Cart, Profile) */}
          <div className="hidden lg:flex items-center justify-end gap-3 select-none">
            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <Heart className="h-4 w-4" />
            </Button>

            {/* Shopping Cart count */}
            <CartSheet />

            {/* Account Profile / Login Button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2 border-b border-border/60">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {user ? `${user.firstname} ${user.lastname}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
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
                <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* ── Bottom Sub-navigation list ── */}
        <div className="w-full bg-zinc-50/50 dark:bg-zinc-900/10 border-t border-border/60 py-2">
          <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">
            {/* Dynamic Categories Link Pills */}
            <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth mr-6">
              <Link
                href="/shop"
                className={`text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-colors px-3 py-1.5 rounded-full ${
                  pathname === "/shop"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                All Products
              </Link>

              {categoryTree.map((category) => {
                const href = `/${category.slug}/products`;
                const active = pathname === href || pathname.startsWith(href);

                // If Category has subcategories, wrap in a dropdown trigger
                if (
                  category.subcategories &&
                  category.subcategories.length > 0
                ) {
                  return (
                    <DropdownMenu key={category._id}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-colors px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer outline-none ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                          }`}
                        >
                          {category.name}
                          <ChevronDown className="h-3 w-3 opacity-60" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link
                            href={href}
                            className="cursor-pointer font-bold text-xs"
                          >
                            View All {category.name}
                          </Link>
                        </DropdownMenuItem>
                        {category.subcategories.map((sub) => (
                          <DropdownMenuItem key={sub._id} asChild>
                            <Link
                              href={`/${sub.slug}/products`}
                              className="cursor-pointer text-xs"
                            >
                              {sub.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }

                return (
                  <Link
                    key={category._id}
                    href={href}
                    className={`text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-colors px-3 py-1.5 rounded-full ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>

            {/* Quick Toggle Switcher (Packages / Products) */}
            <div className="hidden sm:flex items-center gap-1 bg-muted/65 p-1 rounded-full border border-border/60 font-inter">
              <Link href="/packages">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200 select-none cursor-pointer block ${
                    pathname === "/packages" || pathname.startsWith("/packages")
                      ? "bg-primary text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Packages
                </span>
              </Link>
              <Link href="/products">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200 select-none cursor-pointer block ${
                    pathname === "/products" || pathname.startsWith("/products")
                      ? "bg-primary text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Products
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mobile Side Drawer panel ── */}
        <AnimatePresence>
          {showMobileMenu && (
            <div className="fixed inset-0 z-40 lg:hidden flex justify-start">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileMenu(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              />

              {/* Slider Drawer Content */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative w-4/5 max-w-sm bg-white dark:bg-zinc-950 border-r border-border/80 h-full py-6 flex flex-col justify-between shadow-2xl overflow-hidden"
              >
                {/* Fixed Drawer Header */}
                <div className="flex items-center mb-6 select-none pl-16 pr-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Image src={LogoIcon} alt="logo" width={32} height={32} />
                    <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white">
                      Go<span className="text-primary">Solar</span>
                    </span>
                  </Link>
                </div>

                {/* Scrollable links list */}
                <ScrollArea className="flex-1 my-4">
                  {/* User Profile Info on Mobile */}
                  {isAuthenticated && (
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/45 border border-border rounded-2xl mb-6 flex items-center gap-3 mx-6 select-none">
                      <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {user?.firstname
                          ? user.firstname[0].toUpperCase()
                          : "U"}
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="font-extrabold text-xs text-zinc-900 dark:text-white leading-snug truncate">
                          {user?.firstname} {user?.lastname}
                        </h5>
                        <p className="text-[9px] text-muted-foreground lowercase leading-none truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mobile Search Button */}
                  <div className="px-6 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMobileMenu(false);
                        setIsSearchOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-border text-xs font-semibold text-zinc-500 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-zinc-400" />
                        Search store...
                      </span>
                    </button>
                  </div>

                  {/* Navigation Links list */}
                  <div className="space-y-1 px-6">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                      Shop Categories
                    </p>
                    <Link
                      href="/shop"
                      onClick={() => setShowMobileMenu(false)}
                      className={`block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 transition-colors ${
                        pathname === "/shop"
                          ? "text-primary border-primary/20"
                          : "text-zinc-650 hover:text-zinc-900 dark:text-zinc-350"
                      }`}
                    >
                      All Products
                    </Link>
                    {categoryTree.map((category) => {
                      const href = `/${category.slug}/products`;
                      const active = pathname === href;
                      return (
                        <div key={category._id} className="space-y-1">
                          <Link
                            href={href}
                            onClick={() => setShowMobileMenu(false)}
                            className={`block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 transition-colors ${
                              active
                                ? "text-primary border-primary/20"
                                : "text-zinc-650 hover:text-zinc-900 dark:text-zinc-350 dark:hover:text-white"
                            }`}
                          >
                            {category.name}
                          </Link>
                          {/* List subcategories on mobile cleanly inside category block */}
                          {category.subcategories &&
                            category.subcategories.length > 0 && (
                              <div className="pl-4 py-1 space-y-2 border-l border-border/60 ml-1">
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub._id}
                                    href={`/${sub.slug}/products`}
                                    onClick={() => setShowMobileMenu(false)}
                                    className="block py-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      );
                    })}

                    {/* Authenticated user menu list on mobile */}
                    {isAuthenticated ? (
                      <>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pt-5 pb-2">
                          My Account
                        </p>
                        {(user?.isAdmin || user?.isSuperAdmin) && (
                          <Link
                            href="/dashboard"
                            onClick={() => setShowMobileMenu(false)}
                            className="block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-zinc-650 hover:text-zinc-900 dark:text-zinc-350"
                          >
                            Dashboard
                          </Link>
                        )}
                        <Link
                          href="/account/profile"
                          onClick={() => setShowMobileMenu(false)}
                          className="block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-zinc-650 hover:text-zinc-900 dark:text-zinc-350"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setShowMobileMenu(false)}
                          className="block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-zinc-650 hover:text-zinc-900 dark:text-zinc-350"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            setShowMobileMenu(false);
                            logout();
                          }}
                          className="w-full text-left block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-rose-500 hover:text-rose-600 cursor-pointer"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/login"
                        onClick={() => setShowMobileMenu(false)}
                        className="block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-zinc-650 hover:text-primary dark:text-zinc-350"
                      >
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                </ScrollArea>

                {/* Fixed Drawer Bottom */}
                <div className="space-y-3 pt-4 border-t border-border/60 px-6">
                  <Link
                    href="/energy-calculator"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full"
                  >
                    <Button className="w-full bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-[10px] uppercase tracking-widest h-10 rounded-full cursor-pointer flex items-center justify-center gap-1.5 shadow-xs">
                      <Sparkles className="h-3.5 w-3.5" />
                      Solar Calculator
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default EcommerceNavbar;
