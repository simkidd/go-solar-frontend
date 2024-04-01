import { Product } from "@/interfaces/product.interface";
import Image from "next/image";
import React from "react";

const ProductImages: React.FC<{
  product: Product;
}> = ({ product }) => {
  return (
    <div className="border w-full">
      <div className="w-full h-[380px] p-4">
        <Image
          src={product?.thumbnail}
          alt=""
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex">
        {product?.images.map((img, i) => (
          <div key={i} className="size-28">
            <Image
              src={img}
              alt=""
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
