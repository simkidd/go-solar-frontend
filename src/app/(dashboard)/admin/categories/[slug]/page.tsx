import SingleCategoryProducts from "@/app/(dashboard)/components/products/SingleCategoryProducts";
import { Category } from "@/interfaces/product.interface";
import { getCategories } from "@/lib/data";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

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

    return categories.map((category: any) => ({
      slug: category?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const SingleCatgory = async ({ params }: IProp) => {
  const { slug: categorySlug } = await params;
  const categories: Category[] = await getCategories();
  const category = categories?.find((cat) => cat?.slug === categorySlug);

  return (
    <div className="w-full font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/categories">
          <Button
            variant="light"
            color="default"
            startContent={<ArrowLeft size={16} />}
            className="dark:text-white"
          >
            Go back categories
          </Button>
        </Link>
      </div>

      <SingleCategoryProducts category={category as Category} />
    </div>
  );
};

export default SingleCatgory;
