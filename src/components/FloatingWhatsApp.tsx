"use client";

import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
}

const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = "2348027082120",
  message = "Hello GoSolar Ng! I'm interested in getting clean solar power for my home/business.",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Mini Pop-over Notification Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 max-w-[260px] bg-card text-card-foreground p-3.5 rounded-2xl shadow-xl border border-border flex items-start gap-2.5 text-left"
          >
            <div className="h-2 w-2 rounded-full bg-[#25D366] shrink-0 mt-1.5 animate-pulse" />
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">
                Need Solar Advice?
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                Chat with an engineer on WhatsApp for instant sizing & pricing.
              </p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Animated Ripple Glow */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none opacity-75" />

        {/* WhatsApp Icon */}
        <FaWhatsapp className="h-7 w-7 fill-current relative z-10 transition-transform group-hover:rotate-6" />
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
