"use client";
import React, { useState } from "react";
import {
  Order,
  TrackingStatus,
  UpdateTrackingStatus,
} from "@/interfaces/order.interface";
import { formatCurrency, formatDateTime } from "@/utils/helpers";
import {
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ChevronRight,
  PackageCheck,
} from "lucide-react";
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

  const totalDeliveryFee = order?.products.reduce(
    (sum: number, item: any) => sum + (item?.deliveryFee || 0),
    0,
  ) || 0;

  const handleUpdateTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    updateStatusMutation.mutate(input);
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-card text-card-foreground p-6 rounded-3xl border border-border/80 shadow-xs">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            Order ID:{" "}
            <span className="font-mono text-lg text-primary">
              #{order?.trackingId?.tracking_id}
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1 select-none">
            Placed on: {formatDateTime(order?.trackingId?.createdAt as string)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${getChipStyles(order?.trackingStatus)}`}
          >
            {order?.trackingStatus}
          </span>
        </div>
      </div>

      {/* Ordered Items Layout */}
      <Card className="bg-card text-card-foreground border-border/80 shadow-xs rounded-3xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/60">
          <CardTitle className="text-base font-extrabold text-foreground select-none">
            Ordered Items ({order?.products.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border/60 p-0">
          {order?.products.map((item) => (
            <div
              key={item?._id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 hover:bg-muted/5 transition-colors"
            >
              <div className="flex gap-4">
                <div className="h-16 w-16 min-w-16 rounded-xl overflow-hidden border border-border/60 relative bg-muted/10">
                  <Image
                    src={item?.product?.images?.[0]?.url || "/placeholder-product.jpg"}
                    alt={item?.product?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-foreground line-clamp-1">
                    {item?.product?.name}
                  </h4>
                  <div className="flex items-center gap-2 select-none">
                    <p className="text-xs text-muted-foreground">
                      Quantity:{" "}
                      <span className="font-bold text-foreground">
                        x{item?.qty}
                      </span>
                    </p>
                    <span
                      className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                        !item?.product?.category
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                          : "bg-zinc-100 text-zinc-650 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700/50"
                      }`}
                    >
                      {!item?.product?.category ? "Package" : "Product"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground md:line-clamp-2 line-clamp-1 max-w-xl font-medium">
                    {item?.product?.description}
                  </p>
                  {!item?.product?.category && item?.product?.constituents?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/40 space-y-1.5">
                      <p className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground">
                        Included Components:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.product.constituents.map((c: any, cIdx: number) => (
                          <div
                            key={cIdx}
                            className="bg-muted/40 border border-border/40 px-2 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-foreground"
                          >
                            <span className="text-primary font-black">
                              {c.qty * item.qty}x
                            </span>
                            <span>{c.product?.name || "Component"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex md:flex-col justify-between items-end gap-2 text-right">
                <div className="text-sm font-extrabold text-foreground">
                  Price: {formatCurrency(item?.product?.price, "NGN")}
                </div>
                <div className="text-xs text-muted-foreground font-semibold">
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
        <Card className="bg-card text-card-foreground border-border/80 shadow-xs rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60 select-none">
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              Customer & Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <h4 className="font-extrabold text-foreground text-base">
                {order?.user?.firstname + " " + order?.user?.lastname}
              </h4>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground font-semibold">
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground/60" />
                  {order?.user?.phoneNumber || "No phone listed"}
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground/60" />
                  {order?.user?.email}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 select-none">
                Delivery Address
              </h5>
              <div className="text-sm text-foreground space-y-0.5 font-semibold">
                {order?.deliveryDetails?.suiteNumber && (
                  <p>{order?.deliveryDetails?.suiteNumber}</p>
                )}
                <p>{order?.deliveryDetails?.streetAddress}</p>
                <p>{order?.deliveryDetails?.city}</p>
                {order?.deliveryDetails?.zipCode && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Zip: {order?.deliveryDetails?.zipCode}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary Card */}
        <Card className="bg-card text-card-foreground border-border/80 shadow-xs rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60 select-none">
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-primary" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col justify-between h-[80%]">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-semibold">
                  Method
                </span>
                <span className="font-extrabold text-foreground capitalize">
                  {order?.paymentMethod || "Card"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-semibold">
                  Items Base Total
                </span>
                <span className="font-extrabold text-foreground">
                  {formatCurrency(order?.totalPricePaid - totalDeliveryFee, "NGN")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-semibold">
                  Shipping & Delivery
                </span>
                <span className="font-extrabold text-foreground">
                  {formatCurrency(totalDeliveryFee, "NGN")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-semibold">
                  Status
                </span>
                <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 font-bold">
                  Paid
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 mt-6 flex justify-between items-center select-none">
              <span className="text-sm font-bold text-foreground">
                Total Amount
              </span>
              <span className="text-lg font-black text-primary">
                {formatCurrency(order?.totalPricePaid as number, "NGN")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Status Form Card */}
        <Card className="bg-card text-card-foreground border-border/80 shadow-xs rounded-3xl overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60 select-none">
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
              <PackageCheck className="h-4 w-4 text-primary" />
              Tracking Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                Current Status
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getChipStyles(order?.trackingStatus)}`}
                >
                  {order?.trackingStatus}
                </span>
              </div>
            </div>

            {/* update order status form */}
            <form
              onSubmit={handleUpdateTracking}
              className="space-y-3.5 pt-2 border-t border-border/60"
            >
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                Update Status
              </label>
              <Select
                value={String(input.trackingLevel)}
                onValueChange={(val) =>
                  setInput({ ...input, trackingLevel: Number(val) })
                }
              >
                <SelectTrigger className="bg-background border-border rounded-xl">
                  <SelectValue placeholder="Select tracking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="cursor-pointer">
                    {TrackingStatus.Processing}
                  </SelectItem>
                  <SelectItem value="2" className="cursor-pointer">
                    {TrackingStatus.Delivered}
                  </SelectItem>
                  <SelectItem value="3" className="cursor-pointer">
                    {TrackingStatus.Received}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="submit"
                disabled={updateStatusMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl cursor-pointer shadow-sm text-xs font-bold h-9"
              >
                {updateStatusMutation.isPending
                  ? "Updating..."
                  : "Save Tracking Status"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;
