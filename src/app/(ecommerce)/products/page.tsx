import Cta from "@/app/(ecommerce)/components/shop/Cta";
import ProductsList from "@/app/(ecommerce)/components/shop/ProductsList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | GoSolar",
  description: "Browse all premium solar panels, hybrid inverters, batteries, and accessories available at GoSolar.",
};

const AllProductsPage = () => {
  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Cta />
          </div>
          <ProductsList />
        </div>
      </section>
    </div>
  );
};

export default AllProductsPage;
