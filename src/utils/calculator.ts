import { PACKAGES_DATA, PackageData } from "@/data/packages";

export interface SizingAppliance {
  id: string;
  name: string;
  qty: number;
  watts: number;
  hours: number;
}

export interface SizingResults {
  totalLoad: number; // W - connected load
  dailyEnergy: number; // Wh - daily energy consumption

  safetyMargin: number; // W - additional load from safety margin
  designLoad: number; // W - load after safety margin

  recommendedInverter: string;
  recommendedBattery: string;
  recommendedPanels: string;

  matchedPackage: PackageData | undefined;

  backupHours: number;
  chargeTimeHours: number;
}

/**
 * Calculator configuration.
 *
 * These values can later be moved to admin/database configuration.
 */
const CALCULATOR_CONFIG = {
  safetyMarginPercent: 50,

  // Used to estimate how long the matched battery can power
  // the calculated load.
  inverterEfficiency: 0.9,

  // Conservative usable battery depth.
  batteryDoD: {
    AGM: 0.5,
    Lithium: 0.8,
  },

  // Estimated effective daily solar hours.
  peakSunHours: 4.5,

  // Solar system derating.
  solarEfficiency: 0.85,
};

/**
 * Extracts the numeric inverter capacity from values such as:
 *
 * "1.5 kVA" → 1.5
 * "5 kVA"   → 5
 * "7.5 kVA" → 7.5
 */
const getInverterKva = (inverterRange: string): number => {
  return Number.parseFloat(inverterRange);
};

/**
 * Calculates the total battery capacity contained in a package.
 */
const getPackageBatteryCapacity = (pkg: PackageData): number => {
  return pkg.batteryCapacityWh;
};

/**
 * Calculates the total solar panel capacity contained in a package.
 */
const getPackageSolarCapacity = (pkg: PackageData): number => {
  return pkg.solarPanelWatts;
};

/**
 * Returns a human-readable battery description.
 */
const getBatteryDescription = (pkg: PackageData): string => {
  const batteryComponent = pkg.constituents.find(
    (component) => component.categorySlug === "batteries",
  );

  if (!batteryComponent) return "—";

  return `${batteryComponent.qty}x ${batteryComponent.name}`;
};

/**
 * Returns a human-readable solar panel description.
 */
const getPanelDescription = (pkg: PackageData): string => {
  const panelComponent = pkg.constituents.find(
    (component) => component.categorySlug === "solar-panels",
  );

  if (!panelComponent) return "—";

  return `${panelComponent.qty}x ${panelComponent.name}`;
};

/**
 * Calculates system sizing based on connected appliances
 * and recommends the smallest solar package capable of
 * satisfying the calculated requirements.
 */
export const calculateSystemSizing = (
  items: SizingAppliance[],
): SizingResults => {
  // ─────────────────────────────────────────────────────────────
  // STEP 1: Calculate connected load and daily energy
  // ─────────────────────────────────────────────────────────────

  const totalLoad = items.reduce(
    (total, item) => total + item.watts * item.qty,
    0,
  );

  const dailyEnergy = items.reduce(
    (total, item) => total + item.watts * item.qty * item.hours,
    0,
  );

  // ─────────────────────────────────────────────────────────────
  // STEP 2: Calculate safety margin
  // ─────────────────────────────────────────────────────────────

  // Example:
  //
  // Load = 2,000 W
  // Margin = 50%
  //
  // 50% of 2,000 = 1,000 W
  //
  // Design load:
  // 2,000 + 1,000 = 3,000 W
  //
  const safetyMargin =
    totalLoad * (CALCULATOR_CONFIG.safetyMarginPercent / 100);

  const designLoad = totalLoad + safetyMargin;

  // ─────────────────────────────────────────────────────────────
  // STEP 3: Determine required inverter
  // ─────────────────────────────────────────────────────────────

  // Required inverter capacity in kVA.
  //
  // For the current calculator we use the design load directly.
  // Package selection will find the smallest inverter >= this load.
  //
  const requiredInverterKw = designLoad / 1000;

  // ─────────────────────────────────────────────────────────────
  // STEP 4: Estimate battery requirement
  // ─────────────────────────────────────────────────────────────

  // We estimate the battery required to cover approximately
  // one full day's calculated energy.
  //
  // This is a package-selection estimate, not a guarantee of
  // 24-hour backup.
  //
  const requiredBatteryWh =
    dailyEnergy /
    CALCULATOR_CONFIG.inverterEfficiency /
    CALCULATOR_CONFIG.batteryDoD.Lithium;

  // ─────────────────────────────────────────────────────────────
  // STEP 5: Estimate solar requirement
  // ─────────────────────────────────────────────────────────────

  const requiredSolarWh = dailyEnergy / CALCULATOR_CONFIG.solarEfficiency;

  const requiredSolarWatts = requiredSolarWh / CALCULATOR_CONFIG.peakSunHours;

  // ─────────────────────────────────────────────────────────────
  // STEP 6: Filter packages
  // ─────────────────────────────────────────────────────────────

  const suitablePackages = PACKAGES_DATA.filter((pkg) => {
    const inverterKva = getInverterKva(pkg.inverterRange);

    const inverterWatts = inverterKva * 1000;

    const batteryWh = getPackageBatteryCapacity(pkg);

    const solarWatts = getPackageSolarCapacity(pkg);

    const inverterIsEnough = inverterWatts >= designLoad;

    const batteryIsEnough = batteryWh >= requiredBatteryWh;

    const solarIsEnough = solarWatts >= requiredSolarWatts;

    return inverterIsEnough && batteryIsEnough && solarIsEnough;
  })
    // Smallest suitable package first
    .sort((a, b) => {
      return getInverterKva(a.inverterRange) - getInverterKva(b.inverterRange);
    });

  // ─────────────────────────────────────────────────────────────
  // STEP 7: Select recommended package
  // ─────────────────────────────────────────────────────────────

  const matchedPackage = suitablePackages[0];

  // ─────────────────────────────────────────────────────────────
  // STEP 8: Derive package specifications
  // ─────────────────────────────────────────────────────────────

  const recommendedInverter = matchedPackage?.inverterRange ?? "—";

  const recommendedBattery = matchedPackage
    ? getBatteryDescription(matchedPackage)
    : "—";

  const recommendedPanels = matchedPackage
    ? getPanelDescription(matchedPackage)
    : "—";

  // ─────────────────────────────────────────────────────────────
  // STEP 9: Estimate backup time
  // ─────────────────────────────────────────────────────────────

  let backupHours = 0;

  if (matchedPackage && totalLoad > 0) {
    const batteryCapacity = matchedPackage.batteryCapacityWh;

    const dod = CALCULATOR_CONFIG.batteryDoD[matchedPackage.batteryType];

    const usableBatteryEnergy =
      batteryCapacity * dod * CALCULATOR_CONFIG.inverterEfficiency;

    backupHours = usableBatteryEnergy / totalLoad;
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 10: Estimate solar charging time
  // ─────────────────────────────────────────────────────────────

  let chargeTimeHours = 0;

  if (matchedPackage) {
    const solarWatts = matchedPackage.solarPanelWatts;

    const batteryCapacity = matchedPackage.batteryCapacityWh;

    if (solarWatts > 0) {
      chargeTimeHours =
        batteryCapacity / (solarWatts * CALCULATOR_CONFIG.solarEfficiency);
    }
  }

  return {
    totalLoad,
    dailyEnergy,

    safetyMargin,
    designLoad,

    recommendedInverter,
    recommendedBattery,
    recommendedPanels,

    matchedPackage,

    backupHours: Number(backupHours.toFixed(1)),

    chargeTimeHours: Number(chargeTimeHours.toFixed(1)),
  };
};
