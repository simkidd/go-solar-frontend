import PageHeader from "@/components/PageHeader";
import { Post } from "@/interfaces/post.interface";
import { getPosts } from "@/lib/api/posts.api";
import { formatDate } from "@/utils/helpers";
import { CalendarCheck, ArrowUpRight, BookOpen, Clock, User, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react";
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
    title: `${post?.title || "Blog"} | GoSolar`,
    description: post?.content ? `${post.content.slice(0, 150)}...` : "Knowledge Centre",
    alternates: {
      canonical: `/blog/${post?.slug}`,
    },
    openGraph: {
      title: post?.title,
      description: post?.content ? `${post.content.slice(0, 150)}...` : "",
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
    return [];
  }
};


const getReadTime = (content: string) => {
  if (!content) return 5;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const getExcerpt = (content: string) => {
  if (!content) return "";
  const plainText = content.replace(/<[^>]*>/g, "");
  return plainText.length > 180 ? plainText.slice(0, 180) + "..." : plainText;
};

const SingleBlogPage = async ({ params }: IPost) => {
  const { slug } = await params;
  const posts: Post[] = await getPosts();
  const post = posts.find((p) => p?.slug === slug);

  if (!post) {
    notFound();
  }

  const category = post.tags[0] || "Solar insights";
  const readTime = post.readTime || getReadTime(post.content);
  const excerpt = post.excerpt || getExcerpt(post.content);

  // Filter related articles (same category tag, excluding current post)
  const related = posts
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  // Other posts (footer showcase)
  const footerPosts = posts.filter((p) => p.slug !== slug).slice(0, 3);



  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 overflow-hidden">
      {/* ── Page Hero Banner ────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[40vh] flex items-end bg-zinc-950 text-white">
        <div className="absolute inset-0">
          <Image
            src={post.image || "/images/bg/about-us.jpg"}
            alt={post.title}
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 pb-12 pt-24 w-full space-y-4">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="font-mono text-xs uppercase tracking-widest text-[#08AA08] hover:text-[#079907] transition-colors font-bold"
            >
              Knowledge Centre
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="font-mono text-xs text-zinc-450 dark:text-zinc-400 uppercase tracking-widest">
              {category}
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-450 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-[#08AA08]" /> {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CalendarCheck className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* ── Content Grid Section ────────────────────────────────────── */}
      <section className="py-12 lg:py-16 bg-white dark:bg-zinc-950 border-b border-zinc-150/50 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Left Column: Article Body */}
            <article className="lg:col-span-3 space-y-8">
              {/* Excerpt */}
              <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-350 leading-relaxed pb-8 border-b border-zinc-150 dark:border-zinc-800 font-medium">
                {excerpt}
              </p>

              {/* Formatted Article Body */}
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="blog-content-rich text-zinc-650 dark:text-zinc-450 space-y-4 text-sm sm:text-base leading-relaxed"
              />


              {/* Share block */}
              <div className="mt-8 pt-8 border-t border-zinc-150 dark:border-zinc-800 flex items-center gap-3">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                  Share this article:
                </span>
                {[
                  { icon: Twitter, label: "Twitter", color: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]" },
                  { icon: Linkedin, label: "LinkedIn", color: "hover:text-[#0A66C2] hover:border-[#0A66C2]" },
                  { icon: Facebook, label: "Facebook", color: "hover:text-[#1877F2] hover:border-[#1877F2]" },
                  { icon: MessageCircle, label: "WhatsApp", color: "hover:text-[#25D366] hover:border-[#25D366]" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href="#"
                      aria-label={`Share on ${s.label}`}
                      className={`h-9 w-9 flex items-center justify-center text-zinc-500 dark:text-zinc-400 border border-zinc-150 dark:border-zinc-800 transition-colors rounded-xl bg-zinc-50/20 dark:bg-zinc-900/20 ${s.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </article>

            {/* Right Column: Sidebar */}
            <aside className="space-y-6">
              {/* Sizing Calculator CTA */}
              <div className="bg-zinc-950 text-white rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden border border-zinc-800">
                <div className="absolute inset-0 z-0 bg-[#064e3b]/10 bg-radial" />
                <div className="relative z-10 space-y-3">
                  <h4 className="font-heading font-bold text-sm">Calculate Solar Load</h4>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Determine your battery, panels, and inverter ratings using our free interactive sizing tool.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/energy-calculator"
                      className="inline-flex w-full items-center justify-center gap-1.5 bg-[#08AA08] hover:bg-[#079907] text-white px-5 py-2.5 font-bold uppercase tracking-wide text-[10px] rounded-xl transition-all shadow-xs"
                    >
                      Launch Calculator <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Related posts list */}
              {related.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 space-y-4 shadow-3xs">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-[#08AA08]" /> Related Articles
                  </h4>
                  <div className="space-y-4">
                    {related.map((p) => (
                      <Link
                        key={p._id}
                        href={`/blog/${p.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                          <Image
                            src={p.image || "/images/bg/about-us.jpg"}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-mono text-[9px] text-[#08AA08] font-bold block uppercase tracking-wider">
                            {p.tags[0] || "Solar"}
                          </span>
                          <span className="text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-[#08AA08] transition-colors leading-snug line-clamp-2 font-semibold">
                            {p.title}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Have a Question CTA */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 space-y-4 shadow-3xs">
                <div className="font-heading font-bold text-sm text-zinc-900 dark:text-white">
                  Have a Question?
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Our installation technicians and electrical engineers are happy to assist you.
                </p>
                <div className="pt-1">
                  <Link
                    href="/contact-us"
                    className="inline-flex w-full items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-650 text-zinc-800 dark:text-zinc-200 px-5 py-2.5 font-bold uppercase tracking-wide text-[10px] rounded-xl transition-all shadow-3xs bg-white dark:bg-zinc-900"
                  >
                    Contact GoSolar <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── More Articles Footer Section ───────────────────────────── */}
      {footerPosts.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900/25 py-14">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
            <div className="flex items-end justify-between">
              <h2 className="font-heading font-bold text-xl lg:text-2xl text-zinc-900 dark:text-white tracking-tight">
                More from the Knowledge Centre
              </h2>
              <Link
                href="/blog"
                className="text-xs font-bold uppercase tracking-wider text-[#08AA08] hover:text-[#079907] transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {footerPosts.map((p) => (
                <Link
                  key={p._id}
                  href={`/blog/${p.slug}`}
                  className="group bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={p.image || "/images/bg/about-us.jpg"}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="font-mono text-[9px] uppercase tracking-wider text-[#08AA08] font-bold">
                      {p.tags[0] || "Solar insights"}
                    </div>
                    <h3 className="font-heading font-bold text-zinc-900 dark:text-white group-hover:text-[#08AA08] transition-colors line-clamp-2 text-sm leading-snug">
                      {p.title}
                    </h3>
                    <div className="text-[10px] text-zinc-400 font-mono pt-1">
                      {getReadTime(p.content)} min read
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SingleBlogPage;
