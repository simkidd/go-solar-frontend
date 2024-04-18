import Banner from "@/components/Banner";
import Cta from "@/components/Cta";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/interfaces/product.interface";
import { getProducts } from "@/lib/data";
import Link from "next/link";

const ShopPage = async () => {
  const products: Product[] = await getProducts();

  return (
    <div className="w-full font-inter">
      <div className="container mx-auto px-2 my-8 hidden md:block">
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
          {/* brands */}
          <div className="flex items-center justify-between bg-primary text-white px-4 py-2">
            <p className="text-xl font-medium">Brands</p>
            <Link href="" className="hover:underline">
              View all
            </Link>
          </div>
          <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 my-6">
            {products?.slice(0, 12).map((item) => (
              <ProductCard key={item?._id} item={item} />
            ))}
          </div>
          <div className="mb-6">
            <Cta />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
