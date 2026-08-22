"use client";
import { formatCurrency } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppModal from "@/components/AppModal";
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
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { usePackagesQuery } from "@/hooks/queries/usePackagesQuery";
import { useDeletePackageMutation } from "@/hooks/mutations/usePackageMutations";
import CreatePackageForm from "./CreatePackageForm";
import UpdatePackageForm from "./UpdatePackageForm";
import { SolarPackage } from "@/interfaces/package.interface";

const columns = [
  { name: "Package Name", uid: "name" },
  { name: "Capacity & Sizing", uid: "capacity" },
  { name: "Battery Bank", uid: "battery" },
  { name: "Components", uid: "components" },
  { name: "Bundle Price", uid: "price" },
  { name: "Actions", uid: "actions" },
];

const inverterOptions = ["All", "1.5 kVA", "2.5 kVA", "3.5 kVA", "5 kVA", "7.5 kVA", "10 kVA"];
const batteryOptions = ["All", "Lithium", "Tubular", "AGM", "Gel"];

export const PackagesTable = () => {
  const { data: packages = [], isLoading, error, refetch } = usePackagesQuery();
  const deleteMutation = useDeletePackageMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInverter, setSelectedInverter] = useState("All");
  const [selectedBatteryType, setSelectedBatteryType] = useState("All");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activePackage, setActivePackage] = useState<SolarPackage | null>(null);

  const filteredPackages = useMemo(() => {
    return (packages as SolarPackage[]).filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInverter =
        selectedInverter === "All" ||
        `${pkg.capacityKva} kVA` === selectedInverter;
      const matchesBattery =
        selectedBatteryType === "All" || pkg.batteryType === selectedBatteryType;
      return matchesSearch && matchesInverter && matchesBattery;
    });
  }, [packages, searchTerm, selectedInverter, selectedBatteryType]);

  const handleDelete = () => {
    if (!activePackage) return;
    deleteMutation.mutate(activePackage._id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  const hasFilters =
    !!searchTerm || selectedInverter !== "All" || selectedBatteryType !== "All";

  const onResetFilters = () => {
    setSearchTerm("");
    setSelectedInverter("All");
    setSelectedBatteryType("All");
  };

  if (error) {
    return (
      <div className="text-center py-12 text-rose-500 font-bold text-sm">
        Failed to fetch packages from the database. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 font-inter">

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[420px] bg-card border border-border/80 rounded-2xl select-none">
          <DialogHeader>
            <DialogTitle className="text-foreground font-extrabold text-base">
              Delete Package
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed font-semibold">
              Are you sure you want to remove <b>{activePackage?.name}</b>? This
              bundle will no longer appear on the customer package catalog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs font-semibold rounded-xl cursor-pointer text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="text-xs font-semibold rounded-xl cursor-pointer"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Breakdown Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border border-border/80 rounded-2xl font-inter">
          <DialogHeader>
            <DialogTitle className="text-foreground font-extrabold text-base">
              {activePackage?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1 font-semibold">
              Constituent equipment included in this hybrid solar package
            </DialogDescription>
          </DialogHeader>

          {activePackage && (
            <div className="space-y-4 py-2">
              <div className="bg-muted/30 p-4 rounded-xl border border-border/60">
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                  {activePackage.description}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>
                    Battery:{" "}
                    <b className="text-foreground">
                      {activePackage.batteryKwh} kWh ({activePackage.batteryType})
                    </b>
                  </span>
                  <span>
                    Solar:{" "}
                    <b className="text-foreground">{activePackage.pvKwp * 1000} W</b>
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Equipment List
                </p>
                <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden">
                  {activePackage.constituents?.map((comp) => {
                    const prod = comp.product;
                    if (!prod) return null;
                    return (
                      <div
                        key={prod._id}
                        className="p-3 flex items-center justify-between bg-card hover:bg-muted/15 transition-colors"
                      >
                        <div>
                          <p className="font-extrabold text-foreground text-xs">{prod.name}</p>
                          <p className="text-[10px] text-muted-foreground font-semibold">
                            {prod.brand} • Qty: {comp.qty}
                          </p>
                        </div>
                        <p className="font-bold text-xs text-foreground">
                          {formatCurrency(prod.price * comp.qty, "NGN")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/60">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Bundle Price
                </span>
                <span className="text-lg font-extrabold text-primary">
                  {formatCurrency(activePackage.price, "NGN")}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsViewOpen(false)}
              className="text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Package Modal */}
      <AppModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="New Solar Package"
        isDismissable={false}
        hideCloseButton
        size="5xl"
        scrollBehavior="inside"
      >
        <CreatePackageForm onClose={() => setIsCreateOpen(false)} />
      </AppModal>

      {/* Edit Package Modal */}
      <AppModal
        isOpen={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setActivePackage(null);
        }}
        title={`Edit — ${activePackage?.name ?? "Package"}`}
        isDismissable={false}
        hideCloseButton
        size="5xl"
        scrollBehavior="inside"
      >
        {activePackage && (
          <UpdatePackageForm
            initialData={activePackage}
            onClose={() => setIsEditOpen(false)}
          />
        )}
      </AppModal>

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <Layers className="h-5 w-5 text-primary" />
            Solar Packages
          </h2>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">
            Manage pre-sized hybrid bundles offered on the customer storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 border-border text-muted-foreground hover:text-foreground h-9 rounded-xl text-xs font-semibold cursor-pointer hover:bg-muted/30"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Package
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-card text-card-foreground p-5 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/30 border-border rounded-xl text-xs h-10 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasFilters && (
              <Button
                variant="ghost"
                onClick={onResetFilters}
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset
              </Button>
            )}

            {/* Inverter Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border text-xs font-semibold rounded-xl h-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  {selectedInverter === "All" ? "All Capacities" : selectedInverter}
                  <svg className="ml-2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 overflow-y-auto w-44 rounded-xl bg-card border border-border/80">
                {inverterOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setSelectedInverter(opt)}
                    className="cursor-pointer text-xs font-bold"
                  >
                    {opt === "All" ? "All Capacities" : opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Battery Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border text-xs font-semibold rounded-xl h-10 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  {selectedBatteryType === "All" ? "All Battery Types" : selectedBatteryType}
                  <svg className="ml-2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44 rounded-xl bg-card border border-border/80">
                {batteryOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setSelectedBatteryType(opt)}
                    className="cursor-pointer text-xs font-bold"
                  >
                    {opt === "All" ? "All Battery Types" : opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Counter */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/60 pt-3 select-none font-bold uppercase tracking-wider">
          <span>Total {filteredPackages.length} packages listed</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/80">
              {columns.map((col) => (
                <TableHead
                  key={col.uid}
                  className={`font-black text-[9px] uppercase tracking-widest text-muted-foreground h-12 select-none ${
                    col.uid === "actions" || col.uid === "price" ? "text-right" : ""
                  }`}
                >
                  {col.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="space-y-3 flex flex-col justify-center items-center py-8">
                    <Skeleton className="h-5 w-4/5 rounded-md" />
                    <Skeleton className="h-5 w-3/5 rounded-md" />
                    <Skeleton className="h-5 w-4/5 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPackages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs text-muted-foreground font-semibold"
                >
                  No packages found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredPackages.map((pkg) => (
                <TableRow
                  key={pkg._id}
                  className="border-b border-border/60 hover:bg-muted/15 transition-colors"
                >
                  {/* Package Name */}
                  <TableCell className="py-3.5 text-xs text-foreground max-w-xs">
                    <div className="space-y-1">
                      <span className="font-extrabold text-foreground block">{pkg.name}</span>
                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground">
                        <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">
                          {pkg.capacityKva} kVA
                        </span>
                        <span className="text-muted-foreground/50 truncate max-w-[180px] normal-case font-semibold tracking-normal">
                          {pkg.tagline}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 2. Capacity & Sizing */}
                  <TableCell className="py-3.5 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                        <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>{pkg.pvKwp * 1000}W Solar Array</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                        <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{pkg.batteryKwh} kWh Capacity</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 3. Battery Chemistry */}
                  <TableCell className="py-3.5 text-xs select-none">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border ${
                        pkg.batteryType === "Lithium"
                          ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
                          : pkg.batteryType === "Tubular"
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                          : "bg-muted text-muted-foreground border-border/80"
                      }`}
                    >
                      <Battery className="h-3 w-3" />
                      {pkg.batteryType}
                    </span>
                  </TableCell>

                  {/* 4. Components */}
                  <TableCell className="py-3.5 text-xs select-none">
                    <button
                      onClick={() => {
                        setActivePackage(pkg);
                        setIsViewOpen(true);
                      }}
                      className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 underline underline-offset-2 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {pkg.constituents?.length || 0} items
                    </button>
                  </TableCell>

                  {/* 5. Price */}
                  <TableCell className="py-3.5 text-xs font-bold text-foreground monospace select-all text-right">
                    {formatCurrency(pkg.price, "NGN")}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 text-xs select-none">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl bg-card border border-border/80">
                          <DropdownMenuItem asChild className="cursor-pointer text-xs font-bold">
                            <Link
                              href={`/packages/${pkg.slug}`}
                              target="_blank"
                              className="flex items-center"
                            >
                              <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>Preview Store</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setActivePackage(pkg);
                              setIsViewOpen(true);
                            }}
                            className="cursor-pointer text-xs font-bold"
                          >
                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>View Specs</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setActivePackage(pkg);
                              setIsEditOpen(true);
                            }}
                            className="cursor-pointer text-xs font-bold"
                          >
                            <Pencil className="mr-2 h-4 w-4 text-primary" />
                            <span>Edit Package</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setActivePackage(pkg);
                              setIsDeleteOpen(true);
                            }}
                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 text-xs font-bold"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PackagesTable;
