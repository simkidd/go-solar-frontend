"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Battery, Zap, Home, Cpu } from "lucide-react";

const SimulatorSection = () => {
  const [mode, setMode] = useState<"day" | "night">("day");

  // Simulated real-time fluctuating metrics
  const [solarKw, setSolarKw] = useState(3.5);
  const [batteryCharge, setBatteryCharge] = useState(85);
  const [tallySavings, setTallySavings] = useState(4201940);

  useEffect(() => {
    const interval = setInterval(() => {
      if (mode === "day") {
        setSolarKw(Number((3.2 + Math.random() * 0.8).toFixed(1)));
        setBatteryCharge((prev) =>
          Math.min(100, prev + (Math.random() > 0.7 ? 1 : 0)),
        );
        setTallySavings((prev) => prev + Math.floor(Math.random() * 5));
      } else {
        setSolarKw(0.0);
        setBatteryCharge((prev) =>
          Math.max(20, prev - (Math.random() > 0.7 ? 1 : 0)),
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    if (mode === "day") {
      setSolarKw(3.5);
      setBatteryCharge(85);
    } else {
      setSolarKw(0.0);
      setBatteryCharge(74);
    }
  }, [mode]);

  return (
    <section className="py-20 lg:py-28 bg-muted/30 border-y border-border font-inter relative overflow-hidden">
      {/* Dynamic Ambient Background Lights */}
      <div
        className={`absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-15 pointer-events-none transition-colors duration-1000 -translate-y-1/2 ${
          mode === "day" ? "bg-amber-400" : "bg-primary"
        }`}
      />

      {/* Self-contained CSS keyframes for flow-dash and pulses */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dash-flow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-flow-dash-line {
          stroke-dasharray: 6, 6;
          animation: dash-flow 1.2s linear infinite;
        }
        .pulse-ambient-glow {
          animation: pulse-glow-sim 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-glow-sim {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1) translate(-50%, -50%);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1) translate(-50%, -50%);
          }
        }
      `,
        }}
      />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* ── LEFT COLUMN: Standalone Interactive Sizing Diagram ── */}
        <div className="lg:col-span-6 w-full flex flex-col items-center justify-center min-h-[460px] rounded-[36px] border border-border bg-card text-card-foreground p-6 md:p-8 shadow-xs relative overflow-hidden select-none">
          {/* Day & Night Interactive Simulator Toggle Switch */}
          <div className="absolute top-6 right-6 z-30 flex items-center bg-muted dark:bg-zinc-950 border border-border rounded-full p-1.5 shadow-xs gap-1.5">
            <button
              onClick={() => setMode("day")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                mode === "day"
                  ? "bg-amber-500 text-black shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-3 w-3" />
              Day
            </button>
            <button
              onClick={() => setMode("night")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                mode === "night"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-3 w-3" />
              Night
            </button>
          </div>

          {/* Interactive Flow Canvas */}
          <div className="relative w-full max-w-[400px] aspect-[400/300] mx-auto z-10 mt-6">
            {/* Schematic Flow Wiring SVG Block */}
            <svg className="w-full h-full z-10" viewBox="0 0 400 300">
              {/* Ambient Radial Sky Glow for Day vs. Night */}
              <defs>
                <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                  <stop
                    offset="0%"
                    stopColor={
                      mode === "day"
                        ? "rgba(245, 158, 11, 0.15)"
                        : "rgba(8, 170, 8, 0.08)"
                    }
                  />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
              </defs>
              <rect
                x="0"
                y="0"
                width="400"
                height="300"
                fill="url(#glowGrad)"
                pointerEvents="none"
              />

              {/* Day Solar Generation Flow Path (Panels -> Inverter) */}
              <path
                d="M 130 90 L 130 130"
                fill="none"
                stroke={mode === "day" ? "#F59E0B" : "var(--border)"}
                strokeWidth="2.5"
                strokeLinecap="round"
                className={mode === "day" ? "animate-flow-dash-line" : ""}
                style={{ strokeDashoffset: mode === "day" ? 0 : undefined }}
              />

              {/* Battery Charge/Discharge Path (Battery -> Inverter) */}
              <path
                d="M 130 200 L 130 240"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-flow-dash-line"
                style={{
                  animationDirection: mode === "day" ? "normal" : "reverse",
                  strokeDashoffset: 0,
                }}
              />

              {/* Power To Home Path (Inverter -> Home Node) */}
              <path
                d="M 190 165 L 255 165"
                fill="none"
                stroke={mode === "day" ? "#F59E0B" : "var(--primary)"}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-flow-dash-line"
                style={{ strokeDashoffset: 0 }}
              />

              {/* Glowing Sun or Moon element */}
              <foreignObject x="15" y="15" width="50" height="50">
                <div className="w-full h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {mode === "day" ? (
                      <motion.div
                        key="sun"
                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 45, opacity: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="relative overflow-hidden rounded-full"
                      >
                        <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-amber-400/40 blur-md pulse-ambient-glow" />
                        <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center border-4 border-amber-400 shadow-xs relative z-10">
                          <Sun className="h-5 w-5 text-amber-600" />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ scale: 0, rotate: 45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: -45, opacity: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="relative"
                      >
                        <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-emerald-400/25 blur-md pulse-ambient-glow" />
                        <div className="h-10 w-10 bg-zinc-950 rounded-full flex items-center justify-center border-4 border-zinc-800 shadow-xs relative z-10">
                          <Moon className="h-5 w-5 text-primary" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </foreignObject>

              {/* Solar Panels Node */}
              <foreignObject x="70" y="20" width="120" height="70">
                <div
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-2xl border transition-all duration-500 w-full h-full ${
                    mode === "day"
                      ? "bg-amber-50/50 border-amber-300 dark:bg-zinc-950 dark:border-amber-500/20 text-amber-500 shadow-xs"
                      : "bg-muted/50 border-border text-muted-foreground"
                  }`}
                >
                  <div className="h-8 w-8 bg-card rounded-xl border border-border flex items-center justify-center shadow-xs">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold">
                    Solar Panels
                  </span>
                </div>
              </foreignObject>

              {/* Hybrid Inverter Node */}
              <foreignObject x="70" y="130" width="120" height="70">
                <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl bg-muted border border-border dark:bg-zinc-950 shadow-xs w-full h-full">
                  <div className="h-8 w-8 bg-card rounded-xl border border-border flex items-center justify-center text-primary shadow-xs">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold text-muted-foreground">
                    Hybrid Inverter
                  </span>
                </div>
              </foreignObject>

              {/* Lithium battery Node */}
              <foreignObject x="70" y="240" width="120" height="42">
                <div className="flex flex-col items-center justify-center px-2 py-1 rounded-2xl bg-muted border border-border dark:bg-zinc-950 shadow-xs w-full h-full">
                  <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold text-primary">
                    LiFePO4 Cells
                  </span>
                </div>
              </foreignObject>

              {/* Home node */}
              <foreignObject x="255" y="130" width="120" height="70">
                <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl bg-muted border border-border dark:bg-zinc-950 shadow-xs w-full h-full">
                  <div className="h-8 w-8 bg-card rounded-xl border border-border flex items-center justify-center text-primary shadow-xs">
                    <Home className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold text-muted-foreground">
                    Home Grid
                  </span>
                </div>
              </foreignObject>
            </svg>
          </div>

          {/* Glassmorphic Metrics */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 z-20">
            <div className="bg-muted/40 backdrop-blur-md border border-border p-4 rounded-2xl flex flex-col justify-between shadow-xs">
              <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-extrabold block">
                Source Mode
              </span>
              <div className="mt-2 text-xs font-black flex items-center gap-1.5 text-foreground">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${mode === "day" ? "bg-amber-400" : "bg-primary"} animate-pulse`}
                />
                {mode === "day" ? "Solar System" : "Battery Storage"}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 font-semibold">
                {mode === "day" ? `${solarKw} kW Peak` : "0.0 kW (Sunset)"}
              </span>
            </div>

            <div className="bg-muted/40 backdrop-blur-md border border-border p-4 rounded-2xl flex flex-col justify-between shadow-xs">
              <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-extrabold block">
                Estimated Savings
              </span>
              <div className="mt-2 text-xs font-black text-primary">
                {mode === "day"
                  ? `₦${tallySavings.toLocaleString()}`
                  : "Saved ₦12,500 tonight"}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 font-semibold">
                {mode === "day" ? "Cumulative totals" : "Bypassing generators"}
              </span>
            </div>

            <div className="bg-muted/40 backdrop-blur-md border border-border p-4 rounded-2xl flex flex-col justify-between shadow-xs">
              <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground font-extrabold block">
                Storage Bank
              </span>
              <div className="mt-2 text-xs font-black flex items-center gap-1.5 text-primary">
                <Zap className="h-3 w-3 text-primary fill-current" />
                {mode === "day" ? `${batteryCharge}%` : "74%"}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 font-semibold">
                {mode === "day" ? "Charging active" : "Discharging backup"}
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Sizing Detail Cards ── */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block">
              Live Sizing Simulation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Day & Night Sizing Simulator
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
              Select Day or Night Mode in the simulation window to see how
              GoSolar's hybrid configurations dynamically direct electric
              current flow.
            </p>
          </div>

          <div className="space-y-4">
            {/* Day Card details */}
            <div
              className={`p-6 rounded-[24px] border transition-all duration-300 flex gap-4 ${
                mode === "day"
                  ? "bg-card border-amber-500/20 shadow-xs text-card-foreground"
                  : "bg-card/40 border-border opacity-50"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center shrink-0">
                <Sun className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-foreground">
                  Day Mode Operations
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                  Rooftop panels capture clean monocrystalline generation (peak
                  ~3.5 kW) and feed the hybrid inverter. The system immediately
                  powers active household appliances and uses all surplus
                  generation to charge the LiFePO4 cells to 100%.
                </p>
              </div>
            </div>

            {/* Night Card details */}
            <div
              className={`p-6 rounded-[24px] border transition-all duration-300 flex gap-4 ${
                mode === "night"
                  ? "bg-card border-primary/20 shadow-xs text-card-foreground"
                  : "bg-card/40 border-border opacity-50"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-primary border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center shrink-0">
                <Moon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-foreground">
                  Night Mode Backup
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
                  Solar panel output drops to 0.0 kW. The hybrid inverter
                  registers the lack of solar and instantly (within 0ms) routes
                  energy from the stored Lithium batteries to power household
                  loads, avoiding diesel generator noise.
                </p>
              </div>
            </div>

            {/* Certified Hardware highlights */}
            <div className="flex gap-4 p-5 bg-card border border-border rounded-[20px] shadow-xs select-none">
              <div className="h-9 w-9 bg-muted dark:bg-zinc-950 border border-border rounded-xl flex items-center justify-center shrink-0 text-primary">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5">
                <h5 className="font-extrabold text-xs text-foreground">
                  Precise Sizing Controls
                </h5>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  Engineered with premium Victron and Jinko hardware for high
                  structural durability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulatorSection;
