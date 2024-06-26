"use client";
import useCartStore from "@/lib/stores/cart.store";
import OrderSummary from "./OrderSummary";
import PaymentMethod from "./PaymentMethod";
import ShippingDetailsForm from "./ShippingDetailsForm";

const StepForms = () => {
  const { currentStep } = useCartStore();

  const renderFormByStep = (step: number) => {
    switch (step) {
      case 1:
        return <ShippingDetailsForm />;
      case 2:
        return <PaymentMethod />;
      case 3:
        return <OrderSummary />;
      default:
        return <ShippingDetailsForm />;
    }
  };
  return <div>{renderFormByStep(currentStep)}</div>;
};

export default StepForms;
