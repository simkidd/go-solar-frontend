import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import FaqNewsletterSection from "@/components/home/FaqNewsletterSection";
import { Mail, MapPin, Phone, Clock, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | GoSolar",
  description:
    "Have questions about our solar products, packages, or installations? Our support and sales team are always ready to help you make the switch to clean, reliable energy.",
};

const ContactUsPage = () => {
  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950">
      {/* Full-bleed Page Hero */}
      <PageHeader
        badge="Get In Touch"
        heading="Start Your Solar Journey Today"
        subtitle="Have questions about our solar products, packages, or installations? Our support and sales team are always ready to help you make the switch to clean, reliable energy."
        image="/images/bg/contact-bg.jpg"
        cta={[
          { label: "Get a Free Quote", href: "/contact-us?subject=Quote" },
          {
            label: "Send Us a Message",
            href: "#contact-form",
            variant: "outline",
          },
        ]}
        minHeight="min-h-[420px] md:min-h-[460px]"
      />

      {/* Contact Info Section */}
      <section className="w-full py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Office blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Port Harcourt Office */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-8 space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-[#08AA08] text-white rounded-full">
                    Port Harcourt Experience Centre
                  </span>
                </div>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-xl bg-[#08AA08]/10 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-[#08AA08]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        Email Address
                      </p>
                      <a
                        href="mailto:gosolardotng@gmail.com"
                        className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-[#08AA08] transition-colors font-roboto"
                      >
                        gosolardotng@gmail.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-xl bg-[#08AA08]/10 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4 text-[#08AA08]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        Call Us
                      </p>
                      <a
                        href="tel:+2347062762879"
                        className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-[#08AA08] transition-colors block font-roboto"
                      >
                        +234 706 276 2879
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-xl bg-[#08AA08]/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-[#08AA08]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        Address
                      </p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=gosolar+4+Eneka,+Igwuruta+Road,+Airport+road,+Port+Harcourt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-[#08AA08] transition-colors leading-relaxed block"
                      >
                        4 Eneka, Igwuruta Road, Airport road, Port Harcourt
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Working Hours & Support */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-8 space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-zinc-900 dark:bg-zinc-700 text-white rounded-full">
                    Hours & Support
                  </span>
                </div>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-xl bg-[#08AA08]/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-[#08AA08]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        Operating Hours
                      </p>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        Monday - Friday: 8:00 AM - 5:00 PM
                        <br />
                        Saturday: 9:00 AM - 2:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-xl bg-[#08AA08]/10 flex items-center justify-center shrink-0">
                      <Zap className="h-4 w-4 text-[#08AA08]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                        Technical Support
                      </p>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        24/7 technical hotline available for active subscription
                        solar customers.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Map + Form Row */}
            <div
              id="contact-form"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Map */}
              <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-zinc-150 dark:border-zinc-800 shadow-xs h-[420px] relative bg-zinc-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15901.341669146188!2d7.0498806!3d4.883378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069d31b3b00a359%3A0x77fdb8b93997f0ec!2sGosolar.ng!5e0!3m2!1sen!2sng!4v1711888641200!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full grayscale dark:invert"
                />
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-10 border border-zinc-150 dark:border-zinc-800 shadow-xs">
                <div className="space-y-2 mb-8">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#08AA08]">
                    Get in Touch
                  </span>
                  <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    Our friendly team would love to hear from you.
                  </h2>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Newsletter */}
      <FaqNewsletterSection />
    </div>
  );
};

export default ContactUsPage;
