"use client";
import { ReviewData } from "@/data/reviews";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import { motion } from "framer-motion";

const Review = () => {
  const [selected, setSelected] = useState(0);
  const reviewLength = ReviewData?.length || 0;

  const transition = { type: "spring", duration: 3 };

  const handleLeftArrow = () => {
    setSelected((prev) => (prev === 0 ? reviewLength - 1 : prev - 1));
  };

  const handleRightArrow = () => {
    setSelected((prev) => (prev === reviewLength - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSelected((prev) => (prev === reviewLength - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [reviewLength]);

  return (
    <div>
      <div className="flex items-center justify-end gap-2 w-full mb-4">
        <button
          className="size-10 flex items-center justify-center border border-gray-500 hover:text-primary"
          onClick={handleLeftArrow}
        >
          <ArrowLeft />
        </button>
        <button
          className="size-10 flex items-center justify-center border border-gray-500 hover:text-primary"
          onClick={handleRightArrow}
        >
          <ArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
        <div className="col-span-1 relative hidden lg:flex">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={transition}
            className="w-[80%] h-[90%] absolute bottom-0 right-8 bg-gray-500"
            key={selected}
          >
            <Image
              src={ReviewData[selected]?.image}
              alt="author image"
              className="w-full h-full object-cover"
              width={300}
              height={300}
            />
          </motion.div>
          <div className="absolute top-0 right-0 w-1/2 h-full light bg-[#f1f1f1] dark:bg-[#2a2b2f] z-[-1]"></div>
        </div>

        <div
          key={selected}
          className="col-span-2 lg:px-12 px-2 py-8 light bg-[#f1f1f1] dark:bg-[#2a2b2f]"
        >
          <div className="mb-4 text-primary">
            <BiSolidQuoteAltRight size={50} />
          </div>
          <div className="mb-4 pl-4 border-l-4 border-l-primary">
            <h4 className="text-2xl">
              Be part of the green energy movement with GoSolar.
            </h4>
          </div>
          <motion.p
            className="mb-8"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={transition}
          >
            {ReviewData[selected]?.content}
          </motion.p>

          <motion.div
            className="flex items-center"
            key={selected}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ ...transition, duration: 2 }}
          >
            <div className="rounded-full size-12 bg-gray-500 mr-4 lg:hidden overflow-hidden">
              <Image
                src={ReviewData[selected]?.image}
                alt="author image"
                className="w-full h-full object-cover"
                width={300}
                height={300}
              />
            </div>
            <div className="flex flex-col">
              <h6
                className="text-lg text-primary leading-snug font-semibold"
                key={selected}
              >
                {ReviewData[selected]?.name}
              </h6>
              <p className="text-sm">{ReviewData[selected]?.role}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Review;
