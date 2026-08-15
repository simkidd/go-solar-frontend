import { Offer } from "@/interfaces/product.interface";
import React from "react";

const SpecialOffers: React.FC<{ offers: Offer[] }> = ({ offers }) => {
  return (
    <>
      {offers && offers.length > 0 && (
        <section className="w-full py-6 font-inter">
          
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-border/60 pb-4 select-none mb-8">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Limited Campaigns
              </span>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                Special Active Offers
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 pb-6">
            {offers.slice(0, 1).map((offer) => (
              <div
                key={offer._id}
                className="relative lg:col-span-2 col-span-1 bg-card border border-border/80 rounded-3xl p-6 overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-primary/20 hover:shadow-xs group"
              >
                {/* Accent Background Pattern */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-300" />
                
                <div className="absolute top-4 right-4 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full select-none">
                  Limited Time
                </div>

                <div className="space-y-1.5 max-w-[70%]">
                  <h3 className="text-lg font-black uppercase tracking-wider text-foreground leading-snug">
                    {offer.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold">
                    Sitewide discount applied automatically at checkout
                  </p>
                </div>

                <p className="text-5xl font-black text-primary tracking-tight select-none mt-auto">
                  {offer.percentageOff}% Off
                </p>
              </div>
            ))}

            <div className="col-span-1 grid grid-cols-1 gap-6">
              {offers.slice(1, 3).map((offer) => (
                <div
                  key={offer._id}
                  className="relative bg-card border border-border/80 rounded-3xl p-6 overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-primary/20 hover:shadow-xs group"
                >
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-300" />

                  <div className="absolute top-4 right-4 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full select-none">
                    Limited Time
                  </div>

                  <div className="space-y-1 max-w-[80%]">
                    <h3 className="text-sm font-black uppercase tracking-wider text-foreground leading-snug">
                      {offer.name}
                    </h3>
                  </div>

                  <p className="text-4xl font-black text-primary tracking-tight select-none mt-auto">
                    {offer.percentageOff}% Off
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SpecialOffers;
