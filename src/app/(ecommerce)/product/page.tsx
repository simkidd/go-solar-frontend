"use client";
import { useProductStore } from "@/lib/stores/product.store";
import Cta from "../components/Cta";
import ProductsList from "../components/ProductsList";

const ProductListPage = () => {
  const { products, categories } = useProductStore();

  const publishedProducts = products.filter((product) => product.isPublished);

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <div className="mb-6">
            <Cta />
          </div>
          <ProductsList categories={categories} products={publishedProducts} />
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;
