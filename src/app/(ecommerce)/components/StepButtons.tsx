import useCartStore from "@/lib/stores/cart.store";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const StepButtons: React.FC<{
  nextDisabled?: boolean;
  prevDisabled?: boolean;
}> = ({ nextDisabled, prevDisabled }) => {
  const { currentStep, setCurrentStep } = useCartStore();

  return (
    <div className="flex justify-between items-center">
      {currentStep > 1 && (
        <Button
          variant="solid"
          color="primary"
          type="submit"
          className="disabled:!bg-gray-400 mt-4 data-[focus-visible=true]:outline-primary"
          onPress={() => setCurrentStep(currentStep - 1)}
          isDisabled={prevDisabled}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          <span>Previous</span>
        </Button>
      )}

      <Button
        type="submit"
        variant="solid"
        color="primary"
        className="disabled:!bg-gray-400 mt-4 data-[focus-visible=true]:outline-primary"
        isDisabled={nextDisabled}
      >
        <span>Next</span>
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

export default StepButtons;
