"use client";
import React from "react";
import { motion } from "framer-motion";
import { Zap, BatteryCharging, Users, Globe } from "lucide-react";

const STATS = [
  {
    icon: Zap,
    value: "23 kW+",
    label: "Solar Energy Installed",
    desc: "Powering homes and small commercial units with clean energy.",
  },
  {
    icon: BatteryCharging,
    value: "15 kWh+",
    label: "Storage Deployed",
    desc: "Long-life Lithium and deep-cycle battery banks installed.",
  },
  {
    icon: Users,
    value: "+10,000",
    label: "Happy Customers",
    desc: "Relying on our systems daily for uninterrupted power.",
  },
  {
    icon: Globe,
    value: "45+",
    label: "Sites Managed",
    desc: "Active residential and corporate setups running across Nigeria.",
  },
];

const StatsSection = () => {
  return (
    <section className="w-full py-16 bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-900 font-inter">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-3 p-6 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-2xl"
              >
                <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-[#08AA08] rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    {stat.value}
                  </h3>
                  <h5 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {stat.label}
                  </h5>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
