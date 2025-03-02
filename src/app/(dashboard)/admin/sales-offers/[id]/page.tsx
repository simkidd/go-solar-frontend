import OfferProducts from "@/app/(dashboard)/components/OfferProducts";
import { Offer } from "@/interfaces/product.interface";
import { getOffer, getOffers } from "@/lib/data";
import { Button } from "@heroui/react";
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

  return (
    <div className="w-full py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/sales-offers">
          <Button
            variant="light"
            color="default"
            startContent={<ArrowLeft size={16} />}
            className="dark:text-white"
          >
            Go back
          </Button>
        </Link>
      </div>

      <div className="w-full mb-8">
        <OfferProducts offer={offer as Offer} />
      </div>
    </div>
  );
};

export default SingleOfferPage;
