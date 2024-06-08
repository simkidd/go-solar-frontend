"use client";
import AppModal from "@/components/AppModal";
import { Product } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { Button, useDisclosure } from "@nextui-org/react";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

interface FileWithPreview extends File {
  preview: string;
}

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
        title="Update Product"
        isDismissable={false}
        hideCloseButton
        size="4xl"
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
  const [images, setImages] = useState<string[]>(product?.images as any);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

    if (!selectedImage) {
      alert("Please select an image to update");
      return;
    }

    const formData = new FormData();
    formData.append("productId", product._id);
    formData.append("imgId", "goSolar/ys0nc8n2crou0ad4quqq"); // Replace with actual imgId
    formData.append("updateImg", selectedImage);

    try {
      const response = await axiosInstance.post(
        "/api/admin/update-product-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product images updated:", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating product images:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        {/* Existing Images (You'll need to fetch these from your database) */}
        {product.images && product.images.length > 0 && (
          <div className="col-span-1">
            <h3 className="mb-2">Existing Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {thumbs}
            </div>
          </div>
        )}

        {/* Image Upload Area */}
        <div
          {...getRootProps()}
          className={`col-span-1 border-dashed border-2 rounded-lg py-16 px-4 flex flex-col items-center justify-center ${
            isDragActive ? "border-primary" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-primary">Drop files here...</p>
          ) : (
            <p className="text-gray-500">
              Drag & drop image here, or click to select a file
            </p>
          )}
          {selectedImage && (
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Image"
              className="w-48 mt-4 rounded"
              width={80}
              height={80}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Button
          variant="solid"
          color="primary"
          type="submit"
          className="rounded-md "
          isDisabled={!selectedImage}
        >
          Update Image
        </Button>
        <Button variant="light" color="default" onPress={onClose}>
          Close
        </Button>
      </div>
    </form>
  );
};
