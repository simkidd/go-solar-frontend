"use client";
import AdminHeader from "@/app/(dashboard)/components/AdminHeader";
import AdminSidebar from "@/app/(dashboard)/components/AdminSidebar";
import { useAuthStore } from "@/lib/stores/auth.store";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { collapsed } = useAuthStore();

  return (
    <div className="dashboard-layout light bg-[#f1f1f1] dark:bg-[#2a2b2f]">
      <div className="w-full relative">
        <AdminSidebar />
        <div
          className={`inner__wrapper ${
            collapsed ? "collapse" : ""
          }`}
        >
          <AdminHeader />
          <main className="py-5 px-2 md:px-5 w-full">
            <div className="container mx-auto px-2 md:px-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
