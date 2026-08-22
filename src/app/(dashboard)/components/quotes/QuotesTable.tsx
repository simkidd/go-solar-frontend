"use client";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Trash2,
  Calculator,
  Phone,
  Mail,
  MapPin,
  Zap,
  Battery,
  Sun,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import AppModal from "@/components/AppModal";

import {
  useCreateQuoteMutation,
  useUpdateQuoteStatusMutation,
  useDeleteQuoteMutation,
} from "@/hooks/mutations/useQuoteMutations";
import { useQuotesQuery } from "@/hooks/queries/useQuotesQuery";

export interface QuoteLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  dailyKwh: number;
  peakWatts: number;
  recommendedInverter: string;
  recommendedBatteryKwh: number;
  recommendedSolarWatts: number;
  estimatedPrice: number;
  status:
    | "New Lead"
    | "Contacted"
    | "Quote Sent"
    | "Site Inspected"
    | "Won"
    | "Declined";
  source: "Energy Calculator" | "Contact Form" | "Phone Inquiry";
  createdAt: string;
  appliances: { name: string; qty: number; watts: number; hours: number }[];
  notes?: string;
}

const mapBackendQuote = (q: any): QuoteLead => {
  let source: QuoteLead["source"] = "Energy Calculator";
  if (q.notes?.includes("Contact Form")) {
    source = "Contact Form";
  } else if (q.notes?.includes("Phone Inquiry")) {
    source = "Phone Inquiry";
  }

  let recommendedBatteryKwh = 10;
  const batMatch = q.recommendedBattery?.match(/(\d+(\.\d+)?)\s*kWh/i);
  if (batMatch) {
    recommendedBatteryKwh = parseFloat(batMatch[1]);
  }

  let recommendedSolarWatts = 4500;
  const pvMatch = q.recommendedPv?.match(/(\d+(\.\d+)?)\s*(kWp|kW|W)/i);
  if (pvMatch) {
    const value = parseFloat(pvMatch[1]);
    recommendedSolarWatts = pvMatch[3].toLowerCase() === "w" ? value : Math.round(value * 1000);
  }

  let estimatedPrice = 2500000;
  if (q.dailyKwh) {
    estimatedPrice = Math.round(q.dailyKwh * 250000);
  }

  return {
    id: q._id,
    name: q.fullName,
    email: q.email,
    phone: q.phoneNumber,
    location: q.address || `${q.city}, ${q.state}`,
    dailyKwh: q.dailyKwh,
    peakWatts: q.peakWatts,
    recommendedInverter: q.recommendedInverter,
    recommendedBatteryKwh: recommendedBatteryKwh,
    recommendedSolarWatts: recommendedSolarWatts,
    estimatedPrice: estimatedPrice,
    status: q.status || "New Lead",
    source: source,
    createdAt: q.createdAt,
    appliances: (q.appliances || []).map((app: any) => ({
      name: app.name,
      qty: app.quantity,
      watts: app.powerWatts,
      hours: app.hoursPerDay,
    })),
    notes: q.notes || "",
  };
};

const getStatusBadge = (status: QuoteLead["status"]) => {
  switch (status) {
    case "New Lead":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40";
    case "Contacted":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40";
    case "Quote Sent":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40";
    case "Site Inspected":
      return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/40";
    case "Won":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40";
    case "Declined":
      return "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
  }
};

export const QuotesTable = () => {
  const { data: quotesData = [], isLoading } = useQuotesQuery();
  const createMutation = useCreateQuoteMutation({
    onSuccess: () => setIsCreateOpen(false),
  });
  const updateQuoteStatusMutation = useUpdateQuoteStatusMutation();
  const deleteMutation = useDeleteQuoteMutation();

  const quotes = useMemo(() => {
    return quotesData.map(mapBackendQuote);
  }, [quotesData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states
  const [activeQuote, setActiveQuote] = useState<QuoteLead | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // react-hook-form for manual quote
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "Port Harcourt",
      dailyKwh: 10,
      peakWatts: 3000,
      recommendedInverter: "3.5 kVA Hybrid",
      estimatedPrice: 2400000,
      source: "Phone Inquiry" as "Phone Inquiry" | "Walk-in" | "Online Sizing",
    },
  });

  const handleSaveManual = (values: any) => {
    createMutation.mutate({
      fullName: values.name,
      email: values.email || "customer@gosolar.ng",
      phoneNumber: values.phone,
      state: "Rivers",
      city: values.location,
      address: values.location,
      dailyKwh: Number(values.dailyKwh),
      peakWatts: Number(values.peakWatts),
      recommendedInverter: values.recommendedInverter,
      recommendedBattery: `${(values.dailyKwh * 0.7).toFixed(1)} kWh Battery`,
      recommendedPv: `${(values.dailyKwh * 250).toFixed(0)} W Solar PV`,
      appliances: [
        { name: "General Lighting & Fans", quantity: 10, powerWatts: 80, hoursPerDay: 12 },
        { name: "Refrigeration Unit", quantity: 1, powerWatts: 250, hoursPerDay: 24 },
      ],
      status: "New Lead",
      notes: `[Manual Lead logged from Dashboard] Source: ${values.source}`,
    });
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q: QuoteLead) => {
      const matchesSearch =
        q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.phone.includes(searchTerm) ||
        q.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || q.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchTerm, statusFilter]);

  const handleUpdateStatus = (id: string, newStatus: QuoteLead["status"]) => {
    updateQuoteStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = () => {
    if (!activeQuote) return;
    deleteMutation.mutate(activeQuote.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
      },
    });
  };

  return (
    <div className="w-full space-y-5 font-inter">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <Calculator className="h-5 w-5 text-primary" />
            Installation Quotes & Sizing Leads
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Track customer energy calculator submissions and commercial site
            inspection requests.
          </p>
        </div>

        <Button
          onClick={() => {
            reset();
            setIsCreateOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Log Manual Lead
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search leads by name, email, phone..."
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
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}

            {/* Pipeline Status Dropdown */}
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
              <DropdownMenuContent className="w-48 rounded-xl bg-card border border-border/80">
                <DropdownMenuItem
                  onClick={() => setStatusFilter("All")}
                  className="cursor-pointer text-xs font-bold"
                >
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("New Lead")}
                  className="cursor-pointer text-xs font-bold"
                >
                  New Lead
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("Contacted")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Contacted
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("Quote Sent")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Quote Sent
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("Site Inspected")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Site Inspected
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("Won")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Won / Closed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("Declined")}
                  className="cursor-pointer text-xs font-bold"
                >
                  Declined
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Counter and status summary */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3 select-none font-bold uppercase tracking-wider">
          <span>Total {filteredQuotes.length} sizing leads listed</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none px-4">
                Client & Contact
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none">
                Energy Req
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none">
                Recommended System
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none text-right">
                Est. Budget
              </TableHead>
              <TableHead className="font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none text-center">
                Pipeline Status
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
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4.5 w-24 rounded-full" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-sm text-zinc-400"
                >
                  No quote requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((lead: QuoteLead) => (
                <TableRow
                  key={lead.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                >
                  {/* Client Info */}
                  <TableCell className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">
                        {lead.name}
                      </p>
                      <div className="flex flex-col gap-0.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-zinc-400" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-zinc-400" />
                          <span>{lead.location}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Energy Req */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span>{lead.dailyKwh} kWh / day</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Peak: {lead.peakWatts} W
                      </p>
                    </div>
                  </TableCell>

                  {/* Recommended System */}
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold px-2 py-0 border-primary/30 text-primary bg-primary/5"
                      >
                        {lead.recommendedInverter}
                      </Badge>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {lead.recommendedBatteryKwh}kWh Battery •{" "}
                        {lead.recommendedSolarWatts}W PV
                      </p>
                    </div>
                  </TableCell>

                  {/* Estimated Price */}
                  <TableCell className="text-right font-extrabold text-zinc-900 dark:text-white text-sm">
                    {formatCurrency(lead.estimatedPrice, "NGN")}
                  </TableCell>

                  {/* Pipeline Status */}
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-opacity ${getStatusBadge(lead.status)}`}
                        >
                          {lead.status}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="w-40 text-xs"
                      >
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(lead.id, "New Lead")
                          }
                        >
                          New Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(lead.id, "Contacted")
                          }
                        >
                          Contacted
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(lead.id, "Quote Sent")
                          }
                        >
                          Quote Sent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(lead.id, "Site Inspected")
                          }
                        >
                          Site Inspected
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(lead.id, "Won")}
                        >
                          Won / Closed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(lead.id, "Declined")
                          }
                        >
                          Declined
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg cursor-pointer hover:bg-muted"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-36 rounded-xl bg-card border border-border/80"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveQuote(lead);
                            setIsViewOpen(true);
                          }}
                          className="cursor-pointer text-xs font-bold"
                        >
                          <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="border-border/60" />
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveQuote(lead);
                            setIsDeleteOpen(true);
                          }}
                          className="cursor-pointer text-xs font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50/50 dark:focus:bg-rose-950/20"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* VIEW SIZING AUDIT MODAL */}
      <AppModal
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Sizing & Energy Audit Details"
        size="xl"
      >
        {activeQuote && (
          <div className="space-y-4 py-2 text-sm">
            {/* Contact card */}
            <div className="bg-muted/30 p-4 rounded-2xl border border-border/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground font-semibold">
                  Phone:
                </span>
                <p className="font-bold text-foreground mt-0.5">
                  {activeQuote.phone}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">
                  Email:
                </span>
                <p className="font-bold text-foreground mt-0.5">
                  {activeQuote.email}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">
                  Location:
                </span>
                <p className="font-bold text-foreground mt-0.5">
                  {activeQuote.location}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">
                  Submission Date:
                </span>
                <p className="font-bold text-foreground mt-0.5">
                  {formatDate(activeQuote.createdAt)}
                </p>
              </div>
            </div>

            {/* Sizing summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/20 text-center">
                <p className="text-[10px] uppercase font-bold text-primary">
                  Inverter
                </p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">
                  {activeQuote.recommendedInverter}
                </p>
              </div>
              <div className="p-2.5 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-900/40 text-center">
                <p className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400">
                  Battery Bank
                </p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">
                  {activeQuote.recommendedBatteryKwh} kWh
                </p>
              </div>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 text-center">
                <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">
                  Solar PV
                </p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">
                  {activeQuote.recommendedSolarWatts} W
                </p>
              </div>
            </div>

            {/* Appliance Audit List */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Customer Appliance Load Profile
              </p>
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-xs">
                {activeQuote.appliances.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 flex items-center justify-between bg-card"
                  >
                    <div>
                      <p className="font-bold text-foreground">{app.name}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        Qty: {app.qty} • {app.watts} Watts each
                      </p>
                    </div>
                    <span className="text-muted-foreground font-bold">
                      {app.hours} hrs/day
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsViewOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </AppModal>

      {/* MANUAL LEAD MODAL */}
      <AppModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Log Walk-in / Phone Quote Lead"
        size="xl"
      >
        <form
          onSubmit={handleSubmit(handleSaveManual)}
          className="w-full font-inter flex flex-col gap-6 pt-2"
        >
          {/* Details Section Card */}
          <div className="bg-card border border-border/80 p-6 rounded-2xl space-y-4">
            <div className="border-b border-border/60 pb-3 select-none">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Quote & Load Details
              </h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Record walk-in or phone inquiry solar load profile requirements
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Chief Kingsley Obi"
                {...register("name", { required: "Customer name is required" })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
              />
              {errors.name && (
                <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="+234 800 000 0000"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
                {errors.phone && (
                  <span className="text-[11px] font-bold text-red-500 mt-0.5 block">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Location
                </label>
                <Input
                  placeholder="e.g. Port Harcourt"
                  {...register("location")}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Daily kWh
                </label>
                <Input
                  type="number"
                  placeholder="12"
                  {...register("dailyKwh", { valueAsNumber: true })}
                  className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                  Target System
                </label>
                <select
                  {...register("recommendedInverter")}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-muted/30 text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="1.5 kVA Hybrid">1.5 kVA Hybrid</option>
                  <option value="2.5 kVA Hybrid">2.5 kVA Hybrid</option>
                  <option value="3.5 kVA Hybrid">3.5 kVA Hybrid</option>
                  <option value="5.0 kVA Hybrid">5.0 kVA Hybrid</option>
                  <option value="7.5 kVA Hybrid">7.5 kVA Hybrid</option>
                  <option value="10.0 kVA Hybrid">10.0 kVA Hybrid</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block select-none">
                Estimated Budget (₦)
              </label>
              <Input
                type="number"
                placeholder="2500000"
                {...register("estimatedPrice", { valueAsNumber: true })}
                className="bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary font-bold text-primary"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
              className="text-muted-foreground hover:text-foreground text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-sm cursor-pointer"
            >
              Save Lead
            </Button>
          </div>
        </form>
      </AppModal>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-foreground">
              Delete Quote Request
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to delete lead <b>{activeQuote?.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotesTable;
