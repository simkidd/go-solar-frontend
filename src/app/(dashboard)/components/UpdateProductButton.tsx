"use client";
import AppModal from "@/components/AppModal";
import { Product } from "@/interfaces/product.interface";
import { ErrorResponse } from "@/interfaces/types";
import { updateProduct } from "@/lib/api/products";
import { Button, useDisclosure } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import UpdateProductForm from "./UpdateProductForm";

const UpdateProductButton: React.FC<{
  product: Product;
}> = ({ product }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isPublishOpen,
    onOpen: onPublishOpen,
    onOpenChange: onPublishOpenChange,
    onClose: onPublishClose,
  } = useDisclosure();

  return (
    <div className="flex items-center gap-2">
      <AppModal
        isOpen={isPublishOpen}
        onOpenChange={onPublishOpenChange}
        title=""
        isDismissable={false}
        hideCloseButton
        size="md"
        scrollBehavior="inside"
      >
        <PublishPopup product={product} onClose={onPublishClose} />
      </AppModal>

      <Button
        variant="faded"
        color="default"
        type="submit"
        startContent={<Edit size={16} />}
        onPress={onPublishOpen}
      >
        {product?.isPublished ? "Draft" : "Publish"}
      </Button>
      <AppModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Update Product"
        isDismissable={false}
        hideCloseButton
        size="4xl"
        scrollBehavior="inside"
      >
        <UpdateProductForm onClose={onClose} product={product} />
      </AppModal>

      <Button
        variant="solid"
        color="primary"
        type="submit"
        startContent={<Edit size={16} />}
        onPress={onOpen}
      >
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

  const [input, setInput] = useState({
    productId: product?._id,
    isPublished: product?.isPublished,
  });

  const handlePublish = async () => {
    const newPublishState = !input.isPublished;
    publishProductMutation.mutate({ ...input, isPublished: newPublishState });
  };

  const publishProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      toast.success(
        data?.isPublished ? "Product published" : "Product drafted"
      );
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

  return (
    <div className="flex flex-col">
      <p>
        {product.isPublished ? "Draft" : "Publish"} <b>{product?.name}</b>?
      </p>
      <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
        <Button variant="light" color="default" onPress={onClose}>
          Cancel
        </Button>
        <Button
          variant="solid"
          color="danger"
          type="submit"
          isDisabled={publishProductMutation.isPending}
          isLoading={publishProductMutation.isPending}
          onPress={handlePublish}
        >
          Yes, {product.isPublished ? "draft" : "publish"}
        </Button>
      </div>
    </div>
  );
};
