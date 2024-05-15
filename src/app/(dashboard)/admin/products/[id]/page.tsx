import DeleteProduct from "@/app/(dashboard)/components/DeleteProduct";
import ProductDesc from "@/app/(ecommerce)/components/ProductDesc";
import ProductImages from "@/app/(ecommerce)/components/ProductImages";
import { Product } from "@/interfaces/product.interface";
import { getProduct } from "@/lib/data";
import { formatCurrency } from "@/utils/helpers";
import { ArrowLeft, Pen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// export const generateStaticParams = async () => {
//   try {
//     const products: Product[] = await getProducts();

//     return products.map((product) => ({
//       id: product._id,
//     }));
//   } catch (error) {
//     console.log(error);
//   }
// };

const SingleProductPage = async ({ params }: { params: { id: string } }) => {
  const product: Product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/products">
          <button className="px-4 py-2 text-sm flex items-center">
            <ArrowLeft className="mr-2" size={16} />
            Go back
          </button>
        </Link>

        <div className="flex items-center gap-2">
          <DeleteProduct product={product} />

          <Link href={`/admin/products/${product._id}/edit`}>
            <button className="bg-primary text-white px-4 py-2 text-sm flex items-center">
              <Pen className="mr-2" size={16} />
              Edit
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] py-16 px-6 shadow rounded">
        <div className="w-full max-w-[860px] mx-auto flex flex-col items-center mb-8">
          <section className="w-full">
            <div className="container mx-auto px-2">
              <div className="max-w-[1100px] mx-auto px-2">
                <div className="grid lg:grid-cols-2 grid-cols-1">
                  <div className="w-full p-4">
                    <ProductImages images={product?.images} />
                  </div>
                  <div className="w-full flex flex-col p-4">
                    <h2 className="font-bold text-3xl mb-8">{product?.name}</h2>
                    <div className="flex">rating stars</div>
                    <h3 className="font-bold text-2xl">
                      {formatCurrency(product?.price, "NGN")}
                    </h3>

                    <div className="mt-10">
                      <p className="font-medium">Quantity in stock:</p>{" "}
                      <span className="font-bold text-lg">
                        {product?.quantityInStock}
                      </span>
                      <p className="font-medium">Category:</p>{" "}
                      <span className="font-bold text-lg">
                        {product?.category?.name}
                      </span>
                      <p className="font-medium">Brand:</p>{" "}
                      <span className="font-bold text-lg">
                        {product?.brand}
                      </span>
                      <p className="font-medium">
                        Delivery fee within Location:
                      </p>{" "}
                      <span className="font-bold text-lg">
                        {formatCurrency(
                          product?.withinLocationDeliveryFee,
                          "NGN"
                        )}
                      </span>
                      <p className="font-medium">
                        Delivery fee outside Location:
                      </p>{" "}
                      <span className="font-bold text-lg">
                        {formatCurrency(
                          product?.outsideLocationDeliveryFee,
                          "NGN"
                        )}
                      </span>
                    </div>
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
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
