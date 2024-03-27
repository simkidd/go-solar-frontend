import BlogCard from "@/components/BlogCard";
import { BiSolidQuoteAltRight } from "react-icons/bi";

const page = () => {
  return (
    <div className="w-full font-inter">
      {/* hero section */}
      <section className="w-full">
        <div className="container mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 py-28">
            <div className="w-full px-4">
              <h2 className="text-2xl text-primary font-bold mb-4">GoSolar</h2>
              <h1 className="font-bold text-5xl lg:text-7xl leading-snug">
                An Alternative Energy Source
              </h1>
            </div>
            <div></div>
          </div>
          <div className="grid lg:grid-cols-7 grid-cols-2">
            <div className="px-4 col-span-1">
              <h5 className="text-lg">Renewable Away</h5>
            </div>
            <div className="px-4 col-span-3">
              <p className="text-sm">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore
                quisquam nihil aliquid, id mollitia maiores necessitatibus
                dignissimos omnis ab quasi.
              </p>
            </div>
            <div className="col-span-3"></div>
          </div>
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
            <div className="w-full">
              <h2 className="text-primary text-2xl font-bold mb-4">
                About Energize
              </h2>
              <h2 className="text-5xl font-bold leading-snug mb-4">
                We are experts in the world of solar and renewable energy
              </h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                deserunt assumenda dignissimos ducimus harum aliquam corporis
                quae dolorem, doloribus obcaecati?
              </p>
            </div>
            <div className="hidden lg:flex"></div>
          </div>
        </div>
      </section>
      {/* counter section */}
      <section className="w-full">
        <div className="container mx-auto px-2 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="w-full p-2 flex flex-col items-center border-r-gray-400 border-r">
              <span className="text-5xl leading-normal">48+</span>
              <p className="text-lg text-primary">Years Experience</p>
            </div>
            <div className="w-full p-2 flex flex-col items-center border-r-gray-400 border-r">
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
        <div className="container mx-auto px-2 mb-8">
          <h2 className="text-primary text-2xl font-bold mb-4">Testimonial</h2>
          <h2 className="text-5xl font-bold">What they say</h2>
        </div>
        <div className="container mx-auto px-2 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
            <div className="col-span-1 relative">
              <div className="w-full h-full relative">
                <img src="" alt="author image" />
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full light bg-[#f1f1f1] dark:bg-[#2a2b2f]"></div>
            </div>
            <div className="col-span-2 px-12 py-8 light bg-[#f1f1f1] dark:bg-[#2a2b2f]">
              <div className="mb-4 text-primary">
                <BiSolidQuoteAltRight size={50} />
              </div>
              <div className="mb-4 pl-4 border-l-4 border-l-primary">
                <h4 className="text-2xl">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Molestias, doloremque.
                </h4>
              </div>
              <p className="mb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                aliquam eveniet veniam nihil fugit molestias sit ex, maiores
                eius fuga hic dolorum aspernatur! Totam repudiandae esse,
                veritatis doloremque impedit vitae?
              </p>
              <div>
                <h6 className="text-lg text-primary leading-snug font-semibold">
                  Adrian Javier
                </h6>
                <p className="text-sm">Project Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* blog section */}
      <section className="w-full">
        <div className="container mx-auto px-2">
          <h2 className="text-primary text-2xl font-bold mb-4 text-center">
            Blog Posts
          </h2>
          <h2 className="text-5xl font-bold text-center mb-4">
            The Latest News
          </h2>
          <p className="text-center mb-4">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Laboriosam, aspernatur!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-4">
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
          </div>
          <div></div>
        </div>
      </section>
    </div>
  );
};

export default page;
