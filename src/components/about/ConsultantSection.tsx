"use client";
import { Avatar, AvatarGroup } from "@heroui/react";
import Image from "next/image";
import React from "react";
import { GiCheckMark } from "react-icons/gi";

const ConsultantSection = () => {
  return (
    <section className="w-full py-20">
      <div className="container mx-auto px-2">
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div className="relative p-2 h-[400px] lg:h-full">
            <div className="ml-auto lg:mr-10 border-l-8 border-primary lg:w-[70%] w-[85%] h-full pl-6 z-[-1]">
              <div className="bg-gray-500 w-full h-full">
                <Image src="" alt="" />
              </div>
            </div>
            <div className="absolute bottom-6 lg:bottom-10 left-10 w-[250px] light bg-white dark:bg-[#2a2b2f] px-8 py-6 shadow-lg font-dmsans flex flex-col space-y-4">
              <AvatarGroup isBordered max={3}>
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                <Avatar
                  src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                  className="size-2"
                />
                <Avatar
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  className="size-2"
                />
                <Avatar
                  src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                  className="size-2"
                />
                <Avatar
                  src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                  className="size-2"
                />
                <Avatar
                  src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                  className="size-2"
                />
              </AvatarGroup>

              <p className="text-lg font-semibold leading-snug">
                <span className="text-primary">25,500</span> Satisfied Customers
                and Counting
              </p>
            </div>
          </div>
          <div className="lg:p-5 p-2 mt-10 lg:mt-0">
            <div className="border-l-primary border-l-4 pl-4 mb-6">
              <h4 className="lg:text-xl text-lg font-bold text-primary">
                Consultation
              </h4>
            </div>
            <h2 className="font-bold lg:text-5xl text-4xl leading-snug capitalize">
              High-Quality Solar Energy Solutions
            </h2>
            <p className="py-8 leading-relaxed">
              At &quot;Solar Powering Your Sustainable Scene,&quot; we believe
              in empowering individuals and businesses to embrace solar energy
              solutions that drive environmental stewardship and financial
              savings. Our consultancy services aim to guide you in maximizing
              the potential of renewable energy investments.
            </p>
            <ul className="flex flex-col space-y-2">
              <li className="flex items-center font-semibold">
                <GiCheckMark className="text-primary mr-3" />
                Environmental Benefits of Solar Energy
              </li>
              <li className="flex items-center font-semibold">
                <GiCheckMark className="text-primary mr-3" />
                Maximizing Your Renewable Investment
              </li>
            </ul>

            <button className="bg-primary text-white px-8 py-4 mt-10">
              Get Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultantSection;
