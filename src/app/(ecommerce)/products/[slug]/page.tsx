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
  Cpu,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import ViewHistoryComp from "../../components/ViewHistory";
import { getProducts, getPubilshedProducts } from "@/lib/api/products";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import Link from "next/link";
import { PACKAGES_DATA } from "@/data/packages";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    <div className="w-full font-inter bg-background text-foreground min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="w-full border-b border-border bg-muted/20 py-3">
        <div className="container mx-auto px-4 max-w-7xl">
          <nav className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Link
              href="/shop"
              className="hover:text-foreground transition-colors"
            >
              Store
            </Link>
            {product?.category && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
                <Link
                  href={`/${product.category.slug}/products`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
            <span className="text-foreground font-bold truncate max-w-[260px] select-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Main Hero Section ── */}
      <section className="w-full py-10 lg:py-14">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 lg:gap-14 items-start">
            {/* Left: Gallery */}
            <div className="lg:col-span-5 w-full">
              <ProductImages images={product?.images} />
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-5 w-full">
              <ProductDetail product={product} productCode={productCode} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabbed Info Section ── */}
      <section className="w-full border-t border-border bg-background py-10 lg:py-14 select-none">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0 space-x-8 mb-4 select-none">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent px-1 pb-4 pt-2 text-sm font-bold text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="rounded-none border-b-2 border-transparent px-1 pb-4 pt-2 text-sm font-bold text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="delivery"
                className="rounded-none border-b-2 border-transparent px-1 pb-4 pt-2 text-sm font-bold text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
              >
                Delivery & Warranty
              </TabsTrigger>
            </TabsList>

            {/* Panel 1: Overview */}
            <TabsContent
              value="overview"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 text-left select-text space-y-4 pt-4"
            >
              <h3 className="text-base font-extrabold text-foreground select-none">
                Product Overview
              </h3>
              <ProductDesc product={product} />
            </TabsContent>

            {/* Panel 2: Specs */}
            <TabsContent
              value="specs"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 text-left select-text space-y-4"
            >
              {product?.showDatasheet && product?.datasheet?.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
                  <table className="w-full text-xs">
                    <tbody>
                      {product.datasheet.map((row, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-muted/10" : "bg-card"}
                        >
                          <td className="py-3.5 px-5 font-semibold text-muted-foreground w-2/5 border-r border-border/60 select-none">
                            {row.key}
                          </td>
                          <td className="py-3.5 px-5 font-semibold text-foreground">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-semibold italic select-none">
                  No technical specifications sheet available for this product.
                </p>
              )}
            </TabsContent>

            {/* Panel 3: Delivery & Warranty */}
            <TabsContent
              value="delivery"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start select-text">
                {/* Details */}
                <div className="md:col-span-8 space-y-6">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider select-none">
                          Express Logistics Delivery
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                          1–5 working days delivery in Lagos, Port Harcourt, and
                          Uyo Experience Centers. Same-day logistics coverage
                          available for orders processed before 11AM.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <RefreshCcw className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider select-none">
                          7-Day Returns coverage
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                          Unused hardware components in original packaging are
                          accepted for refund or replacement claims within 7
                          days. Remote engineering support available for returns
                          verification.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider select-none">
                          Manufacturer Warranty
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                          All systems and monocrystalline solar components
                          include official manufacturer warranty coverage.
                          Support engineers assist with registration.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Switch Expert Advisor Callout */}
                <div className="md:col-span-4 bg-emerald-55 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-6 rounded-3xl space-y-3.5 text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px] text-emerald-700 dark:text-emerald-400 select-none">
                    <ShieldCheck className="h-4 w-4" /> Ready to Switch?
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    Consult our design engineers to verify this product carries
                    your household or commercial load safely before checkout.
                  </p>
                  <Link
                    href="/contact-us"
                    className="inline-block text-xs font-bold underline hover:text-emerald-600 dark:hover:text-emerald-250 mt-1"
                  >
                    Talk to an Expert →
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ── Related Products ── */}
      <section className="container mx-auto px-4 py-14 max-w-7xl">
        <RelatedProducts product={product} />
      </section>

      {/* ── View History ── */}
      <section className="container mx-auto px-4 pb-10 max-w-7xl">
        <ViewHistoryComp />
      </section>

      {/* ── FAQs & Newsletter ── */}
      <FaqNewsletterSection />
    </div>
  );
};

export default ProductPage;
