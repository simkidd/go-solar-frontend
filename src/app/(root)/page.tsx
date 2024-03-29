/* eslint-disable react/no-unescaped-entities */

import BlogCard from "@/components/BlogCard";
import MarqueeComp from "@/components/MarqueeComp";
import Review from "@/components/Review";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="w-full font-inter">
      {/* hero section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 py-16">
            <div className="w-full px-4">
              <h2 className="text-2xl text-primary font-bold mb-4">GoSolar</h2>
              <h1 className="font-bold text-5xl lg:text-8xl leading-snug">
                Whispering <span className="text-primary">the winds</span> of
                change
              </h1>
            </div>
            <div></div>
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1">
            <div className="px-4">
              <h5 className="text-lg">
                Replace carbon-transmitting items with sun oriented power.
              </h5>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="h-20 font-dmsans bg-primary flex items-center text-white text-xl">
          <MarqueeComp />
        </div>
      </section>
      {/* our vision section */}
      <section className="w-full">
        <div className="container mx-auto px-2 py-24">
          <div className="grid lg:grid-cols-8 grid-cols-1">
            <div className="lg:col-span-2 p-4">
              <div className="border-l-primary border-l-4 pl-4 mb-4">
                <h4 className="text-2xl font-semibold">Our Vision</h4>
              </div>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Incidunt, nesciunt non aperiam dolorem maiores nisi!
              </p>
            </div>
            <div className="lg:col-span-2 p-4">
              <div className="border-l-primary border-l-4 pl-4 mb-4">
                <h4 className="text-2xl font-semibold">Our Solution</h4>
              </div>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Incidunt, nesciunt non aperiam dolorem maiores nisi!
              </p>
            </div>
            <div className="lg:col-span-4 p-4">
              <h4 className="text-primary font-bold mb-4">Main Initiative</h4>
              <h3 className="capitalize text-4xl font-bold leading-normal">
                "Our Goal is to change the modern world become nature friendly"
              </h3>
            </div>
          </div>
        </div>
      </section>
      {/* about section */}
      <section className="w-full">
        <div className="container mx-auto px-2 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="w-full relative">
              <h2 className="text-primary text-2xl font-bold mb-4">
                About GoSolar
              </h2>
              <h2 className="text-3xl lg:text-5xl font-bold leading-normal mb-4">
                We are experts in the world of solar and sustainable Energy
                Services
              </h2>
              <p>
                The amount of energy you use will depend on the type of business
                you run. However, there are lots of ways that you can save
                energy no matter what you do eothermal energy is a clean and
                reliable.
              </p>
              <div className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-8xl absolute lg:-top-20 -top-8 left-0 -z-[1] font-bold">
                About
              </div>
            </div>
            <div className="hidden lg:flex"></div>
          </div>
        </div>
      </section>
      {/* counter section */}
      <section className="w-full">
        <div className="container mx-auto px-2 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="w-full p-2 flex flex-col items-center lg:border-r-gray-400 lg:border-r ">
              <span className="text-5xl leading-normal">48+</span>
              <p className="text-lg text-primary">Years Experience</p>
            </div>
            <div className="w-full p-2 flex flex-col items-center lg:border-r-gray-400 lg:border-r ">
              <span className="text-5xl leading-normal">2886+</span>
              <p className="text-lg text-primary">Projects Completed</p>
            </div>
            <div className="w-full p-2 flex flex-col items-center">
              <span className="text-5xl leading-normal">48+</span>
              <p className="text-lg text-primary">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>
      {/* testimonial section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-2 mb-8 relative">
          <h2 className="text-primary text-2xl font-bold mb-4">Testimonial</h2>
          <h2 className="lg:text-5xl text-4xl font-bold">What they say</h2>
          <div className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-[5.7rem] absolute lg:-top-24 -top-14 left-0 -z-[1] font-bold">
            Reviews
          </div>
        </div>
        <div className="container mx-auto px-2 py-4">
          <div className="flex items-center justify-end gap-2 w-full mb-4">
            <button className="size-10 flex items-center justify-center border border-gray-500 hover:text-primary">
              <ArrowLeft />
            </button>
            <button className="size-10 flex items-center justify-center border border-gray-500 hover:text-primary">
              <ArrowRight />
            </button>
          </div>
          <Review />
        </div>
      </section>
      {/* blog section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-2">
          <div className="relative mb-8">
            <h2 className="text-primary text-2xl font-bold mb-4 text-center">
              Latest Post
            </h2>
            <h2 className="lg:text-5xl text-4xl font-bold text-center mb-4">
              What's Going on in our Blog?
            </h2>
            <div className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-8xl absolute lg:-top-20 -top-8 left-1/2 -z-[1] font-bold -translate-x-1/2">
              Blog
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            <BlogCard />
            <BlogCard />
            <BlogCard />
          </div>
          <div></div>
        </div>
      </section>
      {/* contact section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-2 py-16 border border-gray-400">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:px-16">
            <div className="col-span-2">
              <h2 className="capitalize mb-4 text-2xl text-primary">
                we are here to help you
              </h2>
              <h2 className="lg:text-5xl text-4xl font-bold">Any Questions? Let's Talk</h2>
            </div>
            <div className="col-span-1 flex items-center lg:justify-end justify-center mt-6 lg:mt-0">
              <Link href="">
                <button className="bg-primary py-4 px-8">Get In Touch</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
