"use client";
import { TrackingStatus } from "@/interfaces/order.interface";
import { useOrderStore } from "@/lib/stores/order.store";
import { formatDateTime } from "@/utils/helpers";
import { Button } from "@nextui-org/react";
import { Timeline } from "antd";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Status {
  status: string;
  date: string;
}

const OrderTimeline: React.FC<{ id: string }> = ({ id }) => {
  const { userOrders } = useOrderStore();
  const router = useRouter();
  const [statuses, setStatuses] = useState<Status[]>([]);

  const order = userOrders.find(
    (order) => order?.trackingId?.tracking_id === id
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
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center mb-6">
        <Button
          isIconOnly
          variant="flat"
          onClick={() => router.back()}
          className="mr-4 rounded-full"
        >
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-2xl font-bold">Track Status</h2>
      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1">
        <div className="px-2">
          <div className="px-6 py-2 bg-[#f1f1f1] dark:bg-[#2a2b2f]">
            <h3 className="text-lg font-semibold">Delivery Information</h3>
          </div>
          <div className="px-2 py-4">
            <p className="font-semibold">
              {order?.user?.firstname + " " + order?.user?.lastname}
            </p>
            <p>{order?.deliveryDetails?.suiteNumber}</p>
            <p>{order?.deliveryDetails?.streetAddress}</p>
            <p>{order?.deliveryDetails?.city}</p>
            <p>{order?.deliveryDetails?.zipCode}</p>
            <p>{order?.user?.phoneNumber}</p>
          </div>{" "}
        </div>
        <div className="px-2">
          <div className="px-6 py-2 bg-[#f1f1f1] dark:bg-[#2a2b2f]">
            <h3 className="text-lg font-semibold">Timeline</h3>
          </div>
          <div className="py-4">
            <Timeline
              mode="left"
              items={statuses.map((status) => ({
                label: formatDateTime(status.date),
                children: status.status,
                color: "green",
              }))}
              className="dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
