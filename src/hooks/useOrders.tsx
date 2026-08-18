"use client";
import { useAllOrdersQuery, useUserOrdersQuery } from "./queries/useOrdersQuery";

const useOrders = () => {
  const allQuery = useAllOrdersQuery({ page: 1, limit: 1000 });
  const userQuery = useUserOrdersQuery();

  return {
    orders: allQuery.data?.orders || [],
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
