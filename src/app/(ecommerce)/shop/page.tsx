"use client";

import Banner from "@/app/(ecommerce)/components/Banner";
import Cta from "@/app/(ecommerce)/components/Cta";
import { Category } from "@/interfaces/product.interface";
import { useProductStore } from "@/lib/stores/product.store";
import CategoriesSectionGrid, {
  CategorySection,
} from "../components/CategorySection";
import SpecialOffers from "../components/SpecialOffers";
import ViewHistoryComp from "../components/ViewHistory";

const ShopPage = () => {
  const { products, categories, offers } = useProductStore();

  const publishedProducts = products.filter((product) => product.isPublished);

  const productsInCategory = (category: Category) => {
    return publishedProducts.filter(
      (product) => product?.category?._id === category?._id
    );
  };

  const topOffers = offers
    .filter((offer) => offer.isActive)
    .sort((a, b) => b.percentageOff - a.percentageOff)
    .slice(0, 3);

  return (
    <div className="w-full font-inter">
      <div className="container mx-auto px-2 my-8">
        <Banner />
      </div>
      <section className="w-full">
        <div className="container mx-auto px-2 py-10">
          <CategoriesSectionGrid categories={categories} />

          <div className="mb-6">
            <Cta />
          </div>

          {categories.map((category) => (
            <CategorySection
              key={category?._id}
              title={category?.name}
              products={productsInCategory(category)}
              link={`/${category?.slug}/products`}
            />
          ))}

          <div className="mb-6">
            <Cta />
          </div>

          <SpecialOffers offers={topOffers} />

          <ViewHistoryComp />
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
