/* eslint-disable react/no-unescaped-entities */

import BlogCard from "@/components/BlogCard";
import HomeContactCta from "@/components/home/HomeContactCta";
import MarqueeComp from "@/components/MarqueeComp";
import Review from "@/components/Review";
import { Post } from "@/interfaces/post.interface";
import { Product } from "@/interfaces/product.interface";
import { getPosts, getPubilshedProducts } from "@/lib/data";
import Link from "next/link";
import ProductCard from "../(ecommerce)/components/shop/ProductCard";
import HeroSection from "@/components/home/HeroSection";
import VisionSection from "@/components/home/VisionSection";
import AboutSection from "@/components/home/AboutSection";
import CounterSection from "@/components/home/CounterSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import BlogSection from "@/components/home/BlogSection";
import ShopSection from "@/components/home/ShopSection";

const page = async () => {
  const posts: Post[] = await getPosts();
  const products: Product[] = await getPubilshedProducts();

  return (
    <div className="w-full font-inter">
      {/* hero section */}
      <HeroSection />

      <section className="w-full">
        <div className="h-20 font-dmsans bg-primary flex items-center text-white text-xl">
          <MarqueeComp />
        </div>
      </section>
      {/* our vision section */}
      <VisionSection />
      {/* about section */}
      <AboutSection />
      {/* counter section */}
      <CounterSection />
      {/* testimonial section */}
      <TestimonialSection />
      {/* blog section */}
      {posts && posts.length > 0 && <BlogSection posts={posts} />}
      {/* shop section */}
      {products && posts.length > 0 && <ShopSection products={products} />}
      {/* contact section */}
      <HomeContactCta />
    </div>
  );
};

export default page;
