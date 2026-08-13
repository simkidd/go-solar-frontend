"use client";
import React, { useEffect, useState } from "react";
import { Offer, OfferType, Product } from "@/interfaces/product.interface";
import { useAllProductsQuery } from "@/hooks/queries/useProductsQuery";
import { formatCurrency } from "@/utils/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const OfferProducts: React.FC<{
  offer: Offer;
}> = ({ offer }) => {
  const { data: products = [], isLoading: loading } = useAllProductsQuery();

  const filteredProducts = products.filter(
    (product) => product?.currentOffer?._id === offer._id
  );

  return (
    <div className="w-full space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-[#1a1b1e] p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 dark:text-white">{offer?.name}</h1>
          <p className="text-sm text-zinc-500 mt-1">{offer?.description}</p>
        </div>
        <div>
          {offer?.type === OfferType.PercentageOff && (
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
              {offer?.percentageOff}% Off
            </span>
          )}
          {offer?.type === OfferType.PriceSlash && (
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              {formatCurrency(offer?.priceSlash, "NGN")}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800">
                <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 h-11 text-xs">Product</TableHead>
                <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 h-11 text-xs">Price</TableHead>
                <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 h-11 text-xs">Discount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product: Product) => (
                <TableRow key={product._id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10">
                  <TableCell className="py-3 text-sm text-zinc-850 dark:text-zinc-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 min-w-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 relative bg-zinc-50 dark:bg-zinc-900">
                        <Image
                          src={product?.images?.[0]?.url || "/placeholder-product.jpg"}
                          alt={product?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-white line-clamp-2">{product?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-sm font-semibold">
                    {formatCurrency(product?.price, "NGN")}
                  </TableCell>
                  <TableCell className="py-3 text-sm">
                    {product?.currentOffer?.percentageOff ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                        {product?.currentOffer?.percentageOff}% off
                      </span>
                    ) : product?.currentOffer?.priceSlash ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                        {formatCurrency(product?.currentOffer?.priceSlash, "NGN")}
                      </span>
                    ) : (
                      <span className="text-zinc-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No products found for this offer.
        </div>
      )}
    </div>
  );
};

export default OfferProducts;
