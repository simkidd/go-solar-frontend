"use client";
import { getUserById } from "@/lib/api/users";
import { formatDate } from "@/utils/helpers";
import { Card, CardBody, Skeleton, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserDetails: React.FC<{ id: string }> = ({ id }) => {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getUserById", id],
    queryFn: async () => getUserById(id),
  });

  if (isLoading) {
    return (
      <>
        {/* Back Button Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-24 rounded-md" />
          <div className="flex items-center gap-2"></div>
        </div>

        {/* User Details Card Skeleton */}
        <Card className="dark:bg-[#222327] shadow-lg rounded-lg">
          <CardBody>
            <div className="space-y-6">
              {/* Basic Information Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-4 w-1/3 mb-2 rounded-md" />
                    <Skeleton className="h-6 w-full rounded-md" />
                  </div>
                ))}
              </div>

              {/* Additional Information Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-4 w-1/3 mb-2 rounded-md" />
                    <Skeleton className="h-6 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Error loading user details. Please try again.
      </div>
    );
  }

  // No User Found
  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        User not found.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/users">
          <button className="px-4 py-2 text-sm flex items-center">
            <ArrowLeft className="mr-2" size={16} />
            Users
          </button>
        </Link>
        <div className="flex items-center gap-2"></div>
      </div>

      {/* User Details Card */}
      <Card className="dark:bg-[#222327] dark:text-white shadow-lg rounded-lg">
        <CardBody>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  First Name
                </p>
                <p className="font-medium">{user.firstname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Name
                </p>
                <p className="font-medium">{user.lastname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-medium">
                  {user.isSuperAdmin
                    ? "Super Admin"
                    : user.isAdmin
                    ? "Admin"
                    : "User"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Verification Status
                </p>
                <p className="font-medium">
                  {user.is_verified ? "Verified" : "Not Verified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Account Created
                </p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="font-medium">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default UserDetails;
