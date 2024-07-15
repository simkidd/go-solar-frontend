import ProductsList from "@/app/(ecommerce)/components/ProductsList";
import { Category, Product } from "@/interfaces/product.interface";
import { getCategories, getPubilshedProducts } from "@/lib/data";
import { Metadata } from "next";

interface IProp {
  params: { slug: string };
}

export const generateMetadata = async ({
  params,
}: IProp): Promise<Metadata> => {
  const categorySlug = params.slug;
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

    return categories.map((category: any) => ({
      slug: category?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const CategoryProducts = async ({ params }: IProp) => {
  const categorySlug = params.slug;
  const products: Product[] = await getPubilshedProducts();
  const categories: Category[] = await getCategories();

  const category = categories.find((cat) => cat?.slug === categorySlug);

  const filteredProducts = category
    ? products.filter((product) => product?.category?._id === category?._id)
    : [];

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <div className="container mx-auto px-2 py-8">
          <ProductsList
            categories={categories}
            products={filteredProducts}
            category={category}
          />
        </div>
      </section>
    </div>
  );
};

export default CategoryProducts;
