"use client";
import React, { useState } from "react";
import {
  Order,
  TrackingStatus,
  UpdateTrackingStatus,
} from "@/interfaces/order.interface";
import { formatCurrency, formatDateTime } from "@/utils/helpers";
import { Mail, Phone, MapPin, CreditCard, ChevronRight, PackageCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getChipStyles } from "./OrdersTable";
import { useUpdateOrderStatusMutation } from "@/hooks/mutations/useOrderMutations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrderDetails: React.FC<{
  order: Order;
}> = ({ order }) => {
  const updateStatusMutation = useUpdateOrderStatusMutation();
  const router = useRouter();
  const [input, setInput] = useState<UpdateTrackingStatus>({
    trackingLevel: 1,
    trackingId: order?.trackingId?._id,
  });

  const handleUpdateTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    updateStatusMutation.mutate(input);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-[#1a1b1e] p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            Order ID: <span className="font-mono text-lg text-primary">#{order?.trackingId?.tracking_id}</span>
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Placed on: {formatDateTime(order?.trackingId?.createdAt as string)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getChipStyles(order?.trackingStatus)}`}>
            {order?.trackingStatus}
          </span>
        </div>
      </div>

      {/* Ordered Items Layout */}
      <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <CardTitle className="text-base font-bold dark:text-white">
            Ordered Items ({order?.products.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-zinc-100 dark:divide-zinc-800/80 p-0">
          {order?.products.map((item) => (
            <div
              key={item?._id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 hover:bg-zinc-50/20 dark:hover:bg-zinc-800/5 transition-colors"
            >
              <div className="flex gap-4">
                <div className="h-16 w-16 min-w-16 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 relative bg-zinc-50 dark:bg-zinc-900">
                  <Image
                    src={item?.product?.images[0].url}
                    alt={item?.product?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-1">
                    {item?.product?.name}
                  </h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Quantity: <span className="font-semibold text-zinc-700 dark:text-zinc-300">x{item?.qty}</span>
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 md:line-clamp-2 line-clamp-1 max-w-xl">
                    {item?.product?.description}
                  </p>
                </div>
              </div>
              <div className="flex md:flex-col justify-between items-end gap-2 text-right">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Price: {formatCurrency(item?.product?.price, "NGN")}
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-500">
                  Delivery Fee: {formatCurrency(item?.deliveryFee, "NGN")}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Details Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Address Card */}
        <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <CardTitle className="text-sm font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              Customer & Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-base">
                {order?.user?.firstname + " " + order?.user?.lastname}
              </h4>
              <div className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-zinc-400" />
                  {order?.user?.phoneNumber || "No phone listed"}
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  {order?.user?.email}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
              <h5 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Delivery Address</h5>
              <div className="text-sm text-zinc-800 dark:text-zinc-200 space-y-0.5">
                {order?.deliveryDetails?.suiteNumber && (
                  <p>{order?.deliveryDetails?.suiteNumber}</p>
                )}
                <p>{order?.deliveryDetails?.streetAddress}</p>
                <p>{order?.deliveryDetails?.city}</p>
                {order?.deliveryDetails?.zipCode && (
                  <p className="text-xs text-zinc-400 mt-1">Zip: {order?.deliveryDetails?.zipCode}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary Card */}
        <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <CardTitle className="text-sm font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-primary" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col justify-between h-[80%]">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Method</span>
                <span className="font-semibold text-zinc-950 dark:text-white capitalize">{order?.paymentMethod || "Card"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Status</span>
                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-full px-2 py-0.5 font-semibold">
                  Paid
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-6 flex justify-between items-center">
              <span className="text-sm font-bold text-zinc-900 dark:text-white">Total Amount</span>
              <span className="text-lg font-black text-primary">
                {formatCurrency(order?.totalPricePaid as number, "NGN")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Status Form Card */}
        <Card className="bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <CardTitle className="text-sm font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <PackageCheck className="h-4 w-4 text-primary" />
              Tracking Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Status</div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getChipStyles(order?.trackingStatus)}`}>
                  {order?.trackingStatus}
                </span>
              </div>
            </div>

            {/* update order status form */}
            <form onSubmit={handleUpdateTracking} className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Update Status</label>
              <Select
                value={String(input.trackingLevel)}
                onValueChange={(val) => setInput({ ...input, trackingLevel: Number(val) })}
              >
                <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Select tracking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{TrackingStatus.Processing}</SelectItem>
                  <SelectItem value="2">{TrackingStatus.Delivered}</SelectItem>
                  <SelectItem value="3">{TrackingStatus.Received}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="submit"
                disabled={updateStatusMutation.isPending}
                className="w-full bg-primary hover:bg-primary/95 text-white"
              >
                {updateStatusMutation.isPending ? "Updating..." : "Save Tracking Status"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;
