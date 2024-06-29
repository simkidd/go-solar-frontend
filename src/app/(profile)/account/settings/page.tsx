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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>

      <div>
        <AccountPassordForm />
      </div>
    </div>
  );
};

export default SettingsPage;
