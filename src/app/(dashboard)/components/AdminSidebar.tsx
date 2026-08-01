"use client";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutDashboard, ShoppingBag, FolderHeart, Package, Users, MessageSquare, Newspaper, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const AdminSidebar = () => {
  const { showSidebar, setShowSidebar, collapsed, setCollapsed } =
    useAuthStore();
  const pathname = usePathname();

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
      className={`px-4 mt-4 mb-2 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-all duration-300
      ${showSidebar ? "block" : ""} ${
        collapsed && !showSidebar ? "md:opacity-0 md:h-0 overflow-hidden" : "block"
      }`}
    >
      {children}
    </h3>
  );

  return (
    <>
      {/* Sidebar mobile overlay */}
      <div
        onClick={() => setShowSidebar(false)}
        className={`bg-black/50 backdrop-blur-sm w-full h-dvh fixed top-0 bottom-0 z-50 transition duration-500 ease-linear md:hidden ${
          showSidebar ? "block" : "hidden"
        }`}
      ></div>

      <div
        className={`sidebar flex flex-col fixed top-0 bottom-0 z-50 shadow-sm border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e] transition-all duration-300 ease-in-out
          ${showSidebar ? "left-0 w-[240px]" : "-left-full md:left-0"} 
          ${collapsed ? "md:w-[80px] w-[240px]" : "w-[240px]"}`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-100 dark:border-zinc-800 transition-all duration-300">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LogoIcon}
              alt="logo"
              width={40}
              height={40}
              className="w-10 h-8"
              priority
            />
            <span
              className={`font-semibold text-lg font-dmsans tracking-tight dark:text-white mt-1 transition-all duration-300 ${
                collapsed && "md:opacity-0 md:w-0 overflow-hidden"
              }`}
            >
              GoSolar
            </span>
          </Link>
        </div>

        {/* Sidebar Nav List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {/* Section 1 */}
          <SectionTitle>Dashboard</SectionTitle>
          <Link
            href="/admin"
            className={`w-full flex items-center h-10 px-4 transition-all duration-200 rounded-lg text-sm font-medium ${
              isActive("/admin")
                ? "text-primary bg-primary/10"
                : "text-zinc-600 dark:text-zinc-300 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <LayoutDashboard className={`h-[18px] w-[18px] min-w-[18px] ${collapsed ? "md:mx-auto" : ""}`} />
            <span className={`ml-3 transition-opacity duration-300 ${collapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"}`}>
              Overview
            </span>
          </Link>

          {/* Section 2 */}
          <SectionTitle>Shop Management</SectionTitle>
          <Link
            href="/admin/products"
            className={`w-full flex items-center h-10 px-4 transition-all duration-200 rounded-lg text-sm font-medium ${
              isActive("/admin/products")
                ? "text-primary bg-primary/10"
                : "text-zinc-600 dark:text-zinc-300 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <ShoppingBag className={`h-[18px] w-[18px] min-w-[18px] ${collapsed ? "md:mx-auto" : ""}`} />
            <span className={`ml-3 transition-opacity duration-300 ${collapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"}`}>
              Products
            </span>
          </Link>

          <Link
            href="/admin/categories"
            className={`w-full flex items-center h-10 px-4 transition-all duration-200 rounded-lg text-sm font-medium ${
              isActive("/admin/categories")
                ? "text-primary bg-primary/10"
                : "text-zinc-600 dark:text-zinc-300 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <FolderHeart className={`h-[18px] w-[18px] min-w-[18px] ${collapsed ? "md:mx-auto" : ""}`} />
            <span className={`ml-3 transition-opacity duration-300 ${collapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"}`}>
              Categories
            </span>
          </Link>

          <Link
            href="/admin/orders"
            className={`w-full flex items-center h-10 px-4 transition-all duration-200 rounded-lg text-sm font-medium ${
              isActive("/admin/orders")
                ? "text-primary bg-primary/10"
                : "text-zinc-600 dark:text-zinc-300 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <Package className={`h-[18px] w-[18px] min-w-[18px] ${collapsed ? "md:mx-auto" : ""}`} />
            <span className={`ml-3 transition-opacity duration-300 ${collapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"}`}>
              Orders
            </span>
          </Link>

          <Link
            href="/admin/sales-offers"
            className={`w-full flex items-center h-10 px-4 transition-all duration-200 rounded-lg text-sm font-medium ${
              isActive("/admin/sales-offers")
                ? "text-primary bg-primary/10"
                : "text-zinc-600 dark:text-zinc-300 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <Tag className={`h-[18px] w-[18px] min-w-[18px] ${collapsed ? "md:mx-auto" : ""}`} />
            <span className={`ml-3 transition-opacity duration-300 ${collapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"}`}>
              Sales Offers
            </span>
          </Link>

          {/* Section 3 */}
          <SectionTitle>Users</SectionTitle>
          <Link
            href="/admin/users"
            className={`w-full flex items-center h-10 px-4 transition-all duration-200 rounded-lg text-sm font-medium ${
              isActive("/admin/users")
                ? "text-primary bg-primary/10"
                : "text-zinc-600 dark:text-zinc-300 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <Users className={`h-[18px] w-[18px] min-w-[18px] ${collapsed ? "md:mx-auto" : ""}`} />
            <span className={`ml-3 transition-opacity duration-300 ${collapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"}`}>
              Customers
            </span>
          </Link>

          {/* Section 4 */}
          <SectionTitle>Content</SectionTitle>
          <Link
            href="/admin/blogs"
            className={`w-full flex items-center h-10 px-4 transition-all duration-200 rounded-lg text-sm font-medium ${
              isActive("/admin/blogs")
                ? "text-primary bg-primary/10"
                : "text-zinc-600 dark:text-zinc-300 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <Newspaper className={`h-[18px] w-[18px] min-w-[18px] ${collapsed ? "md:mx-auto" : ""}`} />
            <span className={`ml-3 transition-opacity duration-300 ${collapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"}`}>
              Blog Posts
            </span>
          </Link>
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <div className="mt-auto p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-9 w-9 text-zinc-500 hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
