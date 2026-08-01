"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { AddOfferProductDTO, Product } from "@/interfaces/product.interface";
import { ErrorResponse } from "@/interfaces/types";
import { addToOffer, getOffers } from "@/lib/api/offers";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const AddToOfferButton: React.FC<{
  product: Product;
}> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Add Offer"
        isDismissable={false}
        hideCloseButton
        scrollBehavior="inside"
      >
        <Popup product={product} onClose={() => setIsOpen(false)} />
      </AppModal>

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/95 text-white"
      >
        Add To Offer
      </Button>
    </>
  );
};

export default AddToOfferButton;

export const Popup: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ onClose, product }) => {
  const queryClient = useQueryClient();

  const {
    data: offers,
    isLoading: offersLoading,
  } = useQuery({
    queryKey: ["alloffers"],
    queryFn: async () => getOffers(),
  });

  const [input, setInput] = useState<AddOfferProductDTO>({
    offer: "",
    products: [product?._id],
  });

  const addToOfferMutation = useMutation({
    mutationFn: addToOffer,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["getProductById", product?._id],
      });
      onClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const resError = error.response?.data;
      console.error(resError);
      const errorMessage = resError && typeof resError === "object" && "message" in resError ? resError.message : String(resError);
      toast.error(`Error: ${errorMessage}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.offer) {
      toast.error("Please select an offer.");
      return;
    }

    addToOfferMutation.mutate(input);
  };

  const activeOffers = offers?.filter((offer) => offer.isActive) || [];

  return (
    <form className="w-full space-y-6 pt-2 font-inter" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add Offer to Product</label>
        <Select
          value={input.offer}
          onValueChange={(val) => setInput({ ...input, offer: val })}
        >
          <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
            <SelectValue placeholder={offersLoading ? "Loading offers..." : "Select an offer"} />
          </SelectTrigger>
          <SelectContent>
            {activeOffers.map((offer) => (
              <SelectItem key={offer?._id} value={offer?._id}>
                {offer?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={offersLoading || addToOfferMutation.isPending || !input.offer}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {addToOfferMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
