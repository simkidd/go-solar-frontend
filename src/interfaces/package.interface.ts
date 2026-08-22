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

export interface PackageComponent {
  id: string;
  name: string;
  qty: number;
  price: number;
  slug: string;
  categoryName: string;
  categorySlug: string;
  imageUrl: string;
}

export interface PackageData {
  id: string;
  name: string;
  inverterRange: string;
  desc: string;
  spec: string;
  price: number;
  slug: string;
  badgeColor: string;
  constituents: PackageComponent[];
  batteryCapacityWh: number;
  solarPanelWatts: number;
  batteryType: "AGM" | "Lithium";
}
