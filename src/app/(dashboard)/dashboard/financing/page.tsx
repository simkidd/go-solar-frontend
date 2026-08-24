"use client";

import React, { useState, useMemo } from "react";
import { useAdminFinancingRequestsQuery } from "@/hooks/queries/useFinancingQuery";
import {
  useAdminApproveFinancing,
  useAdminDeclineFinancing,
} from "@/hooks/mutations/useFinancingMutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/utils/helpers";
import {
  Coins,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Phone,
  User,
  MapPin,
  Briefcase,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Mail,
  DollarSign,
  Calendar,
  MoreVertical,
} from "lucide-react";

export default function AdminFinancingDashboard() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data, isLoading, refetch } = useAdminFinancingRequestsQuery(
    page,
    statusFilter === "All" ? "" : statusFilter.toLowerCase(),
  );

  const requests = data?.requests || [];
  const pagination = data?.pagination || { totalPages: 1 };

  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [adjMonthlyPayment, setAdjMonthlyPayment] = useState("");
  const [adjDownPayment, setAdjDownPayment] = useState("");

  const approveMutation = useAdminApproveFinancing({
    onSuccess: () => {
      setIsSheetOpen(false);
      refetch();
    },
  });

  const declineMutation = useAdminDeclineFinancing({
    onSuccess: () => {
      setIsSheetOpen(false);
      refetch();
    },
  });

  const handleOpenAction = (plan: any) => {
    setSelectedPlan(plan);
    setAdminNotes(plan.adminNotes || "");
    setAdjMonthlyPayment(plan.monthlyPayment.toString());
    setAdjDownPayment(plan.downPayment.toString());
    setIsSheetOpen(true);
  };

  const handleApprove = () => {
    if (!selectedPlan) return;
    approveMutation.mutate({
      id: selectedPlan._id,
      adminNotes,
      monthlyPayment: parseFloat(adjMonthlyPayment) || undefined,
      downPayment: parseFloat(adjDownPayment) || undefined,
    });
  };

  const handleDecline = () => {
    if (!selectedPlan) return;
    declineMutation.mutate({
      id: selectedPlan._id,
      adminNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-900/40";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/40";
      case "declined":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-900/40";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-955/20 dark:text-blue-400 dark:border-blue-900/40";
      default:
        return "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
    }
  };

  // Filter requests on search locally
  const filteredRequests = useMemo(() => {
    return requests.filter((r: any) => {
      const applicantName =
        `${r.user?.firstname || ""} ${r.user?.lastname || ""}`.toLowerCase();
      const applicantEmail = (r.user?.email || "").toLowerCase();
      const applicantPhone = (r.phoneNumber || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      return (
        applicantName.includes(search) ||
        applicantEmail.includes(search) ||
        applicantPhone.includes(search) ||
        (r.systemSize || "").toLowerCase().includes(search)
      );
    });
  }, [requests, searchTerm]);

  // Compute payment progress and due status values for the selected plan in Sheet
  const sheetDueInfo = useMemo(() => {
    if (!selectedPlan) return { isOverdue: false, label: "-" };

    const paidInstallments = selectedPlan.payments?.filter((p: any) => p.type === "installment" && p.status === "paid").length || 0;
    const downPaymentPaid = selectedPlan.payments?.some((p: any) => p.type === "down_payment" && p.status === "paid");
    
    let isOverdue = false;
    let label = "";

    if (selectedPlan.status === "approved") {
      if (!downPaymentPaid) {
        const approvalDate = new Date(selectedPlan.updatedAt);
        const dueDate = new Date(approvalDate.setDate(approvalDate.getDate() + 7));
        isOverdue = new Date() > dueDate;
        label = isOverdue 
          ? `Overdue: Down payment was due on ${formatDate(dueDate.toISOString())}`
          : `Down payment due by: ${formatDate(dueDate.toISOString())}`;
      } else {
        const downPaymentObj = selectedPlan.payments?.find((p: any) => p.type === "down_payment" && p.status === "paid");
        if (downPaymentObj?.paidAt) {
          const baseDate = new Date(downPaymentObj.paidAt);
          const dueDate = new Date(baseDate.setMonth(baseDate.getMonth() + paidInstallments + 1));
          isOverdue = new Date() > dueDate && paidInstallments < selectedPlan.repaymentMonths;
          label = paidInstallments < selectedPlan.repaymentMonths
            ? (isOverdue 
                ? `Overdue: Installment #${paidInstallments + 1} was due on ${formatDate(dueDate.toISOString())}`
                : `Next Installment #${paidInstallments + 1} due: ${formatDate(dueDate.toISOString())}`)
            : "Plan repayments completed";
        }
      }
    } else if (selectedPlan.status === "completed") {
      label = "Repayments completed";
    } else {
      label = "-";
    }

    return { isOverdue, label };
  }, [selectedPlan]);

  return (
    <div className="space-y-5 font-inter text-left select-none">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <Coins className="h-5 w-5 text-primary" />
            Financing Plans & Installment Apps
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Review applicant profiles, calculate monthly payouts, and approve
            payment plans.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 border-border text-muted-foreground hover:text-foreground h-9 rounded-xl text-xs font-semibold cursor-pointer hover:bg-muted/30"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search by name, email, system name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(searchTerm || statusFilter !== "All") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setPage(1);
                }}
                className="text-red-500 hover:text-red-650 hover:bg-red-50/50 dark:hover:bg-red-955/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}

            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border text-xs font-semibold rounded-xl h-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  {statusFilter === "All" ? "All Statuses" : statusFilter}
                  <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44 rounded-xl bg-card border border-border/80">
                {["All", "Pending", "Approved", "Declined", "Completed"].map(
                  (status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setPage(1);
                      }}
                      className="cursor-pointer text-xs font-bold"
                    >
                      {status === "All" ? "All Statuses" : status}
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Total counts */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3 select-none font-bold uppercase tracking-wider">
          <span>Total {filteredRequests.length} financing plans listed</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none px-4">
                Applicant & Info
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none">
                System Size
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none text-right">
                Total Price
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none text-right">
                Monthly Installment
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none">
                Term
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none text-center">
                Status
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none text-right px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-4 py-3.5">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full mx-auto" />
                  </TableCell>
                  <TableCell className="text-right px-4">
                    <Skeleton className="h-8 w-20 rounded-lg ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-sm text-zinc-400"
                >
                  No financing requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((plan: any) => (
                <TableRow
                  key={plan._id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                >
                  <TableCell className="px-4 py-3.5 text-xs text-foreground">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">
                        {plan.user?.firstname} {plan.user?.lastname}
                      </p>
                      <div className="flex flex-col gap-0.5 mt-1 text-[10px] text-zinc-550 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-zinc-400" />
                          <span>{plan.user?.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-zinc-400" />
                          <span>{plan.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-bold text-zinc-850 dark:text-zinc-250">
                    {plan.systemSize}
                  </TableCell>

                  <TableCell className="text-right text-xs font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(plan.totalAmount, "NGN")}
                  </TableCell>

                  <TableCell className="text-right text-xs font-bold text-[#08AA08]">
                    {formatCurrency(plan.monthlyPayment, "NGN")}
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                    {plan.repaymentMonths} Months
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getStatusBadge(plan.status)}`}
                    >
                      {plan.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right px-4">
                    {plan.status === "pending" ? (
                      <Button
                        onClick={() => handleOpenAction(plan)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white text-xs font-extrabold rounded-xl h-8 px-3.5 flex items-center gap-1.5 ml-auto shadow-xs cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Review App
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleOpenAction(plan)}
                        variant="outline"
                        size="sm"
                        className="border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 text-xs font-semibold rounded-xl h-8 px-3.5 flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pt-2 select-none">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-8 text-[10px] font-bold uppercase rounded-lg cursor-pointer"
          >
            Previous
          </Button>
          <span className="text-[11px] font-bold text-muted-foreground px-2">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-8 text-[10px] font-bold uppercase rounded-lg cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}

      {/* Review Sheet for Approved/Resolved/Pending Plans */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="sm:max-w-[550px] w-full bg-card text-card-foreground border-l border-border p-0 overflow-hidden font-inter select-none flex flex-col justify-between h-full"
        >
          {selectedPlan && (
            <div className="flex flex-col h-full justify-between text-left">
              <SheetHeader className="p-6 bg-linear-to-br from-primary/5 to-transparent border-b border-border/50 text-left">
                <SheetTitle className="text-sm font-extrabold text-foreground uppercase tracking-tight">
                  {selectedPlan.status === "pending" ? "Review Financing Request" : "Financing Plan Details"}
                </SheetTitle>
                <SheetDescription className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                  Request ID: {selectedPlan._id}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-5">
                  {/* Section: Applicant info */}
                  <div className="space-y-2.5">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      Applicant Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-xl text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>
                          {selectedPlan.user?.firstname}{" "}
                          {selectedPlan.user?.lastname}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>{selectedPlan.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>{selectedPlan.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Income details */}
                  <div className="space-y-2.5">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      Applicant Finance Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-xl text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>Employment: {selectedPlan.employmentStatus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>
                          Monthly Income:{" "}
                          <b>
                            {formatCurrency(selectedPlan.monthlyIncome, "NGN")}
                          </b>
                        </span>
                      </div>
                      {selectedPlan.employerName && (
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <span>
                            Employer: <b>{selectedPlan.employerName}</b>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section: Calculator / Approved details */}
                  <div className="space-y-2.5">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-455 text-left">
                      {selectedPlan.status === "pending" ? "Plan Terms & Calculator" : "Approved Financing Terms"}
                    </h4>
                    <div className="bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-xl space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-left">
                        <div>
                          <span className="text-[9px] text-zinc-455 uppercase block">
                            Total System Price
                          </span>
                          <span>
                            {formatCurrency(selectedPlan.totalAmount, "NGN")}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-455 uppercase block">
                            Repayment Term
                          </span>
                          <span>{selectedPlan.repaymentMonths} Months</span>
                        </div>
                        {selectedPlan.status !== "pending" && (
                          <>
                            <div className="pt-2 border-t border-border/40 mt-1">
                              <span className="text-[9px] text-zinc-455 uppercase block">
                                Approved Down Payment
                              </span>
                              <span className="text-[#08AA08] font-bold">
                                {formatCurrency(selectedPlan.downPayment, "NGN")}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-border/40 mt-1">
                              <span className="text-[9px] text-zinc-455 uppercase block">
                                Monthly Payment
                              </span>
                              <span>
                                {formatCurrency(selectedPlan.monthlyPayment, "NGN")}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Review Edits Inputs - only when pending */}
                      {selectedPlan.status === "pending" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40 text-left font-semibold">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-zinc-450 tracking-wider block">
                              Down Payment (NGN)
                            </label>
                            <Input
                              type="number"
                              value={adjDownPayment}
                              onChange={(e) => setAdjDownPayment(e.target.value)}
                              className="bg-card border-border rounded-lg text-xs h-8 font-semibold focus-visible:ring-primary"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-zinc-455 tracking-wider block">
                              Monthly Payment (NGN)
                            </label>
                            <Input
                              type="number"
                              value={adjMonthlyPayment}
                              onChange={(e) => setAdjMonthlyPayment(e.target.value)}
                              className="bg-card border-border rounded-lg text-xs h-8 font-semibold focus-visible:ring-primary"
                            />
                          </div>
                        </div>
                      )}

                      {/* Repayment Progress & Overdue calculations for approved plans */}
                      {selectedPlan.status === "approved" && (
                        <div className="pt-2 col-span-2 border-t border-border/40 mt-1">
                          <span className="text-[9px] text-zinc-455 uppercase block">Repayment Progress & Due Status</span>
                          <span className={`text-xs font-bold block ${sheetDueInfo.isOverdue ? "text-rose-500 font-extrabold" : ""}`}>
                            {sheetDueInfo.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section: Payments History */}
                  {selectedPlan.payments &&
                    selectedPlan.payments.length > 0 && (
                      <div className="space-y-2.5 text-left font-semibold">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          Payment History & Tracking References
                        </h4>
                        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs font-semibold">
                          {selectedPlan.payments.map(
                            (payment: any, index: number) => (
                              <div
                                key={index}
                                className="p-3 bg-zinc-50/50 dark:bg-zinc-800/10 flex justify-between items-center gap-3"
                              >
                                <div className="text-left font-semibold">
                                  <span className="text-zinc-855 dark:text-zinc-150 capitalize">
                                    {payment.type.replace("_", " ")}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block font-mono select-all font-semibold">
                                    Ref: {payment.paymentReference}
                                  </span>
                                </div>
                                <div className="text-right font-semibold">
                                  <span className="text-zinc-955 dark:text-zinc-50 block">
                                    {formatCurrency(payment.amount, "NGN")}
                                  </span>
                                  <span className="text-[9px] text-muted-foreground block">
                                    {payment.paidAt
                                      ? formatDate(payment.paidAt)
                                      : ""}
                                  </span>
                                </div>
                                <div>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${
                                      payment.status === "paid"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : payment.status === "pending"
                                          ? "bg-amber-50 text-amber-700 border-amber-200"
                                          : "bg-rose-50 text-rose-700 border-rose-200"
                                    }`}
                                  >
                                    {payment.status}
                                  </span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Admin review notes / notes history */}
                  <div className="space-y-1.5 text-left font-semibold">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
                      {selectedPlan.status === "pending"
                        ? "Admin Review Notes / Rejection Reason"
                        : "Admin Review Notes History"}
                    </label>
                    {selectedPlan.status === "pending" ? (
                      <Textarea
                        placeholder="Enter notes visible to the customer..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={2}
                        className="bg-muted/30 border-border rounded-xl text-xs resize-none"
                      />
                    ) : (
                      <div className="bg-muted/30 border border-border p-3.5 rounded-xl text-xs text-zinc-650 leading-relaxed font-semibold">
                        {selectedPlan.adminNotes || "No notes logged."}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              {/* Footer resolution action controls */}
              {selectedPlan.status === "pending" ? (
                <SheetFooter className="p-6 border-t border-border/60 flex items-center justify-end gap-2 bg-zinc-50/50 dark:bg-zinc-800/10">
                  <Button
                    onClick={handleDecline}
                    disabled={
                      declineMutation.isPending || approveMutation.isPending
                    }
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-955/10 text-xs font-bold uppercase rounded-xl h-10 px-5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    Decline Request
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={
                      approveMutation.isPending || declineMutation.isPending
                    }
                    className="bg-primary hover:bg-primary/90 text-white text-xs font-extrabold uppercase rounded-xl h-10 px-6 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Approve Plan
                  </Button>
                </SheetFooter>
              ) : (
                <div className="p-6 border-t border-border/60 bg-zinc-50/50 dark:bg-zinc-800/10 text-center select-none text-[10px] text-zinc-400 font-bold uppercase">
                  Plan Current Status: {selectedPlan.status}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
