import type { Metadata } from "next";
import ReviewsTable from "../../components/reviews/ReviewsTable";

export const metadata: Metadata = {
  title: "Customer Reviews & Moderation | GoSolar Admin",
  description: "Moderate and publish customer testimonials and star ratings.",
};

const ReviewsAdminPage = () => {
  return (
    <div className="w-full">
      <ReviewsTable />
    </div>
  );
};

export default ReviewsAdminPage;