import React from "react";
import { MapPin, Phone, Mail, CalendarDays } from "lucide-react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const today = new Date();

  return (
    <div className="w-full py-10">
      <div className="container mx-auto px-2 mb-8">
        <div className="grid lg:grid-cols-4 grid-cols-1">
          <div className="lg:p-4 px-2 py-4 ">
            <div>
              <h3 className="text-3xl font-bold">GoSolar</h3>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
              voluptas.
            </p>
          </div>
          <div className="lg:p-4 px-2 py-4 ">
            <h6 className="text-lg mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
              Company
            </h6>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">
                  Services
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">
                  Faq
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">
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
                Opp. Rosco Filling Station, <br />
                Eneka/Igwuruta Road, <br />
                Port Harcourt.
              </li>
              <li className="flex ">
                <Phone size={16} className="text-primary mr-2" />
                0706 276 2879
              </li>
              <li className="flex ">
                <Mail size={16} className="text-primary mr-2" />
                gosolardotng@gmail.com
              </li>
              <li className="flex items-start">
                <CalendarDays size={16} className="text-primary mr-2" />
                Mon - Friday
                <br /> 9:00AM - 5:00PM
              </li>
            </ul>
          </div>
          <div className="lg:p-4 px-2 py-4 lg:col-span-1">
            <h6 className="text-lg mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
              Our Socials
            </h6>
            <ul className="flex items-center gap-4 ">
              <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                <Link
                  href="https://www.facebook.com/Gosolar.ng"
                  className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
                >
                  <FaFacebookF />
                </Link>
              </li>
              <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                <Link
                  href="https://twitter.com/Gosolarng"
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
        </div>
      </div>
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full text-sm gap-1">
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
              href="http://linkedin.com/in/mason10396"
              className="hover:underline"
            >
              Onidev
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
