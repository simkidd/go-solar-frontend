"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { CgMenuRight } from "react-icons/cg";
import { useState } from "react";

interface Menu {
  name: string;
  href: string;
}

const navlist: Menu[] = [
  { name: "About Us", href: "/about-us" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "GoShop", href: "/products" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact Us", href: "/contact-us" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  const isActive = (href: string) => {
    return (
      href === pathname ||
      href === pathname.replace(/\/$/, "") ||
      pathname.startsWith(href + "/")
    );
  };

  return (
    <div className="w-full font-dmsans">
      {/* top header */}
      <div className="w-full h-20 hidden lg:flex">
        <div className="grid lg:grid-cols-12 grid-cols-1 items-center container mx-auto px-2 w-full h-full">
          <div className="flex items-center gap-4 lg:col-span-5 col-span-12 mr-auto text-sm">
            <span>example@gmail.com</span>
            <span>(123) 456 789</span>
          </div>
          <div className="lg:col-span-2 col-span-12 flex items-center justify-center">
            <Link href="/" className="text-3xl">
              GoSolar.
            </Link>
          </div>

          <div className="lg:col-span-5 col-span-12 ml-auto flex gap-8">
            <ThemeSwitcher />
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
      {/* bottom header */}
      <div className="w-full h-16 light bg-[#f1f1f1] dark:bg-[#2a2b2f]">
        <div className="flex items-center justify-between container mx-auto px-2 w-full h-full">
          {/* <div className="">
            <input type="text" placeholder="Search..." />
          </div> */}

          {/* mobile logo */}
          <div className="flex lg:hidden items-center justify-center">
            <Link href="/" className="text-3xl">
              GoSolar.
            </Link>
          </div>

          <ul className="lg:flex hidden items-center space-x-8 h-full">
            {navlist.map(({ href, name }, i) => {
              return (
                <li key={i} className="h-full ">
                  <Link
                    href={href}
                    className={`h-full flex justify-center items-center border-b-4 border-b-transparent ${
                      isActive(href) ? "!border-b-primary" : ""
                    }`}
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/get-quote"
            className="bg-primary text-white h-full justify-center items-center px-4 lg:flex hidden"
          >
            Get A Quote
          </Link>

          <div
            className="cursor-pointer lg:hidden z-20 size-10 flex items-center justify-center"
            onClick={toggleShowMenu}
          >
            <CgMenuRight size={32} />
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`absolute top-0 h-full w-full z-10 bg-[#1c1d21] items-center ${
          showMenu ? "flex" : "hidden"
        }`}
      >
        <ul className="flex items-center justify-center space-y-6 flex-col h-full w-full">
          {navlist.map(({ href, name }, i) => {
            return (
              <li key={i} className="">
                <Link
                  href={href}
                  className={` ${isActive(href) ? "text-primary" : ""}`}
                  onClick={toggleShowMenu}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
