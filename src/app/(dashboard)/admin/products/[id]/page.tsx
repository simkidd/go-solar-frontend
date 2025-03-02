import SingleProductComp from "@/app/(dashboard)/components/SingleProductComp";
import { Product } from "@/interfaces/product.interface";
import { getProductById, getProducts } from "@/lib/api/products";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

interface IProduct {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: IProduct): Promise<Metadata> => {
  const { id } = await params;
  const product: Product = await getProductById(id);

  return {
    title: product?.name,
    description: product?.description,
  };
};

export const generateStaticParams = async () => {
  try {
    const products = await getProducts();

    return products.map((product: any) => ({
      id: product?._id,
    }));
  } catch (error) {
    console.log(error);
  }
};

const SingleProductPage = async ({ params }: IProduct) => {
  const { id } = await params;

  return (
    <div className="w-full max-w-[1000px] mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/products">
          <button className="inline-flex items-center gap-1">
            <ArrowLeft size={16} />
            Go back
          </button>
        </Link>
      </div>

      <SingleProductComp id={id} />
    </div>
  );
};

export default SingleProductPage;
