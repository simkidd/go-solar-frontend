"use client";
import { CreateProductInput } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Textarea,
  divider,
} from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GrCloudUpload } from "react-icons/gr";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
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
  }, [files.length]);

  const thumbs = files.map((file) => (
    <div key={file.name} className="relative m-2 w-20 h-20">
      <Image
        src={file.preview}
        alt={file.name}
        className="w-full h-full object-cover rounded-lg"
        width={80}
        height={80}
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
      <button
        type="button"
        className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1"
        onClick={() => {
          setFiles(files.filter((f) => f !== file));
          setInput((prevInput: any) => ({
            ...prevInput,
            images: prevInput.images.filter((img: any) => img !== file),
          }));
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
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
    input.images.forEach((image) => {
      formData.append("images", image);
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    await createProduct(formData, config);

    if (input.images.length > 0) {
      onClose();
    }
  };

  return (
    <form className="w-full font-inter" onSubmit={handleSubmit}>
      <div className="w-full grid lg:grid-cols-2 grid-cols-1">
        <div className="col-span-1 lg:pr-4">
          <div className="mb-3">
            <Input
              type="text"
              label="Title"
              labelPlacement="outside"
              placeholder="Enter product name"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <Textarea
              label="Description"
              labelPlacement="outside"
              placeholder="Enter product description"
              value={input.description}
              onChange={(e) =>
                setInput({ ...input, description: e.target.value })
              }
              minRows={4}
              maxRows={8}
            />
          </div>
          <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
            <div className="">
              <Select
                items={categories}
                label="Category"
                placeholder="Select a category"
                labelPlacement="outside"
                onChange={(e) =>
                  setInput({ ...input, category: e.target.value })
                }
              >
                {(cat) => (
                  <SelectItem key={cat?._id} value={cat?._id}>
                    {cat?.name}
                  </SelectItem>
                )}
              </Select>
            </div>
            <div className="">
              <Input
                type="text"
                label="Brand"
                labelPlacement="outside"
                placeholder="Enter a brand name"
                value={input.brand}
                onChange={(e) => setInput({ ...input, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
            <div className="">
              <Input
                type="number"
                label="Price"
                labelPlacement="outside"
                placeholder="0.00"
                value={String(input.price)}
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({ ...input, price: newValue });
                  }
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₦</span>
                  </div>
                }
              />
            </div>
            <div className="">
              <Input
                type="number"
                label="Quantity in stock"
                labelPlacement="outside"
                placeholder="0.00"
                value={String(input.quantityInStock)}
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({ ...input, quantityInStock: newValue });
                  }
                }}
              />
            </div>
          </div>

          <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
            <div className="">
              <Input
                type="number"
                label="Within Port Harcourt"
                labelPlacement="outside"
                placeholder="0.00"
                value={String(input.withinLocationDeliveryFee)}
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({ ...input, withinLocationDeliveryFee: newValue });
                  }
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₦</span>
                  </div>
                }
              />
            </div>
            <div className="">
              <Input
                type="number"
                label="Outside Port Harcourt"
                labelPlacement="outside"
                placeholder="0.00"
                value={String(input.outsideLocationDeliveryFee)}
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({
                      ...input,
                      outsideLocationDeliveryFee: newValue,
                    });
                  }
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">₦</span>
                  </div>
                }
              />
            </div>

            <div className="">
              <Select
                items={offers}
                label="Add Offer to Product"
                placeholder="Select an offer"
                labelPlacement="outside"
                onChange={(e) =>
                  setInput({ ...input, currentOffer: e.target.value })
                }
              >
                {(offer) => (
                  <SelectItem key={offer?._id} value={offer?._id}>
                    {offer?.name}
                  </SelectItem>
                )}
              </Select>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:pl-4">
          <div className="mb-3">
            <label htmlFor="image" className="">
              Images
            </label>
            <div
              {...getRootProps({
                className:
                  "w-full h-40 border-dashed border-1 border-gray-300 dark:border-gray-700 p-4 rounded-lg mt-1 cursor-pointer flex items-center justify-center bg-[#f4f4f5] dark:bg-[#27272A]",
              })}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <GrCloudUpload size={20} />
                  <p className="text-sm">
                    Drag & drop some files here, or click to select files
                  </p>
                  <em className="text-[12px]">(Maximum of 3 files allowed)</em>
                </div>
              )}
            </div>

            <aside className="mt-2 flex flex-wrap">{thumbs}</aside>
          </div>
          <div className="mb-3">
            <Textarea
              label="Additional Information"
              labelPlacement="outside"
              placeholder="Enter additional information"
              value={input.additionalInfo}
              onChange={(e) =>
                setInput({ ...input, additionalInfo: e.target.value })
              }
              minRows={4}
              maxRows={8}
            />
          </div>
        </div>
      </div>
      <div>
        {/* <div className="mb-6">
          <Checkbox
            isSelected={input.isPublished}
            onChange={(e) =>
              setInput({ ...input, isPublished: e })
            }
          >
            Publish
          </Checkbox>
        </div> */}

        <div className="flex items-center gap-2 mt-8 mb-4 justify-end">
          <Button variant="light" color="default" onPress={onClose}>
            Close
          </Button>
          <Button
            variant="solid"
            color="primary"
            type="submit"
            isDisabled={loading}
            isLoading={loading}
          >
            Create
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateProductForm;
