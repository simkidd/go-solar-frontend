import type { Metadata } from "next";
import QuotesTable from "../../components/quotes/QuotesTable";

export const metadata: Metadata = {
  title: "Quote Requests & Leads | GoSolar Admin",
  description: "Manage energy calculator submissions and installation quote requests.",
};

const QuotesAdminPage = () => {
  return (
    <div className="w-full">
      <QuotesTable />
    </div>
  );
};

export default QuotesAdminPage;
