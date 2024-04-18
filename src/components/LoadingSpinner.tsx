import { Spinner } from "@nextui-org/react";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-80 flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <h4 className="font-medium text-2xl">Loading...</h4>
      </div>
    </div>
  );
};

export default LoadingSpinner;
