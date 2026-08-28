"use client";

import React from "react";
import { useActiveOffersQuery } from "@/hooks/queries/useOffersQuery";
import { usePublishedProductsQuery } from "@/hooks/queries/useProductsQuery";
import { Offer, Product } from "@/interfaces/product.interface";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/app/(ecommerce)/components/shop/ProductCard";
import { Zap, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";

// ── Per-campaign section ───────────────────────────────────────────────────
const CampaignSection: React.FC<{ offer: Offer }> = ({ offer }) => {
  const { data: productsData, isLoading } = usePublishedProductsQuery({
    page: 1,
    limit: 100,
    offer: offer._id,
  });

  const products: Product[] = productsData?.products || [];

  return (
    <section className="space-y-6">
      {/* Campaign header */}
      <div className="flex items-end justify-between border-b border-border/60 pb-4 select-none">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
            <Zap className="h-3 w-3 fill-primary" />
            Flash Deal · {offer.percentageOff}% Off
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            {offer.name}
          </h2>
          {offer.description && (
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed max-w-xl">
              {offer.description}
            </p>
          )}
        </div>
        <Link
          href={`/products?offer=${offer._id}`}
          className="text-xs font-black uppercase tracking-wider text-primary hover:underline transition-colors shrink-0 ml-4"
        >
          View All →
        </Link>
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
          <Tag className="h-6 w-6 text-muted-foreground/40" />
          <p className="text-xs font-bold text-muted-foreground">
            No products linked to this campaign yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 8).map((product: Product) => (
            <ProductCard key={product._id} item={product} />
          ))}
        </div>
      )}
    </section>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────
const OffersPageComp: React.FC = () => {
  const { data: offers = [], isLoading, isError } = useActiveOffersQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-16 font-inter">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-9 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        {Array.from({ length: 2 }).map((_, s) => (
          <div key={s} className="space-y-6">
            <div className="border-b border-border/60 pb-4">
              <Skeleton className="h-4 w-32 rounded-full mb-2" />
              <Skeleton className="h-8 w-48 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-3xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center gap-4 text-center font-inter">
        <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
        <h2 className="text-sm font-bold text-foreground">Failed to load deals</h2>
        <p className="text-xs text-muted-foreground font-semibold">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full font-inter bg-background">
      {/* ── Page Header ── */}
      <div className="w-full bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-border/80 py-10 select-none">
        <div className="container mx-auto px-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary mb-2">
            <Zap className="h-3.5 w-3.5 fill-primary" /> Live Campaigns
          </span>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Flash Deals &amp; Offers
          </h1>
          <p className="text-sm text-muted-foreground font-semibold mt-2 max-w-lg leading-relaxed">
            Limited-time price slashes on solar panels, inverters, batteries and
            complete off-grid packages. Stock is limited — order before prices revert.
          </p>
        </div>
      </div>

      {/* ── Campaign Sections ── */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {offers.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <Zap className="h-10 w-10 text-muted-foreground/20" />
            <h2 className="text-sm font-bold text-foreground">No active deals right now</h2>
            <p className="text-xs text-muted-foreground font-semibold max-w-xs leading-relaxed">
              Check back soon — new campaigns are added regularly. Browse our{" "}
              <Link href="/shop" className="text-primary hover:underline">
                full product catalog
              </Link>{" "}
              in the meantime.
            </p>
          </div>
        ) : (
          offers.map((offer: Offer) => (
            <CampaignSection key={offer._id} offer={offer} />
          ))
        )}
      </div>
    </div>
  );
};

export default OffersPageComp;
