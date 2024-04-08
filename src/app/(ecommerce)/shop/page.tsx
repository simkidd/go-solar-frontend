import Banner from "@/components/Banner";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/interfaces/product.interface";
import { getProducts } from "@/lib/data";
import React from "react";

const ShopPage = async () => {
  const products: Product[] = await getProducts();

  return (
    <div className="w-full font-inter">
      <Banner />
      <section className="w-full">
        <div className="container mx-auto px-2 py-20">
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
            {products?.map((item) => (
              <ProductCard key={item?.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
