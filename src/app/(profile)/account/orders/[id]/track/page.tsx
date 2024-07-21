import OrderTimeline from "@/app/(profile)/components/OrderTimeline";
import { Metadata } from "next";
import React from "react";

interface IOrder {
  params: { id: string };
}

const pageTitle = "Track Order";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const TrackStatusPage = ({ params }: IOrder) => {
  return (
    <div>
      <div>
        <OrderTimeline id={params?.id} />
      </div>
    </div>
  );
};

export default TrackStatusPage;
