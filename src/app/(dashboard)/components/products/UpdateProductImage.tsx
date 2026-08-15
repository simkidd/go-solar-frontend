"use client";
import React, { useCallback, useState } from "react";
import { Product } from "@/interfaces/product.interface";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Upload, ImageOff } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useUpdateProductImageMutation } from "@/hooks/mutations/useProductMutations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UpdateProductImage: React.FC<{
  product: Product;
}> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-xs font-semibold gap-1.5 border-border hover:bg-muted/30 rounded-xl h-8 px-3 cursor-pointer"
      >
        <Edit2 className="h-3.5 w-3.5" />
        Manage Images
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[520px] bg-card border border-border/80 rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
            <DialogTitle className="text-sm font-extrabold text-foreground tracking-tight">
              Manage Product Images
            </DialogTitle>
            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
              Select an existing image slot to replace it with a new upload. Up to 5 images supported.
            </p>
          </DialogHeader>

          <div className="px-6 py-5">
            <ProductImagesForm onClose={() => setIsOpen(false)} product={product} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateProductImage;

export const ProductImagesForm: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ onClose, product }) => {
  const updateImagesMutation = useUpdateProductImageMutation({ onSuccess: onClose });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImgId, setSelectedImgId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const MAX_IMAGES = 5;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (product.images.length >= MAX_IMAGES) {
        toast.info(`You can only have up to ${MAX_IMAGES} images`);
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [product.images.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage || !selectedImgId) {
      toast.warning("Please select an image slot to replace, then upload a new image.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", product?._id);
    formData.append("imgId", selectedImgId);
    formData.append("updateImg", selectedImage);

    updateImagesMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full font-inter space-y-5">

      {/* Step 1: Choose slot to replace */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none">
          Step 1 — Select image to replace
        </p>

        {product.images && product.images.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.images.map((img) => (
              <button
                key={img.public_id}
                type="button"
                onClick={() => setSelectedImgId(img.public_id)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedImgId === img.public_id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/60 hover:border-border"
                }`}
              >
                <Image
                  src={img.url}
                  alt="product image"
                  fill
                  className="object-cover"
                />
                {selectedImgId === img.public_id && (
                  <div className="absolute inset-0 bg-primary/15 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary border-2 border-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
            <ImageOff className="h-5 w-5 text-muted-foreground/50 shrink-0" />
            <p className="text-xs text-muted-foreground font-semibold">
              No images yet. Upload your first image below.
            </p>
          </div>
        )}
      </div>

      {/* Step 2: Upload replacement */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none">
          Step 2 — Upload new image
        </p>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl py-6 px-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border/60 hover:border-border bg-muted/10 hover:bg-muted/20"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                {isDragActive ? "Drop image here" : "Drag & drop or click to browse"}
              </p>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                JPG, PNG, WEBP supported
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        {previewUrl && selectedImage && (
          <div className="flex items-center gap-3 mt-2 p-3 rounded-xl bg-muted/20 border border-border/60">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border/60 shrink-0">
              <Image
                src={previewUrl}
                alt="Selected preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{selectedImage.name}</p>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {(selectedImage.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
              className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-xs font-semibold rounded-xl h-9 px-5 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={updateImagesMutation.isPending || !selectedImgId || !selectedImage}
          className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-9 px-5 rounded-xl cursor-pointer"
        >
          {updateImagesMutation.isPending ? "Uploading..." : "Replace Image"}
        </Button>
      </div>
    </form>
  );
};
