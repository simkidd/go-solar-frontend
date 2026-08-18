import type { Metadata } from "next";
import OverviewComp from "../components/OverviewComp";

const pageTitle = "Overview";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const OveriewPage = () => {
  return (
    <div className="w-full">
      <OverviewComp />
    </div>
  );
};

export default OveriewPage;
