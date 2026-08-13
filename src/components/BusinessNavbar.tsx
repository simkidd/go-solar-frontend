"use client";
import React, { useState, useEffect } from "react";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import { useSession } from "@/context/SessionContext";
import { Mail, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";

const BusinessNavbar = () => {
  const { isAuthenticated, user, logout } = useSession();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  const isActive = (href: string) => {
    return href === pathname || (href !== "/" && pathname.startsWith(href));
  };

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
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  return (
    <header className="w-full sticky top-0 left-0 z-50 transition-all duration-300 font-inter">
      {/* Top Banner Contact Information */}
      <div className="w-full h-10 hidden lg:flex border-b transition-colors duration-300 bg-zinc-50 dark:bg-zinc-900 border-zinc-150 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350">
        <div className="container mx-auto px-4 flex items-center justify-between w-full h-full text-xs font-semibold">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Mail className="text-primary h-3.5 w-3.5" />
              <a
                href="mailto:gosolardotng@gmail.com"
                className="hover:underline"
              >
                gosolardotng@gmail.com
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="text-primary h-3.5 w-3.5" />
              <a href="tel:+2347062762879" className="hover:underline">
                0706 276 2879
              </a>
            </span>
          </div>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {(user?.isAdmin || user?.isSuperAdmin) && (
                  <Link
                    href="/dashboard"
                    className="hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/account/profile"
                  className="hover:text-primary transition-colors"
                >
                  My Account
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-rose-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hover:text-primary transition-colors"
              >
                Login / Register
              </Link>
            )}

            <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-850" />

            <ThemeSwitcher />

            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/Gosolar.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaFacebookF className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com/Gosolarng"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaXTwitter className="h-3.5 w-3.5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <FaInstagram className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Corporate Navigation Header */}
      <div className="w-full bg-white dark:bg-zinc-950 shadow-xs border-b border-zinc-150 dark:border-zinc-850 py-3 transition-colors duration-300">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Mobile hamburger menu */}
          <button
            onClick={toggleShowMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-zinc-100/10 transition-colors text-zinc-800 dark:text-zinc-200"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo brand */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LogoIcon}
              alt="logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
              Go<span className="text-[#08AA08]">Solar</span>
            </span>
          </Link>

          {/* Desktop Navigation list */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive(link.href)
                    ? "bg-[#08AA08]/10 text-[#08AA08]"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/shop">
              <Button
                variant="outline"
                className="border-[#08AA08] text-[#08AA08] hover:bg-[#08AA08]/10 hover:text-[#08AA08] font-bold text-xs uppercase tracking-wider h-10 px-5 rounded-full transition-all duration-200"
              >
                Store
              </Button>
            </Link>
            <Link href="/energy-calculator">
              <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider h-10 px-5 rounded-full shadow-xs transition-all duration-200">
                Energy Calculator
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile navigation side drawer */}
      {showMenu && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop mask */}
          <div
            onClick={toggleShowMenu}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Slider Drawer panel */}
          <div className="relative w-4/5 max-w-sm bg-white dark:bg-zinc-900 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between mb-8">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={toggleShowMenu}
                >
                  <Image src={LogoIcon} alt="logo" width={32} height={32} />
                  <span className="font-bold text-lg dark:text-white">
                    Go<span className="text-primary">Solar</span>
                  </span>
                </Link>
                <button
                  onClick={toggleShowMenu}
                  className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={toggleShowMenu}
                    className={`block py-2 text-base font-semibold border-b border-zinc-100 dark:border-zinc-800 transition-colors ${
                      isActive(link.href)
                        ? "text-primary"
                        : "text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href="/shop"
                onClick={toggleShowMenu}
                className="block w-full"
              >
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5 font-semibold rounded-xl"
                >
                  Store
                </Button>
              </Link>
              <Link
                href="/energy-calculator"
                onClick={toggleShowMenu}
                className="block w-full"
              >
                <Button className="w-full bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl">
                  Energy Calculator
                </Button>
              </Link>

              <div className="flex justify-center items-center gap-6 text-zinc-500 dark:text-zinc-400">
                <a
                  href="https://www.facebook.com/Gosolar.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/Gosolarng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaXTwitter className="h-5 w-5" />
                </a>
                <a href="#">
                  <FaInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default BusinessNavbar;
