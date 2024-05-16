"use client";
import AppModal from "@/components/AppModal";
import { Button, useDisclosure } from "@nextui-org/react";
import CreateProductForm from "./CreateProductForm";
import { Plus } from "lucide-react";

const CreateProductButton = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="New Product"
        isDismissable={false}
        hideCloseButton
        size="4xl"
        scrollBehavior="inside"
      >
        <CreateProductForm onClose={onClose} />
      </AppModal>

      <Button
        size="sm"
        variant="solid"
        color="primary"
        type="submit"
        className="rounded-md "
        startContent={<Plus size={16} />}
        onPress={onOpen}
      >
        Add Product
      </Button>
    </div>
  );
};

export default CreateProductButton;
