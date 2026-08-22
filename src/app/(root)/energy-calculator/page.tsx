import React from "react";
import EnergyCalculatorClient from "./EnergyCalculatorClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar System Sizing Calculator",
  description:
    "Size your home, office, or commercial retail shop energy needs. Get instant guidelines and recommended hybrid inverter, battery storage, and solar panel setups.",
};

const SolarCalculatorPage = () => {
  return <EnergyCalculatorClient />;
};

export default SolarCalculatorPage;
