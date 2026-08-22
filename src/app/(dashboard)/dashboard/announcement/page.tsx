import React from "react";
import AnnouncementForm from "../../components/AnnouncementForm";

export const metadata = {
  title: "Announcement Bar Settings | GoSolar Admin",
  description: "Manage the global announcement banner notice shown at the top of the storefront",
};

const AnnouncementPage = () => {
  return (
    <div className="space-y-6">
      <AnnouncementForm />
    </div>
  );
};

export default AnnouncementPage;
