import CategoryProductsList from "@/app/(ecommerce)/components/CategoryProductsList";
import { Category } from "@/interfaces/product.interface";
import { getCategories } from "@/lib/data";
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

const CategoryProducts = ({ params }: IProp) => {
  const categorySlug = params.slug;

  return (
    <div className="w-full font-dmsans">
      <section className="w-full">
        <CategoryProductsList slug={categorySlug} />
      </section>
    </div>
  );
};

export default CategoryProducts;
