// components/home/HeroSection.tsx
"use client";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="w-full relative py-16 bg-hero-bg bg-center bg-cover bg-no-repeat min-h-dvh flex flex-col justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/80 z-10" />
      <div className="container mx-auto px-2 drop-shadow-md relative z-10 text-white ">
        <div className="grid grid-cols-1 lg:grid-cols-2 py-16 pb-8">
          <div className="w-full px-4">
            {/* GoSolar Heading */}
            <motion.h2
              className="text-2xl text-primary font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              GoSolar
            </motion.h2>

            {/* Main Heading */}
            <motion.h1
              className="font-bold text-5xl lg:text-8xl leading-snug"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Whispering <span className="text-primary">the winds</span> of
              change
            </motion.h1>
          </div>
          <div></div>
        </div>

        {/* Subheading */}
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <motion.div
            className="px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h5 className="text-lg">
              Replace carbon-transmitting items with solar power solutions
            </h5>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;