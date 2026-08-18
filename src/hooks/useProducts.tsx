"use client";
import { useAllProductsQuery, usePublishedProductsQuery } from "./queries/useProductsQuery";

const useProducts = () => {
  const allQuery = useAllProductsQuery({ page: 1, limit: 1000 });
  const publishedQuery = usePublishedProductsQuery({ page: 1, limit: 1000 });

  return {
    products: allQuery.data?.products || [],
    publishedProducts: publishedQuery.data?.products || [],
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
