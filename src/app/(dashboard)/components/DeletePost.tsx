"use client";
import { Post } from "@/interfaces/post.interface";
import { useBlogStore } from "@/lib/stores/blog.store";
import { Button, useDisclosure } from "@nextui-org/react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import AppModal from "../../../components/AppModal";

const DeletePost: React.FC<{ post: Post }> = ({ post }) => {
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
        <DeletePopup onClose={onDeleteModalClose} post={post} />
      </AppModal>
      <button
        className="text-red-500 px-4 py-2 text-sm flex items-center"
        onClick={() => onDeleteModalOpen()}
      >
        <Trash className="mr-2" size={16} />
        Delete
      </button>
    </>
  );
};

export default DeletePost;

export const DeletePopup: React.FC<{
  post: Post;
  onClose: () => void;
}> = ({ post, onClose }) => {
  const { loading, deletePost } = useBlogStore();
  const router = useRouter();

  const handleDelete = async () => {
    await deletePost(post?._id);
    onClose();
    router.push("/admin/blogs");
  };

  return (
    <div className="flex flex-col">
      <p>
        Are you sure you want to delete <b>{post?.title}</b>?
      </p>
      <div className="flex items-center gap-2 mt-8 mb-4 ms-auto">
        <Button
          variant="light"
          color="default"
          className="rounded-md"
          onPress={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          color="danger"
          type="submit"
          className="rounded-md "
          isDisabled={loading}
          isLoading={loading}
          onPress={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
