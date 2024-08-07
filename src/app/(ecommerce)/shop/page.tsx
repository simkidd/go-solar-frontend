import Banner from "@/app/(ecommerce)/components/Banner";
import Cta from "@/app/(ecommerce)/components/Cta";
import ProductCard from "@/app/(ecommerce)/components/ProductCard";
import { Product } from "@/interfaces/product.interface";
import { getPubilshedProducts } from "@/lib/data";
import Link from "next/link";
import ViewHistoryComp from "../components/ViewHistory";

const ShopPage = async () => {
  const products: Product[] = await getPubilshedProducts();

  return (
    <div className="w-full font-inter">
      <div className="container mx-auto px-2 my-8">
        <Banner />
      </div>
      <section className="w-full">
        <div className="container mx-auto px-2 py-10">
          {/* battery */}
          <div className="flex items-center justify-between bg-primary text-white px-4 py-2">
            <p className="text-xl font-medium">Batteries</p>
            <Link href="" className="hover:underline">
              View all
            </Link>
          </div>
          <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 my-6">
            {products?.slice(0, 6).map((item) => (
              <ProductCard key={item?._id} item={item} />
            ))}
          </div>
          {/* inverters */}
          <div className="flex items-center justify-between bg-primary text-white px-4 py-2">
            <p className="text-xl font-medium">Inverters</p>
            <Link href="" className="hover:underline">
              View all
            </Link>
          </div>
          <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 my-6">
            {products?.slice(0, 6).map((item) => (
              <ProductCard key={item?._id} item={item} />
            ))}
          </div>
          <div className="mb-6">
            <Cta />
          </div>
          {/* solar panels */}
          <div className="flex items-center justify-between bg-primary text-white px-4 py-2">
            <p className="text-xl font-medium">Solar Panels</p>
            <Link href="" className="hover:underline">
              View all
            </Link>
          </div>
          <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 my-6">
            {products?.slice(0, 6).map((item) => (
              <ProductCard key={item?._id} item={item} />
            ))}
          </div>

          <div className="mb-6">
            <Cta />
          </div>

          <ViewHistoryComp />
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
