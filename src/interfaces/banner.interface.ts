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
}
