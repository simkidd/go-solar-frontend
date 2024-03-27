import React from "react";
import { BiSolidQuoteAltRight } from "react-icons/bi";

const Review = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
      <div className="col-span-1 relative">
        <div className="w-full h-full relative">
          <img src="" alt="author image" />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full light bg-[#f1f1f1] dark:bg-[#2a2b2f]"></div>
      </div>
      <div className="col-span-2 px-12 py-8 light bg-[#f1f1f1] dark:bg-[#2a2b2f]">
        <div className="mb-4 text-primary">
          <BiSolidQuoteAltRight size={50} />
        </div>
        <div className="mb-4 pl-4 border-l-4 border-l-primary">
          <h4 className="text-2xl">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestias,
            doloremque.
          </h4>
        </div>
        <p className="mb-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio aliquam
          eveniet veniam nihil fugit molestias sit ex, maiores eius fuga hic
          dolorum aspernatur! Totam repudiandae esse, veritatis doloremque
          impedit vitae?
        </p>
        <div>
          <h6 className="text-lg text-primary leading-snug font-semibold">
            Adrian Javier
          </h6>
          <p className="text-sm">Project Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Review;
