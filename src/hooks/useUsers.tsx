"use client";
import { useAllUsersQuery, useAdminUsersQuery } from "./queries/useUsersQuery";

const useUsers = () => {
  const allQuery = useAllUsersQuery();
  const adminQuery = useAdminUsersQuery();

  return {
    users: allQuery.data || [],
    admins: adminQuery.data || [],
    isLoading: allQuery.isLoading || adminQuery.isLoading,
    isError: allQuery.isError || adminQuery.isError,
    error: allQuery.error || adminQuery.error,
    refetch: () => {
      allQuery.refetch();
      adminQuery.refetch();
    },
  };
};

export default useUsers;
