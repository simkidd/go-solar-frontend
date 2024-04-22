"use client";
import { sidelist } from "@/data/sidebarData";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState("");

  const isActive = (href: string) => {
    return href === pathname || href === pathname.replace(/\/$/, "");
  };

  const toggleExpand = (href: string) => {
    setExpandedItem(expandedItem === href ? "" : href);
  };

  return (
    <div className="-left-full flex md:left-0 flex-col h-screen fixed top-0 bottom-0 z-50 lg:w-[220px] md:w-[80px] w-[220px] transition-all duration-500 ease-linear shadow-md bg-white dark:bg-[#222327]">
      <div className="h-14 md:h-16 flex items-center lg:justify-center px-3">
        GoSolar
      </div>
      <ul className="my-3 space-y-[0.2rem] overflow-x-hidden px-1">
        {sidelist.map((item, i) => (
          <li key={i}>
            <div
              className={`flex items-center justify-start md:justify-center lg:justify-start w-full px-4 dark:hover:bg-white hover:text-default bg-transparent border-0 rounded-lg transition duration-300 ease-in-out shadow-none py-2 gap-2 ${
                isActive(item.href) ? "!bg-primary" : ""
              }`}
            >
              <Link href={item.href} className="w-full flex items-center space-x-2">
                <span>
                  <item.icon size={18} />
                </span>
                <span className="md:hidden lg:block">{item.label}</span>
              </Link>

              {item.children && (
                <button
                  className="ms-auto"
                  onClick={() =>
                    item.children ? toggleExpand(item.label) : null
                  }
                >
                  <ChevronDown />
                </button>
              )}
            </div>
            {item.children && expandedItem === item.label && (
              <ul className="py-1 light bg-[#f1f1f1] dark:bg-[#2a2b2f]">
                {item.children.map(({ href, label }, i) => (
                  <li key={i} className={`${isActive(href) && "!bg-primary"}`}>
                    <Link
                      href={href}
                      className="block py-2 ps-8 dark:hover:bg-white hover:text-default "
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
