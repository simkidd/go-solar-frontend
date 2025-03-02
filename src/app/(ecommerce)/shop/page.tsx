import Banner from "@/app/(ecommerce)/components/Banner";
import ShopPageComp from "../components/ShopPageComp";

const ShopPage = () => {
  return (
    <div className="w-full font-inter">
      <div className="container mx-auto px-2 my-8">
        <Banner />
      </div>

      <ShopPageComp />
    </div>
  );
};

export default ShopPage;
