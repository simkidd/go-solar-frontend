"use client";
import { CreateProductInput } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@nextui-org/react";
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
  const { loading, createProduct, categories } = useProductStore();
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
  }, []);

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
            <label htmlFor="title">Product title</label>
            <input
              type="text"
              id="title"
              className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent mt-1"
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description">Product description</label>
            <textarea
              name=""
              id="description"
              className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent min-h-28 mt-1 resize-none"
              value={input?.description}
              onChange={(e) =>
                setInput({ ...input, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
            <div className="">
              <label htmlFor="category">Category</label>
              <select
                name=""
                id="category"
                className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent cursor-pointer mt-1"
                onChange={(e) =>
                  setInput({ ...input, category: e.target.value })
                }
              >
                <option value="" hidden></option>
                {categories?.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    className="bg-white dark:bg-[#222327]"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="title"
                className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent cursor-pointer mt-1"
                onChange={(e) => setInput({ ...input, brand: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
            <div className="">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent mt-1"
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({ ...input, price: newValue });
                  }
                }}
              />
            </div>
            <div className="">
              <label htmlFor="stock">Quantity in stock</label>
              <input
                type="number"
                id="stock"
                className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent mt-1"
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({ ...input, quantityInStock: newValue });
                  }
                }}
              />
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
                  "flex gap-2 flex-wrap mt-1 border-dashed border-2 border-gray-300 py-16 px-4 rounded-lg cursor-pointer",
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
            <label htmlFor="information">Additional Information</label>
            <textarea
              name=""
              id="information"
              className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent min-h-28 mt-1 resize-none"
              onChange={(e) =>
                setInput({ ...input, additionalInfo: e.target.value })
              }
            ></textarea>
          </div>
          <h4 className="text-lg font-medium mb-2">Delivery fee:</h4>
          <div className="mb-3 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-3">
            <div className="">
              <label htmlFor="within">Within Port Harcourt</label>
              <input
                type="number"
                id="within"
                className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent mt-1"
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({ ...input, withinLocationDeliveryFee: newValue });
                  }
                }}
              />
            </div>
            <div className="">
              <label htmlFor="outside">Outside Port Harcourt</label>
              <input
                type="number"
                id="outside"
                className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent mt-1"
                onChange={(e) => {
                  const newValue = e.target.valueAsNumber;
                  if (!isNaN(newValue) && newValue > 0) {
                    setInput({
                      ...input,
                      outsideLocationDeliveryFee: newValue,
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-6">
          <input
            type="checkbox"
            name="publish"
            id="publish"
            className="accent-current mr-1 cursor-pointer"
            checked={input.isPublished}
            onChange={(e) =>
              setInput({ ...input, isPublished: e.target.checked })
            }
          />
          <label htmlFor="publish" className="cursor-pointer">
            Publish on site
          </label>
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
            isDisabled={loading}
            isLoading={loading}
          >
            Add
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateProductForm;
