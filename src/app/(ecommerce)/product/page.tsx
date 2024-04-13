import ProductCard from "@/components/ProductCard";
import { Product } from "@/interfaces/product.interface";
import { getProducts } from "@/lib/data";
import Image from "next/image";
import React from "react";

const ProductListPage = async () => {
  const products: Product[] = await getProducts();

  return (
    <div className="w-full">
      <section className="w-full">
        <div className="container mx-auto px-2 py-20">
          {products?.length < 1 ? (
            <p>No product found</p>
          ) : (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
              {products?.map((item) => (
                <ProductCard key={item?.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;
