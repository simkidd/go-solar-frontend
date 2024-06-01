import React, { useState } from "react";

const OrderSuccess = () => {
  const [] = useState();

  return (
    <div
      id="SuccessPage"
      className="mt-4 max-w-[1200px] mx-auto px-2 min-h-[50vh]"
    >
      <div className="bg-white w-full p-6 min-h-[150px]">
        <div className="flex items-center text-xl">
          {/* <Success
            name="clarity:success-standard-line"
            color="#5FCB04"
            size="35"
          /> */}
          <span className="pl-4">Payment Successful</span>
        </div>
        <p className="text-sm pl-[50px]">
          Thank you! We've received your payment.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
