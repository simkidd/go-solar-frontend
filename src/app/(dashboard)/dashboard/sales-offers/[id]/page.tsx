import OfferProducts from "@/app/(dashboard)/components/OfferProducts";
import { Offer } from "@/interfaces/product.interface";
import { getOffer, getOffers } from "@/lib/api/offers.api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
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
  const offer = await getOffer(id);

  if (!offer) {
    notFound();
  }

  return (
    <div className="w-full py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/sales-offers">
          <Button
            variant="outline"
            className="gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={16} />
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
