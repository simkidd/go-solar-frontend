import ProductDesc from "@/components/ProductDesc";
import ProductImages from "@/components/ProductImages";
import RelatedProducts from "@/components/RelatedProducts";
import { Product } from "@/interfaces/product.interface";
import { API_URL, getProduct } from "@/lib/data";
import { formatCurrency } from "@/utils/helpers";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface IProduct {
  params: { id: string };
}

export const generateMetadata = async ({
  params,
}: IProduct): Promise<Metadata> => {
  const res = await fetch(`${API_URL}/products/` + params.id);
  const product: Product = await res.json();

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: {
        url: product.images[0],
      },
    },
  };
};

export const generateStaticParams = async () => {
  try {
    const res = await fetch(`${API_URL}/products`);

    const data = await res.json();
    const products = data.products;

    return products.map((product: Product) => ({
      id: product?.id.toString(),
    }));
  } catch (error) {
    console.log(error);
  }
};

const ProductPage = async ({ params }: IProduct) => {
  const product: Product = await getProduct(+params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full font-inter py-20">
      <section className="w-full">
        <div className="container mx-auto px-2">
          <div className="max-w-[1100px] mx-auto px-2">
            <div className="grid lg:grid-cols-2 grid-cols-1">
              <div className="w-full p-4">
                <ProductImages product={product} />
              </div>
              <div className="w-full flex flex-col p-4">
                <h2 className="font-bold text-4xl mb-8">{product?.title}</h2>
                <div className="flex">rating stars</div>
                <h3 className="font-bold text-2xl">
                  {formatCurrency(product?.price, "NGN")}
                </h3>
              </div>
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
