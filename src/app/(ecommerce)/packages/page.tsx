import { Metadata } from "next";
import PackagesPageClient from "./PackagesPageClient";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Explore our pre-configured hybrid solar packages designed for houses, apartments, and commercial operations in Nigeria.",
};

const PackagesPage = async () => {
  return <PackagesPageClient />;
};

export default PackagesPage;
