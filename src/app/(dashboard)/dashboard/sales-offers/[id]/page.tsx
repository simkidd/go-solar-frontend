import SingleOfferComp from "@/app/(dashboard)/components/SingleOfferComp";
import { getOffer, getOffers } from "@/lib/api/offers.api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface IOffer {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: IOffer): Promise<Metadata> => {
  const { id } = await params;
  const offer = await getOffer(id);

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
    return [];
  }
};

const SingleOfferPage = async ({ params }: IOffer) => {
  const { id } = await params;

  return (
    <div className="w-full container mx-auto py-4 font-inter">
      <SingleOfferComp id={id} />
    </div>
  );
};

export default SingleOfferPage;
