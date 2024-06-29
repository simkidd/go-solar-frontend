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
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-medium">Orders</h3>
      </div>
      <div className="w-full mb-8">
        <OrdersTable />
      </div>
    </div>
  );
};

export default OrdersPage;
