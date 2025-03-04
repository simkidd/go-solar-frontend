// components/home/TestimonialSection.tsx
"use client";
import { motion } from "framer-motion";
import Review from "@/components/Review";

const TestimonialSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-16 overflow-x-hidden"
    >
      <div className="container mx-auto px-2 mb-8 relative">
        <h2 className="text-primary text-2xl font-bold mb-4">Testimonials</h2>
        <h2 className="lg:text-5xl text-4xl font-bold">
          What Our Customers Say
        </h2>
        <div className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-[5.7rem] absolute lg:-top-24 -top-14 left-0 -z-[1] font-bold">
          Reviews
        </div>
      </div>
      <div className="container mx-auto px-2 py-4">
        <Review />
      </div>
    </motion.section>
  );
};

export default TestimonialSection;