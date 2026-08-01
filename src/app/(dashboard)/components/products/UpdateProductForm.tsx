"use client";
import React, { useState } from "react";
import useCategories from "@/hooks/useCategories";
import { Product, UpdateProductInput } from "@/interfaces/product.interface";
import { ErrorResponse } from "@/interfaces/types";
import { getOffers } from "@/lib/api/offers";
import { updateProduct } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const UpdateProductForm: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const queryClient = useQueryClient();

  const {
    categories: allCategories,
  } = useCategories();

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

  const {
    data: offers,
    isLoading: offersLoading,
  } = useQuery({
    queryKey: ["alloffers"],
    queryFn: async () => getOffers(),
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
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
    if (!input.category) {
      toast.error("Please select a category");
      return;
    }

    updateProductMutation.mutate(input);
  };

  const activeOffers = offers?.filter((offer) => offer.isActive) || [];

  return (
    <form className="w-full font-inter space-y-6 pt-2" onSubmit={handleSubmit}>
      <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Title</label>
            <Input
              type="text"
              placeholder="Enter product name"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
            <Textarea
              placeholder="Enter product description"
              value={input.description}
              onChange={(e) => setInput({ ...input, description: e.target.value })}
              rows={4}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
              <Select
                value={input.category}
                onValueChange={(val) => setInput({ ...input, category: val })}
              >
                <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat?._id} value={cat?._id}>
                      {cat?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Brand</label>
              <Input
                type="text"
                placeholder="Brand name"
                value={input.brand}
                onChange={(e) => setInput({ ...input, brand: e.target.value })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Price (₦)</label>
              <Input
                type="number"
                placeholder="0"
                value={input.price || ""}
                onChange={(e) => setInput({ ...input, price: Number(e.target.value) })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Quantity in Stock</label>
              <Input
                type="number"
                placeholder="0"
                value={input.quantityInStock || ""}
                onChange={(e) => setInput({ ...input, quantityInStock: Number(e.target.value) })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Additional Information</label>
            <Textarea
              placeholder="Enter additional details"
              value={input.additionalInfo}
              onChange={(e) => setInput({ ...input, additionalInfo: e.target.value })}
              rows={4}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Delivery within PH (₦)</label>
              <Input
                type="number"
                placeholder="0"
                value={input.withinLocationDeliveryFee || ""}
                onChange={(e) => setInput({ ...input, withinLocationDeliveryFee: Number(e.target.value) })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Delivery outside PH (₦)</label>
              <Input
                type="number"
                placeholder="0"
                value={input.outsideLocationDeliveryFee || ""}
                onChange={(e) => setInput({ ...input, outsideLocationDeliveryFee: Number(e.target.value) })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add Offer to Product</label>
            <Select
              value={input.currentOffer}
              onValueChange={(val) => setInput({ ...input, currentOffer: val })}
            >
              <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder={offersLoading ? "Loading offers..." : "Select an offer (optional)"} />
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
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={updateProductMutation.isPending}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {updateProductMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateProductForm;
