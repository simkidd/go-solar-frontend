import { Category, Product } from "@/interfaces/product.interface";
import { getCategories, getPubilshedProducts } from "@/lib/data";
import { notFound } from "next/navigation";
import Cta from "../components/Cta";
import ProductsList from "../components/ProductsList";

const ProductListPage = async () => {
  const products: Product[] = await getPubilshedProducts();
  const categories: Category[] = await getCategories();

  if (!products) {
    notFound();
  }

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <div className="mb-6">
            <Cta />
          </div>
          <ProductsList categories={categories} products={products} />
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;
