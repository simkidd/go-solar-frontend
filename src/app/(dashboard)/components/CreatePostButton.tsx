"use client"
import AppModal from "@/components/AppModal";
import { Button, useDisclosure } from "@nextui-org/react";
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
        size="sm"
        variant="solid"
        color="primary"
        type="submit"
        className="rounded-md "
        startContent={<Plus size={16} />}
        onPress={onOpen}
      >
        Add Post
      </Button>
    </div>
  );
};

export default CreatePostButton;
