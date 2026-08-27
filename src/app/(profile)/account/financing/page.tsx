import type { Metadata } from "next";
import MyFinancingClient from "./MyFinancingClient";

export const metadata: Metadata = {
  title: "My Financing Plans | GoSolar",
  description: "Track and manage your solar financing payments and repayment plans.",
};

export default function MyFinancingPage() {
  return <MyFinancingClient />;
}
