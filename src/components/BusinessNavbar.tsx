"use client";

import React, { useState, useEffect } from "react";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import { useSession } from "@/context/SessionContext";
import { Mail, Phone, X, User, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const BusinessNavbar = () => {
  const { isAuthenticated, user, logout } = useSession();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
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
      {/* ── Top Bar: Collapses on scroll ── */}
      <div
        className={`w-full transition-all duration-300 overflow-hidden bg-muted border-b border-border text-muted-foreground hidden lg:block ${
          scrolled ? "h-0 border-b-0 opacity-0" : "h-8 opacity-100"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-full text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Mail className="text-primary h-3.5 w-3.5" />
              <a
                href="mailto:gosolardotng@gmail.com"
                className="hover:text-primary transition-colors normal-case"
              >
                gosolardotng@gmail.com
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="text-primary h-3.5 w-3.5" />
              <a
                href="tel:+2347062762879"
                className="hover:text-primary transition-colors"
              >
                0706 276 2879
              </a>
            </span>
          </div>

          <div className="text-[10px] font-semibold text-muted-foreground select-none">
            Clean energy solutions for Nigeria
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div
        className={`w-full transition-all duration-350 border-b border-border ${
          scrolled
            ? "py-2.5 shadow-sm bg-background/95 backdrop-blur-xs"
            : "py-4 bg-background"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Animated Hamburger Toggle Button (Mobile) */}
          <button
            onClick={toggleShowMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground flex items-center justify-center h-10 w-10 z-50 cursor-pointer"
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
          <Link href="/" className="flex items-center gap-2 select-none group">
            <Image
              src={LogoIcon}
              alt="logo"
              width={36}
              height={36}
              className="object-contain group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              Go<span className="text-primary">Solar</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 select-none">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors duration-200 group ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full transform transition-all duration-300 origin-center ${
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
          <div className="flex items-center gap-3 relative">
            <Link href="/shop" className="hidden sm:inline-block">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold text-[10px] uppercase tracking-widest h-9 px-5 rounded-full transition-all duration-200 cursor-pointer"
              >
                Store
              </Button>
            </Link>
            <Link href="/energy-calculator" className="hidden sm:inline-block">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase tracking-widest h-9 px-5 rounded-full shadow-xs hover:scale-105 transition-all duration-200 cursor-pointer">
                Calculator
              </Button>
            </Link>

            {/* Desktop Auth Section */}
            <span className="hidden sm:inline-block text-border select-none">
              |
            </span>

            <div className="hidden lg:block">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer select-none"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-extrabold text-xs">
                      {user?.firstname ? user.firstname[0].toUpperCase() : "U"}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider hidden xl:inline">
                      {user?.firstname}
                    </span>
                    <ChevronDown
                      className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${showUserDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showUserDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowUserDropdown(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-2xl shadow-xl z-50 p-2 font-inter text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground select-none"
                        >
                          {(user?.isAdmin || user?.isSuperAdmin) && (
                            <Link
                              href="/dashboard"
                              onClick={() => setShowUserDropdown(false)}
                              className="block px-4 py-2.5 hover:bg-muted hover:text-foreground rounded-xl transition-colors"
                            >
                              Dashboard
                            </Link>
                          )}
                          <Link
                            href="/account/profile"
                            onClick={() => setShowUserDropdown(false)}
                            className="block px-4 py-2.5 hover:bg-muted hover:text-foreground rounded-xl transition-colors"
                          >
                            My Profile
                          </Link>
                          <button
                            onClick={() => {
                              setShowUserDropdown(false);
                              logout();
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 rounded-xl transition-colors cursor-pointer"
                          >
                            Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted px-4.5 py-2.5 rounded-full transition-all duration-200 cursor-pointer select-none"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Side Navigation Drawer ── */}
      <AnimatePresence>
        {showMenu && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
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
              className="relative w-4/5 max-w-sm bg-card text-card-foreground border-r border-border h-full p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-8 select-none">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={toggleShowMenu}
                  >
                    <Image src={LogoIcon} alt="logo" width={32} height={32} />
                    <span className="font-extrabold text-lg text-foreground">
                      Go<span className="text-primary">Solar</span>
                    </span>
                  </Link>
                  <button
                    onClick={toggleShowMenu}
                    className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* User Profile Info on Mobile */}
                {isAuthenticated && (
                  <div className="p-4 bg-muted border border-border rounded-2xl mb-6 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {user?.firstname ? user.firstname[0].toUpperCase() : "U"}
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="font-extrabold text-xs text-foreground leading-snug truncate">
                        {user?.firstname} {user?.lastname}
                      </h5>
                      <p className="text-[9px] text-muted-foreground lowercase leading-none truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map((link, idx) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={toggleShowMenu}
                          className={`block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 transition-colors ${
                            active
                              ? "text-primary border-primary/20"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Account Options inside Mobile Drawer */}
                  {isAuthenticated ? (
                    <>
                      {(user?.isAdmin || user?.isSuperAdmin) && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: navLinks.length * 0.05 }}
                        >
                          <Link
                            href="/dashboard"
                            onClick={toggleShowMenu}
                            className="block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-muted-foreground hover:text-foreground"
                          >
                            Dashboard
                          </Link>
                        </motion.div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + 1) * 0.05 }}
                      >
                        <Link
                          href="/account/profile"
                          onClick={toggleShowMenu}
                          className="block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-muted-foreground hover:text-foreground"
                        >
                          My Profile
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + 2) * 0.05 }}
                      >
                        <button
                          onClick={() => {
                            toggleShowMenu();
                            logout();
                          }}
                          className="w-full text-left block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-rose-500 hover:text-rose-600 cursor-pointer"
                        >
                          Logout
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.05 }}
                    >
                      <Link
                        href="/auth/login"
                        onClick={toggleShowMenu}
                        className="block py-3 text-sm font-black uppercase tracking-wider border-b border-border/60 text-muted-foreground hover:text-primary"
                      >
                        Login / Register
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Drawer Bottom CTAs */}
              <div className="space-y-3 pt-6 border-t border-border">
                <Link
                  href="/shop"
                  onClick={toggleShowMenu}
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10 font-bold text-[10px] uppercase tracking-widest h-10 rounded-full cursor-pointer"
                  >
                    Store Catalog
                  </Button>
                </Link>
                <Link
                  href="/energy-calculator"
                  onClick={toggleShowMenu}
                  className="block w-full"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase tracking-widest h-10 rounded-full cursor-pointer">
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
