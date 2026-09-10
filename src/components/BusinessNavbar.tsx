"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { useSession } from "@/context/SessionContext";
import { Mail, Phone, X, User, ChevronDown, LayoutDashboard, UserCheck, LogOut, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const BusinessNavbar = () => {
  const { isAuthenticated, user, logout } = useSession();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const isActive = (href: string) => {
    return href === pathname || (href !== "/" && pathname.startsWith(href));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close mobile/tablet drawer on route changes
  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showMenu]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Solutions", href: "/solutions" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  return (
    <header className="w-full sticky top-0 left-0 z-50 font-inter bg-background">
      {/* ── Top Bar: Collapses on scroll (Visible on tablet & desktop) ── */}
      <div
        className={`w-full transition-all duration-300 overflow-hidden bg-muted border-b border-border text-muted-foreground hidden md:block ${
          scrolled ? "h-0 border-b-0 opacity-0" : "h-8 opacity-100"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-full text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-4 lg:gap-6">
            <span className="flex items-center gap-2">
              <Mail className="text-primary h-3.5 w-3.5 shrink-0" />
              <a
                href="mailto:gosolardotng@gmail.com"
                className="hover:text-primary transition-colors normal-case truncate max-w-[180px] lg:max-w-none"
              >
                gosolardotng@gmail.com
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="text-primary h-3.5 w-3.5 shrink-0" />
              <a
                href="tel:+2347062762879"
                className="hover:text-primary transition-colors"
              >
                0706 276 2879
              </a>
              <span className="text-zinc-300 dark:text-zinc-700 hidden lg:inline">/</span>
              <a
                href="tel:+2348027082120"
                className="hover:text-primary transition-colors hidden lg:inline"
              >
                0802 708 2120
              </a>
            </span>
          </div>

          <div className="text-[10px] font-semibold text-muted-foreground hidden lg:block">
            Clean energy solutions for Nigeria
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div
        className={`w-full transition-all duration-300 border-b border-border ${
          scrolled
            ? "py-2.5 shadow-sm bg-background/95 backdrop-blur-xs"
            : "py-3 md:py-4 bg-background"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-2 md:gap-4">
          {/* Left section: Hamburger (Mobile & Tablet) + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Animated Hamburger Toggle Button (Mobile & Tablet < lg) */}
            <button
              onClick={toggleShowMenu}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-foreground flex items-center justify-center h-10 w-10 cursor-pointer shrink-0"
              aria-label="Toggle Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span
                  className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${
                    showMenu
                      ? "rotate-45 translate-x-[3px] -translate-y-[1px]"
                      : ""
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
                    showMenu ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${
                    showMenu
                      ? "-rotate-45 translate-x-[3px] translate-y-[1px]"
                      : ""
                  }`}
                />
              </div>
            </button>

            {/* Logo brand */}
            <Logo priority size="md" />
          </div>

          {/* Desktop Navigation Links (Visible on lg+) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-2.5 xl:px-4 py-2 text-[11px] xl:text-xs font-black uppercase tracking-wider transition-colors duration-200 group ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 left-2.5 right-2.5 xl:left-4 xl:right-4 h-0.5 bg-primary rounded-full transform transition-all duration-300 origin-center ${
                      active
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs & Auth Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Store CTA (Tablet & Desktop) */}
            <Link href="/shop" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold text-[10px] md:text-[11px] uppercase tracking-wider h-8 md:h-9 px-3.5 md:px-5 rounded-full transition-all duration-200 cursor-pointer"
              >
                Store
              </Button>
            </Link>

            {/* Solar Calculator CTA (Tablet & Desktop) */}
            <Link href="/energy-calculator" className="hidden md:inline-flex">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold text-[10px] md:text-[11px] uppercase tracking-wider h-8 md:h-9 px-3.5 md:px-5 rounded-full shadow-xs hover:scale-105 transition-all duration-200 cursor-pointer">
                Calculator
              </Button>
            </Link>

            {/* Separator for Tablet & Desktop */}
            <span className="hidden sm:inline-block text-border">|</span>

            {/* Auth Section (Tablet & Desktop) */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer focus:outline-none">
                      <div className="h-7 w-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-extrabold text-xs">
                        {user?.firstname
                          ? user.firstname[0].toUpperCase()
                          : "U"}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider hidden xl:inline">
                        {user?.firstname}
                      </span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-200" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 p-2 rounded-2xl bg-card border border-border shadow-xl font-inter tracking-wider font-semibold text-muted-foreground"
                  >
                    <div className="px-3 py-2 border-b border-border/60 mb-1">
                      <p className="text-xs font-bold text-foreground truncate">
                        {user?.firstname} {user?.lastname}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate lowercase font-normal">
                        {user?.email}
                      </p>
                    </div>

                    {(user?.isAdmin || user?.isSuperAdmin) && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard"
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted hover:text-foreground rounded-xl transition-colors cursor-pointer text-xs"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/account/profile"
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted hover:text-foreground rounded-xl transition-colors cursor-pointer text-xs"
                      >
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-500 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20 rounded-xl transition-colors cursor-pointer text-xs"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted px-3 md:px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile & Tablet Side Navigation Drawer ── */}
      <AnimatePresence>
        {showMenu && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleShowMenu}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slider Panel Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-4/5 max-w-sm sm:max-w-md bg-card text-card-foreground border-r border-border h-full py-6 flex flex-col justify-between shadow-2xl overflow-hidden z-10"
            >
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between mb-4 px-6">
                <Logo size="sm" onClick={toggleShowMenu} />
                <button
                  onClick={toggleShowMenu}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable links list */}
              <ScrollArea className="flex-1 my-2">
                {/* User Profile Info on Mobile & Tablet Drawer */}
                {isAuthenticated && (
                  <div className="p-4 bg-muted/60 border border-border rounded-2xl mb-4 flex items-center gap-3 mx-6">
                    <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {user?.firstname ? user.firstname[0].toUpperCase() : "U"}
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="font-extrabold text-xs text-foreground leading-snug truncate">
                        {user?.firstname} {user?.lastname}
                      </h5>
                      <p className="text-[10px] text-muted-foreground lowercase leading-none truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-1 px-6">
                  {navLinks.map((link, idx) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <Link
                          href={link.href}
                          onClick={toggleShowMenu}
                          className={`flex items-center justify-between py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 transition-colors ${
                            active
                              ? "text-primary border-primary/20"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span>{link.label}</span>
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Account Options inside Drawer */}
                  {isAuthenticated ? (
                    <>
                      {(user?.isAdmin || user?.isSuperAdmin) && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: navLinks.length * 0.04 }}
                        >
                          <Link
                            href="/dashboard"
                            onClick={toggleShowMenu}
                            className="flex items-center justify-between py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-muted-foreground hover:text-foreground"
                          >
                            <span>Dashboard</span>
                            <ArrowRight className="h-4 w-4 opacity-50" />
                          </Link>
                        </motion.div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + 1) * 0.04 }}
                      >
                        <Link
                          href="/account/profile"
                          onClick={toggleShowMenu}
                          className="flex items-center justify-between py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-muted-foreground hover:text-foreground"
                        >
                          <span>My Profile</span>
                          <ArrowRight className="h-4 w-4 opacity-50" />
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + 2) * 0.04 }}
                      >
                        <button
                          onClick={() => {
                            toggleShowMenu();
                            logout();
                          }}
                          className="w-full text-left flex items-center justify-between py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-rose-500 hover:text-rose-600 cursor-pointer"
                        >
                          <span>Logout</span>
                          <LogOut className="h-4 w-4" />
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.04 }}
                    >
                      <Link
                        href="/auth/login"
                        onClick={toggleShowMenu}
                        className="flex items-center justify-between py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-muted-foreground hover:text-primary"
                      >
                        <span>Login / Register</span>
                        <ArrowRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Drawer Bottom CTAs */}
              <div className="space-y-2.5 pt-4 border-t border-border px-6">
                <Link
                  href="/shop"
                  onClick={toggleShowMenu}
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10 font-bold text-[10px] sm:text-[11px] uppercase tracking-widest h-10 rounded-full cursor-pointer"
                  >
                    Store Catalog
                  </Button>
                </Link>
                <Link
                  href="/energy-calculator"
                  onClick={toggleShowMenu}
                  className="block w-full"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-[10px] sm:text-[11px] uppercase tracking-widest h-10 rounded-full cursor-pointer">
                    Solar Calculator
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default BusinessNavbar;

