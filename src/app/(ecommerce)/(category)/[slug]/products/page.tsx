import Cta from "@/app/(ecommerce)/components/shop/Cta";
import ProductsList from "@/app/(ecommerce)/components/shop/ProductsList";
import { Category } from "@/interfaces/product.interface";
import { getCategories } from "@/lib/data";
import { Metadata } from "next";

interface IProp {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: IProp): Promise<Metadata> => {
  const { slug: categorySlug } = await params;
  const categories: Category[] = await getCategories();
  const category = categories?.find((cat) => cat?.slug === categorySlug);

  return {
    title: category?.name,
    description: category?.description,
  };
};

export const generateStaticParams = async () => {
  try {
    const categories = await getCategories();

    return categories?.map((category: any) => ({
      slug: category?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const CategoryProducts = async ({ params }: IProp) => {
  const { slug: categorySlug } = await params;

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <div className="mb-6">
            <Cta />
          </div>
          <ProductsList categorySlug={categorySlug} />
        </div>
      </section>
    </div>
  );
};

export default CategoryProducts;
