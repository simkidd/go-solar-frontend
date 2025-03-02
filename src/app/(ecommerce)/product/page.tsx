import { Metadata } from "next";
import Cta from "../components/shop/Cta";
import ProductsList from "../components/shop/ProductsList";

const pageTitle = "Products";

export const metadata: Metadata = {
  title: pageTitle
};

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
