"use client";
import { Product } from "@/interfaces/product.interface";
import React, { useState } from "react";

const ProductDesc: React.FC<{
  product: Product;
}> = ({ product }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <div className="w-full">
      <div className="flex items-center overflow-x-auto">
        <div
          className={`cursor-pointer px-8 py-4 light bg-[#f1f1f1] dark:bg-[#2a2b2f] text-gray-500 ${
            selectedTab === 0 && "!bg-primary !text-white"
          }`}
          onClick={() => handleTabChange(0)}
        >
          Description
        </div>
        <div
          className={`cursor-pointer px-8 py-4 light bg-[#f1f1f1] dark:bg-[#2a2b2f] text-gray-500 text-nowrap ${
            selectedTab === 1 && "!bg-primary !text-white"
          }`}
          onClick={() => handleTabChange(1)}
        >
          Additional Information
        </div>
        <div
          className={`cursor-pointer px-8 py-4 light bg-[#f1f1f1] dark:bg-[#2a2b2f] text-gray-500 ${
            selectedTab === 2 && "!bg-primary !text-white"
          }`}
          onClick={() => handleTabChange(2)}
        >
          Reviews
        </div>
      </div>
      <div>
        {selectedTab === 0 && (
          <div className="py-4">
            <p>{product?.description}</p>
          </div>
        )}
        {selectedTab === 1 && (
          <div className="py-4">
            {/* Additional information content */}
            <p>Additional information about the product...</p>
          </div>
        )}
        {selectedTab === 2 && (
          <div className="py-4">
            {/* Reviews content */}
            <p>Reviews for the product...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDesc;
