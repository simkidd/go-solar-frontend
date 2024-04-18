import { Product } from "@/interfaces/product.interface";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard: React.FC<{
  item: Product;
}> = ({ item }) => {
  return (
    <div className="w-full">
      <div className="w-full lg:h-44 md:h-56 h-44 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            src={item?.images[0] || "https://fakeimg.pl/300x300?font=noto"}
            alt="product image"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full z-[1] opacity-0 group-hover:opacity-100"
          style={{ transition: "opacity .5s ease-in-out" }}
        >
          <Image
            src={item?.images[2]}
            alt="product image"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="w-full px-2">
        <Link href={`/product/${item?._id}`} className="mb-4 text-ellipsis line-clamp-2" title={item?.name}>
          {item?.name}
        </Link>
      </div>
      <p>{item?.price}</p>
    </div>
  );
};

export default ProductCard;
