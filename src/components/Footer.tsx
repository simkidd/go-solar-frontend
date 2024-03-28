import React from "react";
import { MapPin, Phone, Mail, CalendarDays } from "lucide-react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const today = new Date();

  return (
    <div className="w-full py-10">
      <div className="container mx-auto px-2 mb-8">
        <div className="grid lg:grid-cols-5 grid-cols-1">
          <div className="p-4 lg:col-span-2">
            <div>
              <h3 className="text-3xl font-bold">GoSolar</h3>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
              voluptas.
            </p>
          </div>
          <div className="p-4 lg:col-span-1">
            <h6 className="text-lg mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
              Company
            </h6>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">About Us</Link>
              </li>
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">Services</Link>
              </li>
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">Blog</Link>
              </li>
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">Faq</Link>
              </li>
              <li className="flex items-center">
                <Link href="#" className="hover:text-primary">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="p-4 lg:col-span-1">
            <h6 className="text-lg mb-6 w-fit relative before:absolute before:-bottom-2 before:w-12 before:h-[2px] before:bg-primary">
              Contact Us
            </h6>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={16} className="text-primary mr-2" />
                <span>123 Address</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="text-primary mr-2" />
                <span>123 4567 89</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="text-primary mr-2" />
                <span>youremail@gmail.com</span>
              </li>
              <li className="flex items-start">
                <CalendarDays size={16} className="text-primary mr-2" />
                <span>Mon - Friday<br/> 9:00AM - 5:00PM</span>
              </li>
            </ul>
          </div>
          <div className="p-4 lg:col-span-1">
            <h6 className="text-lg mb-4">Our Socials</h6>
            <ul className="flex items-center gap-4 ">
              <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                <Link
                  href=""
                  className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
                >
                  <FaFacebookF />
                </Link>
              </li>
              <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                <Link
                  href=""
                  className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
                >
                  <FaXTwitter />
                </Link>
              </li>
              <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                <Link
                  href=""
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
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
          <div className="col-span-2 mb-1 lg:mb-0">
            <p>&copy; {today.getFullYear()} GoSolar</p>
          </div>
          <div className="flex space-x-2">
            <Link href="" className="hover:underline">Terms & Conditions</Link>
            <Link href="" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
