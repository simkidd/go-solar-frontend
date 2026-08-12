"use client";
import AdminHeader from "@/app/(dashboard)/components/AdminHeader";
import AdminSidebar from "@/app/(dashboard)/components/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-50/50 dark:bg-zinc-950/50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
