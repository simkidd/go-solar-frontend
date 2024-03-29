/* eslint-disable react/no-unescaped-entities */

import PageHeader from "@/components/PageHeader";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";
import { GiCheckMark } from "react-icons/gi";

const pageTitle = "Who we are";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const AboutUsPage = () => {
  return (
    <div className="w-full font-inter">
      <PageHeader name="About Us" />
      {/* about us */}
      <section className="w-full py-20">
        <div className="container mx-auto px-2">
          <div className="grid lg:grid-cols-2 grid-cols-1">
            <div className="relative">
              <div className="absolute top-0 lg:right-12 right-0 border-l-8 border-primary w-[70%] h-[90%] pl-6 z-[-1]">
                <div className="bg-gray-500 w-full h-full">
                  <Image src="" alt="" />
                </div>
              </div>
              <div className="lg:absolute bottom-0 left-0 w-[250px] lg:w-[300px] h-[250px] bg-gray-700">
                <Image src="" alt="" />
              </div>
              <div className="w-52 grid grid-cols-12 gap-2 moving-div absolute bottom-0 z-[-2]">
                {[...Array(96)].map((_, i) => (
                  <span key={i} className="w-1 h-1 bg-primary"></span>
                ))}
              </div>
            </div>
            <div className="lg:p-5 p-2 mt-10 lg:mt-0">
              <div className="border-l-primary border-l-4 pl-4 mb-6">
                <h4 className="lg:text-xl text-lg font-bold text-primary">
                  Why Choose Us
                </h4>
              </div>
              <h2 className="font-bold lg:text-5xl text-4xl leading-snug capitalize">
                Powering tomorrow with today's sun
              </h2>
              <p className="py-8 leading-relaxed">
                Rays of Progress & Solar Success serves as a powerful beacon,
                embodying the transformative journey toward a future powered by
                the boundless Energy of the sun. It's a vision where each
              </p>
              <ul className="flex flex-col space-y-2">
                <li className="flex items-center font-semibold">
                  <GiCheckMark className="text-primary mr-3" />
                  Solar Inverter Setup
                </li>
                <li className="flex items-center font-semibold">
                  <GiCheckMark className="text-primary mr-3" />
                  Battery Storage Solutions
                </li>
                <li className="flex items-center font-semibold">
                  <GiCheckMark className="text-primary mr-3" />
                  Off-Grid Solar
                </li>
                <li className="flex items-center font-semibold">
                  <GiCheckMark className="text-primary mr-3" />
                  Solar Water Heating
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/*  */}
      <section></section>
    </div>
  );
};

export default AboutUsPage;
