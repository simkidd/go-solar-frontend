import { IconType } from "react-icons";
import { BiCart, BiMoney } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { FaProductHunt } from "react-icons/fa6";
import { GiCarDoor } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";

export interface Menu {
  label: string;
  href: string;
  icon: IconType;
  children?: Children[];
}

interface Children {
  label: string;
  href: string;
}

export const sidelist: Menu[] = [
  { label: "Overview", href: "/admin", icon: MdDashboard },
  {
    label: "Products",
    href: "/admin/products",
    icon: FaProductHunt,
    children: [
      // { label: "Add product", href: "/admin/products/create" },
      // { label: "Product list", href: "/admin/products" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Brands", href: "/admin/brands" },
    ],
  },
  { label: "Orders", href: "/admin/orders", icon: BiCart },
  {
    label: "Customers",
    href: "/admin/users",
    icon: BsPeople,
  },
  { label: "Reviews", href: "/admin/reviews", icon: GiCarDoor },
  { label: "Transactions", href: "/admin/transactions", icon: BiMoney },
];
