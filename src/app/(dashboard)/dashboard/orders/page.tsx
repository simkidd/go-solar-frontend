import { Metadata } from "next";
import OrdersTable from "../../components/OrdersTable";

const pageTitle = "Orders";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const OrdersPage = () => {
  return (
    <div className="w-full">
      <OrdersTable />
    </div>
  );
};

export default OrdersPage;
