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
    <div className="w-full flex lg:flex-row-reverse flex-col gap-8 relative">
      <div className="lg:w-72 w-full">
        <div className="w-full h-fit flex items-center flex-col sticky top-[185px]">
          <div
            className={`w-full cursor-pointer px-8 py-4 light bg-[#f1f1f1] dark:bg-[#2a2b2f] text-gray-500 ${
              selectedTab === 0 && "!bg-primary !text-white"
            }`}
            onClick={() => handleTabChange(0)}
          >
            Description
          </div>
          <div
            className={`w-full cursor-pointer px-8 py-4 light bg-[#f1f1f1] dark:bg-[#2a2b2f] text-gray-500 text-nowrap ${
              selectedTab === 1 && "!bg-primary !text-white"
            }`}
            onClick={() => handleTabChange(1)}
          >
            Additional Information
          </div>
          <div
            className={`w-full cursor-pointer px-8 py-4 light bg-[#f1f1f1] dark:bg-[#2a2b2f] text-gray-500 ${
              selectedTab === 2 && "!bg-primary !text-white"
            }`}
            onClick={() => handleTabChange(2)}
          >
            Reviews
          </div>
        </div>
      </div>
      <div className="w-full">
        {selectedTab === 0 && (
          <div className="py-4">
            <h3 className="font-bold text-2xl mb-6">Product Description</h3>
            <p>{product?.description}</p>
           
          </div>
        )}
        {selectedTab === 1 && (
          <div className="py-4">
            {/* Additional information content */}
            <p>{product?.additionalInfo}</p>
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
