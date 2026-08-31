import React from "react";
import PageHeader from "@/components/PageHeader";
import { Shield, Eye, Lock, RefreshCw } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how GoSolar Nigeria handles, protects, and utilizes the data collected through our solar sizing tools and quote request submissions.",
};

const PrivacyPage = () => {
  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950">
      <PageHeader
        badge="Data Protection"
        heading="Privacy Policy"
        subtitle="Last Updated: July 31, 2026. Find out how we gather, utilize, and protect your information when utilizing our solar tools."
        image="/images/bg/contact-bg.jpg"
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
                    <span>Data Privacy Commitment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[#08AA08] shrink-0" />
                    <span>What Information We Collect</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#08AA08] shrink-0" />
                    <span>Data Security Measures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-[#08AA08] shrink-0" />
                    <span>Updates & User Rights</span>
                  </li>
                </ul>
                <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 font-medium">
                  Have questions? Contact our compliance representative at:{" "}
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
                  1. Introduction & Privacy Commitment
                </h3>
                <p>
                  GoSolar Nigeria respects your privacy and is committed to
                  protecting your personal data. This privacy notice will inform
                  you as to how we look after your personal data when you visit
                  our website, utilize our calculator tools, and tell you about
                  your privacy rights and how the law protects you.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  2. Information We Collect
                </h3>
                <p>
                  We collect information that you actively input when using our
                  services. This includes:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Sizing Calculation Data:</strong> Lists of
                    appliances, quantity, wattage ratings, and daily runtimes
                    configured on our interactive calculator.
                  </li>
                  <li>
                    <strong>Quote Request Info:</strong> Email address, name,
                    telephone line, and custom site description notes provided
                    when submitting a request for formal solar quotations.
                  </li>
                  <li>
                    <strong>Technical Usage Data:</strong> IP address, device
                    type, operating system, and anonymous browser cookies for
                    analytics and mapping services.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  3. How We Use Your Information
                </h3>
                <p>
                  We will only use your personal data when the law allows us to.
                  Most commonly, we use your personal data in the following
                  circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    To provide customized sizing summaries and inverter/battery
                    recommendations.
                  </li>
                  <li>
                    To review, formulate, and deliver commercial sales
                    quotations.
                  </li>
                  <li>
                    To respond to contact messages, site inquiries, or technical
                    support requests.
                  </li>
                  <li>
                    To monitor and analyze web traffic and tool usage patterns
                    to improve calculator accuracy.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  4. Data Security & Storage
                </h3>
                <p>
                  We have put in place appropriate security measures to prevent
                  your personal data from being accidentally lost, used, or
                  accessed in an unauthorized way, altered, or disclosed.
                </p>
                <p>
                  All quotation submission records are stored in secure
                  environments. Access to database tables containing customer
                  emails and appliance configurations is strictly limited to
                  authorized engineers and customer relations representatives at
                  our Port Harcourt operations office.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  5. Third-party Links & Map Embeds
                </h3>
                <p>
                  Our site features embedded iframe structures (specifically
                  Google Maps integration on the contact page). These
                  third-party services may gather anonymous usage data in
                  accordance with their respective privacy standards. GoSolar is
                  not responsible for data policies outside of our direct
                  website code.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  6. Your Rights
                </h3>
                <p>
                  Under relevant data protection laws, you have rights including
                  the right to request access, rectification, or deletion of the
                  emails and sizing calculations you have submitted to us. If
                  you wish to purge your quote request records, please send a
                  written request to{" "}
                  <a
                    href="mailto:gosolardotng@gmail.com"
                    className="text-[#08AA08] hover:underline font-semibold"
                  >
                    gosolardotng@gmail.com
                  </a>
                  .
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Contact Information
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  GoSolar Nigeria Data Compliance:
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
                  | Tel: +234 706 276 2879
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
