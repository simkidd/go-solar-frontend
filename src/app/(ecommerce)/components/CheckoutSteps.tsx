import React from "react";

const CheckoutSteps: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  return (
    <div className="mb-8 flex flex-wrap">
      {["Shipping Address", "Payment Method", "Confirm Order"].map(
        (step, i) => (
          <div
            key={step}
            className={`flex-1 border-b-2  
              text-center py-4
          ${
            i <= activeStep
              ? "border-primary   text-primary"
              : "border-gray-400 text-gray-400"
          }
              
          `}
          >
            {step}
          </div>
        )
      )}
    </div>
  );
};

export default CheckoutSteps;
