import { BlogCardList } from "@/components/BlogCard";
import PageHeader from "@/components/PageHeader";
import SocialShare from "@/components/SocialShare";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/api/posts";
import { formatDate } from "@/utils/helpers";
import { CalendarCheck, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

interface IPost {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: IPost): Promise<Metadata> => {
  const { slug } = await params;
  const posts: Post[] = await getPosts();
  const post = posts.find((post) => post?.slug === slug);

  return {
    title: post?.title,
    description: post?.content,
    alternates: {
      canonical: `/blog/${post?.slug}`,
    },
    openGraph: {
      title: post?.title,
      description: post?.content,
      images: [post?.image || ""],
    },
  };
};

export const generateStaticParams = async () => {
  try {
    const posts = await getPosts();

    return posts.map((post: any) => ({
      slug: post?.slug,
    }));
  } catch (error) {
    console.log(error);
  }
};

const SingleBlogPage = async ({ params }: IPost) => {
  const { slug } = await params;
  const posts: Post[] = await getPosts();
  const post = posts.find((post) => post?.slug === slug);

  if (!post) {
    notFound();
  }

  // Pre-configured Table of Contents headers for a professional solar article
  const tableOfContents = [
    { label: "Introduction", anchor: "#introduction" },
    { label: "Understanding the Setup", anchor: "#setup" },
    { label: "Financial Impact & Savings", anchor: "#savings" },
    { label: "Conclusion", anchor: "#conclusion" },
  ];

  return (
    <div className="w-full font-inter bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        badge="Blog Post"
        heading={post?.title}
        subtitle={
          post?.content
            ? `${post.content.slice(0, 120)}...`
            : "Read our latest solar energy insights and guides."
        }
        image={post?.image || "/images/bg/blog-bg.jpg"}
        minHeight="min-h-[420px] md:min-h-[460px]"
      />
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Article Body & Image */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <CalendarCheck className="h-4 w-4 text-primary" />
                <span>Published {formatDate(post?.createdAt)}</span>
              </div>

              {/* Main Banner Image */}
              <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm relative bg-zinc-100">
                <Image
                  src={post?.image || "/placeholder-blog.jpg"}
                  alt={post?.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Formatted Article Body */}
              <article className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 space-y-6 text-sm sm:text-base leading-relaxed">
                {/* Introduction section */}
                <div id="introduction" className="space-y-3 pt-4">
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    Introduction
                  </h3>
                  <p>
                    Electricity tariffs are rising, and grid instability remains
                    a consistent challenge for households and companies across
                    Nigeria. Solar power offers a clean, reliable, and highly
                    stable alternative that completely transforms your monthly
                    cashflows.
                  </p>
                </div>

                {/* Body Content */}
                <div id="setup" className="space-y-3 pt-4">
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    Understanding the Setup
                  </h3>
                  <p>{post?.content}</p>
                  <p>
                    A standard hybrid solar setup involves premium
                    monocrystalline panels, a pure sine wave smart inverter, and
                    high-density storage batteries. Combined, these elements
                    capture peak sun hours and save energy to sustain your loads
                    during night hours or grid outages.
                  </p>
                </div>

                {/* Savings section */}
                <div id="savings" className="space-y-3 pt-4">
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    Financial Impact & Savings
                  </h3>
                  <p>
                    Transitioning to solar isn't just an environmental choice—it
                    is an investment with direct commercial returns. Most
                    residential installations pay for themselves in under 24
                    months by completely offsetting fuel tariffs and generator
                    maintenance fees.
                  </p>
                </div>

                {/* Conclusion section */}
                <div id="conclusion" className="space-y-3 pt-4">
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    Conclusion
                  </h3>
                  <p>
                    Clean, stable electricity is within reach. With GoSolar's
                    pre-configured packages, premium installation teams, and
                    flexible pay-later financing options, making the switch has
                    never been more straightforward.
                  </p>
                </div>
              </article>

              {/* Custom Marketing CTA Block */}
              <div className="bg-linear-to-tr from-[#064e3b] to-emerald-800 text-white rounded-3xl p-8 sm:p-10 shadow-md space-y-6">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ready to Save?
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    Ready to Start Saving with Solar?
                  </h3>
                  <p className="text-emerald-100 text-sm leading-relaxed max-w-xl">
                    Get a free customized energy audit and installation quote
                    from our certified engineering experts today.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href="/energy-calculator">
                    <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl">
                      Explore Solar Packages
                    </Button>
                  </Link>
                  <Link href="/contact-us">
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl"
                    >
                      Get a Free Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: TOC & Sidebar Utilities */}
            <div className="lg:col-span-4 space-y-8 sticky top-28">
              {/* Table of Contents panel */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  On This Page
                </h4>
                <ul className="space-y-2.5 text-xs font-semibold">
                  {tableOfContents.map((header) => (
                    <li key={header.label}>
                      <a
                        href={header.anchor}
                        className="text-zinc-500 hover:text-primary transition-colors block py-0.5 border-l-2 border-zinc-100 hover:border-primary pl-3"
                      >
                        {header.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent posts list */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-6">
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-widest">
                  Recent Insights
                </h4>

                <div className="flex flex-col space-y-4">
                  {posts?.slice(0, 3).map((item) => (
                    <BlogCardList key={item?._id} item={item} />
                  ))}
                </div>
              </div>

              {/* Social share panel */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-4">
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-widest">
                  Share Slogans
                </h4>
                <SocialShare />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
