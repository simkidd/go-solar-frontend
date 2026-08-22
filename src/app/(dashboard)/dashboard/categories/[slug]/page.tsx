import SingleCategoryProducts from "@/app/(dashboard)/components/products/SingleCategoryProducts";
import { Category } from "@/interfaces/product.interface";
import { getCategories } from "@/lib/api/products.api";

export const dynamic = "force-dynamic";
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
    return [];
  }
};

const SingleCatgory = async ({ params }: IProp) => {
  const { slug: categorySlug } = await params;
  const categories: Category[] = await getCategories();
  const category = categories?.find((cat) => cat?.slug === categorySlug);

  return (
    <div className="w-full font-inter space-y-4">
      <div className="flex items-center justify-between select-none">
        <Link 
          href="/dashboard/categories"
          className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to categories
        </Link>
      </div>

      <SingleCategoryProducts category={category as Category} />
    </div>
  );
};

export default SingleCatgory;
