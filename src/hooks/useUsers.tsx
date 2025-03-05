import { User } from "@/interfaces/auth.interface";
import { getUsers } from "@/lib/api/users";
import { useUserStore } from "@/lib/stores/user.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const useUsers = () => {
  const { users, setUsers } = useUserStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => getUsers(),
  });

  const { memoizedUsers } = useMemo(() => {
    if (!data || isLoading || isError) {
      return { memoizedUsers: [] };
    }

    return {
      memoizedUsers: (data as User[]) || [],
    };
  }, [data, isLoading, isError]);

  useEffect(() => {
    if (memoizedUsers.length > 0) {
      setUsers(memoizedUsers);
    } else {
      setUsers([]);
    }
  }, [memoizedUsers, setUsers]);

  return {
    users,
    isLoading,
    refetch,
    isError,
  };
};

export default useUsers;
