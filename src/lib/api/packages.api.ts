import { axiosInstance } from "../axios";
import { SolarPackage } from "@/interfaces/package.interface";

export const getPackages = async (params?: Record<string, any>): Promise<SolarPackage[]> => {
  try {
    const { data } = await axiosInstance.get("/packages", { params });
    return data?.packages || [];
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
};

export const getPackage = async (idOrSlug: string): Promise<SolarPackage | null> => {
  try {
    const { data } = await axiosInstance.get(`/packages/${idOrSlug}`);
    return data?.package || null;
  } catch (error) {
    console.error(`Error fetching package ${idOrSlug}:`, error);
    return null;
  }
};
