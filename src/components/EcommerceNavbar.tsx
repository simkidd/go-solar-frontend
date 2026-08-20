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
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import CartSheet from "@/app/(ecommerce)/components/shop/CartSheet";
import SearchModal from "./SearchModal";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategoryTreeQuery } from "@/hooks/queries/useCategoriesQuery";
import { useAnnouncementQuery } from "@/hooks/queries/useAnnouncementQuery";

const EcommerceNavbar = () => {
  const { isAuthenticated, user, logout } = useSession();
  const pathname = usePathname();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategoryMobile, setActiveCategoryMobile] = useState<any | null>(
    null,
  );

  // Fetch Categories Tree dynamically from Backend
  const { data: categoryTree = [] } = useCategoryTreeQuery();

  // Fetch active announcement banner
  const { data: announcementData } = useAnnouncementQuery();

  // Close mobile drawer and reset category explorer on route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setActiveCategoryMobile(null);
  }, [pathname]);

  // Reset category explorer when drawer is closed
  useEffect(() => {
    if (!showMobileMenu) {
      setActiveCategoryMobile(null);
    }
  }, [showMobileMenu]);

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
        {/* ── Top Announcement Bar ── */}
        {announcementData?.announcement?.isActive && (
          <div className="w-full bg-primary/10 dark:bg-primary/20 border-b border-primary/10 py-2.5 text-[10.5px] font-black uppercase tracking-wider text-primary select-none overflow-hidden">
            <div className="w-full overflow-hidden whitespace-nowrap">
              <div className="animate-marquee">
                {announcementData.announcement.link ? (
                  <Link
                    href={announcementData.announcement.link}
                    className="hover:underline flex items-center gap-2"
                  >
                    <span>{announcementData.announcement.text}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-2">
                    {announcementData.announcement.text}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

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
              <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white mt-2">
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
                <span className="text-muted-foreground/50 flex-1 truncate font-medium">
                  Search solar panels, inverters, batteries...
                </span>
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
                  <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border/80 hover:border-primary/40 hover:bg-muted/60 transition-all duration-200 cursor-pointer group outline-none">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {user?.firstname?.[0]?.toUpperCase() ?? (
                          <User className="h-3 w-3" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground truncate max-w-[80px] hidden xl:block">
                      {user?.firstname ?? "Account"}
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors hidden xl:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 p-0 overflow-hidden shadow-xl border border-border/60"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3.5 bg-gradient-to-br from-primary/5 to-transparent border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {user?.firstname?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate text-foreground leading-tight">
                          {user ? `${user.firstname} ${user.lastname}` : ""}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {user?.email}
                        </p>
                        {(user?.isAdmin || user?.isSuperAdmin) && (
                          <Badge
                            variant="outline"
                            className="mt-1.5 text-[9px] font-bold px-1.5 py-0 h-4 border-primary/30 bg-primary/5 text-primary"
                          >
                            <ShieldCheck className="h-2.5 w-2.5 mr-1" />
                            {user?.isSuperAdmin ? "Super Admin" : "Admin"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1.5">
                    {(user?.isAdmin || user?.isSuperAdmin) && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard"
                          className="cursor-pointer flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-foreground hover:text-primary"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/account/profile"
                        className="cursor-pointer flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-foreground hover:text-primary"
                      >
                        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/account/orders"
                        className="cursor-pointer flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-foreground hover:text-primary"
                      >
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="my-0" />

                  {/* Logout */}
                  <div className="py-1.5">
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="cursor-pointer flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 focus:text-rose-600 focus:bg-rose-50/60 dark:focus:bg-rose-950/20"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </DropdownMenuItem>
                  </div>
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
        <div className="w-full bg-zinc-50/50 dark:bg-zinc-900/10 border-t border-border/60 py-2 hidden lg:block">
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
                  <div className="px-6 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {!activeCategoryMobile ? (
                        <motion.div
                          key="main-menu"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -20, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-1"
                        >
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
                            const hasSubs =
                              category.subcategories &&
                              category.subcategories.length > 0;

                            if (hasSubs) {
                              return (
                                <button
                                  key={category._id}
                                  onClick={() =>
                                    setActiveCategoryMobile(category)
                                  }
                                  className="w-full text-left flex items-center justify-between py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-zinc-650 hover:text-zinc-900 dark:text-zinc-350 dark:hover:text-white cursor-pointer"
                                >
                                  <span>{category.name}</span>
                                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-primary transition-colors" />
                                </button>
                              );
                            }

                            return (
                              <Link
                                key={category._id}
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
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sub-menu"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 20, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-2"
                        >
                          {/* Back Button */}
                          <button
                            onClick={() => setActiveCategoryMobile(null)}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors pb-3 border-b border-border/60 w-full mb-3 cursor-pointer"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span>Go Back</span>
                          </button>

                          <div className="pb-1 select-none">
                            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                              Category
                            </span>
                            <h4 className="text-base font-extrabold text-foreground tracking-tight leading-tight uppercase Outfit">
                              {activeCategoryMobile.name}
                            </h4>
                          </div>

                          <Link
                            href={`/${activeCategoryMobile.slug}/products`}
                            onClick={() => setShowMobileMenu(false)}
                            className="block py-2.5 text-xs font-black uppercase tracking-wider text-primary hover:underline"
                          >
                            View All {activeCategoryMobile.name} →
                          </Link>

                          <div className="pt-2 space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                              Subcategories
                            </p>
                            {activeCategoryMobile.subcategories.map(
                              (sub: any) => {
                                const subHref = `/${sub.slug}/products`;
                                const subActive = pathname === subHref;
                                return (
                                  <Link
                                    key={sub._id}
                                    href={subHref}
                                    onClick={() => setShowMobileMenu(false)}
                                    className={`block py-2.5 text-sm font-bold border-b border-border/40 transition-colors ${
                                      subActive
                                        ? "text-primary border-primary/10 pl-1"
                                        : "text-zinc-650 hover:text-foreground dark:text-zinc-350 dark:hover:text-white"
                                    }`}
                                  >
                                    {sub.name}
                                  </Link>
                                );
                              },
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
