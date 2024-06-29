/* eslint-disable react/no-unescaped-entities */
"use client";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const OrderSuccess = () => {
  const router = useRouter();

  return (
    <div id="SuccessPage" className="container mx-auto px-2 py-16">
      <div className="max-w-[600px] mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-3xl border dark:border-gray-600 text-primary size-20 flex items-center justify-center mb-4">
            <CheckIcon size={50} />
          </div>
          <h2 className="font-bold text-2xl mb-1">Success!</h2>
          <p className="text-gray-500 mb-8">Order placed Successfully</p>
          <button
            className="mt-4 text-primary"
            onClick={() => router.push("/account/orders")}
          >
            View orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
