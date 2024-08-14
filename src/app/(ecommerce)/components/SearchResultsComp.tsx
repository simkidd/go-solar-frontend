"use client";
import React from "react";
import ProductsList from "./ProductsList";
import { useProductStore } from "@/lib/stores/product.store";
import { notFound } from "next/navigation";

const SearchResultsComp = ({ query }: { query: string }) => {
  const { products, categories } = useProductStore();

  const publishedProducts = products.filter((product) => product.isPublished);

  const searchWords = query.toLowerCase().split(" ");

  const filteredResults = publishedProducts?.filter((product) => {
    const productName = product?.name.toLowerCase();
    return searchWords.every((word) => productName.includes(word));
  });

  if (!filteredResults) {
    notFound();
  }

  return (
    <div className="container mx-auto px-2 py-8">
      <ProductsList categories={categories} products={filteredResults} />
    </div>
  );
};

export default SearchResultsComp;
