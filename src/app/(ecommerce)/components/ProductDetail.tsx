"use client";
import { Product } from "@/interfaces/product.interface";
import useCartStore from "@/lib/stores/useCart";
import { formatCurrency } from "@/utils/helpers";
import { MinusCircle, PlusCircle } from "lucide-react";
import React, { useState } from "react";

const ProductDetail: React.FC<{
  product: Product;
}> = ({ product }) => {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="w-full flex flex-col p-4">
      <h2 className="font-bold text-4xl mb-8">{product?.name}</h2>
      <h3 className="font-bold text-2xl mb-6">
        {formatCurrency(product?.price, "NGN")}
      </h3>

      <div className="flex flex-col gap-2 mb-6">
        <p className="text-base-medium text-grey-2">Quantity:</p>
        <div className="flex gap-4 items-center">
          <MinusCircle
            className="hover:text-red-1 cursor-pointer"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          />
          <p className="text-body-bold">{quantity}</p>
          <PlusCircle
            className="hover:text-red-1 cursor-pointer"
            onClick={() => setQuantity(quantity + 1)}
          />
        </div>
      </div>

      <div>
        <p className="text-base-medium text-grey-2">Delivery Fee:</p>
        <p className="font-medium text-lg">
          {formatCurrency(product?.withinLocationDeliveryFee, "NGN")}
        </p>
      </div>

      <button
        className="bg-primary text-white py-4 px-8 mt-8"
        onClick={() =>
          addItem({
            product,
            qty: quantity,
            deliveryFee: product?.withinLocationDeliveryFee,
          })
        }
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductDetail;
