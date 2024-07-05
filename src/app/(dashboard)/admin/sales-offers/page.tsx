import React from "react";
import OffersComp from "../../components/OffersComp";
import CreateOfferButton from "../../components/CreateOfferButton";
import { Metadata } from "next";
import { Card } from "@nextui-org/react";

const pageTitle = "Sales Offers";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const OffersPage = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold">Sales Offers</h3>

        <CreateOfferButton />
      </div>
      <div className="w-full mb-8">
        <Card className="w-full bg-white dark:bg-[#222327]">
          <OffersComp />
        </Card>
      </div>
    </div>
  );
};

export default OffersPage;
