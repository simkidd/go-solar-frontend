"use client";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";

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
  status: "New Lead" | "Contacted" | "Quote Sent" | "Site Inspected" | "Won" | "Declined";
  source: "Energy Calculator" | "Contact Form" | "Phone Inquiry";
  createdAt: string;
  appliances: { name: string; qty: number; watts: number; hours: number }[];
  notes?: string;
}

const INITIAL_QUOTES: QuoteLead[] = [
  {
    id: "lead-101",
    name: "Dr. Emmanuel Okoro",
    email: "e.okoro@medhaven.ng",
    phone: "+234 803 456 7890",
    location: "Port Harcourt, Rivers State",
    dailyKwh: 14.8,
    peakWatts: 3800,
    recommendedInverter: "5.0 kVA Hybrid",
    recommendedBatteryKwh: 10.0,
    recommendedSolarWatts: 3200,
    estimatedPrice: 3850000,
    status: "New Lead",
    source: "Energy Calculator",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    appliances: [
      { name: "Inverter AC (1.5HP)", qty: 2, watts: 1100, hours: 6 },
      { name: "Double Door Refrigerator", qty: 1, watts: 250, hours: 24 },
      { name: "Ceiling Fans", qty: 6, watts: 70, hours: 12 },
      { name: "LED Bulbs", qty: 15, watts: 12, hours: 10 },
      { name: "Smart TVs (55 inch)", qty: 2, watts: 120, hours: 8 },
    ],
  },
  {
    id: "lead-102",
    name: "Amina Bello",
    email: "amina.bello@techpoint.io",
    phone: "+234 812 998 3344",
    location: "Lekki Phase 1, Lagos",
    dailyKwh: 24.5,
    peakWatts: 6200,
    recommendedInverter: "7.5 kVA Hybrid",
    recommendedBatteryKwh: 15.0,
    recommendedSolarWatts: 4800,
    estimatedPrice: 5600000,
    status: "Contacted",
    source: "Energy Calculator",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    appliances: [
      { name: "Inverter ACs (2.0HP)", qty: 3, watts: 1500, hours: 8 },
      { name: "Deep Freezer", qty: 1, watts: 300, hours: 24 },
      { name: "Water Pumping Machine", qty: 1, watts: 1200, hours: 1.5 },
      { name: "Office Workstations", qty: 5, watts: 150, hours: 9 },
    ],
  },
  {
    id: "lead-103",
    name: "Engr. Tunde Adeleke",
    email: "tunde@adeleke-logistics.com",
    phone: "+234 905 112 4455",
    location: "Ikeja, Lagos",
    dailyKwh: 8.2,
    peakWatts: 2100,
    recommendedInverter: "3.5 kVA Hybrid",
    recommendedBatteryKwh: 5.0,
    recommendedSolarWatts: 1600,
    estimatedPrice: 2250000,
    status: "Quote Sent",
    source: "Contact Form",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    appliances: [
      { name: "Standing Fans", qty: 4, watts: 65, hours: 10 },
      { name: "Refrigerator", qty: 1, watts: 200, hours: 24 },
      { name: "LED Lighting", qty: 10, watts: 15, hours: 8 },
      { name: "Laptops & Router", qty: 3, watts: 80, hours: 12 },
    ],
  },
  {
    id: "lead-104",
    name: "Chief Victor Nwosu",
    email: "victor.nwosu@transcorp.ng",
    phone: "+234 802 334 5566",
    location: "New Owerri, Imo State",
    dailyKwh: 36.0,
    peakWatts: 9500,
    recommendedInverter: "10.0 kVA Hybrid",
    recommendedBatteryKwh: 20.0,
    recommendedSolarWatts: 7200,
    estimatedPrice: 8400000,
    status: "Site Inspected",
    source: "Phone Inquiry",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    appliances: [
      { name: "Central AC System", qty: 1, watts: 4500, hours: 10 },
      { name: "Deep Freezers", qty: 2, watts: 350, hours: 24 },
      { name: "Borehole Pump", qty: 1, watts: 2200, hours: 2 },
      { name: "Full House Lighting & Security Cameras", qty: 1, watts: 600, hours: 24 },
    ],
  },
];

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
  const [quotes, setQuotes] = useState<QuoteLead[]>(INITIAL_QUOTES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states
  const [activeQuote, setActiveQuote] = useState<QuoteLead | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form for manual quote
  const [manualForm, setManualForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Port Harcourt",
    dailyKwh: 10,
    peakWatts: 3000,
    recommendedInverter: "3.5 kVA Hybrid",
    estimatedPrice: 2400000,
    source: "Phone Inquiry" as const,
  });

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
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
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
    toast.success(`Lead status updated to ${newStatus}`);
  };

  const handleDelete = () => {
    if (!activeQuote) return;
    setQuotes((prev) => prev.filter((q) => q.id !== activeQuote.id));
    setIsDeleteOpen(false);
    toast.success("Quote request removed");
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.phone) {
      toast.error("Please provide customer name and phone");
      return;
    }

    const newLead: QuoteLead = {
      id: `lead-${Date.now()}`,
      name: manualForm.name,
      email: manualForm.email || "customer@gosolar.ng",
      phone: manualForm.phone,
      location: manualForm.location,
      dailyKwh: Number(manualForm.dailyKwh),
      peakWatts: Number(manualForm.peakWatts),
      recommendedInverter: manualForm.recommendedInverter,
      recommendedBatteryKwh: Number((manualForm.dailyKwh * 0.7).toFixed(1)),
      recommendedSolarWatts: Number((manualForm.dailyKwh * 250).toFixed(0)),
      estimatedPrice: Number(manualForm.estimatedPrice),
      status: "New Lead",
      source: manualForm.source,
      createdAt: new Date().toISOString(),
      appliances: [
        { name: "General Lighting & Fans", qty: 10, watts: 80, hours: 12 },
        { name: "Refrigeration Unit", qty: 1, watts: 250, hours: 24 },
      ],
    };

    setQuotes((prev) => [newLead, ...prev]);
    setIsCreateOpen(false);
    toast.success("New quote lead logged!");
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Installation Quotes & Sizing Leads
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Track customer energy calculator submissions and commercial site inspection requests.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Log Manual Lead
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search leads by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-400">Pipeline Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none"
          >
            <option value="All">All Statuses ({quotes.length})</option>
            <option value="New Lead">New Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Quote Sent">Quote Sent</option>
            <option value="Site Inspected">Site Inspected</option>
            <option value="Won">Won / Closed</option>
            <option value="Declined">Declined</option>
          </select>

          {(searchTerm || statusFilter !== "All") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
              className="text-xs text-red-500 hover:text-red-600 h-9"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
            <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
              <TableHead className="font-semibold text-zinc-500 h-10 px-4">Client & Contact</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Energy Req</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Recommended System</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-right">Est. Budget</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-center">Pipeline Status</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-right px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-sm text-zinc-400">
                  No quote requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((lead) => (
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
                      <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 border-primary/30 text-primary bg-primary/5">
                        {lead.recommendedInverter}
                      </Badge>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {lead.recommendedBatteryKwh}kWh Battery • {lead.recommendedSolarWatts}W PV
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
                        <button className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-opacity ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-40 text-xs">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, "New Lead")}>
                          New Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, "Contacted")}>
                          Contacted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, "Quote Sent")}>
                          Quote Sent
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, "Site Inspected")}>
                          Site Inspected
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, "Won")}>
                          Won / Closed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(lead.id, "Declined")}>
                          Declined
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setActiveQuote(lead);
                          setIsViewOpen(true);
                        }}
                        className="h-8 w-8 text-zinc-500 hover:text-primary rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setActiveQuote(lead);
                          setIsDeleteOpen(true);
                        }}
                        className="h-8 w-8 text-zinc-500 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* VIEW SIZING AUDIT MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              Sizing & Energy Audit Details
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Submitted customer requirements for {activeQuote?.name}
            </DialogDescription>
          </DialogHeader>

          {activeQuote && (
            <div className="space-y-4 py-2 text-sm">
              {/* Contact card */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-400">Phone:</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{activeQuote.phone}</p>
                </div>
                <div>
                  <span className="text-zinc-400">Email:</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{activeQuote.email}</p>
                </div>
                <div>
                  <span className="text-zinc-400">Location:</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{activeQuote.location}</p>
                </div>
                <div>
                  <span className="text-zinc-400">Submission Date:</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{formatDate(activeQuote.createdAt)}</p>
                </div>
              </div>

              {/* Sizing summary */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/20 text-center">
                  <p className="text-[10px] uppercase font-bold text-primary">Inverter</p>
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white mt-0.5">{activeQuote.recommendedInverter}</p>
                </div>
                <div className="p-2.5 bg-teal-50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-900/40 text-center">
                  <p className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400">Battery Bank</p>
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white mt-0.5">{activeQuote.recommendedBatteryKwh} kWh</p>
                </div>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 text-center">
                  <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Solar PV</p>
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white mt-0.5">{activeQuote.recommendedSolarWatts} W</p>
                </div>
              </div>

              {/* Appliance Audit List */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Customer Appliance Load Profile
                </p>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                  {activeQuote.appliances.map((app, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between bg-white dark:bg-[#1a1b1e]">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{app.name}</p>
                        <p className="text-[10px] text-zinc-400">Qty: {app.qty} • {app.watts} Watts each</p>
                      </div>
                      <span className="text-zinc-600 dark:text-zinc-300 font-bold">
                        {app.hours} hrs/day
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MANUAL LEAD MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              Log Walk-in / Phone Quote Lead
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Record a new customer solar requirement.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveManual} className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Customer Name</label>
              <Input
                placeholder="e.g. Chief Kingsley Obi"
                value={manualForm.name}
                onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Phone</label>
                <Input
                  placeholder="+234 800 000 0000"
                  value={manualForm.phone}
                  onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Location</label>
                <Input
                  placeholder="e.g. Port Harcourt"
                  value={manualForm.location}
                  onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Daily kWh</label>
                <Input
                  type="number"
                  placeholder="12"
                  value={manualForm.dailyKwh}
                  onChange={(e) => setManualForm({ ...manualForm, dailyKwh: Number(e.target.value) })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Target System</label>
                <select
                  value={manualForm.recommendedInverter}
                  onChange={(e) => setManualForm({ ...manualForm, recommendedInverter: e.target.value })}
                  className="w-full h-9 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 text-xs"
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
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Estimated Budget (₦)</label>
              <Input
                type="number"
                placeholder="2500000"
                value={manualForm.estimatedPrice}
                onChange={(e) => setManualForm({ ...manualForm, estimatedPrice: Number(e.target.value) })}
                className="h-9 text-xs font-bold text-primary"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold">
                Save Lead
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-white">
              Delete Quote Request
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2">
              Are you sure you want to delete lead <b>{activeQuote?.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(false)}>
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
