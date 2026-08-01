"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Trash2,
  Zap,
  CloudLightning,
  Clock,
  Sun,
  Plus,
  Minus,
  BatteryCharging,
  ChevronRight,
  ListPlus,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/assets/gosolar-logo-icon.svg";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import { formatCurrency } from "@/utils/helpers";
import { calculateSystemSizing } from "@/utils/calculator";
import { toast } from "sonner";

interface Appliance {
  id: string;
  name: string;
  qty: number;
  watts: number;
  hours: number;
}

const PRESET_APPLIANCES = [
  { name: "Laptop", watts: 65, hours: 6 },
  { name: "LED TV", watts: 100, hours: 5 },
  { name: "Standing Fan", watts: 75, hours: 8 },
  { name: "Refrigerator", watts: 200, hours: 24 },
  { name: "Ceiling Fan", watts: 60, hours: 10 },
  { name: "Air Conditioner (1.5 HP)", watts: 1200, hours: 4 },
  { name: "LED Bulb", watts: 15, hours: 6 },
  { name: "Microwave", watts: 800, hours: 0.5 },
  { name: "Washing Machine", watts: 500, hours: 1 },
  { name: "Water Pump", watts: 750, hours: 2 },
  { name: "Deep Freezer", watts: 300, hours: 24 },
  { name: "Phone Charger", watts: 18, hours: 3 },
];

const STEPS = [
  {
    step: "01",
    title: "Add Your Appliances",
    desc: "Search and add the appliances you use daily. Use presets for standard wattages.",
    icon: ListPlus,
  },
  {
    step: "02",
    title: "Set Quantity & Hours",
    desc: "Specify how many units and how many hours each appliance runs per day.",
    icon: Clock,
  },
  {
    step: "03",
    title: "View Energy Demand",
    desc: "See your total power demand and daily energy consumption update in real-time.",
    icon: Zap,
  },
  {
    step: "04",
    title: "Get Your Solar Match",
    desc: "Receive inverter, battery, and panel recommendations sized to your load.",
    icon: Package,
  },
];

const SolarCalculatorPage = () => {
  const [items, setItems] = useState<Appliance[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemWatts, setNewItemWatts] = useState("");
  const [newItemHours, setNewItemHours] = useState("");
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Quote request received!", {
      description: `Our Port Harcourt team will prepare a full installation quotation and send it to ${userEmail} within 24 hours.`,
    });

    setIsSubmitting(false);
    setShowQuoteDialog(false);
    setUserEmail("");
    setUserName("");
    setUserPhone("");
  };

  const filteredPresets = useMemo(() => {
    if (!newItemName.trim()) return PRESET_APPLIANCES;
    return PRESET_APPLIANCES.filter((p) =>
      p.name.toLowerCase().includes(newItemName.toLowerCase()),
    );
  }, [newItemName]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    const name = newItemName.trim();
    if (!name) return;

    const qty = Math.max(1, Number(newItemQty) || 1);
    const watts = Math.max(1, Number(newItemWatts) || 60);
    const hours = Math.min(24, Math.max(0.1, Number(newItemHours) || 4));

    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
        qty,
        watts,
        hours,
      },
    ]);

    setNewItemName("");
    setNewItemQty("1");
    setNewItemWatts("");
    setNewItemHours("");
    setShowPresetsDropdown(false);
  };

  const handleUpdateItem = (
    id: string,
    field: keyof Omit<Appliance, "id" | "name">,
    value: number,
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const calculations = useMemo(() => calculateSystemSizing(items), [items]);
  const matchedPackage = calculations.matchedPackage;
  const hasItems = items.length > 0;

  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="w-full relative bg-zinc-950 min-h-[420px] md:min-h-[460px] flex flex-col justify-center items-center text-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-35"
          style={{ backgroundImage: "url('/images/bg/about-us.jpg')" }}
        />
        <div className="absolute inset-0 z-10 bg-linear-to-b from-[#064e3b]/80 via-[#064e3b]/70 to-black/90" />
        <div className="relative z-20 max-w-3xl px-6 md:px-12 py-16 space-y-6 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border bg-white/10 backdrop-blur-sm border-white/20 text-white/90">
            <Zap className="h-3 w-3 text-[#08AA08]" /> Solar Sizing Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white tracking-tight">
            Calculate your load &<br />
            <span className="text-[#08AA08]">size your solar system</span>
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Enter your appliances and daily usage. Our engineering-grade load
            calculator will instantly size your inverter, battery bank, and
            solar array.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("calculator-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#08AA08] hover:bg-[#079907] text-white shadow-lg hover:scale-105 transition-all duration-200"
          >
            Start Calculating <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* ── Step Guide ───────────────────────────────────────────────── */}
      <section className="w-full py-16 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
                Usage Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                How to use the Solar Calculator
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STEPS.map((s) => (
                <div
                  key={s.step}
                  className="relative flex flex-col gap-4 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-[#08AA08]/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-[#08AA08]/10 text-[#08AA08]">
                      <s.icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-3xl font-black text-zinc-100 dark:text-zinc-800 select-none">
                      {s.step}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-white">
                      {s.title}
                    </h5>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Calculator ────────────────────────────────────────────────── */}
      <section
        id="calculator-section"
        className="w-full py-16 bg-zinc-50/60 dark:bg-zinc-900/10"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── Left: Appliance List ── */}
            <div className="lg:col-span-8 space-y-5">
              {/* List Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-xs overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                      Connected Load List
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Add each appliance you want to power
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Column Headers */}
                {hasItems && (
                  <div className="grid grid-cols-12 gap-2 px-6 py-2.5 bg-zinc-50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Appliance
                    </span>
                    <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">
                      Qty
                    </span>
                    <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">
                      Watts
                    </span>
                    <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">
                      Hrs/Day
                    </span>
                    <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">
                      Energy
                    </span>
                  </div>
                )}

                {/* Appliance Rows */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {!hasItems ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-6">
                      <div className="h-16 w-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
                        <BatteryCharging className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">
                          No appliances added yet
                        </h4>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs leading-relaxed">
                          Use the form below to search and add your appliances.
                          Results will appear as you build your list.
                        </p>
                      </div>
                    </div>
                  ) : (
                    items.map((item) => {
                      const itemEnergy = item.watts * item.qty * item.hours;
                      return (
                        <div
                          key={item.id}
                          className="px-4 sm:px-6 py-3.5 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                        >
                          {/* Mobile: stacked card layout */}
                          <div className="flex sm:hidden items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                {/* Qty stepper */}
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-zinc-400 font-bold mr-1">
                                    Qty
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateItem(
                                        item.id,
                                        "qty",
                                        Math.max(1, item.qty - 1),
                                      )
                                    }
                                    className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                  >
                                    <Minus className="h-3 w-3 text-zinc-500" />
                                  </button>
                                  <span className="w-5 text-center text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    {item.qty}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateItem(
                                        item.id,
                                        "qty",
                                        item.qty + 1,
                                      )
                                    }
                                    className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                  >
                                    <Plus className="h-3 w-3 text-zinc-500" />
                                  </button>
                                </div>
                                {/* Watts */}
                                <div className="relative w-20">
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.watts}
                                    onChange={(e) =>
                                      handleUpdateItem(
                                        item.id,
                                        "watts",
                                        Math.max(1, Number(e.target.value)),
                                      )
                                    }
                                    className="h-7 text-center text-xs pr-5 pl-2"
                                  />
                                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                                    W
                                  </span>
                                </div>
                                {/* Hours */}
                                <div className="relative w-20">
                                  <Input
                                    type="number"
                                    min="0.1"
                                    max="24"
                                    step="0.5"
                                    value={item.hours}
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
                                    className="h-7 text-center text-xs pr-5 pl-2"
                                  />
                                  <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                                    h
                                  </span>
                                </div>
                                {/* Energy badge */}
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-lg whitespace-nowrap">
                                  {itemEnergy >= 1000
                                    ? `${(itemEnergy / 1000).toFixed(1)} kWh`
                                    : `${itemEnergy.toLocaleString()} Wh`}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1.5 text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 rounded-md transition-colors flex-shrink-0 mt-0.5"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Desktop: grid layout */}
                          <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                            {/* Name */}
                            <div className="col-span-4">
                              <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">
                                {item.watts}W per unit
                              </p>
                            </div>
                            {/* Qty stepper */}
                            <div className="col-span-2 flex items-center justify-center gap-1">
                              <button
                                onClick={() =>
                                  handleUpdateItem(
                                    item.id,
                                    "qty",
                                    Math.max(1, item.qty - 1),
                                  )
                                }
                                className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <Minus className="h-3 w-3 text-zinc-500" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                {item.qty}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateItem(item.id, "qty", item.qty + 1)
                                }
                                className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <Plus className="h-3 w-3 text-zinc-500" />
                              </button>
                            </div>
                            {/* Watts */}
                            <div className="col-span-2 flex justify-center">
                              <div className="relative w-20">
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.watts}
                                  onChange={(e) =>
                                    handleUpdateItem(
                                      item.id,
                                      "watts",
                                      Math.max(1, Number(e.target.value)),
                                    )
                                  }
                                  className="h-8 text-center text-xs pr-5 pl-2"
                                />
                                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                                  W
                                </span>
                              </div>
                            </div>
                            {/* Hours */}
                            <div className="col-span-2 flex justify-center">
                              <div className="relative w-20">
                                <Input
                                  type="number"
                                  min="0.1"
                                  max="24"
                                  step="0.5"
                                  value={item.hours}
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
                                  className="h-8 text-center text-xs pr-5 pl-2"
                                />
                                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 font-bold">
                                  h
                                </span>
                              </div>
                            </div>
                            {/* Energy + delete */}
                            <div className="col-span-2 flex items-center justify-end gap-2">
                              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-lg whitespace-nowrap">
                                {itemEnergy >= 1000
                                  ? `${(itemEnergy / 1000).toFixed(1)} kWh`
                                  : `${itemEnergy.toLocaleString()} Wh`}
                              </span>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 text-zinc-300 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 rounded-md transition-colors flex-shrink-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Live Total Bar */}
                {hasItems && (
                  <div className="px-6 py-3.5 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500">
                      Running Totals
                    </span>
                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                          Peak Load
                        </p>
                        <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                          {(calculations.totalLoad / 1000).toFixed(2)} kW
                        </p>
                      </div>
                      <div className="w-px h-7 bg-zinc-200 dark:bg-zinc-700" />
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                          Daily Energy
                        </p>
                        <p className="text-sm font-extrabold text-[#08AA08]">
                          {(calculations.dailyEnergy / 1000).toFixed(2)} kWh
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Item Form Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-xs overflow-visible">
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                    <Plus className="h-4 w-4 text-[#08AA08]" />
                    Add Appliance
                  </h4>
                </div>
                <form onSubmit={handleAddItem} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {/* Appliance name with dropdown */}
                    <div className="relative sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Appliance Name
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Refrigerator"
                        value={newItemName}
                        onChange={(e) => {
                          setNewItemName(e.target.value);
                          setShowPresetsDropdown(true);
                        }}
                        onFocus={() => setShowPresetsDropdown(true)}
                        className="h-10 text-sm w-full"
                        required
                      />
                      {showPresetsDropdown && filteredPresets.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-52 overflow-y-auto z-30">
                          {filteredPresets.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setNewItemName(preset.name);
                                setNewItemWatts(preset.watts.toString());
                                setNewItemHours(preset.hours.toString());
                                setShowPresetsDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex justify-between items-center transition-colors"
                            >
                              <span>{preset.name}</span>
                              <span className="text-[#08AA08] font-bold">
                                {preset.watts}W
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Qty */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={newItemQty}
                        min="1"
                        onChange={(e) => setNewItemQty(e.target.value)}
                        className="h-10 text-sm"
                        required
                      />
                    </div>

                    {/* Watts */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Watts (per unit)
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="150"
                          value={newItemWatts}
                          onChange={(e) => setNewItemWatts(e.target.value)}
                          className="h-10 text-sm pr-8"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-bold">
                          W
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    {/* Hours */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                        Hours Per Day
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="6"
                          value={newItemHours}
                          onChange={(e) => setNewItemHours(e.target.value)}
                          min="0"
                          max="24"
                          step="0.5"
                          className="h-10 text-sm pr-8"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-bold">
                          h
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex items-end">
                      <Button
                        type="submit"
                        className="w-full h-10 text-sm font-bold bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl"
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add to List
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* ── Right: Results Panel ── */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 shadow-md rounded-2xl overflow-hidden">
                {/* Panel header */}
                <div className="p-5 bg-linear-to-br from-[#064e3b] to-emerald-700 text-white space-y-1">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-300" />
                    System Sizing Results
                  </h3>
                  <p className="text-emerald-100 text-[11px] leading-relaxed">
                    Sized from your connected load with 50% future-load
                    tolerance applied.
                  </p>
                </div>

                {!hasItems ? (
                  /* Empty state */
                  <div className="p-10 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-center">
                      <CloudLightning className="h-7 w-7 text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        No Results Yet
                      </h4>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed max-w-[190px] mx-auto">
                        Add appliances on the left to instantly see your
                        inverter, battery, and panel sizing.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 space-y-4">
                    {/* Demand Summary */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          Connected Load
                        </p>

                        <p className="text-lg font-extrabold text-zinc-900 dark:text-white">
                          {(calculations.totalLoad / 1000).toFixed(2)}
                          <span className="text-sm font-semibold text-zinc-400 ml-1">
                            kW
                          </span>
                        </p>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-950/15 rounded-xl p-3.5 border border-amber-100 dark:border-amber-900/30">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                          Safety Margin
                        </p>

                        <p className="text-lg font-extrabold text-zinc-900 dark:text-white">
                          {(calculations.safetyMargin / 1000).toFixed(2)}
                          <span className="text-sm font-semibold text-zinc-400 ml-1">
                            kW
                          </span>
                        </p>

                        <p className="text-[9px] text-amber-600/70 dark:text-amber-500/70 mt-0.5">
                          50% capacity allowance
                        </p>
                      </div>

                      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3.5 border border-emerald-100 dark:border-emerald-900/30">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                          Design Load
                        </p>

                        <p className="text-lg font-extrabold text-[#08AA08]">
                          {(calculations.designLoad / 1000).toFixed(2)}
                          <span className="text-sm font-semibold text-emerald-600 ml-1">
                            kW
                          </span>
                        </p>

                        <p className="text-[9px] text-emerald-600/70 dark:text-emerald-500/70 mt-0.5">
                          Load used for system sizing
                        </p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/15 rounded-xl p-3.5 border border-blue-100 dark:border-blue-900/30">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">
                          Daily Energy
                        </p>

                        <p className="text-lg font-extrabold text-zinc-900 dark:text-white">
                          {(calculations.dailyEnergy / 1000).toFixed(2)}
                          <span className="text-sm font-semibold text-zinc-400 ml-1">
                            kWh
                          </span>
                        </p>

                        <p className="text-[9px] text-zinc-400 mt-0.5">
                          Estimated daily consumption
                        </p>
                      </div>
                    </div>

                    {matchedPackage ? (
                      <>
                        {/* Component Sizing Metrics */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              Recommended System
                            </p>

                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#08AA08]">
                              Package matched
                            </span>
                          </div>

                          {/* Inverter */}
                          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/15 border border-amber-100 dark:border-amber-900/30">
                            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                                Inverter
                              </p>

                              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                {calculations.recommendedInverter !== "—"
                                  ? `${calculations.recommendedInverter} Hybrid Inverter`
                                  : "No suitable package"}
                              </p>
                            </div>
                          </div>

                          {/* Battery */}
                          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/15 border border-indigo-100 dark:border-indigo-900/30">
                            <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                              <BatteryCharging className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-500 uppercase tracking-wider">
                                Battery
                              </p>

                              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                {calculations.recommendedBattery}
                              </p>
                            </div>
                          </div>

                          {/* Solar Panels */}
                          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-yellow-50 dark:bg-yellow-950/15 border border-yellow-100 dark:border-yellow-900/30">
                            <div className="h-8 w-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                              <Sun className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider">
                                Solar Panels
                              </p>

                              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                {calculations.recommendedPanels}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Backup and charge time */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-950/10 p-3.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <BatteryCharging className="h-3.5 w-3.5 text-indigo-500" />

                              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-500">
                                Est. Backup
                              </p>
                            </div>

                            <p className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">
                              {calculations.backupHours}
                              <span className="text-xs font-semibold text-zinc-400 ml-1">
                                hrs
                              </span>
                            </p>

                            <p className="text-[9px] text-zinc-400 mt-0.5">
                              At continuous calculated load
                            </p>
                          </div>

                          <div className="rounded-xl border border-yellow-100 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/10 p-3.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Sun className="h-3.5 w-3.5 text-yellow-500" />

                              <p className="text-[9px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-500">
                                Est. Charge
                              </p>
                            </div>

                            <p className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">
                              {calculations.chargeTimeHours}
                              <span className="text-xs font-semibold text-zinc-400 ml-1">
                                hrs
                              </span>
                            </p>

                            <p className="text-[9px] text-zinc-400 mt-0.5">
                              Under peak solar conditions
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/15 p-4">
                        <div className="flex gap-3">
                          <CloudLightning className="h-5 w-5 text-amber-600 flex-shrink-0" />

                          <div>
                            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                              Custom system required
                            </p>

                            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                              Your estimated requirements exceed the capacity of
                              our current packaged systems. Contact us for a
                              custom solar system designed for your load.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="space-y-2.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                      <Button
                        onClick={() => setShowQuoteDialog(true)}
                        className="w-full h-10 bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl text-xs font-bold transition-all"
                      >
                        Get Installation Quote
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recommended Setup Banner (full-width, shown when a package is matched) ── */}
      {hasItems && matchedPackage && (
        <section className="w-full py-14 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-900 shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#08AA08]/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative p-8 flex flex-col md:flex-row md:items-center gap-8">
                  {/* Left: badge + name + spec */}
                  <div className="flex-1 space-y-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${matchedPackage.badgeColor}`}
                    >
                      Recommended for Your Load
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                        {matchedPackage.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed max-w-lg">
                        {matchedPackage.desc}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 inline-block">
                      {matchedPackage.spec}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                      <div className="rounded-xl bg-white/80 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700 p-3">
                        <p className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">
                          Design Load
                        </p>
                        <p className="text-sm font-extrabold text-zinc-900 dark:text-white">
                          {(calculations.designLoad / 1000).toFixed(2)} kW
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/80 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700 p-3">
                        <p className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">
                          Daily Energy
                        </p>
                        <p className="text-sm font-extrabold text-zinc-900 dark:text-white">
                          {(calculations.dailyEnergy / 1000).toFixed(2)} kWh
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/80 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700 p-3">
                        <p className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">
                          Backup
                        </p>
                        <p className="text-sm font-extrabold text-zinc-900 dark:text-white">
                          {calculations.backupHours} hrs
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/80 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700 p-3">
                        <p className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">
                          Package
                        </p>
                        <p className="text-sm font-extrabold text-zinc-900 dark:text-white">
                          {calculations.recommendedInverter}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: price + CTAs */}
                  <div className="flex flex-col items-start md:items-end gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Package Price
                      </p>
                      <p className="text-3xl font-black text-[#08AA08]">
                        {formatCurrency(matchedPackage.price, "NGN")}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <Link href={`/package/${matchedPackage.slug}`}>
                        <Button className="h-10 px-6 text-sm font-bold bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl">
                          Configure & Order →
                        </Button>
                      </Link>
                      <Button
                        onClick={() => setShowQuoteDialog(true)}
                        variant="outline"
                        className="h-10 px-6 text-sm font-bold rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                      >
                        Get Installation Quote
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <FaqNewsletterSection />

      {/* ── Sizing Quote Request Dialog ────────────────────────────────── */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Image
                src={LogoIcon}
                alt="Go Solar Logo"
                width={26}
                height={26}
                className="object-contain"
              />
              <span className="font-extrabold text-sm tracking-wider text-zinc-900 dark:text-white font-dmsans">
                GOSOLAR NIGERIA
              </span>
            </div>
            <DialogTitle className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Get an Installation Quote
            </DialogTitle>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              Share your load details and our Port Harcourt team will prepare a
              full installation quotation — covering equipment, labour, and all
              associated costs — and send it to your email.
            </p>
          </DialogHeader>

          {/* Sizing Summary Card */}
          <div className="mt-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800/80 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08AA08]">
              Calculated Specifications
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[9px] uppercase font-bold text-zinc-400">
                  Design Load
                </p>
                <p className="font-extrabold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {(calculations.designLoad / 1000).toFixed(2)} kW
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-zinc-400">
                  Daily Energy
                </p>
                <p className="font-extrabold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {(calculations.dailyEnergy / 1000).toFixed(2)} kWh
                </p>
              </div>
              <div className="col-span-2 border-t border-zinc-200 dark:border-zinc-800/50 pt-2">
                <p className="text-[9px] uppercase font-bold text-zinc-400">
                  Recommended Configuration
                </p>
                <p className="font-extrabold text-[#08AA08] mt-0.5">
                  {matchedPackage
                    ? matchedPackage.name
                    : "Custom Solar Solution Sizing Required"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitQuote} className="space-y-4 mt-6">
            <div className="space-y-3">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 px-4 text-xs font-semibold text-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 px-4 text-xs font-semibold text-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email Address *"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="w-full h-11 border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 px-4 text-xs font-semibold text-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 mt-6 flex flex-col sm:flex-row justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuoteDialog(false)}
                className="rounded-xl border-zinc-200 dark:border-zinc-700 text-xs h-11 px-5"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#08AA08] hover:bg-[#079907] text-white rounded-xl text-xs font-bold h-11 px-6 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Send Quote Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SolarCalculatorPage;
