"use client";
import React from "react";
import { Product } from "@/interfaces/product.interface";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ProductDesc: React.FC<{
  product: Product;
}> = ({ product }) => {
  return (
    <div className="w-full my-8 font-inter">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start rounded-none bg-transparent p-0 border-b border-zinc-150 dark:border-zinc-800 space-x-6 h-12">
          <TabsTrigger
            value="description"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none bg-transparent h-full px-0 text-sm font-bold text-zinc-550 dark:text-zinc-400"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="additional"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none bg-transparent h-full px-0 text-sm font-bold text-zinc-550 dark:text-zinc-400"
          >
            Additional Information
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="py-6 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-350">
          <p>{product?.description}</p>
        </TabsContent>
        <TabsContent value="additional" className="py-6 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-350">
          <p>{product?.additionalInfo || "No additional information listed."}</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDesc;
