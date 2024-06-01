"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import { FaBoxOpen } from "react-icons/fa6";
import { MdDashboard, MdSettings } from "react-icons/md";

interface SidebarMenu {
  label: string;
  href: string;
  icon: IconType;
}

const navList: SidebarMenu[] = [
  { label: "Overview", href: "/account/profile", icon: MdDashboard },
  { label: "Orders", href: "/account/orders", icon: FaBoxOpen },
  { label: "Settings", href: "/account/settings", icon: MdSettings },
];

const ProfileSidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return (
      href === pathname ||
      href === pathname.replace(/\/$/, "") ||
      pathname.startsWith(href + "/")
    );
  };

  return (
    <div className="w-full bg-white dark:bg-[#222327]">
      <ul className="py-2">
        {navList.map((nav, i) => (
          <li key={i}>
            <Link
              href={nav.href}
              className={`flex items-center px-4 py-2 gap-2 transition-colors  ${
                isActive(nav.href)
                  ? "text-primary bg-primary bg-opacity-10"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <nav.icon />
              <span>{nav.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileSidebar;
