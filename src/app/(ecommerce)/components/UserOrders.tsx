"use client";

import React, { useState, useMemo } from "react";
import { getChipColor } from "@/app/(dashboard)/components/OrdersTable";
import { useUserOrdersQuery } from "@/hooks/queries/useOrdersQuery";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Chip } from "@/components/custom/Chip";
import { Spinner } from "@/components/custom/Spinner";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Package,
  Calendar,
  Tag,
  CreditCard,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [activeTab, setActiveTab] = useState<
    "All" | "Processing" | "Delivered" | "Received"
  >("All");

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return userOrders;
    return userOrders.filter(
      (order: any) => order?.trackingStatus === activeTab,
    );
  }, [userOrders, activeTab]);

  return (
    <div className="font-inter space-y-6">
      {/* ── Status Tabs Filters ── */}
      <div className="flex border-b border-border/60 pb-px gap-1.5 overflow-x-auto no-scrollbar">
        {(["All", "Processing", "Delivered", "Received"] as const).map(
          (tab) => {
            const count =
              tab === "All"
                ? userOrders.length
                : userOrders.filter((o: any) => o?.trackingStatus === tab)
                    .length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "All" ? "All Orders" : tab}
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                    activeTab === tab
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          },
        )}
      </div>

      {/* ── Main List Content ── */}
      {loading ? (
        <div className="py-16 flex flex-col justify-center items-center gap-3">
          <Spinner size="lg" />
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest animate-pulse">
            Loading orders...
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
              <div
                key={order?._id}
                className="border border-border/80 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10 hover:border-primary/30 transition-colors duration-300"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 px-6 py-4 bg-muted/30 border-b border-border/60">
                  <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground font-bold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {formatDate(order?.trackingId?.createdAt)}
                    </span>
                    <span className="hidden sm:inline text-border">|</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-black">
                      ID:{" "}
                      <span className="font-mono text-foreground text-xs select-all">
                        {order?.trackingId?.tracking_id}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Chip
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        getBadgeStyles(getChipColor(order?.trackingStatus)),
                      )}
                    >
                      {order?.trackingStatus}
                    </Chip>
                    <Link
                      href={`/account/orders/${order?.trackingId?.tracking_id}`}
                    >
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase tracking-wider h-8 rounded-lg cursor-pointer"
                      >
                        View Details
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border/60">
                    {order?.products.map((item: any) => (
                      <div
                        key={item?._id}
                        className="flex items-center gap-3.5 group"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-border bg-zinc-50 dark:bg-zinc-800">
                          <Image
                            src={
                              item?.product?.images?.[0]?.url ||
                              "/placeholder-product.jpg"
                            }
                            alt={item?.product?.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-0.5 overflow-hidden">
                          <p className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {item?.product?.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 ">
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                              Qty:{" "}
                              <span className="font-extrabold text-foreground">
                                {item?.qty}
                              </span>
                            </p>
                            <span
                              className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                                !item?.product?.category
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                                  : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700/50"
                              }`}
                            >
                              {!item?.product?.category ? "Package" : "Product"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground font-bold">
                    <span className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-extrabold">
                      <CreditCard className="h-3.5 w-3.5 text-primary" />
                      Total Paid
                    </span>
                    <span className="text-sm font-black text-primary">
                      {formatCurrency(order?.totalPricePaid, "NGN")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl flex flex-col justify-center items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground ">
                <Package className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-wider text-foreground">
                  No orders found
                </p>
                <p className="text-[10px] text-muted-foreground">
                  You do not have any orders matching the "{activeTab}" filter.
                </p>
              </div>
              <Link href="/shop" className="pt-2">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 font-bold text-[10px] uppercase tracking-widest rounded-full h-8 px-4 cursor-pointer"
                >
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
