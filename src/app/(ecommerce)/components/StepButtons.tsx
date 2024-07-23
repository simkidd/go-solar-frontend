import useCartStore from "@/lib/stores/cart.store";
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
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          type="submit"
          className="bg-primary px-4 py-2 text-white hover:bg-primary-dark transition duration-300 flex items-center disabled:bg-gray-400"
          disabled={prevDisabled}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          <span>Previous</span>
        </button>
      )}

      <button
        type="submit"
        className="bg-primary px-4 py-2 text-white hover:bg-primary-dark transition duration-300 flex items-center disabled:bg-gray-400 disabled:text-gray-800"
        disabled={nextDisabled}
      >
        <span>Next</span>
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

export default StepButtons;
