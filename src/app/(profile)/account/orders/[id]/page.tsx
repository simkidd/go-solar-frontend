import AccountOrderDetails from "@/app/(profile)/components/AccountOrderDetails";
import type { Metadata } from "next";

interface IOrder {
  params: { id: string };
}

const pageTitle = "Order Details";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const UserOrderPage = ({ params }: IOrder) => {
  return (
    <div>
      <AccountOrderDetails id={params?.id} />
    </div>
  );
};

export default UserOrderPage;
