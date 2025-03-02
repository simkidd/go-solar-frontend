import OrderTimeline from "@/app/(profile)/components/OrderTimeline";
import { Metadata } from "next";
import React from "react";

interface IOrder {
  params: Promise<{ id: string }>;
}

const pageTitle = "Track Order";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
};

const TrackStatusPage = async ({ params }: IOrder) => {
  const { id } = await params;

  return (
    <div>
      <div>
        <OrderTimeline id={id} />
      </div>
    </div>
  );
};

export default TrackStatusPage;
