"use client";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import Search from "@/components/Search";
import { shopNavlist } from "@/data/menuData";
import { useAuthStore } from "@/lib/stores/auth.store";
import useCartStore from "@/lib/stores/cart.store";
import { useProductStore } from "@/lib/stores/product.store";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  User,
} from "@heroui/react";
import {
  ChevronDown,
  LogOut,
  Mail,
  Menu,
  Phone,
  ShoppingCart,
  Heart,
  User2Icon,
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
import MenuItem from "../../../../components/MenuItem";
import { ThemeSwitcher } from "../../../../components/ThemeSwitcher";
import { useSession } from "@/context/SessionContext";

const HeaderShop = () => {
  const { cartItems } = useCartStore();
  const { user, logout, loading } = useSession();
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
    <div className="w-full font-dmsans sticky top-0 left-0 z-40 bg-white dark:bg-[#222327] shadow-sm">
      {/* Top Bar */}
      <div className="w-full h-8 bg-gray-100 dark:bg-[#2a2b2f] hidden lg:flex items-center text-sm">
        <div className="container mx-auto px-4 flex justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <Mail className="text-primary mr-2" size={14} />
              gosolardotng@gmail.com
            </span>
            <span className="flex items-center">
              <Phone className="text-primary mr-2" size={14} />
              0706 276 2879
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link href="/help" className="hover:text-primary">
              Help & Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full bg-white dark:bg-[#222327] border-b border-gray-200 dark:border-[#2a2b2f]">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center">
            <button
              className="lg:hidden mr-4 text-gray-600 hover:text-primary"
              onClick={toggleShowMenu}
            >
              {!showMenu ? <Menu size={24} /> : <MdClose size={24} />}
            </button>
            <Link href="/" className="flex items-center">
              <Image
                src={LogoIcon}
                alt="logo"
                width={50}
                height={40}
                style={{ width: "50px", height: "40px" }}
              />
              <span className="font-medium text-xl ml-2">GoSolar</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 mx-8 max-w-2xl">
            <Search placeholder="Find a product..." categories={categories} />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
            {loading ? (
              <div className=" flex items-center gap-1">
                <div>
                  <Skeleton className="flex rounded-full w-12 h-12" />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-10 rounded-lg" />
                  <Skeleton className="h-3 w-8 rounded-lg" />
                </div>
              </div>
            ) : user ? (
              <Dropdown>
                <DropdownTrigger>
                  <User
                    as="button"
                    className="transition-transform"
                    description="Hello"
                    name={user?.firstname}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="my_account" href="/account/profile">
                    My Account
                  </DropdownItem>
                  <DropdownItem key="orders" href="/account/orders">
                    Orders
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onPress={logout}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Link
                href="/account/login"
                className="hidden lg:flex items-center gap-2 hover:text-primary"
              >
                <User2Icon size={20} />
                <span className="text-sm">Login / Register</span>
              </Link>
            )}
            <Link
              href="/wishlist"
              className="hidden lg:flex items-center gap-2 hover:text-primary"
            >
              <Heart size={20} />
              <span className="text-sm">Wishlist</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 hover:text-primary"
            >
              <ShoppingCart size={20} />
              <span className="text-sm">Cart</span>
              {cartItems.length > 0 && (
                <span className="bg-primary text-white text-xs rounded-full px-1.5 py-0.5">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 py-2">
          <Search placeholder="Find a product..." categories={categories} />
        </div>

        {/* Category Navigation */}
        <div className="hidden lg:flex items-center justify-between bg-gray-100 dark:bg-[#2a2b2f]">
          <div className="container mx-auto px-4 flex items-center h-10">
            <button className="flex items-center gap-2 text-gray-600 hover:text-primary">
              <Menu size={20} />
              <span>Shop By Category</span>
            </button>
            <ul className="flex items-center space-x-8 ml-8">
              {shopNavlist.map((item, i) => (
                <MenuItem key={i} item={item} isActive={isActive} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-white dark:bg-[#222327] z-50 transform transition-transform duration-300 ${
          showMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-end">
            <button
              onClick={toggleShowMenu}
              className="text-gray-600 hover:text-primary"
            >
              <MdClose size={24} />
            </button>
          </div>
          <ul className="mt-4 space-y-4">
            {shopNavlist.map(({ href, label }, i) => (
              <li key={i}>
                <Link
                  href={href}
                  className={`block py-2 hover:text-primary ${
                    isActive(href) ? "text-primary" : ""
                  }`}
                  onClick={toggleShowMenu}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeaderShop;
