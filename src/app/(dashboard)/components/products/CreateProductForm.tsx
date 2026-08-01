"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CreateProductInput } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface FileWithPreview extends File {
  preview: string;
}

const CreateProductForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { loading, createProduct, categories, offers } = useProductStore();
  const [input, setInput] = useState<CreateProductInput>({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: 0,
    additionalInfo: "",
    quantityInStock: 0,
    images: [],
    outsideLocationDeliveryFee: 0,
    withinLocationDeliveryFee: 0,
    isPublished: false,
    currentOffer: "",
  });
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const router = useRouter();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > 3) {
        toast.info("You can only upload up to 3 images");
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      setInput((prevInput) => ({
        ...prevInput,
        images: [...prevInput.images, ...(acceptedFiles as any)],
      }));
    },
    [files.length]
  );

  const thumbs = files.map((file) => (
    <div key={file.name} className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <Image
        src={file.preview}
        alt={file.name}
        className="w-full h-full object-cover"
        width={80}
        height={80}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
      <button
        type="button"
        className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-1 shadow-sm"
        onClick={() => {
          setFiles(files.filter((f) => f !== file));
          setInput((prevInput: any) => ({
            ...prevInput,
            images: prevInput.images.filter((img: any) => img !== file),
          }));
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: true,
    maxFiles: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.category === "") {
      toast.info("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("category", input.category);
    formData.append("name", input.name);
    formData.append("brand", input.brand);
    formData.append("price", input.price.toString());
    formData.append("description", input.description);
    formData.append("additionalInfo", input.additionalInfo);
    formData.append("quantityInStock", input.quantityInStock.toString());
    formData.append(
      "outsideLocationDeliveryFee",
      input.outsideLocationDeliveryFee.toString()
    );
    formData.append(
      "withinLocationDeliveryFee",
      input.withinLocationDeliveryFee.toString()
    );
    if (input.currentOffer) {
      formData.append("currentOffer", input.currentOffer);
    }
    input.images.forEach((image) => {
      formData.append("images", image);
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    await createProduct(formData, config);

    if (input.images.length > 0) {
      onClose();
    }
  };

  const activeOffers = offers.filter((offer) => offer?.isActive);

  return (
    <form className="w-full font-inter space-y-6 pt-2" onSubmit={handleSubmit}>
      <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Title</label>
            <Input
              type="text"
              placeholder="Enter product name"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
            <Textarea
              placeholder="Enter product description"
              value={input.description}
              onChange={(e) => setInput({ ...input, description: e.target.value })}
              rows={4}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
              <Select
                value={input.category}
                onValueChange={(val) => setInput({ ...input, category: val })}
              >
                <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat?._id} value={cat?._id}>
                      {cat?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Brand</label>
              <Input
                type="text"
                placeholder="Brand name"
                value={input.brand}
                onChange={(e) => setInput({ ...input, brand: e.target.value })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Price (₦)</label>
              <Input
                type="number"
                placeholder="0"
                value={input.price || ""}
                onChange={(e) => setInput({ ...input, price: Number(e.target.value) })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Quantity in Stock</label>
              <Input
                type="number"
                placeholder="0"
                value={input.quantityInStock || ""}
                onChange={(e) => setInput({ ...input, quantityInStock: Number(e.target.value) })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Delivery within PH (₦)</label>
              <Input
                type="number"
                placeholder="0"
                value={input.withinLocationDeliveryFee || ""}
                onChange={(e) => setInput({ ...input, withinLocationDeliveryFee: Number(e.target.value) })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Delivery outside PH (₦)</label>
              <Input
                type="number"
                placeholder="0"
                value={input.outsideLocationDeliveryFee || ""}
                onChange={(e) => setInput({ ...input, outsideLocationDeliveryFee: Number(e.target.value) })}
                className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add Offer to Product</label>
            <Select
              value={input.currentOffer}
              onValueChange={(val) => setInput({ ...input, currentOffer: val })}
            >
              <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Select an offer (optional)" />
              </SelectTrigger>
              <SelectContent>
                {activeOffers.map((offer) => (
                  <SelectItem key={offer?._id} value={offer?._id}>
                    {offer?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Images</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl py-10 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-zinc-50/50 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/10 ${
                isDragActive ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-primary text-sm font-medium">Drop the files here...</p>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <Upload className="h-5 w-5 text-zinc-400" />
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Drag & drop files here, or <span className="text-primary font-medium">browse</span>
                  </p>
                  <p className="text-xs text-zinc-400">(Maximum of 3 files allowed)</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">{thumbs}</div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Additional Information</label>
            <Textarea
              placeholder="Enter additional details"
              value={input.additionalInfo}
              onChange={(e) => setInput({ ...input, additionalInfo: e.target.value })}
              rows={4}
              className="bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 justify-end">
        <Button type="button" variant="ghost" onClick={onClose} className="dark:text-zinc-300">
          Close
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/95 text-white"
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default CreateProductForm;
