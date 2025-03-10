"use client";
import { CreateOfferInput, OfferType } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import React, { useState } from "react";

const CreateOfferForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { loading, createOffer } = useProductStore();
  const [input, setInput] = useState<CreateOfferInput>({
    name: "",
    description: "",
    type: OfferType.PercentageOff,
    percentageOff: 0,
    priceSlash: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createOffer(input);
    onClose();
  };

  return (
    <form className="w-full font-inter" onSubmit={handleSubmit}>
      <div className="w-full grid grid-cols-1">
        <div className="mb-3">
          <Input
            type="text"
            label="Title"
            labelPlacement="outside"
            placeholder="Enter offer name"
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <Textarea
            label="Description"
            labelPlacement="outside"
            placeholder="Enter offer description"
            value={input.description}
            onChange={(e) =>
              setInput({ ...input, description: e.target.value })
            }
            minRows={4}
            maxRows={8}
          />
        </div>
        {/* <div className="mb-3">
          <Select
            label="Offer Type"
            placeholder="Select an offer type"
            labelPlacement="outside"
            onChange={(e) =>
              setInput({ ...input, type: e.target.value as OfferType })
            }
            isRequired
          >
            <SelectItem
              key={OfferType.PercentageOff}
              value={OfferType.PercentageOff}
              
            >
              Percentage Off
            </SelectItem>
            <SelectItem key={OfferType.PriceSlash} value={OfferType.PriceSlash}>
              Price Slash
            </SelectItem>
          </Select>
        </div> */}

        <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
          <div className="">
            <Input
              type="number"
              label="Percentage Off"
              labelPlacement="outside"
              placeholder="Enter percentage off"
              value={String(input.percentageOff)}
              onChange={(e) => {
                const newValue = e.target.valueAsNumber;
                if (!isNaN(newValue)) {
                  setInput({ ...input, percentageOff: newValue });
                }
              }}
              isDisabled={input.type !== OfferType.PercentageOff}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">%</span>
                </div>
              }
            />
          </div>

          {/* <div className="">
            <Input
              type="number"
              label="Price Slash"
              labelPlacement="outside"
              placeholder="Enter price slash"
              value={String(input.priceSlash)}
              onChange={(e) => {
                const newValue = e.target.valueAsNumber;
                if (!isNaN(newValue)) {
                  setInput({ ...input, priceSlash: newValue });
                }
              }}
              isDisabled={input.type !== OfferType.PriceSlash}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">₦</span>
                </div>
              }
            />
          </div> */}
        </div>
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
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateOfferForm;
