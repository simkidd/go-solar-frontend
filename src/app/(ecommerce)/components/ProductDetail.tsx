"use client";
import { Product } from "@/interfaces/product.interface";
import useCartStore from "@/lib/stores/cart.store";
import { formatCurrency } from "@/utils/helpers";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { BsCartPlus } from "react-icons/bs";

const ProductDetail: React.FC<{
  product: Product;
  productCode?: string | null;
}> = ({ product, productCode }) => {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryOption, setDeliveryOption] = useState<"within" | "outside">(
    "within"
  );

  const selectedDeliveryFee =
    deliveryOption === "within"
      ? product?.withinLocationDeliveryFee
      : product?.outsideLocationDeliveryFee;

  return (
    <div className="w-full flex flex-col lg:p-4">
      <h2 className="font-bold text-3xl mb-4">{product?.name}</h2>
      <p className="text-sm mb-8">
        Product code: <span className="font-semibold">{productCode}</span>
      </p>
      <h3 className="font-bold text-2xl mb-6">
        {formatCurrency(product?.price, "NGN")}
      </h3>

      <div className="flex items-center mb-2">
        <p className="w-32">Brand:</p>
        <p className="">{product?.brand}</p>
      </div>
      <div className="flex items-center mb-2">
        <p className="w-32">Availability:</p>
        <p className="">
          {product?.quantityInStock > 1 ? "In Stock" : "Out of Stock"}
        </p>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <p className="">Quantity:</p>

        <div className="flex items-center ">
          <button
            className="disabled:text-gray-400 disabled:bg-opacity-50 disabled:cursor-not-allowed cursor-pointer h-8 w-8 flex items-center justify-center rounded-sm bg-primary text-white"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Minus size={18} />
          </button>
          <span className="px-4 text-sm">{quantity}</span>
          <button
            className="h-8 w-8 flex items-center justify-center rounded-sm bg-primary text-white"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div>
        <p className="">Delivery Fee:</p>
        <p className="font-bold">
          {formatCurrency(selectedDeliveryFee, "NGN")}
        </p>

        <p className="mt-4">Location:</p>
        <div className="flex gap-4 mt-1">
          <button
            className={`${
              deliveryOption === "within"
                ? "border border-primary text-primary"
                : "border border-gray-500 text-gray-500"
            } py-2 px-4 rounded-lg`}
            onClick={() => setDeliveryOption("within")}
          >
            Port Harcourt
          </button>
          <button
            className={`${
              deliveryOption === "outside"
                ? "border border-primary text-primary"
                : "border border-gray-500 text-gray-500"
            } py-2 px-4 rounded-lg`}
            onClick={() => setDeliveryOption("outside")}
          >
            Others
          </button>
        </div>
      </div>

      <div>
        <button
          className="bg-primary text-white py-4 px-8 mt-8 flex items-center gap-2"
          onClick={() =>
            addItem({
              product,
              qty: quantity,
              deliveryFee: selectedDeliveryFee,
            })
          }
        >
          Add To Cart
          <BsCartPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
