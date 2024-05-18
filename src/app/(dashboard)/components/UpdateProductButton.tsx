"use client";
import AppModal from "@/components/AppModal";
import UpdateProductForm from "./UpdateProductForm";
import { Button, useDisclosure } from "@nextui-org/react";
import { Edit, Plus } from "lucide-react";
import { Category, Product } from "@/interfaces/product.interface";

const UpdateProductButton: React.FC<{
  product: Product;
}> = ({ product }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div>
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
        size="sm"
        variant="solid"
        color="primary"
        type="submit"
        className="rounded-md "
        startContent={<Edit size={16} />}
        onPress={onOpen}
      >
        Update
      </Button>
    </div>
  );
};

export default UpdateProductButton;
