"use client";
import { useAllOrdersQuery, useUserOrdersQuery } from "./queries/useOrdersQuery";

const useOrders = () => {
  const allQuery = useAllOrdersQuery();
  const userQuery = useUserOrdersQuery();

  return {
    orders: allQuery.data || [],
    userOrders: userQuery.data || [],
    isLoading: allQuery.isLoading || userQuery.isLoading,
    isError: allQuery.isError || userQuery.isError,
    error: allQuery.error || userQuery.error,
    refetch: () => {
      allQuery.refetch();
      userQuery.refetch();
    },
  };
};

export default useOrders;
