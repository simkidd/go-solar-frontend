import React from "react";
import Steps from "../components/Steps";
import StepForms from "../components/StepForms";
import type { Metadata } from "next";

const pageTitle = "Checkout";

export const metadata: Metadata = {
  title: pageTitle,
};

const CheckoutPage = () => {
  const steps = [
    { num: 1, label: "Shipping" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Order Summary" },
  ];

  return (
    <div className="container mx-auto px-2 py-4 lg:py-16">
      <div className="max-w-[600px] mx-auto">
        <Steps steps={steps} />

        <div>
          <StepForms />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
