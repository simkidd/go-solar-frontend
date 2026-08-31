import PageHeader from "@/components/PageHeader";
import { Metadata } from "next";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore over 500 completed solar installations across Nigeria — from small residential backup systems to large commercial solar farms.",
};

const ProjectsPage = () => {
  return (
    <div className="w-full font-inter bg-white dark:bg-zinc-950 overflow-hidden">
      {/* ── Page Hero ────────────────────────────────────────────────── */}
      <PageHeader
        badge="Our Work"
        heading="Project Portfolio"
        subtitle="Over 500 completed installations across Nigeria — from small residential backup systems to large commercial solar farms."
        image="/images/bg/about-us.jpg"
        minHeight="min-h-[360px]"
        align="left"
      />

      {/* ── Client Interactive Projects List & Filters ───────────────── */}
      <ProjectsPageClient />
    </div>
  );
};

export default ProjectsPage;
