"use client";
import useCartStore from "@/lib/stores/cart.store";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Steps: React.FC<{
  steps: {
    num: number;
    label: string;
  }[];
}> = ({ steps }) => {
  const { currentStep } = useCartStore();

  return (
    <nav className="w-full flex mb-8 justify-center">
      <ol className="flex flex-wrap gap-y-2 md:gap-y-0 items-center gap-x-1.5">
        <li>
          <div className="flex items-center">
            <Link
              href="/cart"
              className="inline-flex items-center p-1 font-medium text-primary"
            >
              Cart
            </Link>
          </div>
        </li>
        {steps.map((step, i) => (
          <li key={i}>
            <div className="flex items-center">
              <ChevronRight className="flex-shrink-0 w-4 h-4" />
              <p
                className={`inline-flex items-center p-1 ml-1.5 font-medium ${
                  step.num <= currentStep ? "text-primary" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Steps;
