import ProductDesc from "@/app/(ecommerce)/components/shop/ProductDesc";
import ProductImages from "@/app/(ecommerce)/components/shop/ProductImages";
import RelatedProducts from "@/app/(ecommerce)/components/shop/RelatedProducts";
import { Product } from "@/interfaces/product.interface";
import { getProductCodeFromSlug, formatCurrency } from "@/utils/helpers";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "../../components/shop/ProductDetail";
import {
  RefreshCcw,
  Truck,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import ViewHistoryComp from "../../components/ViewHistory";
import { getProducts, getPubilshedProducts } from "@/lib/api/products";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import Link from "next/link";
import { PACKAGES_DATA } from "@/data/packages";

interface IProduct {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: IProduct): Promise<Metadata> => {
  const { slug } = await params;
  const products: Product[] = await getPubilshedProducts();
  let product = products.find((product) => product?.slug === slug);

  if (!product) {
    const staticPkg = PACKAGES_DATA.find((p) => p.slug === slug);
    if (staticPkg) {
      product = {
        name: staticPkg.name,
        description: staticPkg.desc,
        images: [],
        slug: staticPkg.slug,
      } as any;
    }
  }

  return {
    title: `${product?.name || "Product"} | GoSolar`,
    description: product?.description,
    alternates: {
      canonical: `/products/${product?.slug}`,
    },
    openGraph: {
      title: product?.name,
      description: product?.description,
      images: [product?.images?.[0]?.url || ""],
    },
  };
};

export const generateStaticParams = async () => {
  try {
    const products = await getProducts();
    const dbSlugs = products.map((product: any) => ({
      slug: product?.slug,
    }));
    const staticSlugs = PACKAGES_DATA.map((pkg) => ({
      slug: pkg.slug,
    }));
    return [...dbSlugs, ...staticSlugs];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const ProductPage = async ({ params }: IProduct) => {
  const { slug } = await params;
  const products: Product[] = await getProducts();
  let product = products.find((product) => product?.slug === slug);

  if (!product) {
    const staticPkg = PACKAGES_DATA.find((p) => p.slug === slug);
    if (staticPkg) {
      product = {
        _id: staticPkg.id,
        name: staticPkg.name,
        slug: staticPkg.slug,
        brand: "GoSolar",
        price: staticPkg.price,
        description: staticPkg.desc,
        images: [],
        category: { _id: "cat-pkg", name: "Packages", slug: "packages" },
        quantityInStock: 10,
        withinLocationDeliveryFee: 15000,
        outsideLocationDeliveryFee: 35000,
        isPublished: true,
        powerOutput: staticPkg.inverterRange,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any;
    }
  }

  const productCode = product ? getProductCodeFromSlug(product.slug) : "";

  if (!product) {
    notFound();
  }


  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950">
      {/* Breadcrumbs Navigation */}
      <div className="w-full bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-zinc-150 dark:border-zinc-850 py-3.5">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
            <Link
              href="/shop"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Store
            </Link>
            {product?.category && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700 select-none">
                  /
                </span>
                <Link
                  href={`/${product.category.slug}/products`}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="text-zinc-300 dark:text-zinc-700 select-none">
              /
            </span>
            <span className="text-zinc-900 dark:text-white font-bold select-none truncate max-w-[280px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main product showcase */}
      <section className="w-full py-12 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            {/* Left Column: Image gallery */}
            <div className="lg:col-span-7 w-full">
              <ProductImages images={product?.images} />
            </div>

            {/* Right Column: Specs and pricing detail */}
            <div className="lg:col-span-5 w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs">
              <ProductDetail product={product} productCode={productCode} />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed specifications & Capacity info matching Mockup 2 */}
      <section className="w-full py-16 bg-zinc-50 dark:bg-zinc-900/10 border-t border-b border-zinc-150 dark:border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            {/* Left side: Overview, Specs and Power capacity */}
            <div className="lg:col-span-8 space-y-8">
              {/* Product Description */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  Product Overview
                </h3>
                <ProductDesc product={product} />
              </div>

              {/* Technical Datasheet Table — shown only when admin enables it */}
              {product?.showDatasheet && product?.datasheet?.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-[#08AA08]" />
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[#08AA08]">
                      Technical Specifications
                    </h3>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <table className="w-full text-xs">
                      <tbody>
                        {product.datasheet.map((row, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-zinc-50 dark:bg-zinc-900/40" : "bg-white dark:bg-zinc-900"}
                          >
                            <td className="py-3 px-4 font-semibold text-zinc-500 dark:text-zinc-400 w-2/5 border-r border-zinc-100 dark:border-zinc-800">
                              {row.key}
                            </td>
                            <td className="py-3 px-4 font-semibold text-zinc-800 dark:text-zinc-200">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Delivery & Warranty Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white pb-3 border-b dark:border-zinc-800">
                    Delivery &amp; Warranty
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-3">
                    <Truck className="h-6 w-6 text-primary shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                        Express Delivery
                      </h4>
                      <p className="text-[11px] text-zinc-550 leading-relaxed">
                        Delivered within 1-5 working days in Lagos, Port
                        Harcourt, and Uyo Experience Centre ranges. Same-day
                        delivery available for orders before 11AM.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <RefreshCcw className="h-6 w-6 text-primary shrink-0" />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                        Return Policy
                      </h4>
                      <p className="text-[11px] text-zinc-550 leading-relaxed">
                        Guaranteed 7-day return coverage for unused hardware
                        components in original packaging. Remote technical
                        support for claims.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Green warning/advice banner box */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl text-emerald-800 dark:text-emerald-400 text-xs space-y-1 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-emerald-700 dark:text-emerald-300">
                    <ShieldAlert className="h-4 w-4" /> Ready to Switch?
                  </div>
                  <p>
                    Consult with our engineers to verify that this setup carries
                    your load parameters safely before checkout.
                  </p>
                  <Link
                    href="/contact-us"
                    className="inline-block font-bold underline mt-1.5 hover:text-emerald-600"
                  >
                    Talk to an Expert →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Related Products list section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <RelatedProducts product={product} />
        </div>
      </section>

      {/* User History track */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <ViewHistoryComp />
      </section>

      {/* FAQs and newsletter footer section */}
      <FaqNewsletterSection />
    </div>
  );
};

export default ProductPage;
