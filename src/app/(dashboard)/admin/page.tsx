import type { Metadata } from "next";
import OverviewComp from "../components/OverviewComp";

const pageTitle = "Overview";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const OveriewPage = () => {
  const getGreetingTime = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      return "Good morning!";
    } else if (currentHour < 17) {
      return "Good afternoon!";
    } else {
      return "Good evening!";
    }
  };

  return (
    <div className="w-full py-4">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold mb-1">Overview</h3>
      </div>

      <div className="mb-4">
        <p>Welcome Back!</p>
        <p>{getGreetingTime()}</p>
      </div>

      <OverviewComp />
    </div>
  );
};

export default OveriewPage;
