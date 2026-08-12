"use client";
import { useAllProductsQuery, usePublishedProductsQuery } from "./queries/useProductsQuery";

const useProducts = () => {
  const allQuery = useAllProductsQuery();
  const publishedQuery = usePublishedProductsQuery();

  return {
    products: allQuery.data || [],
    publishedProducts: publishedQuery.data || [],
    isLoading: allQuery.isLoading || publishedQuery.isLoading,
    isError: allQuery.isError || publishedQuery.isError,
    error: allQuery.error || publishedQuery.error,
    refetch: () => {
      allQuery.refetch();
      publishedQuery.refetch();
    },
  };
};

export default useProducts;
