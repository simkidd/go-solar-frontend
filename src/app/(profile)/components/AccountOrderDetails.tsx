"use client";

import React from "react";
import { getChipColor } from "@/app/(dashboard)/components/OrdersTable";
import { useUserOrdersQuery } from "@/hooks/queries/useOrdersQuery";
import { useUpdateOrderStatusMutation } from "@/hooks/mutations/useOrderMutations";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/custom/Chip";
import { ArrowLeft, ShieldCheck, CreditCard, MapPin, PackageOpen } from "lucide-react";
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
    <div className="space-y-6 font-inter">
      
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full h-8 w-8 shrink-0 border-border hover:bg-muted cursor-pointer"
        >
          <ArrowLeft size={14} className="text-muted-foreground" />
        </Button>
        <h2 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">
          Order Details
        </h2>
      </div>

      {/* Order Info Card */}
      <div className="border border-border/85 rounded-2xl overflow-hidden shadow-xs bg-zinc-50/50 dark:bg-zinc-900/10">
        <div className="px-6 py-3.5 bg-muted/40 border-b border-border/80">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-primary" />
            Order Information
          </h3>
        </div>
        <ul className="divide-y divide-border/60 px-6 text-xs font-bold text-muted-foreground">
          <li className="flex justify-between py-3.5">
            <span className="uppercase text-[10px] tracking-wider font-extrabold text-muted-foreground">Order ID</span>
            <span className="font-black text-foreground">{order?.trackingId?.tracking_id}</span>
          </li>
          <li className="flex justify-between py-3.5">
            <span className="uppercase text-[10px] tracking-wider font-extrabold text-muted-foreground">Order Date</span>
            <span className="font-extrabold text-foreground">{formatDate(order?.createdAt)}</span>
          </li>
          <li className="flex justify-between py-3.5">
            <span className="uppercase text-[10px] tracking-wider font-extrabold text-muted-foreground">Tracking ID</span>
            <span className="font-extrabold text-foreground select-all">{order?.trackingId?.tracking_id}</span>
          </li>
          <li className="flex justify-between py-3.5">
            <span className="uppercase text-[10px] tracking-wider font-extrabold text-muted-foreground">Delivery Fee</span>
            <span className="font-extrabold text-foreground">{formatCurrency(totalDeliveryFee, "NGN")}</span>
          </li>
          <li className="flex justify-between py-4 text-sm font-black text-foreground border-t border-border">
            <span className="uppercase text-xs tracking-wider font-black">Total Paid Amount</span>
            <span className="text-primary">{formatCurrency(order?.totalPricePaid, "NGN")}</span>
          </li>
        </ul>
      </div>

      {/* Payment & Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Payment Info */}
        <div className="border border-border/85 rounded-2xl overflow-hidden shadow-xs bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="px-6 py-3.5 bg-muted/40 border-b border-border/80">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5 text-primary" />
              Payment Details
            </h3>
          </div>
          <div className="space-y-4 px-6 py-4 text-xs font-bold text-muted-foreground">
            <div>
              <p className="font-extrabold text-muted-foreground/60 uppercase tracking-widest text-[9px] mb-1">Method</p>
              <span className="capitalize text-foreground font-black text-xs">{order?.paymentMethod}</span>
            </div>
            <div>
              <p className="font-extrabold text-muted-foreground/60 uppercase tracking-widest text-[9px] mb-1.5">Breakdown</p>
              <div className="space-y-1 pl-1">
                <div className="flex justify-between max-w-xs">
                  <span>Items Base Total:</span>
                  <span className="font-extrabold text-foreground">{formatCurrency(order?.totalPricePaid - totalDeliveryFee, "NGN")}</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span>Shipping/Delivery:</span>
                  <span className="font-extrabold text-foreground">{formatCurrency(totalDeliveryFee, "NGN")}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between max-w-xs pt-3 border-t border-border/60 text-sm font-black text-foreground">
              <span>Total Price:</span>
              <span className="text-primary">{formatCurrency(order?.totalPricePaid, "NGN")}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="border border-border/85 rounded-2xl overflow-hidden shadow-xs bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="px-6 py-3.5 bg-muted/40 border-b border-border/80">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-primary" />
              Delivery Location
            </h3>
          </div>
          <div className="px-6 py-4 text-xs font-bold text-muted-foreground space-y-1.5">
            <p className="text-sm font-black text-foreground">
              {order?.user?.firstname} {order?.user?.lastname}
            </p>
            <p className="font-semibold">{order?.deliveryDetails?.suiteNumber}</p>
            <p className="font-semibold">{order?.deliveryDetails?.streetAddress}</p>
            <p className="font-semibold">{order?.deliveryDetails?.city}</p>
            <p className="font-semibold">{order?.deliveryDetails?.zipCode}</p>
            <p className="pt-2 border-t border-border/60 font-black text-foreground">{order?.user?.phoneNumber}</p>
          </div>
        </div>

      </div>

      {/* Items Ordered Card */}
      <div className="border border-border/85 rounded-2xl overflow-hidden shadow-xs bg-zinc-50/50 dark:bg-zinc-900/10">
        <div className="px-6 py-3.5 bg-muted/40 border-b border-border/80 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
            <PackageOpen className="h-4.5 w-4.5 text-primary" />
            Items Ordered
          </h3>
          <div className="flex gap-4 items-center">
            <Chip className={getBadgeStyles(getChipColor(order?.trackingStatus))}>
              {order?.trackingStatus}
            </Chip>

            <Link
              href={`${order?.trackingId?.tracking_id}/track`}
              className="text-[10px] font-black uppercase tracking-wider hover:underline text-primary cursor-pointer"
            >
              Track Progress
            </Link>
          </div>
        </div>
        <ul className="divide-y divide-border/60">
          {order?.products.map((item: any) => (
            <li
              key={item?._id}
              className="flex gap-4 py-4 px-6 hover:bg-muted/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative border border-border/80 bg-zinc-50">
                <Image
                  src={item?.product?.images[0].url}
                  alt={item?.product?.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                  {item?.product?.name}
                </span>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-foreground">
                    {formatCurrency(item?.product?.price, "NGN")}
                  </span>
                  <span className="text-muted-foreground font-extrabold text-[10px] uppercase">
                    Quantity: {item?.qty}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {order?.trackingLevel === 2 && (
        <div className="flex justify-end gap-4 items-center pt-4 border-t border-border/60">
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Have you received your order?</p>
          <Button
            className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 cursor-pointer"
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
