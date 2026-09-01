import React from "react";
import PageHeader from "@/components/PageHeader";
import { Shield, Scale, FileText, CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions governing the use of GoSolar Nigeria solar sizing calculators, custom quotation submissions, and installation agreements.",
};

const TermsPage = () => {
  return (
    <div className="w-full font-inter ">
      <PageHeader
        badge="Legal Agreement"
        heading="Terms & Conditions"
        subtitle="Last Updated: July 31, 2026. Please review our service guidelines, calculation disclaimers, and commercial terms."
        image="/images/bg/about-us.jpg"
        minHeight="min-h-[420px] md:min-h-[460px]"
      />

      <section className="w-full py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Overview */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 p-6 rounded-2xl sticky top-24">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#08AA08] mb-4">
                  Document Overview
                </h4>
                <ul className="space-y-3.5 text-xs text-zinc-650 dark:text-zinc-400 font-semibold">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#08AA08] shrink-0" />
                    <span>Agreement To Terms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#08AA08] shrink-0" />
                    <span>Calculator Usage Sizing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-[#08AA08] shrink-0" />
                    <span>Liability & Warranties</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#08AA08] shrink-0" />
                    <span>Nigerian Jurisdiction</span>
                  </li>
                </ul>
                <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 font-medium">
                  If you have questions regarding these terms, contact us at:{" "}
                  <a
                    href="mailto:gosolardotng@gmail.com"
                    className="text-[#08AA08] hover:underline"
                  >
                    gosolardotng@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8 text-zinc-700 dark:text-zinc-400 text-sm leading-relaxed font-medium">
              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  1. Agreement to Terms
                </h3>
                <p>
                  These Terms and Conditions constitute a legally binding
                  agreement made between you, whether personally or on behalf of
                  an entity (“you”) and GoSolar Nigeria (“we”, “us”, or “our”),
                  concerning your access to and use of our website, sizing
                  calculator, and related commercial installation services.
                </p>
                <p>
                  By accessing the Site, you agree that you have read,
                  understood, and agreed to be bound by all of these Terms and
                  Conditions. If you do not agree with all of these terms, then
                  you are expressly prohibited from using the Site and our
                  calculator tools, and you must discontinue use immediately.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  2. Solar Sizing Calculator Disclaimer
                </h3>
                <p>
                  Our interactive Solar Sizing Calculator provides preliminary
                  estimations of solar capacity, inverter sizing, battery bank
                  size, and solar array configurations based entirely on
                  user-provided appliance inputs.
                </p>
                <p className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300">
                  <strong>IMPORTANT NOTE:</strong> All estimations, runtimes,
                  and solar panel charging metrics provided by the calculator
                  are simulated engineering assumptions. Actual solar output,
                  load behaviors, and battery runtimes depend on local solar
                  irradiance, weather, installation tilt/azimuth, operating
                  efficiency, and specific load conditions. Professional site
                  audits are mandatory before commissioning custom builds.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  3. Intellectual Property Rights
                </h3>
                <p>
                  Unless otherwise indicated, the Site, calculator algorithms,
                  page code, design tokens, stylesheets, and custom graphics are
                  our proprietary property and all source code, databases,
                  functionality, software, website designs, audio, video, text,
                  photographs, and graphics on the Site and the trademarks,
                  service marks, and logos contained therein are owned or
                  controlled by us or licensed to us.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  4. Commercial Sizing Quotations
                </h3>
                <p>
                  All commercial quotation requests submitted via the calculator
                  are treated as inquiries. Sized packages and pricing are
                  estimates subject to site assessments. GoSolar reserves the
                  right to revise system sizing recommendations and pricing
                  following physical inspection of your distribution board,
                  cabling, surge ratings, and installation constraints.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  5. Warranties & Installation
                </h3>
                <p>
                  Standard warranties apply to finalized agreements as follows:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Solar Panels:</strong> 10-year limited performance
                    warranty.
                  </li>
                  <li>
                    <strong>Lithium Batteries:</strong> 5-year manufacturers
                    performance warranty.
                  </li>
                  <li>
                    <strong>Hybrid Inverters:</strong> 2-year manufacturer parts
                    warranty.
                  </li>
                </ul>
                <p>
                  Warranties do not cover damage resulting from user-overload,
                  lighting strikes, storm damage, grid surge, tampering, or
                  unauthorized modifications to the solar distribution breaker
                  board.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  6. Limitation of Liability
                </h3>
                <p>
                  In no event will we or our directors, employees, or agents be
                  liable to you or any third party for any direct, indirect,
                  consequential, exemplary, incidental, special, or punitive
                  damages, including lost profit, lost revenue, loss of data, or
                  other damages arising from your use of the website or custom
                  sizing calculator.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  7. Governing Law
                </h3>
                <p>
                  These terms shall be governed by and defined following the
                  laws of the Federal Republic of Nigeria. You irrevocably
                  consent that the courts of Port Harcourt, Rivers State,
                  Nigeria shall have exclusive jurisdiction to resolve any
                  dispute which may arise in connection with these terms.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Contact Information
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  GoSolar Nigeria Operations Office:
                  <br />
                  4 Eneka, Igwuruta Road, Airport road, Port Harcourt, Rivers
                  State, Nigeria
                  <br />
                  Email:{" "}
                  <a
                    href="mailto:gosolardotng@gmail.com"
                    className="text-[#08AA08] hover:underline"
                  >
                    gosolardotng@gmail.com
                  </a>{" "}
                  | Tel: +234 706 276 2879, +234 802 708 2120
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
