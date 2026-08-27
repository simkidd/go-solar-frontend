/* eslint-disable react/no-unescaped-entities */
import HeroSection from "@/components/home/HeroSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import AboutSection from "@/components/home/AboutSection";
import PackagesSection from "@/components/home/PackagesSection";
import FinancingSection from "@/components/home/FinancingSection";
import SimulatorSection from "@/components/home/SimulatorSection";
import HowItWorks from "@/components/home/HowItWorks";
import ShopSection from "@/components/home/ShopSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import BlogSection from "@/components/home/BlogSection";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import HomeContactCta from "@/components/home/HomeContactCta";

const page = async () => {
  return (
    <div className="w-full font-inter overflow-hidden bg-white dark:bg-zinc-950">
      {/* 1. Hero Section (Cinematic Video/Image Background) */}
      <HeroSection />

      {/* 2. Complete Solar Solutions Grid */}
      <SolutionsSection />

      {/* 3. About Section */}
      <AboutSection />

      {/* 4. Pre-Configured Solar Packages */}
      <PackagesSection />

      {/* 4.5. Solar Financing Section */}
      <FinancingSection />

      {/* 5. Standalone Sizing Day/Night Simulator */}
      <SimulatorSection />



      {/* 7. Step-By-Step Process */}
      <HowItWorks />

      {/* 8. Shop Products Showcase */}
      <ShopSection />

      {/* 9. Testimonials Section */}
      <TestimonialSection />

      {/* 10. Blog Insights */}
      <BlogSection />

      {/* 11. FAQ & Newsletter segment */}
      <FaqNewsletterSection />

      {/* 12. Footer Contact CTA banner */}
      <HomeContactCta />
    </div>
  );
};

export default page;
