import LeaderboardBanner from "@/app/(ecommerce)/components/shop/LeaderboardBanner";
import ProductsList from "@/app/(ecommerce)/components/shop/ProductsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products Catalog | GoSolar",
  description:
    "Browse, filter, and compare premium solar panels, hybrid inverters, batteries, and accessories available at GoSolar.",
};

export default function ProductsPage() {
  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <LeaderboardBanner />
          </div>
          <ProductsList />
        </div>
      </section>
    </div>
  );
}
