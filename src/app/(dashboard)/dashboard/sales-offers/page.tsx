import { Metadata } from "next";
import CreateOfferButton from "../../components/CreateOfferButton";
import OffersComp from "../../components/OffersComp";

const pageTitle = "Sales Offers";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const OffersPage = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Sales Offers</h3>

        <CreateOfferButton />
      </div>
      <div className="w-full mb-8">
        <OffersComp />
      </div>
    </div>
  );
};

export default OffersPage;
