"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { AddOfferProductDTO } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const AddProductsToOffer: React.FC<{ productIds: string[] }> = ({
  productIds,
}) => {
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
        <Popup productIds={productIds} onClose={() => setIsOpen(false)} />
      </AppModal>

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/95 text-white"
      >
        Add selected to offer
      </Button>
    </>
  );
};

export default AddProductsToOffer;

export const Popup: React.FC<{
  productIds: string[];
  onClose: () => void;
}> = ({ onClose, productIds }) => {
  const { loading, addToOffer, offers } = useProductStore();
  const router = useRouter();
  const [input, setInput] = useState<AddOfferProductDTO>({
    offer: "",
    products: productIds,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.offer) return;
    await addToOffer(input);
    router.refresh();
    onClose();
  };

  const activeOffers = offers.filter((offer) => offer.isActive);

  return (
    <form className="w-full space-y-6 pt-2 font-inter" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add Offer to Product</label>
        <Select
          value={input.offer}
          onValueChange={(val) => setInput({ ...input, offer: val })}
        >
          <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
            <SelectValue placeholder="Select an offer" />
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
          disabled={loading || !input.offer}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
