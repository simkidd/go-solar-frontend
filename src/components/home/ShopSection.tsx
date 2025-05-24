// components/home/ShopSection.tsx
"use client";
import ProductCard from "@/app/(ecommerce)/components/shop/ProductCard";
import useProducts from "@/hooks/useProducts";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

const ShopSection = () => {
  const { products: allProducts } = useProducts();

  // Memoize publishedProducts to avoid unnecessary recalculations
  const products = useMemo(
    () => allProducts.filter((product) => product.isPublished),
    [allProducts]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-16"
    >
      <div className="container mx-auto px-2">
        <div className="mb-8 grid lg:grid-cols-2 grid-cols-1">
          <div className="relative">
            <h2 className="text-primary text-2xl font-bold mb-4">Our Shop</h2>
            <h2 className="lg:text-5xl text-4xl font-bold mb-4">
              Renewable Energy Solutions
            </h2>
            <div className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-8xl absolute lg:-top-20 -top-8 left-0 -z-[1] font-bold">
              Shop
            </div>
          </div>

          <Link href="/shop" className="ml-auto mt-auto">
            <button className="bg-primary text-white py-4 px-8">Go Shop</button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 my-6">
          {products?.slice(0, 6).map((item) => (
            <ProductCard key={item?._id} item={item} />
          ))}
        </div>
        <div></div>
      </div>
    </motion.section>
  );
};

export default ShopSection;
