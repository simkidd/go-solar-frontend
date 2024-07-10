import { Offer } from "@/interfaces/product.interface";
import { getOffer, getOffers } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface IOffer {
  params: { id: string };
}

export const generateMetadata = async ({
  params,
}: IOffer): Promise<Metadata> => {
  const offer: Offer = await getOffer(params.id);

  return {
    title: offer?.name,
    description: offer?.description,
  };
};

export const generateStaticParams = async () => {
  try {
    const offers = await getOffers();

    return offers.map((offer: any) => ({
      id: offer?._id,
    }));
  } catch (error) {
    console.log(error);
  }
};

const SingleOfferPage = async ({ params }: IOffer) => {
  const offer: Offer = await getOffer(params.id);

  if (!offer) {
    notFound();
  }

  console.log("single offer>>>", offer)

  return (
    <div className="w-full max-w-[1000px] mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/sales-offers">
          <button className="px-4 py-2 text-sm flex items-center">
            <ArrowLeft className="mr-2" size={16} />
            Go back
          </button>
        </Link>
      </div>

      <div className="w-full bg-white dark:bg-[#222327] py-16 px-2 md:px-6 shadow rounded">

      </div>
    </div>
  );
};

export default SingleOfferPage;
