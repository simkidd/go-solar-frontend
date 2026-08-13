"use client";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import { useSession } from "@/context/SessionContext";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderHeart,
  Package,
  Users,
  Newspaper,
  Tag,
  LogOut,
  Settings,
  ChevronUp,
  User,
  Layers,
  Calculator,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navigationItems = [
  {
    group: "Dashboard",
    items: [
      {
        name: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "Catalog & Packages",
    items: [
      {
        name: "Products",
        href: "/dashboard/products",
        icon: ShoppingBag,
      },
      {
        name: "Categories",
        href: "/dashboard/categories",
        icon: FolderHeart,
      },
      {
        name: "Solar Packages",
        href: "/dashboard/packages",
        icon: Layers,
      },
    ],
  },
  {
    group: "Sales & Inquiries",
    items: [
      {
        name: "Orders",
        href: "/dashboard/orders",
        icon: Package,
      },
      {
        name: "Quote Leads",
        href: "/dashboard/quotes",
        icon: Calculator,
      },
      {
        name: "Sales Offers",
        href: "/dashboard/sales-offers",
        icon: Tag,
      },
    ],
  },
  {
    group: "Content & Proof",
    items: [
      {
        name: "Store Banners",
        href: "/dashboard/banners",
        icon: Sparkles,
      },
      {
        name: "Installation Projects",
        href: "/dashboard/projects",
        icon: Briefcase,
      },
      {
        name: "Customer Reviews",
        href: "/dashboard/reviews",
        icon: MessageSquare,
      },
      {
        name: "Blog Posts",
        href: "/dashboard/blogs",
        icon: Newspaper,
      },
    ],
  },
  {
    group: "User & Access Management",
    items: [
      {
        name: "Customers",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        name: "Admins & Staff",
        href: "/dashboard/admins",
        icon: ShieldCheck,
      },
    ],
  },
];

const SidebarInnerContent = ({
  isCollapsed,
  onItemClick,
}: {
  isCollapsed: boolean;
  onItemClick?: () => void;
}) => {
  const pathname = usePathname();
  const { user, logout } = useSession();

  const isActive = (href: string) =>
    href === pathname || href === pathname.replace(/\/$/, "");

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1a1b1e] select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <Image
            src={LogoIcon}
            alt="GoSolar Logo"
            width={34}
            height={34}
            className="w-8 h-8 shrink-0"
            priority
          />
          {!isCollapsed && (
            <span className="font-bold text-lg font-dmsans tracking-tight text-zinc-900 dark:text-white truncate">
              GoSolar
            </span>
          )}
        </Link>
      </div>

      {/* Main Navigation Links with ScrollArea */}
      <ScrollArea className="flex-1 px-3 py-4">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-5">
            {navigationItems.map((group) => (
              <div key={group.group} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 py-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest truncate">
                    {group.group}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    const linkEl = (
                      <Link
                        href={item.href}
                        onClick={onItemClick}
                        className={`flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                          active
                            ? "bg-primary/10 text-primary font-semibold border-l-3 border-primary rounded-l-none"
                            : "text-zinc-600 dark:text-zinc-300 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        } ${isCollapsed ? "justify-center px-0" : ""}`}
                      >
                        <Icon
                          className={`h-[18px] w-[18px] shrink-0 ${
                            active ? "text-primary" : "text-zinc-500 dark:text-zinc-400"
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="ml-3 truncate">{item.name}</span>
                        )}
                      </Link>
                    );

                    if (isCollapsed) {
                      return (
                        <Tooltip key={item.name}>
                          <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="bg-zinc-900 text-white border-none text-xs font-medium"
                          >
                            {item.name}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return <div key={item.name}>{linkEl}</div>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>
      </ScrollArea>

      {/* Footer Profile Dropdown */}
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-left outline-none transition-colors">
              <Avatar className="h-9 w-9 shrink-0 border border-zinc-200 dark:border-zinc-700">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {user?.firstname?.[0] || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-zinc-900 dark:text-white">
                    {user ? `${user.firstname} ${user.lastname}` : "Admin"}
                  </p>
                  <p className="text-xs text-zinc-500 truncate dark:text-zinc-400">
                    {user?.isSuperAdmin ? "Super Admin" : "Store Admin"}
                  </p>
                </div>
              )}
              {!isCollapsed && <ChevronUp className="h-4 w-4 text-zinc-400 shrink-0 ml-auto" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mb-2">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold truncate">
                  {user ? `${user.firstname} ${user.lastname}` : "Administrator"}
                </p>
                <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href="/account/profile"
                onClick={onItemClick}
                className="flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>My Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50/50 dark:focus:bg-red-950/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Mobile drawer
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="left"
          className="w-72 p-0 bg-white dark:bg-[#1a1b1e] border-r border-zinc-100 dark:border-zinc-800"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation</SheetTitle>
            <SheetDescription>Main navigation menu</SheetDescription>
          </SheetHeader>
          <SidebarInnerContent
            isCollapsed={false}
            onItemClick={() => setOpenMobile(false)}
          />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop in-flow sidebar
  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e] z-30 transition-[width] duration-200 ease-in-out ${
        isCollapsed ? "w-18" : "w-64"
      }`}
    >
      <SidebarInnerContent isCollapsed={isCollapsed} />
    </aside>
  );
};

export default AdminSidebar;
