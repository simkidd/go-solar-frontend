// components/home/CounterSection.tsx
"use client";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const CounterSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger animation only once
  });

  return (
    <section ref={ref} className="w-full">
      <div className="container mx-auto px-2 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {[
            { value: 10, label: "Years Experience" },
            { value: 1886, label: "Projects Completed" },
            { value: 68, label: "Happy Customers" },
          ].map((item, index) => (
            <div
              key={index}
              className="w-full p-2 flex flex-col items-center lg:border-r-gray-400 lg:border-r"
            >
              {/* Animated number counter */}
              <span className="text-5xl leading-normal">
                {inView ? (
                  <CountUp
                    start={0}
                    end={item.value}
                    duration={2} // Duration of the animation in seconds
                    suffix="+" // Add a "+" suffix
                  />
                ) : (
                  "0+" // Fallback when not in view
                )}
              </span>
              <p className="text-lg text-primary">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;