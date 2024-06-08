/* eslint-disable react/no-unescaped-entities */

import BlogCard from "@/components/BlogCard";
import MarqueeComp from "@/components/MarqueeComp";
import Review from "@/components/Review";
import { Post } from "@/interfaces/post.interface";
import { Product } from "@/interfaces/product.interface";
import { getPosts, getProducts } from "@/lib/data";
import Link from "next/link";
import ProductCard from "../(ecommerce)/components/ProductCard";

const page = async () => {
  const posts: Post[] = await getPosts();
  const products: Product[] = await getProducts();

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
                Replace carbon-transmitting items with solar power solutions
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
                At GoSolar, we envision a world powered by renewable energy,
                where sustainability is at the forefront of every industry.
              </p>
            </div>
            <div className="lg:col-span-2 p-4">
              <div className="border-l-primary border-l-4 pl-4 mb-4">
                <h4 className="text-2xl font-semibold">Our Solution</h4>
              </div>
              <p>
                Our solution involves providing accessible and efficient solar
                energy solutions to individuals and businesses, reducing their
                carbon footprint and promoting environmental stewardship.
              </p>
            </div>
            <div className="lg:col-span-4 p-4">
              <h4 className="text-primary font-bold mb-4">Main Initiative</h4>
              <h3 className="capitalize text-4xl font-bold leading-normal">
                "Our Goal is to change the modern world to become
                nature-friendly."
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
                We are experts in solar and sustainable energy services.
              </h2>
              <p>
                GoSolar specializes in providing high-quality solar energy
                solutions tailored to meet the needs of our clients. With a
                focus on innovation and sustainability, we strive to make a
                positive impact on the environment and the community.
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
      <section className="w-full py-16 overflow-x-hidden">
        <div className="container mx-auto px-2 mb-8 relative">
          <h2 className="text-primary text-2xl font-bold mb-4">Testimonials</h2>
          <h2 className="lg:text-5xl text-4xl font-bold">
            What Our Customers Say
          </h2>
          <div className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-[5.7rem] absolute lg:-top-24 -top-14 left-0 -z-[1] font-bold">
            Reviews
          </div>
        </div>
        <div className="container mx-auto px-2 py-4">
          <Review />
        </div>
      </section>
      {/* blog section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-2">
          <div className="mb-8 grid lg:grid-cols-2 grid-cols-1">
            <div className="relative">
              <h2 className="text-primary text-2xl font-bold mb-4">
                Latest Blog Posts
              </h2>
              <h2 className="lg:text-5xl text-4xl font-bold mb-4">
                Stay Updated with Our Blog
              </h2>
              <div className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-8xl absolute lg:-top-20 -top-8 left-0 -z-[1] font-bold">
                Blog
              </div>
            </div>

            <Link href="/blog" className="ml-auto mt-auto">
              <button className="bg-primary text-white py-4 px-8">
                All Articles
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            {posts?.slice(0, 3).map((post) => (
              <BlogCard key={post?._id} post={post} />
            ))}
          </div>
          <div></div>
        </div>
      </section>
      {/* shop section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-2">
          <div className="mb-8 grid lg:grid-cols-2 grid-cols-1">
            <div className="relative">
              <h2 className="text-primary text-2xl font-bold mb-4">
                Our Shop
              </h2>
              <h2 className="lg:text-5xl text-4xl font-bold mb-4">
                Renewable Energy Solutions
              </h2>
              <div className="font-roboto text-transparent uppercase text-stroke lg:text-[140px] text-8xl absolute lg:-top-20 -top-8 left-0 -z-[1] font-bold">
                Shop
              </div>
            </div>

            <Link href="/shop" className="ml-auto mt-auto">
              <button className="bg-primary text-white py-4 px-8">
                Go Shop
              </button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 my-6">
            {products?.slice(0, 6).map((item) => (
              <ProductCard key={item?._id} item={item} />
            ))}
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
                Need Assistance?
              </h2>
              <h2 className="lg:text-5xl text-4xl font-bold">
                Contact Us Today
              </h2>
            </div>
            <div className="col-span-1 flex items-center lg:justify-end justify-center mt-6 lg:mt-0">
              <Link href="">
                <button className="bg-primary text-white py-4 px-8">
                  Get In Touch
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
