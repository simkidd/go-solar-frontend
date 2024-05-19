"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { TrackingStatus } from "@/interfaces/order.interface";
import { axiosInstance } from "@/lib/axios";
import { useOrderStore } from "@/lib/stores/order.store";
import { formatCurrency, formatDateTime } from "@/utils/helpers";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { trackingStatusChip } from "./OrdersListTable";

const OrderDetails = () => {
  const { order, setOrder } = useOrderStore();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setLoading(true);
          const { data } = await axiosInstance.get(`/users/orders/${id}`);
          setOrder(data.order);
        } catch (error) {
          const errorMsg = error as any;
          console.log(errorMsg?.response.data.message);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id]);

  if (!order && loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="text-2xl font-medium">
          Order ID:{" "}
          <span className="text-xl">#{order?.trackingId?.tracking_id}</span>
        </h3>
        <p className="text-sm">
          {formatDateTime(order?.trackingId?.createdAt as string)}
        </p>
      </div>
      <div className="w-full">
        <div className="bg-white dark:bg-[#222327] shadow rounded mb-4">
          <Accordion selectionMode="multiple">
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              title={
                <p className="text-base font-medium dark:text-white">{`Ordered Items (${order?.products.length})`}</p>
              }
            >
              <div className="w-full space-y-4">
                {order?.products.map((item) => (
                  <div
                    key={item?._id}
                    className="grid lg:grid-cols-7 grid-cols-1"
                  >
                    <div className="col-span-1 lg:col-span-3 grid grid-cols-[100px_auto] gap-2 py-2 px-2 lg:border-r-1">
                      <div className="w-[100px] h-[100px] overflow-hidden rounded">
                        <Image
                          src={item?.product?.images[0].url}
                          alt={item?.product?.name}
                          className="w-full h-full object-cover"
                          width={150}
                          height={150}
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <h4 className="font-medium text-base">
                          {item?.product?.name}
                        </h4>
                        <p>x{item?.qty}</p>
                      </div>
                    </div>
                    <div className="hidden lg:block col-span-2 py-2 px-2 border-r-1">
                      <p className="font-medium text-base mb-2">Description:</p>
                      <p className="text-ellipsis line-clamp-2 text-sm mb-4">
                        {item?.product?.description}
                      </p>
                    </div>
                    <div className="col-span-2 py-2 px-2 space-y-1">
                      <p className="text-sm flex items-center">
                        Price:{" "}
                        <span className="font-bold ms-auto">
                          {formatCurrency(item?.product?.price, "NGN")}
                        </span>
                      </p>
                      <p className="text-sm flex items-center">
                        Delivery Fee:{" "}
                        <span className="font-bold ms-auto">
                          {formatCurrency(item?.deliveryFee, "NGN")}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
          <div className="flex flex-col bg-white dark:bg-[#222327] shadow-sm px-4 py-4">
            <h4 className="font-medium text-xl mb-4">
              {order?.user?.firstname + " " + order?.user?.lastname}
            </h4>

            <p className="flex items-center">
              <Phone size={16} />
              <span className="ml-2">{order?.user?.phoneNumber}</span>
            </p>
            <p className="flex items-center">
              <Mail size={16} />
              <span className="ml-2">{order?.user?.email}</span>
            </p>

            <h4 className="font-medium mt-6">Pick-up Address:</h4>
            {order?.deliveryDetails?.suiteNumber && (
              <p className="text-base">{order?.deliveryDetails?.suiteNumber}</p>
            )}
            <p className="text-base">{order?.deliveryDetails?.streetAddress}</p>
            <p className="text-base">{order?.deliveryDetails?.city}</p>
            <p className="text-base">{order?.deliveryDetails?.zipCode}</p>
          </div>
          <div className="bg-white dark:bg-[#222327] shadow rounded px-4 py-4 flex flex-col">
            <h4 className="font-medium text-lg">Payment Details</h4>
            <p className="mb-8 flex items-center">
              Payment method:{" "}
              <span className="ms-auto">{order?.paymentMethod}</span>
            </p>
            <p className="mt-auto font-bold flex items-center">
              Total:{" "}
              <span className="ms-auto ">
                {formatCurrency(order?.totalPricePaid as number, "NGN")}
              </span>
            </p>
          </div>
          <div className="bg-white dark:bg-[#222327] shadow rounded px-4 py-4">
            <h4 className="font-medium text-lg">Activity</h4>
            <div>
              <p>
                Status:{" "}
                <span
                  className={`px-4 py-1 rounded-full bg-opacity-10 ${trackingStatusChip(
                    order?.trackingStatus as TrackingStatus
                  )}`}
                >
                  {order?.trackingStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
