"use client";
import React from "react";
import AppModal from "@/components/AppModal";
import { Button, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import CreateOfferForm from "./CreateOfferForm";

const CreateOfferButton = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Create Offer"
        isDismissable={false}
        hideCloseButton
        size="xl"
        scrollBehavior="inside"
      >
        <CreateOfferForm onClose={onClose} />
      </AppModal>

      <Button
        variant="solid"
        color="primary"
        type="submit"
        startContent={<Plus size={16} />}
        onPress={onOpen}
      >
        Add Offer
      </Button>
    </div>
  );
};

export default CreateOfferButton;
