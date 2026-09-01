import OrderDetails from "@/app/(dashboard)/components/OrderDetails";
import { Order } from "@/interfaces/order.interface";
import { getOrder, getOrders } from "@/lib/api/orders.api";
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

const SingleOrderPage = async ({ params }: IOrder) => {
  const { id } = await params;

  return (
    <div className="w-full container mx-auto py-4 font-inter">
      <div className="flex items-center justify-between mb-4 ">
        <Link
          href="/dashboard/orders"
          className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to orders
        </Link>
      </div>
      <div className="w-full">
        <OrderDetails id={id} />
      </div>
    </div>
  );
};

export default SingleOrderPage;
