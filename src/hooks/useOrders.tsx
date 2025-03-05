import { Order } from "@/interfaces/order.interface";
import { getOrders } from "@/lib/api/orders";
import { useOrderStore } from "@/lib/stores/order.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const useOrders = () => {
  const { orders, setOrders } = useOrderStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => getOrders(),
  });

  const { memoizedOrders } = useMemo(() => {
    if (!data || isLoading || isError) {
      return { memoizedOrders: [] };
    }

    return {
      memoizedOrders: (data as Order[]) || [],
    };
  }, [data, isLoading, isError]);

  useEffect(() => {
    if (memoizedOrders.length > 0) {
      setOrders(memoizedOrders);
    } else {
      setOrders([]);
    }
  }, [memoizedOrders, setOrders]);

  return {
    orders,
    isLoading,
    refetch,
    isError,
  };
};

export default useOrders;
