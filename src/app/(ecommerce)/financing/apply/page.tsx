import type { Metadata } from "next";
import FinancingApplyClient from "./FinancingApplyClient";

export const metadata: Metadata = {
  title: "Apply for Solar Financing | GoSolar",
  description: "Flexible payment plans to purchase and install solar packages.",
};

export default function FinancingApplyPage() {
  return <FinancingApplyClient />;
}
