export interface Menu {
  label: string;
  href: string;
  children?: Children[];
}

interface Children {
  heading: string;
  submenu: Submenu[];
}

interface Submenu {
  label: string;
  href: string;
}

export const navlist: Menu[] = [
  { label: "About Us", href: "/about-us" },
  // { label: "Services", href: "/services" },
  // { label: "Projects", href: "/projects" },
  {
    label: "Our Shop",
    href: "/shop",
    // children: [
    //   {
    //     heading: "Brands",
    //     submenu: [
    //       {
    //         label: "Brand 1",
    //         href: "",
    //       },
    //       {
    //         label: "Brand 2",
    //         href: "",
    //       },
    //     ],
    //   },
    //   {
    //     heading: "Battery",
    //     submenu: [
    //       {
    //         label: "Battery 1",
    //         href: "",
    //       },
    //       {
    //         label: "Battery 2",
    //         href: "",
    //       },
    //     ],
    //   },
    //   {
    //     heading: "Inverters",
    //     submenu: [
    //       {
    //         label: "Inverter 1",
    //         href: "",
    //       },
    //       {
    //         label: "Inverter 2",
    //         href: "",
    //       },
    //     ],
    //   },
    // ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
];

export const shopNavlist: Menu[] = [
  { label: "Our Shop", href: "/shop" },
  { label: "About Us", href: "/about-us" },
  // { label: "Services", href: "/services" },
  // { label: "Projects", href: "/projects" },
  {
    label: "All Products",
    href: "/product",
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
];
