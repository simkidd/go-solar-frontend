"use client";
import { User } from "@/interfaces/auth.interface";
import { axiosInstance } from "@/lib/axios";
import { Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";

const UserDetails: React.FC<{ id: string }> = ({ id }) => {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setLoading(true);
          const { data } = await axiosInstance.get(`/admin/users/${id}`);

          setUser(data.user);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <div>Invalid ID</div>;
  }

  return (
    <div className="w-full font-sans grid grid-cols-12 gap-2">
      <div className="md:col-span-9 col-span-12">
        <div className="grid grid-cols-9 mb-2">
          <div className="col-span-3 md:col-span-2 font-bold">First Name</div>
          <div className="md:col-span-7 col-span-6">{user?.firstname}</div>
        </div>
        <div className="grid grid-cols-9 mb-2">
          <div className="col-span-3 md:col-span-2 font-bold">Last Name</div>
          <div className="md:col-span-7 col-span-6">{user?.lastname}</div>
        </div>

        <div className="grid grid-cols-9 mb-2">
          <div className="col-span-3 md:col-span-2 font-bold">Email</div>
          <div className="md:col-span-7 col-span-6">{user?.email}</div>
        </div>
        <div className="grid grid-cols-9 mb-2">
          <div className="col-span-3 md:col-span-2 font-bold">Phone</div>
          <div className="md:col-span-7 col-span-6">{user?.phoneNumber}</div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
