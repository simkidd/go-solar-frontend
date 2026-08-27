"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Percent,
  TrendingDown,
  Trash2,
  Edit2,
  RefreshCw,
  Package,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { Offer, Product } from "@/interfaces/product.interface";
import { getOffer } from "@/lib/api/offers.api";
import {
  useDeleteOfferMutation,
  useUpdateOfferMutation,
} from "@/hooks/mutations/useOfferMutations";
import { useAllProductsQuery } from "@/hooks/queries/useProductsQuery";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import AppModal from "@/components/AppModal";
import UpdateOfferForm from "./UpdateOfferForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const SingleOfferComp: React.FC<{ id: string }> = ({ id }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // ── States ──
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // ── Offer details query ──
  const {
    data: offer,
    isLoading,
    isError,
    refetch,
  } = useQuery<Offer | null>({
    queryKey: ["getOfferById", id],
    queryFn: async () => getOffer(id),
  });

  // ── Products query (for checking linked items) ──
  const { data: productsData, isLoading: productsLoading } =
    useAllProductsQuery({
      page: 1,
      limit: 1000,
    });
  const products = productsData?.products || [];

  const filteredProducts = useMemo(() => {
    if (!offer) return [];
    return products.filter((product) => {
      const prodOfferId =
        typeof product?.currentOffer === "object" && product?.currentOffer
          ? product?.currentOffer._id
          : product?.currentOffer;
      return prodOfferId === offer._id;
    });
  }, [products, offer]);

  // ── Mutations ──
  const toggleStatusMutation = useUpdateOfferMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getOfferById", id] });
      setIsStatusOpen(false);
    },
  });

  const deleteOfferMutation = useDeleteOfferMutation({
    onSuccess: () => {
      router.push("/dashboard/sales-offers");
    },
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-6 select-none animate-pulse">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !offer) {
    notFound();
  }

  const typedOffer = offer as Offer;

  const formattedDate = (dateStr?: string) => {
    if (!dateStr) return "Not Scheduled";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Determine campaign status
  const now = new Date();
  const start = typedOffer.startDate ? new Date(typedOffer.startDate) : null;
  const end = typedOffer.endDate ? new Date(typedOffer.endDate) : null;
  const isScheduledFuture = start && start > now;
  const isExpired = end && end < now;
  const isCurrentlyActive =
    typedOffer.isActive && (!start || start <= now) && (!end || end >= now);

  return (
    <div className="w-full font-inter space-y-6 select-none">
      {/* ── Modals & Dialog Cockpit ── */}

      {/* 1. Edit details modal */}
      <AppModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Update Campaign Offer"
        isDismissable={false}
        hideCloseButton
        size="2xl"
        scrollBehavior="inside"
      >
        <UpdateOfferForm
          onClose={() => {
            setIsEditOpen(false);
            queryClient.invalidateQueries({ queryKey: ["getOfferById", id] });
          }}
          existingOffer={typedOffer}
        />
      </AppModal>

      {/* 2. Status toggle confirmation dialog */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-foreground font-extrabold text-base">
              {typedOffer.isActive
                ? "Deactivate Campaign"
                : "Activate Campaign"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
              Are you sure you want to{" "}
              {typedOffer.isActive ? "deactivate" : "activate"}{" "}
              <b>{typedOffer.name}</b>? This will toggle its active status
              globally on the store catalog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsStatusOpen(false)}
              className="text-xs font-semibold rounded-xl h-10 px-5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={toggleStatusMutation.isPending}
              onClick={() => {
                toggleStatusMutation.mutate({
                  offerId: typedOffer._id,
                  input: {
                    name: typedOffer.name,
                    description: typedOffer.description,
                    type: typedOffer.type,
                    percentageOff: typedOffer.percentageOff,
                    isActive: !typedOffer.isActive,
                    startDate: typedOffer.startDate,
                    endDate: typedOffer.endDate,
                  },
                });
              }}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-10 px-5 rounded-xl cursor-pointer"
            >
              {toggleStatusMutation.isPending
                ? "Updating..."
                : `Yes, ${typedOffer.isActive ? "Deactivate" : "Activate"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Delete confirmation dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-foreground font-extrabold text-base">
              Delete Campaign Offer
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
              Are you sure you want to delete <b>{typedOffer.name}</b>? This
              action cannot be undone, will remove the campaign, and restore
              standard pricing parameters on all affected products.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs font-semibold rounded-xl h-10 px-5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={deleteOfferMutation.isPending}
              onClick={() => {
                deleteOfferMutation.mutate(typedOffer._id);
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold h-10 px-5 rounded-xl cursor-pointer"
            >
              {deleteOfferMutation.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Navigation Breadcrumb ── */}
      <div className="flex items-center justify-between select-none">
        <Link
          href="/dashboard/sales-offers"
          className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to campaigns
        </Link>

        <button
          onClick={() => refetch()}
          className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          title="Refresh Details"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* ── Page Hero Title & Control Actions Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              {typedOffer.name}
            </h2>
            {isCurrentlyActive ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="h-2.5 w-2.5" /> Active
              </span>
            ) : isScheduledFuture ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Clock className="h-2.5 w-2.5 animate-pulse" /> Scheduled
              </span>
            ) : isExpired ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                <XCircle className="h-2.5 w-2.5" /> Expired
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                <XCircle className="h-2.5 w-2.5" /> Inactive / Paused
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-semibold">
            Pricing Rule:{" "}
            <span className="font-bold text-primary uppercase">
              {typedOffer.percentageOff}% OFF Store Items
            </span>
          </p>
        </div>

        {/* Unified Cockpit Actions Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setIsStatusOpen(true)}
            className="text-xs font-semibold h-9 px-4 rounded-xl border-border text-muted-foreground hover:text-foreground cursor-pointer hover:bg-muted/30"
          >
            {typedOffer.isActive ? "Pause Campaign" : "Make Active"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(true)}
            className="text-xs font-semibold h-9 px-4 rounded-xl border-red-200 dark:border-red-950 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer gap-1.5"
          >
            <Trash2 size={13} /> Delete Campaign
          </Button>

          <Button
            onClick={() => setIsEditOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-9 px-4 rounded-xl cursor-pointer shadow-xs gap-1.5"
          >
            <Edit2 size={13} /> Edit Campaign
          </Button>
        </div>
      </div>

      {/* ── 2:1 Shopify-style Layout split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column: Primary Content (2/3) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Description copy */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Campaign Description
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Overview of marketing notes, copy guidelines, and criteria
                details
              </p>
            </div>

            <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line select-text">
              {typedOffer.description ||
                "No description copy provided for this campaign."}
            </div>
          </div>

          {/* Card 2: Linked Products & Slashed Prices Table */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Pricing Audit
                Log
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Cross-reference product slashes applied by this active campaign
              </p>
            </div>

            {productsLoading ? (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="border border-border/60 rounded-xl overflow-hidden shadow-xs">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
                      <TableHead className="font-extrabold text-muted-foreground uppercase tracking-wider text-[9px] h-11">
                        Product Details
                      </TableHead>
                      <TableHead className="font-extrabold text-muted-foreground uppercase tracking-wider text-[9px] h-11">
                        Original Price
                      </TableHead>
                      <TableHead className="font-extrabold text-muted-foreground uppercase tracking-wider text-[9px] h-11">
                        Campaign Price
                      </TableHead>
                      <TableHead className="font-extrabold text-muted-foreground uppercase tracking-wider text-[9px] h-11 text-right">
                        Total Savings
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: Product) => {
                      const discountAmount = Math.round(
                        product.price * (typedOffer.percentageOff / 100),
                      );
                      const campaignPrice = product.price - discountAmount;

                      return (
                        <TableRow
                          key={product._id}
                          className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                        >
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 min-w-9 rounded-lg overflow-hidden border border-border bg-muted/20 relative">
                                <Image
                                  src={
                                    product?.images?.[0]?.url ||
                                    "/placeholder-product.jpg"
                                  }
                                  alt={product?.name}
                                  fill
                                  sizes="36px"
                                  className="object-cover"
                                />
                              </div>
                              <Link
                                href={`/dashboard/products/${product?._id}`}
                              >
                                <span className="font-bold text-xs text-foreground line-clamp-1 max-w-xs">
                                  {product?.name}
                                </span>
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-xs font-semibold text-muted-foreground line-through">
                            {formatCurrency(product?.price, "NGN")}
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="font-black text-emerald-500">
                                {formatCurrency(campaignPrice, "NGN")}
                              </span>
                              <span className="inline-flex items-center text-[8px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md">
                                -{typedOffer.percentageOff}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-xs font-black text-right text-emerald-500">
                            {formatCurrency(discountAmount, "NGN")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 rounded-xl bg-muted/10 border border-dashed border-border flex flex-col items-center justify-center gap-2 select-none text-center p-6">
                <Package className="w-6 h-6 text-muted-foreground/45" />
                <p className="text-xs font-bold text-foreground">
                  No items active in campaign
                </p>
                <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed font-semibold">
                  Assign products to this campaign offer from the Product
                  Manager to apply discount pricing rules storefront-wide.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Metadata & Details (1/3) ── */}
        <div className="space-y-6 col-span-1">
          {/* Card 3: Campaign Configuration Specs */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-2 select-none">
              <Percent className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Discount Rules
              </h3>
            </div>

            <div className="space-y-3.5 pt-1 select-none text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Discount type:
                </span>
                <span className="font-bold text-foreground">
                  Percentage Off (%)
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Discount rate:
                </span>
                <span className="font-black text-emerald-500">
                  {typedOffer.percentageOff}% OFF regular price
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Affected products:
                </span>
                <span className="font-bold text-foreground">
                  {productsLoading ? "..." : `${filteredProducts.length} Items`}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Campaign Scheduling / Period */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4 shadow-xs">
            <div className="border-b border-border/60 pb-3 flex items-center gap-2 select-none">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Campaign Timeline
              </h3>
            </div>

            <div className="space-y-3.5 pt-1 select-none text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Start Date:
                </span>
                <span className="font-bold text-foreground">
                  {formattedDate(typedOffer.startDate)}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  End Date:
                </span>
                <span className="font-bold text-foreground">
                  {typedOffer.endDate
                    ? formattedDate(typedOffer.endDate)
                    : "Indefinite"}
                </span>
              </div>

              {/* Graphical timeline status banner */}
              {isCurrentlyActive && (
                <div className="bg-emerald-500/10 text-emerald-500 p-3.5 rounded-xl border border-emerald-500/20 text-[10px] font-bold text-center">
                  Campaign is active and running live on the store!
                </div>
              )}
              {isScheduledFuture && (
                <div className="bg-amber-500/10 text-amber-500 p-3.5 rounded-xl border border-amber-500/20 text-[10px] font-bold text-center">
                  Campaign is queued and scheduled for future activation.
                </div>
              )}
              {isExpired && (
                <div className="bg-red-500/10 text-red-500 p-3.5 rounded-xl border border-red-500/20 text-[10px] font-bold text-center">
                  Campaign is expired. Slashed pricing has automatically
                  reverted.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOfferComp;
export { SingleOfferComp };
