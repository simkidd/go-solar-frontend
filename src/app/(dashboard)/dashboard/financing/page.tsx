import type { Metadata } from "next";
import AdminFinancingClient from "./AdminFinancingClient";

export const metadata: Metadata = {
  title: "Solar Financing Applications | GoSolar Admin",
  description: "Review applicant profiles, calculate monthly payouts, and approve payment plans.",
};

export default function AdminFinancingDashboard() {
  return (
    <div className="w-full">
      <AdminFinancingClient />
    </div>
  );
}
