import Cta from "../../components/shop/Cta";
import ProductsList from "../../components/shop/ProductsList";

const SearchResults = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const query = searchParams.q;

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <div className="mb-6">
            <Cta />
          </div>
          <ProductsList query={query} />
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
