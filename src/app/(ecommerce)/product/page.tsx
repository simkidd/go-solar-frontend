
import Cta from "../components/Cta";
import ProductsList from "../components/ProductsList";

const ProductListPage = () => {
 

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <div className="mb-6">
            <Cta />
          </div>
          <ProductsList />
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;
