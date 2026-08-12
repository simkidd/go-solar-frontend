"use client";
import React from "react";
import { getChipColor } from "@/app/(dashboard)/components/OrdersTable";
import { useUserOrdersQuery } from "@/hooks/queries/useOrdersQuery";
import { useUpdateOrderStatusMutation } from "@/hooks/mutations/useOrderMutations";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/custom/Chip";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";

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

const AccountOrderDetails: React.FC<{
  id: string;
}> = ({ id }) => {
  const { data: userOrders = [] } = useUserOrdersQuery();
  const updateStatusMutation = useUpdateOrderStatusMutation();
  const router = useRouter();

  const order = userOrders.find(
    (order: any) => order?.trackingId?.tracking_id === id
  );

  if (!order) {
    notFound();
  }

  const totalDeliveryFee = order?.products.reduce(
    (sum: number, item: any) => sum + (item?.deliveryFee || 0),
    0
  );

  const handleConfirmReceipt = () => {
    updateStatusMutation.mutate({
      trackingLevel: 3,
      trackingId: order?.trackingId?._id,
    });
  };

  return (
    <div className="container mx-auto px-4 py-4 font-inter">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="mr-4 rounded-full h-10 w-10 shrink-0"
        >
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Order Details</h2>
      </div>

      <div className="mb-8 border border-zinc-150 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900">
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-150 dark:border-zinc-850">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Order Information</h3>
        </div>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-850/80 px-6 text-xs font-semibold text-zinc-650 dark:text-zinc-400">
          <li className="flex justify-between py-3.5">
            <span>Order ID</span>
            <span className="font-extrabold text-zinc-900 dark:text-white">{order?.trackingId?.tracking_id}</span>
          </li>
          <li className="flex justify-between py-3.5">
            <span>Order Date</span>
            <span className="font-bold">{formatDate(order?.createdAt)}</span>
          </li>
          <li className="flex justify-between py-3.5">
            <span>Tracking ID</span>
            <span className="font-bold">{order?.trackingId?.tracking_id}</span>
          </li>
          <li className="flex justify-between py-3.5">
            <span>Delivery Fee</span>
            <span className="font-bold">{formatCurrency(totalDeliveryFee, "NGN")}</span>
          </li>
          <li className="flex justify-between py-3.5 text-sm font-extrabold text-zinc-900 dark:text-white">
            <span>Total Amount</span>
            <span className="text-primary">{formatCurrency(order?.totalPricePaid, "NGN")}</span>
          </li>
        </ul>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-zinc-150 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900">
          <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-150 dark:border-zinc-850">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Payment Information</h3>
          </div>
          <div className="space-y-4 px-6 py-4 text-xs font-semibold text-zinc-650 dark:text-zinc-400">
            <div>
              <p className="font-bold text-zinc-400 uppercase tracking-widest text-[10px] mb-1">Payment Method</p>
              <span className="capitalize text-zinc-900 dark:text-white text-xs">{order?.paymentMethod}</span>
            </div>
            <div>
              <p className="font-bold text-zinc-400 uppercase tracking-widest text-[10px] mb-1.5">Payment Details</p>
              <div className="space-y-1 pl-1">
                <div className="flex justify-between max-w-xs">
                  <span>Items Total:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-250">{formatCurrency(order?.totalPricePaid, "NGN")}</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span>Shipping Fee:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-250">{formatCurrency(totalDeliveryFee, "NGN")}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between max-w-xs pt-3 border-t dark:border-zinc-850 text-sm font-extrabold text-zinc-950 dark:text-white">
              <span>Total Price:</span>
              <span className="text-primary">{formatCurrency(order?.totalPricePaid, "NGN")}</span>
            </div>
          </div>
        </div>

        <div className="border border-zinc-150 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900">
          <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-150 dark:border-zinc-850">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Delivery Address</h3>
          </div>
          <div className="px-6 py-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400 space-y-1.5">
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
              {order?.user?.firstname + " " + order?.user?.lastname}
            </p>
            <p>{order?.deliveryDetails?.suiteNumber}</p>
            <p>{order?.deliveryDetails?.streetAddress}</p>
            <p>{order?.deliveryDetails?.city}</p>
            <p>{order?.deliveryDetails?.zipCode}</p>
            <p className="pt-2 border-t dark:border-zinc-850 font-bold">{order?.user?.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 border border-zinc-150 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900">
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-150 dark:border-zinc-850 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Items Ordered</h3>
          <div className="flex gap-3 items-center">
            <Chip className={getBadgeStyles(getChipColor(order?.trackingStatus))}>
              {order?.trackingStatus}
            </Chip>

            <Link
              href={`${order?.trackingId?.tracking_id}/track`}
              className="text-xs font-bold hover:underline text-primary"
            >
              Track Order
            </Link>
          </div>
        </div>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-850/80">
          {order?.products.map((item: any) => (
            <li
              key={item?._id}
              className="flex gap-4 py-4 px-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative border dark:border-zinc-800 bg-zinc-50">
                <Image
                  src={item?.product?.images[0].url}
                  alt={item?.product?.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                  {item?.product?.name}
                </span>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-zinc-950 dark:text-white">
                    {formatCurrency(item?.product?.price, "NGN")}
                  </span>
                  <span className="text-zinc-400 font-semibold">
                    Qty: {item?.qty}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {order?.trackingLevel === 2 && (
        <div className="flex justify-end gap-4 items-center pt-4 border-t border-zinc-100 dark:border-zinc-850">
          <p className="text-xs font-semibold text-zinc-400">Have you received your order?</p>
          <Button
            className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6"
            disabled={updateStatusMutation.isPending}
            onClick={handleConfirmReceipt}
          >
            Confirm Receipt
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountOrderDetails;
