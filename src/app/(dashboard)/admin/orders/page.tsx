import { axiosInstance } from "@/lib/axios";

// export const getOrders = async () => {
//   try {
//     const { data } = await axiosInstance.get("/users/orders/user-orders");

//     return data.orders;
//   } catch (error) {
//     console.log(error);
//   }
// };

const OrdersPage = async () => {
  // const orders = await getOrders();
  // console.log("orders", orders);

  return <div>orders page</div>;
};

export default OrdersPage;
