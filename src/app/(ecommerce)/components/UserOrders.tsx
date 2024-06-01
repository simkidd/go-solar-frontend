"use client";
import { trackingStatusChip } from "@/app/(dashboard)/components/OrdersListTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { TrackingStatus } from "@/interfaces/order.interface";
import { useOrderStore } from "@/lib/stores/order.store";
import { formatCurrency, formatDate } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";

const UserOrders = () => {
  const { userOrders, loading } = useOrderStore();

  if (!userOrders && loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="flex items-center text-2xl font-bold mb-6">
        <span>My Orders</span>
      </h2>

      <div className="divide-y-2">
        {userOrders ? (
          userOrders.map((order) => (
            <div key={order?._id} className="p-6 mb-6 divide-y-1">
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center">
                  <p className="font-semibold">
                    Order Date: {formatDate(order?.trackingId?.createdAt)}
                  </p>
                  <p className="mx-2">|</p>
                  <span
                    className={`px-4 py-1 rounded-full bg-opacity-0 text-sm ${trackingStatusChip(
                      order?.trackingStatus as TrackingStatus
                    )}`}
                  >
                    {order?.trackingStatus}
                  </span>
                </div>
                <Link
                  href={`/account/orders/${order?.trackingId?.tracking_id}`}
                  className="text-white bg-primary px-2 py-1 text-semibold text-sm"
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
    </div>
  );
};

export default UserOrders;
