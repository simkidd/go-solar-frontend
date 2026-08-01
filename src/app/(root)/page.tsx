/* eslint-disable react/no-unescaped-entities */
import AboutSection from "@/components/home/AboutSection";
import BlogSection from "@/components/home/BlogSection";
import StatsSection from "@/components/home/StatsSection";
import HeroSection from "@/components/home/HeroSection";
import HomeContactCta from "@/components/home/HomeContactCta";
import PackagesSection from "@/components/home/PackagesSection";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialSection from "@/components/home/TestimonialSection";
import VisionSection from "@/components/home/VisionSection";
import CounterSection from "@/components/home/CounterSection";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";

const page = async () => {
  return (
    <div className="w-full font-inter overflow-hidden bg-white dark:bg-zinc-950">
      {/* Hero Sliders Banner */}
      <HeroSection />

      {/* Stats Counter metrics */}
      <StatsSection />

      {/* About Section */}
      <AboutSection />

      {/* Packages Grid layout */}
      <PackagesSection />

      {/* Vision & Brand Message */}
      <VisionSection />

      {/* How it works steps layout */}
      <HowItWorks />

      {/* Partner Logos cluster */}
      <CounterSection />

      {/* Testimonials Review Slider */}
      <TestimonialSection />

      {/* Blog list updates */}
      <BlogSection />

      {/* FAQ & Newsletter segment */}
      <FaqNewsletterSection />

      {/* Footer Contact CTA banner */}
      <HomeContactCta />
    </div>
  );
};

export default page;
