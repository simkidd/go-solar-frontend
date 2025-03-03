import React from "react";
import { MapPin, Phone, Mail, CalendarDays } from "lucide-react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import NewsLetter from "@/app/(ecommerce)/components/NewsLetter";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import Image from "next/image";

const Footer = () => {
  const today = new Date();

  return (
    <>
      {/* <NewsLetter /> */}
      <div className="w-full py-10">
        <div className="container mx-auto px-2 mb-8">
          <div className="grid lg:grid-cols-3 grid-cols-1">
            <div className="lg:p-4 px-2 py-4 ">
              <div className="mb-4">
                <Link href="/" className="flex items-center gap-1">
                  <Image
                    src={LogoIcon}
                    alt="logo"
                    width={55}
                    height={50}
                    style={{ width: "50px", height: "40px" }}
                  />
                  <span className="font-medium text-xl font-dmsans mt-2">
                    GoSolar
                  </span>
                </Link>{" "}
              </div>
              <p className="mb-6">
                Leading provider of sustainable solar energy solutions in Port
                Harcourt, Nigeria.
              </p>

              <ul className="flex items-center gap-4 ">
                <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                  <Link
                    href="https://www.facebook.com/Gosolar.ng"
                    target="_blank"
                    className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
                  >
                    <FaFacebookF />
                  </Link>
                </li>
                <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                  <Link
                    href="https://twitter.com/Gosolarng"
                    target="_blank"
                    className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
                  >
                    <FaXTwitter />
                  </Link>
                </li>
                <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                  <Link
                    href="#"
                    className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
                  >
                    <FaInstagram />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="lg:p-4 px-2 py-4 ">
              <h6 className="text-lg mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
                Quick Links
              </h6>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Link href="/about-us" className="hover:text-primary">
                    About Us
                  </Link>
                </li>

                <li className="flex items-center">
                  <Link href="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link href="/shop" className="hover:text-primary">
                    Shop
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link href="/contact-us" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="lg:p-4 px-2 py-4 ">
              <h6 className="text-lg mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
                Contact Us
              </h6>
              <ul className="space-y-2">
                <li className="flex ">
                  <MapPin size={16} className="text-primary mr-2" />
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=gosolar+4+Eneka,+Igwuruta+Road,+Airport+road,+Port+Harcourt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    4 Eneka, Igwuruta Road, Airport road, Port Harcourt
                  </a>
                </li>
                <li className="flex ">
                  <Phone size={16} className="text-primary mr-2" />
                  <a href="tel:+2347062762879" className="hover:underline">
                    0706 276 2879
                  </a>
                </li>
                <li className="flex ">
                  <Mail size={16} className="text-primary mr-2" />
                  <a
                    href="mailto:gosolardotng@gmail.com"
                    className="hover:underline"
                  >
                    gosolardotng@gmail.com
                  </a>
                </li>
                <li className="flex items-start">
                  <CalendarDays size={16} className="text-primary mr-2" />
                  Mon - Friday
                  <br /> 9:00AM - 5:00PM
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 w-full text-[12px] gap-1">
            <div className="col-span-1">
              <p>&copy; {today.getFullYear()} GoSolar. All right reversed.</p>
            </div>
            <div className="flex space-x-2 col-span-1 lg:justify-center">
              <Link href="" className="hover:underline mr-2">
                Terms & Conditions
              </Link>{" "}
              |
              <Link href="" className="hover:underline ml-2">
                Privacy Policy
              </Link>
            </div>
            <div className="col-span-1 lg:ml-auto">
              Designed & Built by{" "}
              <a
                href="https://www.linkedin.com/company/24-karats/"
                className="hover:underline"
              >
                24karats
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
