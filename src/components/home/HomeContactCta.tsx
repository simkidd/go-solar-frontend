"use client"
import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

const HomeContactCta = () => {
  return (
    <section className="w-full py-16 bg-contact-us-bg-2 bg-no-repeat bg-cover bg-center relative">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/50 z-10" />
      <div className="container mx-auto px-2 py-16 drop-shadow-md relative z-10 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:px-16">
          <div className="col-span-2">
            <h2 className="capitalize mb-4 text-2xl text-primary">
              Need Assistance?
            </h2>
            <h2 className="lg:text-5xl text-4xl font-bold">Contact Us Today</h2>
          </div>
          <div className="col-span-1 flex items-center lg:justify-end justify-center mt-6 lg:mt-0">
            <Link href="/contact-us">
              <Button color="primary" size="lg" className="">Get In Touch</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeContactCta;
