import React from "react";
import { MapPin, Phone, Mail, CalendarDays } from "lucide-react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import Image from "next/image";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Footer = () => {
  const today = new Date();

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950/20 text-zinc-550 dark:text-zinc-400 py-16 border-t border-border font-inter">
      <div className="container mx-auto px-4 space-y-12">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 select-none group">
              <Image
                src={LogoIcon}
                alt="logo"
                width={36}
                height={36}
                className="object-contain group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="font-extrabold text-lg text-zinc-900 dark:text-white tracking-tight">
                Go<span className="text-primary">Solar</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed font-semibold">
              Leading provider of sustainable structural solar energy solutions
              in Port Harcourt, Nigeria.
            </p>
            {/* Social Badges with hover fill animations */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { href: "https://www.facebook.com/Gosolar.ng", icon: FaFacebookF },
                { href: "https://twitter.com/Gosolarng", icon: FaXTwitter },
                { href: "#", icon: FaInstagram }
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={idx}
                    href={social.href}
                    target="_blank"
                    className="h-8 w-8 rounded-full bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-white hover:bg-primary dark:hover:bg-primary transition-all duration-300 flex items-center justify-center border border-border shadow-xs"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-4">
            <h5 className="font-black text-xs text-zinc-900 dark:text-white uppercase tracking-widest">
              Company
            </h5>
            <ul className="space-y-2 text-xs font-bold">
              {[
                { label: "About Us", href: "/about-us" },
                { label: "Blog", href: "/blog" },
                { label: "Shop Catalog", href: "/shop" },
                { label: "Contact Us", href: "/contact-us" },
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
                { label: "Privacy Policy", href: "/privacy-policy" }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block hover:text-primary transition-colors relative after:block after:h-[1.5px] after:w-0 hover:after:w-full hover:after:bg-primary after:transition-all after:duration-300 pb-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="space-y-4">
            <h5 className="font-black text-xs text-zinc-900 dark:text-white uppercase tracking-widest">
              Solutions
            </h5>
            <ul className="space-y-2 text-xs font-bold">
              {[
                { label: "Residential Solar", href: "/contact-us?subject=Residential" },
                { label: "Commercial Solar", href: "/contact-us?subject=Commercial" },
                { label: "Industrial Systems", href: "/contact-us?subject=Industrial" },
                { label: "Sizing Audit", href: "/energy-calculator" }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block hover:text-primary transition-colors relative after:block after:h-[1.5px] after:w-0 hover:after:w-full hover:after:bg-primary after:transition-all after:duration-300 pb-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-4">
            <h5 className="font-black text-xs text-zinc-900 dark:text-white uppercase tracking-widest">
              Contact Info
            </h5>
            <ul className="space-y-3.5 text-xs font-bold">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=gosolar+4+Eneka,+Igwuruta+Road,+Airport+road,+Port+Harcourt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors leading-relaxed"
                >
                  4 Eneka, Igwuruta Road, Airport road, Port Harcourt
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-primary shrink-0" />
                <a href="tel:+2347062762879" className="hover:text-primary transition-colors">
                  0706 276 2879
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-primary shrink-0" />
                <a
                  href="mailto:gosolardotng@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  gosolardotng@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-zinc-400 dark:text-zinc-500 font-semibold">
                <CalendarDays className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <span>
                  Mon - Friday
                  <br />
                  9:00AM - 5:00PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Switcher Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          
          {/* Left section: Copyright */}
          <div className="text-center md:text-left select-none">
            <p>&copy; {today.getFullYear()} GoSolar. All rights reserved.</p>
          </div>

          {/* Centered Theme Switcher */}
          <div className="flex items-center justify-center shrink-0">
            <ThemeSwitcher />
          </div>

          {/* Right Credits */}
          <p className="text-center md:text-right select-none">
            Designed & Built by{" "}
            <a
              href="https://www.linkedin.com/company/24-karats/"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-border"
            >
              24karats
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
