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
