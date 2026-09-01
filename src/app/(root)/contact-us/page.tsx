import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have questions about our solar products, packages, or installations? Our support and sales team are always ready to help you make the switch to clean, reliable energy.",
};

const ContactUsPage = () => {
  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 overflow-hidden">
      {/* ── Page Hero ────────────────────────────────────────────────── */}
      <PageHeader
        badge="Get in Touch"
        heading="Contact GoSolar Ng"
        subtitle="Whether you need a quote, have technical questions, or want to discuss a project, our team is ready to help."
        image="/images/bg/about-us.jpg"
        minHeight="min-h-[360px]"
        align="left"
      />

      {/* ── Main Contact Container ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column: Contact info & metadata */}
          <div className="space-y-8">
            <div className="space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#08AA08] block">
                Contact Information
              </span>
              <div className="space-y-5">
                {[
                  {
                    icon: <Phone className="h-5 w-5 text-[#08AA08]" />,
                    label: "Phone Numbers",
                    phones: [
                      { label: "+234 706 276 2879", href: "tel:+2347062762879" },
                      { label: "+234 802 708 2120", href: "tel:+2348027082120" },
                    ],
                  },
                  {
                    icon: <Mail className="h-5 w-5 text-[#08AA08]" />,
                    label: "Email Address",
                    value: "gosolardotng@gmail.com",
                    href: "mailto:gosolardotng@gmail.com",
                  },
                  {
                    icon: <MapPin className="h-5 w-5 text-[#08AA08]" />,
                    label: "Main Office Location",
                    value:
                      "4 Eneka, Igwuruta Road, Airport road, Port Harcourt",
                    href: "https://www.google.com/maps/search/?api=1&query=gosolar+4+Eneka,+Igwuruta+Road,+Airport+road,+Port+Harcourt",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-zinc-55 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-405 dark:text-zinc-500">
                        {item.label}
                      </div>
                      {"phones" in item && item.phones ? (
                        <div className="flex flex-col gap-0.5">
                          {item.phones.map((phone) => (
                            <a
                              key={phone.href}
                              href={phone.href}
                              className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-[#08AA08] transition-colors leading-relaxed block"
                            >
                              {phone.label}
                            </a>
                          ))}
                        </div>
                      ) : item.href ? (
                        <a
                          href={item.href}
                          target={
                            item.label === "Main Office Location"
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            item.label === "Main Office Location"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-[#08AA08] transition-colors leading-relaxed block"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed block">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours Block */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-3xs">
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#08AA08]">
                Business Hours
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-zinc-200/50 dark:border-zinc-800/80 pb-2">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Monday – Friday
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    8:00 AM – 5:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-200/50 dark:border-zinc-800/80 pb-2">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Saturday
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    9:00 AM – 2:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Sunday
                  </span>
                  <span className="font-bold text-zinc-400 dark:text-zinc-500">
                    Closed
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-zinc-150 dark:border-zinc-800 text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
                Emergency technical support hotline available 24/7 for active
                subscription customers.
              </div>
            </div>

            {/* Social Block */}
            {/* Quick Estimate Calculator CTA */}
            <div className="bg-zinc-950 text-white rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden border border-zinc-800">
              <div className="absolute inset-0 z-0 bg-[#064e3b]/10 bg-radial" />
              <div className="relative z-10 space-y-3">
                <h4 className="font-heading font-bold text-base">
                  Need a Sizing Estimate?
                </h4>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Use our solar calculator tool for instant recommendations
                  based on your daily appliance load profile.
                </p>
                <div className="pt-1">
                  <Link
                    href="/energy-calculator"
                    className="inline-flex w-full items-center justify-center gap-1.5 bg-[#08AA08] hover:bg-[#079907] text-white px-5 py-2.5 font-bold uppercase tracking-wide text-[10px] rounded-xl transition-all shadow-xs"
                  >
                    Solar Calculator <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form & introduction */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
              <div className="space-y-1.5">
                <h2 className="font-heading font-bold text-xl lg:text-2xl text-zinc-900 dark:text-white">
                  Send Us a Message
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Fill in the form below and a GoSolar Ng engineering support
                  representative will respond within one business day.
                </p>
              </div>

              <ContactForm />
            </div>

            {/* Google Map iframe */}
            <div className="rounded-3xl overflow-hidden border border-zinc-150 dark:border-zinc-800 shadow-xs h-[300px] relative bg-zinc-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15901.341669146188!2d7.0498806!3d4.883378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069d31b3b00a359%3A0x77fdb8b93997f0ec!2sGosolar.ng!5e0!3m2!1sen!2sng!4v1711888641200!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ & Newsletter Section ─────────────────────────────────── */}
      <FaqNewsletterSection />
    </div>
  );
};

export default ContactUsPage;
