"use client";
import Search from "@/components/Search";
import { navlist } from "@/data/menuData";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import useCartStore from "@/lib/stores/cart.store";
import { useProductStore } from "@/lib/stores/product.store";
import { ChevronDown, Mail, Menu, Phone, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { HiOutlineUser } from "react-icons/hi2";
import { MdClose, MdDashboard } from "react-icons/md";
import MenuItem from "../../../components/MenuItem";
import { ThemeSwitcher } from "../../../components/ThemeSwitcher";

const HeaderShop = () => {
  const { cartItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const { categories, setCategories } = useProductStore();
  const pathname = usePathname();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/categories");
        setCategories(data?.categories);
      } catch (error) {
        const errorMsg = error as any;
        console.log(errorMsg?.response?.data.message);
      }
    })();
  }, []);

  const handleOutsideClick = (e: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  });

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
    <div className="w-full font-dmsans sticky top-0 left-0 z-50 light bg-[#f1f1f1] dark:bg-[#2a2b2f] shadow nav__container">
      {/* top header */}
      <div className="w-full h-12 hidden lg:flex">
        <div className="grid lg:grid-cols-2 grid-cols-1 items-center container mx-auto px-2 w-full h-full">
          <div className="flex items-center gap-4 mr-auto text-sm">
            <span className="flex items-center">Welcome Our Online Store!</span>
            <span className="flex items-center">
              <Mail className="text-primary mr-2" size={16} />
              gosolardotng@gmail.com
            </span>
            <span className="flex items-center">
              <Phone className="text-primary mr-2" size={16} />
              0706 276 2879
            </span>
          </div>

          <div className=" ml-auto flex gap-8">
            <ThemeSwitcher />
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
      {/* bottom header */}
      <div className="w-full light bg-white dark:bg-[#222327]">
        <div className="flex w-full border-b light border-b-[#f1f1f1] dark:border-b-[#2a2b2f]">
          {/* bh-top */}
          <div className="flex items-center container mx-auto px-2 w-full">
            {/* logo */}
            <div className="flex items-center mr-auto lg:mr-0 w-48">
              <Link href="/" className="text-3xl">
                GoSolar.
              </Link>
            </div>
            <div className="flex items-center justify-between w-full h-20">
              <div className="hidden lg:flex justify-center w-[500px] ml-4">
                <Search placeholder="Find a product..." />
              </div>
              <div className="flex h-full ml-auto">
                <Link href="/cart">
                  <button
                    className={`h-full justify-center items-center px-4 py-2 flex hover:bg-primary hover:text-white ${
                      isActive("/cart") && "bg-primary text-white"
                    }`}
                  >
                    <div className="size-8 mr-1">
                      <ShoppingCart size={32} />
                    </div>
                    <div className="flex flex-col text-sm">
                      <span className="bg-primary rounded-full text-white text-xs">
                        {cartItems?.length}
                      </span>
                      <span>Cart</span>
                    </div>
                  </button>
                </Link>

                <div className="user relative lg:block hidden">
                  <button className=" h-full items-center px-4 py-2 flex user__button">
                    <div className="size-8 mr-1">
                      <HiOutlineUser size={32} />
                    </div>
                    <div className="flex flex-col text-sm">
                      {!user ? (
                        <>
                          <span className="text-left">Welcome</span>
                          <div className="flex">
                            <span>Login</span>
                            <span className="mx-2">/</span>
                            <span>Register</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col">
                            <span className="text-left">
                              Hi, {user?.firstname}
                            </span>
                            <span className="font-semibold">Account</span>
                          </div>
                        </>
                      )}
                    </div>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  <div className="user__menu min-w-52 light bg-white dark:bg-[#2a2b2f] shadow-md">
                    {user ? (
                      <>
                        <div className="p-4">
                          <p>Welcome back,</p>
                          <p className="font-bold">{user?.firstname}</p>
                        </div>
                        <hr />
                        <ul>
                          {user?.isAdmin ||
                            (user?.isSuperAdmin && (
                              <li>
                                <Link
                                  className="block p-2 hover:text-primary text-center"
                                  href="/admin"
                                >
                                  Dashboard
                                </Link>
                              </li>
                            ))}
                          <li>
                            <Link
                              className="block p-2 hover:text-primary text-center"
                              href="#"
                            >
                              Account
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="block p-2 hover:text-primary text-center"
                              href="#"
                            >
                              Orders
                            </Link>
                          </li>
                          <li>
                            <button
                              className="text-red-500 w-full py-2 px-8"
                              onClick={() => logout()}
                            >
                              Logout
                            </button>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <ul className="px-6 py-4 flex flex-col items-center">
                        <li className="w-full">
                          <Link
                            href="/account/login"
                            className="bg-primary px-4 py-2 flex"
                          >
                            Login
                          </Link>
                        </li>
                        <li className="w-full">
                          <Link
                            href="/account/register"
                            className="hover:text-primary py-2 flex"
                          >
                            Register
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* bh-bottom */}
        <div className="w-full h-10">
          <div className="flex items-center container mx-auto px-2 w-full h-full gap-4">
            <div className="md:w-52 h-full relative categories">
              <button className="w-full h-full flex items-center justify-between px-2 border-b-2 border-b-primary categories__button">
                <span className="hidden md:block">All Categories</span>
                <Menu size={18} />
              </button>
              <ul className="categories__menu light bg-white dark:bg-[#2a2b2f] shadow-md w-52 text-sm max-h-[70vh] overflow-y-auto">
                {categories.map((cat) => (
                  <li key={cat?._id}>
                    <Link
                      href=""
                      className="flex items-center px-4 py-2 gap-1 hover:bg-primary"
                    >
                      <MdDashboard size={8} />
                      {cat?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="bottom__nav lg:flex hidden items-center space-x-8 h-full">
              {navlist.map((item, i) => (
                <MenuItem key={i} item={item} isActive={isActive} />
              ))}
            </ul>

            <div
              className="cursor-pointer lg:hidden size-10 flex items-center justify-center ml-auto"
              onClick={toggleShowMenu}
            >
              <Menu size={32} />
            </div>
          </div>
        </div>
      </div>
      {/* mobile menu */}
      <div className={`mob-nav-list lg:hidden ${showMenu && "open"}`}>
        <div
          ref={sidebarRef}
          className="mob-nav-inner light bg-white dark:bg-[#222327]"
        >
          <div
            onClick={toggleShowMenu}
            className="cursor-pointer ml-auto mx-2 my-2"
          >
            <MdClose size={32} />
          </div>

          <ul className="flex items-center justify-center space-y-6 flex-col w-full">
            {navlist.map(({ href, label }, i) => {
              return (
                <li key={i} className="">
                  <Link
                    href={href}
                    className={` ${isActive(href) ? "text-primary" : ""}`}
                    onClick={toggleShowMenu}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {!user ? (
            <div className="flex">
              <Link href="/account/login">Login</Link>
              <span className="mx-2">/</span>
              <Link href="/account/register">Register</Link>
            </div>
          ) : (
            <div>
              <Link href="">Account</Link>
            </div>
          )}

          <div className="flex justify-center items-center flex-col w-full my-4 space-y-4">
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

            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderShop;
