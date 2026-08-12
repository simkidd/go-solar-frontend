"use client";
import React, { useEffect, useState } from "react";
import { TrackingStatus } from "@/interfaces/order.interface";
import { useUserOrdersQuery } from "@/hooks/queries/useOrdersQuery";
import { formatDateTime } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Timeline } from "antd";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Status {
  status: string;
  date: string;
}

const OrderTimeline: React.FC<{ id: string }> = ({ id }) => {
  const { data: userOrders = [] } = useUserOrdersQuery();
  const router = useRouter();
  const [statuses, setStatuses] = useState<Status[]>([]);

  const order = userOrders.find(
    (order: any) => order?.trackingId?.tracking_id === id
  );

  useEffect(() => {
    const loadOrder = async () => {
      if (order) {
        const newStatuses: Status[] = [
          {
            status: `Order placed: ${TrackingStatus.Processing}`,
            date: order.createdAt,
          },
        ];

        if (order.trackingLevel === 2) {
          newStatuses.push({
            status: TrackingStatus.Delivered,
            date: order?.updatedAt,
          });
        }
        if (order.trackingLevel === 3) {
          newStatuses.push({
            status: TrackingStatus.Received,
            date: order?.updatedAt,
          });
        }
        setStatuses(newStatuses);
      }
    };
    loadOrder();
  }, [order]);

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
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Track Status</h2>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-start">
        <div className="border border-zinc-150 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900">
          <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-150 dark:border-zinc-850">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Delivery Address</h3>
          </div>
          <div className="px-6 py-4 text-xs font-semibold text-zinc-655 dark:text-zinc-400 space-y-1">
            <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5">
              {order?.user?.firstname + " " + order?.user?.lastname}
            </p>
            <p>{order?.deliveryDetails?.suiteNumber}</p>
            <p>{order?.deliveryDetails?.streetAddress}</p>
            <p>{order?.deliveryDetails?.city}</p>
            <p>{order?.deliveryDetails?.zipCode}</p>
            <p className="pt-2 border-t dark:border-zinc-805 font-bold">{order?.user?.phoneNumber}</p>
          </div>
        </div>
        
        <div className="border border-zinc-150 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-zinc-900">
          <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-150 dark:border-zinc-850">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">Timeline</h3>
          </div>
          <div className="px-6 py-6">
            <Timeline
              mode="left"
              items={statuses.map((status) => ({
                label: formatDateTime(status.date),
                children: <span className="text-xs font-bold">{status.status}</span>,
                color: "green",
              }))}
              className="dark:text-white font-inter"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
