"use client";

import React, { useState, useMemo } from "react";
import { useSession } from "@/context/SessionContext";
import { useAdminFinancingRequestsQuery } from "@/hooks/queries/useFinancingQuery";
import {
  useAdminApproveFinancing,
  useAdminDeclineFinancing,
  useAdminDeleteFinancing,
} from "@/hooks/mutations/useFinancingMutations";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/utils/helpers";
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
  RefreshCw,
  ChevronDown,
  FileText,
  Trash2,
  MoreVertical,
  Mail,
} from "lucide-react";

export default function AdminFinancingClient() {
  const { user } = useSession();
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

  const deleteMutation = useAdminDeleteFinancing({
    onSuccess: () => {
      refetch();
    },
  });

  const handleOpenAction = (plan: any) => {
    setSelectedPlan(plan);
    setAdminNotes(plan.adminNotes || "");
    setIsSheetOpen(true);
  };

  const handleApprove = () => {
    if (!selectedPlan) return;
    approveMutation.mutate({
      id: selectedPlan._id,
      adminNotes,
    });
  };

  const handleDecline = () => {
    if (!selectedPlan) return;
    declineMutation.mutate({
      id: selectedPlan._id,
      adminNotes,
    });
  };

  const handleDelete = (id: string) => {
    setRequestToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (requestToDelete) {
      deleteMutation.mutate(requestToDelete, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setRequestToDelete(null);
        },
      });
    }
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

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
        r.requestType === "individual" && r.firstName
          ? `${r.firstName} ${r.lastName}`.toLowerCase()
          : "corporate client";
      const applicantEmail = (r.email || "").toLowerCase();
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

  return (
    <div className="space-y-5 font-inter text-left ">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
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
        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3  font-bold uppercase tracking-wider">
          <span>Total {filteredRequests.length} financing plans listed</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12  px-4">
                Applicant & Info
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 ">
                Profile Type
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 ">
                Selected Package
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12  text-right">
                Total Price
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12  text-center">
                Status
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12  text-right px-4">
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
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
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
                  colSpan={6}
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
                    <p className="font-bold text-zinc-900 dark:text-white">
                      {plan.requestType === "individual" && plan.firstName
                        ? `${plan.firstName} ${plan.lastName}`
                        : "Corporate Client"}
                    </p>
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-muted text-muted-foreground border border-border/50">
                      {plan.requestType || "Individual"}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs font-bold text-zinc-850 dark:text-zinc-250">
                    {plan.systemSize}
                  </TableCell>

                  <TableCell className="text-right text-xs font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(plan.totalAmount, "NGN")}
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getStatusBadge(plan.status)}`}
                    >
                      {plan.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-muted/40 rounded-lg cursor-pointer"
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl bg-card border border-border/80"
                      >
                        <DropdownMenuItem
                          onClick={() => handleOpenAction(plan)}
                          className="cursor-pointer text-xs font-semibold flex items-center gap-2"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {plan.status === "pending"
                            ? "Review App"
                            : "View Details"}
                        </DropdownMenuItem>
                        {user?.isSuperAdmin && (
                          <DropdownMenuItem
                            onClick={() => handleDelete(plan._id)}
                            className="cursor-pointer text-xs font-semibold text-red-500 hover:text-red-650 hover:bg-red-50/50 dark:hover:bg-red-955/10 flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Request
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pt-2 ">
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
          className="sm:max-w-[550px] w-full bg-card text-card-foreground border-l border-border p-0 overflow-hidden font-inter  flex flex-col justify-between h-full"
        >
          {selectedPlan && (
            <div className="flex flex-col h-full justify-between text-left">
              <SheetHeader className="p-6 bg-linear-to-br from-primary/5 to-transparent border-b border-border/50 text-left">
                <SheetTitle className="text-sm font-extrabold text-foreground uppercase tracking-tight">
                  {selectedPlan.status === "pending"
                    ? "Review Financing Request"
                    : "Financing Plan Details"}
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
                        <span className="capitalize">
                          Type:{" "}
                          <b>{selectedPlan.requestType || "Individual"}</b>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>
                          Name:{" "}
                          <b>
                            {selectedPlan.requestType === "individual" &&
                            selectedPlan.firstName
                              ? `${selectedPlan.firstName} ${selectedPlan.lastName}`
                              : "Corporate Client"}
                          </b>
                        </span>
                      </div>
                      {selectedPlan.email && (
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <span>
                            Email: <b>{selectedPlan.email}</b>
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>{selectedPlan.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>
                          NIN: <b>{selectedPlan.nin || "N/A"}</b>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>
                          Cheque Provision:{" "}
                          <b>
                            {selectedPlan.provisionOfCheque
                              ? "Agreed"
                              : "Not Agreed"}
                          </b>
                        </span>
                      </div>
                      {selectedPlan.requestType === "corporate" && (
                        <div className="flex items-center gap-2">
                          <span>
                            Direct Debit:{" "}
                            <b>
                              {selectedPlan.directDebitSetup
                                ? "Agreed"
                                : "Not Agreed"}
                            </b>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section: Dynamic details based on requestType */}
                  <div className="space-y-2.5">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      {selectedPlan.requestType === "corporate"
                        ? "Corporate Business Details"
                        : "Employment & Residence Details"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-xl text-xs font-semibold">
                      {selectedPlan.requestType === "corporate" ? (
                        <>
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <span>
                              Business Address:{" "}
                              <b>{selectedPlan.businessAddress || "N/A"}</b>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>
                              Nature:{" "}
                              <b>{selectedPlan.natureOfBusiness || "N/A"}</b>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>
                              Years in Biz:{" "}
                              <b>{selectedPlan.yearsInBusiness || "0"} Years</b>
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <span>
                              Office Address:{" "}
                              <b>{selectedPlan.officeAddress || "N/A"}</b>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <Briefcase className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <span>
                              Role: <b>{selectedPlan.jobRole || "N/A"}</b>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Section: Uploaded Documents */}
                  {selectedPlan.documents && (
                    <div className="space-y-2.5 text-left font-semibold">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                        Uploaded Documents
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {selectedPlan.documents.passportPhoto && (
                          <a
                            href={selectedPlan.documents.passportPhoto}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-zinc-50 dark:bg-zinc-800/10 border border-border/80 hover:border-primary/40 rounded-xl flex items-center gap-2.5 transition"
                          >
                            <FileText className="h-4.5 w-4.5 text-[#08AA08]" />
                            <span className="font-extrabold truncate">
                              Passport Photo
                            </span>
                          </a>
                        )}
                        {selectedPlan.requestType === "corporate" &&
                          selectedPlan.documents.cacDocument && (
                            <a
                              href={selectedPlan.documents.cacDocument}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-zinc-50 dark:bg-zinc-800/10 border border-border/80 hover:border-primary/40 rounded-xl flex items-center gap-2.5 transition"
                            >
                              <FileText className="h-4.5 w-4.5 text-[#08AA08]" />
                              <span className="font-extrabold truncate">
                                CAC Certificate
                              </span>
                            </a>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Section: Calculator / Approved details */}
                  <div className="space-y-2.5">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-455 text-left">
                      Sizing & Price Details
                    </h4>
                    <div className="bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-xl">
                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-left">
                        <div>
                          <span className="text-[9px] text-zinc-455 uppercase block">
                            Selected Package
                          </span>
                          <span>{selectedPlan.systemSize}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-455 uppercase block">
                            Total Price
                          </span>
                          <span>
                            {formatCurrency(selectedPlan.totalAmount, "NGN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

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
                <div className="p-6 border-t border-border/60 bg-zinc-50/50 dark:bg-zinc-800/10 text-center  text-[10px] text-zinc-400 font-bold uppercase">
                  Plan Current Status: {selectedPlan.status}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Superadmin Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm bg-card border border-border/80 rounded-2xl ">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Delete Financing Request
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to permanently delete this solar financing
              request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
