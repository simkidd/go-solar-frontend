"use client";
import React from "react";
import { Product } from "@/interfaces/product.interface";

const ProductDesc: React.FC<{
  product: Product;
}> = ({ product }) => {
  return (
    <div className="w-full my-4 font-inter text-sm leading-relaxed text-muted-foreground select-text space-y-6">
      <p className="whitespace-pre-line">{product?.description}</p>
      {product?.additionalInfo && (
        <div className="pt-6 border-t border-border/45">
          <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider mb-2.5 ">
            Additional Information
          </h4>
          <p className="whitespace-pre-line">{product.additionalInfo}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDesc;
