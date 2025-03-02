"use client";
import { Product } from "@/interfaces/product.interface";
import { Tab, Tabs } from "@heroui/react";
import React from "react";

const ProductDesc: React.FC<{
  product: Product;
}> = ({ product }) => {
  return (
    <div className="w-full my-8">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary text-base",
        }}
      >
        <Tab title="Description">
          <div>
            <p>{product?.description}</p>
          </div>
        </Tab>
        <Tab title="Additional Information">
          <div>
            <p>{product?.additionalInfo}</p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProductDesc;
