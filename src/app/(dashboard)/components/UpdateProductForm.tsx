"use client";
import { Product, UpdateProductInput } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UpdateProductForm: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const { loading, updateProduct, categories, offers } = useProductStore();
  const router = useRouter();
  const [input, setInput] = useState<UpdateProductInput>({
    productId: product?._id,
    name: product?.name,
    description: product?.description,
    category: product?.category?._id,
    brand: product?.brand,
    price: product?.price,
    additionalInfo: product?.additionalInfo,
    quantityInStock: product?.quantityInStock,
    outsideLocationDeliveryFee: product?.outsideLocationDeliveryFee,
    withinLocationDeliveryFee: product?.withinLocationDeliveryFee,
    isPublished: product?.isPublished,
    currentOffer: product?.currentOffer?._id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.category === "") {
      alert("Please select a category");
      return;
    }

    await updateProduct(input);

    router.refresh();
    onClose();
  };

  const activeOffers = offers.filter((offer) => offer?.isActive);

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="w-full grid lg:grid-cols-2 grid-cols-1">
        <div className="col-span-1 lg:pr-4">
          <div className="mb-3">
            <Input
              type="text"
              label="Title"
              labelPlacement="outside"
              placeholder="Enter product name"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <Textarea
              label="Description"
              labelPlacement="outside"
              placeholder="Enter product description"
              value={input.description}
              onChange={(e) =>
                setInput({ ...input, description: e.target.value })
              }
              minRows={4}
              maxRows={8}
            />
          </div>
          <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
            <div className="">
              <Select
                items={categories}
                label="Category"
                placeholder="Select a category"
                labelPlacement="outside"
                value={input.category}
                onChange={(e) =>
                  setInput({ ...input, category: e.target.value })
                }
              >
                {(cat) => (
                  <SelectItem key={cat?._id} value={cat?._id}>
                    {cat?.name}
                  </SelectItem>
                )}
              </Select>
            </div>
            <div className="">
              <Input
                type="text"
                label="Brand"
                labelPlacement="outside"
                placeholder="Enter a brand name"
                value={input.brand}
                onChange={(e) => setInput({ ...input, brand: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
            <div className="">
              <Input
                type="number"
                label="Price"
                labelPlacement="outside"
                placeholder="0.00"
                value={String(input.price)}
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({ ...input, price: newValue });
                  }
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₦</span>
                  </div>
                }
              />
            </div>
            <div className="">
              <Input
                type="number"
                label="Quantity in stock"
                labelPlacement="outside"
                placeholder="0.00"
                value={String(input.quantityInStock)}
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({ ...input, quantityInStock: newValue });
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:pl-4">
          <div className="mb-3">
            <Textarea
              label="Additional Information"
              labelPlacement="outside"
              placeholder="Enter additional information"
              value={input.additionalInfo}
              onChange={(e) =>
                setInput({ ...input, additionalInfo: e.target.value })
              }
              minRows={4}
              maxRows={8}
            />
          </div>
          <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
            <div className="">
              <Input
                type="number"
                label="Within Port Harcourt"
                labelPlacement="outside"
                placeholder="0.00"
                value={String(input.withinLocationDeliveryFee)}
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({
                      ...input,
                      withinLocationDeliveryFee: newValue,
                    });
                  }
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₦</span>
                  </div>
                }
              />
            </div>
            <div className="">
              <Input
                type="number"
                label="Outside Port Harcourt"
                labelPlacement="outside"
                placeholder="0.00"
                value={String(input.outsideLocationDeliveryFee)}
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({
                      ...input,
                      outsideLocationDeliveryFee: newValue,
                    });
                  }
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₦</span>
                  </div>
                }
              />
            </div>

            <div className="">
              <Select
                items={activeOffers}
                label="Add Offer to Product"
                placeholder="Select an offer"
                labelPlacement="outside"
                value={input.currentOffer}
                onChange={(e) =>
                  setInput({ ...input, currentOffer: e.target.value })
                }
              >
                {(offer) => (
                  <SelectItem key={offer?._id} value={offer?._id}>
                    {offer?.name}
                  </SelectItem>
                )}
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-6">
          {/* <input
              type="checkbox"
              name=""
              id="publish"
              className="accent-current mr-1 cursor-pointer"
              checked={input.isPublished}
              onChange={(e) =>
                setInput({ ...input, isPublished: e.target.checked })
              }
            />
            <label htmlFor="publish" className="cursor-pointer">
              Publish on site
            </label> */}
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
      </div>
    </form>
  );
};

export default UpdateProductForm;
