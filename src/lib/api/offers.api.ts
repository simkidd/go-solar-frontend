import { AddOfferProductDTO, Offer } from "@/interfaces/product.interface";
import { axiosInstance } from "../axios";

export const getOffers = async (): Promise<Offer[]> => {
  try {
    const { data } = await axiosInstance.get("/offers");
    return data.offers;
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
};

export const getOffer = async (id: string): Promise<Offer | null> => {
  try {
    const { data } = await axiosInstance.get(`/offers/${id}`);
    return data.offer || null;
  } catch (error) {
    console.error(`Error fetching offer ${id}:`, error);
    return null;
  }
};

export const addToOffer = async (input: AddOfferProductDTO) => {
  const { data } = await axiosInstance.patch(
    "/admin/add-offer-to-products",
    input
  );
  return data;
};

export const removeFromOffer = async (productId: string, offerId: string) => {
  const { data } = await axiosInstance.post("/offers/remove-product", {
    productId,
    offerId,
  });
  return data;
};
