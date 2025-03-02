"use client";
import AppModal from "@/components/AppModal";
import { Product } from "@/interfaces/product.interface";
import { deleteProduct } from "@/lib/api/products";
import { Button, useDisclosure } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const DeleteProduct: React.FC<{ product: Product }> = ({ product }) => {
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  return (
    <>
      <AppModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        title="Confirmation"
        isDismissable={false}
        hideCloseButton
      >
        <DeletePopup onClose={onDeleteModalClose} product={product} />
      </AppModal>
      <Button
        color="danger"
        variant="light"
        onPress={() => onDeleteModalOpen()}
      >
        <Trash className="mr-2" size={16} />
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
      <p>
        Are you sure you want to delete <b>{product?.name}</b>?
      </p>
      <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
        <Button variant="light" color="default" onPress={onClose}>
          Cancel
        </Button>
        <Button
          variant="solid"
          color="danger"
          type="submit"
          isDisabled={deleteProductMutation.isPending}
          isLoading={deleteProductMutation.isPending}
          onPress={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
