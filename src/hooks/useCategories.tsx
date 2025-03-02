import { Category } from "@/interfaces/product.interface";
import { getCategories } from "@/lib/api/products";
import { useProductStore } from "@/lib/stores/product.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const useCategories = () => {
  const { categories, setCategories } = useProductStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => getCategories(),
  });

  const { memoizedCategories } = useMemo(() => {
    if (!data || isLoading || isError) {
      return { memoizedCategories: [] };
    }

    return {
      memoizedCategories: (data as Category[]) || [],
    };
  }, [data, isLoading, isError]);

  useEffect(() => {
    if (memoizedCategories.length > 0) {
      setCategories(memoizedCategories);
    } else {
      setCategories([]);
    }
  }, [memoizedCategories, setCategories]);

  return {
    categories,
    isLoading,
    refetch,
    isError,
  };
};

export default useCategories;
