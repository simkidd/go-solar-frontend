import AddToOfferButton from "@/app/(dashboard)/components/AddToOfferButton";
import DeleteProduct from "@/app/(dashboard)/components/DeleteProduct";
import UpdateProductButton from "@/app/(dashboard)/components/UpdateProductButton";
import UpdateProductImage from "@/app/(dashboard)/components/UpdateProductImage";
import ProductDesc from "@/app/(ecommerce)/components/ProductDesc";
import ProductImages from "@/app/(ecommerce)/components/ProductImages";
import { Product } from "@/interfaces/product.interface";
import { getProduct, getProducts } from "@/lib/data";
import { formatCurrency } from "@/utils/helpers";
import { Button, Card, CardBody } from "@nextui-org/react";
import { ArrowLeft, Pen } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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

const SingleProductPage = async ({ params }: IProduct) => {
  const product: Product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

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
      <div className="flex items-center justify-between mb-4 flex-wrap">
        <h4 className="font-semibold text-xl">Product Detail</h4>

        <div className="flex items-center gap-2 flex-wrap">
          <DeleteProduct product={product} />

          <UpdateProductButton product={product} />

          <AddToOfferButton product={product} />
        </div>
      </div>
      {/* <div className="w-full bg-white dark:bg-[#222327] py-16 px-2 md:px-6 shadow rounded"> */}
      <Card className="dark:bg-[#222327] dark:text-white mb-8">
        <CardBody>
          <p>current offer: {product?.currentOffer?.name}</p>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            {/* product images */}
            <div className="w-full">
              <ProductImages images={product?.images} />

              <div className="mt-8">
                <UpdateProductImage product={product} />
              </div>
            </div>

            {/* product details */}
            <div className="w-full flex flex-col">
              <h2 className="font-bold text-2xl mb-4">{product?.name}</h2>
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
                <span className="font-bold text-lg">{product?.brand}</span>
                <p className="font-medium">
                  Delivery fee within Location:
                </p>{" "}
                <span className="font-bold text-lg">
                  {formatCurrency(product?.withinLocationDeliveryFee, "NGN")}
                </span>
                <p className="font-medium">Delivery fee outside Location:</p>{" "}
                <span className="font-bold text-lg">
                  {formatCurrency(product?.outsideLocationDeliveryFee, "NGN")}
                </span>
              </div>
            </div>
          </div>
          <ProductDesc product={product} />
        </CardBody>
      </Card>
      {/* </div> */}
    </div>
  );
};

export default SingleProductPage;
