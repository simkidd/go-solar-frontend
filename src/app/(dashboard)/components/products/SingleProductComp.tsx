"use client";
import ProductDesc from "@/app/(ecommerce)/components/shop/ProductDesc";
import ProductImages from "@/app/(ecommerce)/components/shop/ProductImages";
import { getProductById } from "@/lib/api/products";
import { formatCurrency } from "@/utils/helpers";
import { Card, CardBody } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import AddToOfferButton from "../AddToOfferButton";
import DeleteProduct from "./DeleteProduct";
import SingleProductSkeleton from "./SingleProductSkeleton";
import UpdateProductButton from "./UpdateProductButton";
import UpdateProductImage from "./UpdateProductImage";

const SingleProductComp: React.FC<{ id: string }> = ({ id }) => {
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getProductById", id],
    queryFn: async () => getProductById(id),
  });

  if (isLoading) {
    return <SingleProductSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const calculateNewPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  const newPrice =
    product?.currentOffer?.isActive &&
    product?.currentOffer?.percentageOff !== undefined
      ? calculateNewPrice(product?.price, product?.currentOffer?.percentageOff)
      : product?.price;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/products">
          <button className="inline-flex items-center gap-1">
            <ArrowLeft size={16} />
            Products
          </button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h4 className="font-semibold text-2xl text-gray-800 dark:text-gray-200">
          Product Detail
        </h4>

        <div className="flex items-center gap-2 flex-wrap">
          <DeleteProduct product={product} />
          <UpdateProductButton product={product} />
          <AddToOfferButton product={product} />
        </div>
      </div>

      <Card className="dark:bg-[#222327] dark:text-white mb-8 shadow-lg rounded-lg">
        <CardBody>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            {/* Product Images */}
            <div className="w-full">
              <ProductImages images={product?.images} />

              <div className="mt-8">
                <UpdateProductImage product={product} />
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full flex flex-col space-y-6">
              <h2 className="font-bold text-3xl text-gray-900 dark:text-gray-100">
                {product?.name}
              </h2>

              {/* Price Section */}
              <div className="flex items-center space-x-4">
                <span className="font-bold text-3xl text-primary">
                  {formatCurrency(newPrice, "NGN")}
                </span>
                {product?.currentOffer?.isActive &&
                  product?.currentOffer?.percentageOff && (
                    <span className="line-through text-gray-500 text-2xl">
                      {formatCurrency(product?.price, "NGN")}
                    </span>
                  )}
              </div>

              {/* Offer Banner */}
              {product?.currentOffer?.isActive && (
                <div className="bg-yellow-200/25 text-yellow-500 p-4 rounded-lg border border-yellow-500/50">
                  <p className="capitalize text-lg font-semibold">
                    {product?.currentOffer?.name}
                  </p>
                  <p className="">Limited Time Offer!</p>
                </div>
              )}

              {/* Product Metadata */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Quantity in stock:
                  </p>
                  <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {product?.quantityInStock}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Category:
                  </p>
                  <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {product?.category?.name}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Brand:
                  </p>
                  <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {product?.brand}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Delivery fee within Location:
                  </p>
                  <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {formatCurrency(product?.withinLocationDeliveryFee, "NGN")}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Delivery fee outside Location:
                  </p>
                  <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {formatCurrency(product?.outsideLocationDeliveryFee, "NGN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <ProductDesc product={product} />
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default SingleProductComp;
