"use client";
import { PACKAGES_DATA, PackageData, PackageComponent } from "@/data/packages";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Layers,
  Battery,
  Sun,
  Zap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";

export const PackagesTable = () => {
  const [packages, setPackages] = useState<PackageData[]>(PACKAGES_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInverter, setSelectedInverter] = useState("All");
  const [selectedBatteryType, setSelectedBatteryType] = useState("All");

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activePackage, setActivePackage] = useState<PackageData | null>(null);

  // Form State for Create / Edit
  const [formData, setFormData] = useState<Partial<PackageData>>({
    name: "",
    inverterRange: "3.5 kVA",
    desc: "",
    spec: "",
    price: 1500000,
    slug: "",
    batteryCapacityWh: 3000,
    solarPanelWatts: 1200,
    batteryType: "Lithium",
    constituents: [],
  });

  // Filtered packages list
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.inverterRange.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesInverter =
        selectedInverter === "All" || pkg.inverterRange === selectedInverter;

      const matchesBattery =
        selectedBatteryType === "All" || pkg.batteryType === selectedBatteryType;

      return matchesSearch && matchesInverter && matchesBattery;
    });
  }, [packages, searchTerm, selectedInverter, selectedBatteryType]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      inverterRange: "3.5 kVA",
      desc: "",
      spec: "",
      price: 2000000,
      slug: "",
      batteryCapacityWh: 4800,
      solarPanelWatts: 1600,
      batteryType: "Lithium",
      constituents: [
        {
          id: "comp-inv-custom",
          name: "3.5kVA Pure Sine Hybrid Inverter",
          qty: 1,
          price: 550000,
          slug: "inverter-35kva",
          categoryName: "Inverters",
          categorySlug: "inverters",
          imageUrl: "/images/products/inverter.png",
        },
        {
          id: "comp-bat-custom",
          name: "4.8kWh Lithium Battery Bank (48V 100Ah)",
          qty: 1,
          price: 1200000,
          slug: "battery-48kwh",
          categoryName: "Batteries",
          categorySlug: "batteries",
          imageUrl: "/images/products/battery.png",
        },
        {
          id: "comp-pan-custom",
          name: "400W Mono Solar Panels",
          qty: 4,
          price: 125000,
          slug: "panels-400w",
          categoryName: "Solar Panels",
          categorySlug: "solar-panels",
          imageUrl: "/images/products/panels.png",
        },
      ],
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (pkg: PackageData) => {
    setActivePackage(pkg);
    setFormData({ ...pkg });
    setIsEditOpen(true);
  };

  const handleOpenView = (pkg: PackageData) => {
    setActivePackage(pkg);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (pkg: PackageData) => {
    setActivePackage(pkg);
    setIsDeleteOpen(true);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in the package title and price");
      return;
    }

    const newPkg: PackageData = {
      id: `pkg-${Date.now()}`,
      name: formData.name || "New Solar Package",
      inverterRange: formData.inverterRange || "3.5 kVA",
      desc: formData.desc || "High efficiency complete solar installation bundle.",
      spec: formData.spec || `${formData.inverterRange} Inverter + ${formData.batteryCapacityWh}Wh Battery`,
      price: Number(formData.price) || 1000000,
      slug:
        formData.slug ||
        formData.name?.toLowerCase().replace(/\s+/g, "-") ||
        `package-${Date.now()}`,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400",
      constituents: formData.constituents || [],
      batteryCapacityWh: Number(formData.batteryCapacityWh) || 3000,
      solarPanelWatts: Number(formData.solarPanelWatts) || 1200,
      batteryType: formData.batteryType || "Lithium",
    };

    setPackages((prev) => [newPkg, ...prev]);
    setIsCreateOpen(false);
    toast.success("Solar package created successfully!");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePackage) return;

    setPackages((prev) =>
      prev.map((item) =>
        item.id === activePackage.id ? ({ ...item, ...formData } as PackageData) : item
      )
    );
    setIsEditOpen(false);
    toast.success("Solar package updated!");
  };

  const handleDelete = () => {
    if (!activePackage) return;
    setPackages((prev) => prev.filter((p) => p.id !== activePackage.id));
    setIsDeleteOpen(false);
    toast.success(`Deleted ${activePackage.name}`);
  };

  const inverterOptions = ["All", "1.5 kVA", "2.5 kVA", "3.5 kVA", "5 kVA", "7.5 kVA", "10 kVA"];
  const batteryOptions = ["All", "Lithium", "AGM"];

  return (
    <div className="space-y-6 font-inter">
      {/* Top Action & KPI Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Solar Packages Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage pre-sized hybrid bundles offered on the customer store.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create New Package
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search solar packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Inverter Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-400">Inverter:</span>
            <select
              value={selectedInverter}
              onChange={(e) => setSelectedInverter(e.target.value)}
              className="h-9 px-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none"
            >
              {inverterOptions.map((opt) => (
                <option key={opt} value={opt} className="dark:bg-[#1a1b1e]">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Battery Chemistry Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-400">Battery:</span>
            <select
              value={selectedBatteryType}
              onChange={(e) => setSelectedBatteryType(e.target.value)}
              className="h-9 px-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none"
            >
              {batteryOptions.map((opt) => (
                <option key={opt} value={opt} className="dark:bg-[#1a1b1e]">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedInverter !== "All" || selectedBatteryType !== "All") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedInverter("All");
                setSelectedBatteryType("All");
              }}
              className="text-xs text-red-500 hover:text-red-600 h-9"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
            <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
              <TableHead className="font-semibold text-zinc-500 h-10 px-4">Package Name</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Capacity & Sizing</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Battery Bank</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Components</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-right">Bundle Price</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-right px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-sm text-zinc-400">
                  No packages matched your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredPackages.map((pkg) => (
                <TableRow
                  key={pkg.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                >
                  {/* Name and Range Badge */}
                  <TableCell className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">
                        {pkg.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 border-primary/30 text-primary bg-primary/5">
                          {pkg.inverterRange} Inverter
                        </Badge>
                        <span className="text-zinc-400 text-xs truncate max-w-[200px] hidden md:inline">
                          {pkg.spec}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Sizing (PV + Usable Wh) */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                        <Sun className="h-3.5 w-3.5 text-amber-500" />
                        <span>{pkg.solarPanelWatts}W Solar Array</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        <span>{(pkg.batteryCapacityWh / 1000).toFixed(1)} kWh Capacity</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Battery Chemistry */}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-semibold gap-1 ${
                        pkg.batteryType === "Lithium"
                          ? "bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900/40"
                          : "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/40"
                      }`}
                    >
                      <Battery className="h-3 w-3" />
                      {pkg.batteryType} Battery
                    </Badge>
                  </TableCell>

                  {/* Components Count */}
                  <TableCell>
                    <button
                      onClick={() => handleOpenView(pkg)}
                      className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors flex items-center gap-1 underline underline-offset-2"
                    >
                      {pkg.constituents?.length || 3} equipment items
                      <Eye className="h-3.5 w-3.5 text-zinc-400" />
                    </button>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-right font-extrabold text-zinc-900 dark:text-white text-sm">
                    {formatCurrency(pkg.price, "NGN")}
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="text-right px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreVertical className="h-4 w-4 text-zinc-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/package/${pkg.slug}`} target="_blank" className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <span>Preview Store</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenView(pkg)} className="cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          <span>View Setup Specs</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(pkg)} className="cursor-pointer">
                          <Pencil className="h-4 w-4 mr-2 text-primary" />
                          <span>Edit Package</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleOpenDelete(pkg)}
                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>Delete Package</span>
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

      {/* VIEW BREAKDOWN MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              {activePackage?.name} Breakdown
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Constituent equipment included in this hybrid solar package.
            </DialogDescription>
          </DialogHeader>

          {activePackage && (
            <div className="space-y-4 py-3 text-sm">
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {activePackage.desc}
                </p>
                <div className="flex gap-4 mt-2 text-xs text-zinc-500 font-medium">
                  <span>Battery: <b>{activePackage.batteryCapacityWh} Wh ({activePackage.batteryType})</b></span>
                  <span>Solar Array: <b>{activePackage.solarPanelWatts} W</b></span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Equipment List
                </p>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                  {activePackage.constituents?.map((comp) => (
                    <div key={comp.id} className="p-3 flex items-center justify-between bg-white dark:bg-[#1a1b1e]">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white text-xs">{comp.name}</p>
                        <p className="text-[10px] text-zinc-400">{comp.categoryName} • Qty: {comp.qty}</p>
                      </div>
                      <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                        {formatCurrency(comp.price * comp.qty, "NGN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-500">Total Bundle Price:</span>
                <span className="text-lg font-extrabold text-primary">
                  {formatCurrency(activePackage.price, "NGN")}
                </span>
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

      {/* CREATE & EDIT MODAL */}
      <Dialog
        open={isCreateOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setIsEditOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-xl bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              {isCreateOpen ? "Create Solar Package" : `Edit ${activePackage?.name}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Configure sizing parameters, pricing, and bundle equipment.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={isCreateOpen ? handleSaveCreate : handleSaveEdit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Package Title</label>
              <Input
                placeholder="e.g. GoSolar 5kVA Premium Setup"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Inverter Range</label>
                <select
                  value={formData.inverterRange || "3.5 kVA"}
                  onChange={(e) => setFormData({ ...formData, inverterRange: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 text-xs"
                >
                  <option value="1.5 kVA">1.5 kVA</option>
                  <option value="2.5 kVA">2.5 kVA</option>
                  <option value="3.5 kVA">3.5 kVA</option>
                  <option value="5 kVA">5 kVA</option>
                  <option value="7.5 kVA">7.5 kVA</option>
                  <option value="10 kVA">10 kVA</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Battery Chemistry</label>
                <select
                  value={formData.batteryType || "Lithium"}
                  onChange={(e) => setFormData({ ...formData, batteryType: e.target.value as "AGM" | "Lithium" })}
                  className="w-full h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 text-xs"
                >
                  <option value="Lithium">Lithium (LiFePO4)</option>
                  <option value="AGM">Tubular / AGM Deep Cycle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Battery Wh</label>
                <Input
                  type="number"
                  placeholder="e.g. 4800"
                  value={formData.batteryCapacityWh || ""}
                  onChange={(e) => setFormData({ ...formData, batteryCapacityWh: Number(e.target.value) })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Solar Array (Watts)</label>
                <Input
                  type="number"
                  placeholder="e.g. 1600"
                  value={formData.solarPanelWatts || ""}
                  onChange={(e) => setFormData({ ...formData, solarPanelWatts: Number(e.target.value) })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Price (₦)</label>
                <Input
                  type="number"
                  placeholder="e.g. 2400000"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                  className="h-9 text-xs font-bold text-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Package Description</label>
              <textarea
                rows={2}
                placeholder="Brief description of application and household appliances supported."
                value={formData.desc || ""}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold">
                {isCreateOpen ? "Create Package" : "Save Changes"}
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
              Delete Package
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2">
              Are you sure you want to remove <b>{activePackage?.name}</b>? This bundle will no longer appear on the customer package catalog.
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

export default PackagesTable;
