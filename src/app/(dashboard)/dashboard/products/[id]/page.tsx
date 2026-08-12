import SingleProductComp from "@/app/(dashboard)/components/products/SingleProductComp";
import { Product } from "@/interfaces/product.interface";
import { getProductById, getProducts } from "@/lib/api/products";
import { Metadata } from "next";

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
    <div className="w-full container mx-auto py-4 font-inter">
      <SingleProductComp id={id} />
    </div>
  );
};

export default SingleProductPage;
