import { AddOfferProductDTO, Offer } from "@/interfaces/product.interface";
import { axiosInstance } from "../axios";

export const getOffers = async (): Promise<Offer[]> => {
  const { data } = await axiosInstance.get("/offers");
  return data.offers;
};

export const getOffer = async (id: string): Promise<Offer> => {
  const { data } = await axiosInstance.get(`/offers/${id}`);
  return data.offer;
};

export const addToOffer = async (input: AddOfferProductDTO) => {
  const { data } = await axiosInstance.patch(
    "/admin/add-offer-to-products",
    input
  );

  return data;
};
