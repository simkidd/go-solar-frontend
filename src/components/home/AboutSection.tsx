// components/home/AboutSection.tsx
"use client";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="container mx-auto px-2 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            className="w-full relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }} // Only animate once
          >
            <motion.h2
              className="text-primary text-2xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              About GoSolar
            </motion.h2>
            <motion.h2
              className="text-3xl lg:text-5xl font-bold leading-normal mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              We are experts in solar and sustainable energy services.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              GoSolar specializes in providing high-quality solar energy
              solutions tailored to meet the needs of our clients. With a focus
              on innovation and sustainability, we strive to make a positive
              impact on the environment and the community.
            </motion.p>
            <motion.div
              className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-8xl absolute lg:-top-20 -top-8 left-0 -z-[1] font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              About
            </motion.div>
          </motion.div>
          <div className="hidden lg:flex"></div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;