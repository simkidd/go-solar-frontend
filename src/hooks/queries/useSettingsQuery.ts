import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface StoreSettings {
  _id: string;
  vatRate: number;
  baseShippingFee: number;
  freeShippingThreshold: number;
  usdExchangeRate: number;

  supportPhone: string;
  supportEmail: string;
  officeAddress: string;
  whatsappNumber: string;
  whatsappMessage: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;

  bankName: string;
  accountNumber: string;
  accountName: string;

  applianceWattages: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

export const SETTINGS_KEYS = {
  all: ["settings"] as const,
};

export const useSettingsQuery = () => {
  return useQuery<{ success: boolean; settings: StoreSettings }>({
    queryKey: SETTINGS_KEYS.all,
    queryFn: async () => {
      const { data } = await axiosInstance.get("/settings");
      return data;
    },
  });
};
