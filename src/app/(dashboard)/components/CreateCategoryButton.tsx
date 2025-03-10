"use client";
import AppModal from "@/components/AppModal";
import { Button, useDisclosure } from "@heroui/react";
import React from "react";
import CreateCategoryForm from "./CreateCategoryForm";
import { Plus } from "lucide-react";

const CreateCategoryButton = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="New Category"
        isDismissable={false}
        hideCloseButton
      >
        <CreateCategoryForm onClose={onClose} />
      </AppModal>

      <Button
        color="primary"
        startContent={<Plus size={16} />}
        onPress={onOpen}
      >
        Add Category
      </Button>
    </div>
  );
};

export default CreateCategoryButton
