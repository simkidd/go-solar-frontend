"use client";
import AppModal from "@/components/AppModal";
import { Button, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import React from "react";
import CreateBlogPostForm from "./CreateBlogPostForm";

const CreatePostButton = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div>
      <AppModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="New Post"
        isDismissable={false}
        hideCloseButton
        size="2xl"
        scrollBehavior="inside"
      >
        <CreateBlogPostForm onClose={onClose} />
      </AppModal>

      <Button
        color="primary"
        startContent={<Plus size={16} />}
        onPress={onOpen}
      >
        Add Post
      </Button>
    </div>
  );
};

export default CreatePostButton;
