export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  placement?: "storefront_hero" | "storefront_promo_strip" | "storefront_promo_card";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string | File;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  isActive?: boolean;
  placement?: "storefront_hero" | "storefront_promo_strip" | "storefront_promo_card";
}

export interface UpdateBannerInput {
  bannerId: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  image?: string | File;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  isActive?: boolean;
  placement?: "storefront_hero" | "storefront_promo_strip" | "storefront_promo_card";
}
