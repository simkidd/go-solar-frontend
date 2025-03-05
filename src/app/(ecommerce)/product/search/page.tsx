import Cta from "../../components/shop/Cta";
import ProductsList from "../../components/shop/ProductsList";

const SearchResults = async ({
  searchParams,
}: {
  searchParams: Promise<{ q: string; category: string }>;
}) => {
  const { q, category } = await searchParams;

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <div className="mb-6">
            <Cta />
          </div>
          <ProductsList query={q} categorySlug={category} />
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
