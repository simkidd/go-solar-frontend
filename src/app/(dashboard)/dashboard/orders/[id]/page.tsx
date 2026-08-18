import OrderDetails from "@/app/(dashboard)/components/OrderDetails";
import { Order } from "@/interfaces/order.interface";
import { getOrder, getOrders } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface IOrder {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: IOrder): Promise<Metadata> => {
  const { id } = await params;
  const order: Order = await getOrder(id);

  return {
    title: `Order #${order?.trackingId?.tracking_id}`,
  };
};

// export const generateStaticParams = async () => {
//   try {
//     const orders = await getOrders();

//     // Make sure `orders` is an array before mapping
//     if (Array.isArray(orders)) {
//       return orders.map((order: any) => ({
//         id: order?._id,
//       }));
//     } else {
//       // Handle the case where `orders` is not an array
//       console.error("Error: getOrders did not return an array.");
//       return []; // Return an empty array to avoid errors
//     }
//   } catch (error) {
//     // Handle errors more effectively (e.g., throw an error)
//     console.error("Error fetching orders:", error);
//     throw error; // Re-throw the error for proper error handling
//   }
// };

const SingleOrderPage = async ({ params }: IOrder) => {
  const { id } = await params;
  const order: Order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4 select-none">
        <Link 
          href="/dashboard/orders"
          className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to orders
        </Link>
      </div>
      <div className="w-full">
        <OrderDetails order={order} />
      </div>
    </div>
  );
};

export default SingleOrderPage;
