import React from "react";
import { MapPin, Phone, Mail, CalendarDays } from "lucide-react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import Image from "next/image";

const Footer = () => {
  const today = new Date();

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-650 dark:text-zinc-400 py-16 border-t border-zinc-150 dark:border-zinc-850 font-inter">
      <div className="container mx-auto px-4 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={LogoIcon}
                alt="logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="font-extrabold text-lg text-zinc-900 dark:text-white tracking-tight">
                Go<span className="text-[#08AA08]">Solar</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed font-semibold">
              Leading provider of sustainable structural solar energy solutions
              in Port Harcourt, Nigeria.
            </p>
            <div className="flex items-center gap-3.5 pt-2">
              <Link
                href="https://www.facebook.com/Gosolar.ng"
                target="_blank"
                className="h-8 w-8 rounded-full bg-zinc-150 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-[#08AA08] hover:bg-[#08AA08]/10 transition-colors flex items-center justify-center border border-zinc-200 dark:border-zinc-800"
              >
                <FaFacebookF className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="https://twitter.com/Gosolarng"
                target="_blank"
                className="h-8 w-8 rounded-full bg-zinc-150 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-[#08AA08] hover:bg-[#08AA08]/10 transition-colors flex items-center justify-center border border-zinc-200 dark:border-zinc-800"
              >
                <FaXTwitter className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="#"
                className="h-8 w-8 rounded-full bg-zinc-150 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-[#08AA08] hover:bg-[#08AA08]/10 transition-colors flex items-center justify-center border border-zinc-200 dark:border-zinc-800"
              >
                <FaInstagram className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-zinc-900 dark:text-white uppercase tracking-widest">
              Company
            </h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-[#08AA08] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-[#08AA08] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#08AA08] transition-colors"
                >
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-[#08AA08] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-zinc-900 dark:text-white uppercase tracking-widest">
              Solutions
            </h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link
                  href="/contact-us?subject=Residential"
                  className="hover:text-[#08AA08] transition-colors"
                >
                  Residential Solar
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us?subject=Commercial"
                  className="hover:text-[#08AA08] transition-colors"
                >
                  Commercial Solar
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us?subject=Industrial"
                  className="hover:text-[#08AA08] transition-colors"
                >
                  Industrial Systems
                </Link>
              </li>
              <li>
                <Link
                  href="/energy-calculator"
                  className="hover:text-[#08AA08] transition-colors"
                >
                  Sizing Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="space-y-4">
            <h5 className="font-extrabold text-xs text-zinc-900 dark:text-white uppercase tracking-widest">
              Contact Info
            </h5>
            <ul className="space-y-3 text-xs font-semibold">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#08AA08] shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=gosolar+4+Eneka,+Igwuruta+Road,+Airport+road,+Port+Harcourt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline leading-relaxed"
                >
                  4 Eneka, Igwuruta Road, Airport road, Port Harcourt
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#08AA08] shrink-0" />
                <a href="tel:+2347062762879" className="hover:underline">
                  0706 276 2879
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#08AA08] shrink-0" />
                <a
                  href="mailto:gosolardotng@gmail.com"
                  className="hover:underline"
                >
                  gosolardotng@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-zinc-400">
                <CalendarDays className="h-4 w-4 text-[#08AA08] shrink-0 mt-0.5" />
                <span>
                  Mon - Friday
                  <br />
                  9:00AM - 5:00PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Meta */}
        <div className="pt-8 border-t border-zinc-150 dark:border-zinc-850 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          <p className="text-center md:text-left">
            &copy; {today.getFullYear()} GoSolar. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms-and-conditions" className="hover:underline">
              Terms & Conditions
            </Link>
            <span>|</span>
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
          <p className="text-center md:text-right">
            Designed & Built by{" "}
            <a
              href="https://www.linkedin.com/company/24-karats/"
              className="hover:underline text-zinc-950 dark:text-white"
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
