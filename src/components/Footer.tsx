import React from "react";
import { MapPin, Phone, Mail, CalendarDays } from "lucide-react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const today = new Date();

  return (
    <div className="w-full">
      <div className="container mx-auto px-2">
        <div className="grid grid-cols-4">
          <div className="p-4">
            <div>
              <h3 className="text-3xl font-bold">GoSolar</h3>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
              voluptas.
            </p>
          </div>
          <div className="p-4">
            <h6 className="text-lg mb-4">Contact Us</h6>
            <ul>
              <li className="flex items-center mb-1">
                <MapPin size={16} className="text-primary mr-2" />
                <span>123 Address</span>
              </li>
              <li className="flex items-center mb-1">
                <Phone size={16} className="text-primary mr-2" />
                <span>123 4567 89</span>
              </li>
              <li className="flex items-center mb-1">
                <Mail size={16} className="text-primary mr-2" />
                <span>youremail@gmail.com</span>
              </li>
              <li className="flex items-center">
                <CalendarDays size={16} className="text-primary mr-2" />
                <span>Mon - Friday: 9:00AM - 5:00PM</span>
              </li>
            </ul>
          </div>
          <div className="p-4">
            <h6 className="text-lg mb-4">Contact Us</h6>
            <ul>
              <li className="flex items-center mb-1">
                <MapPin size={16} className="text-primary mr-2" />
                <span>123 Address</span>
              </li>
              <li className="flex items-center mb-1">
                <Phone size={16} className="text-primary mr-2" />
                <span>123 4567 89</span>
              </li>
              <li className="flex items-center mb-1">
                <Mail size={16} className="text-primary mr-2" />
                <span>youremail@gmail.com</span>
              </li>
              <li className="flex items-center">
                <CalendarDays size={16} className="text-primary mr-2" />
                <span>Mon - Friday: 9:00AM - 5:00PM</span>
              </li>
            </ul>
          </div>
          <div className="p-4">
            <h6 className="text-lg mb-4">Our Social</h6>
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
        <div className="grid grid-cols-3 w-full">
          <div className="col-span-2">
            <p>&copy; {today.getFullYear()} GoSolar</p>
          </div>
          <div>
            <Link href="">Terms & Conditions</Link>
            <Link href="">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
