import { Category, Product } from "@/interfaces/product.interface";
import { getCategories, getProducts } from "@/lib/data";
import Cta from "../components/Cta";
import ProductsList from "../components/ProductsList";
import { notFound } from "next/navigation";

const ProductListPage = async () => {
  const products: Product[] = await getProducts();
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
