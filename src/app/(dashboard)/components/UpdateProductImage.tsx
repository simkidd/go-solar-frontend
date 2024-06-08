"use client";
import AppModal from "@/components/AppModal";
import { IImage, Product } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { useProductStore } from "@/lib/stores/product.store";
import { Button, useDisclosure } from "@nextui-org/react";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { GrCloudUpload } from "react-icons/gr";
import { toast } from "react-toastify";

const UpdateProductImage: React.FC<{
  product: Product;
}> = ({ product }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div>
      <Button
        size="sm"
        variant="faded"
        color="default"
        type="submit"
        className="rounded-md "
        startContent={<Edit size={16} />}
        onPress={onOpen}
      >
        Update Images
      </Button>

      <AppModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Update Product Images"
        isDismissable={false}
        hideCloseButton
        size="md"
        scrollBehavior="inside"
      >
        <ProductImagesForm onClose={onClose} product={product} />
      </AppModal>
    </div>
  );
};

export default UpdateProductImage;

export const ProductImagesForm: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ onClose, product }) => {
  const { updateImages, imageLoading } = useProductStore();
  const [images, setImages] = useState<string[]>(
    product.images.map((img) => img.url)
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImgId, setSelectedImgId] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 3) {
      toast.info("You can only upload up to 3 images");
      return;
    }

    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    // Create an array of new image URLs
    const newImageUrls = acceptedFiles.map((file) => URL.createObjectURL(file));

    // Update the images state with new URLs
    setImages((prevFiles) => [...prevFiles, ...newImageUrls]);
    setSelectedImage(newFiles[0]);
  }, []);

  const thumbs = images.map((image, i) => (
    <div key={i} className="relative m-2 w-20 h-20">
      <Image
        src={image} // Directly use the image URL
        alt={`Product Image ${i + 1}`}
        className="w-full h-full object-cover rounded-lg"
        width={80}
        height={80}
      />
      <button
        type="button"
        className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1"
        onClick={() => {
          setImages(images.filter((f) => f !== image));
          setSelectedImage(null);
          setSelectedImgId(null);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  ));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false, // Allow only one image at a time
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage || !selectedImgId) {
      alert("Please select an image to update");
      return;
    }

    const formData = new FormData();
    formData.append("productId", product?._id);
    formData.append("imgId", selectedImgId); // Replace with actual imgId
    formData.append("updateImg", selectedImage);

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    await updateImages(formData, config);

    router.refresh();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full font-inter">
      <div className="w-full">
        {/* Existing Images (You'll need to fetch these from your database) */}
        {product.images && product.images.length > 0 && (
          <div className="col-span-1 mb-4">
            <h3 className="mb-2">Select an image to update</h3>
            <div className="flex flex-wrap gap-2">
              {thumbs.map((thumb, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedImgId(product?.images[i].public_id);
                  }}
                  className={`cursor-pointer border-2 ${
                    selectedImgId &&
                    product?.images[i]?.public_id === selectedImgId
                      ? "border-primary rounded"
                      : "border-transparent"
                  }`}
                >
                  {thumb}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Upload Area */}
        <div
          {...getRootProps()}
          className={`col-span-1 border-dashed border-2 rounded-lg py-16 px-4 flex gap-2 flex-wrap cursor-pointer ${
            isDragActive ? "border-primary" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-primary">Drop files here...</p>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <GrCloudUpload size={20} />
              <p className="text-gray-500">
                Drag & drop image here, or click to select a file
              </p>
            </div>
          )}
          {selectedImage && (
            <div className="w-48 h-48 overflow-hidden rounded">
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Image"
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 mb-4 justify-end">
        <Button
          variant="light"
          color="default"
          className="rounded-md"
          onPress={onClose}
        >
          Close
        </Button>
        <Button
          variant="solid"
          color="primary"
          type="submit"
          className="rounded-md "
          isDisabled={imageLoading || !selectedImgId}
          isLoading={imageLoading}
        >
          Update Image
        </Button>
      </div>
    </form>
  );
};
