"use client";
import GlobalModal from "@/components/GlobalModal";
import { useBlog } from "@/contexts/blog.context";
import { Post } from "@/interfaces/post.interface";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DeleteButton: React.FC<{ post: Post }> = ({ post }) => {
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  return (
    <>
      <GlobalModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        title="Confirmation"
        isDismissable={true}
        hideCloseButton
      >
        <DeletePopup onClose={onDeleteModalClose} post={post} />
      </GlobalModal>
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

export default DeleteButton;

export const DeletePopup: React.FC<{
  post: Post;
  onClose: () => void;
}> = ({ post, onClose }) => {
  const { loading, deletePost } = useBlog();
  const router = useRouter();

  const handleDelete = async () => {
    await deletePost(post?._id);

    toast.success("deleted successfully");
    onClose();
    revalidatePath("/admin/blogs");
    router.push("/admin/blogs");
  };

  return (
    <div>
      <p>
        Are you sure you want to delete{" "}
        <span className="font-bold">{`${post?.title}`}</span>?
      </p>
      <div className="flex items-center justify-between gap-2 mt-8 mb-4">
        <Button
          variant="flat"
          color="danger"
          className="rounded-md"
          onPress={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          color="primary"
          type="submit"
          className="rounded-md "
          onPress={handleDelete}
        >
          {loading ? <Spinner size="sm" /> : "Yes, delete"}
        </Button>
      </div>
    </div>
  );
};
