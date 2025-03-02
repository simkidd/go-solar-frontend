"use client";
import AppModal from "@/components/AppModal";
import { Button, useDisclosure } from "@heroui/react";
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
        color="primary"
        startContent={<Plus size={16} />}
        onPress={onOpen}
      >
        Add Product
      </Button>
    </div>
  );
};

export default CreateProductButton;
