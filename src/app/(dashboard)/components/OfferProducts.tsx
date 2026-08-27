"use client";
import React, { useMemo } from "react";
import { Offer, Product } from "@/interfaces/product.interface";
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
import {
  Tag,
  Package,
  Calendar,
  Percent,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OfferProducts: React.FC<{
  offer: Offer;
}> = ({ offer }) => {
  const { data, isLoading: loading } = useAllProductsQuery({ page: 1, limit: 1000 });
  const products = data?.products || [];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const prodOfferId =
        typeof product?.currentOffer === "object" && product?.currentOffer
          ? product?.currentOffer._id
          : product?.currentOffer;
      return prodOfferId === offer._id;
    });
  }, [products, offer._id]);

  const formattedDate = (dateStr?: string) => {
    if (!dateStr) return "Not Scheduled";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full space-y-8 font-inter select-none animate-fadeIn">
      {/* Premium Campaign Header Card */}
      <div className="relative bg-card border border-border/80 p-6 md:p-8 rounded-3xl overflow-hidden shadow-xs">
        {/* Decorative background ambient light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary">
              <Percent className="h-3 w-3 animate-pulse" />
              Active Pricing Campaign
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-none">
              {offer?.name}
            </h1>
            {offer?.description && (
              <p className="text-xs md:text-sm text-muted-foreground font-semibold leading-relaxed">
                {offer?.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 bg-muted/30 border border-border/80 px-5 py-3 rounded-2xl">
            <TrendingDown className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block leading-none mb-0.5">
                Discount Applied
              </span>
              <span className="text-xl font-black text-emerald-500 tracking-tight leading-none">
                {offer?.percentageOff}% Off
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-border bg-card shadow-xs rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">
                Linked Products
              </span>
              <span className="text-lg font-extrabold text-foreground leading-none">
                {loading ? "..." : `${filteredProducts.length} Items`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">
                Campaign Starts
              </span>
              <span className="text-xs font-extrabold text-foreground leading-none">
                {formattedDate(offer?.startDate)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">
                Campaign Ends
              </span>
              <span className="text-xs font-extrabold text-foreground leading-none">
                {offer?.endDate ? formattedDate(offer?.endDate) : "Never Expires"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Audit Table section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" /> Pricing Slashes &amp; Audit Log
          </h2>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
            Cross-reference catalog pricing changes applied by this promotional offer campaign
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
                  <TableHead className="font-extrabold text-muted-foreground uppercase tracking-wider text-[10px] h-12">
                    Product Details
                  </TableHead>
                  <TableHead className="font-extrabold text-muted-foreground uppercase tracking-wider text-[10px] h-12">
                    Original Price
                  </TableHead>
                  <TableHead className="font-extrabold text-muted-foreground uppercase tracking-wider text-[10px] h-12">
                    Campaign Price
                  </TableHead>
                  <TableHead className="font-extrabold text-muted-foreground uppercase tracking-wider text-[10px] h-12 text-right">
                    Total Savings
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: Product) => {
                  const discountAmount = Math.round(
                    product.price * (offer.percentageOff / 100)
                  );
                  const campaignPrice = product.price - discountAmount;

                  return (
                    <TableRow
                      key={product._id}
                      className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 min-w-10 rounded-xl overflow-hidden border border-border bg-muted/20 relative">
                            <Image
                              src={product?.images?.[0]?.url || "/placeholder-product.jpg"}
                              alt={product?.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-xs text-foreground line-clamp-1 max-w-sm">
                            {product?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-xs font-semibold text-muted-foreground line-through">
                        {formatCurrency(product?.price, "NGN")}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-black text-emerald-500">
                            {formatCurrency(campaignPrice, "NGN")}
                          </span>
                          <span className="inline-flex items-center text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md">
                            -{offer.percentageOff}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-xs font-black text-right text-emerald-500">
                        {formatCurrency(discountAmount, "NGN")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border p-12 text-center rounded-2xl">
            <Package className="h-8 w-8 text-muted-foreground/60 mx-auto mb-3" />
            <h3 className="text-xs font-bold text-foreground">
              No products active in this campaign
            </h3>
            <p className="text-[10px] text-muted-foreground max-w-xs mx-auto mt-1">
              To discount items, edit products from the catalog panel and assign them to the <b>{offer.name}</b> marketing offer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferProducts;
