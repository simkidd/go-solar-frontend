"use client";
import React from "react";
import ProductsList from "./ProductsList";
import { useProductStore } from "@/lib/stores/product.store";

const CategoryProductsList: React.FC<{ slug: string }> = ({ slug }) => {
  const { products, categories } = useProductStore();

  const publishedProducts = products.filter((product) => product.isPublished);

  const category = categories.find((cat) => cat?.slug === slug);

  const filteredProducts = category
    ? publishedProducts.filter(
        (product) => product?.category?._id === category?._id
      )
    : [];

  return (
    <div className="container mx-auto px-2 py-8">
      <ProductsList
        categories={categories}
        products={filteredProducts}
        category={category}
      />
    </div>
  );
};

export default CategoryProductsList;
