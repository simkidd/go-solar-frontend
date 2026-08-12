"use client";
import React from "react";
import { getChipColor } from "@/app/(dashboard)/components/OrdersTable";
import { useUserOrdersQuery } from "@/hooks/queries/useOrdersQuery";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Chip } from "@/components/custom/Chip";
import { Spinner } from "@/components/custom/Spinner";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const getBadgeStyles = (status: string) => {
  switch (status) {
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50";
    case "primary":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border-transparent";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-transparent";
  }
};

const UserOrders = () => {
  const { data: userOrders = [], isLoading: loading } = useUserOrdersQuery();

  return (
    <div className="font-inter">
      {loading ? (
        <div className="py-12 flex justify-center">
          <Card className="border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900">
            <CardContent className="p-8">
              <Spinner size="lg" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="divide-y divide-zinc-150 dark:divide-zinc-800">
          {userOrders && userOrders.length > 0 ? (
            userOrders.map((order: any) => (
              <div key={order?._id} className="py-6 first:pt-0 space-y-4">
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                      Order Date: {formatDate(order?.trackingId?.createdAt)}
                    </p>
                    <span className="text-zinc-300 hidden sm:inline">|</span>
                    <Chip className={getBadgeStyles(getChipColor(order?.trackingStatus))}>
                      {order?.trackingStatus}
                    </Chip>
                  </div>
                  <Link href={`/account/orders/${order?.trackingId?.tracking_id}`}>
                    <Button size="sm" className="bg-primary hover:bg-primary/95 text-white font-bold text-[10px] rounded-lg">
                      View Details
                    </Button>
                  </Link>
                </div>

                {/* Sub row */}
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <p>Order ID: <span className="font-bold text-zinc-900 dark:text-white">{order?.trackingId?.tracking_id}</span></p>
                  <p>Total Paid: <span className="font-extrabold text-primary">{formatCurrency(order?.totalPricePaid, "NGN")}</span></p>
                </div>

                {/* Products previews grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-850">
                  {order?.products.map((item: any) => (
                    <div
                      key={item?._id}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 border dark:border-zinc-800 bg-zinc-50">
                        <Image
                          src={item?.product?.images[0].url}
                          alt={item?.product?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
                          {item?.product?.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-medium">Quantity: {item?.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))
          ) : (
            <div className="text-center text-zinc-500 py-12">
              <p className="text-sm font-semibold">You have no order history yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
