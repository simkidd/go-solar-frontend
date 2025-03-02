import { axiosInstance } from "../axios";

export const getOffers = async () => {
  const { data } = await axiosInstance.get("/offers");
  return data.offers;
};

export const getOffer = async (id: string) => {
  const { data } = await axiosInstance.get(`/offers/${id}`);
  return data.offer;
};
