"use client";
import React, { useState, useEffect } from "react";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import { useSession } from "@/context/SessionContext";
import { useProductStore } from "@/lib/stores/product.store";
import {
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  User,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartSheet from "@/app/(ecommerce)/components/shop/CartSheet";
import { ThemeSwitcher } from "./ThemeSwitcher";

const EcommerceNavbar = () => {
  const { isAuthenticated, user, logout } = useSession();
  const { categories, fetchCategories } = useProductStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch categories for the dropdown menu
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle Search Submit
  const handleSearchSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const sublinks = [
    { label: "All Products", href: "/shop" },
    { label: "Solar Panels", href: "/solar-panels/products" },
    { label: "Batteries", href: "/solar-batteries/products" },
    { label: "Inverters", href: "/solar-inverters/products" },
    { label: "Solar Kits", href: "/solar-kits/products" },
  ];

  return (
    <header className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-900 sticky top-0 z-50 font-inter">
      {/* Top Utility Header Bar */}
      <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-full h-9 w-9 bg-zinc-50 border dark:bg-zinc-900"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src={LogoIcon}
            alt="logo"
            width={38}
            height={38}
            className="object-contain"
          />
          <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            Go<span className="text-primary">Solar</span>
          </span>
        </Link>

        {/* Categories Dropdown & Central Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-2xl gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-semibold flex items-center gap-2 rounded-xl h-11 shrink-0 px-4">
                <Menu className="h-4 w-4" />
                Categories
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat._id} asChild>
                  <Link
                    href={`/${cat.slug}/products`}
                    className="cursor-pointer"
                  >
                    {cat.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Autocomplete Search input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Input
              type="text"
              placeholder="Search solar panels, battery, inverters, packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-4 pr-10 rounded-xl bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 focus-visible:ring-primary focus-visible:ring-1"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Right Side Shopping Utilities */}
        <div className="flex items-center gap-4 shrink-0">
          <ThemeSwitcher />
          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 bg-zinc-50 border dark:bg-zinc-900"
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
                  className="rounded-full h-9 w-9 bg-zinc-50 border dark:bg-zinc-900"
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
            <Link href="/account/login">
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

              {/* Mobile Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="text"
                  placeholder="Search store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 rounded-lg bg-zinc-50 border-zinc-200 dark:bg-zinc-900"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

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
                Energy Calculator
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default EcommerceNavbar;
