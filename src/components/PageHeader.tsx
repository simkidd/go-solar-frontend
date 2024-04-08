"use client";
import React from "react";
import Breadcrumb from "./Breadcrumb";

const PageHeader = ({ name }: { name: string }) => {
  return (
    <div className="lg:py-28 py-10 w-full bg-gray-500">
      <div className="container mx-auto px-2">
        <div className="flex flex-col max-w-[1100px] mx-auto px-2">
          <h2 className="lg:text-5xl text-4xl font-bold mb-4">{name}</h2>
          <div>
            <Breadcrumb name={name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
