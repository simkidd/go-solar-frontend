"use client";
import { useCategoriesQuery, useCategoryTreeQuery } from "./queries/useCategoriesQuery";

const useCategories = () => {
  const catQuery = useCategoriesQuery();
  const treeQuery = useCategoryTreeQuery();

  return {
    categories: catQuery.data || [],
    categoryTree: treeQuery.data || [],
    isLoading: catQuery.isLoading || treeQuery.isLoading,
    isError: catQuery.isError || treeQuery.isError,
    error: catQuery.error || treeQuery.error,
    refetch: () => {
      catQuery.refetch();
      treeQuery.refetch();
    },
  };
};

export default useCategories;
