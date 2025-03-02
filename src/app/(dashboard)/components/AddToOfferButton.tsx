"use client";
import AppModal from "@/components/AppModal";
import { AddOfferProductDTO, Product } from "@/interfaces/product.interface";
import { ErrorResponse } from "@/interfaces/types";
import { addToOffer, getOffers } from "@/lib/api/offers";
import { useProductStore } from "@/lib/stores/product.store";
import { Button, Select, SelectItem, useDisclosure } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

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
  const queryClient = useQueryClient();

  const {
    data: offers,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["alloffers"],
    queryFn: async () => getOffers(),
  });

  const router = useRouter();
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
      const errorMessage = resError?.message ? resError?.message : resError;
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

  // Get disabled keys based on the `isActive` property
  const disabledKeys =
    offers?.filter((offer) => !offer.isActive).map((offer) => offer._id) || [];

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="">
        <Select
          items={offers || []}
          label="Add Offer to Product"
          placeholder={isLoading ? "Loading offers..." : "Select an offer"}
          labelPlacement="outside"
          disabledKeys={disabledKeys}
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
          isDisabled={isLoading || addToOfferMutation.isPending || !input.offer}
          isLoading={addToOfferMutation.isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
