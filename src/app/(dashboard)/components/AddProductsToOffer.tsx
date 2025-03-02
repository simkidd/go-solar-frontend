import AppModal from "@/components/AppModal";
import { AddOfferProductDTO, Product } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button, Select, SelectItem, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AddProductsToOffer: React.FC<{ productIds: string[] }> = ({
  productIds,
}) => {
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
        <Popup productIds={productIds} onClose={onClose} />
      </AppModal>

      <Button variant="solid" color="primary" type="submit" onPress={onOpen}>
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

    await addToOffer(input);
    router.refresh();
    onClose();
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="">
        <Select
          items={offers}
          label="Add Offer to Product"
          placeholder="Select an offer"
          labelPlacement="outside"
          value={input.offer}
          onChange={(e) => setInput({ ...input, offer: e.target.value })}
        >
          {(offer) => (
            <SelectItem key={offer?._id} textValue={offer?.name}>
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
