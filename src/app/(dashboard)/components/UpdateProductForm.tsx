"use client";
import {
  Category,
  Product,
  UpdateProductInput,
} from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { GrCloudUpload } from "react-icons/gr";

const UpdateProductForm: React.FC<{
  product: Product;
  categories: Category[];
}> = ({ product, categories }) => {
  const { loading, updateProduct, updateImage, imageLoading } =
    useProductStore();
  const router = useRouter();
  const [input, setInput] = useState<UpdateProductInput>({
    productId: product?._id,
    name: product?.name,
    description: product?.description,
    category: product?.category._id,
    brand: product?.brand,
    price: product?.price,
    additionalInfo: product?.additionalInfo,
    quantityInStock: product?.quantityInStock,
    outsideLocationDeliveryFee: product?.outsideLocationDeliveryFee,
    withinLocationDeliveryFee: product?.withinLocationDeliveryFee,
  });

  const [imageInput, setImageInput] = useState({
    images: product?.images,
  });

  const [imagePreview, setImagePreview] = useState<string[] | File[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedImages: File[] = Array.from(files);
    const newPreview = selectedImages.map((image) =>
      URL.createObjectURL(image)
    );
    setImagePreview((prevPreviews) => [
      ...prevPreviews,
      ...(newPreview as any),
    ]);
    setImageInput((prevInput) => ({
      ...prevInput,
      images: [...prevInput.images, ...(selectedImages as any)],
    }));
  };

  // const saveImage = async () => {
  //   const formData = new FormData();
  //   formData.append("productId", "661158d6e2bdc3e200fb239f");
  //   formData.append("imgId", "goSolar/ys0nc8n2crou0ad4quqq");
  //   formData.append("updateImg", imageInput.files[0], "hbl-img2.jpg");
  //   imageInput.images.forEach((image) => {
  //     formData.append("updateImg", image);
  //   });

  //   await updateImage(formData)
  // };

  const removeImage = (index: number) => {
    const updatedPreviews = [...imagePreview];
    updatedPreviews.splice(index, 1);
    setImagePreview(updatedPreviews as any);

    const updatedImages = [...imageInput.images];
    updatedImages.splice(index, 1);
    setInput((prevInput) => ({ ...prevInput, images: updatedImages as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.category === "") {
      alert("Please select a category");
      return;
    }

    await updateProduct(input);

    router.refresh();
    router.back();
  };

  return (
    <>
      {/* update form */}
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="w-full grid lg:grid-cols-2 grid-cols-1">
          <div className="col-span-1 lg:pr-4">
            <div className="mb-3">
              <label htmlFor="title">Product title</label>
              <input
                type="text"
                id="title"
                className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent mt-1"
                value={input.name}
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
                  value={input?.category}
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
                  value={input?.brand}
                  onChange={(e) =>
                    setInput({ ...input, brand: e.target.value })
                  }
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
                  value={input?.price}
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
                  value={input?.quantityInStock}
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
              <label htmlFor="information">Additional Information</label>
              <textarea
                name=""
                id="information"
                className="w-full border focus:outline-none focus:border-primary focus:border h-10 py-2 px-3 bg-transparent min-h-28 mt-1 resize-none"
                value={input?.additionalInfo}
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
                  value={input?.withinLocationDeliveryFee}
                  onChange={(e) => {
                    const newValue = e.target.valueAsNumber;
                    if (!isNaN(newValue) && newValue > 0) {
                      setInput({
                        ...input,
                        withinLocationDeliveryFee: newValue,
                      });
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
                  value={input?.outsideLocationDeliveryFee}
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
            {loading ? "Loading..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateProductForm;
