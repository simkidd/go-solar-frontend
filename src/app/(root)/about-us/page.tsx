/* eslint-disable react/no-unescaped-entities */

import PageHeader from "@/components/PageHeader";
import TeamCard from "@/components/TeamCard";
import TeamQuote from "@/components/TeamQuote";
import { TeamMember } from "@/data/team";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import { Metadata } from "next";
import Image from "next/image";
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

      {/* quote section */}
      <section className="w-full py-20 bg-gray-500">
        <div className="container mx-auto px-2">
          <div className="grid lg:grid-cols-2 grid-cols-1">
            <div className="hidden lg:block"></div>
            <div className="lg:p-4">
              <TeamQuote />
            </div>
          </div>
        </div>
      </section>

      {/* our team */}
      <section className="w-full py-20">
        <div className="container mx-auto px-2">
          <h2 className="text-primary lg:text-xl text-lg font-bold mb-4 text-center">
            Our Team
          </h2>
          <h2 className="text-3xl lg:text-4xl font-bold leading-normal mb-8 text-center">
            Our Specialists Leadership Team
          </h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 my-8">
            {TeamMember.map((member, i) => (
              <TeamCard key={i} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* consultant */}
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
                  <span className="text-primary">25,500</span> Customer
                  Satisfaction Services
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
                High Quality Solar Energy Solutions
              </h2>
              <p className="py-8 leading-relaxed">
                Solar Powering Your Sustainable Scene is a vibrant and
                compelling phrase that conveys the idea of integrating solar
                energy into various aspects of life to create a sustainable
              </p>
              <ul className="flex flex-col space-y-2">
                <li className="flex items-center font-semibold">
                  <GiCheckMark className="text-primary mr-3" />
                  The Environmental Benefits of Solar Energy
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
    </div>
  );
};

export default AboutUsPage;
