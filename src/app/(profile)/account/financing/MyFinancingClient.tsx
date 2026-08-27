"use client";

import React, { useState } from "react";
import { useMyFinancingRequestsQuery } from "@/hooks/queries/useFinancingQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/helpers";
import {
  Layers,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  FileText,
  ShieldCheck,
} from "lucide-react";

export default function MyFinancingClient() {
  const { data: requests = [], isLoading } = useMyFinancingRequestsQuery();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showDetailMobile, setShowDetailMobile] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
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
        return <Badge className="bg-blue-600 text-white hover:bg-blue-600/80 text-[10px] font-bold uppercase py-0.5 px-2">Completed</Badge>;
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
            Submit required application documents and manage active Clean Energy requests.
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
                You haven't requested solar financing yet. Choose financing in our app and apply.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* List panel */}
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
                    <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white truncate">
                      Request #{plan._id.substring(0, 8)}
                    </h4>
                    {getStatusBadge(plan.status)}
                  </div>
                  <div className="space-y-1 text-[11px] font-semibold text-zinc-500">
                    <div className="flex justify-between">
                      <span>Profile Type:</span>
                      <span className="text-zinc-800 dark:text-zinc-200 capitalize">
                        {plan.requestType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submitted:</span>
                      <span className="text-zinc-800 dark:text-zinc-200">
                        {formatDate(plan.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details panel */}
          {selectedPlan && (
            <div className={`md:col-span-7 ${showDetailMobile ? "block" : "hidden md:block"}`}>
              {/* Back button on mobile */}
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
                  <div className="flex justify-between items-start gap-2 text-left">
                    <div>
                      <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                        Request ID: #{selectedPlan._id}
                      </span>
                      <CardTitle className="text-base font-black text-foreground tracking-tight leading-snug">
                        Financing Application Details
                      </CardTitle>
                    </div>
                    {getStatusBadge(selectedPlan.status)}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Offline Details & Document Links */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-zinc-450 tracking-wider text-left">
                        Submitted Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-left">
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5">
                          <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Application Type</span>
                          <span className="text-foreground capitalize">{selectedPlan.requestType || "Individual"}</span>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5">
                          <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Phone Number</span>
                          <span className="text-foreground">{selectedPlan.phoneNumber}</span>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5">
                          <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">NIN Number</span>
                          <span className="text-foreground">{selectedPlan.nin || "Not Provided"}</span>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5">
                          <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Cheque Provision</span>
                          <span className="text-foreground">{selectedPlan.provisionOfCheque ? "Agreed (Cheques Offline)" : "Not Agreed"}</span>
                        </div>

                        {selectedPlan.requestType === "corporate" ? (
                          <>
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5 sm:col-span-2">
                              <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Business Address</span>
                              <span className="text-foreground">{selectedPlan.businessAddress || "Not Provided"}</span>
                            </div>
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5">
                              <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Nature of Business</span>
                              <span className="text-foreground">{selectedPlan.natureOfBusiness || "Not Provided"}</span>
                            </div>
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5">
                              <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Years in Business</span>
                              <span className="text-foreground">{selectedPlan.yearsInBusiness || "0"} Years</span>
                            </div>
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5 sm:col-span-2">
                              <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Direct Debit Authorization</span>
                              <span className="text-foreground">{selectedPlan.directDebitSetup ? "Agreed (Setup Pending)" : "Not Agreed"}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            {selectedPlan.firstName && (
                              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5 sm:col-span-2">
                                <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Applicant Name</span>
                                <span className="text-foreground">{selectedPlan.firstName} {selectedPlan.lastName}</span>
                              </div>
                            )}
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5 sm:col-span-2">
                              <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Office Address</span>
                              <span className="text-foreground">{selectedPlan.officeAddress || "Not Provided"}</span>
                            </div>
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-border/40 rounded-xl space-y-0.5 sm:col-span-2">
                              <span className="text-[9px] text-zinc-400 uppercase tracking-wide block">Job Role</span>
                              <span className="text-foreground">{selectedPlan.jobRole || "Not Provided"}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Uploaded Documents List */}
                    {selectedPlan.documents && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-zinc-450 tracking-wider text-left">
                          Uploaded Documents
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                          {selectedPlan.documents.passportPhoto && (
                            <a
                              href={selectedPlan.documents.passportPhoto}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-white dark:bg-zinc-900 border border-border/70 hover:border-primary/40 rounded-xl flex items-center gap-2.5 transition"
                            >
                              <FileText className="h-4.5 w-4.5 text-[#08AA08]" />
                              <span className="text-foreground truncate">Passport Photo</span>
                            </a>
                          )}
                          {selectedPlan.requestType === "corporate" && selectedPlan.documents.cacDocument && (
                            <a
                              href={selectedPlan.documents.cacDocument}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-white dark:bg-zinc-900 border border-border/70 hover:border-primary/40 rounded-xl flex items-center gap-2.5 transition"
                            >
                              <FileText className="h-4.5 w-4.5 text-[#08AA08]" />
                              <span className="text-foreground truncate">CAC Certificate</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-border/50 my-4" />

                    {/* Status Alert box */}
                    <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl leading-relaxed text-xs">
                      {selectedPlan.status === "pending" ? (
                        <div className="flex gap-3 items-start font-semibold text-amber-500">
                          <Clock className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                          <div className="space-y-1 text-left">
                            <h5 className="font-extrabold text-xs uppercase tracking-wider">Application Under Review</h5>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-455 font-medium">
                              GoSolar's financial team is currently reviewing your uploaded statements and verification details. A representative will contact you offline shortly to finalize terms.
                            </p>
                          </div>
                        </div>
                      ) : selectedPlan.status === "approved" ? (
                        <div className="flex gap-3 items-start font-semibold text-emerald-600">
                          <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                          <div className="space-y-1 text-left">
                            <h5 className="font-extrabold text-xs uppercase tracking-wider">Application Approved</h5>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-455 font-medium">
                              This application is approved! A client support officer is finalizing contract terms with you offline. Admin Notes: <b>{selectedPlan.adminNotes || "None provided."}</b>
                            </p>
                          </div>
                        </div>
                      ) : selectedPlan.status === "completed" ? (
                        <div className="flex gap-3 items-start font-semibold text-blue-600">
                          <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                          <div className="space-y-1 text-left">
                            <h5 className="font-extrabold text-xs uppercase tracking-wider">Contract Completed</h5>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-455 font-medium">
                              This financing plan is completed and repayments are set up offline.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 items-start font-semibold text-rose-500">
                          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                          <div className="space-y-1 text-left">
                            <h5 className="font-extrabold text-xs uppercase tracking-wider">Application Declined</h5>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-455 font-medium">
                              This financing request was declined. Reason: <b>{selectedPlan.adminNotes || "None provided."}</b>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
