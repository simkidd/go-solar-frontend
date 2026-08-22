import React from "react";
import SettingsForm from "../../components/SettingsForm";

export const metadata = {
  title: "Global Store Settings | GoSolar Admin",
  description: "Configure global shop settings, contact info, payment configurations, and appliance sizing constants",
};

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <SettingsForm />
    </div>
  );
};

export default SettingsPage;
