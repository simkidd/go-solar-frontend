/* eslint-disable react/no-unescaped-entities */

import AboutSection from "@/components/home/AboutSection";
import BlogSection from "@/components/home/BlogSection";
import CounterSection from "@/components/home/CounterSection";
import HeroSection from "@/components/home/HeroSection";
import HomeContactCta from "@/components/home/HomeContactCta";
import ShopSection from "@/components/home/ShopSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import VisionSection from "@/components/home/VisionSection";
import MarqueeComp from "@/components/MarqueeComp";

const page = async () => {
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
      <BlogSection />
      {/* shop section */}
      <ShopSection />
      {/* contact section */}
      <HomeContactCta />
    </div>
  );
};

export default page;
