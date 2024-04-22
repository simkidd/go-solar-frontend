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
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  decription: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description: string;
}
