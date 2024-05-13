import { User } from "./auth.interface";
import { Product } from "./product.interface";

export interface Order {
  deliveryDetails: DeliveryDetails;
  _id: string;
  user: User;
  products: Products[];
  totalPricePaid: number;
  paymentMethod: string;
  paymentReference: string;
  paymentData: string;
  trackingStatus: TrackingStatus;
  trackingLevel: number;
  isCancelled: boolean;
  isCompleted: boolean;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  trackingId: TrackingId;
}

export interface Products {
  _id: string;
  product: Product;
  qty: number;
  deliveryFee: number;
}

export interface DeliveryDetails {
  suiteNumber: string;
  streetAddress: string;
  city: string;
  zipCode: string;
}

export interface TrackingId {
  _id: string;
  tracking_id: string;
  order: string;
  createdAt: string;
  updatedAt: string;
}

export enum TrackingStatus {
  Processing = "Processing",
  Delivered = "Delivered",
  Received = "Received",
}
