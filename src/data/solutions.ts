export interface Solution {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  benefits: string[];
  howItWorks: string[];
  featured: boolean;
}

export const SOLUTIONS: Solution[] = [
  {
    id: "s001",
    slug: "residential-solar",
    title: "Residential Solar",
    subtitle: "Reliable power for your home",
    description: "Complete solar energy solutions for homes of all sizes. From a basic backup system to a full off-grid setup, we design systems tailored to your household's exact requirements.",
    icon: "🏠",
    benefits: ["Eliminate generator fuel costs", "24-hour power independence", "Protect sensitive home electronics", "Reduce electricity bills by 60–90%", "25-year panel warranty"],
    howItWorks: ["Site assessment and load analysis", "Custom system design and proposal", "Equipment procurement and quality check", "Professional installation (2–3 days)", "Commissioning and homeowner training"],
    featured: true,
  },
  {
    id: "s002",
    slug: "commercial-solar",
    title: "Commercial Solar",
    subtitle: "Cut energy costs, improve resilience",
    description: "Scalable solar solutions for offices, retail centres, hospitality, healthcare, and industrial facilities. We design systems that optimise your energy economics and ensure operational continuity.",
    icon: "🏢",
    benefits: ["Fast ROI — typically 3–5 years", "Reduce diesel dependency", "Hedge against rising energy costs", "Improve ESG credentials", "Scalable as your business grows"],
    howItWorks: ["Energy audit and financial modelling", "System design and engineering review", "Procurement and project planning", "Installation with minimal disruption", "Commissioning and staff training", "Ongoing monitoring and support"],
    featured: true,
  },
  {
    id: "s003",
    slug: "hybrid-solar-systems",
    title: "Hybrid Solar Systems",
    subtitle: "The best of solar, battery, and grid",
    description: "Hybrid systems intelligently combine solar generation, battery storage, and grid or generator input. Prioritise solar, store surplus energy, and draw from backup sources only when needed.",
    icon: "⚡",
    benefits: ["Automatic power source switching", "Maximise solar self-consumption", "Generator auto-start integration", "Remote monitoring and control", "Expandable battery capacity"],
    howItWorks: ["Load profile analysis", "Hybrid inverter and battery selection", "Solar array sizing", "Professional installation", "System commissioning and optimisation"],
    featured: true,
  },
  {
    id: "s004",
    slug: "battery-storage",
    title: "Battery Storage",
    subtitle: "Store solar. Use it anytime.",
    description: "Add or upgrade battery storage to an existing or new solar system. LiFePO4 lithium batteries offer exceptional cycle life, safety, and usable capacity compared to traditional lead-acid alternatives.",
    icon: "🔋",
    benefits: ["6,000+ charge cycles (LiFePO4)", "Discharge to 90% without degradation", "No maintenance required", "Safe chemistry — no off-gassing", "10-year battery warranty"],
    howItWorks: ["Existing system review", "Battery technology and capacity recommendation", "BMS and inverter compatibility check", "Installation and integration", "Commissioning and monitoring setup"],
    featured: true,
  },
  {
    id: "s005",
    slug: "solar-installation",
    title: "Solar Installation",
    subtitle: "Expert installation by certified engineers",
    description: "Our installation team consists of certified electrical engineers and solar technicians. We handle everything from roof mounting to DC wiring, distribution board work, and final commissioning.",
    icon: "🔧",
    benefits: ["Certified electrical engineers", "Insurance-compliant workmanship", "Manufacturer warranty maintained", "Clean, professional cable management", "12-month installation warranty"],
    howItWorks: ["Pre-installation structural check", "Mounting system installation", "Panel array installation", "DC cabling and protection", "Inverter and battery installation", "AC wiring and distribution", "Testing and commissioning"],
    featured: false,
  },
  {
    id: "s006",
    slug: "energy-management",
    title: "Energy Management",
    subtitle: "Intelligent monitoring and optimisation",
    description: "Real-time energy monitoring, smart load management, and performance analytics for your solar system. Know exactly what your system is producing, consuming, and storing at all times.",
    icon: "📊",
    benefits: ["Real-time production and consumption data", "Mobile app access from anywhere", "Fault detection and alerts", "Monthly performance reports", "Remote system configuration"],
    howItWorks: ["Monitoring hardware installation", "Portal and app setup", "Alert configuration", "Training on dashboard features", "Ongoing support"],
    featured: false,
  },
  {
    id: "s007",
    slug: "solar-maintenance",
    title: "Solar Maintenance",
    subtitle: "Keep your system performing at its best",
    description: "Preventive maintenance, performance monitoring, and professional servicing to ensure your solar investment continues delivering maximum returns year after year.",
    icon: "🛡️",
    benefits: ["Annual professional inspection", "Panel cleaning service", "Battery health monitoring", "Inverter firmware updates", "Priority emergency response"],
    howItWorks: ["Annual system inspection", "Performance analysis and benchmarking", "Panel cleaning and physical inspection", "Electrical connection checks", "Report and recommendations"],
    featured: false,
  },
  {
    id: "s008",
    slug: "inverter-solutions",
    title: "Inverter Solutions",
    subtitle: "Expert selection, supply, and installation",
    description: "From single-phase residential inverters to three-phase commercial systems, we supply and install industry-leading inverters from Victron Energy, SMA, Deye, and Goodwe.",
    icon: "⚙️",
    benefits: ["Brand-agnostic recommendations", "Victron, SMA, Deye, Goodwe supply", "Inverter upgrades and replacements", "Three-phase and single-phase", "Warranty and after-sales support"],
    howItWorks: ["Load and system assessment", "Inverter recommendation and specification", "Supply and delivery", "Professional installation", "Commissioning and handover"],
    featured: false,
  },
];
