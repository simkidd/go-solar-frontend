import ProductImages from "@/components/ProductImages";
import { Product } from "@/interfaces/product.interface";
import { getProduct } from "@/lib/data";
import { formatCurrency } from "@/utils/helpers";

export const generateStaticParams = async () => {
  try {
    const res = await fetch(`https://dummyjson.com/products`);

    const data = await res.json();
    const products = data.products;

    return products.map((product: Product) => ({
      id: product?.id.toString(),
    }));
  } catch (error) {
    console.log(error);
  }
};

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const product: Product = await getProduct(+params.id);

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
      <section className="w-full">
        <div className="container mx-auto px-2">
          <div className="max-w-[1100px] mx-auto px-2"></div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
