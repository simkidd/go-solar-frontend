import React from "react";
import AccountSettingsManager from "@/app/(profile)/components/AccountPassordForm";
import { User } from "lucide-react";

export const metadata = {
  title: "My Profile & Security | GoSolar Admin",
  description: "Manage your personal administrator profile details and security settings",
};

const AdminProfilePage = () => {
  return (
    <div className="space-y-6 max-w-2xl font-inter">
      {/* Title Header */}
      <div className="flex flex-col gap-1 select-none">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          My Profile & Security
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Manage your account credentials, contact phone, and password configurations.
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border/80 shadow-xs rounded-2xl p-6">
        <AccountSettingsManager />
      </div>
    </div>
  );
};

export default AdminProfilePage;
