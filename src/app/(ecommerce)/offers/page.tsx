import type { Metadata } from "next";
import OffersPageComp from "@/app/(ecommerce)/components/OffersPageComp";

export const metadata: Metadata = {
  title: "Flash Deals & Offers",
  description:
    "Limited-time price slashes on solar panels, inverters, batteries and complete off-grid packages. Shop active GoSolar campaigns before stock runs out.",
};

export default function OffersPage() {
  return <OffersPageComp />;
}
