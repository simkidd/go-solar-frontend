"use client";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaBlogger, FaBoxOpen, FaShopify } from "react-icons/fa6";
import { MdDashboard, MdRateReview } from "react-icons/md";

const AdminSidebar = () => {
  const { showSidebar, setShowSidebar, collapsed, setCollapsed } =
    useAuthStore();
  const pathname = usePathname();
  const { theme } = useTheme();

  const isActive = (href: string) =>
    href === pathname || href === pathname.replace(/\/$/, "");

  useEffect(() => {
    if (showSidebar) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showSidebar]);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3
      className={`px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider 
      ${showSidebar ? "block" : ""} ${
        collapsed && !showSidebar ? "hidden" : "block"
      }`}
    >
      {children}
    </h3>
  );

  return (
    <>
      <div
        onClick={() => setShowSidebar(false)}
        className={`bg-[#00000056] w-full h-dvh fixed top-0 bottom-0 z-50 transition duration-500 ease-linear ${
          showSidebar ? "block" : "hidden"
        }`}
      ></div>

      <div
        className={`sidebar -left-full flex md:left-0 flex-col fixed top-0 bottom-0 z-50  shadow-md bg-white dark:bg-[#222327] font-roboto ${
          showSidebar ? "left-0" : "w-[220px]"
        } ${collapsed ? "md:w-[80px] w-[220px]" : "w-[220px]"} `}
      >
        <div className="flex items-center justify-between h-16 px-4 transition duration-300">
          <Link href="/" className="flex items-center gap-1">
            <Image src={LogoIcon} alt="logo" width={55} height={50} />
            <span
              className={`font-medium text-xl font-dmsans mt-2 ${
                collapsed && "hidden"
              }`}
            >
              GoSolar
            </span>
          </Link>
        </div>
        <ul className="my-3 space-y-[0.2rem] px-1 text-base">
          <SectionTitle>Dashboard</SectionTitle>
          <li>
            <Link
              href="/admin"
              className={`w-full flex items-center p-2 px-4 transition-all duration-300 rounded-lg ${
                isActive("/admin")
                  ? "text-primary bg-primary bg-opacity-10"
                  : "hover:text-primary hover:bg-primary hover:bg-opacity-10"
              }`}
              onClick={() => setShowSidebar(false)}
            >
              <MdDashboard
                className={`text-lg  ${collapsed && "md:mx-auto md:text-2xl"}`}
              />
              <span className={`ml-3 ${collapsed ? "md:hidden" : ""}`}>
                Overview
              </span>
            </Link>
          </li>

          <SectionTitle>Shop Management</SectionTitle>
          <li>
            <Link
              href="/admin/products"
              className={`flex items-center p-2 px-4 transition-all duration-300 rounded-lg ${
                isActive("/admin/products")
                  ? "text-primary bg-primary bg-opacity-10"
                  : "hover:text-primary hover:bg-primary hover:bg-opacity-10"
              }`}
              onClick={() => setShowSidebar(false)}
            >
              <FaShopify
                className={`text-lg  ${collapsed && "md:mx-auto md:text-2xl"}`}
              />
              <span className={`ml-3 ${collapsed ? "md:hidden" : ""}`}>
                Products
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/categories"
              className={`flex items-center p-2 px-4 transition-all duration-300 rounded-lg ${
                isActive("/admin/categories")
                  ? "text-primary bg-primary bg-opacity-10"
                  : "hover:text-primary hover:bg-primary hover:bg-opacity-10"
              }`}
              onClick={() => setShowSidebar(false)}
            >
              <FaShopify
                className={`text-lg  ${collapsed && "md:mx-auto md:text-2xl"}`}
              />
              <span className={`ml-3 ${collapsed ? "md:hidden" : ""}`}>
                Categories
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/orders"
              className={`flex items-center p-2 px-4 transition-all duration-300 rounded-lg ${
                isActive("/admin/orders")
                  ? "text-primary bg-primary bg-opacity-10"
                  : "hover:text-primary hover:bg-primary hover:bg-opacity-10"
              }`}
              onClick={() => setShowSidebar(false)}
            >
              <FaBoxOpen
                className={`text-lg  ${collapsed && "md:mx-auto md:text-2xl"}`}
              />
              <span className={`ml-3 ${collapsed ? "md:hidden" : ""}`}>
                Orders
              </span>
            </Link>
          </li>

          <SectionTitle>User Management</SectionTitle>
          <li>
            <Link
              href="/admin/users"
              className={`flex items-center p-2 px-4 transition-all duration-300 rounded-lg ${
                isActive("/admin/users")
                  ? "text-primary bg-primary bg-opacity-10"
                  : "hover:text-primary hover:bg-primary hover:bg-opacity-10"
              }`}
              onClick={() => setShowSidebar(false)}
            >
              <BsPeopleFill
                className={`text-lg  ${collapsed && "md:mx-auto md:text-2xl"}`}
              />
              <span className={`ml-3 ${collapsed ? "md:hidden" : ""}`}>
                Customers
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/reviews"
              className={`flex items-center p-2 px-4 transition-all duration-300 rounded-lg ${
                isActive("/admin/reviews")
                  ? "text-primary bg-primary bg-opacity-10"
                  : "hover:text-primary hover:bg-primary hover:bg-opacity-10"
              }`}
              onClick={() => setShowSidebar(false)}
            >
              <MdRateReview
                className={`text-lg  ${collapsed && "md:mx-auto md:text-2xl"}`}
              />
              <span className={`ml-3 ${collapsed ? "md:hidden" : ""}`}>
                Reviews
              </span>
            </Link>
          </li>

          <SectionTitle>Content Management</SectionTitle>
          <li>
            <Link
              href="/admin/blogs"
              className={`flex items-center p-2 px-4 transition-all duration-300 rounded-lg ${
                isActive("/admin/blogs")
                  ? "text-primary bg-primary bg-opacity-10"
                  : "hover:text-primary hover:bg-primary hover:bg-opacity-10"
              }`}
              onClick={() => setShowSidebar(false)}
            >
              <FaBlogger
                className={`text-lg  ${collapsed && "md:mx-auto md:text-2xl"}`}
              />
              <span className={`ml-3 ${collapsed ? "md:hidden" : ""}`}>
                Blog
              </span>
            </Link>
          </li>
        </ul>

        <div className="mt-auto relative h-20">
          <Button
            isIconOnly
            variant="solid"
            size="sm"
            onPress={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-8 h-8 absolute top-1/2 -translate-y-1/2 -right-3 shadow-md"
            title={`${!collapsed ? "Collapse" : "Expand"}`}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
