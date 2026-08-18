import { Metadata } from "next";
import React from "react";
import AccountPassordForm from "../../components/AccountPassordForm";

const pageTitle = "Account Settings";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
        Account Settings
      </h1>

      <div>
        <AccountPassordForm />
      </div>
    </div>
  );
};

export default SettingsPage;
