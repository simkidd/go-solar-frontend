"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMyFinancingRequestsQuery } from "@/hooks/queries/useFinancingQuery";
import {
  usePayFinancingStep,
  useVerifyFinancingPayment,
} from "@/hooks/mutations/useFinancingMutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/helpers";
import {
  ShieldCheck,
  CreditCard,
  Calendar,
  Layers,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
} from "lucide-react";

export default function MyFinancingClient() {
  const searchParams = useSearchParams();
  const paymentRef = searchParams.get("ref") || "";

  const { data: requests = [], isLoading, refetch } = useMyFinancingRequestsQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showDetailMobile, setShowDetailMobile] = useState(false);

  const payStepMutation = usePayFinancingStep({
    onSuccess: (data) => {
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      }
    },
  });

  const verifyPaymentMutation = useVerifyFinancingPayment({
    onSuccess: () => {
      // Clear query params and refetch
      window.history.replaceState({}, document.title, window.location.pathname);
      refetch();
    },
  });

  useEffect(() => {
    if (paymentRef) {
      verifyPaymentMutation.mutate(paymentRef);
    }
  }, [paymentRef]);

  if (isLoading || verifyPaymentMutation.isPending) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        {verifyPaymentMutation.isPending && (
          <p className="text-xs font-bold text-[#08AA08] animate-pulse uppercase tracking-wider">
            Verifying Paystack Payment...
          </p>
        )}
      </div>
    );
  }

  const selectedPlan = requests.find((r: any) => r._id === selectedPlanId) || requests[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-[#08AA08] text-white hover:bg-[#08AA08]/80 text-[10px] font-bold uppercase py-0.5 px-2">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-500 text-white hover:bg-amber-500/80 text-[10px] font-bold uppercase py-0.5 px-2">Under Review</Badge>;
      case "declined":
        return <Badge className="bg-rose-600 text-white hover:bg-rose-600/80 text-[10px] font-bold uppercase py-0.5 px-2">Declined</Badge>;
      case "completed":
        return <Badge className="bg-blue-600 text-white hover:bg-blue-600/80 text-[10px] font-bold uppercase py-0.5 px-2">Fully Paid</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] font-bold uppercase py-0.5 px-2">{status}</Badge>;
    }
  };

  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    setShowDetailMobile(true);
  };

  return (
    <div className="space-y-6 font-inter text-left select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <h2 className="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Solar Financing Plans
          </h2>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            Manage your installment payments and active clean energy setups.
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card className="border border-border/80 rounded-2xl p-8 text-center bg-white dark:bg-zinc-900">
          <CardContent className="space-y-4 pt-4">
            <div className="h-12 w-12 bg-[#08AA08]/10 text-[#08AA08] rounded-full flex items-center justify-center mx-auto">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-foreground">No Financing Requests Yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                You haven't requested solar financing yet. Choose a package in our shop and apply.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* List panel (visible on desktop, or on mobile when detail is hidden) */}
          <div className={`space-y-3 md:col-span-5 ${showDetailMobile ? "hidden md:block" : "block"}`}>
            {requests.map((plan: any) => {
              const active = plan._id === (selectedPlan?._id || selectedPlanId);
              return (
                <div
                  key={plan._id}
                  onClick={() => handleSelectPlan(plan._id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                    active
                      ? "border-[#08AA08] bg-[#08AA08]/5 dark:bg-[#08AA08]/10 shadow-xs"
                      : "border-border hover:border-zinc-350 dark:hover:border-zinc-755 bg-white dark:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-extrabold text-xs text-foreground truncate max-w-[150px]">
                      {plan.systemSize}
                    </h4>
                    {getStatusBadge(plan.status)}
                  </div>
                  <div className="space-y-1 text-[11px] font-semibold text-zinc-500">
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="text-zinc-800 dark:text-zinc-200">
                        {formatCurrency(plan.totalAmount, "NGN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Term:</span>
                      <span className="text-zinc-800 dark:text-zinc-200">
                        {plan.repaymentMonths} Months
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details panel (visible on desktop, or on mobile when detail is shown) */}
          {selectedPlan && (
            <div className={`md:col-span-7 ${showDetailMobile ? "block" : "hidden md:block"}`}>
              {/* Back to list button (visible only on mobile) */}
              <Button
                variant="ghost"
                onClick={() => setShowDetailMobile(false)}
                className="mb-4 text-xs font-bold text-muted-foreground flex items-center gap-1 hover:text-foreground md:hidden px-0"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Plans List
              </Button>

              <Card className="border border-border/80 rounded-2xl shadow-xs bg-white dark:bg-zinc-900 overflow-hidden">
                <CardHeader className="p-6 bg-linear-to-br from-primary/5 to-transparent border-b border-border/50">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                        Financing Contract Plan
                      </span>
                      <CardTitle className="text-base font-black text-foreground tracking-tight leading-snug">
                        {selectedPlan.systemSize}
                      </CardTitle>
                    </div>
                    {getStatusBadge(selectedPlan.status)}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Detailed Terms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-0.5">
                      <span className="text-zinc-450 uppercase text-[9px] tracking-wider block">Total Contract Cost</span>
                      <span className="text-zinc-950 dark:text-zinc-50 text-sm font-extrabold">
                        {formatCurrency(selectedPlan.totalAmount, "NGN")}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-zinc-450 uppercase text-[9px] tracking-wider block">Down Payment Required</span>
                      <span className="text-zinc-950 dark:text-zinc-50 text-sm font-extrabold text-[#08AA08]">
                        {formatCurrency(selectedPlan.downPayment, "NGN")}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-zinc-450 uppercase text-[9px] tracking-wider block">Monthly Installment</span>
                      <span className="text-zinc-950 dark:text-zinc-50 text-sm font-extrabold">
                        {formatCurrency(selectedPlan.monthlyPayment, "NGN")}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-zinc-450 uppercase text-[9px] tracking-wider block">Payment Duration</span>
                      <span className="text-zinc-950 dark:text-zinc-50 text-sm font-extrabold">
                        {selectedPlan.repaymentMonths} Months
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border/50 my-4" />

                  {/* Payment Progress Schedule */}
                  {selectedPlan.status === "approved" || selectedPlan.status === "completed" ? (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-zinc-450 tracking-wider text-left">
                        Repayment Schedule & History
                      </h4>

                      <div className="space-y-2.5">
                        {/* Down Payment Item */}
                        {(() => {
                          const isPaid = selectedPlan.payments.some(
                            (p: any) => p.type === "down_payment" && p.status === "paid"
                          );
                          const isPending = selectedPlan.payments.some(
                            (p: any) => p.type === "down_payment" && p.status === "pending"
                          );

                          return (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-zinc-50/50 dark:bg-zinc-800/20 text-xs font-semibold gap-3">
                              <div className="flex items-center gap-3">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                                  isPaid ? "bg-emerald-500/20 text-emerald-600" : "bg-amber-500/20 text-amber-500"
                                }`}>
                                  <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div className="space-y-0.5 text-left">
                                  <span className="text-zinc-850 dark:text-zinc-150">Initial Down Payment</span>
                                  <span className="text-[10px] text-zinc-400 block">{formatCurrency(selectedPlan.downPayment, "NGN")}</span>
                                </div>
                              </div>
                              {isPaid ? (
                                <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 border-none font-bold text-[9px] uppercase py-0 px-2 h-5 self-start sm:self-center">Paid</Badge>
                              ) : (
                                <Button
                                  disabled={payStepMutation.isPending || isPending}
                                  onClick={() => payStepMutation.mutate(selectedPlan._id)}
                                  className="bg-[#08AA08] hover:bg-[#079907] text-white text-[10px] font-extrabold uppercase py-1 h-7 px-3.5 rounded-lg flex items-center gap-1 shrink-0 w-full sm:w-auto justify-center"
                                >
                                  <CreditCard className="h-3 w-3" />
                                  Pay Down Payment
                                </Button>
                              )}
                            </div>
                          );
                        })()}

                        {/* Installment Items */}
                        {(() => {
                          const hasPaidDownPayment = selectedPlan.payments.some(
                            (p: any) => p.type === "down_payment" && p.status === "paid"
                          );

                          // Find paid count
                          const paidInstallmentsCount = selectedPlan.payments.filter(
                            (p: any) => p.type === "installment" && p.status === "paid"
                          ).length;

                          return Array.from({ length: selectedPlan.repaymentMonths }).map((_, index) => {
                            const stepNum = index + 1;
                            const isPaid = stepNum <= paidInstallmentsCount;
                            const isNextToPay = hasPaidDownPayment && stepNum === paidInstallmentsCount + 1;

                            return (
                              <div
                                key={stepNum}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border bg-zinc-50/50 dark:bg-zinc-800/20 text-xs font-semibold gap-3"
                              >
                                <div className="flex items-center gap-3 text-left">
                                  <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                                    isPaid ? "bg-emerald-500/20 text-emerald-600" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                                  }`}>
                                    <Calendar className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-zinc-850 dark:text-zinc-150">Installment #{stepNum}</span>
                                    <span className="text-[10px] text-zinc-400 block">{formatCurrency(selectedPlan.monthlyPayment, "NGN")}</span>
                                  </div>
                                </div>
                                {isPaid ? (
                                  <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 border-none font-bold text-[9px] uppercase py-0 px-2 h-5 self-start sm:self-center">Paid</Badge>
                                ) : isNextToPay ? (
                                  <Button
                                    disabled={payStepMutation.isPending}
                                    onClick={() => payStepMutation.mutate(selectedPlan._id)}
                                    className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 text-[10px] font-extrabold uppercase py-1 h-7 px-3.5 rounded-lg flex items-center gap-1 shrink-0 w-full sm:w-auto justify-center"
                                  >
                                    <CreditCard className="h-3 w-3" />
                                    Pay Installment
                                  </Button>
                                ) : (
                                  <span className="text-[10px] text-zinc-450 uppercase tracking-wider font-bold self-start sm:self-center">Pending</span>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl leading-relaxed text-xs">
                      {selectedPlan.status === "pending" ? (
                        <>
                          <div className="flex gap-3 items-start font-semibold text-amber-500">
                            <Clock className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-left">
                              <h5 className="font-extrabold text-xs uppercase tracking-wider">Plan Under Review</h5>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-450 font-medium">
                                GoSolar's financial team is currently reviewing your down payment capability and income statement parameters. Approved plan payment links will activate here within 24-48 hours.
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-3 items-start font-semibold text-rose-500">
                            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-left">
                              <h5 className="font-extrabold text-xs uppercase tracking-wider">Plan Declined</h5>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-455 font-medium">
                                This financing request was declined. Admin Reason: <b>{selectedPlan.adminNotes || "None provided."}</b>
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
