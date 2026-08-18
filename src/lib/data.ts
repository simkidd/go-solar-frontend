import { Product } from "@/interfaces/product.interface";
import { axiosInstance } from "./axios";

export const FALLBACK_POSTS = [
  {
    _id: "b001",
    slug: "how-to-size-solar-system-nigeria",
    title: "How to Size a Solar System for Your Nigerian Home",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=700&fit=crop&auto=format",
    author: "Emeka Okafor",
    createdAt: "2024-03-15T00:00:00.000Z",
    updatedAt: "2024-03-15T00:00:00.000Z",
    tags: ["Solar Installation", "Buying Guides"],
    content: `Solar energy has become the go-to solution for reliable power in Nigeria, where grid electricity is unreliable and fuel costs are rising. But many homeowners get sizing wrong, resulting in a system that either underperforms or costs far more than necessary.

## Step 1: Calculate Your Daily Load

List every appliance you want to power and note its wattage and daily hours of use. For example:
- Refrigerator: 150W × 24h = 3.6 kWh/day
- Television: 100W × 6h = 0.6 kWh/day
- Lighting (LED): 50W × 8h = 0.4 kWh/day
- Ceiling fans × 4: 200W × 12h = 2.4 kWh/day
- Air conditioner (1.5 ton): 1500W × 8h = 12 kWh/day

A typical 3-bedroom home without air conditioning uses approximately 8–12 kWh/day. With one AC unit, this rises to 20–24 kWh/day.

## Step 2: Size Your Solar Array

Nigeria receives approximately 4.5–6 peak sun hours per day depending on location. To calculate your required panel capacity:

**Panel capacity (kWp) = Daily kWh ÷ Peak sun hours × 1.3 (losses factor)**

For 12 kWh/day in Lagos: 12 ÷ 5.5 × 1.3 = **2.84 kWp** → round up to **3.2 kWp** (8 × 400W panels)

## Step 3: Size Your Battery Storage

For 1 day of autonomy (backup without solar): Battery capacity = Daily kWh ÷ Usable DOD (0.85 for LiFePO4)
For 12 kWh/day: 12 ÷ 0.85 = **14.1 kWh** nominal capacity

For most homes, 1–2 days of autonomy is sufficient. A good starting point for a 12 kWh/day load is 3 × Pylontech US5000 (14.4 kWh total).

## Step 4: Choose Your Inverter

Your inverter should comfortably handle your peak load — all appliances running simultaneously. Always add 20–25% headroom. For a peak load of 4kW: choose a **5kVA inverter**.`
  },
  {
    _id: "b002",
    slug: "lithium-vs-lead-acid-solar-batteries",
    title: "Lithium vs Lead-Acid Solar Batteries: Which Is Right for You?",
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc2107c1?w=1200&h=700&fit=crop&auto=format",
    author: "Fatima Bello",
    createdAt: "2024-02-20T00:00:00.000Z",
    updatedAt: "2024-02-20T00:00:00.000Z",
    tags: ["Batteries", "Buying Guides"],
    content: `The battery choice is one of the most consequential decisions in a solar system. Most customers default to lead-acid batteries because of their lower upfront cost, but when you examine total cost of ownership, lithium iron phosphate (LiFePO4) batteries are often the smarter investment.

## Understanding the Key Metrics

### Cycle Life
- Lead-acid (flooded): 300–500 cycles at 50% DOD
- AGM/VRLA: 500–800 cycles at 50% DOD
- LiFePO4: 3,000–6,000 cycles at 80–90% DOD

A Pylontech US5000 battery guarantees 6,000 cycles at 90% depth of discharge. At one full cycle per day, that's over 16 years of operation.

### Depth of Discharge (DOD)
Lead-acid batteries should only be discharged to 50% to maintain cycle life. This means a 200Ah battery at 48V (9.6 kWh) only yields 4.8 kWh usable.

LiFePO4 batteries can safely discharge to 80–90% DOD, so the same nominal 9.6 kWh yields 8.6 kWh usable.

### Weight and Space
A 10 kWh lead-acid bank may weigh 350–500 kg and require significant floor space. A Pylontech US5000 bank providing the same usable energy weighs under 170 kg.

## Total Cost of Ownership Analysis

For a system requiring 10 kWh usable storage over 10 years:

**Lead-acid path:**
- Initial cost: ₦450,000 for 200Ah × 48V bank
- Replacement at year 3 and year 6: ₦900,000
- Maintenance: ₦60,000 (watering, equalisation)
- **Total: ₦1,410,000**

**LiFePO4 path:**
- Initial cost: ₦1,100,000 for 3 × Pylontech US5000
- No replacement needed within 10 years
- Zero maintenance
- **Total: ₦1,100,000**

LiFePO4 is cheaper over the long run — and that doesn't account for the higher usable capacity and lower efficiency losses.`
  },
  {
    _id: "b003",
    slug: "commercial-solar-roi-guide",
    title: "Commercial Solar ROI: What Nigerian Businesses Need to Know",
    image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1200&h=700&fit=crop&auto=format",
    author: "Chukwudi Eze",
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
    tags: ["Solar Energy", "Renewable Energy"],
    content: `Commercial solar has become one of the highest-return capital investments available to Nigerian businesses. With diesel fuel costs rising and grid electricity becoming increasingly expensive, the payback calculation has never been more compelling.

## Calculating Your Solar ROI

The basic ROI formula for solar is:

**Payback period = System cost ÷ Annual savings**

Annual savings = (kWh/day × 365 × ₦/kWh electricity cost) + (litres of diesel saved × ₦/litre)

A 50kW commercial system producing 225 kWh/day might save:
- Grid electricity: 225 kWh × ₦250 × 365 = ₦20.5 million/year
- Diesel offset: 80 litres/day × ₦1,200 × 365 = ₦35 million/year
- **Total annual savings: ₦55.5 million**

At a system cost of ₦85 million installed, the payback period is **18 months**.`
  },
  {
    _id: "b004",
    slug: "inverter-buyer-guide-2024",
    title: "Inverter Buyer's Guide 2024: Choosing the Right Inverter for Your Solar System",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=700&fit=crop&auto=format",
    author: "Emeka Okafor",
    createdAt: "2024-01-28T00:00:00.000Z",
    updatedAt: "2024-01-28T00:00:00.000Z",
    tags: ["Inverters", "Buying Guides"],
    content: `The inverter is the heart of your solar system. Choosing the wrong one — even with excellent panels and batteries — will result in poor performance, equipment damage, or safety risks. This guide covers everything you need to know.

## Inverter Types Explained

### Modified Sine Wave Inverters
Cheap and widely available, but only suitable for simple resistive loads (basic lighting, phone charging, fans). Will damage motors, variable-speed drives, and sensitive electronics. Avoid for any serious application.

### Pure Sine Wave Inverters
Produces grid-quality AC power suitable for all loads. Required for any system powering air conditioners, computers, medical equipment, or modern appliances.

### Hybrid Inverters
Manages solar panels, batteries, and the grid simultaneously. Automatically prioritises solar energy, charges batteries when surplus is available, draws from grid or generator when needed. This is the recommended type for most installations.`
  },
  {
    _id: "b005",
    slug: "solar-maintenance-guide",
    title: "Solar System Maintenance: What You Need to Do (and What You Don't)",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=700&fit=crop&auto=format",
    author: "Fatima Bello",
    createdAt: "2024-03-01T00:00:00.000Z",
    updatedAt: "2024-03-01T00:00:00.000Z",
    tags: ["Maintenance", "Solar Installation"],
    content: `One of solar energy's biggest advantages is its minimal maintenance requirements. Unlike generators that need regular servicing, oil changes, and fuel, a well-installed solar system mostly takes care of itself. But "mostly" is not "completely" — here's what you should and shouldn't do.

## Monthly Tasks

**Panel Cleaning**: In dusty environments (harmattan season especially), soiling can reduce output by 15–25%. Clean panels with a soft brush or mop and plain water. Do this in the early morning when panels are cool.

**Inverter Status Check**: Most modern inverters have LED indicators or app-based monitoring. Check for any fault codes or warning lights.

**Battery State of Health**: If your system has a Victron or Pylontech battery management system, the SOH (State of Health) reading tells you battery capacity vs new. A 95%+ SOH is healthy.`
  },
  {
    _id: "b006",
    slug: "residential-solar-complete-guide",
    title: "The Complete Guide to Residential Solar in Nigeria (2024)",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=700&fit=crop&auto=format",
    author: "Chukwudi Eze",
    createdAt: "2024-03-20T00:00:00.000Z",
    updatedAt: "2024-03-20T00:00:00.000Z",
    tags: ["Solar Energy", "Solar Installation"],
    content: `Going solar is one of the best decisions a Nigerian homeowner can make in 2024. With fuel prices at record highs and grid reliability declining, the case for solar has never been stronger. This guide walks you through the entire journey.

## Step 1: Assess Your Needs

Before getting quotes, understand your own requirements:
- Which appliances must run at all times? (critical loads)
- Which can be scheduled? (non-critical loads)
- Do you want full off-grid capability or grid-tied backup?
- What is your budget range?`
  }
];

export const getPosts = async () => {
  try {
    const { data } = await axiosInstance.get("/blogs");

    if (data?.blogs && data.blogs.length > 0) {
      return data.blogs;
    }
    return FALLBACK_POSTS;
  } catch (error) {
    console.log(error);
    return FALLBACK_POSTS;
  }
};

export const getPost = async (id: string) => {
  try {
    if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
      const { data } = await axiosInstance.get(`/blogs/${id}`);
      if (data?.blog) {
        return data.blog;
      }
    }
    return FALLBACK_POSTS.find((p) => p._id === id || p.slug === id);
  } catch (error) {
    console.log(error);
    return FALLBACK_POSTS.find((p) => p._id === id || p.slug === id);
  }
};

export const getProducts = async () => {
  try {
    const { data } = await axiosInstance.get("/products");

    return data?.products;
  } catch (error) {
    console.log(error);
  }
};
export const getPubilshedProducts = async () => {
  try {
    const { data } = await axiosInstance.get("/products");

    const publishedProducts = data?.products.filter(
      (product: Product) => product.isPublished
    );

    return publishedProducts;
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);

    return data?.product;
  } catch (error) {
    console.log(error);
  }
};

export const getCategories = async () => {
  try {
    const { data } = await axiosInstance.get("/categories", {
      params: { page: 1, limit: 1000 }
    });

    return data?.categories;
  } catch (error) {
    console.log(error);
  }
};

export const getOrders = async () => {
  try {
    const { data } = await axiosInstance.get("/admin/all-orders");

    return data?.orders;
  } catch (error) {
    console.log(error);
  }
};

export const getOrder = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/users/orders/${id}`);

    return data?.order;
  } catch (error) {
    console.log(error);
  }
};

export const getOffers = async () => {
  try {
    const { data } = await axiosInstance.get("/offers");

    return data?.offers;
  } catch (error) {
    console.error(error);
  }
};
export const getOffer = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/offers/${id}`);

    return data?.offer;
  } catch (error) {
    console.error(error);
  }
};

export const getUserOrders = async () => {
  try {
    const { data } = await axiosInstance.get("/users/orders/user-orders");

    return data?.orders;
  } catch (error) {
    console.log(error);
  }
};
