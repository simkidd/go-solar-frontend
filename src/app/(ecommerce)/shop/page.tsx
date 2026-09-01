import Banner from "@/app/(ecommerce)/components/shop/Banner";
import ShopPageComp from "../components/ShopPageComp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GoSolar Storefront | Premium Solar Products",
  description:
    "Shop tier-1 solar panels, hybrid inverters, batteries, and accessories. Certified engineers supply and install professional solar setups.",
};

const ShopPage = () => {
  return (
    <div className="w-full font-inter">
      <Banner />

      <ShopPageComp />
    </div>
  );
};

export default ShopPage;
