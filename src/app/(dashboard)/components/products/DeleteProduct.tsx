"use client";
import React, { useState } from "react";
import AppModal from "@/components/AppModal";
import { Product } from "@/interfaces/product.interface";
import { deleteProduct } from "@/lib/api/products.api";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteProduct: React.FC<{ product: Product }> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Confirmation"
        isDismissable={false}
        hideCloseButton
      >
        <DeletePopup onClose={() => setIsOpen(false)} product={product} />
      </AppModal>
      <Button
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Trash className="h-4 w-4" />
        Delete
      </Button>
    </>
  );
};

export default DeleteProduct;

export const DeletePopup: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
      onClose();
      router.back();
    },
  });

  const handleDelete = () => {
    deleteProductMutation.mutate(product?._id);
  };

  return (
    <div className="flex flex-col">
      <p className="text-zinc-600 dark:text-zinc-300 text-sm">
        Are you sure you want to delete <b>{product?.name}</b>?
      </p>
      <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
        <Button variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Cancel
        </Button>
        <Button
          variant="destructive"
          disabled={deleteProductMutation.isPending}
          onClick={handleDelete}
        >
          {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};
