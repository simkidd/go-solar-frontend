import { Product } from "@/interfaces/product.interface";
import { formatCurrency } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TbShoppingCartPlus } from "react-icons/tb";

const ProductCard: React.FC<{
  item: Product;
}> = ({ item }) => {

  return (
    <div className="w-full border hover:border-primary">
      <Link href={`/product/${item?._id}`}>
        <div className="w-full lg:h-44 md:h-56 h-44 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-full">
            <Image
              src={
                item?.images[0].url || "https://fakeimg.pl/300x300?font=noto"
              }
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
              src={item?.images[1].url}
              alt="product image"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Link>
      <div className="w-full px-2">
        <Link
          href={`/product/${item?._id}`}
          className="mb-2 text-sm text-ellipsis line-clamp-2"
          title={item?.name}
        >
          {item?.name}
        </Link>
        <p className="mb-4 text-primary font-medium">
          {formatCurrency(item?.price, "NGN")}
        </p>
      </div>
      <div className="w-full px-2 flex justify-center mb-2">
        {/* <button className="bg-primary flex items-center gap-2 text-white px-4 py-2 text-sm">
          Add To Cart <TbShoppingCartPlus size={18} />
        </button> */}
      </div>
    </div>
  );
};

export default ProductCard;
