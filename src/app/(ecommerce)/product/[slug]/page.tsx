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
  Download,
  Sparkles,
  BookOpen,
} from "lucide-react";
import ViewHistoryComp from "../../components/ViewHistory";
import { getProducts, getPubilshedProducts } from "@/lib/api/products";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
      canonical: `/product/${product?.slug}`,
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

  // System details mock values for clean specs layout in Mockup 2
  const isPackage =
    product?.category?.slug === "packages" ||
    product?.name?.toLowerCase().includes("package");
  const systemSpecs = isPackage
    ? [
        {
          label: "Inverter Size",
          value: product?.name?.includes("10Kva")
            ? "10 kVA"
            : product?.name?.includes("7.5Kva")
              ? "7.5 kVA"
              : "5.0 kVA",
        },
        {
          label: "PV Panel Capacity",
          value: product?.name?.includes("10Kva")
            ? "12x 550W Panels"
            : "8x 550W Panels",
        },
        {
          label: "Lithium Battery Wall",
          value: product?.name?.includes("10Kva") ? "15 kWh" : "10 kWh",
        },
        { label: "Estimated Installation Time", value: "3-5 Working Days" },
      ]
    : [
        { label: "Hardware Model", value: product?.brand || "GoSolar Grade" },
        {
          label: "Component Type",
          value: product?.category?.name || "Solar Component",
        },
        { label: "Certification", value: "Tier-1 Quality Standard" },
        { label: "Manufacturer Warranty", value: "5 Years Replacement" },
      ];

  const loadCapabilities = isPackage
    ? [
        "1 Deep Freezer or Inverter Refrigerator",
        "8-10 Smart Fans",
        "10-15 LED Bulbs",
        "3 LED Televisions",
        "1 Inverter Air Conditioner (1.5 HP)",
        "Charging Ports for Laptops & Mobile Stations",
      ]
    : [
        "Specifically optimized for hybrid solar inverter connections",
        "High efficiency conversion factor with zero leakage",
        "Designed to survive high temperature thermal conditions",
        "Built-in overcharge and system short-circuit circuit breakers",
      ];

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
              {/* Product description tab box */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  Package Overview
                </h3>
                <ProductDesc product={product} />
              </div>

              {/* System Details Spec Box */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[#08AA08]">
                  System Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {systemSpecs.map((spec) => (
                    <div
                      key={spec.label}
                      className="bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-850"
                    >
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                        {spec.label}
                      </span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What It Powers / Capacity Showcase */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[#08AA08]">
                  What It Powers (Usable Capacity Showcase)
                </h3>
                <p className="text-xs text-zinc-505 leading-relaxed">
                  Estimated appliance loads that this configuration is designed
                  to carry simultaneously:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {loadCapabilities.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-zinc-650 dark:text-zinc-350"
                    >
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="font-semibold leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datasheet download segment */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Product Datasheet
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Download complete hardware technical data and layout
                    instructions.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl gap-2 font-bold px-5 text-xs uppercase tracking-wider"
                >
                  <Download className="h-4 w-4" /> Download Datasheet
                </Button>
              </div>
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
