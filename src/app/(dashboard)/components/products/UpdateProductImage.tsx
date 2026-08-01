"use client";
import React, { useCallback, useState } from "react";
import AppModal from "@/components/AppModal";
import { Product } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const UpdateProductImage: React.FC<{
  product: Product;
}> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 border-zinc-200 dark:border-zinc-800 dark:text-zinc-300"
      >
        <Edit className="h-4 w-4" />
        Update Images
      </Button>

      <AppModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Update Product Images"
        isDismissable={false}
        hideCloseButton
        size="md"
        scrollBehavior="inside"
      >
        <ProductImagesForm onClose={() => setIsOpen(false)} product={product} />
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > 3) {
        toast.info("You can only upload up to 3 images");
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const newImageUrls = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setImages((prevFiles) => [...prevFiles, ...newImageUrls]);
      setSelectedImage(newFiles[0]);
    },
    [images.length]
  );

  const thumbs = images.map((image, i) => (
    <div key={i} className="relative w-20 h-20 group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <Image
        src={image}
        alt={`Product Image ${i + 1}`}
        className="w-full h-full object-cover"
        width={80}
        height={80}
      />
      <button
        type="button"
        className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => {
          setImages(images.filter((f) => f !== image));
          setSelectedImage(null);
          setSelectedImgId(null);
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  ));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage || !selectedImgId) {
      alert("Please select an image to update");
      return;
    }

    const formData = new FormData();
    formData.append("productId", product?._id);
    formData.append("imgId", selectedImgId);
    formData.append("updateImg", selectedImage);

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    await updateImages(formData, config);

    router.refresh();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full font-inter space-y-6 pt-2">
      <div className="w-full space-y-4">
        {product.images && product.images.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Select an image to update
            </h3>
            <div className="flex flex-wrap gap-2">
              {thumbs.map((thumb, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedImgId(product?.images[i].public_id);
                  }}
                  className={`cursor-pointer rounded-lg p-0.5 border-2 transition-all ${
                    selectedImgId && product?.images[i]?.public_id === selectedImgId
                      ? "border-primary"
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
          className={`border-2 border-dashed rounded-xl py-12 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/10 ${
            isDragActive ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-primary text-sm font-medium">Drop file here...</p>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <Upload className="h-6 w-6 text-zinc-400" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Drag & drop image here, or <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-xs text-zinc-400">JPEG, PNG only (1 file at a time)</p>
            </div>
          )}
        </div>

        {selectedImage && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-500">Selected File Preview:</h4>
            <div className="w-24 h-24 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Image"
                className="w-full h-full object-cover"
                width={96}
                height={96}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={imageLoading || !selectedImgId || !selectedImage}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {imageLoading ? "Updating..." : "Update Image"}
        </Button>
      </div>
    </form>
  );
};
