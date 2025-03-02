"use client";
import AppModal from "@/components/AppModal";
import { AddOfferProductDTO, Product } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button, Select, SelectItem, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddToOfferButton: React.FC<{
  product: Product;
}> = ({ product }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <AppModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add Offer"
        isDismissable={false}
        hideCloseButton
        scrollBehavior="inside"
      >
        <Popup product={product} onClose={onClose} />
      </AppModal>

      <Button variant="solid" color="primary" type="submit" onPress={onOpen}>
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
  const { loading, addToOffer, offers } = useProductStore();
  const router = useRouter();
  const [input, setInput] = useState<AddOfferProductDTO>({
    offer: "",
    products: [product?._id],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addToOffer(input);
    router.refresh();
    onClose();
  };

  const activeOffers = offers.filter((offer) => offer?.isActive);

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="">
        <Select
          items={activeOffers}
          label="Add Offer to Product"
          placeholder="Select an offer"
          labelPlacement="outside"
          value={input.offer}
          onChange={(e) => setInput({ ...input, offer: e.target.value })}
        >
          {(offer) => (
            <SelectItem key={offer?._id} value={offer?._id}>
              {offer?.name}
            </SelectItem>
          )}
        </Select>
      </div>
      <div className="flex items-center gap-2 mt-8 mb-4 justify-end">
        <Button variant="light" color="default" onPress={onClose}>
          Close
        </Button>
        <Button
          variant="solid"
          color="primary"
          type="submit"
          isDisabled={loading}
          isLoading={loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
