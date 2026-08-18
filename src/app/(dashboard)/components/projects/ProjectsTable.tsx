"use client";
import { PROJECT_ITEMS } from "@/data/projectData";
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
  Briefcase,
  MapPin,
  Calendar,
  Zap,
  Sun,
  Battery,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";

export interface ProjectItem {
  id: string;
  title: string;
  desc: string;
  location: string;
  date: string;
  image: string;
  specs: { inverter: string; pv: string; battery: string };
  highlights: string[];
  powers: string[];
}

export const ProjectsTable = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECT_ITEMS);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<ProjectItem>>({
    title: "",
    location: "Port Harcourt",
    date: "August 2026",
    image: "/images/bg/hero-bg.jpg",
    desc: "",
    specs: { inverter: "5 kVA", pv: "5 kWp", battery: "10 kWh" },
    highlights: ["24/7 uninterrupted solar power", "Cut generator runtime by 80%"],
    powers: ["1 Refrigerator", "6 Fans", "12 Bulbs", "2 TVs"],
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const query = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.specs.inverter.toLowerCase().includes(query)
      );
    });
  }, [projects, searchTerm]);

  const handleOpenCreate = () => {
    setFormData({
      title: "",
      location: "Port Harcourt",
      date: "August 2026",
      image: "/images/bg/hero-bg.jpg",
      desc: "Complete hybrid solar installation designed for reliable power backup.",
      specs: { inverter: "5 kVA", pv: "6 kWp", battery: "10 kWh" },
      highlights: ["24/7 continuous electricity", "Seamless automated changeover", "Smart lithium battery management"],
      powers: ["1 Refrigerator / Deep Freezer", "8 Ceiling Fans", "15 LED Bulbs", "3 TVs", "Water Pump"],
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (p: ProjectItem) => {
    setActiveProject(p);
    setFormData({ ...p });
    setIsEditOpen(true);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      toast.error("Please provide project title and location");
      return;
    }

    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: formData.title || "Solar Installation Project",
      desc: formData.desc || "Professional turnkey solar installation by GoSolar Nigeria.",
      location: formData.location || "Port Harcourt, Rivers State",
      date: formData.date || "August 2026",
      image: formData.image || "/images/bg/hero-bg.jpg",
      specs: formData.specs || { inverter: "5 kVA", pv: "6 kWp", battery: "10 kWh" },
      highlights: formData.highlights || ["24/7 uninterrupted power"],
      powers: formData.powers || ["Essential household appliances"],
    };

    setProjects((prev) => [newProj, ...prev]);
    setIsCreateOpen(false);
    toast.success("Project showcase created!");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;

    setProjects((prev) =>
      prev.map((item) =>
        item.id === activeProject.id ? ({ ...item, ...formData } as ProjectItem) : item
      )
    );
    setIsEditOpen(false);
    toast.success("Project updated!");
  };

  const handleDelete = () => {
    if (!activeProject) return;
    setProjects((prev) => prev.filter((p) => p.id !== activeProject.id));
    setIsDeleteOpen(false);
    toast.success(`Removed ${activeProject.title}`);
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Installation Projects & Case Studies
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage completed residential & commercial installations shown on the public projects portfolio.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 rounded-lg gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Completed Project
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#1a1b1e] p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search projects by title, location, capacity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 rounded-lg"
          />
        </div>

        <div className="text-xs text-zinc-400 font-medium">
          Showing {filteredProjects.length} completed installations
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-[#1a1b1e] rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/20">
            <TableRow className="border-b border-zinc-100 dark:border-zinc-800">
              <TableHead className="font-semibold text-zinc-500 h-10 px-4">Project & Location</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">System Sizing Specs</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Completion Date</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10">Highlights & Proof</TableHead>
              <TableHead className="font-semibold text-zinc-500 h-10 text-right px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-sm text-zinc-400">
                  No projects matched your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((proj) => (
                <TableRow
                  key={proj.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                >
                  {/* Title & Location */}
                  <TableCell className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">
                        {proj.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                        <span>{proj.location}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* System Sizing Specs */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 border-primary/30 text-primary bg-primary/5">
                          {proj.specs.inverter}
                        </Badge>
                        <span className="text-xs text-zinc-600 dark:text-zinc-300 font-semibold">
                          {proj.specs.pv} PV • {proj.specs.battery} Battery
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Completion Date */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{proj.date}</span>
                    </div>
                  </TableCell>

                  {/* Highlights Count */}
                  <TableCell>
                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        setIsViewOpen(true);
                      }}
                      className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-primary transition-colors flex items-center gap-1 underline underline-offset-2"
                    >
                      {proj.highlights?.length || 4} case study points
                      <Eye className="h-3.5 w-3.5 text-zinc-400" />
                    </button>
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
                          <Link href={`/projects/${proj.id}`} target="_blank" className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <span>Preview Public Page</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveProject(proj);
                            setIsViewOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          <span>View Case Study</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(proj)} className="cursor-pointer">
                          <Pencil className="h-4 w-4 mr-2 text-primary" />
                          <span>Edit Project</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setActiveProject(proj);
                            setIsDeleteOpen(true);
                          }}
                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>Delete Project</span>
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

      {/* VIEW CASE STUDY MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              {activeProject?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              {activeProject?.location} • Completed {activeProject?.date}
            </DialogDescription>
          </DialogHeader>

          {activeProject && (
            <div className="space-y-4 py-2 text-sm">
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 text-xs">
                <p className="font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {activeProject.desc}
                </p>
                <div className="flex gap-4 mt-2 font-bold text-primary">
                  <span>Inverter: {activeProject.specs.inverter}</span>
                  <span>Solar PV: {activeProject.specs.pv}</span>
                  <span>Battery: {activeProject.specs.battery}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Installation Highlights
                </p>
                <ul className="space-y-1 text-xs">
                  {activeProject.highlights.map((hl, i) => (
                    <li key={i} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Powered Appliances */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Supported Customer Load
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.powers.map((pwr, i) => (
                    <Badge key={i} variant="secondary" className="text-[11px] py-0.5">
                      {pwr}
                    </Badge>
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

      {/* CREATE / EDIT MODAL */}
      <Dialog
        open={isCreateOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setIsEditOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-md bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              {isCreateOpen ? "Add Completed Project" : `Edit ${activeProject?.title}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Showcase solar installation details and social proof.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={isCreateOpen ? handleSaveCreate : handleSaveEdit} className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Project Title</label>
              <Input
                placeholder="e.g. 5kVA Residential Duplex Solar"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Location</label>
                <Input
                  placeholder="e.g. Port Harcourt - GRA"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Date Completed</label>
                <Input
                  placeholder="e.g. August 2026"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Inverter</label>
                <Input
                  placeholder="5 kVA"
                  value={formData.specs?.inverter || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, inverter: e.target.value },
                    })
                  }
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Solar PV</label>
                <Input
                  placeholder="6 kWp"
                  value={formData.specs?.pv || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, pv: e.target.value },
                    })
                  }
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Battery</label>
                <Input
                  placeholder="10 kWh"
                  value={formData.specs?.battery || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, battery: e.target.value },
                    })
                  }
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
              <textarea
                rows={2}
                placeholder="Brief summary of client requirements and system performance."
                value={formData.desc || ""}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
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
                {isCreateOpen ? "Create Project" : "Save Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm bg-white dark:bg-[#1a1b1e] border-zinc-100 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-white">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-2">
              Are you sure you want to remove <b>{activeProject?.title}</b>?
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

export default ProjectsTable;
