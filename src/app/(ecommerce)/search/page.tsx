import { Category, Product } from "@/interfaces/product.interface";
import { getCategories, getProducts } from "@/lib/data";
import ProductsList from "../components/ProductsList";

const SearchResults = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const query = searchParams.q;
  const products: Product[] = await getProducts();
  const categories: Category[] = await getCategories();

  const searchWords = query.toLowerCase().split(" ");

  const filteredResults = products.filter((product) => {
    const productName = product?.name.toLowerCase();
    return searchWords.every((word) => productName.includes(word));
  });

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <ProductsList categories={categories} products={filteredResults} />
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
