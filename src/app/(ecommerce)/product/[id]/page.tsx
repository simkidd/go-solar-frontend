import Breadcrumb from "@/components/Breadcrumb";
import ProductDesc from "@/app/(ecommerce)/components/ProductDesc";
import ProductImages from "@/app/(ecommerce)/components/ProductImages";
import RelatedProducts from "@/app/(ecommerce)/components/RelatedProducts";
import { Product } from "@/interfaces/product.interface";
import { axiosInstance } from "@/lib/axios";
import { getProduct, getProducts } from "@/lib/data";
import { formatCurrency } from "@/utils/helpers";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "../../components/ProductDetail";

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
    openGraph: {
      images: {
        url: product?.images[0].url,
      },
    },
  };
};

// export const generateStaticParams = async () => {
//   try {
//     const products: Product[] = await getProducts();

//     return products.map((product) => ({
//       id: product?._id,
//     }));
//   } catch (error) {
//     console.log(error);
//   }
// };

export const revalidate = 60;

const ProductPage = async ({ params }: IProduct) => {
  const product: Product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full font-inter py-20 pt-10">
      <div className="container mx-auto px-2 mb-8">
        <div className="max-w-[1100px] mx-auto px-2">
          <Breadcrumb name={product?.name} />
        </div>
      </div>
      <section className="w-full">
        <div className="container mx-auto px-2">
          <div className="max-w-[1100px] mx-auto px-2">
            <div className="grid lg:grid-cols-2 grid-cols-1">
              <div className="w-full h-fit lg:p-4 mb-8">
                <ProductImages images={product?.images} />
              </div>
              <ProductDetail product={product} />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-16">
        <div className="container mx-auto px-2">
          <div className="max-w-[1100px] mx-auto px-2">
            <ProductDesc product={product} />
          </div>
        </div>
      </section>
      <section className="w-full">
        <div className="container mx-auto px-2">
          <h3 className="font-bold capitalize lg:text-3xl text-2xl mb-6">
            You may also like
          </h3>
          <div>
            <RelatedProducts product={product} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
