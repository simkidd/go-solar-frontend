"use client";
import { useProduct } from "@/contexts/product.context";
import { Category, CreateProductInput } from "@/interfaces/product.interface";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { GrCloudUpload } from "react-icons/gr";

const CreateProductForm: React.FC<{ categories: Category[] }> = ({
  categories,
}) => {
  const { loading, createProduct } = useProduct();
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
  });
  const [imagePreview, setImagePreview] = useState<string[] | File[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedImages: File[] = Array.from(files);
    const newPreview = selectedImages.map(image => URL.createObjectURL(image));
    setImagePreview(prevPreviews => [...prevPreviews, ...newPreview as any]);
    setInput(prevInput => ({
      ...prevInput,
      images: [...prevInput.images, ...selectedImages as any]
    }));
  };

  const removeImage = (index: number) => {
    const updatedPreviews = [...imagePreview];
    updatedPreviews.splice(index, 1);
    setImagePreview(updatedPreviews as any);

    const updatedImages = [...input.images];
    updatedImages.splice(index, 1);
    setInput(prevInput => ({ ...prevInput, images: updatedImages as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.category === "") {
      alert("Please select a category");
      return;
    }
    console.log("Submitting form with input:", input);

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
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
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
            <div className="flex gap-2 flex-wrap mt-1">
              {/* upload button */}
              <div
                className="size-20 overflow-hidden rounded border hover:bg-gray-400 "
                style={{ transition: "background .3s ease" }}
              >
                <label htmlFor="image" className="cursor-pointer">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <GrCloudUpload size={20} />
                    <span className="text-sm">Upload</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                />
              </div>
              {/* selected images */}
              {imagePreview.map((image, i) => {
                const src =
                  typeof image === "string"
                    ? image
                    : URL.createObjectURL(image);
                return (
                  <div
                    key={i}
                    className="size-20 overflow-hidden rounded relative group"
                  >
                    <Image
                      src={src}
                      alt={`preview image${i}`}
                      className="w-full h-full object-cover"
                      width={80}
                      height={80}
                    />
                    <div
                      className="bg-[#2424243a] w-full h-full absolute top-0 left-0 flex group-hover:opacity-100 opacity-0"
                      style={{ transition: "opacity .3s ease" }}
                    >
                      <button
                        className="mt-auto ml-[50%] -translate-x-1/2 mb-1 text-white bg-danger p-1 rounded"
                        onClick={() => removeImage(i)}
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="information">Additional Information</label>
            <textarea
              name=""
              id="information"
              className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent min-h-28 mt-1 resize-none"
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
            name=""
            id="publish"
            className="accent-current mr-1 cursor-pointer"
          />
          <label htmlFor="publish" className="cursor-pointer">
            Publish on site
          </label>
        </div>
        <button className="bg-primary text-white px-6 py-2">
          {loading ? "Loading..." : "Add product"}
        </button>
      </div>
    </form>
  );
};

export default CreateProductForm;
