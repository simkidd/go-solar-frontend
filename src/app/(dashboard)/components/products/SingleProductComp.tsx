"use client";
import ProductDesc from "@/app/(ecommerce)/components/shop/ProductDesc";
import ProductImages from "@/app/(ecommerce)/components/shop/ProductImages";
import { getProductById } from "@/lib/api/products";
import { formatCurrency } from "@/utils/helpers";
import { Card, CardContent } from "@/components/ui/card";
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
        <Link href="/dashboard/products" className="text-sm font-medium flex items-center gap-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <ArrowLeft size={16} />
          Back to products
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h4 className="font-bold text-2xl text-zinc-900 dark:text-white">
          Product Detail
        </h4>

        <div className="flex items-center gap-2 flex-wrap">
          <DeleteProduct product={product} />
          <UpdateProductButton product={product} />
          <AddToOfferButton product={product} />
        </div>
      </div>

      <Card className="dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6">
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
              <h2 className="font-extrabold text-3xl text-zinc-900 dark:text-white">
                {product?.name}
              </h2>

              {/* Price Section */}
              <div className="flex items-center space-x-4">
                <span className="font-black text-3xl text-primary">
                  {formatCurrency(newPrice, "NGN")}
                </span>
                {product?.currentOffer?.isActive &&
                  product?.currentOffer?.percentageOff && (
                    <span className="line-through text-zinc-400 text-xl font-medium">
                      {formatCurrency(product?.price, "NGN")}
                    </span>
                  )}
              </div>

              {/* Offer Banner */}
              {product?.currentOffer?.isActive && (
                <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl border border-amber-200 dark:border-amber-900/50">
                  <p className="capitalize text-lg font-bold">
                    {product?.currentOffer?.name}
                  </p>
                  <p className="text-sm mt-0.5">Limited Time Offer!</p>
                </div>
              )}

              {/* Product Metadata */}
              <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 min-w-36">
                    Quantity in stock:
                  </p>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {product?.quantityInStock}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 min-w-36">
                    Category:
                  </p>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {product?.category?.name}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 min-w-36">
                    Brand:
                  </p>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {product?.brand}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 min-w-36">
                    Delivery within Location:
                  </p>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(product?.withinLocationDeliveryFee, "NGN")}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 min-w-36">
                    Delivery outside Location:
                  </p>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(product?.outsideLocationDeliveryFee, "NGN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800/80 pt-6">
            <ProductDesc product={product} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SingleProductComp;
