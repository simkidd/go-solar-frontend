import { Team } from "@/data/team";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaXTwitter, FaInstagram, FaFacebookF } from "react-icons/fa6";

const TeamCard: React.FC<{ member: Team }> = ({ member }) => {
  const { name, role, image, socials } = member;

  return (
    <div className="w-full lg:h-[350px] h-[400px] relative group">
      <div className="w-full lg:h-[300px] h-[350px] bg-gray-500">
        <Image
          src={image}
          alt="team member"
          className="w-full h-full object-cover"
          width={200}
          height={300}
        />
      </div>
      <div
        className="w-[90%] absolute bottom-5 left-1/2 -translate-x-1/2 group-hover:border-b-2 group-hover:border-b-primary overflow-hidden"
        style={{ transition: "all 0.5s ease-in-out" }}
      >
        <div
          className="py-5 px-8 flex items-center flex-col light bg-white dark:bg-gray-900 w-full translate-y-12 group-hover:translate-y-0"
          style={{ transition: "all 0.5s ease-in-out" }}
        >
          <p className="text-primary text-sm uppercase">{role}</p>
          <p className="text-xl font-bold">{name}</p>
          <ul className="flex items-center gap-4 mt-4">
            <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
              <Link
                href={socials.facebook}
                className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
              >
                <FaFacebookF />
              </Link>
            </li>
            <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
              <Link
                href={socials.twitter}
                className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
              >
                <FaXTwitter />
              </Link>
            </li>
            <li className="light bg-[#f1f1f1] dark:bg-[#2a2b2f] size-7 rounded-full flex items-center justify-center">
              <Link
                href={socials.instagram}
                className="text-sm hover:text-primary flex items-center justify-center w-full h-full"
              >
                <FaInstagram />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
