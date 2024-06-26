"use client";
import {
  Product,
  UpdateProductInput
} from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UpdateProductForm: React.FC<{
  product: Product;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const { loading, updateProduct, categories } =
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
    isPublished: product?.isPublished,
  });

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
              Save
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdateProductForm;