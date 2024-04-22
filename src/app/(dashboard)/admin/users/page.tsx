import { getUsers } from "@/lib/data";
import React from "react";

const UsersPage = async () => {
  const users = await getUsers();
  
  return <div>users page</div>;
};

export default UsersPage;
