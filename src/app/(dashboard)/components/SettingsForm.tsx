"use client";

import React, { useEffect, useState } from "react";
import { useSettingsQuery } from "@/hooks/queries/useSettingsQuery";
import { useUpdateSettingsMutation } from "@/hooks/mutations/useSettingsMutations";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  DollarSign,
  Phone,
  Landmark,
  Zap,
  Save,
  Loader2,
  Globe,
  Share2,
} from "lucide-react";

export default function SettingsForm() {
  const { data, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  // Shop & Currency states
  const [vatRate, setVatRate] = useState(7.5);
  const [baseShippingFee, setBaseShippingFee] = useState(15000);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2500000);
  const [usdExchangeRate, setUsdExchangeRate] = useState(1500);

  // Contact Info states
  const [supportPhone, setSupportPhone] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Bank details states
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  // Wattages state
  const [applianceWattages, setApplianceWattages] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data?.settings) {
      const s = data.settings;
      setVatRate(s.vatRate ?? 7.5);
      setBaseShippingFee(s.baseShippingFee ?? 15000);
      setFreeShippingThreshold(s.freeShippingThreshold ?? 2500000);
      setUsdExchangeRate(s.usdExchangeRate ?? 1500);

      setSupportPhone(s.supportPhone || "");
      setSupportEmail(s.supportEmail || "");
      setOfficeAddress(s.officeAddress || "");
      setWhatsappNumber(s.whatsappNumber || "");
      setWhatsappMessage(s.whatsappMessage || "");
      setFacebookUrl(s.facebookUrl || "");
      setInstagramUrl(s.instagramUrl || "");
      setTwitterUrl(s.twitterUrl || "");
      setLinkedinUrl(s.linkedinUrl || "");

      setBankName(s.bankName || "");
      setAccountNumber(s.accountNumber || "");
      setAccountName(s.accountName || "");

      if (s.applianceWattages) {
        setApplianceWattages({ ...s.applianceWattages });
      }
    }
  }, [data]);

  const handleWattageChange = (key: string, value: number) => {
    setApplianceWattages((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      vatRate,
      baseShippingFee,
      freeShippingThreshold,
      usdExchangeRate,
      supportPhone,
      supportEmail,
      officeAddress,
      whatsappNumber,
      whatsappMessage,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      linkedinUrl,
      bankName,
      accountNumber,
      accountName,
      applianceWattages,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Format appliance names to human-readable strings
  const formatApplianceLabel = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full space-y-6 max-w-4xl font-inter">
      {/* Title Header */}
      <div className="flex flex-col gap-1 select-none">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Global Store Settings
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Configure prices, tax, contact hotline, banking details, and appliance wattages.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="shop" className="w-full space-y-5">
          <TabsList className="bg-zinc-100 dark:bg-zinc-900/60 p-1 rounded-xl w-full grid grid-cols-4 gap-1 border border-zinc-200/40 dark:border-zinc-800/40">
            <TabsTrigger value="shop" className="gap-2 text-[11px] font-bold uppercase tracking-wider py-2">
              <DollarSign className="w-3.5 h-3.5" />
              Shop & Exchange
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2 text-[11px] font-bold uppercase tracking-wider py-2">
              <Phone className="w-3.5 h-3.5" />
              Info & Socials
            </TabsTrigger>
            <TabsTrigger value="bank" className="gap-2 text-[11px] font-bold uppercase tracking-wider py-2">
              <Landmark className="w-3.5 h-3.5" />
              Bank Account
            </TabsTrigger>
            <TabsTrigger value="calculator" className="gap-2 text-[11px] font-bold uppercase tracking-wider py-2">
              <Zap className="w-3.5 h-3.5" />
              Sizing Watts
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Shop & Currency */}
          <TabsContent value="shop" className="space-y-4 outline-none">
            <Card className="bg-card text-card-foreground border border-border/80 shadow-xs rounded-2xl p-6 space-y-5">
              <div className="border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Shop Configurations</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Define VAT rates, base shipping prices, and USD conversions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    VAT Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    USD to NGN Exchange Rate (₦/$)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={usdExchangeRate}
                    onChange={(e) => setUsdExchangeRate(Number(e.target.value))}
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    Base Shipping/Delivery Fee (₦)
                  </label>
                  <Input
                    type="number"
                    value={baseShippingFee}
                    onChange={(e) => setBaseShippingFee(Number(e.target.value))}
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    Free Shipping Threshold (₦)
                  </label>
                  <Input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: Info & Socials */}
          <TabsContent value="contact" className="space-y-4 outline-none">
            <Card className="bg-card text-card-foreground border border-border/80 shadow-xs rounded-2xl p-6 space-y-5">
              <div className="border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Contact & Support Details</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Manage customer support information and social URLs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    Support Hotline
                  </label>
                  <Input
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    placeholder="e.g. +234-800-GOSOLAR"
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    Support Email
                  </label>
                  <Input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="e.g. support@gosolar.ng"
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    Physical Office Address
                  </label>
                  <Input
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    placeholder="Plot Address, City, Nigeria"
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                  />
                </div>

                <div className="border-t border-border/40 pt-4 md:col-span-2 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5 select-none">
                    <Globe className="w-4 h-4" /> Whatsapp Bubble Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                        WhatsApp Number (with country code)
                      </label>
                      <Input
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="e.g. 2348000000000"
                        className="bg-muted/20 border-border/60 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                        WhatsApp Welcome Message
                      </label>
                      <Input
                        value={whatsappMessage}
                        onChange={(e) => setWhatsappMessage(e.target.value)}
                        placeholder="Welcome message text"
                        className="bg-muted/20 border-border/60 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-4 md:col-span-2 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5 select-none">
                    <Share2 className="w-4 h-4" /> Social Profile Links
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                        Facebook URL
                      </label>
                      <Input
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="bg-muted/20 border-border/60 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                        Instagram URL
                      </label>
                      <Input
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="bg-muted/20 border-border/60 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                        Twitter / X URL
                      </label>
                      <Input
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        placeholder="https://twitter.com/..."
                        className="bg-muted/20 border-border/60 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                        LinkedIn URL
                      </label>
                      <Input
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="bg-muted/20 border-border/60 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: Bank Details */}
          <TabsContent value="bank" className="space-y-4 outline-none">
            <Card className="bg-card text-card-foreground border border-border/80 shadow-xs rounded-2xl p-6 space-y-5">
              <div className="border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Bank Account Details</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">These accounts are displayed to users during manual Bank Transfer checkout.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    Bank Name
                  </label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Access Bank"
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    Account Number
                  </label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="10-digit number"
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                    Account Name
                  </label>
                  <Input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. GoSolar Limited"
                    className="bg-muted/20 border-border/60 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 4: Calculator Appliance Wattages */}
          <TabsContent value="calculator" className="space-y-4 outline-none">
            <Card className="bg-card text-card-foreground border border-border/80 shadow-xs rounded-2xl p-6 space-y-5">
              <div className="border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Energy Calculator Watts Constants</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Define power consumption (in Watts) for appliance sizing calculations.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {Object.keys(applianceWattages).map((applianceKey) => (
                  <div key={applianceKey} className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 select-none">
                      {formatApplianceLabel(applianceKey)}
                    </label>
                    <Input
                      type="number"
                      value={applianceWattages[applianceKey] ?? 0}
                      onChange={(e) => handleWattageChange(applianceKey, Number(e.target.value))}
                      className="bg-muted/20 border-border/60 rounded-xl text-sm"
                      required
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Button Row */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary hover:bg-primary/95 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-xs tracking-wider uppercase font-black text-[10px] cursor-pointer"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Save Configuration
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
