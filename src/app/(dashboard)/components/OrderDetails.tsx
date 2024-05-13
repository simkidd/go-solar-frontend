"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { axiosInstance } from "@/lib/axios";
import { useOrderStore } from "@/lib/stores/order.store";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const OrderDetails = () => {
  const { order, setOrder } = useOrderStore();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setLoading(true);
          const { data } = await axiosInstance.get(`users/orders/${id}`);
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

  if (loading) {
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
          Order ID: <span>#{order?.trackingId?.tracking_id}</span>
        </h3>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] py-16 px-6 shadow rounded">
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default OrderDetails;
