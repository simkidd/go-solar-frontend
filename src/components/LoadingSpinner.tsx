"use client"
import { Spinner } from "@heroui/react";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="w-full min-h-dvh flex items-center justify-center light bg-[#f1f1f1] dark:bg-[#2a2b2f]">
      <div className="w-80 flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        {/* <h4 className="font-medium text-2xl">Loading...</h4> */}
      </div>
    </div>
  );
};

export default LoadingSpinner;
