"use client";

import React, { useState, useMemo } from "react";
import AppModal from "@/components/AppModal";
import { Offer, OfferType } from "@/interfaces/product.interface";
import { useAllOffersQuery } from "@/hooks/queries/useOffersQuery";
import { useDeleteOfferMutation } from "@/hooks/mutations/useOfferMutations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  PencilLine,
  RefreshCw,
  Trash2,
  Eye,
  Tag,
  Calendar,
  Briefcase,
  Coins,
  Percent,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/helpers";
import UpdateOfferForm from "./UpdateOfferForm";
import CreateOfferButton from "./CreateOfferButton";

export const getOfferBadgeStyles = (active: boolean) => {
  return active
    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700";
};

const OffersComp = () => {
  const { data: offers = [], refetch } = useAllOffersQuery();
  const deleteOfferMutation = useDeleteOfferMutation({
    onSuccess: () => {
      setIsDeleteOpen(false);
      setSelectedOffer(null);
    },
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleDelete = () => {
    if (selectedOffer) {
      deleteOfferMutation.mutate(selectedOffer._id);
    }
  };

  // Compute metrics dynamically for the top stats deck
  const metrics = useMemo(() => {
    const now = new Date();
    const activeCampaigns = offers.filter((o) => {
      const isDateActive =
        (!o.startDate || now >= new Date(o.startDate)) &&
        (!o.endDate || now <= new Date(o.endDate));
      return o.isActive && isDateActive;
    });

    const activeOfferProductIds = new Set(
      activeCampaigns
        .flatMap((o) => o.products || [])
        .map((p) => (typeof p === "object" && p ? (p as any)._id : p)),
    );

    return {
      totalCampaigns: offers.length,
      activeCampaignsCount: activeCampaigns.length,
      totalPromoItems: activeOfferProductIds.size,
    };
  }, [offers]);

  return (
    <div className="w-full space-y-6 font-inter text-left ">
      {/* Delete Offer Modal */}
      <AppModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Confirmation"
        isDismissable={false}
        hideCloseButton
      >
        <div className="flex flex-col pt-2 font-inter">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Are you sure you want to delete offer <b>{selectedOffer?.name}</b>?
          </p>
          <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="dark:text-zinc-300 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteOfferMutation.isPending}
              className="gap-2 rounded-xl cursor-pointer"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>
      </AppModal>

      {/* Update Offer Modal */}
      <AppModal
        isOpen={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        title="Update Offer"
        size="xl"
        isDismissable={false}
        hideCloseButton
        scrollBehavior="inside"
      >
        {selectedOffer && (
          <UpdateOfferForm
            onClose={() => setIsUpdateOpen(false)}
            existingOffer={selectedOffer}
          />
        )}
      </AppModal>

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <Tag className="h-5 w-5 text-primary" />
            Promotional Campaigns & Offers
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Configure discount campaigns, percentage slash rates, and
            promotional storefront tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 border-border text-muted-foreground hover:text-foreground h-9 rounded-xl text-xs font-semibold cursor-pointer hover:bg-muted/30"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          <CreateOfferButton />
        </div>
      </div>

      {/* Metrics Statistics Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Campaigns */}
        <Card className="bg-card border-border/80 shadow-xs rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
              Total Campaigns
            </span>
            <span className="text-2xl font-black text-foreground block">
              {metrics.totalCampaigns}
            </span>
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <Tag className="h-5 w-5" />
          </div>
        </Card>

        {/* Active Campaigns */}
        <Card className="bg-card border-border/80 shadow-xs rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
              Active Offers
            </span>
            <span className="text-2xl font-black text-foreground block">
              {metrics.activeCampaignsCount}
            </span>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Coins className="h-5 w-5" />
          </div>
        </Card>

        {/* Total Discounted Items */}
        <Card className="bg-card border-border/80 shadow-xs rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
              Promo Products
            </span>
            <span className="text-2xl font-black text-foreground block">
              {metrics.totalPromoItems}
            </span>
          </div>
          <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
            <Percent className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Campaigns Listing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {offers.map((offer) => {
          const now = new Date();
          let progressPercent = 0;
          const isDateActive =
            (!offer.startDate || now >= new Date(offer.startDate)) &&
            (!offer.endDate || now <= new Date(offer.endDate));
          const isActive = offer.isActive && isDateActive;

          if (offer.startDate && offer.endDate) {
            const start = new Date(offer.startDate).getTime();
            const end = new Date(offer.endDate).getTime();
            const current = now.getTime();
            if (current >= start && current <= end) {
              progressPercent = Math.min(
                100,
                Math.max(0, ((current - start) / (end - start)) * 100),
              );
            } else if (current > end) {
              progressPercent = 100;
            }
          }

          return (
            <Card
              key={offer?._id}
              className="bg-card text-card-foreground border-border/80 shadow-xs rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <CardHeader className="p-5 pb-3.5 flex flex-row items-start justify-between border-b border-border/60">
                <div className="space-y-1 pr-4">
                  <CardTitle className="text-sm font-extrabold text-foreground tracking-tight block truncate max-w-[240px]">
                    {offer?.name}
                  </CardTitle>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${getOfferBadgeStyles(
                      isActive,
                    )}`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-32 rounded-xl bg-card border border-border/80"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedOffer(offer);
                        setIsUpdateOpen(true);
                      }}
                      className="cursor-pointer text-xs font-bold"
                    >
                      <PencilLine className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>Update</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedOffer(offer);
                        setIsDeleteOpen(true);
                      }}
                      className="cursor-pointer text-xs font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-955/20"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5 text-rose-500" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent className="p-5 flex-1 space-y-4">
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-semibold">
                  {offer?.description}
                </p>

                {/* Campaign Rate details */}
                <div className="bg-zinc-50 dark:bg-zinc-800/20 p-3 rounded-xl text-xs font-bold flex justify-between items-center">
                  <span className="text-zinc-500">Discount Rate</span>
                  {offer?.type === OfferType.PriceSlash && (
                    <span className="text-primary font-black">
                      ₦
                      {offer?.priceSlash
                        ? offer.priceSlash.toLocaleString()
                        : "0"}{" "}
                      Slash
                    </span>
                  )}
                  {offer?.type === OfferType.PercentageOff && (
                    <span className="text-primary font-black">
                      {String(offer?.percentageOff)}% OFF
                    </span>
                  )}
                </div>

                {/* Date progress timeline */}
                {offer.startDate && offer.endDate && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                      <span>Timeline</span>
                      <span>{Math.round(progressPercent)}% Elapsed</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isActive ? "bg-primary" : "bg-zinc-400"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-semibold text-muted-foreground/60">
                      <span>{formatDate(offer.startDate)}</span>
                      <span>{formatDate(offer.endDate)}</span>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-5 pt-3.5 border-t border-border/60 bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col gap-3">
                <div className="w-full flex justify-between items-center text-xs font-semibold text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                    Products List
                  </span>
                  <span className="bg-card border border-border px-2 py-0.5 rounded-md text-[9px] font-bold text-foreground">
                    {offer.products?.length || 0} items
                  </span>
                </div>

                <Link
                  href={`/dashboard/sales-offers/${offer?._id}`}
                  className="w-full"
                >
                  <Button className="w-full bg-primary hover:bg-primary/95 text-white gap-1.5 text-xs font-extrabold uppercase rounded-xl h-9 cursor-pointer">
                    <Eye className="h-3.5 w-3.5" />
                    See Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OffersComp;
