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
  // Technical sizing data — used by the calculation engine
  batteryCapacityWh: number;  // Total usable battery bank capacity in Wh
  solarPanelWatts: number;    // Total solar array power in W
  batteryType: "AGM" | "Lithium"; // Chemistry determines DoD limit
}

export const PACKAGES_DATA: PackageData[] = [
  {
    id: "pkg-15",
    name: "GoSolar Starter Setup",
    inverterRange: "1.5 kVA",
    desc: "Affordable entry-level solar package for apartments, students, and basic electronic workstations.",
    spec: "1.5kVA Hybrid Inverter + 2.4kWh AGM Battery + 2x 400W High Efficiency Panels",
    price: 950000,
    slug: "gosolar-starter-setup",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50",
    constituents: [
      {
        id: "comp-inv-15",
        name: "1.5kVA Hybrid Inverter",
        qty: 1,
        price: 300000,
        slug: "1-5kva-hybrid-inverter",
        categoryName: "Inverters",
        categorySlug: "inverters",
        imageUrl: "/images/products/inverter.png",
      },
      {
        id: "comp-bat-12-agm",
        name: "1.2kWh AGM Battery (12V 100Ah)",
        qty: 2,
        price: 200000,
        slug: "1-2kwh-agm-battery",
        categoryName: "Batteries",
        categorySlug: "batteries",
        imageUrl: "/images/products/battery.png",
      },
      {
        id: "comp-pan-400w",
        name: "400W High Efficiency Mono Solar Panel",
        qty: 2,
        price: 125000,
        slug: "400w-mono-panel",
        categoryName: "Solar Panels",
        categorySlug: "solar-panels",
        imageUrl: "/images/products/panels.png",
      },
    ],
    batteryCapacityWh: 2400,
    solarPanelWatts: 800,
    batteryType: "AGM",
  },
  {
    id: "pkg-25",
    name: "GoSolar Basic Setup",
    inverterRange: "2.5 kVA",
    desc: "Optimized backup load configuration for working professionals needing lighting, fans, and work stations.",
    spec: "2.5kVA Hybrid Inverter + 2.4kWh Lithium Battery + 4x 400W Monocrystalline Panels",
    price: 1800000,
    slug: "gosolar-basic-setup",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/50",
    constituents: [
      {
        id: "comp-inv-25",
        name: "2.5kVA Hybrid Inverter",
        qty: 1,
        price: 450000,
        slug: "2-5kva-hybrid-inverter",
        categoryName: "Inverters",
        categorySlug: "inverters",
        imageUrl: "/images/products/inverter.png",
      },
      {
        id: "comp-bat-24-lit",
        name: "2.4kWh Lithium Battery (24V 100Ah)",
        qty: 1,
        price: 850000,
        slug: "2-4kwh-lithium-battery",
        categoryName: "Batteries",
        categorySlug: "batteries",
        imageUrl: "/images/products/battery.png",
      },
      {
        id: "comp-pan-400w",
        name: "400W High Efficiency Mono Solar Panel",
        qty: 4,
        price: 125000,
        slug: "400w-mono-panel",
        categoryName: "Solar Panels",
        categorySlug: "solar-panels",
        imageUrl: "/images/products/panels.png",
      },
    ],
    batteryCapacityWh: 2400,
    solarPanelWatts: 1600,
    batteryType: "Lithium",
  },
  {
    id: "pkg-35",
    name: "GoSolar Standard Setup",
    inverterRange: "3.5 kVA",
    desc: "Reliable power configuration designed for small duplexes, powering lighting, media, and refrigerators.",
    spec: "3.5kVA Hybrid Inverter + 4.8kWh AGM Battery Wall + 4x 550W Tier-1 Panels",
    price: 2400000,
    slug: "gosolar-standard-setup",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
    constituents: [
      {
        id: "comp-inv-35",
        name: "3.5kVA Hybrid Inverter",
        qty: 1,
        price: 550000,
        slug: "3-5kva-hybrid-inverter",
        categoryName: "Inverters",
        categorySlug: "inverters",
        imageUrl: "/images/products/inverter.png",
      },
      {
        id: "comp-bat-48-agm",
        name: "4.8kWh AGM Battery Bank",
        qty: 1,
        price: 1150000,
        slug: "4-8kwh-agm-battery-bank",
        categoryName: "Batteries",
        categorySlug: "batteries",
        imageUrl: "/images/products/battery.png",
      },
      {
        id: "comp-pan-550w",
        name: "550W Monocrystalline Solar Panel",
        qty: 4,
        price: 175000,
        slug: "550w-mono-panel",
        categoryName: "Solar Panels",
        categorySlug: "solar-panels",
        imageUrl: "/images/products/panels.png",
      },
    ],
    batteryCapacityWh: 4800,
    solarPanelWatts: 2200,
    batteryType: "AGM",
  },
  {
    id: "pkg-50",
    name: "GoSolar Deluxe Setup",
    inverterRange: "5 kVA",
    desc: "Our most popular home setup. Powers deep freezer, media center, lighting, and fans comfortably.",
    spec: "5kVA Hybrid Inverter + 5.0kWh Lithium Wall Mount + 6x 550W Tier-1 Panels",
    price: 3850000,
    slug: "gosolar-deluxe-setup",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-teal-400 dark:border-teal-900/50",
    constituents: [
      {
        id: "comp-inv-50",
        name: "5kVA Hybrid Inverter",
        qty: 1,
        price: 750000,
        slug: "5kva-hybrid-inverter",
        categoryName: "Inverters",
        categorySlug: "inverters",
        imageUrl: "/images/products/inverter.png",
      },
      {
        id: "comp-bat-48-lit-50",
        name: "5.0kWh Lithium Storage Wall Mount",
        qty: 1,
        price: 2050000,
        slug: "5kwh-lithium-wall-mount",
        categoryName: "Batteries",
        categorySlug: "batteries",
        imageUrl: "/images/products/battery.png",
      },
      {
        id: "comp-pan-550w",
        name: "550W Monocrystalline Solar Panel",
        qty: 6,
        price: 175000,
        slug: "550w-mono-panel",
        categoryName: "Solar Panels",
        categorySlug: "solar-panels",
        imageUrl: "/images/products/panels.png",
      },
    ],
    batteryCapacityWh: 5000,
    solarPanelWatts: 3300,
    batteryType: "Lithium",
  },
  {
    id: "pkg-75",
    name: "GoSolar Premium Setup",
    inverterRange: "7.5 kVA",
    desc: "Great for larger households needing reliable daily backup for electronics and energy-saving cooling systems.",
    spec: "7.5kVA Hybrid Inverter + 10.0kWh Lithium Wall Mount + 8x 550W Monocrystalline Panels",
    price: 5200000,
    slug: "gosolar-premium-setup",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
    constituents: [
      {
        id: "comp-inv-75",
        name: "7.5kVA Hybrid Inverter",
        qty: 1,
        price: 1100000,
        slug: "7-5kva-hybrid-inverter",
        categoryName: "Inverters",
        categorySlug: "inverters",
        imageUrl: "/images/products/inverter.png",
      },
      {
        id: "comp-bat-48-lit-50",
        name: "5.0kWh Lithium Storage Wall Mount",
        qty: 2,
        price: 1350000,
        slug: "5kwh-lithium-wall-mount",
        categoryName: "Batteries",
        categorySlug: "batteries",
        imageUrl: "/images/products/battery.png",
      },
      {
        id: "comp-pan-550w",
        name: "550W Monocrystalline Solar Panel",
        qty: 8,
        price: 175000,
        slug: "550w-mono-panel",
        categoryName: "Solar Panels",
        categorySlug: "solar-panels",
        imageUrl: "/images/products/panels.png",
      },
    ],
    batteryCapacityWh: 10000,
    solarPanelWatts: 4400,
    batteryType: "Lithium",
  },
  {
    id: "pkg-100",
    name: "GoSolar Elite Setup",
    inverterRange: "10 kVA",
    desc: "Heavy residential and commercial load coverage including multiple air conditioners and workspace machinery.",
    spec: "10kVA Hybrid Inverter + 15.0kWh Lithium Wall Mount + 12x 550W Tier-1 Panels",
    price: 7500000,
    slug: "gosolar-elite-setup",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
    constituents: [
      {
        id: "comp-inv-100",
        name: "10kVA Hybrid Inverter",
        qty: 1,
        price: 1800000,
        slug: "10kva-hybrid-inverter",
        categoryName: "Inverters",
        categorySlug: "inverters",
        imageUrl: "/images/products/inverter.png",
      },
      {
        id: "comp-bat-48-lit-50",
        name: "5.0kWh Lithium Storage Wall Mount",
        qty: 3,
        price: 1200000,
        slug: "5kwh-lithium-wall-mount",
        categoryName: "Batteries",
        categorySlug: "batteries",
        imageUrl: "/images/products/battery.png",
      },
      {
        id: "comp-pan-550w",
        name: "550W Monocrystalline Solar Panel",
        qty: 12,
        price: 175000,
        slug: "550w-mono-panel",
        categoryName: "Solar Panels",
        categorySlug: "solar-panels",
        imageUrl: "/images/products/panels.png",
      },
    ],
    batteryCapacityWh: 15000,
    solarPanelWatts: 6600,
    batteryType: "Lithium",
  },
];
