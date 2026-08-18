import { Product } from "./product.interface";

export interface PackageConstituent {
  product: Product;
  qty: number;
}

export interface SolarPackage {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  capacityKva: number;
  batteryType: "Lithium" | "Tubular" | "AGM" | "Gel";
  batteryKwh: number;
  pvKwp: number;
  price: number;
  discountPrice: number;
  inStock: boolean;
  description: string;
  highlights: string[];
  powers: string[];
  constituents: PackageConstituent[];
  createdAt: string;
  updatedAt: string;
}
