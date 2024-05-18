"use client";
import { Product } from "@/interfaces/product.interface";
import { Accordion, AccordionItem, Selection } from "@nextui-org/react";
import React, { useState } from "react";

const ProductDesc: React.FC<{
  product: Product;
}> = ({ product }) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["1"])
  );

  return (
    <div className="w-full flex lg:flex-row-reverse flex-col gap-8 relative">
      <Accordion
        variant="light"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <AccordionItem
          key="1"
          aria-label="Description"
          title={
            <p className="text-base font-medium dark:text-white">Description</p>
          }
        >
          {product?.description}
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Additional Information"
          title={
            <p className="text-base font-medium dark:text-white">
              Additional Information
            </p>
          }
        >
          {product?.description}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductDesc;
