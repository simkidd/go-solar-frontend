"use client";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import Search from "@/components/Search";
import { shopNavlist } from "@/data/menuData";
import { useAuthStore } from "@/lib/stores/auth.store";
import useCartStore from "@/lib/stores/cart.store";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@nextui-org/react";
import {
  ChevronDown,
  LogOut,
  Mail,
  Menu,
  Phone,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaFacebookF,
  FaInstagram,
  FaUser,
  FaXTwitter,
} from "react-icons/fa6";
import { MdClose, MdDashboard } from "react-icons/md";
import MenuItem from "../../../components/MenuItem";
import { ThemeSwitcher } from "../../../components/ThemeSwitcher";

const HeaderShop = () => {
  const { cartItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const { categories } = useProductStore();
  const pathname = usePathname();
  const router = useRouter();
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
    <div className="w-full font-dmsans sticky top-0 left-0 z-50 light bg-[#f1f1f1] dark:bg-[#2a2b2f] shadow nav__container">
      {/* top header */}
      <div className="w-full h-10 hidden lg:flex">
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
        <div className="flex w-full border-b light border-b-[#f1f1f1] dark:border-b-[#2a2b2f] flex-wrap">
          {/* bh-top */}
          <div className="flex items-center container mx-auto px-2 w-full">
            <button
              className="cursor-pointer lg:hidden size-10 flex items-center justify-center mr-2"
              onClick={toggleShowMenu}
            >
              {!showMenu ? <Menu size={32} /> : <MdClose size={32} />}
            </button>
            {/* logo */}
            <div className="flex items-center mr-auto lg:mr-0 w-48">
              <Link href="/" className="flex items-center gap-1">
                <Image src={LogoIcon} alt="logo" width={55} height={50} />
                <span className="font-medium text-xl font-dmsans mt-2">
                  GoSolar
                </span>
              </Link>
            </div>
            <div className="flex items-center justify-between w-full lg:h-16 h-14">
              <div className="hidden lg:flex justify-center w-[500px] ml-4">
                <Search placeholder="Find a product..." />
              </div>
              <div className="flex h-full ml-auto">
                <div className="user relative lg:block hidden">
                  <button className=" h-full items-center px-4 py-2 flex user__button dark:hover:bg-[#2a2b2f]">
                    <ul className="text-sm">
                      {!user ? (
                        <>
                          <li className="text-left">Welcome</li>
                          <div className="flex">
                            <span>Login</span>
                            <span className="mx-2">/</span>
                            <span>Register</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col">
                            <span className="text-left">My</span>
                            <span className="">Account</span>
                          </div>
                        </>
                      )}
                    </ul>
                    <ChevronDown size={16} className="ml-4" />
                  </button>
                  <div className="user__menu min-w-52 light bg-white dark:bg-[#2a2b2f] shadow-md">
                    {user ? (
                      <>
                        <div className="px-4 py-3">
                          <p className="font-bold">Hi, {user?.firstname}</p>
                        </div>
                        <ul className="text-sm">
                          {user?.isAdmin ||
                            (user?.isSuperAdmin && (
                              <li>
                                <Link
                                  className="flex items-center px-4 py-3 hover:text-primary hover:bg-primary hover:bg-opacity-10 text-center"
                                  href="/admin"
                                >
                                  <MdDashboard className=" h-[1rem] w-[1rem] mr-2" />
                                  Dashboard
                                </Link>
                              </li>
                            ))}
                          <li>
                            <Link
                              className="flex items-center px-4 py-3 hover:text-primary hover:bg-primary hover:bg-opacity-10 text-center"
                              href="/account/profile"
                            >
                              <FaUser className=" h-[1rem] w-[1rem] mr-2" />
                              My Account
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="flex items-center px-4 py-3 hover:text-primary hover:bg-primary hover:bg-opacity-10 text-center"
                              href="/account/orders"
                            >
                              <FaBoxOpen className=" h-[1rem] w-[1rem] mr-2" />
                              Orders
                            </Link>
                          </li>
                          <li>
                            <button
                              className="hover:text-primary w-full flex items-center justify-start py-3 px-4 hover:bg-primary hover:bg-opacity-10"
                              onClick={() => logout()}
                            >
                              <LogOut className=" h-[1rem] w-[1rem] mr-2" />
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
                <Link href="/cart">
                  <button
                    className={`h-full justify-center items-center px-4 py-2 flex hover:text-primary ${
                      isActive("/cart") && "text-primary"
                    }`}
                    onClick={() => setShowMenu(false)}
                  >
                    <div className="size-8 mr-1 relative">
                      <ShoppingCart size={32} />
                      <span className="bg-primary rounded-full text-white text-xs absolute -top-1 -right-1 size-4 flex items-center justify-center">
                        {cartItems?.length}
                      </span>
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          {/* mobile search */}
          <div className="flex lg:hidden items-center w-full container mx-auto px-2 py-1">
            <Search placeholder="Find a product..." />
          </div>
        </div>
        {/* bh-bottom */}
        <div className="w-full h-9">
          <div className="flex items-center container mx-auto px-2 w-full h-full gap-4">
            <div className="md:w-52 h-full relative categories">
              <button className="w-full h-full flex items-center justify-between gap-2 px-2 border-b-2 border-b-primary categories__button">
                <span className="block">Shop By Category</span>
                <Menu size={18} />
              </button>
              <ul className="categories__menu light bg-white dark:bg-[#2a2b2f] shadow-md w-52 text-sm max-h-[70vh] overflow-y-auto">
                {categories.map((cat) => (
                  <li key={cat?._id}>
                    <Link
                      href={`/${cat?.slug}/products`}
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
              {shopNavlist.map((item, i) => (
                <MenuItem key={i} item={item} isActive={isActive} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* mobile menu */}
      <>
        {/* <div
          onClick={toggleShowMenu}
          className={`bg-[#00000056] w-full h-screen absolute top-0 bottom-0 z-40 transition duration-500 ease-linear ${
            showMenu ? "block" : "hidden"
          }`}
        ></div> */}

        <div
          className={`bg-white dark:bg-[#222327] lg:hidden flex flex-col absolute z-50 top-14 bottom-0 -left-full transition-all duration-500 ease-linear h-[calc(100dvh-56px)] w-full px-2 ${
            showMenu ? "left-0" : ""
          }`}
        >
          {/* <div
            onClick={toggleShowMenu}
            className="cursor-pointer ml-auto mx-2 my-2"
          >
            <MdClose size={32} />
          </div> */}

          {!user ? (
            <div className="flex items-center gap-8 w-full px-2 my-4">
              <Link
                href="/account/login"
                className="w-full border border-primary text-primary flex justify-center items-center py-2 font-medium"
              >
                Login
              </Link>
              <Link
                href="/account/register"
                className="w-full border border-primary text-primary flex justify-center items-center py-2 font-medium"
              >
                Signup
              </Link>
            </div>
          ) : (
            <div className="w-full px-2 my-4 flex justify-between">
              <div className="grid grid-cols-[40px_auto] gap-2">
                <div className="bg-primary text-white size-10 flex items-center justify-center rounded-md text-xl font-bold">
                  {user?.firstname[0]}
                </div>
                <div>
                  <p className="font-bold">
                    {user?.firstname + " " + user?.lastname}
                  </p>
                  <p className="text-sm">{user?.email}</p>

                  <Link
                    href="/account/profile"
                    className="text-primary font-semibold"
                    onClick={toggleShowMenu}
                  >
                    Account
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  variant="flat"
                  color="danger"
                  isIconOnly
                  size="sm"
                  onPress={() => logout()}
                  title="Logout"
                >
                  <LogOut className=" h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="grid grid-cols-2">
              <Link href="/account/orders" onClick={toggleShowMenu}>
                <div className="px-4 py-2 border dark:border-gray-700 leading-tight">
                  <p className="">My orders</p>
                  <span className="text-[12px] text-gray-600">
                    Items Ordered
                  </span>
                </div>
              </Link>
              {/* <Link href="">
                <div className="px-4 py-2 border border-l-0 leading-tight">
                  <p className="">My orders</p>
                  <span className="text-[12px] text-gray-600">Items Ordered</span>
                </div>
              </Link> */}
            </div>
          </div>

          <ul className="flex space-y-4 flex-col w-full px-2 mt-8">
            {shopNavlist.map(({ href, label }, i) => {
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

          <div className="flex justify-center items-center flex-col w-full mb-4 mt-auto space-y-4">
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
      </>
    </div>
  );
};

export default HeaderShop;
