"use client";
import React from "react";
import { TrackingStatus } from "@/interfaces/order.interface";
import { useUserOrdersQuery } from "@/hooks/queries/useOrdersQuery";
import { formatDateTime } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Clock, Truck, ShieldCheck } from "lucide-react";
import { useRouter, notFound } from "next/navigation";
import { Spinner } from "@/components/custom/Spinner";

const OrderTimeline: React.FC<{ id: string }> = ({ id }) => {
  const { data: userOrders = [], isPending } = useUserOrdersQuery();
  const router = useRouter();

  const order = userOrders.find(
    (order: any) => order?.trackingId?.tracking_id === id,
  );

  if (isPending) {
    return (
      <div className="py-16 flex flex-col justify-center items-center gap-3">
        <Spinner size="lg" />
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest animate-pulse">
          Loading tracking details...
        </p>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  const steps = [
    {
      level: 1,
      title: "Order Placed & Processing",
      description:
        "Payment verified successfully. We are preparing your GoSolar setup and reserving components in stock.",
      icon: Clock,
      date: order?.createdAt,
    },
    {
      level: 2,
      title: "Delivered & Commissioned",
      description:
        "GoSolar installation hardware has been delivered to site and fully commissioned by the technician crew.",
      icon: Truck,
      date: order?.trackingLevel >= 2 ? order?.updatedAt : null,
    },
    {
      level: 3,
      title: "Receipt Confirmed",
      description:
        "Technical handoff completed and receipt confirmed by the customer.",
      icon: ShieldCheck,
      date: order?.trackingLevel >= 3 ? order?.updatedAt : null,
    },
  ];

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
          Track Status
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Delivery Address Card */}
        <div className="border border-border/85 rounded-2xl overflow-hidden shadow-xs bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="px-6 py-3.5 bg-muted/40 border-b border-border/80 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Delivery Address
            </h3>
          </div>
          <div className="px-6 py-4 text-xs font-semibold text-zinc-655 dark:text-zinc-400 space-y-1">
            <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5">
              {order?.user?.firstname + " " + order?.user?.lastname}
            </p>
            {order?.deliveryDetails?.suiteNumber && (
              <p>{order?.deliveryDetails?.suiteNumber}</p>
            )}
            <p>{order?.deliveryDetails?.streetAddress}</p>
            <p>{order?.deliveryDetails?.city}</p>
            {order?.deliveryDetails?.zipCode && (
              <p>Zip: {order?.deliveryDetails?.zipCode}</p>
            )}
            <p className="pt-2 border-t border-border/60 font-black text-zinc-900 dark:text-white">
              {order?.user?.phoneNumber}
            </p>
          </div>
        </div>

        {/* Timeline Stepper Card */}
        <div className="border border-border/85 rounded-2xl overflow-hidden shadow-xs bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="px-6 py-3.5 bg-muted/40 border-b border-border/80 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Order Timeline
            </h3>
          </div>
          <div className="px-8 py-8">
            <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 pl-8 space-y-8 py-2">
              {steps.map((step) => {
                const isCompleted = order
                  ? order.trackingLevel >= step.level
                  : false;
                const isCurrent = order
                  ? order.trackingLevel === step.level
                  : false;
                const StepIcon = step.icon;

                return (
                  <div key={step.level} className="relative group">
                    {/* Node Dot / Icon */}
                    <div
                      className={`absolute -left-[48px] top-0.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 z-10 ${
                        isCompleted
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                          : isCurrent
                            ? "bg-white dark:bg-zinc-900 border-primary text-primary animate-pulse"
                            : "bg-white dark:bg-zinc-900 border-zinc-250 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4.5 w-4.5 stroke-[3]" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <h4
                          className={`text-sm font-extrabold transition-colors ${
                            isCompleted || isCurrent
                              ? "text-zinc-900 dark:text-white"
                              : "text-zinc-450 dark:text-zinc-500"
                          }`}
                        >
                          {step.title}
                        </h4>
                        {step.date && (
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-md self-start sm:self-center">
                            {formatDateTime(step.date)}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs leading-relaxed font-medium transition-colors ${
                          isCompleted || isCurrent
                            ? "text-zinc-500 dark:text-zinc-400"
                            : "text-zinc-400 dark:text-zinc-650"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
