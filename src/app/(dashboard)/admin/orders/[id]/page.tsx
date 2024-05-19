import OrderDetails from "@/app/(dashboard)/components/OrderDetails";
import { Order } from "@/interfaces/order.interface";
import { getOrder, getOrders } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

interface IOrder {
  params: { id: string };
}

export const generateMetadata = async ({
  params,
}: IOrder): Promise<Metadata> => {
  const order: Order = await getOrder(params.id);

  return {
    title: `Order ${order?.trackingId?.tracking_id}`,
  };
};

// export const generateStaticParams = async () => {
//   try {
//     const orders = await getOrders();

//     return orders.map((order: any) => ({
//       id: order?._id,
//     }));
//   } catch (error) {
//     console.log(error);
//   }
// };

const SingleOrderPage = () => {
  return (
    <div className="w-full max-w-[1000px] mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/orders">
          <button className="px-4 py-2 text-sm flex items-center">
            <ArrowLeft className="mr-2" size={16} />
            Go back
          </button>
        </Link>
      </div>
      <div className="w-full">
        <OrderDetails />
      </div>
    </div>
  );
};

export default SingleOrderPage;
