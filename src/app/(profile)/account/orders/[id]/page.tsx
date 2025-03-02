import AccountOrderDetails from "@/app/(profile)/components/AccountOrderDetails";
import type { Metadata } from "next";

interface IOrder {
  params: Promise<{ id: string }>;
}

const pageTitle = "Order Details";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const UserOrderPage = async ({ params }: IOrder) => {
  const { id } = await params;
  return (
    <div>
      <AccountOrderDetails id={id} />
    </div>
  );
};

export default UserOrderPage;
