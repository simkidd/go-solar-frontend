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
      <div className="flex items-center justify-between mb-4 select-none">
        <Link href="/dashboard/products" className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <ArrowLeft size={14} />
          Back to products
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4 select-none">
        <h4 className="font-extrabold text-2xl text-foreground tracking-tight">
          Product Details
        </h4>

        <div className="flex items-center gap-2 flex-wrap">
          <DeleteProduct product={product} />
          <UpdateProductButton product={product} />
          <AddToOfferButton product={product} />
        </div>
      </div>

      <Card className="bg-card text-card-foreground border-border/80 shadow-xs rounded-3xl overflow-hidden">
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
              <h2 className="font-extrabold text-2xl text-foreground tracking-tight">
                {product?.name}
              </h2>

              {/* Price Section */}
              <div className="flex items-baseline space-x-3 select-none">
                <span className="font-black text-2xl text-primary">
                  {formatCurrency(newPrice, "NGN")}
                </span>
                {product?.currentOffer?.isActive &&
                  product?.currentOffer?.percentageOff && (
                    <span className="line-through text-muted-foreground/60 text-base font-semibold">
                      {formatCurrency(product?.price, "NGN")}
                    </span>
                  )}
              </div>

              {/* Offer Banner */}
              {product?.currentOffer?.isActive && (
                <div className="bg-amber-500/10 text-amber-500 p-4 rounded-2xl border border-amber-500/20 select-none">
                  <p className="capitalize text-sm font-black uppercase tracking-wider">
                    {product?.currentOffer?.name}
                  </p>
                  <p className="text-xs font-semibold text-amber-600 mt-0.5">Limited Time Offer!</p>
                </div>
              )}

              {/* Product Metadata */}
              <div className="space-y-4 border-t border-border/60 pt-4">
                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground min-w-36">
                    Quantity in stock:
                  </p>
                  <span className="text-sm font-extrabold text-foreground select-all">
                    {product?.quantityInStock}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground min-w-36">
                    Category:
                  </p>
                  <span className="text-sm font-extrabold text-foreground select-all">
                    {product?.category?.name}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground min-w-36">
                    Brand Name:
                  </p>
                  <span className="text-sm font-extrabold text-foreground select-all">
                    {product?.brand}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground min-w-36">
                    Local Delivery Fee:
                  </p>
                  <span className="text-sm font-extrabold text-foreground select-all">
                    {formatCurrency(product?.withinLocationDeliveryFee, "NGN")}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-12">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground min-w-36">
                    Out of Town Delivery Fee:
                  </p>
                  <span className="text-sm font-extrabold text-foreground select-all">
                    {formatCurrency(product?.outsideLocationDeliveryFee, "NGN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8 border-t border-border/60 pt-6">
            <ProductDesc product={product} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SingleProductComp;
