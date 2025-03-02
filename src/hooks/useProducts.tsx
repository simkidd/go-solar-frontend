import { Product } from "@/interfaces/product.interface";
import { getProducts } from "@/lib/api/products";
import { useProductStore } from "@/lib/stores/product.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const useProducts = () => {
  const { products, setProducts } = useProductStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => getProducts(),
  });

  const { memoizedProducts } = useMemo(() => {
    if (!data || isLoading || isError) {
      return { memoizedProducts: [] };
    }

    return {
      memoizedProducts: (data as Product[]) || [],
    };
  }, [data, isLoading, isError]);

  useEffect(() => {
    if (memoizedProducts.length > 0) {
      setProducts(memoizedProducts);
    } else {
      setProducts([]);
    }
  }, [memoizedProducts, setProducts]);

  return {
    products,
    isLoading,
    refetch,
    isError,
  };
};

export default useProducts;
