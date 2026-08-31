"use client";

import React, { useState, useMemo } from "react";
import {
  Trash2,
  Zap,
  Clock,
  Sun,
  Plus,
  Minus,
  BatteryCharging,
  Package,
  Loader2,
  Home,
  Briefcase,
  Store as StoreIcon,
  Building2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatCurrency } from "@/utils/helpers";
import { calculateSystemSizing } from "@/utils/calculator";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { useCreateQuoteMutation, usePackagesQuery } from "@/hooks";
import { useForm } from "react-hook-form";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import { PackageData } from "@/interfaces/package.interface";

const mapDbPackageToCalculatorPackage = (pkg: any): PackageData => {
  const batteryCapacityWh = (pkg.batteryKwh || 0) * 1000;
  const solarPanelWatts = (pkg.pvKwp || 0) * 1000;

  let batteryType: "AGM" | "Lithium" = "Lithium";
  if (
    pkg.batteryType === "AGM" ||
    pkg.batteryType === "Tubular" ||
    pkg.batteryType === "Gel"
  ) {
    batteryType = "AGM";
  }

  const constituents = (pkg.constituents || []).map((c: any) => {
    const prod = c.product || {};
    let categorySlug = "other";
    if (prod.category?.slug) {
      categorySlug = prod.category.slug;
    } else if (prod.name?.toLowerCase().includes("battery")) {
      categorySlug = "batteries";
    } else if (
      prod.name?.toLowerCase().includes("panel") ||
      prod.name?.toLowerCase().includes("solar")
    ) {
      categorySlug = "solar-panels";
    } else if (prod.name?.toLowerCase().includes("inverter")) {
      categorySlug = "inverters";
    }

    return {
      id: prod._id || c._id,
      name: prod.name || "Component",
      qty: c.qty || 1,
      price: prod.price || 0,
      slug: prod.slug || "",
      categoryName: prod.category?.name || "Component",
      categorySlug: categorySlug,
      imageUrl: prod.images?.[0]?.url || "",
    };
  });

  return {
    id: pkg._id,
    name: pkg.name,
    inverterRange: `${pkg.capacityKva} kVA`,
    desc: pkg.description,
    spec: pkg.tagline || `${pkg.capacityKva}kVA Setup`,
    price: pkg.price,
    slug: pkg.slug,
    badgeColor:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50",
    constituents: constituents,
    batteryCapacityWh,
    solarPanelWatts,
    batteryType,
  };
};

interface Appliance {
  id: string;
  name: string;
  qty: number;
  watts: number;
  hours: number;
}

type PropertyType = "home" | "office" | "shop" | "business" | "other";

interface CalculatorFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
}

const PRESET_APPLIANCES = [
  { name: "Laptop Computer", watts: 65, icon: "💻" },
  { name: 'Television (55")', watts: 120, icon: "📺" },
  { name: "Standing Fan", watts: 75, icon: "🌀" },
  { name: "Refrigerator", watts: 200, icon: "🧊" },
  { name: "Ceiling Fan", watts: 60, icon: "🌀" },
  { name: "Air Conditioner (1.5 HP)", watts: 1200, icon: "❄️" },
  { name: "LED Bulb", watts: 15, icon: "💡" },
  { name: "Microwave Oven", watts: 1200, icon: "📦" },
  { name: "Washing Machine", watts: 500, icon: "🫧" },
  { name: "Water Pump (1HP)", watts: 750, icon: "💧" },
  { name: "Deep Freezer", watts: 300, icon: "🧊" },
  { name: "Phone Charger", watts: 18, icon: "📱" },
];

const STEPS = [
  "Property Type",
  "Appliances",
  "Energy Profile",
  "System Spec",
  "Assessment Report",
];

const EnergyCalculatorClient = () => {
  const [step, setStep] = useState(0);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [items, setItems] = useState<Appliance[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemWatts, setNewItemWatts] = useState("");
  const [newItemHours, setNewItemHours] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CalculatorFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const createQuoteMutation = useCreateQuoteMutation({
    onSuccess: () => {
      reset();
      // Advance to assessment report step
      setStep(4);
    },
  });

  const { data: dbPackages = [] } = usePackagesQuery();

  const calculatorPackages = useMemo(() => {
    return dbPackages.map(mapDbPackageToCalculatorPackage);
  }, [dbPackages]);

  const calculations = useMemo(() => {
    return calculateSystemSizing(items, calculatorPackages);
  }, [items, calculatorPackages]);

  const matchedPackage = calculations.matchedPackage;

  const onSubmit = (values: CalculatorFormValues) => {
    createQuoteMutation.mutate({
      fullName: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      state: "Rivers",
      city: "Port Harcourt",
      address: "Online Sizing Intake",
      dailyKwh: calculations.dailyEnergy / 1000,
      peakWatts: calculations.totalLoad,
      recommendedInverter: calculations.recommendedInverter,
      recommendedBattery: calculations.recommendedBattery,
      recommendedPv: calculations.recommendedPanels,
      appliances: items.map((i) => ({
        name: i.name,
        quantity: i.qty,
        powerWatts: i.watts,
        hoursPerDay: i.hours,
      })),
      status: "New Lead",
      notes: `[Online Energy Sizing] Property Type: ${propertyType || "Residential"}`,
    });
  };

  const handleAddItem = (preset: (typeof PRESET_APPLIANCES)[0]) => {
    const existing = items.find((i) => i.name === preset.name);
    if (existing) {
      setItems((current) =>
        current.map((i) =>
          i.name === preset.name ? { ...i, qty: i.qty + 1 } : i,
        ),
      );
      toast.success(`Increased ${preset.name} quantity to ${existing.qty + 1}`);
      return;
    }

    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: preset.name,
        qty: 1,
        watts: preset.watts,
        hours: 4, // Default run hours
      },
    ]);
    toast.success(`Added ${preset.name} to load list`);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newItemName.trim();
    const watts = Number(newItemWatts);
    const hours = Number(newItemHours);

    if (!name || watts <= 0 || hours <= 0 || hours > 24) {
      toast.error("Please fill in valid custom appliance details");
      return;
    }

    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
        qty: 1,
        watts,
        hours,
      },
    ]);

    setNewItemName("");
    setNewItemWatts("");
    setNewItemHours("");
    toast.success(`Added custom appliance: ${name}`);
  };

  const handleUpdateItem = (
    id: string,
    field: keyof Omit<Appliance, "id" | "name">,
    value: number,
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full font-inter bg-zinc-50/50 dark:bg-zinc-950">
      {/* ── Hero ── */}
      <PageHeader
        badge="Solar Sizing Assistant"
        heading="Solar System Calculator"
        subtitle="Determine your ideal setup in minutes. Tell us about your property, select your daily appliances, and get instant capacity guidelines tailored to your load."
        image="/images/bg/about-us.jpg"
        minHeight="min-h-[380px]"
        align="center"
      />

      {/* ── Steps Indicator ── */}
      <div
        id="calculator-section"
        className="bg-white dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-800"
      >
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (i < step) setStep(i);
                  }}
                  disabled={i > step}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    i === step
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs"
                      : i < step
                        ? "bg-[#08AA08]/10 text-[#08AA08] border-[#08AA08]/20 hover:bg-[#08AA08]/15"
                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
                  }`}
                >
                  <span className="font-mono text-[10px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="w-6 h-px bg-zinc-250 dark:bg-zinc-800" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Wizard Content ── */}
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="min-h-[380px]">
          {/* STEP 0: Property Type */}
          {step === 0 && (
            <div className="space-y-8 animate-in fade-in duration-305">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  What type of property are we solar sizing?
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Selecting a property type allows our design system to
                  reference default calculations based on standard power
                  demands.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {(
                  [
                    { id: "home", label: "Residential", icon: Home },
                    {
                      id: "office",
                      label: "Corporate Office",
                      icon: Briefcase,
                    },
                    { id: "shop", label: "Retail Shop", icon: StoreIcon },
                    { id: "business", label: "Industrial", icon: Building2 },
                    { id: "other", label: "Other", icon: Sparkles },
                  ] as const
                ).map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = propertyType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setPropertyType(type.id)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-center cursor-pointer ${
                        isSelected
                          ? "border-[#08AA08] bg-[#08AA08]/5 dark:bg-[#08AA08]/10 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700"
                      }`}
                    >
                      <IconComponent
                        className={`h-8 w-8 ${
                          isSelected
                            ? "text-[#08AA08]"
                            : "text-zinc-400 dark:text-zinc-650"
                        }`}
                      />
                      <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: Appliances Selection */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-305">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Add Your Daily Appliances
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Choose from our list of standard appliance loads below, or
                  manually construct a custom item.
                </p>
              </div>

              {/* Presets grid */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  Standard Appliance Presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_APPLIANCES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleAddItem(preset)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-xl text-left transition-all text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                    >
                      <span className="text-base leading-none">
                        {preset.icon}
                      </span>
                      <span>{preset.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono ml-1">
                        {preset.watts}W
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Connected Appliances list with Integrated Inline Custom Item Form */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Active Connected Load
                  </p>
                  {items.length > 0 && (
                    <span className="text-xs font-mono font-semibold text-zinc-500">
                      {items.length} {items.length === 1 ? "appliance" : "appliances"}
                    </span>
                  )}
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                  {/* Table Header (Desktop) */}
                  <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3 bg-zinc-50 dark:bg-zinc-800/35 border-b border-zinc-150 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <div className="col-span-4">Appliance Name</div>
                    <div className="col-span-2 text-center">Watts (W)</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-center">Hours/Day</div>
                    <div className="col-span-2 text-right">Energy (kWh)</div>
                  </div>

                  {/* Empty state if no items */}
                  {items.length === 0 && (
                    <div className="py-10 px-5 text-center border-b border-dashed border-zinc-200 dark:border-zinc-800">
                      <p className="text-zinc-500 text-xs">
                        No connected loads added yet. Click standard presets above or use the row below to add custom appliances.
                      </p>
                    </div>
                  )}

                  {/* Existing Items Rows */}
                  {items.length > 0 && (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {items.map((item) => {
                        const itemEnergyKwh =
                          (item.watts * item.qty * item.hours) / 1000;
                        return (
                          <div
                            key={item.id}
                            className="px-5 py-4 sm:py-3.5 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                          >
                            {/* Mobile Layout */}
                            <div className="flex sm:hidden items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                                  {item.name}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                  <div className="flex items-center gap-1 mr-1">
                                    <span className="text-[10px] text-zinc-400 font-bold mr-1">
                                      Qty
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateItem(
                                          item.id,
                                          "qty",
                                          Math.max(1, item.qty - 1),
                                        )
                                      }
                                      className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="w-5 text-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                      {item.qty}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateItem(
                                          item.id,
                                          "qty",
                                          item.qty + 1,
                                        )
                                      }
                                      className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <div className="relative w-18">
                                    <input
                                      type="number"
                                      value={item.watts}
                                      onChange={(e) =>
                                        handleUpdateItem(
                                          item.id,
                                          "watts",
                                          Math.max(1, Number(e.target.value)),
                                        )
                                      }
                                      className="h-7 w-full text-center font-mono text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 pr-4 pl-1 rounded-md focus:outline-none focus:border-[#08AA08]"
                                    />
                                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                                      W
                                    </span>
                                  </div>
                                  <div className="relative w-16">
                                    <input
                                      type="number"
                                      value={item.hours}
                                      min={0.5}
                                      max={24}
                                      step={0.5}
                                      onChange={(e) =>
                                        handleUpdateItem(
                                          item.id,
                                          "hours",
                                          Math.min(
                                            24,
                                            Math.max(
                                              0.1,
                                              Number(e.target.value),
                                            ),
                                          ),
                                        )
                                      }
                                      className="h-7 w-full text-center font-mono text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 pr-4 pl-1 rounded-md focus:outline-none focus:border-[#08AA08]"
                                    />
                                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                                      h
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-lg whitespace-nowrap">
                                    {itemEnergyKwh.toFixed(2)} kWh
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 text-zinc-400 hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-4 flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 truncate">
                                  {item.name}
                                </span>
                              </div>
                              <div className="col-span-2 flex justify-center">
                                <input
                                  type="number"
                                  value={item.watts}
                                  onChange={(e) =>
                                    handleUpdateItem(
                                      item.id,
                                      "watts",
                                      Math.max(1, Number(e.target.value)),
                                    )
                                  }
                                  className="w-20 text-center font-mono text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded-lg focus:outline-none focus:border-[#08AA08]"
                                />
                              </div>
                              <div className="col-span-2 flex justify-center items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      "qty",
                                      Math.max(1, item.qty - 1),
                                    )
                                  }
                                  className="w-6 h-6 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-4 text-center font-mono text-xs font-bold text-zinc-850 dark:text-zinc-200">
                                  {item.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      "qty",
                                      item.qty + 1,
                                    )
                                  }
                                  className="w-6 h-6 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="col-span-2 flex justify-center">
                                <input
                                  type="number"
                                  value={item.hours}
                                  min={0.5}
                                  max={24}
                                  step={0.5}
                                  onChange={(e) =>
                                    handleUpdateItem(
                                      item.id,
                                      "hours",
                                      Math.min(
                                        24,
                                        Math.max(0.1, Number(e.target.value)),
                                      ),
                                    )
                                  }
                                  className="w-16 text-center font-mono text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded-lg focus:outline-none focus:border-[#08AA08]"
                                />
                              </div>
                              <div className="col-span-2 text-right font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                {itemEnergyKwh.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Inline Custom Appliance Add Form (integrated in list) ── */}
                  <form
                    onSubmit={handleAddCustomItem}
                    className="border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-3.5 sm:px-5 sm:py-3"
                  >
                    {/* Desktop Inline Add Row */}
                    <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4 flex items-center gap-2">
                        <Plus className="h-4 w-4 text-[#08AA08] shrink-0" />
                        <Input
                          type="text"
                          placeholder="Custom appliance name..."
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="h-8 text-xs font-medium bg-white dark:bg-zinc-800"
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <div className="relative w-20">
                          <Input
                            type="number"
                            placeholder="Watts"
                            value={newItemWatts}
                            onChange={(e) => setNewItemWatts(e.target.value)}
                            className="h-8 text-center font-mono text-xs pr-4 pl-1 bg-white dark:bg-zinc-800"
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                            W
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-center items-center text-[10px] font-bold text-zinc-400 font-mono uppercase">
                        Qty 1
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <div className="relative w-16">
                          <Input
                            type="number"
                            placeholder="Hours"
                            value={newItemHours}
                            onChange={(e) => setNewItemHours(e.target.value)}
                            className="h-8 text-center font-mono text-xs pr-4 pl-1 bg-white dark:bg-zinc-800"
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                            h
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button
                          type="submit"
                          disabled={!newItemName.trim()}
                          className="h-8 px-3 bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-[11px] rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-xs disabled:opacity-50"
                        >
                          <Plus className="h-3 w-3" /> Add
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Inline Add Row */}
                    <div className="flex sm:hidden flex-col gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <Plus className="h-3.5 w-3.5 text-[#08AA08]" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          Add Custom Appliance
                        </span>
                      </div>
                      <Input
                        type="text"
                        placeholder="Appliance name (e.g. Server Rack)"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="h-9 text-xs bg-white dark:bg-zinc-800"
                      />
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4 relative">
                          <Input
                            type="number"
                            placeholder="Watts"
                            value={newItemWatts}
                            onChange={(e) => setNewItemWatts(e.target.value)}
                            className="h-9 text-xs font-mono pr-4 bg-white dark:bg-zinc-800"
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                            W
                          </span>
                        </div>
                        <div className="col-span-4 relative">
                          <Input
                            type="number"
                            placeholder="Hours"
                            value={newItemHours}
                            onChange={(e) => setNewItemHours(e.target.value)}
                            className="h-9 text-xs font-mono pr-4 bg-white dark:bg-zinc-800"
                          />
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                            h
                          </span>
                        </div>
                        <div className="col-span-4">
                          <Button
                            type="submit"
                            disabled={!newItemName.trim()}
                            className="w-full h-9 bg-[#08AA08] hover:bg-[#079907] text-white font-bold text-xs rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Totals panel (Desktop) */}
                  {items.length > 0 && (
                    <>
                      <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3.5 bg-[#08AA08]/5 dark:bg-[#08AA08]/10 text-xs font-bold text-zinc-800 dark:text-zinc-200 border-t border-zinc-150 dark:border-zinc-800">
                        <div className="col-span-4 text-[#08AA08] font-bold">
                          Accumulated Totals
                        </div>
                        <div className="col-span-2 text-center font-mono text-[#08AA08]">
                          {(calculations.totalLoad / 1000).toFixed(2)} kW
                        </div>
                        <div className="col-span-4" />
                        <div className="col-span-2 text-right font-mono text-[#08AA08]">
                          {(calculations.dailyEnergy / 1000).toFixed(2)} kWh
                        </div>
                      </div>
                      {/* Totals panel (Mobile) */}
                      <div className="flex sm:hidden flex-col gap-2 px-5 py-3.5 bg-[#08AA08]/5 dark:bg-[#08AA08]/10 text-xs font-bold text-zinc-800 dark:text-zinc-200 border-t border-zinc-150 dark:border-zinc-800">
                        <div className="flex justify-between items-center">
                          <span className="text-[#08AA08]">
                            Accumulated Peak Load
                          </span>
                          <span className="font-mono text-[#08AA08]">
                            {(calculations.totalLoad / 1000).toFixed(2)} kW
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#08AA08]">
                            Accumulated Daily Energy
                          </span>
                          <span className="font-mono text-[#08AA08]">
                            {(calculations.dailyEnergy / 1000).toFixed(2)} kWh
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Energy Profile & Distribution */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-305">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Your Energy Usage Profile
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Here is the load analysis generated from your active
                  appliances list.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    label: "Peak Load",
                    value: `${(calculations.totalLoad / 1000).toFixed(2)} kW`,
                    desc: "Connected hardware demand",
                  },
                  {
                    label: "Daily Energy",
                    value: `${(calculations.dailyEnergy / 1000).toFixed(2)} kWh`,
                    desc: "Estimated consumption per day",
                  },
                  {
                    label: "Monthly Energy",
                    value: `${((calculations.dailyEnergy * 30) / 1000).toFixed(0)} kWh`,
                    desc: "Estimated consumption per month",
                  },
                  {
                    label: "Total Appliances",
                    value: `${items.reduce((sum, item) => sum + item.qty, 0)} units`,
                    desc: `${items.length} different appliance types`,
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-5 text-center shadow-xs"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-550">
                      {kpi.label}
                    </p>
                    <p className="text-2xl font-black text-[#08AA08] mt-2 tracking-tight">
                      {kpi.value}
                    </p>
                    <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1 leading-normal">
                      {kpi.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Load distribution */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-4">
                  Load Capacity Distribution
                </h3>
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemDaily = item.watts * item.qty * item.hours;
                    const percentage =
                      calculations.dailyEnergy > 0
                        ? (itemDaily / calculations.dailyEnergy) * 100
                        : 0;

                    return (
                      <div key={item.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-zinc-700 dark:text-zinc-300">
                            {item.name}{" "}
                            <span className="text-zinc-400 dark:text-zinc-550 font-normal">
                              x{item.qty}
                            </span>
                          </span>
                          <span className="text-zinc-900 dark:text-white font-mono">
                            {(itemDaily / 1000).toFixed(2)} kWh (
                            {percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-850 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#08AA08] h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Recommended Specs */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-305">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Recommended System Specs
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Based on a calculated peak solar hour guideline, these system
                  components satisfy your design load sizing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3.5 shadow-xs">
                  <div className="h-12 w-12 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center mx-auto">
                    <Zap className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Inverter Rating
                    </p>
                    <p className="text-2xl font-black text-zinc-850 dark:text-white mt-1">
                      {calculations.recommendedInverter !== "—"
                        ? `${calculations.recommendedInverter} Hybrid`
                        : "Custom Inverter Sizing"}
                    </p>
                    <p className="text-xs text-zinc-450 dark:text-zinc-400 mt-2 leading-relaxed">
                      Hybrid pure sine wave inverter to manage reactive startup
                      currents.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3.5 shadow-xs">
                  <div className="h-12 w-12 rounded-full bg-yellow-50 dark:bg-yellow-950/20 flex items-center justify-center mx-auto">
                    <Sun className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      PV Array Capacity
                    </p>
                    <p className="text-2xl font-black text-zinc-850 dark:text-white mt-1">
                      {calculations.recommendedPanels !== "—"
                        ? calculations.recommendedPanels
                        : "Custom PV Sizing"}
                    </p>
                    <p className="text-xs text-zinc-450 dark:text-zinc-400 mt-2 leading-relaxed">
                      Tier-1 high efficiency panels oriented for maximum solar
                      radiation.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3.5 shadow-xs">
                  <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center mx-auto">
                    <BatteryCharging className="h-6 w-6 text-indigo-550" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Battery Storage
                    </p>
                    <p className="text-2xl font-black text-zinc-850 dark:text-white mt-1">
                      {calculations.recommendedBattery !== "—"
                        ? calculations.recommendedBattery
                        : "Custom Battery Sizing"}
                    </p>
                    <p className="text-xs text-zinc-450 dark:text-zinc-400 mt-2 leading-relaxed">
                      Lithium energy bank designed for high depth of discharge
                      cycles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#08AA08]/5 dark:bg-[#08AA08]/10 border border-[#08AA08]/20 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-center">
                <div className="h-10 w-10 rounded-xl bg-[#08AA08]/15 text-[#08AA08] flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                    Future Load Capacity Margin
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
                    We added a <strong>50% design allowance</strong> to protect
                    your solar battery and inverter from instant trip overloads,
                    ensuring continuous power output.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Results & Custom Quote */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in duration-305 max-w-3xl mx-auto">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Assessment Sizing Completed
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Your customized Assessment Sizing profile is complete. Find
                  matched package information below.
                </p>
              </div>

              <div className="space-y-6">
                {/* Specs Sheet */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white mb-4">
                    Sizing Specifications Sheet
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 text-sm font-semibold">
                    {[
                      {
                        label: "Property Type",
                        value: propertyType
                          ? propertyType.charAt(0).toUpperCase() +
                            propertyType.slice(1)
                          : "General",
                      },
                      {
                        label: "Appliances Monitored",
                        value: `${items.length} items`,
                      },
                      {
                        label: "Total Peak connected Load",
                        value: `${(calculations.totalLoad / 1000).toFixed(2)} kW`,
                      },
                      {
                        label: "Daily Energy Requirement",
                        value: `${(calculations.dailyEnergy / 1000).toFixed(2)} kWh`,
                      },
                      {
                        label: "Adjusted Design Load Capacity",
                        value: `${(calculations.designLoad / 1000).toFixed(2)} kW`,
                      },
                      {
                        label: "Matched Inverter Capacity",
                        value: calculations.recommendedInverter,
                      },
                      {
                        label: "Matched Battery Capacity",
                        value: calculations.recommendedBattery,
                      },
                      {
                        label: "Matched Solar Array PV",
                        value: calculations.recommendedPanels,
                      },
                      {
                        label: "Est. Battery Backup hours",
                        value: `${calculations.backupHours} hrs`,
                      },
                      {
                        label: "Est. Solar Recharge time",
                        value: `${calculations.chargeTimeHours} hrs`,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-zinc-800/80"
                      >
                        <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                          {row.label}
                        </span>
                        <span className="text-zinc-900 dark:text-white font-mono text-xs font-bold text-right">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matched setup */}
                {matchedPackage ? (
                  <div className="border border-emerald-100 dark:border-emerald-900/40 bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-900 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${matchedPackage.badgeColor}`}
                      >
                        Recommended Package Sized
                      </span>
                      <span className="text-2xl font-black text-[#08AA08]">
                        {formatCurrency(matchedPackage.price, "NGN")}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-zinc-900 dark:text-white">
                        {matchedPackage.name}
                      </h4>
                      <p className="text-xs text-zinc-505 mt-1 leading-relaxed">
                        {matchedPackage.desc}
                      </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Link
                        href={`/packages/${matchedPackage.slug}`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl font-bold text-xs uppercase tracking-wider h-11">
                          View Sized Package Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="border border-amber-100 dark:border-amber-900/40 bg-amber-50/25 dark:bg-amber-950/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                        Custom Component Assembly Required
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
                        Your sizing requirement is highly customized and exceeds
                        our standard packages. Our certified Port Harcourt
                        installation engineers will design a custom inverter,
                        battery capacity, and solar array specifically for this
                        load outline.
                      </p>
                    </div>
                  </div>
                )}

                {/* Quote Request Form */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                      Request Installation Quote
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      Submit your requirements and load list to receive a
                      tailored quotation covering equipment and installation.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 pt-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          {...register("fullName", {
                            required: "Name is required",
                          })}
                          className="h-10 text-xs font-medium"
                        />
                        {errors.fullName && (
                          <p className="text-[10px] text-red-500 font-semibold">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                          Phone Number *
                        </label>
                        <Input
                          type="tel"
                          placeholder="080 1234 5678"
                          {...register("phoneNumber", {
                            required: "Phone number is required",
                          })}
                          className="h-10 text-xs font-medium"
                        />
                        {errors.phoneNumber && (
                          <p className="text-[10px] text-red-500 font-semibold">
                            {errors.phoneNumber.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          placeholder="johndoe@email.com"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Invalid email format",
                            },
                          })}
                          className="h-10 text-xs font-medium"
                        />
                        {errors.email && (
                          <p className="text-[10px] text-red-500 font-semibold">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={createQuoteMutation.isPending}
                      className="w-full h-10 mt-3 text-xs font-bold bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl shadow-xs flex items-center justify-center gap-2"
                    >
                      {createQuoteMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting Sizing...
                        </>
                      ) : (
                        "Request Sizing Quote"
                      )}
                    </Button>
                  </form>

                  <div className="pt-3 border-t border-zinc-150 dark:border-zinc-800 text-center">
                    <button
                      onClick={() => {
                        setStep(0);
                        setPropertyType(null);
                        setItems([]);
                      }}
                      className="text-xs text-zinc-400 hover:text-zinc-700 font-bold uppercase tracking-wider transition-colors"
                    >
                      Restart Sizing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Wizard Foot Navigation ── */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-150 dark:border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="h-10 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              ← Back
            </Button>
            <span className="text-xs text-zinc-400 font-semibold font-mono">
              Step {step + 1} of {STEPS.length}
            </span>
            <Button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              disabled={
                (step === 0 && !propertyType) ||
                (step === 1 && items.length === 0)
              }
              className="h-10 text-xs bg-[#08AA08] hover:bg-[#08AA08]/90 text-white rounded-xl px-5"
            >
              Continue →
            </Button>
          </div>
        )}
      </section>

      <FaqNewsletterSection />
    </div>
  );
};

export default EnergyCalculatorClient;
