// components/home/VisionSection.tsx
"use client";
import { motion } from "framer-motion";

const VisionSection = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto px-2 py-24">
        <div className="grid lg:grid-cols-8 grid-cols-1">
          {[
            {
              title: "Our Vision",
              description:
                "At GoSolar, we envision a world powered by renewable energy, where sustainability is at the forefront of every industry.",
            },
            {
              title: "Our Solution",
              description:
                "Our solution involves providing accessible and efficient solar energy solutions to individuals and businesses, reducing their carbon footprint and promoting environmental stewardship.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="lg:col-span-2 p-4"
              initial={{ opacity: 0, x: -50 }} // Start off-screen to the left
              whileInView={{ opacity: 1, x: 0 }} // Slide in to the center
              transition={{ duration: 0.5, delay: index * 0.2 }} // Staggered delay
              viewport={{ once: true }} // Only animate once
            >
              <div className="border-l-primary border-l-4 pl-4 mb-4">
                <h4 className="text-2xl font-semibold">{item.title}</h4>
              </div>
              <p>{item.description}</p>
            </motion.div>
          ))}
          <motion.div
            className="lg:col-span-4 p-4"
            initial={{ opacity: 0, y: 50 }} // Start off-screen below
            whileInView={{ opacity: 1, y: 0 }} // Pop up into view
            transition={{ duration: 0.5, delay: 0.4 }} // Slight delay
            viewport={{ once: true }} // Only animate once
          >
            <h4 className="text-primary font-bold mb-4">Main Initiative</h4>
            <h3 className="capitalize text-4xl font-bold leading-normal">
              &quot;Our Goal is to change the modern world to become
              nature-friendly.&quot;
            </h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;