"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaBlogger, FaShopify } from "react-icons/fa6";
import { MdDashboard, MdRateReview } from "react-icons/md";

const AdminSidebar = () => {
  const { showSidebar, setShowSidebar } = useAuthStore();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      setShowSidebar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  });

  const isActive = (href: string) => {
    return href === pathname || href === pathname.replace(/\/$/, "");
  };

  return (
    <div
      ref={sidebarRef}
      className={`sidebar -left-full flex md:left-0 flex-col h-screen fixed top-0 bottom-0 z-50 lg:w-[220px] md:w-[80px] w-[220px] transition-all duration-500 ease-linear shadow-md bg-white dark:bg-[#222327] font-roboto ${
        showSidebar ? "left-0" : ""
      }`}
    >
      <div className="h-14 md:h-16 flex items-center lg:justify-center px-3">
        <Link href="/">GoSolar</Link>
      </div>
      <ul className="my-3 space-y-[0.2rem] px-1 text-base">
        <li>
          <Link
            href="/admin"
            className={`w-full flex items-center space-x-2 px-5 py-2 hover:text-primary hover:bg-primary hover:bg-opacity-10 transition-all duration-500 ${
              isActive("/admin") ? "text-primary bg-primary bg-opacity-10" : ""
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <MdDashboard className="md:mx-auto text-lg md:text-2xl lg:text-lg lg:mx-0" />
            <span className="md:hidden lg:block">Overview</span>
          </Link>
        </li>
        <li className="expand relative">
          <div className="w-full flex items-center space-x-2 px-5 py-2  expand__button">
            <FaShopify className="md:mx-auto text-lg md:text-2xl lg:text-lg lg:mx-0" />
            <span className="md:hidden lg:block">Shop</span>
            <ChevronDown size={16} className="!ml-auto md:hidden lg:block" />
          </div>
          <ul
            className={`expand__menu bg-white dark:bg-[#222327]  md:shadow-md lg:shadow-none`}
          >
            <li>
              <Link
                href="/admin/products"
                className={`py-2 px-5 pl-14 w-full flex hover:text-primary hover:bg-primary hover:bg-opacity-10 hover:transition-all hover:duration-300 ${
                  isActive("/admin/products")
                    ? "text-primary bg-primary bg-opacity-10"
                    : ""
                }`}
                onClick={() => setShowSidebar(false)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories"
                className={`py-2 px-5 pl-14 w-full flex hover:text-primary hover:bg-primary hover:bg-opacity-10 hover:transition-all hover:duration-300 ${
                  isActive("/admin/categories")
                    ? "text-primary bg-primary bg-opacity-10"
                    : ""
                }`}
                onClick={() => setShowSidebar(false)}
              >
                Catgories
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className={`py-2 px-5 pl-14 w-full flex hover:text-primary hover:bg-primary hover:bg-opacity-10 hover:transition-all hover:duration-300 ${
                  isActive("/admin/orders")
                    ? "text-primary bg-primary bg-opacity-10"
                    : ""
                }`}
                onClick={() => setShowSidebar(false)}
              >
                Orders
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link
            href="/admin/users"
            className={`w-full flex items-center space-x-2 px-5 py-2 hover:text-primary hover:bg-primary hover:bg-opacity-10 hover:transition-all hover:duration-300 ${
              isActive("/admin/users")
                ? "text-primary bg-primary bg-opacity-10"
                : ""
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <BsPeopleFill className="md:mx-auto text-lg md:text-2xl lg:text-lg lg:mx-0" />
            <span className="md:hidden lg:block">Customers</span>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/reviews"
            className={`w-full flex items-center space-x-2 px-5 py-2 hover:text-primary hover:bg-primary hover:bg-opacity-10 transition-all duration-500 ${
              isActive("/admin/reviews")
                ? "text-primary bg-primary bg-opacity-10"
                : ""
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <MdRateReview className="md:mx-auto text-lg md:text-2xl lg:text-lg lg:mx-0" />
            <span className="md:hidden lg:block">Reviews</span>
          </Link>
        </li>
        <li className="expand relative">
          <div className="w-full flex items-center space-x-2 px-5 py-2 expand__button">
            <FaBlogger className="md:mx-auto text-lg md:text-2xl lg:text-lg lg:mx-0" />
            <span className="md:hidden lg:block">Blog</span>
            <ChevronDown size={16} className="!ml-auto md:hidden lg:block" />
          </div>
          <ul
            className={`expand__menu bg-white dark:bg-[#222327]  md:shadow-md lg:shadow-none`}
          >
            <li>
              <Link
                href="/admin/blogs"
                className={`py-2 px-4 pl-14 w-full flex hover:text-primary hover:bg-primary hover:bg-opacity-10  ${
                  isActive("/admin/blogs")
                    ? "text-primary bg-primary bg-opacity-10"
                    : ""
                }`}
                onClick={() => setShowSidebar(false)}
              >
                Posts
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
