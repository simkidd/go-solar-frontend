"use client";
import SocialShare from "@/components/SocialShare";
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

  const calculateNewPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  const newPrice =
    product?.currentOffer?.isActive &&
    product?.currentOffer?.percentageOff !== undefined
      ? calculateNewPrice(product?.price, product?.currentOffer?.percentageOff)
      : product?.price;

  return (
    <div className="w-full flex flex-col lg:p-4">
      <div className="mb-3">
        <h2 className="font-bold text-2xl">{product?.name}</h2>
        <p className="text-base">
          Product code: <span className="font-semibold">{productCode}</span>
        </p>
        <p className="text-base">
          Brand: <span className="font-semibold">{product?.brand}</span>
        </p>
      </div>

      {product?.currentOffer?.isActive && (
        <div className="bg-yellow-200 text-yellow-900 p-4 mb-4 rounded-md shadow-md">
          <p className="text-lg font-semibold">Limited Time Offer!</p>
          <p className="capitalize">{product?.currentOffer?.name}</p>
        </div>
      )}

      <div className="flex justify-between items-center border-t border-b border-t-[#f1f1f1] dark:border-t-[#2a2b2f] border-b-[#f1f1f1] dark:border-b-[#2a2b2f] py-4 mb-4">
        <h3 className="font-bold text-2xl space-x-2">
          <span className="font-semibold">
            {formatCurrency(newPrice, "NGN")}
          </span>
          {product?.currentOffer?.isActive &&
            product?.currentOffer?.percentageOff && (
              <span className="line-through text-gray-500 text-xl">
                {formatCurrency(product?.price, "NGN")}
              </span>
            )}
        </h3>

        <p className="text-gray-500">
          Stock:{" "}
          <span className="font-semibold">{product?.quantityInStock}</span>
        </p>
      </div>

      <div className="flex gap-8 mb-6">
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

        <div>
          <button
            className="bg-primary text-white py-3 px-6 flex items-center gap-2"
            onClick={() =>
              addItem({
                product: {
                  ...product,
                  price: newPrice,
                },
                qty: quantity,
                deliveryFee: selectedDeliveryFee,
              })
            }
          >
            Add To Cart
            <BsCartPlus size={18} />
          </button>
        </div>
      </div>

      <div>
        <p className="">
          Delivery Fee:{" "}
          <span className="font-bold">
            {formatCurrency(selectedDeliveryFee, "NGN")}
          </span>
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

      <div className="flex gap-4 mt-4 items-center">
        <div className="bg-gray-400 text-black py-2 px-3 rounded-md">
          <p className="font-medium">Call us for Bulk Purchases:</p>
          <p>0706 276 2879</p>
        </div>
        <div>
          <SocialShare />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
