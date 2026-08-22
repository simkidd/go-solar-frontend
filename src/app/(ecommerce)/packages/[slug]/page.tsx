import { getPackage, getPackages } from "@/lib/api/packages.api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PackagePageClient from "./PackagePageClient";

interface IPackage {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: IPackage): Promise<Metadata> => {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  return {
    title: `${pkg?.name || "Package"}`,
    description: pkg?.description,
    alternates: {
      canonical: `/packages/${pkg?.slug}`,
    },
    openGraph: {
      title: pkg?.name,
      description: pkg?.description,
    },
  };
};

export const generateStaticParams = async () => {
  try {
    const packages = await getPackages();
    return packages.map((pkg: any) => ({
      slug: pkg?.slug,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

const PackagePage = async ({ params }: IPackage) => {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    notFound();
  }

  return <PackagePageClient package={pkg} />;
};

export default PackagePage;
