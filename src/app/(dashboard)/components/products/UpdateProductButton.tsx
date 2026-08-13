"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { Product } from "@/interfaces/product.interface";
import { ErrorResponse } from "@/interfaces/types";
import { updateProduct } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import UpdateProductForm from "./UpdateProductForm";

const UpdateProductButton: React.FC<{
  product: Product;
}> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <AppModal
        isOpen={isPublishOpen}
        onOpenChange={setIsPublishOpen}
        title=""
        isDismissable={false}
        hideCloseButton
        size="md"
        scrollBehavior="inside"
      >
        <PublishPopup product={product} onClose={() => setIsPublishOpen(false)} />
      </AppModal>

      <Button
        variant="outline"
        onClick={() => setIsPublishOpen(true)}
        className="gap-2 border-zinc-200 dark:border-zinc-800 dark:text-zinc-300"
      >
        <Edit className="h-4 w-4" />
        {product?.isPublished ? "Draft" : "Publish"}
      </Button>

      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Update Product"
        isDismissable={false}
        hideCloseButton
        size="4xl"
        scrollBehavior="inside"
      >
        <UpdateProductForm onClose={() => setIsOpen(false)} product={product} />
      </AppModal>

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
      >
        <Edit className="h-4 w-4" />
        Update
      </Button>
    </div>
  );
};

export default UpdateProductButton;

export const PublishPopup: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ onClose, product }) => {
  const queryClient = useQueryClient();

  const [input] = useState({
    productId: product?._id,
    isPublished: product?.isPublished,
  });

  const publishProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      toast.success(
        data?.product?.isPublished ? "Product Published" : "Product Drafted"
      );
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

  const handlePublish = async () => {
    const newPublishState = !input.isPublished;
    publishProductMutation.mutate({ ...input, isPublished: newPublishState });
  };

  return (
    <div className="flex flex-col">
      <p className="text-zinc-600 dark:text-zinc-300 text-sm">
        Are you sure you want to {product.isPublished ? "draft" : "publish"} <b>{product?.name}</b>?
      </p>
      <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
        <Button variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Cancel
        </Button>
        <Button
          variant="destructive"
          disabled={publishProductMutation.isPending}
          onClick={handlePublish}
        >
          {publishProductMutation.isPending ? "Processing..." : `Yes, ${product.isPublished ? "draft" : "publish"}`}
        </Button>
      </div>
    </div>
  );
};
