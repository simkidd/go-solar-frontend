"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { Offer, OfferType } from "@/interfaces/product.interface";
import { useAllOffersQuery } from "@/hooks/queries/useOffersQuery";
import { useDeleteOfferMutation } from "@/hooks/mutations/useOfferMutations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, PencilLine, RefreshCw, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UpdateOfferForm from "./UpdateOfferForm";

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
  const router = useRouter();
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleDelete = () => {
    if (selectedOffer) {
      deleteOfferMutation.mutate(selectedOffer._id);
    }
  };

  return (
    <div className="w-full space-y-4">
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
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="dark:text-zinc-300">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteOfferMutation.isPending}
              className="gap-2"
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
      >
        {selectedOffer && (
          <UpdateOfferForm
            onClose={() => setIsUpdateOpen(false)}
            existingOffer={selectedOffer}
          />
        )}
      </AppModal>

      {/* Action Header */}
      <div className="flex justify-end items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer?._id} className="bg-white dark:bg-[#222327] border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between">
            <CardHeader className="pb-3 flex flex-row items-start justify-between border-b border-zinc-100 dark:border-zinc-800/80">
              <div>
                <CardTitle className="text-base font-bold dark:text-white">{offer?.name}</CardTitle>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold mt-1.5 ${getOfferBadgeStyles(offer?.isActive)}`}>
                  {offer?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedOffer(offer);
                      setIsUpdateOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <PencilLine className="mr-2 h-4 w-4" />
                    <span>Update</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedOffer(offer);
                      setIsDeleteOpen(true);
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="pt-4 flex-1 space-y-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                {offer?.description}
              </p>
              <div className="space-y-1">
                {offer?.type === OfferType.PriceSlash && (
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Price Slash: <span className="text-primary">₦{String(offer?.priceSlash)}</span>
                  </p>
                )}
                {offer?.type === OfferType.PercentageOff && (
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Percentage Off: <span className="text-primary">{String(offer?.percentageOff)}%</span>
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10">
              <Link href={`/dashboard/sales-offers/${offer?._id}`} className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/95 text-white gap-1.5">
                  <Eye className="h-4 w-4" />
                  See Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OffersComp;
