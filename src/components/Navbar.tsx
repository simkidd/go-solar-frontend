"use client";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import { useSession } from "@/context/SessionContext";
import { navlist } from "@/data/menuData";
import { Button } from "@heroui/react";
import { Mail, Menu, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import MenuItem from "./MenuItem";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useSession();

  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll); // Add scroll event listener
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showMenu]);

  return (
    <div className="w-full font-dmsans fixed top-0 left-0 z-50">
      {/* Glass-like navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled ? "bg-white dark:bg-[#222327] shadow-md" : " text-white"
        }`}
      >
        {/* top header */}
        <div className="w-full h-10 hidden lg:flex bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="grid lg:grid-cols-2 grid-cols-1 items-center container mx-auto px-2 w-full h-full">
            <div className="flex items-center gap-4 mr-auto text-sm">
              <span className="flex items-center">
                <Mail className="text-primary mr-2" size={18} />
                gosolardotng@gmail.com
              </span>
              <span className="flex items-center">
                <Phone className="text-primary mr-2" size={18} />
                0706 276 2879
              </span>
            </div>

            <div className="ml-auto flex items-center gap-8">
              {isAuthenticated ? (
                <>
                  {user?.isAdmin ||
                    (user?.isSuperAdmin && (
                      <Link
                        href="/admin"
                        className="text-sm hover:text-primary"
                      >
                        Dashboard
                      </Link>
                    ))}
                  <Link
                    href="/account/profile"
                    className="text-sm hover:text-primary"
                  >
                    My Account
                  </Link>
                  <button
                    className="text-sm hover:text-red-500"
                    onClick={() => logout()}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/account/login"
                  className="text-sm hover:text-primary"
                >
                  Login / Register
                </Link>
              )}

              <ThemeSwitcher />
              <ul className="flex items-center gap-4">
                <li className="light dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                  <Link
                    href="https://www.facebook.com/Gosolar.ng"
                    className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
                  >
                    <FaFacebookF />
                  </Link>
                </li>
                <li className="light dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
                  <Link
                    href="https://twitter.com/Gosolarng"
                    className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
                  >
                    <FaXTwitter />
                  </Link>
                </li>
                <li className="light dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
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

        {/* bottom header */}
        <div className="w-full lg:h-20 h-[70px]">
          <div className="flex items-center justify-between container mx-auto px-2 w-full h-full">
            <div
              className="cursor-pointer lg:hidden size-10 flex items-center justify-center mr-2"
              onClick={toggleShowMenu}
            >
              <Menu size={32} />
            </div>

            {/* logo */}
            <div className="flex items-center justify-center mr-auto lg:mr-0">
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
              </Link>
            </div>

            <ul className="bottom__nav lg:flex hidden items-center space-x-8 h-full">
              {navlist.map((item, i) => (
                <MenuItem key={i} item={item} isActive={isActive} />
              ))}
            </ul>

            <Link
              href="https://wa.me/2347062762879"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button color="primary">Get A Quote</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <>
        <div
          onClick={toggleShowMenu}
          className={`bg-[#00000056] w-full h-screen absolute top-0 bottom-0 z-50 transition duration-500 ease-linear ${
            showMenu ? "block" : "hidden"
          }`}
        ></div>

        <div
          className={`bg-white dark:bg-[#222327] lg:hidden flex flex-col justify-between absolute z-50 top-0 bottom-0 -left-full transition-all duration-500 ease-linear h-dvh w-3/6 ${
            showMenu ? "left-0" : "w-3/6"
          }`}
        >
          <div
            onClick={toggleShowMenu}
            className="cursor-pointer ml-auto mx-2 my-2"
          >
            <MdClose size={32} />
          </div>

          <div className="flex flex-col overflow-y-auto space-y-6">
            <ul className="flex items-center justify-center space-y-6 flex-col w-full">
              {navlist.map(({ href, label }, i) => {
                return (
                  <li key={i} className="">
                    <Link
                      href={href}
                      className={`hover:text-primary ${
                        isActive(href) ? "text-primary" : ""
                      }`}
                      onClick={toggleShowMenu}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col items-center space-y-6">
              {isAuthenticated ? (
                <>
                  {user?.isAdmin ||
                    (user?.isSuperAdmin && (
                      <Link href="/admin" className="hover:text-primary">
                        Dashboard
                      </Link>
                    ))}
                  <Link href="/account/profile" className="hover:text-primary">
                    My Account
                  </Link>
                  <button
                    className="hover:text-red-500"
                    onClick={() => logout()}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/account/login" className="hover:text-primary">
                  Login / Register
                </Link>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center flex-col w-full my-4 space-y-4">
            <ul className="flex items-center gap-4">
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

            <ThemeSwitcher />
          </div>
        </div>
      </>
    </div>
  );
};

export default Navbar;
