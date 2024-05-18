"use client";
import { Product } from "@/interfaces/product.interface";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Skeleton } from "@nextui-org/skeleton";

const SearchResultList: React.FC<{ query: string; products: Product[] }> = ({
  query,
  products,
}) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setTimeout(() => {
        const filteredResults = products.filter((product) =>
          product?.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
        setLoading(false);
      },1000);
    } else {
      setResults([]);
    }
  }, [query, products]);

  return (
    <div className="container mx-auto py-8">
      {loading ? (
        <div className="grid grid-cols-5 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="mb-1">
                <Skeleton className="w-full h-44" />
              </div>
              <div className="px-2">
                <Skeleton className="h-4 w-4/5 rounded-lg mb-2" />
                <Skeleton className="h-5 w-2/5 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-5 gap-4">
          {results.map((product) => (
            <ProductCard key={product?._id} item={product} />
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResultList;
