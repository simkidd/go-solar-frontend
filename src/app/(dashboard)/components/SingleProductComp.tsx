"use client";
import ProductDesc from "@/app/(ecommerce)/components/ProductDesc";
import ProductImages from "@/app/(ecommerce)/components/ProductImages";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getProduct } from "@/lib/data";
import { useProductStore } from "@/lib/stores/product.store";
import { formatCurrency } from "@/utils/helpers";
import { Card, CardBody } from "@heroui/react";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddToOfferButton from "./AddToOfferButton";
import DeleteProduct from "./DeleteProduct";
import UpdateProductButton from "./UpdateProductButton";
import UpdateProductImage from "./UpdateProductImage";

const SingleProductComp: React.FC<{ id: string }> = ({ id }) => {
  const { product, setProduct } = useProductStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const data = await getProduct(id);
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    notFound();
  }

  const calculateNewPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  const newPrice =
    product?.currentOffer?.isActive &&
    product?.currentOffer?.percentageOff !== undefined
      ? calculateNewPrice(product?.price, product?.currentOffer?.percentageOff)
      : product?.price;

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap">
        <h4 className="font-semibold text-xl">Product Detail</h4>

        <div className="flex items-center gap-2 flex-wrap">
          <DeleteProduct product={product} />

          <UpdateProductButton product={product} />

          <AddToOfferButton product={product} />
        </div>
      </div>

      <Card className="dark:bg-[#222327] dark:text-white mb-8">
        <CardBody>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            {/* product images */}
            <div className="w-full">
              <ProductImages images={product?.images} />

              <div className="mt-8">
                <UpdateProductImage product={product} />
              </div>
            </div>

            {/* product details */}
            <div className="w-full flex flex-col">
              <h2 className="font-bold text-2xl mb-4">{product?.name}</h2>
              <h3 className="font-bold text-2xl mb-5 space-x-2">
                <span className="font-semibold">
                  {formatCurrency(newPrice, "NGN")}
                </span>
                {product?.currentOffer?.isActive &&
                  product?.currentOffer?.percentageOff && (
                    <span className="line-through text-gray-500 text-xl">
                      {formatCurrency(product?.price, "NGN")}
                    </span>
                  )}{" "}
              </h3>

              {product?.currentOffer?.isActive && (
                <div className="bg-yellow-200 text-yellow-900 p-4 rounded-md shadow-md">
                  <p className="text-lg font-semibold">Limited Time Offer!</p>
                  <p className="capitalize">{product?.currentOffer?.name}</p>
                </div>
              )}

              <div className="mt-5">
                <p className="font-medium">Quantity in stock:</p>{" "}
                <span className="font-bold text-lg">
                  {product?.quantityInStock}
                </span>
                <p className="font-medium">Category:</p>{" "}
                <span className="font-bold text-lg">
                  {product?.category?.name}
                </span>
                <p className="font-medium">Brand:</p>{" "}
                <span className="font-bold text-lg">{product?.brand}</span>
                <p className="font-medium">
                  Delivery fee within Location:
                </p>{" "}
                <span className="font-bold text-lg">
                  {formatCurrency(product?.withinLocationDeliveryFee, "NGN")}
                </span>
                <p className="font-medium">Delivery fee outside Location:</p>{" "}
                <span className="font-bold text-lg">
                  {formatCurrency(product?.outsideLocationDeliveryFee, "NGN")}
                </span>
              </div>
            </div>
          </div>
          <ProductDesc product={product} />
        </CardBody>
      </Card>
    </>
  );
};

export default SingleProductComp;
