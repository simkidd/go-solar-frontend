import { CartItem } from "@/lib/stores/cart.store";

export interface IImage {
  url: string;
  public_id: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: Category;
  additionalInfo: string;
  quantityInStock: number;
  images: IImage[];
  brand: string;
  outsideLocationDeliveryFee: number;
  withinLocationDeliveryFee: number;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isDeleted: boolean;
  currentOffer: Offer;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  additionalInfo: string;
  quantityInStock: number;
  images: string[] | File[];
  brand: string;
  outsideLocationDeliveryFee: number;
  withinLocationDeliveryFee: number;
  isPublished: boolean;
  currentOffer?: string;
}

export interface UpdateProductInput {
  productId: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  additionalInfo?: string;
  quantityInStock?: number;
  brand?: string;
  outsideLocationDeliveryFee?: number;
  withinLocationDeliveryFee?: number;
  isPublished?: boolean;
  currentOffer?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description: string;
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  categoryId: string;
}

export interface OrderProduct {
  product: string;
  qty: number;
  deliveryFee: number;
}

export interface CreateOrderInput {
  products: OrderProduct[];
  deliveryDetails: DeliveryDetails;
  totalPricePaid: number;
  paymentMethod: string;
  paymentReference: string;
  paymentData: string;
}

export interface DeliveryDetails {
  suiteNumber: string;
  streetAddress: string;
  city: string;
  zipCode: string;
}

export interface Offer {
  _id: string;
  name: string;
  description: string;
  type: OfferType;
  priceSlash: number;
  percentageOff: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferInput {
  name: string;
  description: string;
  type: OfferType;
  priceSlash?: number;
  percentageOff?: number;
  isActive?: boolean;
}

export enum OfferType {
  PriceSlash = "Price Slash",
  PercentageOff = "Percentage Off",
}

export interface UpdateOfferInput extends CreateOfferInput {
  // offerId: string;
}

export interface AddOfferProductDTO {
  products: string[];
  offer: string;
}
