"use client";
import React from "react";
import { getUserById } from "@/lib/api/users.api";
import { formatDate } from "@/utils/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Mail, Phone, Calendar, ShieldCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";

const UserDetails: React.FC<{ id: string }> = ({ id }) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getUserById", id],
    queryFn: async () => getUserById(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        <Card className="dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-1/4 rounded-md" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-red-500 font-medium">
        Error loading user details. Please try again.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-medium">
        User not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <Card className="dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-8">
          {/* Top Banner Info */}
          <div className="flex items-center gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {user.firstname} {user.lastname}
              </h2>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold mt-1 ${
                user.isSuperAdmin 
                  ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                  : user.isAdmin
                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
              }`}>
                {user.isSuperAdmin ? "Super Admin" : user.isAdmin ? "Admin" : "Customer"}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Contact Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Email Address</p>
                    <p className="font-semibold mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Phone className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Phone Number</p>
                    <p className="font-semibold mt-0.5">{user.phoneNumber || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Metadata */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Security & Dates</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  {user.is_verified ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-xs text-zinc-400">Verification Status</p>
                    <p className="font-semibold mt-0.5">{user.is_verified ? "Verified" : "Not Verified"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Account Created</p>
                    <p className="font-semibold mt-0.5">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-400">Last Profile Update</p>
                    <p className="font-semibold mt-0.5">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
