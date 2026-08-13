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
    <div className="w-full">
      <OffersComp />
    </div>
  );
};

export default OffersPage;
