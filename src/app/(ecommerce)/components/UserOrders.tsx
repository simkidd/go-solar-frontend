"use client";
import { getChipColor } from "@/app/(dashboard)/components/OrdersTable";
import { useOrderStore } from "@/lib/stores/order.store";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Card, CardBody, Chip, Spinner } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

const UserOrders = () => {
  const { userOrders, loading } = useOrderStore();

  return (
    <>
      {loading ? (
        <div className="py-4 flex justify-center">
          <Card className="dark:bg-[#222327]">
            <CardBody className="p-6">
              <Spinner size="lg" />
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="divide-y-2">
          {userOrders ? (
            userOrders.map((order) => (
              <div key={order?._id} className="py-6 mb-6 divide-y-1">
                <div className="flex justify-between items-center py-1 lg:flex-row flex-col gap-4">
                  <div className="flex items-center me-auto">
                    <p className="font-semibold text-sm lg:text-base">
                      Order Date: {formatDate(order?.trackingId?.createdAt)}
                    </p>
                    <p className="mx-2">|</p>
                    <Chip
                      color={getChipColor(order?.trackingStatus)}
                      size="sm"
                      variant="flat"
                    >
                      {order?.trackingStatus}
                    </Chip>
                  </div>
                  <Link
                    href={`/account/orders/${order?.trackingId?.tracking_id}`}
                    className="text-white bg-primary px-2 py-1 text-semibold text-sm ms-auto"
                  >
                    View Details
                  </Link>
                </div>

                <div className="flex justify-between items-center py-1 text-sm">
                  <p className="font-semibold">
                    Order ID: {order?.trackingId?.tracking_id}
                  </p>
                  <p className="font-semibold">
                    Total: {formatCurrency(order?.totalPricePaid, "NGN")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order?.products.map((item) => (
                    <div
                      key={item?._id}
                      className="grid grid-cols-[64px_auto] gap-2 py-2"
                    >
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={item?.product?.images[0].url}
                          alt={item?.product?.name}
                          className="object-cover w-full h-full"
                          width={64}
                          height={64}
                        />
                      </div>
                      <p className="text-sm text-ellipsis line-clamp-1">
                        {item?.product?.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              <p>You have no order history</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserOrders;
