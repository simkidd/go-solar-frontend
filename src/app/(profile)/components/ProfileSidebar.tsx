"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  DollarSign,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth.store";

interface SidebarMenu {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navList: SidebarMenu[] = [
  { label: "Overview", href: "/account/profile", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

const ProfileSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    return (
      href === pathname ||
      href === pathname.replace(/\/$/, "") ||
      pathname.startsWith(href + "/")
    );
  };

  return (
    <div className="w-full bg-card border border-border/80 rounded-2xl p-4 sticky left-0 top-28 shadow-xs font-inter transition-all duration-300 space-y-6">
      {/* User Info Header Block */}
      <div className="flex items-center gap-3 px-2 py-3 border-b border-border/60">
        <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm ">
          {user?.firstname ? user.firstname[0].toUpperCase() : "U"}
        </div>
        <div className="overflow-hidden ">
          <h4 className="font-bold text-xs text-foreground leading-snug truncate">
            {user?.firstname} {user?.lastname}
          </h4>
          <p className="text-[10px] text-muted-foreground lowercase leading-none truncate">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <ul className="space-y-1">
        {navList.map((nav, i) => {
          const active = isActive(nav.href);
          const Icon = nav.icon;
          return (
            <li key={i}>
              <Link
                href={nav.href}
                className={`flex items-center px-4 py-2.5 gap-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200  cursor-pointer ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 ${active ? "text-primary" : "text-muted-foreground"}`}
                />
                <span>{nav.label}</span>
              </Link>
            </li>
          );
        })}

        {/* Separator & Logout Button */}
        <li className="pt-2 mt-2 border-t border-border/60">
          <button
            onClick={() => logout()}
            className="w-full flex items-center px-4 py-2.5 gap-3 rounded-xl text-xs font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all duration-200  cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 text-rose-500" />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileSidebar;
