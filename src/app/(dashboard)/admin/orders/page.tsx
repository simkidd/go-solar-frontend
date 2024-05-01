import OrdersListTable from "../../components/OrdersListTable";

const OrdersPage = () => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">Orders</h3>
      </div>
      <div className="w-full bg-white dark:bg-[#222327] shadow">
        <OrdersListTable />
      </div>
    </div>
  );
};

export default OrdersPage;
