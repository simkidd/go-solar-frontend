import ProductDesc from "@/app/(ecommerce)/components/shop/ProductDesc";
import ProductImages from "@/app/(ecommerce)/components/shop/ProductImages";
import RelatedProducts from "@/app/(ecommerce)/components/shop/RelatedProducts";
import { Product } from "@/interfaces/product.interface";
import { getProductCodeFromSlug } from "@/utils/helpers";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "../../components/shop/ProductDetail";
import { RefreshCcw, Truck } from "lucide-react";
import ViewHistoryComp from "../../components/ViewHistory";
import { getProducts, getPubilshedProducts } from "@/lib/api/products";
import Breadcrumbs from "@/components/BreadcrumbsComp";

interface IProduct {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: IProduct): Promise<Metadata> => {
  const { slug } = await params;
  const products: Product[] = await getPubilshedProducts();
  const product = products.find((product) => product?.slug === slug);

  return {
    title: product?.name,
    description: product?.description,
    alternates: {
      canonical: `/product/${product?.slug}`,
    },
    openGraph: {
      title: product?.name,
      description: product?.description,
      images: [product?.images[0].url || ""],
    },
  };
};

export const generateStaticParams = async () => {
  try {
    const products = await getProducts();

    return products.map((product: any) => ({
      // id: product?._id,
      slug: product?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const ProductPage = async ({ params }: IProduct) => {
  const { slug } = await params;
  const products: Product[] = await getProducts();
  const product = products.find((product) => product?.slug === slug);

  const productCode = getProductCodeFromSlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full font-inter py-20 pt-10">
      <div className="container mx-auto px-2 mb-8">
        <Breadcrumbs />
      </div>
      <section className="w-full mb-6">
        <div className="container mx-auto px-2">
          <div className="grid lg:grid-cols-5 grid-cols-1">
            {/* images and desc */}
            <div className="lg:col-span-4 col-span-1">
              <div className="grid lg:grid-cols-5 grid-cols-1">
                <div className="lg:col-span-2 col-span-1 w-full h-fit lg:p-4 mb-8">
                  <ProductImages images={product?.images} />
                </div>
                <div className="lg:col-span-3 col-span-1">
                  <ProductDetail product={product} productCode={productCode} />
                </div>
              </div>
              <div className="w-full">
                <ProductDesc product={product} />
              </div>
            </div>

            <div className="col-span-1 lg:p-4">
              <h2 className="pb-2 border-b font-bold text-lg">
                Delivery and Returns
              </h2>
              <div className="pt-2 space-y-3">
                <div className="flex space-x-2">
                  <Truck size={28} />
                  <div className=" space-y-1">
                    <h2 className="font-semibold">Delivery</h2>
                    <div className="text-xs space-y-2">
                      <p>Estimated delivery time 1-9 business days</p>
                      <p>Express Delivery Available</p>
                      <p>
                        For Same-Day-Delivery: Please place your order before
                        11AM
                      </p>
                      <p>
                        Next-Day-Delivery: Orders placed after 11AM will be
                        delievered the next day
                      </p>
                      <p>Note: Availability may vary by location</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <RefreshCcw size={28} />
                  <div className="space-y-1">
                    <h2 className="font-semibold">Return Policy</h2>
                    <div className="text-xs space-y-2">
                      <h3 className="font-semibold">
                        Guaranteed 7-Day Return Policy
                      </h3>
                      <p>
                        For details about return shipping options, please visit
                        - GoSolar Return Policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-2 mb-6">
        <RelatedProducts product={product} />
      </section>

      <section className="container mx-auto px-2">
        <ViewHistoryComp />
      </section>
    </div>
  );
};

export default ProductPage;
