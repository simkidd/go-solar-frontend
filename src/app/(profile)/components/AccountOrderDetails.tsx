"use client";
import { getChipColor } from "@/app/(dashboard)/components/OrdersTable";
import { useOrderStore } from "@/lib/stores/order.store";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Button, Chip } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import React from "react";

const AccountOrderDetails: React.FC<{
  id: string;
}> = ({ id }) => {
  const { userOrders, updateTrackingLevel, statusLoading } = useOrderStore();
  const router = useRouter();

  const order = userOrders.find(
    (order) => order?.trackingId?.tracking_id === id
  );

  if (!order) {
    notFound();
  }

  const totalDeliveryFee = order?.products.reduce(
    (sum, item) => sum + (item?.deliveryFee || 0),
    0
  );

  const handleConfirmReceipt = async () => {
    await updateTrackingLevel({
      trackingLevel: 3,
      trackingId: order?.trackingId?._id,
    });
    router.refresh();
  };

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
        <h2 className="text-2xl font-bold">Order Detail</h2>
      </div>

      <div className="mb-8 border dark:border-[#2a2b2f]">
        <div className="px-6 py-2 bg-[#f1f1f1] dark:bg-[#2a2b2f]">
          <h3 className="text-lg font-semibold">Order Information</h3>
        </div>
        <ul className="space-y-2 px-6 py-4">
          <li className="flex justify-between">
            <span className="font-semibold">Order ID</span>
            <span>{order?.trackingId?.tracking_id}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-semibold">Order Date</span>
            <span>{formatDate(order?.createdAt)}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-semibold">Tracking ID</span>
            <span>{order?.trackingId?.tracking_id}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-semibold">Delivery Fee</span>
            <span className="font-semibold">
              {formatCurrency(totalDeliveryFee, "NGN")}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="font-semibold">Total Amount</span>
            <span className="font-semibold">
              {formatCurrency(order?.totalPricePaid, "NGN")}
            </span>
          </li>
        </ul>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-3">
        <div className="border dark:border-[#2a2b2f]">
          <div className="px-6 py-2 bg-[#f1f1f1] dark:bg-[#2a2b2f]">
            <h3 className="text-lg font-semibold">Payment Information</h3>
          </div>
          <div className="space-y-2 px-6 py-4">
            <div className="flex flex-col">
              <p className="font-semibold">Payment Method</p>
              <span className="capitalize">{order?.paymentMethod}</span>
            </div>
            <div>
              <p className="font-semibold">Payment Details</p>
              <div className="text-gray-600 dark:text-gray-300">
                <div className="flex">
                  <span className="mr-2">Items Total:</span>
                  <span>{formatCurrency(order?.totalPricePaid, "NGN")}</span>
                </div>
                <div className="flex">
                  <span className="mr-2">Shipping Fee:</span>
                  <span>{formatCurrency(totalDeliveryFee, "NGN")}</span>
                </div>
              </div>
            </div>
            <div className="flex font-bold">
              <p className="mr-2">Total:</p>
              <span>{formatCurrency(order?.totalPricePaid, "NGN")}</span>
            </div>
          </div>
        </div>

        <div className="border dark:border-[#2a2b2f]">
          <div className="px-6 py-2 bg-[#f1f1f1] dark:bg-[#2a2b2f]">
            <h3 className="text-lg font-semibold">Delivery Information</h3>
          </div>
          <div className="px-6 py-4">
            <p className="font-semibold">
              {order?.user?.firstname + " " + order?.user?.lastname}
            </p>
            <p>{order?.deliveryDetails?.suiteNumber}</p>
            <p>{order?.deliveryDetails?.streetAddress}</p>
            <p>{order?.deliveryDetails?.city}</p>
            <p>{order?.deliveryDetails?.zipCode}</p>
            <p>{order?.user?.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 border dark:border-[#2a2b2f]">
        <div className="px-6 py-2 bg-[#f1f1f1] dark:bg-[#2a2b2f] flex items-center justify-between">
          <h3 className="text-lg font-semibold">Items Ordered</h3>
          <div className="flex gap-2 items-center">
            <Chip
              color={getChipColor(order?.trackingStatus)}
              size="sm"
              variant="flat"
            >
              {order?.trackingStatus}
            </Chip>

            <Link
              href={`${order?.trackingId?.tracking_id}/track`}
              className="text-sm hover:underline text-primary"
            >
              Track
            </Link>
          </div>
        </div>
        <ul className="space-y-4">
          {order?.products.map((item) => (
            <li
              key={item?._id}
              className="grid grid-cols-[80px_auto] gap-2 py-2 px-4"
            >
              <div className="w-20 h-20 rounded overflow-hidden">
                <Image
                  src={item?.product?.images[0].url}
                  alt={item?.product?.name}
                  className="object-cover w-full h-full"
                  width={64}
                  height={64}
                />
              </div>
              <div className="flex flex-col flex-grow">
                <span className="mb-2 text-sm text-ellipsis line-clamp-1">
                  {item?.product?.name}
                </span>
                <span className="font-bold">
                  {formatCurrency(item?.product?.price, "NGN")}
                </span>
                <span className="text-sm text-gray-500">
                  Quantity: {item?.qty}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {order?.trackingLevel === 2 && (
        <div className="flex justify-end gap-4 items-center">
          <p className="text-gray-500">Have you Received your order?</p>
          <Button
            variant="solid"
            color="primary"
            type="submit"
            isDisabled={statusLoading}
            isLoading={statusLoading}
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
