import { Offer } from "@/interfaces/product.interface";
import React from "react";
import { FaTag } from "react-icons/fa";

const SpecialOffers: React.FC<{ offers: Offer[] }> = ({ offers }) => {
  return (
    <>
      {offers && offers.length > 0 && (
        <section className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#27282b] dark:to-[#2a2b2f] py-10">
          <div className="flex items-center justify-between bg-red-600 text-white px-6 py-3 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold">Special Offers</h3>
            <FaTag className="text-3xl" />
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 my-8 px-4 pb-6">
            {offers.slice(0, 1).map((offer) => (
              <div
                key={offer._id}
                className="relative lg:col-span-2 col-span-1 bg-white p-6 rounded-lg shadow-lg dark:bg-[#222327] dark:border-gray-700 border border-gray-200 overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                  Limited Time
                </div>
                <h3 className="md:text-3xl text-2xl font-bold mb-8 capitalize">
                  {offer.name}
                </h3>
                <p className="md:text-7xl text-3xl font-bold text-red-600 mt-auto">
                  {offer.percentageOff}% Off
                </p>
              </div>
            ))}

            <div className="col-span-1 grid grid-cols-1 gap-6">
              {offers.slice(1, 3).map((offer) => (
                <div
                  key={offer._id}
                  className="relative bg-white p-6 rounded-lg shadow-lg dark:bg-[#222327] dark:border-gray-700 border border-gray-200 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    Limited Time
                  </div>
                  <h3 className="text-2xl font-bold mb-8 capitalize">
                    {offer.name}
                  </h3>
                  <p className="text-3xl font-bold text-red-600">
                    {offer.percentageOff}% Off
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SpecialOffers;
