import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCard = () => {
  return (
    <div className="w-full">
      <Link href="">
        <div className="w-full h-[200px] bg-gray-500">
          <Image src="" alt="post image" />
        </div>
      </Link>
      <div className="p-4 w-full">
        <div className="text-primary text-xl mb-4">
          <Link href="">
            Solar Panels have a good impact on the environment
          </Link>
        </div>
        <div className="text-sm flex items-center">
          <span className="mr-2">March 23, 2024</span> | 
          <span className="ml-2">Category</span>
        </div>
        <p className="my-4 w-full">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
          fugiat.
        </p>

        <Link href="" className="text-primary">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
