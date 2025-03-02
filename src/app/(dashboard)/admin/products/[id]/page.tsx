import SingleProductComp from "@/app/(dashboard)/components/SingleProductComp";
import { Product } from "@/interfaces/product.interface";
import { getProduct, getProducts } from "@/lib/data";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

interface IProduct {
  params: { id: string };
}

export const generateMetadata = async ({
  params,
}: IProduct): Promise<Metadata> => {
  const product: Product = await getProduct(params.id);

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

const SingleProductPage = ({ params }: IProduct) => {
  return (
    <div className="w-full max-w-[1000px] mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/products">
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

      <SingleProductComp id={params.id} />
    </div>
  );
};

export default SingleProductPage;
