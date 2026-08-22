"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Order, TrackingStatus } from "@/interfaces/order.interface";
import { formatCurrency, formatDateTime } from "@/utils/helpers";
import {
  Mail,
  Phone,
  MapPin,
  CreditCard,
  PackageCheck,
  PackageOpen,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getChipStyles } from "./OrdersTable";
import { useUpdateOrderStatusMutation } from "@/hooks/mutations/useOrderMutations";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderByIdQuery } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";

interface TrackingFormValues {
  trackingLevel: number;
}

// ── Fulfillment form as a child so useForm defaultValues are
//    initialised with the already-loaded order — no reset() needed.
const FulfillmentForm: React.FC<{ order: Order }> = ({ order }) => {
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const { control, handleSubmit } = useForm<TrackingFormValues>({
    defaultValues: { trackingLevel: order.trackingLevel ?? 1 },
  });

  const onSubmit = (values: TrackingFormValues) => {
    if (!order.trackingId?._id) return;
    updateStatusMutation.mutate({
      trackingLevel: values.trackingLevel,
      trackingId: order.trackingId._id,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 pt-4 border-t border-border/60"
    >
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">
        Update Status
      </p>
      <Controller
        name="trackingLevel"
        control={control}
        render={({ field }) => (
          <Select
            value={String(field.value)}
            onValueChange={(val) => field.onChange(Number(val))}
          >
            <SelectTrigger className="bg-background border-border rounded-xl font-bold text-xs select-none">
              <SelectValue placeholder="Select tracking status" />
            </SelectTrigger>
            <SelectContent className="font-semibold text-xs">
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
        )}
      />
      <Button
        type="submit"
        disabled={updateStatusMutation.isPending}
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl cursor-pointer shadow-sm text-xs font-extrabold uppercase tracking-wider h-10 transition-colors"
      >
        {updateStatusMutation.isPending ? "Updating..." : "Save Status"}
      </Button>
    </form>
  );
};

const OrderDetails: React.FC<{
  id: string;
}> = ({ id }) => {
  const {
    data: order,
    isLoading: isLoadingOrder,
    error: orderError,
  } = useOrderByIdQuery(id);
  const router = useRouter();

  const totalDeliveryFee =
    order?.products.reduce(
      (sum: number, item: any) => sum + (item?.deliveryFee || 0),
      0,
    ) || 0;

  if (isLoadingOrder) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56 rounded-lg" />
            <Skeleton className="h-3.5 w-36 rounded-md" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        {/* 2:1 grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — items card */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-5">
              <Skeleton className="h-4 w-40 rounded-md" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-4 py-4 border-t border-border/40">
                  <Skeleton className="h-16 w-16 min-w-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-3 w-full max-w-xs rounded-md" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right — sidebar cards */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-4/5 rounded-md" />
                <Skeleton className="h-3 w-3/5 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orderError || !order) {
    notFound();
  }

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Hero Title & Control Actions ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none pb-4 border-b border-border/60">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Order ID:{" "}
            <span className="font-mono text-lg text-primary">
              #{order?.trackingId?.tracking_id}
            </span>
          </h2>
          <p className="text-xs text-muted-foreground font-semibold">
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

      {/* ── 2:1 Shopify-style Layout split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column: Primary Content (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Ordered Items */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-2 select-none">
              <PackageOpen className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Ordered Items ({order?.products.length})
              </h3>
            </div>

            <div className="divide-y divide-border/65">
              {order?.products.map((item) => (
                <div
                  key={item?._id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5 first:pt-0 last:pb-0 hover:bg-muted/5 transition-colors duration-150"
                >
                  <div className="flex gap-4">
                    <div className="h-16 w-16 min-w-16 rounded-xl overflow-hidden border border-border/60 relative bg-muted/10">
                      <Image
                        src={
                          item?.product?.images?.[0]?.url ||
                          "/placeholder-product.jpg"
                        }
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
                        <p className="text-xs text-muted-foreground font-semibold">
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
                      {!item?.product?.category &&
                        item?.product?.constituents &&
                        item.product.constituents.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/40 space-y-1.5">
                            <p className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground">
                              Included Components:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.product.constituents.map(
                                (c: any, cIdx: number) => (
                                  <div
                                    key={cIdx}
                                    className="bg-muted/40 border border-border/40 px-2 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-foreground"
                                  >
                                    <span className="text-primary font-black">
                                      {c.qty * item.qty}x
                                    </span>
                                    <span>
                                      {c.product?.name || "Component"}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex md:flex-col justify-between items-end gap-2 text-right shrink-0">
                    <div className="text-sm font-extrabold text-foreground">
                      Price: {formatCurrency(item?.product?.price, "NGN")}
                    </div>
                    <div className="text-xs text-muted-foreground font-semibold">
                      Delivery: {formatCurrency(item?.deliveryFee, "NGN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Sidebar Cards (1/3) ── */}
        <div className="space-y-6">
          {/* Card: Customer Details */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-1.5 select-none">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Customer Details
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-foreground text-sm">
                  {order?.user?.firstname + " " + order?.user?.lastname}
                </h4>
                <div className="mt-2 space-y-1.5 text-xs text-muted-foreground font-semibold">
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

              <div className="pt-3.5 border-t border-border/60">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 select-none">
                  Delivery Address
                </h5>
                <div className="text-xs text-foreground space-y-0.5 font-semibold">
                  {order?.deliveryDetails?.suiteNumber && (
                    <p>{order?.deliveryDetails?.suiteNumber}</p>
                  )}
                  <p>{order?.deliveryDetails?.streetAddress}</p>
                  <p>{order?.deliveryDetails?.city}</p>
                  {order?.deliveryDetails?.zipCode && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Zip: {order?.deliveryDetails?.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Payment Summary */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-1.5 select-none">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Payment Details
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                  <span>Method</span>
                  <span className="font-extrabold text-foreground capitalize">
                    {order?.paymentMethod || "Card"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                  <span>Items Base Total</span>
                  <span className="font-extrabold text-foreground">
                    {formatCurrency(
                      (order?.totalPricePaid ?? 0) - totalDeliveryFee,
                      "NGN",
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                  <span>Shipping & Delivery</span>
                  <span className="font-extrabold text-foreground">
                    {formatCurrency(totalDeliveryFee, "NGN")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                  <span>Status</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md px-2 py-0.5 font-bold uppercase select-none">
                    Paid
                  </span>
                </div>
              </div>

              <div className="pt-3.5 border-t border-border/60 flex justify-between items-center select-none text-xs font-bold text-foreground">
                <span>Total Amount</span>
                <span className="text-base font-black text-primary">
                  {formatCurrency(order?.totalPricePaid || 0, "NGN")}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Fulfillment status */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-5 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-1.5 select-none">
              <PackageCheck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Fulfillment Activity
              </h3>
            </div>

            {/* Step timeline */}
            <div className="relative flex items-start justify-between gap-1 select-none">
              {([
                { level: 1, label: "Processing", color: "bg-amber-500", ring: "ring-amber-400/40", text: "text-amber-600 dark:text-amber-400" },
                { level: 2, label: "Delivered",  color: "bg-emerald-500", ring: "ring-emerald-400/40", text: "text-emerald-600 dark:text-emerald-400" },
                { level: 3, label: "Received",   color: "bg-blue-500", ring: "ring-blue-400/40", text: "text-blue-600 dark:text-blue-400" },
              ] as const).map((step, idx, arr) => {
                const isDone   = (order.trackingLevel ?? 1) >= step.level;
                const isActive = (order.trackingLevel ?? 1) === step.level;
                return (
                  <div key={step.level} className="flex-1 flex flex-col items-center gap-1.5 relative">
                    {/* connector line before (skip first) */}
                    {idx > 0 && (
                      <span
                        className={`absolute top-[9px] right-1/2 w-full h-0.5 -translate-y-0 ${
                          isDone ? step.color : "bg-border/60"
                        } transition-colors duration-300`}
                        style={{ left: "-50%", width: "100%" }}
                      />
                    )}
                    {/* node */}
                    <span
                      className={`relative z-10 h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isDone
                          ? `${step.color} border-transparent ${isActive ? `ring-4 ${step.ring} animate-pulse` : ""}`
                          : "bg-background border-border/60"
                      }`}
                    >
                      {isDone && !isActive && (
                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {/* label */}
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-wider text-center ${
                        isDone ? step.text : "text-muted-foreground/50"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Update form — mounted with correct defaultValues once order is loaded */}
            <FulfillmentForm key={order.trackingLevel} order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
