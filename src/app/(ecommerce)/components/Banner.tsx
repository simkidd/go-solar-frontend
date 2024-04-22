import React from "react";

const Banner = () => {
  return (
    <div className="w-full lg:h-[400px] md:h-[300px]">
      <div className="w-full h-full grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 w-full h-full pr-2">
          <div className="bg-gray-500 w-full h-full">banner slider</div>
        </div>
        <div className="col-span-4 w-full h-full lg:flex flex-col pl-2 gap-4 hidden">
          <div className="h-full w-full bg-gray-500">banner 2</div>
          <div className="h-full w-full bg-gray-500">banner 3</div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
