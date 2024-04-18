export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  additionalInfo: string;
  quantityInStock: number;
  images: string[];
  brand: string;
  outsideLocationDeliveryFee: number;
  withinLocationDeliveryFee: number;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  additionalInfo: string;
  quantityInStock: number;
  images: string[];
  brand: string;
  outsideLocationDeliveryFee: number;
  withinLocationDeliveryFee: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
