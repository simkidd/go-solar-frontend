"use client";
import React from "react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GiCheckMark } from "react-icons/gi";
import WorkersImg from "../../../public/images/workers.jpg";

const ConsultantSection = () => {
  return (
    <section className="w-full py-20 bg-white dark:bg-zinc-950 font-inter">
      <div className="container mx-auto px-2">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-12 items-center">
          
          <div className="relative p-2 h-[400px] lg:h-[500px]">
            <div className="ml-auto lg:mr-10 border-l-8 border-primary lg:w-[70%] w-[85%] h-full pl-6 z-[1]">
              <div className="bg-zinc-100 w-full h-full rounded-br-[100px] lg:rounded-br-[150px] overflow-hidden relative shadow-md">
                <Image
                  src={WorkersImg.src}
                  alt="workers"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Visual Overlapping Avatars Card */}
            <div className="absolute bottom-6 lg:bottom-10 left-6 w-[260px] bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 px-6 py-6 rounded-2xl shadow-lg flex flex-col space-y-3 z-10">
              <div className="flex -space-x-2.5 overflow-hidden">
                <Avatar className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <AvatarFallback>A1</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                  <AvatarFallback>A2</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <AvatarFallback>A3</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white dark:border-zinc-900">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                  <AvatarFallback>A4</AvatarFallback>
                </Avatar>
              </div>

              <p className="text-xs sm:text-sm font-bold leading-snug text-zinc-800 dark:text-zinc-200">
                <span className="text-primary font-extrabold">+25,500</span> Satisfied Customers
              </p>
            </div>
          </div>

          <div className="lg:p-5 p-2">
            <div className="border-l-primary border-l-4 pl-4 mb-6">
              <h4 className="lg:text-xl text-lg font-bold text-primary">
                Consultation
              </h4>
            </div>
            <h2 className="font-extrabold lg:text-5xl text-3xl leading-snug capitalize text-zinc-900 dark:text-white tracking-tight">
              High-Quality Solar Energy Solutions
            </h2>
            <p className="py-6 text-sm sm:text-base leading-relaxed text-zinc-500">
              At GoSolar, we believe in empowering individuals and businesses to embrace solar energy solutions that drive environmental stewardship and financial savings. Our consultancy services aim to guide you in maximizing the potential of renewable energy investments.
            </p>
            <ul className="flex flex-col space-y-2.5 text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
              <li className="flex items-center">
                <GiCheckMark className="text-primary mr-3 shrink-0" />
                Environmental Benefits of Solar Energy
              </li>
              <li className="flex items-center">
                <GiCheckMark className="text-primary mr-3 shrink-0" />
                Maximizing Your Renewable Investment
              </li>
            </ul>

            <Button className="bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs uppercase tracking-wider h-11 px-8 rounded-xl mt-8">
              Get Consultation
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ConsultantSection;
